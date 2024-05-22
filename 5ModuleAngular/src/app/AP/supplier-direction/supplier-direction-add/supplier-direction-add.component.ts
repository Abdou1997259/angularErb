import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierDirection } from 'src/app/Core/Api/AP/supplier-direction.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { AccountDirectionComponent } from '../account-direction/account-direction.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-supplier-direction-add',
  templateUrl: './supplier-direction-add.component.html',
  styleUrls: ['./supplier-direction-add.component.css']
})
export class SupplierDirectionAddComponent implements OnInit {


  constructor(
    private fb:FormBuilder
   ,private dialogRef:MatDialog
   ,private http:HttpClient,
    private _SERVICE:SupplierDirection,
    private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService,

    private _lookUp:GenerealLookup,
   private _router:Router
  ) {

    // FORM DEFIFNITION
    this.supplierDirection = this.fb.group({
      n_acc_dir_no: '',
      n_DataAreaID: '',
      s_acc_dir_name:['',Validators.required],
      s_acc_dir_name_eng:'',
      detailsDirections:this.fb.array([])
     
    });
    // END FORM DEFIFNTION


   }

  // END constructor

  // START VARIABLES DECLARTIONS
  showspinner= false;
  
  supplierDirection!: FormGroup ;
  DocNo!: any;
  accounts: any[]=[];
 
  Edit: boolean=false;
  Add: Boolean=true;
  acountsarra!:any [] ;
  DataAreaNo: any;
  isEnglish:boolean=false;
 get detailsDirections():FormArray
 {
  return  this.supplierDirection.get('detailsDirections') as FormArray
 }
   // END VARIABLES DECLARTIONS






