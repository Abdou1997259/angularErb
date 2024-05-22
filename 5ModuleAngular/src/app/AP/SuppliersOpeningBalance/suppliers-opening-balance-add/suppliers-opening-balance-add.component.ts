import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CurrenciesLkpComponent } from 'src/app/Controls/currencies-lkp/currencies-lkp.component';
import { SuppliersLkpComponent } from 'src/app/Controls/suppliers-lkp/suppliers-lkp.component';
import { SuppliersTypesLkpComponent } from 'src/app/Controls/suppliers-types-lkp/suppliers-types-lkp.component';
import { SuppliersOpeningBalanceService } from 'src/app/Core/Api/AP/suppliers-opening-balance.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SuppliersLKPService } from 'src/app/Core/Api/LookUps/suppliers-lkp.service';
import { SuppliersTypesLKPService } from 'src/app/Core/Api/LookUps/suppliers-types-lkp.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-suppliers-opening-balance-add',
  templateUrl: './suppliers-opening-balance-add.component.html',
  styleUrls: ['./suppliers-opening-balance-add.component.css']
})
export class SuppliersOpeningBalanceAddComponent implements OnInit {
  docuNumber: number = 0;
  suppliersBalanceMasterForm!: FormGroup;

  localCurrency!: any;
  n_currency_id!: number;
  n_currency_id_details!: number;
  currencyName!: string;

  // searchingTypes:any[] =[];
  currenciesList: any;
  suppliersList: any;
  currencySearching:boolean=false;
  supplierSearching:boolean=false;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  supplierFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  showspinner: boolean = false;
  isFinancialYearExist: boolean = false;
  isEnglish:boolean=false;
  isSupplierTypeExists: boolean = false;
  isSupplierExist: boolean[] = [];
  isCurrencyExist: boolean[] = [];

  changedCurrency: any[] = [];
  timeout: any;


  constructor(private _service: SuppliersOpeningBalanceService, private _notification: NotificationServiceService,
    private _router: Router, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute,
    private _lookUp:GenerealLookup,
    public dialog: MatDialog, private _currencyService: CurrencyLKPService, private _supplierTypeService: SuppliersTypesLKPService,
    private _supplierService: SuppliersLKPService, private _helperService: HelperService) {
      this.suppliersBalanceMasterForm = this._formBuilder.group({
        n_doc_no: new FormControl(),
        n_DataAreaID: new FormControl(),
        n_UserAdd: new FormControl(),
        d_UserAddDate: new FormControl(),
        n_UserUpdate: new FormControl(),
        d_UserUpdateDate: new FormControl(),
        d_Financial_year: new FormControl('', Validators.required),
        d_doc_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_currency_id: new FormControl('', Validators.required),
        s_currency_name: new FormControl(),
        n_currency_coff: new FormControl(),
        n_supplier_type_id: new FormControl(),
        s_supplier_type_name: new FormControl(),
        s_arabic_description: new FormControl(),
        s_english_description: new FormControl(),
        b_FromCloseYear: new FormControl(),
        d_curr_sys_date: new FormControl(),
        n_total_debit: new FormControl(),
        n_total_credit: new FormControl(),
        n_current_branch: new FormControl(),
        n_current_company: new FormControl(),
        n_current_year: new FormControl(),
        app_suppliers_details: this._formBuilder.array([])
      });
  }

