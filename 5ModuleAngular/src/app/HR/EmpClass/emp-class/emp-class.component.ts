import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { data } from 'jquery';
import { ReplaySubject } from 'rxjs';
import { BankBranch } from 'src/app/Core/Api/FIN/bank-branch.service';
import { bankService } from 'src/app/Core/Api/FIN/bank.service';
import { EmpClassService } from 'src/app/Core/Api/HR/emp-class.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { AccountsPopUpComponent } from 'src/app/SC/stores/accounts-pop-up/accounts-pop-up.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';

@Component({
  selector: 'app-emp-class',
  templateUrl: './emp-class.component.html',
  styleUrls: ['./emp-class.component.css']
})
export class EmpClassComponent implements OnInit {

 
  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _activatedRoute:ActivatedRoute,
    private dialogRef:MatDialog,
    private _SERVICE:EmpClassService,
    private _notification: NotificationServiceService,
    private _getBanks:bankService, 
    private _currency: CurrencyLKPService,
    private _lookup:GenerealLookup,
    
    private _serviceOut:SCstockInService
    ) {
   
  }
  //end Constructor

  //Onint
  ngOnInit(): void {
    debugger
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.EmpClassFrom=this.fb.group({
      n_class_Id :[''],
      s_class_name :[''],
      s_class_name_eng :[''],
      s_notes :[''],
      s_daily_labor_income_account:[''],
      n_cash_id:['']
      
    });
    if(this.DocNo != null && this. DocNo > 0)
    {
      this.nclassId=true
      
      this._SERVICE.GetByID(this.DocNo).subscribe((data)=>{
        debugger;
        this.EmpClassFrom.patchValue(data)

        // n_Collection_rate:[''],
    
      
        // s_Return_Check_account:[''],
        // s_Return_Check_account_name:['']
    




      
      
      })

   


     
    }
    


   this.isEnglish=LangSwitcher.CheckLan();
   LangSwitcher.translateData(1);
   LangSwitcher.translatefun();
   this.searchEmpClassAcc('');
   this.searchEmpClassCach('')
   
}
  //end OnInit 


  //variable declaration

  EmpClassFrom !:FormGroup
  showspinner=false;
  IDNo!:any;
  Edit: boolean=false;
  filteredAccServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCashServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  nclassId:boolean=false
  searchingEmpClassAcc:boolean=false;
  searchingEmpClassCash:boolean=false;
  EmpClassCashData:any=[];
  EmpClassAccData:any=[];
  Add: Boolean=true;
  DataAreaNo: any;
  @ViewChild("showID") showID!:ElementRef;
  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;
  searchEmpClassAcc(value :any){
   
    this.searchingEmpClassAcc=true;
    this._SERVICE.GetAccount( value).subscribe(res=>{
      this.EmpClassAccData=res;
      this.filteredAccServerSide.next(  this.EmpClassAccData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmpClassAcc=false;
    });
  }
  searchEmpClassCach(value :any){
   debugger;
    this.searchingEmpClassAcc=true;
    this._SERVICE.GetCashes( value).subscribe(res=>{
      this.EmpClassCashData=res;
      this.filteredCashServerSide.next(  this.EmpClassCashData.filter(x => x.s_cash_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmpClassCash=false;
    });
  }


  searchingVlues:any[]=[];
  DocNo:any;
  isEnglish:boolean=false;
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
    if(this.EmpClassFrom.get("s_class_name")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert  class name',3)
    else
      this._notification.ShowMessage("منفضلك  اسم النوع",3)
      return
    }
    if(this.EmpClassFrom.get("n_cash_id")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert the valut',3)
    else
      this._notification.ShowMessage("منفضلك  اسم الخزينة",3)
      return
    }
    if(this.EmpClassFrom.get("s_daily_labor_income_account")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert account',3)
    else
      this._notification.ShowMessage("منفضلك  ادخل حساب",3)
      return
    }
   var formData=new FormData();


 
  formData.append("n_class_Id",this.EmpClassFrom.value.n_class_Id ?? "0");
  formData.append("s_class_name",this.EmpClassFrom.value.s_class_name );
  formData.append("s_class_name_eng",this.EmpClassFrom.value.s_class_name_eng  );
  formData.append("s_daily_labor_income_account",this.EmpClassFrom.value.s_daily_labor_income_account )
  formData.append("s_notes",this.EmpClassFrom.value.s_notes );

  formData.append("n_cash_id",this.EmpClassFrom.value.n_cash_id  );
  this.showspinner = true;
  this.disableButtons();
  if(this.DocNo != null && this. DocNo > 0)
  {
      this._SERVICE.Edit(formData).subscribe((data)=>{
    if(data.status=1)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Updated successfully',1)
    else
        this._notification.ShowMessage("تم  التعديل  بنجاح",1);
         this.router.navigate(["hr/empclass"]);
         this.EmpClassFrom = this.fb.group({
          n_class_Id :[''],
          s_class_name :[''],
          s_class_name_eng :[''],
          s_notes :[''],
          s_daily_labor_income_account:[''],
          n_cash_id:['']
          
       });
    }

  });
  }
  else
  {
     this._SERVICE.Create(formData).subscribe(data => {

       if(data.status=1)
       {
        if(this.isEnglish)
          this._notification.ShowMessage('Saved successfully',1)
        else
           this._notification.ShowMessage("تم  الحفظ  بنجاح",1);
           this.router.navigate(["hr/empclass"]);
           this.EmpClassFrom = this.fb.group({
            n_class_Id :[''],
            s_class_name :[''],
            s_class_name_eng :[''],
            s_notes :[''],
            s_daily_labor_income_account:[''],
            n_cash_id:['']
            
         });
       }
 
     });
  }

 

 
}


}
