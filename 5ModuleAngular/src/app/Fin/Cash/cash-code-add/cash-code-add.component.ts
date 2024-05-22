import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CashService } from 'src/app/Core/Api/FIN/cash.service';
import { MultiTransService } from 'src/app/Core/Api/FIN/multi-trans.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';

@Component({
  selector: 'app-cash-code-add',
  templateUrl: './cash-code-add.component.html',
  styleUrls: ['./cash-code-add.component.css']
})
export class CashCodeAddComponent implements OnInit {
//constructor
  constructor(
    private _SERIVCE:CashService,
    private _activatedRoute:ActivatedRoute,
    private router:Router
    ,private _initialBalanceService:IntialBalnceService,
    private _stockOutToStock:StockOutToStock,
    private fb:FormBuilder,
    private _dialog:MatDialog, 
    private _helperService: HelperService,
    private _notification: NotificationServiceService,
    private _lookUp:GenerealLookup,
    private _service: MultiTransService
    ) {

   }
//end constructor

//OnInit
  ngOnInit(): void {
    this.cashForm=this.fb.group({
      n_cash_class_id :['',Validators.required],
      n_cash_type_id :[''] , 
      n_cash_id :[''] ,
      s_middle_account:[],
      s_cash_name :[''] , 
      s_cash_name_eng :[''] , 
      s_related_device :[''] , 
      s_cashier_name :[''] , 
      n_cash_currency_id :[''] , 
      s_related_account_no :[''] ,
      s_related_account_name:[''],
      s_cash_type_name:[''],

   
    })
    this.IDNo=this._activatedRoute.snapshot.paramMap.get("id");
    if(this.IDNo !=null && this.IDNo > 0 ){
      this.showspinner=true;
      this._SERIVCE.GetByID(this.IDNo).subscribe(data=>{
        this.ShowID=true;
        this.cashForm.patchValue(data);
        // this.storeForm.patchValue({ s_employee_name: data["s_employee_name"]});  
        this.showspinner=false;   
      });
    }

    this._stockOutToStock.GetLocalCurrencie().subscribe((val) => {
      this.localCurrency = val.n_currency_id;
      this.localCurencyName=val.s_currency_name;
      ( this.selectserver.selectForm.get("n_cash_currency_id")?.patchValue(val.n_currency_id));
      ( this.selectserver.selectForm.get("s_currency_name")?.patchValue(val.s_currency_name));
   });

   this.searchingCurrencies('');
   LangSwitcher.translateData(1);

   LangSwitcher.translatefun();
   this.isEnglish=LangSwitcher.CheckLan();
   this.searchCashType('');
   this.searchAccounts('');
  
   this.searchCahisher('');
    
  }
  //end Oninit


  //variable declartion
  cashForm!:FormGroup;
  showspinner:boolean=false;
  cashes:any[]=[];
  searchingCashType:boolean=false;
  searchingCashier:boolean=false;
  searchingAccounts:boolean=false;

  filteredCashTypeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccounts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCashier: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  Cashiers:any=[];
  Emps:any[]=[];
  
  searchingCurrency:boolean=false;
  currencyType!: any [];
  filteredCurrencyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;
  isLocalcurrency: boolean=false;
  localCurrency;
  localCurencyName;
  accounts:any=[];
  CashTypes:any=[];
  Accounts:any=[];
  Accounts2:any=[]
  ShowID:boolean=false;
  IDNo:any='';

  isEnglish:boolean=false;
  //end variable declartion


  //function declartion 

searchCashType(value :any){
  this.searchingCashType=true;
  this._SERIVCE.getFiftyCashSearch(value).subscribe(res=>{
    this.CashTypes=res;
    this.filteredCashTypeServerSide.next( this.CashTypes.filter(x => x.s_cash_type_name.toLowerCase().indexOf(value) > -1));
    this.searchingCashType=false;
  });
}
searchAccounts(value :any){

  this.searchingAccounts=true;
  this._SERIVCE.GetAccounts(value).subscribe(res=>{
    this.Accounts=res;
    this.filteredaccounts.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
    this.searchingAccounts=false;
  });


  
}


searchCahisher(value :any){
  this.searchingCashier=true;
  this._SERIVCE.GetEmps(value).subscribe(res=>{
    this.Cashiers=res;
    this.filteredCashier.next( this.Cashiers.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
    this.searchingCashier=false;
  });
}



searchingCurrencies(value:any)
{
 this.searchingCurrency=true;
 this._initialBalanceService.GetCurrencies().subscribe(res=>{
   this.currencyType=res;
   this.filteredCurrencyServerSide.next(  this.currencyType.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
   this.searchingCurrency=false;
 })
}
onCurrencuSelection($event)
{
  debugger
  if(this.selectserver.selectForm.value.n_intial_balance_currency_id===this.localCurrency)
  {
    this.isLocalcurrency=false

  }
  else
  this.isLocalcurrency=true
}
disableButtons() {

  $(':button').prop('disabled', true);
  $("input[type=button]").attr("disabled", "disabled");
}

enableButtons() {
  $(':button').prop('disabled', false);
  $('input[type=button]').removeAttr("disabled");
}
  Save()
  {
    debugger;

    if(this.cashForm.get("s_cash_name")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert vault name',3)
      else
       this._notification.ShowMessage("منفضلك  اسم الخزنة",3)
      return ;
    }
    if(this.cashForm.get("n_cash_class_id")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert vault type name',3)
      else
      this._notification.ShowMessage("منفضلك  اسم نوع الخزنة",3)
      return ;
    }
      
    var formdata =new FormData();
    this.disableButtons();
    formdata.append("n_cash_class_id",this.cashForm.value.n_cash_class_id);
    formdata.append("n_cash_id",this.cashForm.value.n_cash_id?? 0);
    formdata.append("s_cash_name",this.cashForm.value.s_cash_name);
    formdata.append("s_cash_name_eng",this.cashForm.value.s_cash_name_eng);
    formdata.append("n_cash_currency_id",this.cashForm.value.n_cash_currency_id);
    formdata.append("s_related_account_no",this.cashForm.value.s_related_account_no);

    formdata.append("s_middle_account",this.cashForm.value.s_middle_account);
    formdata.append("s_cashier_name",this.cashForm.value.s_cashier_name);
    formdata.append("n_cash_type_id",this.cashForm.value.n_cash_type_id);
    this.showspinner = true;

    if(this.IDNo !=null && this.IDNo > 0 ){
      this._SERIVCE.Edit(formdata).subscribe((data)=>{
        this.showspinner = false;
        this.enableButtons();
        if(this.isEnglish)
         this._notification.ShowMessage(data.Emsg,data.status)
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1)
        {
          this.router.navigate(['fin/CashList'])
        }
        
      })
    }
    else
    {
      this._SERIVCE.Create(formdata).subscribe((data)=>{
        this.showspinner = false;
        this.enableButtons();
        if(this.isEnglish)
         this._notification.ShowMessage(data.Emsg,data.stauts)
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1)
        {
          this.router.navigate(['fin/CashList'])
        }
        
      })
    }


  }
  //end Function declartion 
}
