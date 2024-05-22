import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CustomersLkpComponent } from 'src/app/Controls/customers-lkp/customers-lkp.component';
import { SalersLkpComponent } from 'src/app/Controls/salers-lkp/salers-lkp.component';
import { SourceLkpComponent } from 'src/app/Controls/source-lkp/source-lkp.component';
import { SuppliersLkpComponent } from 'src/app/Controls/suppliers-lkp/suppliers-lkp.component';
import { SuppliersTypesLkpComponent } from 'src/app/Controls/suppliers-types-lkp/suppliers-types-lkp.component';
import { MultiTransService } from 'src/app/Core/Api/FIN/multi-trans.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-fin-multi-trans-add',
  templateUrl: './fin-multi-trans-add.component.html',
  styleUrls: ['./fin-multi-trans-add.component.css']
})
export class FinMultiTransAddComponent implements OnInit {
  fin_Multi_trans!: FormGroup;
  showspinner: boolean = false;
  n_doc_no: number = 0;

  localCurrency: number = 0;
  n_currency_id: number = 0;

  transTypesList: any;
  currenciesList: any;
  financialDirctionList: any;
  bankBranchesList: any;
  timeout: any;
  isEnglish:boolean=false;
  isSalerExist: boolean = false;
  searchingsSalesMen:any[]=[]
  isCustomerExist: boolean[] = [];
  isSupplierExist: boolean[] = [];