  //  START HOOKS METHODS
  ngOnInit(): void {

    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this._lookUp.getAcounts().subscribe((res)=>{
      this.accounts=res
    })
 
    
    
     this.pushInArray(1,1);
     this.pushInArray(1,2);
     this.pushInArray(1,3);
     this.pushInArray(1,4);
     this.pushInArray(1,9);
     this.pushInArray(1,10);
     this.pushInArray(1,11);
     this.pushInArray(2,7);
     this.pushInArray(2,12);
     this.pushInArray(2,13);
     this.pushInArray(2,14);
     this.pushInArray(2,8);
     this.pushInArray(2,5);
     this.pushInArray(2,6);


    if(this.DocNo !=null && this.DocNo > 0 ){
      this.showspinner=true;
      this._SERVICE.GetByID(this.DocNo).subscribe(res=>{
        debugger
        this.supplierDirection.get("n_acc_dir_no")?.patchValue(res[0].n_acc_dir_no)
        this.supplierDirection.get("n_DataAreaID")?.patchValue(res[0].n_DataAreaID)
        this.supplierDirection.get("s_acc_dir_name")?.patchValue(res[0].s_acc_dir_name)
        this.supplierDirection.get("s_acc_dir_name_eng")?.patchValue(res[0].s_acc_dir_name_eng)
        for(let i=0;i<res.length;++i)
        {
          ((this.supplierDirection.get("detailsDirections") as FormArray).at(i) as FormGroup ).patchValue({
             n_voice_type_id:res[i].n_voice_type_id,
             n_type_id:res[i].n_type_id,
             s_account_no:res[i].s_account_no,
             s_account_name:res[i].s_account_name
          
          });  
        }     
      });
      this.showspinner=false;
    }

      
  


  LangSwitcher.translatefun();
    
 }



pushInArray(n_voice_type_id:number,n_type_id:number)
{
  this.detailsDirections.push(
    this.fb.group({
      n_voice_type_id:[n_voice_type_id],
      n_type_id:[n_type_id],
      s_account_no:[''],
      s_account_name:['',Validators.required]
    })
  )
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
  openAccounts(i)
  {
    const dialog=this.dialogRef.open(AccountDirectionComponent,{
      width: '700px',
      height:'600px',
      data:{}
    })

     dialog.afterClosed().subscribe(res => {
            ((this.supplierDirection?.get('detailsDirections') as FormArray).at(i) as FormGroup)?.patchValue({s_account_no:res.data.s_account_no});
            ((this.supplierDirection?.get('detailsDirections') as FormArray).at(i) as FormGroup)?.patchValue({s_account_name:res.data.s_account_name})
      

     });
  }
  getItemsNow($event,i)
  {
  
    
    // let uni=$event.target.value.trim(" ");
    // let arr=this.items.filter((res)=>{
    //   res.s_item_id=$event.target.value
  
    // });
    
  
   
    // console.log(arr);
    // ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_item_name").patchValue(arr[0]);
    let arr=this.accounts.filter((ele)=>
    {
     return ele.s_account_no==$event.target.value
    });
    
  

    debugger
    
    
   
    
   if(arr.length!=0)
   {
    ((this.supplierDirection.get("detailsDirections") as FormArray).at(i) as FormGroup).get('s_account_no')?.patchValue(arr[0]?.s_account_no);
    ((this.supplierDirection.get("detailsDirections") as FormArray).at(i) as FormGroup).get('s_account_name')?.patchValue(arr[0]?.s_account_name);
   }
   else
   {
    ((this.supplierDirection.get("detailsDirections") as FormArray).at(i) as FormGroup).get('s_account_name')?.patchValue('');
   }
   

  }
  

  save()
  {
    debugger
    if(((this.supplierDirection.get("detailsDirections") as  FormArray).at(0) as FormGroup).get("s_acc_dir_name")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage('Please insert type name',3)
      else
      this._notification.ShowMessage("منفضلك  اسم النوع",3)
      return
    }
  
  var formData: any = new FormData();
  for(let i=0;i<this.supplierDirection.value.detailsDirections.length;++i)
  {
    if(this.supplierDirection.value.detailsDirections[i].s_account_no!=""
    
      )
    {
      formData.append("detailsDirections[" + i + "].n_acc_dir_no", this.supplierDirection.value.n_acc_dir_no ?? 0);
      formData.append("detailsDirections[" + i + "].s_acc_dir_name", this.supplierDirection.value.s_acc_dir_name);
      formData.append("detailsDirections[" + i + "].s_acc_dir_name_eng", this.supplierDirection.value.s_acc_dir_name_eng);
      formData.append("detailsDirections[" + i + "].n_acc_dir_no", this.supplierDirection.value.n_acc_dir_no);
      formData.append("detailsDirections[" + i + "].n_voice_type_id",this.supplierDirection.value.detailsDirections[i].n_voice_type_id);
      formData.append("detailsDirections[" + i + "].n_type_id", this.supplierDirection.value.detailsDirections[i].n_type_id);
      formData.append("detailsDirections[" + i + "].s_account_no", this.supplierDirection.value.detailsDirections[i].s_account_no);
  


    }
    else
    {
      this.showspinner=false;
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert all accounts ', 3)
      else
      this._notification.ShowMessage("منفضلك ادخل كل حسابات التوجيهة",3)
    return

    }

  }
  


  
  this.showspinner=true;
  this.disableButtons();
  if(this.DocNo != null && this. DocNo > 0)
  {
    this._SERVICE.Update(formData).subscribe(data=>{
      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);

       else
      this. _notification.ShowMessage(data.msg,data.status);

      if(data.status==1){
        this._router.navigate(['/ap/supplierDirection']);
        this.supplierDirection = this.fb.group({
          n_acc_dir_no: '',
          n_DataAreaID: '',
          s_acc_dir_name:['',Validators.required],
          s_acc_dir_name_eng:'',
          detailsDirections:this.fb.array([])
         
        });
      }
    })

   }
   else
   {
    this._SERVICE.Save(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);

       else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){


         this._router.navigate(['/ap/supplierDirection']);
        
         this.supplierDirection = this.fb.group({
          n_acc_dir_no: '',
          n_DataAreaID: '',
          s_acc_dir_name:['',Validators.required],
          s_acc_dir_name_eng:'',
          detailsDirections:this.fb.array([])
         
        });
         
        
        
   
    
    

        
        
      }


  });

   }
  

  
 
  


   }


}
