import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierType } from 'src/app/Core/Api/AP/supplier-type.service';
import { SuppliercatService } from 'src/app/Core/Api/AP/suppliercat.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit {

  constructor(
    private fb:FormBuilder
   ,private dialogRef:MatDialog
   ,private http:HttpClient,
    private _SERVICE:SuppliercatService,
    private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService,


   private _router:Router
  ) {

    // FORM DEFIFNITION
    this.typesForm = this.fb.group({
      n_id: '',
      n_DataAreaID: '',
      s_name: ['',Validators.required],
      s_name_eng: '',
      s_notes:'',
      n_UserAdd:'',
      d_UserUpdateDate:'',
      n_UserUpdate:'',
      n_current_branch:'',
      n_current_company:'',
      d_UserAddDate:'',
      n_current_year:''
    });
    // END FORM DEFIFNTION


   }

  // END constructor

  // START VARIABLES DECLARTIONS
  showspinner= false;
  
 typesForm!: FormGroup ;
  DocNo!: any;
  accounts: any[]=[];
  isEnglish:boolean=false;
 
  Edit: boolean=false;
  Add: Boolean=true;
  @ViewChild("inputshow") inputshow!:ElementRef;
  DataAreaNo: any;
   // END VARIABLES DECLARTIONS


  //  START HOOKS METHODS
  ngOnInit(): void {
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.typesForm.get("n_id")?.patchValue(this.DocNo);
    //EXCUTE IN UPDATING MODE
   if(this.DocNo !=null && this.DocNo > 0 ){
    this.showspinner=true;
    this._SERVICE.GetByID(this.DocNo).subscribe(data=>{
      debugger
      // this.inputshow.nativeElement.style.display="block";
      this.typesForm.patchValue(data);
      // this.storeForm.patchValue({ s_employee_name: data["s_employee_name"]});
      this.Add=false;
      this.Edit=true;
      this.showspinner=false;
    });
 }



LangSwitcher.translateData(1);
LangSwitcher.translatefun();
this.isEnglish=LangSwitcher.CheckLan();
  }

  // END HOOKS METHODS


  // START FUNCTIONS
  disableButtons() {
    debugger;
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }
  
  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }
   save()
   {
    debugger
  if(this.typesForm.get("s_name")?.invalid)
  {
    this.showspinner=false;
    if(this.isEnglish)
    this._notification.ShowMessage('Please insert type name',3)
  else
    this._notification.ShowMessage("منفضلك  اسم النوع",3)
    return
  }


  


  debugger
  
  var formData: any = new FormData();
  formData.append("n_id",this.typesForm.value.n_id ?? 0);
  formData.append("s_name",this.typesForm.value.s_name)
  formData.append("s_name_eng",this.typesForm.value.s_name_eng)
  formData.append("s_notes",this.typesForm.value.s_notes)
  
  formData.append("n_DataAreaID",this.typesForm.value.n_DataAreaID)
  formData.append("n_UserUpdate",this.typesForm.value.n_UserUpdate)
  formData.append("d_UserAddDate",this.typesForm.value.d_UserAddDate)
  formData.append("n_UserAdd",this.typesForm.value.n_UserAdd)
  formData.append("d_UserUpdateDate",this.typesForm.value.d_UserUpdateDate)



  formData.append("n_current_branch",this.typesForm.value.n_current_branch)
  formData.append("n_current_company",this.typesForm.value.n_current_company)
  formData.append("n_current_year",this.typesForm.value.n_current_year)
  this.showspinner=true;
  this.disableButtons();
  if(this.DocNo != null && this. DocNo > 0)
  {
    this._SERVICE.Update(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status);
      else
  
      this._notification.ShowMessage(data.msg,data.status);
      if(data.status==1){


        this._router.navigate(['/ap/suppliercat']);
        this.typesForm = this.fb.group({
          n_id: '',
          n_DataAreaID: '',
          s_name: ['',Validators.required],
          s_name_eng: '',
          s_notes:'',
        });
      }


  });

  }
  else
  {
    this._SERVICE.Save(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status);
      else
  
      this._notification.ShowMessage(data.msg,data.status);
       if(data.status==1){


         this._router.navigate(['/ap/suppliercat']);
         this.typesForm = this.fb.group({
          n_id: '',
          n_DataAreaID: '',
          s_name: ['',Validators.required],
          s_name_eng: '',
          s_notes:'',
         });
       }



   });

  }


   }


}