  salesMenList: any;
  salesManSearching:boolean=false;
  salesManFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: MultiTransService,
    private _notification: NotificationServiceService, private _activatedRoute: ActivatedRoute, private _router: Router,
    private _forBuilder: FormBuilder, private _helperService: HelperService, private dialog: MatDialog, private _lookUp:GenerealLookup)
  {
    this.fin_Multi_trans = this._forBuilder.group({
      n_serial: new FormControl(),
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      n_user_serial: new FormControl(),
      n_month_serial: new FormControl(),
      d_doc_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      d_higri_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      n_rep_serial: new FormControl(),
      n_salesman_id: new FormControl(),
      s_salesman_name: new FormControl(),
      s_book_doc_no: new FormControl(),
      n_doc_no: new FormControl(),
      s_description: new FormControl(),
      s_description_eng: new FormControl(),
      n_currency_id: new FormControl('', Validators.required),
      n_currency_coff: new FormControl(),
      n_direct_trans_type: new FormControl('', Validators.required),
      totalDebit: new FormControl(0),
      totalCredit: new FormControl(0),
      diff: new FormControl(0),

      fin_Multi_Trans_Details: this._forBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_doc_no = Number( this._activatedRoute.snapshot.paramMap.get('id') );
    this.salesManSearch('');

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });

    this._helperService.GetDirectTransTypes().subscribe((data) => {
      this.transTypesList = data;
    });

    this._helperService.GetCurrencies().subscribe((data) => {
      this.currenciesList = data;
    });

    this._helperService.GetFinancialSourcesDebit().subscribe((data) => {
      this.financialDirctionList = data;
    });

    this._helperService.GetBankBranches().subscribe((data) => {
      this.bankBranchesList = data;
    });

    if(this.n_doc_no <= 0)
    {
      this._service.GetCurrentTrans().subscribe((data) => {
        this.fin_Multi_trans.patchValue(data);
        this.fin_Multi_trans.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.fin_Multi_trans.get("d_higri_date")?.patchValue((new Date()).toISOString().substring(0,10));

        this.showspinner = false;
        this.Add_fin_Multi_Trans_Details_Row();
      });
    }

    if(this.n_doc_no > 0)
    {
      this._service.GetByID(this.n_doc_no).subscribe((data) =>{
        this.fin_Multi_trans.patchValue(data);
        this.n_currency_id = data.n_currency_id;
        this.fin_Multi_trans.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        this.fin_Multi_trans.get("d_higri_date")?.patchValue(new Date(Number(data.d_higri_date.substring(0,4)), Number(data.d_higri_date.substring(5,7))-1, Number(data.d_higri_date.substring(8,10))));

        data.fin_Multi_Trans_Details.forEach(element => {
          this.fin_Multi_Trans_Details.push(this.pushIn_fin_Multi_Trans_Details(this.fin_Multi_Trans_Details.length + 1));
        });
        (this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray)?.patchValue(data.fin_Multi_Trans_Details);
        for(var i = 0; i < this.fin_Multi_Trans_Details.length; i++)
        {
          (this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i).get('d_due_date')?.patchValue(new Date(Number(data.fin_Multi_Trans_Details[i].d_due_date.substring(0,4)), Number(data.fin_Multi_Trans_Details[i].d_due_date.substring(5,7))-1, Number(data.fin_Multi_Trans_Details[i].d_due_date.substring(8,10))));
          (this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i).get('d_multi_doc_date')?.patchValue(new Date(Number(data.fin_Multi_Trans_Details[i].d_multi_doc_date.substring(0,4)), Number(data.fin_Multi_Trans_Details[i].d_multi_doc_date.substring(5,7))-1, Number(data.fin_Multi_Trans_Details[i].d_multi_doc_date.substring(8,10))));
          this.isCustomerExist[i] = true;
          this.isSupplierExist[i] = true;
        }

        this.calculations();
        this.showspinner = false;
      });
    }
   LangSwitcher.translatefun();
   LangSwitcher.translateData(1);
   this.isEnglish=LangSwitcher.CheckLan();
  }

  get fin_Multi_Trans_Details(): FormArray
  {
    return this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray;
  }

  pushIn_fin_Multi_Trans_Details(line: number = 0): FormGroup
  {
    return this._forBuilder.group({
      nLineNo: line,
      n_source_id: '',
      s_source_no: '',
      s_source_name: '',
      n_debit: '',
      n_credit: '',
      s_description: '',
      s_description_eng: '',
      s_cheque_no: '',
      d_due_date: '',
      b_Cheque_Status: '',
      n_deposit_bank_id: '',
      n_multi_doc_no: '',
      d_multi_doc_date: '',
      n_supplier_id: '',
      s_supplier_name: '',
      n_credit_card_no: '',
      b_is_property_tax: '',
      n_extract_contract_no: ''
    });
  }

  Add_fin_Multi_Trans_Details_Row()
  {
    this.fin_Multi_Trans_Details.push(this.pushIn_fin_Multi_Trans_Details(this.Add_fin_Multi_Trans_Details_Row.length + 1));
  }

  Remove_fin_Multi_Trans_Details_Row(i: number)
  {
    if(this.fin_Multi_Trans_Details.length == 1)
    {
      if(this.isEnglish)
       this._notification.ShowMessage('Trans must contain one journal at least' ,3)
      else
      this._notification.ShowMessage("يجب ان تحتوي التسوية علي قيد واحد علي الاقل", 3);
      return;
    }
    this.fin_Multi_Trans_Details.removeAt(i);
  }

  currencyChanged(){
    this.n_currency_id = this.fin_Multi_trans.value.n_currency_id;
    if(this.n_currency_id == this.localCurrency)
      this.fin_Multi_trans.get('n_currency_coff')?.patchValue(1);
  }

  salesManSearch(value: any)
  {
    this.salesManSearching=true;
    this._helperService.getSalesmenLKP(value).subscribe((data) => {
      this.salesMenList = data;
      this.salesManFilteredServerSide.next(this.salesMenList.filter(x => x.s_salesman_name.toLowerCase().indexOf(value) > -1));
      this.salesManSearching=false;
    });
  }

  LoadSalers(event:any)
 {
    const dialogRef = this.dialog.open(SalersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isSalerExist = true;
      this.fin_Multi_trans.get("n_salesman_id")?.patchValue(res.data.n_salesman_id );
      this.fin_Multi_trans.get("s_salesman_name")?.patchValue( res.data.n_salesman_id  +" # "+res.data.s_salesman_name);
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
  searchSalesMenBegin(event)
  {
    setTimeout(() => {
      this._lookUp.getSearchSalesMen(event.target.value,event.target.value).subscribe(
        (res)=>{
          this.searchingsSalesMen=res
       }
      )
    }, 2000);
  }
  selectItem(i,searchInputNumber,inputName,inputNumber)
  {
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber+" #tdS" + i) as HTMLElement;

    (this.fin_Multi_trans.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.fin_Multi_trans.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  loadCustomers(i: number)
  {
    var type=((this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray).at(i) as FormGroup).get('n_type')?.value ?? 0;
    var source=((this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;
    const dialogRef = this.dialog.open(SourceLkpComponent, {
      width: '700px',
      height:'600px',
      data: { type, source }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isCustomerExist[i] = true;
      ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup)?.get('s_source_no')?.patchValue(res.data.n_source_id);
      ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup)?.get('s_source_name')?.patchValue(res.data.s_source_name);
    });
  }

  onKeyCustomerSearch(event: any, i)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeCustomersListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeCustomersListing(value: number, i) {
    this._helperService.GetCustomerData(value).subscribe((data) => {
      debugger
      if(data.s_customer_name != null && data.s_customer_name != "")
      {
        ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup)?.get('s_source_name')?.patchValue(data.s_customer_name);
        this.isCustomerExist[i] = true;
      }
      else{
        this.isCustomerExist[i] = false;
        ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup)?.get('s_source_name')?.patchValue('');
      }
    });
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
     ((this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray).at(this.currentSuppliersIndex) as FormGroup).get('n_supplier_id')?.patchValue(res.data.n_supplier_id);
     ((this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray).at(this.currentSuppliersIndex) as FormGroup).get('s_supplier_name')?.patchValue(res.data.s_supplier_name);
    });
  }

  onKeySupplierSearch(event: any, i)
  {
    ((this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray).at(i) as FormGroup).get('s_supplier_name')?.patchValue('');
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeSupplierListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeSupplierListing(value: number, i) {
    this._helperService.getSuppliersData(value).subscribe((data) => {
      debugger
      if(data.s_supplier_name != '' && data.s_supplier_name != null){
        this.isSupplierExist[i] = true;
        ((this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray).at(i) as FormGroup).get('s_supplier_name')?.patchValue(data.s_supplier_name);
      }
      else{
        this.isSupplierExist[i] = false;
        ((this.fin_Multi_trans.get("fin_Multi_Trans_Details") as FormArray).at(i) as FormGroup).get('s_supplier_name')?.patchValue('');
      }
    });
  }

  Save()
  {
    if(this.validateDetails() == false)
      return;

    this.showspinner = true;
    var formData = new FormData();
    this.fin_Multi_trans.value.d_doc_date=new DatePipe('en-US').transform(this.fin_Multi_trans.value.d_doc_date, 'yyyy/MM/dd');
    this.fin_Multi_trans.value.d_higri_date=new DatePipe('en-US').transform(this.fin_Multi_trans.value.d_higri_date, 'yyyy/MM/dd');

    formData.append('n_doc_no', this.fin_Multi_trans?.value.n_doc_no ?? 0);
    formData.append('n_serial', this.fin_Multi_trans?.value.n_serial ?? 0);
    formData.append('n_DataAreaID', this.fin_Multi_trans?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.fin_Multi_trans?.value.n_UserAdd ?? 0);
    formData.append('n_UserUpdate', this.fin_Multi_trans?.value.n_UserUpdate ?? 0);
    formData.append('d_UserAddDate', this.fin_Multi_trans?.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.fin_Multi_trans?.value.d_UserUpdateDate ?? '');
    formData.append('n_user_serial', this.fin_Multi_trans?.value.n_user_serial ?? 0);
    formData.append('n_month_serial', this.fin_Multi_trans?.value.n_month_serial ?? 0);
    formData.append('d_doc_date', this.fin_Multi_trans?.value.d_doc_date ?? '');
    formData.append('d_higri_date', this.fin_Multi_trans?.value.d_higri_date ?? '');
    formData.append('n_rep_serial', this.fin_Multi_trans?.value.n_rep_serial ?? 0);
    formData.append('n_salesman_id', this.fin_Multi_trans?.value.n_salesman_id ?? 0);
    formData.append('s_book_doc_no', this.fin_Multi_trans?.value.s_book_doc_no ?? '');
    formData.append('s_description', this.fin_Multi_trans?.value.s_description ?? '');
    formData.append('s_description_eng', this.fin_Multi_trans?.value.s_description_eng ?? '');
    formData.append('n_currency_id', this.fin_Multi_trans?.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.fin_Multi_trans?.value.n_currency_coff ?? 0);
    formData.append('n_direct_trans_type', this.fin_Multi_trans?.value.n_direct_trans_type ?? 0);

    for(var i = 0; i < this.fin_Multi_Trans_Details.length; i++)
    {
      this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].d_due_date=new DatePipe('en-US').transform(this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].d_due_date, 'yyyy/MM/dd');
      this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].d_multi_doc_date=new DatePipe('en-US').transform(this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].d_multi_doc_date, 'yyyy/MM/dd');
      formData.append(`fin_Multi_Trans_Details[${i}].nLineNo`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].nLineNo ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].n_source_id`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_source_id ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].s_source_no`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].s_source_no ?? '');
      formData.append(`fin_Multi_Trans_Details[${i}].n_debit`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_debit ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].n_credit`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_credit ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].s_description`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].s_description ?? '');
      formData.append(`fin_Multi_Trans_Details[${i}].s_description_eng`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].s_description_eng ?? '');
      formData.append(`fin_Multi_Trans_Details[${i}].s_cheque_no`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].s_cheque_no ?? '');
      formData.append(`fin_Multi_Trans_Details[${i}].d_due_date`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].d_due_date ?? '');
      formData.append(`fin_Multi_Trans_Details[${i}].b_Cheque_Status`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].b_Cheque_Status ?? false);
      formData.append(`fin_Multi_Trans_Details[${i}].n_deposit_bank_id`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_deposit_bank_id ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].n_multi_doc_no`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_multi_doc_no ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].d_multi_doc_date`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].d_multi_doc_date ?? '');
      formData.append(`fin_Multi_Trans_Details[${i}].n_supplier_id`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_supplier_id ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].n_credit_card_no`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_credit_card_no ?? 0);
      formData.append(`fin_Multi_Trans_Details[${i}].b_is_property_tax`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].b_is_property_tax ?? false);
      formData.append(`fin_Multi_Trans_Details[${i}].n_extract_contract_no`, this.fin_Multi_trans?.value.fin_Multi_Trans_Details[i].n_extract_contract_no ?? 0);
    }

    if(this.n_doc_no !=null && this.n_doc_no > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish) 
            this._notification.ShowMessage(data.Emsg,data.status)
        else
           this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/multitransList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
          this._notification.ShowMessage(data.Emsg,data.status)
      else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/multitransList']);
        }
      });
    }
  }

  validateDetails(): boolean
  {
    var isValid = true;
    for(var i = 0; i < this.fin_Multi_Trans_Details.length; i++)
    {
      if(this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_source_id == '' || this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_source_id == null)
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please choose source at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك اختر كود الجهة في السطر رقم ${i + 1} `, 3);
        isValid = false;
      }

      if(this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].s_source_no == '' || this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].s_source_no == null)
      {
        if(this.isEnglish)
          this._notification.ShowMessage(`Please insert source No at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل رقم الجهة في السطر رقم ${i + 1} `, 3);
        isValid = false;
      }

      if(this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].s_source_name == '' || this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].s_source_name == null)
      {
        if(this.isEnglish) 
        this._notification.ShowMessage(`Please insert source name at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فضلك ادخل اسم الجهة في السطر رقم ${i + 1} `, 3);
        isValid = false;
      }

      if( (this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_debit == '' || this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_debit == null || this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_debit == 0)
          &&
          (this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_credit == '' || this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_credit == null || this.fin_Multi_trans.value.fin_Multi_Trans_Details[i].n_credit == 0)
        )
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert debit and credit at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل قيمة الدائن او المدين في السطر رقم ${i + 1} `, 3);
        isValid = false;
      }
    }
    return isValid;
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  calculations()
  {
    var totalDebit = 0;
    var totalCredit = 0;
    var totalDiff = 0;

    for(var i = 0; i < this.fin_Multi_Trans_Details.length; i++)
    {
      totalDebit += Number( ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup).get('n_debit')?.value );
      totalCredit += Number( ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup).get('n_credit')?.value );
    }

    totalDiff = totalDebit - totalCredit;
    this.fin_Multi_trans.get('totalDebit')?.patchValue(totalDebit);
    this.fin_Multi_trans.get('totalCredit')?.patchValue(totalCredit);
    this.fin_Multi_trans.get('diff')?.patchValue(totalDiff);
  }

  resetDebit(i: number)
  {
    ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup).get('n_debit')?.patchValue('');
  }

  resetCredit(i: number)
  {
    ((this.fin_Multi_trans.get('fin_Multi_Trans_Details') as FormArray).at(i) as FormGroup).get('n_credit')?.patchValue('');
  }

}