  ngOnInit(): void {

    this.docuNumber = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });

    this.currencySearch('');
    this.supplierSearch('');

    if(this.docuNumber <= 0)
    {
      this._service.GetCurrentSuppliersOPeningBalance().subscribe((data) => {
        this.n_currency_id = 0;
        this.currencyName = data.s_currency_name;

        this.suppliersBalanceMasterForm.patchValue(data);
        this.suppliersBalanceMasterForm.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this._service.CheckIfCuurentYearExist(data.d_Financial_year).subscribe((data) => {
          if(data.currentYear != '')
            this.isFinancialYearExist = true;
        });
        this.addNewDetailsRow();
      });
      //----------
    }

    if(this.docuNumber > 0)
    {
      this.showspinner = true;
      this._service.GetByID(this.docuNumber).subscribe((data) => {
        this.n_currency_id = data.n_currency_id;

        this.suppliersBalanceMasterForm.patchValue(data);
        this.suppliersBalanceMasterForm.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));

        this.executeSupplierTypeListing(data.n_supplier_type_id);

        data.app_suppliers_details.forEach((data) => {
          this.app_suppliers_details.push(this.insertNewDetailsRow(this.app_suppliers_details.length + 1));
        });
        (this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray)?.patchValue(data.app_suppliers_details);
        for(var i = 0; i < this.app_suppliers_details.length; i++)
        {
          this.executeCurrencyListing(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].n_currency_id, i);
        }

        this.showspinner = false;
      });
    }

    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();

  }

  get app_suppliers_details(): FormArray
  {
    return this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray;
  }

  insertNewDetailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_doc_no: '',
      nLineNo: line,
      n_supplier_id: '',
      s_supplier_name: '',
      n_currency_id: this.localCurrency,
      n_currency_coff: [{value: '1', disabled: true}],
      n_debit: '',
      n_credit: '',
      s_arabic_description: '',
      s_english_description: '',
    });
  }

  addNewDetailsRow() {
    this.app_suppliers_details.push(this.insertNewDetailsRow(this.app_suppliers_details.length + 1));
  }

  removeDetailsRow(row: number)
  {
    if(this.app_suppliers_details.length==1)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('it must contain a single ledger at least',2)
    else
      this._notification.ShowMessage('يجب ان يحتوي القيد علي سطر واحد على الاقل',2);
      return;
    }
    else
    {
      this.app_suppliers_details.removeAt(row);
      this.calcTotalDebit();
      this.calcTotalCredit();
    }
  }

  LoadSuppliersTypes()
  {
    const dialogRef = this.dialog.open(SuppliersTypesLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isSupplierTypeExists = true;
      (this.suppliersBalanceMasterForm.get("n_supplier_type_id"))?.patchValue(res.data.n_supplier_type_id );
      (this.suppliersBalanceMasterForm.get("s_supplier_type_name"))?.patchValue(res.data.s_supplier_type_name + ' # ' +res.data.n_supplier_type_id);
    });
  }

  onKeySuppliersTypesSearch(event: any){
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeSupplierTypeListing(event.target.value);
      }
    }, 1000);
  }

  private executeSupplierTypeListing(value: number) {
    this.suppliersBalanceMasterForm.get('s_supplier_type_name')?.patchValue('');
    this._supplierTypeService.GetSupplierTypeName(value).subscribe((data) => {
      if(data.typeName != "")
      {
        this.suppliersBalanceMasterForm.get('s_supplier_type_name')?.patchValue(data.typeName + " # "+value);
        this.isSupplierTypeExists = true;
      }
      else{
        this.isSupplierTypeExists = false;
      }
    });
  }

  currencySearch(value: any) {
    this.currencySearching=true;
    this._currencyService.GetCurrencies().subscribe(res=> {
      this.currenciesList=res;
      this.currencyFilteredServerSide.next(this.currenciesList.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
      this.currencySearching=false;
    })
  }

  supplierSearch(value: any) {
    this.supplierSearching=true;
    this._service.GetSuppliersDP().subscribe(res=> {
      this.suppliersList=res;
      this.supplierFilteredServerSide.next(this.suppliersList.filter(x => x.s_supplier_type_name.toLowerCase().indexOf(value) > -1));
      this.supplierSearching=false;
    })
  }

  detailsCurrencyChanged(i: number)
  {
    this.n_currency_id_details = ((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
    if(this.n_currency_id_details == this.localCurrency)
      ((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_currency_coff')?.disable();
    else
      ((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_currency_coff')?.enable();
  }

  currencyChanged(){
    this.n_currency_id = this.suppliersBalanceMasterForm.value.n_currency_id;
  }

  currentSuppliersIndex: number = 0;
  LoadSuppliers(i: number)
  {
    this.currentSuppliersIndex=i;
    const dialogRef = this.dialog.open(SuppliersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isSupplierExist[i] = true;
     ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(this.currentSuppliersIndex) as FormGroup).get('n_supplier_id')?.patchValue(res.data.n_supplier_id);
     ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(this.currentSuppliersIndex) as FormGroup).get('s_supplier_name')?.patchValue(res.data.s_supplier_name);
    });
  }

  onKeySupplierSearch(event: any, i)
  {
    ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(i) as FormGroup).get('s_supplier_name')?.patchValue('');
    
    this._supplierService.GetSupplierName(event.target.value).subscribe((data) => {
      if(data.supplierName != '' && data.supplierName != null){
        this.isSupplierExist[i] = true;
        ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(i) as FormGroup).get('s_supplier_name')?.patchValue(data.supplierName);
      }
      else{
        this.isSupplierExist[i] = false;
        ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(i) as FormGroup).get('n_supplier_id')?.patchValue('');
        ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(i) as FormGroup).get('s_supplier_name')?.patchValue('');
      }
    });
  }

  currentCurrencyIndex: number = 0;
  LoadCurrencies(i: number)
  {
    this.currentCurrencyIndex=i;
    const dialogRef = this.dialog.open(CurrenciesLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isCurrencyExist[i] = true;
      this.changedCurrency[i] = res.data.n_currency_id;
     ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(this.currentCurrencyIndex) as FormGroup).get('n_currency_id')?.patchValue(res.data.n_currency_id);
     ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(this.currentCurrencyIndex) as FormGroup).get('s_currency_name')?.patchValue(res.data.s_currency_name);
    });
  }

  onKeyCurrencySearch(event: any, i)
  {
    clearTimeout(this.timeout);
    ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue('');
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeCurrencyListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeCurrencyListing(value: number, i) {
    this._currencyService.GetCurrencyName(value).subscribe((data) => {
      if(data.currencyName != '' && data.currencyName != null){
        this.changedCurrency[i] = value;
        this.isCurrencyExist[i] = true;
        ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue(data.currencyName);
      }
      else{
        this.isCurrencyExist[i] = false;
        ((this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue('');
      }
    });
   }

   serachOpen(event)
   {

     let element =document.querySelector("#" + event.target.id +"+ .search-list") as HTMLElement
     element.style.opacity="1";
     element.style.zIndex="100";


   }
   searchClose(event)
   {
   let element =document.querySelector("#" + event.target.id +"+ .search-list ") as HTMLElement
   element.style.opacity="0";
   element.style.zIndex="-1";

   }
   searchHide(searchInputNumber)
   {
     let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
   element.style.opacity="0";
   element.style.zIndex="-1";

   }
  //  searchBegin(event,n_supplier_type_id)

  //  {

  //  setTimeout(() => {

  //    this._lookUp.getTypesSerach(event.target.value,event.target.value).subscribe(
  //      (res)=>{
  //    debugger;
  //        this.searchingTypes=res
  //      }
  //    )

  //  }, 2000);


  // if(event.target.value=='')
  // {
  //   this.suppliersBalanceMasterForm.get(n_supplier_type_id)?.patchValue(0)
  // }


  //  }
   selectItem(i,searchInputNumber,inputName,inputNumber)
{
  debugger
  let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber + " #tdF" +i) as HTMLElement;
  let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber + " #tdS" + i) as HTMLElement;

  (this.suppliersBalanceMasterForm.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
  (this.suppliersBalanceMasterForm.get(inputNumber))?.patchValue(AccountNo.innerHTML);
  let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
  element.style.opacity="0";
  element.style.zIndex="-1";
}

  Save()
  {
    if(this.isFinancialYearExist == true)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('it is not allowed to repeate year',2)
    else
      this._notification.ShowMessage("غير مسموح بتكرار العام المالي", 2);
      return;
    }
    if(this.ValidateDetails() == false)
      return;

    this.showspinner = true;
    var formData = new FormData();
    this.suppliersBalanceMasterForm.value.d_doc_date=new DatePipe('en-US').transform(this.suppliersBalanceMasterForm.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.suppliersBalanceMasterForm?.value.n_doc_no ?? 0);
    formData.append('n_DataAreaID', this.suppliersBalanceMasterForm?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.suppliersBalanceMasterForm?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.suppliersBalanceMasterForm?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.suppliersBalanceMasterForm?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.suppliersBalanceMasterForm?.value.d_UserUpdateDate ?? '');
    formData.append('d_doc_date', this.suppliersBalanceMasterForm?.value.d_doc_date ?? '');
    formData.append('d_Financial_year', this.suppliersBalanceMasterForm?.value.d_Financial_year ?? '');
    formData.append('n_currency_id', this.suppliersBalanceMasterForm?.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.suppliersBalanceMasterForm?.value.n_currency_coff ?? 0);
    formData.append('n_supplier_type_id', this.suppliersBalanceMasterForm?.value.n_supplier_type_id ?? 0);
    formData.append('s_arabic_description', this.suppliersBalanceMasterForm?.value.s_arabic_description ?? '');
    formData.append('s_english_description', this.suppliersBalanceMasterForm?.value.s_english_description ?? '');
    formData.append('b_FromCloseYear', this.suppliersBalanceMasterForm?.value.b_FromCloseYear ?? false);
    formData.append('n_total_debit', this.suppliersBalanceMasterForm?.value.n_total_debit ?? 0);
    formData.append('n_total_credit', this.suppliersBalanceMasterForm?.value.n_total_credit ?? 0);
    formData.append('n_current_branch', this.suppliersBalanceMasterForm?.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.suppliersBalanceMasterForm?.value.n_current_company ?? 0);
    formData.append('n_current_year', this.suppliersBalanceMasterForm?.value.n_current_year ?? 0);

    if(this.app_suppliers_details.length > 0)
    {
      for(var i = 0; i < this.suppliersBalanceMasterForm.value.app_suppliers_details.length; i++) {
        formData.append('app_suppliers_details[' + i + '].n_doc_no', this.suppliersBalanceMasterForm?.value.n_doc_no ?? 0);
        formData.append('app_suppliers_details[' + i + '].nLineNo', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].nLineNo ?? 0);
        formData.append('app_suppliers_details[' + i + '].n_DataAreaID', this.suppliersBalanceMasterForm?.value.n_DataAreaID ?? 0);
        formData.append('app_suppliers_details[' + i + '].d_UserAddDate', this.suppliersBalanceMasterForm?.value.d_UserAddDate ?? '');
        formData.append('app_suppliers_details[' + i + '].n_supplier_id', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].n_supplier_id ?? 0);
        formData.append('app_suppliers_details[' + i + '].n_currency_id', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].n_currency_id ?? 0);
        formData.append('app_suppliers_details[' + i + '].n_currency_coff', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].n_currency_coff ?? 0);
        formData.append('app_suppliers_details[' + i + '].n_debit', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].n_debit ?? 0);
        formData.append('app_suppliers_details[' + i + '].n_credit', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].n_credit ?? 0);
        formData.append('app_suppliers_details[' + i + '].s_arabic_description', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].s_arabic_description ?? '');
        formData.append('app_suppliers_details[' + i + '].s_english_description', this.suppliersBalanceMasterForm?.value.app_suppliers_details[i].s_english_description ?? '');
      }

    }

    if(this.docuNumber <= 0) {
      this.disableButtons();
      this._service.Create(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ap/suppliersbalancelist']);
        }
      });
    }
    else{
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ap/suppliersbalancelist']);
        }
      });
    }
  }

  ValidateDetails(): boolean
  {
    var detailsValid = true;
    if(this.app_suppliers_details.length <= 0)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('the jouranl ledger must contain a single line at lease',2)
    else
      this._notification.ShowMessage(`يجب ان يحتوي القيد علي سطر واحد على الاقل`, 2);
        detailsValid = false;
        return false;
    }

    for(var i = 0; i < this.app_suppliers_details.length; i++)
    {
      if(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].n_supplier_id == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert supplier number at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فلضك ادخل رقم المورد في السطر رقم ${i+1}`, 3);
        detailsValid = false;
        return false;
      }
      if(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].s_supplier_name == '')
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert supplier name at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فلضك ادخل اسم المورد في السطر رقم ${i+1}`, 3);
        detailsValid = false;
        return false;
      }
      if(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].n_currency_id == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert currency code at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فلضك ادخل كود العملة في السطر رقم ${i+1}`, 3);
        detailsValid = false;
        return false;
      }
      if(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].s_currency_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert currency name at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فلضك ادخل اسم العملة في السطر رقم ${i+1}`, 3);
        detailsValid = false;
        return false;
      }
      if(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].n_currency_coff == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert factor at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فلضك ادخل المعامل في السطر رقم ${i+1}`, 3);
        detailsValid = false;
        return false;
      }
      if(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].n_debit == '' && this.suppliersBalanceMasterForm.value.app_suppliers_details[i].n_credit == '')
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert debit and credit value at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فلضك ادخل قيمة الدائن او المدين في السطر رقم ${i+1}`, 3);
        detailsValid = false;
        return false;
      }
    }
    return detailsValid;
  }

   calcTotalDebit()
   {
    var totalDebit = 0;
    for(var i = 0; i < this.app_suppliers_details.length; i++)
    {
      totalDebit += Number(((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_debit')?.value);
    }
    this.suppliersBalanceMasterForm.get('n_total_debit')?.patchValue(totalDebit);
   }

   calcTotalCredit()
   {
    var totalCredit = 0;
    for(var i = 0; i < this.app_suppliers_details.length; i++)
    {
      totalCredit += Number(((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_credit')?.value);
    }
    this.suppliersBalanceMasterForm.get('n_total_credit')?.patchValue(totalCredit);
   }

  isNumberKey(evt)
  {
     var charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode != 46 && charCode > 31
       && (charCode < 48 || charCode > 57) || charCode == 45)
        return false
     return true;
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  setCurrency()
  {
    if(this.docuNumber <= 0)
    {
      var i = this.app_suppliers_details.length - 1;
      this.isCurrencyExist[i] = true;
      this.changedCurrency[i] = this.localCurrency;
    }
    else{
      var i = this.app_suppliers_details.length - 1;
      this.isCurrencyExist[i] = true;
      this.changedCurrency[i] = this.localCurrency;
      this.executeCurrencyListing(this.localCurrency, i);
    }
  }

  resetDebit(i: number)
  {
    ((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_debit')?.patchValue('');
    this.calcTotalDebit();
    this.calcTotalCredit();
  }

  resetCredit(i: number)
  {
    ((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_credit')?.patchValue('');
    this.calcTotalDebit();
    this.calcTotalCredit();
  }

  GetCurrentSuppliers()
  {
    var supplierType = this.suppliersBalanceMasterForm?.value.n_supplier_type_id ?? 0;
    if(supplierType == '' || supplierType == null || supplierType <= 0)
    {
      if(this.isEnglish)
        this._notification.ShowMessage('Please insert supplier type',3)
      else
      this._notification.ShowMessage('من فضلك اختر نوع المورد اولآ', 3);
      return;
    }
    this._service.GetBranchSuppliers(supplierType).subscribe((data) => {
      if(data.length > 0)
      {
        this.app_suppliers_details.clear();
        data.forEach((res) => {
          this.app_suppliers_details.push(this.insertNewDetailsRow(this.app_suppliers_details.length + 1));
        });
        (this.suppliersBalanceMasterForm.get("app_suppliers_details") as FormArray)?.patchValue(data);
        for(var i = 0; i < this.app_suppliers_details.length; i++)
        {
          this.executeCurrencyListing(this.suppliersBalanceMasterForm.value.app_suppliers_details[i].n_currency_id, i);
          ((this.suppliersBalanceMasterForm.get('app_suppliers_details') as FormArray).at(i) as FormGroup).get('n_currency_coff')?.patchValue(1);
        }
      }
      else{
        if(this.isEnglish)
         this._notification.ShowMessage("There aren't supplier ",3)
        else
        this._notification.ShowMessage('لا يوجد موردين من هذا النوع', 3);
        return;
      }
    });
  }

}
