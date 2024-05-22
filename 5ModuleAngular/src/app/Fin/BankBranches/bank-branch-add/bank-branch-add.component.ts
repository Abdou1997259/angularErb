import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { BankBranch } from 'src/app/Core/Api/FIN/bank-branch.service';
import { bankService } from 'src/app/Core/Api/FIN/bank.service';
import { CashTypeSerivce } from 'src/app/Core/Api/FIN/cash-type.service';
import { CashService } from 'src/app/Core/Api/FIN/cash.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { AccountsPopUpComponent } from 'src/app/SC/stores/accounts-pop-up/accounts-pop-up.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';

@Component({
  selector: 'app-bank-branch-add',
  templateUrl: './bank-branch-add.component.html',
  styleUrls: ['./bank-branch-add.component.css']
})
export class BankBranchAddComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _activatedRoute:ActivatedRoute,
    private dialogRef:MatDialog,
    private _SERVICE:BankBranch,
    private _notification: NotificationServiceService,
    private _getBanks:bankService, 
    private _currency: CurrencyLKPService,
    private _lookup:GenerealLookup,
    private _CASHSERIVCE:CashService,
    private _serviceOut:SCstockInService
    ) {
   
  }
  //end Constructor

  //Onint
  ngOnInit(): void {
    debugger
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.BankBranchForm=this.fb.group({

      n_bank_id:[''],
      s_bank_name:[''],
      n_bank_branch_id:[''],
      s_bank_branch_name:['',Validators.required],
      s_bank_branch_name_eng:[''],
      s_bank_branch_address:[''],
      s_bank_branch_phone:[''],
      s_bank_branch_fax:[''],
      s_bank_branch_email:[''],
      s_PBox:[''],
      s_res_person:[''],
      s_res_person_tel:[''],
      s_res_person_email:[''],
      s_res_person_fax:[''],
      s_zipcode:[''],
      n_bank_bracnh_currency_id:[''],
      s_bank_symbol:[''],
      n_salary_bank_comision:[''],
      s_bank_account_No:[''],
      s_related_account_no:[''],

      s_Fees_Bank_account:[''],
    
      s_commision_tax_account:[''],
    
      n_Collection_rate:[''],
      s_CheckIn_account:[''],

      s_checkOut_account:[''],


      s_under_outcome_account:[''],
      s_Return_Check_account:[''],
    
    });
    if(this.DocNo != null && this. DocNo > 0)
    {
      this.showspinner=true;
      this._SERVICE.GetByID(this.DocNo).subscribe((data)=>{
        this.BankBranchForm.patchValue(data);    
        this.nbankBranchId=true;
        this.showspinner=false;  
      });
    }
    
    this.currencySearch('');
    this._serviceOut.GetLocalCurrencie().subscribe((val) => {
      this.localCurrency = val.n_currency_id;
      (this.selectserver.selectForm.get("n_bank_bracnh_currency_id")?.patchValue(val.n_currency_id));
      console.log(this.selectserver.selectForm);
   });
   this.isEnglish=LangSwitcher.CheckLan();
   LangSwitcher.translateData(1);
   LangSwitcher.translatefun();
   this.searchMainBank('');
   this.searchAccounts('')
}
  //end OnInit 


  //variable declaration

  BankBranchForm !:FormGroup
  showspinner=false;
  IDNo!:any;
  Edit: boolean=false;
  localCurrency;
  nbankBranchId;
  banksSearching:any[]=[];
  Banks:any=[];
  Accounts:any=[];
  Add: Boolean=true;
  DataAreaNo: any;
  @ViewChild("showID") showID!:ElementRef;
  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;
  filteredMainBankServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAccountsServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchingMainBank:boolean=false;
  searchingAccounts:boolean=false;

  currencySearching:boolean=false;
  isLocalcurrency: boolean = false;
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
  currencySearch(value: any) {
    this.currencySearching=true;
    this._currency.GetCurrencies().subscribe(res=> {
      this.currenciesList=res;
      this.currencyFilteredServerSide.next(this.currenciesList.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
      this.currencySearching=false;
      // this.isLocalcurrency = false;
    })
  }
  searchMainBank(value: any) {
    this.searchingMainBank=true;
    this._SERVICE.getallBanks(value).subscribe(res=> {
      this.banksSearching=res;
      this.filteredMainBankServerSide.next(this.banksSearching.filter(x => x.s_bank_name.toLowerCase().indexOf(value) > -1));
      this.searchingMainBank=false;
      // this.isLocalcurrency = false;
    })
  }
  searchAccounts(value :any){

    this.searchingAccounts=true;
    this._CASHSERIVCE.GetAccounts(value).subscribe(res=>{
      this.Accounts=res;
      this.filteredAccountsServerSide.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingAccounts=false;
    });
  
  
    
  }
  
  isNumberKey(evt)
  {
     var charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode != 46 && charCode > 31
       && (charCode < 48 || charCode > 57) || charCode == 45)
        return false
     return true;
  }



