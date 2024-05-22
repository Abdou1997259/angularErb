import { HttpClient } from '@angular/common/http';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { dynamicform } from 'src/app/_model/dynamicForm';
import { DynamicFormsService } from 'src/app/_Services/dynamic-forms.service';

@Component({
  selector: 'app-master-form',
  templateUrl: './master-form.component.html',
  styleUrls: ['./master-form.component.css']
})
export class MasterFormComponent implements OnInit {

  dynamicFormArray : any;
  myForm: FormGroup;
  RowsCountArray:Array<number>=[];
  constructor(private http : HttpClient
    ,private activatedRoute: ActivatedRoute
    ,private toastr: ToastrService
    ,private dynamicFormService : DynamicFormsService, private fb : FormBuilder) {
    this.myForm = this.fb.group({

    });
    this.dynamicFormArray ={};



   }

   currentId : any=0;
   FormMode : number =1;
   key:any=0;
   details:any=[];
  ngOnInit(): void {

    
    this.currentId= this.activatedRoute.snapshot.paramMap.get('id');
     
    this.FormMode= this.activatedRoute.snapshot.paramMap.get('key')==null ? 1 : 2;
   this.key=this.activatedRoute.snapshot.paramMap.get('key');
   
   
      this.dynamicFormService.GetById(this.currentId).subscribe(data=>{
        this.dynamicFormArray=data;
        this.details = data.Details;
         console.log("Details " + this.details);
        if(this.FormMode==2){
          this.dynamicFormService.GetFormData(this.currentId,this.key).subscribe(data=>{ 
            console.log(data.Fields);
            this.CreateFormControl(data.Fields); 
          });
        }
        else
        {
          this.CreateFormControl(null); 
        } 
      });
     
   
  }

  GetRow(rowindex : number) {
    return this.dynamicFormArray.Fields.filter((item: { RowLocation: number; }) => item.RowLocation === rowindex);
  }
  
  CreateFormControl(data : any){
 
    //console.log(this.dynamicFormArray.Fields);
    this.dynamicFormArray.Fields.forEach((element: { RowLocation : number})  => { 
       
      if(!this.RowsCountArray.includes(element.RowLocation))
       this.RowsCountArray.push(element.RowLocation);
    });
 
     //console.log(this.RowsCountArray);

    this.dynamicFormArray.Fields.forEach((element: { ID: any ,IsRequired:boolean , 
      RequiredMessage : any  })  => { 
      let _val = ""
      let currentelement = element; 
      if(data !=null){
        data.forEach((element: { ID: any ,IsRequired:boolean , 
          RequiredMessage : any , Value : any})  => { 
          if(element.ID== currentelement.ID){
            _val = element.Value; 
          }
        }); 
      }
    
      //console.log(element.ID );
      if(element.IsRequired)
         this.myForm.addControl( element.ID , new FormControl(_val, Validators.required));
         else
         this.myForm.addControl( element.ID , new FormControl(_val) );
    });
   
  }


  Save(){
    console.log(this.myForm.value);

    var formData: any = new FormData();

    let _index=0;
    this.dynamicFormArray.Fields.forEach((element: { ID: any ,
      IsRequired:boolean , RequiredMessage : any,Value : any})  => { 
      formData.append("lst[" + _index + "].ID",element.ID);
      formData.append("lst[" + _index + "].Value", this.myForm.get(element.ID)?.value);
      _index++;
    });
 
    formData.append("TableName",this.dynamicFormArray.TableName);
    formData.append("KeyField",this.dynamicFormArray.KeyField); 
    formData.append("FormMode",this.FormMode);
    formData.append("procSave",this.dynamicFormArray.procSave);
    


    
    this.dynamicFormService.Save(formData).subscribe(data=>{

      if(data.status==1)
       this.toastr.success(this.dynamicFormArray.FormNamr, data.UserMessage);
       else
       this.toastr.warning(this.dynamicFormArray.FormNamr, data.UserMessage);
    });

  }

}
