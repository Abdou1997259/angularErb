import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { CashTypeSerivce } from 'src/app/Core/Api/FIN/cash-type.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-cash-type-add',
  templateUrl: './cash-type-add.component.html',
  styleUrls: ['./cash-type-add.component.css']
})
export class CashTypeAddComponent   implements OnInit {
// Constructor
  constructor(
    private fb:FormBuilder,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private dialog:MatDialog,
    private _SERVICE:CashTypeSerivce,
    private _notification: NotificationServiceService
    ) {
   
  }
  //end Constructor

  //Onint
  ngOnInit(): void {
    this.CashTypeForm=this.fb.group({
      n_cash_type_id:['',Validators.required],
      s_cash_type_name:[''],
      s_cash_type_name_eng:[''],
      n_DataAreaID:['']
    })
    this.IDNo=this.activatedRoute.snapshot.paramMap.get("id");
    
    

    if(this.IDNo !=null && this.IDNo > 0 ){
      this.showspinner=true;
      this._SERVICE.GetByID(this.IDNo).subscribe(data=>{
        debugger
        this.showID.nativeElement.style.display="block";
        this.CashTypeForm.patchValue(data);
     
        this.Add=false;
        this.Edit=true;
        this.showspinner=false;
      });

  }

}
  //end OnInit 


  //variable declaration

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
    if(this.CashTypeForm.get("s_cash_type_name")?.invalid)
    {
      this.showspinner=false;
      this._notification.ShowMessage("منفضلك  اسم النوع",3)
      return
    }
   var formData=new FormData();

  formData.append("n_cash_type_id",this.CashTypeForm.value.n_cash_type_id ?? 0);
  formData.append("s_cash_type_name",this.CashTypeForm.value.s_cash_type_name)
  formData.append("s_cash_type_name_eng",this.CashTypeForm.value.s_cash_type_name_eng);

  this.showspinner = true;
  this.disableButtons();
  if(this.IDNo !=null && this.IDNo > 0 ){
     this._SERVICE.Edit(formData).subscribe((data)=>{
      this.showspinner = false;
      this.enableButtons();
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1)
      {
        this.router.navigate(['fin/CashTypeList'])
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
        this.router.navigate(['fin/CashTypeList'])
      }
    });
  }
  //end function 

}
}