onCurrencuSelection($event)
{
  debugger
  if(this.selectserver.selectForm.value.n_bank_bracnh_currency_id===this.localCurrency)
  {
    this.isLocalcurrency=false

  }
  else
  this.isLocalcurrency=true
}
selectItem(i,searchInputNumber,inputName,inputNumber)
{
  debugger
  let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
  let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber + " #tdS" + i) as HTMLElement;
  
  (this.BankBranchForm.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
  (this.BankBranchForm.get(inputNumber))?.patchValue(AccountNo.innerHTML);
  let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
  element.style.opacity="0";
  element.style.zIndex="-1";
}
searchHide(searchInputNumber)
{ 
  let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
element.style.opacity="0";
element.style.zIndex="-1";

}
openDialogAcc(event:any)
{

 const dialogRef=this.dialogRef.open(AccountsPopUpComponent,{
  height:'700px',
  width:'600px',
  data:{}
 })
 console.log(event.target.id)

 dialogRef.afterClosed().subscribe(res=>{
  debugger
 let nameOfInputName=(document.querySelector("#"+event.target.id +'+ input') as HTMLInputElement).getAttribute("formControlName") ?? "";
 let nameOfInputNo=(document.querySelector("#"+event.target.id +'~ input:nth-of-type(2)') as HTMLInputElement).getAttribute("formControlName") ?? "";
 (this.BankBranchForm.get(nameOfInputName))?.patchValue(`${res.data.s_account_no} # ${res.data.s_account_name}` );
 (this.BankBranchForm.get(nameOfInputNo))?.patchValue(res.data.s_account_no );

//  let nameOfInput=(document.querySelector(event.target.id+"+ input") as HTMLElement).getAttribute("formControlName");
//  (this.storeForm.get(nameOfInput))?.patchValue(res.data.s_account_no);



 })

}
  save(){
    debugger
    if(this.BankBranchForm.get("s_bank_branch_name")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert Branch Name',3)
    else
      this._notification.ShowMessage("منفضلك  اسم النوع",3)
      return
    }
    if(this.BankBranchForm.value.s_checkOut_account==null || this.BankBranchForm.value.s_checkOut_account=='')
      {
        this.showspinner=false;
        if(this.isEnglish) 
        this._notification.ShowMessage('Please insert  Account',3)
      else
        this._notification.ShowMessage("أدخل اسم الحساب",3)
        return
      }
      if(this.BankBranchForm.value.s_commision_tax_account==null || this.BankBranchForm.value.s_commision_tax_account=='')
        {
          this.showspinner=false;
          if(this.isEnglish) 
          this._notification.ShowMessage('Please insert  Account',3)
        else
          this._notification.ShowMessage("أدخل اسم الحساب",3)
          return
        }
    if(this.BankBranchForm.value.s_Fees_Bank_account==null || this.BankBranchForm.value.s_Fees_Bank_account=='')
          {
            this.showspinner=false;
            if(this.isEnglish) 
            this._notification.ShowMessage('Please insert  Account',3)
          else
            this._notification.ShowMessage("أدخل اسم الحساب",3)
            return
      }
   if(this.BankBranchForm.value.s_related_account_no==null || this.BankBranchForm.value.s_related_account_no=='')
        {
          this.showspinner=false;
          if(this.isEnglish) 
          this._notification.ShowMessage('Please insert  Account',3)
        else
          this._notification.ShowMessage("أدخل اسم الحساب",3)
          return
        }
        if(this.BankBranchForm.value.s_under_outcome_account==null || this.BankBranchForm.value.s_under_outcome_account=='')
          {
            this.showspinner=false;
            if(this.isEnglish) 
            this._notification.ShowMessage('Please insert  Account',3)
          else
            this._notification.ShowMessage("أدخل اسم الحساب",3)
            return
          }
       if(this.BankBranchForm.value.s_Return_Check_account==null || this.BankBranchForm.value.s_Return_Check_account=='')
            {
              this.showspinner=false;
              if(this.isEnglish) 
              this._notification.ShowMessage('Please insert  Account',3)
            else
              this._notification.ShowMessage("أدخل اسم الحساب",3)
              return
            }
    
   var formData=new FormData();

   formData.append("s_zipcode",this.BankBranchForm.value.s_zipcode );
  formData.append("n_bank_bracnh_currency_id",this.BankBranchForm.value.n_bank_bracnh_currency_id)
  formData.append("s_bank_symbol",this.BankBranchForm.value.s_bank_symbol);
  formData.append("n_salary_bank_comision",this.BankBranchForm.value.n_salary_bank_comision);
  formData.append("s_bank_account_No",this.BankBranchForm.value.s_bank_account_No);
  formData.append("s_related_account_no",this.BankBranchForm.value.s_related_account_no);

  formData.append("s_Fees_Bank_account",this.BankBranchForm.value.s_Fees_Bank_account)

  formData.append("s_commision_tax_account",this.BankBranchForm.value.s_commision_tax_account);

  formData.append("s_res_person_fax",this.BankBranchForm.value.s_res_person_fax );
  formData.append("s_res_person_email",this.BankBranchForm.value.s_res_person_email)
  formData.append("s_res_person_tel",this.BankBranchForm.value.s_res_person_tel);
  formData.append("s_res_person",this.BankBranchForm.value.s_res_person);
  formData.append("n_bank_id",this.BankBranchForm.value.n_bank_id ?? 0);
  formData.append("s_bank_name",this.BankBranchForm.value.s_bank_name)
  formData.append("n_bank_branch_id",this.BankBranchForm.value.n_bank_branch_id);
  formData.append("s_bank_branch_name",this.BankBranchForm.value.s_bank_branch_name);
  formData.append("s_bank_branch_name_eng",this.BankBranchForm.value.s_bank_branch_name_eng );
  formData.append("s_bank_branch_address",this.BankBranchForm.value.s_bank_branch_address)
  formData.append("s_bank_branch_phone",this.BankBranchForm.value.s_bank_branch_phone);
  formData.append("s_bank_branch_fax",this.BankBranchForm.value.s_bank_branch_fax);
  formData.append("s_bank_branch_email",this.BankBranchForm.value.s_bank_branch_email);
  formData.append("s_PBox",this.BankBranchForm.value.s_PBox);
  formData.append("n_Collection_rate",this.BankBranchForm.value.n_Collection_rate );
  formData.append("s_CheckIn_account",this.BankBranchForm.value.s_CheckIn_account)

  formData.append("s_Return_Check_account",this.BankBranchForm.value.s_Return_Check_account)
  formData.append("s_under_outcome_account",this.BankBranchForm.value.s_under_outcome_account);


  formData.append("s_checkOut_account",this.BankBranchForm.value.s_checkOut_account);


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
         this.router.navigate(["fin/BankBranch"]);
         this.BankBranchForm = this.fb.group({
          n_bank_id:[''],
          s_bank_name:[''],
          n_bank_branch_id:[''],
          s_bank_branch_name:[''],
          s_bank_branch_name_eng:[''],
          s_bank_branch_address:[''],
          s_bank_branch_phone:[''],
          s_bank_branch_fax:[''],
          s_bank_branch_email:[''],
          s_PBox:[''],
          s_res_person:[''],
          s_res_person_tel:[''],
          s_res_person_email:[''],
          s_res_person_fax:[''],
          s_zipcode:[''],
          n_bank_bracnh_currency_id:[''],
          s_bank_symbol:[''],
          n_salary_bank_comision:[''],
          s_bank_account_No:[''],
          s_related_account_no:[''],
          s_related_account_name:[''],
          s_Fees_Bank_account:[''],
          s_Fees_Bank_account_name:[''],
          s_commision_tax_account:[''],
          s_commision_tax_account_name:[''],    
          n_Collection_rate:[''],
          s_CheckIn_account:[''],
          s_CheckIn_account_name:[''],
          s_checkOut_account:[''],
          s_checkOut_account_name:[''],
          s_under_outcome_account_name:[''],
          s_under_outcome_account:[''],
          s_Return_Check_account:[''],
          s_Return_Check_account_name:['']
       });
    }

  });
  }
  else
  {
     this._SERVICE.create(formData).subscribe(data => {

       if(data.status=1)
       {
        if(this.isEnglish)
          this._notification.ShowMessage('Saved successfully',1)
        else
           this._notification.ShowMessage("تم  الحفظ  بنجاح",1);
           this.router.navigate(["fin/BankBranch"]);
           this.BankBranchForm = this.fb.group({
            n_bank_id:[''],
            s_bank_name:[''],
            n_bank_branch_id:[''],
            s_bank_branch_name:[''],
            s_bank_branch_name_eng:[''],
            s_bank_branch_address:[''],
            s_bank_branch_phone:[''],
            s_bank_branch_fax:[''],
            s_bank_branch_email:[''],
            s_PBox:[''],
            s_res_person:[''],
            s_res_person_tel:[''],
            s_res_person_email:[''],
            s_res_person_fax:[''],
            s_zipcode:[''],
            n_bank_bracnh_currency_id:[''],
            s_bank_symbol:[''],
            n_salary_bank_comision:[''],
            s_bank_account_No:[''],
            s_related_account_no:[''],
            s_related_account_name:[''],
            s_Fees_Bank_account:[''],
            s_Fees_Bank_account_name:[''],
            s_commision_tax_account:[''],
            s_commision_tax_account_name:[''],    
            n_Collection_rate:[''],
            s_CheckIn_account:[''],
            s_CheckIn_account_name:[''],
            s_checkOut_account:[''],
            s_checkOut_account_name:[''],
            s_under_outcome_account_name:[''],
            s_under_outcome_account:[''],
            s_Return_Check_account:[''],
            s_Return_Check_account_name:['']
         });
       }
 
     });
  }

 

 
}

}
