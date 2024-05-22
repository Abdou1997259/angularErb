import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CashTypeSerivce } from 'src/app/Core/Api/FIN/cash-type.service';
import { MainBankService } from 'src/app/Core/Api/FIN/main-bank.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-main-bank-add',
  templateUrl: './main-bank-add.component.html',
  styleUrls: ['./main-bank-add.component.css']
})
export class MainBankAddComponent implements OnInit {

 // Constructor
 constructor(
  private fb:FormBuilder,
  private router:Router,
  private activatedRoute:ActivatedRoute,
  private dialog:MatDialog,
  private _SERVICE:MainBankService,
  private _notification: NotificationServiceService
  ) {
 
}
//end Constructor

//Onint
ngOnInit(): void {
  debugger
  this.IDNo=this.activatedRoute.snapshot.paramMap.get("id");
  
  this.CashTypeForm=this.fb.group({
    n_bank_id:['',Validators.required],
    s_bank_name:[''],
    s_bank_name_eng:[''],
    n_DataAreaID:['']
  })

  if(this.IDNo !=null && this.IDNo > 0 ){
    this.showspinner=true;
    this._SERVICE.GetByID(this.IDNo).subscribe(data=>{
      this.showID.nativeElement.style.display="block"
      this.CashTypeForm.patchValue({ n_bank_id : data["n_bank_id"]});
      this.CashTypeForm.patchValue({ s_bank_name : data["s_bank_name"]});
      this.CashTypeForm.patchValue({ s_bank_name_eng: data["s_bank_name_eng"]});
      this.CashTypeForm.patchValue({ n_DataAreaID: data["n_DataAreaID"]});
      // this.storeForm.patchValue({ s_employee_name: data["s_employee_name"]});
     
      this.Add=false;
      this.Edit=true
      this.showspinner=false;
    });

}

}

CashTypeForm !:FormGroup
showspinner=false;
IDNo!:any;
Edit: boolean=false;
Add: Boolean=true;
DataAreaNo: any;
@ViewChild("showID") showID!:ElementRef
//end declartion 


//function creation
disableButtons() {
  debugger;
  $(':button').prop('disabled', true);
  $("input[type=button]").attr("disabled", "disabled");
}

enableButtons() {
  $(':button').prop('disabled', false);
  $('input[type=button]').removeAttr("disabled");
}
save(){
  debugger
  if(this.CashTypeForm.get("s_bank_name")?.invalid)
  {
    this.showspinner=false;
    this._notification.ShowMessage("منفضلك  اسم البنك ",3)
    return
  }
 var formData=new FormData();
//  n_bank_id:['',Validators.required],
//  s_bank_name:[''],
//  s_bank_name_eng:['']
formData.append("n_bank_id",this.CashTypeForm.value.n_bank_id ?? 0);
formData.append("s_bank_name",this.CashTypeForm.value.s_bank_name)
formData.append("s_bank_name_eng",this.CashTypeForm.value.s_bank_name_eng);

this.showspinner = true;
this.disableButtons();
if(this.IDNo !=null && this.IDNo > 0 ){
   this._SERVICE.Edit(formData).subscribe((data)=>{
    this.showspinner = false;
    this.enableButtons();
    this. _notification.ShowMessage(data.msg,data.status);
    if(data.status==1)
    {
      this.router.navigate(['fin/MainBank'])
    }

   })
} 
else
{
  this._SERVICE.Create(formData).subscribe((data)=>{
    this.showspinner = false;
    this.enableButtons();
    this. _notification.ShowMessage(data.msg,data.status);
    if(data.status==1)
    {
      this.router.navigate(['fin/MainBank'])
    }
  });
}
//end function 

}

}
