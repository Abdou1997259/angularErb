import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { GornalLookUpComponent } from 'src/app/Controls/gornal-look-up/gornal-look-up.component';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { RelatedAccountsLookUpComponent } from 'src/app/Controls/related-accounts-look-up/related-accounts-look-up.component';
import { StoresLookUpComponent } from 'src/app/Controls/stores-look-up/stores-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { RecieveQtyService } from 'src/app/Core/Api/AP/recieve-qty.service';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { GeneralSC } from 'src/app/Core/Api/SC/genereal-sc.service';
import { numberSymbols } from '@progress/kendo-angular-intl';
import { Translate } from 'src/app/Core/translate/translate.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';
@Component({
  selector: 'app-sc-stock-in-add',
  templateUrl: './sc-stock-in-add.component.html',
  styleUrls: ['./sc-stock-in-add.component.css']
})
export class ScStockInAddComponent implements OnInit {

  ifFromEditDocNo: number = 0;
  transactionForm!: FormGroup;
  today!: any;
  totalQty: number = 0;
  totalPrice: number = 0;
  storeArr!: any;
  accArr!: any;
  selectedVal: any;
  UnitPrice:any=1;
  DocNo: any;
  DataAreaNo: any;

  isMultiStock: boolean = false;
  showspinner: boolean = false;
  isMultiAcc: boolean = false;
  isWithtransSource: boolean = false;

  transSourcesList!: any;
  transSourceFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  transSourceSearching:boolean=false;
  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  currencySearching:boolean=false;
  employeesList!: any;
  employFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  employSearching:boolean=false;
  relatedAccList!: any;
  relatedAccFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  relatedAccSearching:boolean=false;
  storesList!: any;
  storesFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;
  @ViewChild("document_no") documentInput!:ElementRef;
  visble:boolean=false;
  storesSearching:boolean=false;
  isLocalcurrency: boolean = false;
  itemId: any[] = [];
  unitId: any[] = [];
  prices: any[] = [];
  localCurrency;
  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  timeout: any;
  isEnglish:boolean=false;
  constructor(
    private _stockInService: SCstockInService,
    private _router: Router,private _scGeneral:GeneralSC,
    private _notification: NotificationServiceService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _currency: CurrencyLKPService
    , private _stockOutToStock:StockOutToStock,
    private _recieveQty: RecieveQtyService)
    {
    this.transactionForm = this._formBuilder.group({
      n_documented_no: new FormControl(''),
      n_document_no:new FormControl(''),
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_transaction_type: new FormControl(22),
      b_forProduction: new FormControl(''),
      n_trans_source_no: new FormControl(''),
      d_transaction_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      b_Multi_acc: new FormControl(''),
      s_book_doc_no: new FormControl(''),
      s_Account_no: new FormControl('', Validators.required),
      n_transaction_currency_id: new FormControl('', Validators.required),
      n_employee_id: new FormControl(''),
      n_currency_coff: new FormControl(''),
      b_using_multi_store: new FormControl(''),
      n_store_id: new FormControl('', Validators.required),
      s_arabic_transaction_desceription: new FormControl(''),
      s_english_transaction_desceription: new FormControl(''),
      n_transaction_total_qty: new FormControl(''),
      n_total_value: new FormControl(''),
      transactionDetailsList: this._formBuilder.array([]),
      accountsList: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this._stockInService.GetLocalCurrencie().subscribe((val) => {
     this.localCurrency = val.n_currency_id;
     LangSwitcher.translatefun();


    ( this.selectserver.selectForm.get("n_transaction_currency_id")?.patchValue(val.n_currency_id));


    console.log(this.selectserver.selectForm);


   })
    this.today = new Date();
    this.transSourceSearch('');
    this.currencySearch('');
    this.employeeSearch('');
    this.relatedAccSearch('');
    this.storesSearch('');



    this.ifFromEditDocNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));


    if(this.ifFromEditDocNo != null && this.ifFromEditDocNo > 0) {
      this._stockInService.GetTranactionById(this.ifFromEditDocNo).subscribe((data) => {
        this.visble=true;
        this.documentInput.nativeElement.style.display="block";
        this.transactionForm.patchValue(data);
        this.transactionForm.get("d_transaction_date")?.patchValue(new Date(Number(data.d_transaction_date.substring(0,4)), Number(data.d_transaction_date.substring(5,7))-1, Number(data.d_transaction_date.substring(8,10))));
        this.isMultiAcc = this.transactionForm.get('b_Multi_acc')?.value;
        this.isMultiStock = this.transactionForm.get('b_using_multi_store')?.value;
        this.DocNo = this.transactionForm.get("n_document_no")?.value;
        this.DataAreaNo = this.transactionForm.get("n_DataAreaID")?.value;

        data.scTransactionDetailsViewModelList.forEach((data) => {
          this.transactionDetailsList.push(this.newTranactionRow(this.transactionDetailsList.length + 1));
        });
        data.scTransactionAccountsViewModel.forEach((data) => {
          this.accountsList.push(this.newAccountRow(this.accountsList.length + 1));
        });
        (this.transactionForm.get("transactionDetailsList") as FormArray)?.patchValue(data.scTransactionDetailsViewModelList);
        for(var i = 0; i < this.transactionDetailsList.length; i++){
          this.itemId[i] = this.transactionForm.value.transactionDetailsList[i].s_item_id;
          this.unitId[i] = this.transactionForm.value.transactionDetailsList[i].n_unit_id;
          this.isItemExist[i] = true;
          this.isUnitExist[i] = true;
        }

        (this.transactionForm.get("accountsList") as FormArray)?.patchValue(data.scTransactionAccountsViewModel);
      });
      return;
    }
    else
    {
      this.visble=false
    }

    if(this.DocNo == null || this.DocNo <= 0) {
      this.addTransactionDetails();
    }
    if(this.isMultiAcc) {
      this.addAccountRow();
    }
  }

  onChange(event) {
    if(event.target.checked)
    {
      this.isMultiStock = true;
    }
    else{
      this.isMultiStock = false;
    }
  }

  onMultiAccChange(event) {
    if(event.target.checked)
    {
      this.isMultiAcc = true;
    }
    else{
      this.isMultiAcc = false;
    }
  }
  onCurrencuSelection($event)
  {
    debugger
    if(this.selectserver.selectForm.value.n_transaction_currency_id===this.localCurrency)
    {
      this.isLocalcurrency=false

    }
    else
    this.isLocalcurrency=true
  }

  transSourceSearch(value: any) {
    this.transSourceSearching=true;
    this._stockInService.GetTransSourceDropList().subscribe(res=>{
      this.transSourcesList = res;
      this.transSourceFilteredServerSide.next(this.transSourcesList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.transSourceSearching=false;
    })
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

  employeeSearch(value: any){
    this.employSearching=true;
    this._stockInService.GetEmployees().subscribe(res=>{
      this.employeesList=res;
      this.employFilteredServerSide.next(this.employeesList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.employSearching=false;
    })
  }

  relatedAccSearch(value: any){
    this.relatedAccSearching=true;
    this._stockInService.GetRelatedAcc().subscribe(res=>{
      this.relatedAccList=res;
      this.relatedAccFilteredServerSide.next(this.relatedAccList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.relatedAccSearching=false;
    })
  }

  storesSearch(value: any){
    this.storesSearching=true;
    this._stockInService.GetStores().subscribe(res=>{
      this.storesList=res;
      this.storesFilteredServerSide.next(this.storesList.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.storesSearching=false;
    })
  }

  get transactionDetailsList() : FormArray {
    return this.transactionForm.get("transactionDetailsList") as FormArray;
  }

  get accountsList(): FormArray {
    return this.transactionForm.get("accountsList") as FormArray;
  }

  newTranactionRow(line: number = 0): FormGroup {
    return this._formBuilder.group({
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_store_id: '',
      s_store_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_qty: '',
      n_unit_price: '',
      n_transaction_value: 0,
      s_job_order: ''
    });
  }
  newAccountRow(line: number = 0): FormGroup {
    return this._formBuilder.group({
      n_document_no: '',
      n_serial: line,
      s_account_no: '',
      s_account_name: '',
      n_D_value: '',
      s_detailed_arabic_description: '',
      s_detailed_english_description: ''
    });
  }

  addTransactionDetails() {
    this.transactionDetailsList.push(this.newTranactionRow(this.transactionDetailsList.length + 1));
  }

  addAccountRow() {
    this.accountsList.push(this.newAccountRow(this.accountsList.length + 1));
  }

  currentItemIndex: number = 0;
  loadItems(i: number) {

    this.currentItemIndex=i;
    var storeId = this.transactionForm.get('n_store_id')?.value;
    if(storeId=="" || storeId== null)
    {
      if(this.isEnglish)
        this._notification.ShowMessage('Please choose store first',3);
      else
        this._notification.ShowMessage('اختر مخزن اولاً من فضلك',3);
      return;
    }

     const dialogRef = this.dialog.open(ItemsdetailsLookUpComponent, {
       width: '700px',
       height:'600px',
       data: { 'storeId': storeId  }
     });
     
     dialogRef.afterClosed().subscribe(res => {
      this.itemId[i] = res.data.s_item_id;
      this.isItemExist[i] = true;
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue('');
       this._scGeneral.GetLastCost(res.data.s_item_id,this.transactionForm.get("d_transaction_date")?.value,this.transactionForm.get("n_store_id")?.value==""? 0:Number(this.transactionForm.get("n_store_id")?.value)).subscribe((data)=>{
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_price')?.patchValue(data);
        this.prices[this.currentItemIndex]=data;
       });
    });
  }

  currentUnitIndex: number = 0;
  loadUnits(i: number,itemId:any) {
    this.currentUnitIndex=i;

     const dialogRef = this.dialog.open(UnitsLookUpComponent, {
       width: '700px',
       height:'600px',
       data: { 'itemId': itemId  }
     });
     dialogRef.afterClosed().subscribe(res => {
      this.unitId[i] = res.data.n_unit_id;
      this.isUnitExist[i] = true;
      this._stockOutToStock.GetCoff(res.data.n_unit_id,itemId).subscribe((data)=>{
        debugger

        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_price')?.patchValue( this.prices[this.currentItemIndex] * data);
        this.getTotal(this.currentItemIndex,false)
       })
     });
  }
  currentRowIndex: number = 0;
  onInput(i: number) {
    this.currentRowIndex = i;
    var itemId;
    for(var j = 0; j < this.transactionDetailsList.length; j++)
    {
      itemId = this.transactionForm.value.transactionDetailsList[i].s_item_id;
    }
    this.itemId[i] = itemId;
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentRowIndex) as FormGroup).get('s_item_name')?.patchValue('');
    this._stockInService.GetItemName(itemId).subscribe((data) => {
      debugger;
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentRowIndex) as FormGroup).get('s_item_name')?.patchValue(data.str);
      this.isItemExist[i] = true;
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue('');
    });
  }

  currentunitRowIndex: number = 0;
  onUnitInput(i: number) {
    this.currentunitRowIndex = i;
    var unitId;
    for(var j = 0; j < this.transactionDetailsList.length; j++)
    {
      unitId = this.transactionForm.value.transactionDetailsList[i].n_unit_id;
    }
    this.unitId[i] = unitId;
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentunitRowIndex) as FormGroup).get('s_unit_name')?.patchValue('');
    this._stockInService.GetUnitName(unitId).subscribe((data) => {
      debugger;
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentunitRowIndex) as FormGroup).get('s_unit_name')?.patchValue(data.str);
      this.isUnitExist[i] = true;
    })
  }

  currentStoreIndex: number = 0;
  loadStores(i: number) {
    this.currentStoreIndex=i;
     const dialogRef = this.dialog.open(StoresLookUpComponent, {
       width: '700px',
       height:'600px',
       data: {    }
     });
     dialogRef.afterClosed().subscribe(res => {

      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentStoreIndex) as FormGroup).get('n_store_id')?.patchValue(res.data.n_store_id);
      ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentStoreIndex) as FormGroup).get('s_store_name')?.patchValue(res.data.s_store_name);
     });
  }
  currentAccIndex: number = 0;
  loadAccounts(i: number) {
    this.currentAccIndex=i;
     const dialogRef = this.dialog.open(RelatedAccountsLookUpComponent, {
       width: '700px',
       height:'600px',
       data: {    }
     });
     dialogRef.afterClosed().subscribe(res => {

      ((this.transactionForm.get("accountsList") as FormArray).at(this.currentAccIndex) as FormGroup).get('s_account_no')?.patchValue(res.data.s_account_no);
      ((this.transactionForm.get("accountsList") as FormArray).at(this.currentAccIndex) as FormGroup).get('s_account_name')?.patchValue(res.data.s_account_name);
     });
  }

  ChangeItem(i:number)
  {
    this.currentItemIndex=i;
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue('');
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue('');
  }
  ChangeUnits(i:number)
  {
    this.currentUnitIndex=i;
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue('');
  }
  ChangeStore(i:number)
  {
    this.currentStoreIndex=i;
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentStoreIndex) as FormGroup).get('n_store_id')?.patchValue('');
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentStoreIndex) as FormGroup).get('s_store_name')?.patchValue('');
  }
  ChangeAccount(i:number)
  {
    this.currentAccIndex=i;
    ((this.transactionForm.get("accountsList") as FormArray).at(this.currentAccIndex) as FormGroup).get('s_account_no')?.patchValue('');
    ((this.transactionForm.get("accountsList") as FormArray).at(this.currentAccIndex) as FormGroup).get('s_account_name')?.patchValue('');
  }

  removeTransaction(row: number) {
    this.getTotal(row, true);
    this.transactionDetailsList.removeAt(row);
  }
  removeAccountRow(row: number) {
    this.accountsList.removeAt(row);
  }

  valueChanged() {
    this.selectedVal = this.transactionForm.value.n_trans_source_no;
    if(this.selectedVal !== 0 && this.selectedVal !== ''){
      this.isWithtransSource = true;
    } else {
      this.isWithtransSource = false;
    }
  }

  calcIndex: number = 0;
  getTotal(i:number,fromDelte:boolean) {
    let pricControl:number=0;
    let qtyControl:number=0
    let result:number=0
    let accumlatedQty:number=0;
    let itemIDVal:number=0;
    let unitIDVal:number=0;
    let accumlatedPrice:number=0;
    this.calcIndex=i;
    itemIDVal=Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('s_item_id')?.value)
    unitIDVal=Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_id')?.value)
    pricControl= Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_price')?.value)
    qtyControl=Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_qty')?.value)
    if(fromDelte==false)
    {
      pricControl= Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_price')?.value)
      qtyControl=Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_qty')?.value)
      result=pricControl*qtyControl;
      ((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_transaction_value')?.patchValue(result);
      for( let item of (this.transactionForm.get('transactionDetailsList') as FormArray ).controls)
        {
          accumlatedQty+=Number(item.get('n_qty')?.value)
          accumlatedPrice+=Number(item.get('n_transaction_value')?.value);
        }
      this.transactionForm.get('n_transaction_total_qty')?.patchValue(accumlatedQty);
      this.transactionForm.get('n_total_value')?.patchValue(accumlatedPrice);
    }
    if(fromDelte==true)
    {
      let total:number
       pricControl=0;
       qtyControl=0;

       pricControl= Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_price')?.value)
       qtyControl=Number(((this.transactionForm.get('transactionDetailsList') as FormArray).at(this.calcIndex) as FormGroup).get('n_qty')?.value)
       result=pricControl*qtyControl;
      this.transactionForm.get('n_total_value')?.patchValue( this.transactionForm.get('n_total_value')?.value-result);
      this.transactionForm.get('n_transaction_total_qty')?.patchValue( this.transactionForm.get('n_transaction_total_qty')?.value-qtyControl);
    }
  }

  Save() {
    if(this.transactionForm.value.s_Account_no == null || this.transactionForm.value.s_Account_no == "") {

      if(this.isEnglish)
      this._notification.ShowMessage(`Choose the opposite account`, 2);
      else
       this._notification.ShowMessage(`من فضلك اختر الحساب المقابل `, 2);
        return;
    }
    for(var i = 0; i < this.transactionDetailsList.length; i++) {
      if(this.transactionForm.value.transactionDetailsList[i].s_item_id == "" || this.transactionForm.value.transactionDetailsList[i].s_item_id == null){
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert code in line number    ${i + 1}`, 2);
        else
        this._notification.ShowMessage(`من فضلك ادخل كود الصنف في السطر رقم: ${i + 1}`, 2);


        return;
      }
    }
    for(var i = 0; i < this.transactionDetailsList.length; i++) {
      if(this.transactionForm.value.transactionDetailsList[i].s_item_name == "" || this.transactionForm.value.transactionDetailsList[i].s_item_name == null){
        if(this.isEnglish)
        this._notification.ShowMessage(`الصنف رقم ${this.transactionForm.value.transactionDetailsList[i].s_item_id} في السطر رقم ${i+1} غير موجود`, 2);
        else
        this._notification.ShowMessage(`Item Number ${this.transactionForm.value.transactionDetailsList[i].s_item_id} In Line Numnber ${i+1} Dosent Exit`, 2);


        this.transactionForm.value.transactionDetailsList[i].s_item_id.setErrors({ invalid: true })
        return;
      }
    }
    for(var i = 0; i < this.transactionDetailsList.length; i++) {
      if(this.transactionForm.value.transactionDetailsList[i].n_unit_id == "" || this.transactionForm.value.transactionDetailsList[i].n_unit_id == null){
        if(this.isEnglish)
        this._notification.ShowMessage(`من فضلك ادخل كود الوحدة في السطر رقم: ${i + 1}`, 2);
      else
      this._notification.ShowMessage(`Please insert unit in line number : ${i + 1}`, 2);
        return;
      }
    }

    for(var i = 0; i < this.transactionDetailsList.length; i++) {
      if(this.transactionForm.value.transactionDetailsList[i].n_qty == "" || this.transactionForm.value.transactionDetailsList[i].n_qty == null){
       if(this.isEnglish)
       this._notification.ShowMessage(`من فضلك ادخل الكمية في السطر رقم: ${i + 1}`, 2);
      else
      this._notification.ShowMessage(`Please insert qty in line number: ${i + 1}`, 2);
        return;
      }
    }

    for(var i = 0; i < this.transactionDetailsList.length; i++) {
      if(this.transactionForm.value.transactionDetailsList[i].n_unit_price == "" || this.transactionForm.value.transactionDetailsList[i].n_unit_price == null){
        if(this.isEnglish)
        this._notification.ShowMessage(`من فضلك ادخل سعر الوحدة في السطر رقم: ${i + 1}`, 2);
      else
              this._notification.ShowMessage(`Please insert unit price in line number: ${i + 1}`, 2);
        return;
      }
    }

    this.showspinner = true;
    this.disableButtons();
    var formData: any = new FormData();
    this.transactionForm.value.d_transaction_date=new DatePipe('en-US').transform(this.transactionForm.value.d_transaction_date, 'yyyy/MM/dd');
    formData.append('n_documented_no', this.transactionForm?.value.n_documented_no ?? '');
    formData.append('n_DataAreaID', this.transactionForm?.value.n_DataAreaID ?? '');
    formData.append('n_UserAdd', this.transactionForm?.value.n_UserAdd ?? '');
    formData.append('d_UserAddDate', this.transactionForm?.value.d_UserAddDate ?? '');
    formData.append('n_transaction_type', this.transactionForm?.value.n_transaction_type ?? '');
    formData.append('b_forProduction', this.transactionForm?.value.b_forProduction ?? '');
    formData.append('n_trans_source_no', this.transactionForm?.value.n_trans_source_no ?? '');
    formData.append('d_transaction_date', this.transactionForm?.value.d_transaction_date ?? '');
    formData.append('n_document_no', this.transactionForm?.value.n_document_no ?? '');
    formData.append('b_Multi_acc', this.transactionForm?.value.b_Multi_acc ?? '');
    // formData.append('n_transfere_type', this.transactionForm.value.n_transfere_type);
    formData.append('s_book_doc_no', this.transactionForm.value?.s_book_doc_no ?? '');
    formData.append('s_Account_no', this.transactionForm?.value.s_Account_no ?? '');
    formData.append('n_transaction_currency_id', this.transactionForm?.value.n_transaction_currency_id ?? '');
    formData.append('n_employee_id', this.transactionForm?.value.n_employee_id ?? '');
    formData.append('n_currency_coff', this.transactionForm?.value.n_currency_coff ?? '');
    formData.append('b_using_multi_store', this.transactionForm?.value.b_using_multi_store ?? '');
    formData.append('n_store_id', this.transactionForm?.value.n_store_id ?? '');
    formData.append('s_arabic_transaction_desceription', this.transactionForm?.value.s_arabic_transaction_desceription ?? '');
    formData.append('s_english_transaction_desceription', this.transactionForm?.value.s_english_transaction_desceription ?? '');
    formData.append('n_transaction_total_qty', this.transactionForm?.value.n_transaction_total_qty ?? '');
    formData.append('n_total_value', this.transactionForm.value?.n_total_value ?? '');

    for(var i = 0; i < this.transactionForm.value.transactionDetailsList.length; i++) {
      formData.append('sc_Items_Transactions_Details[' + i + '].n_transaction_type', this.transactionForm.value.n_transaction_type);
      formData.append('sc_Items_Transactions_Details[' + i + '].nLineNo', this.transactionForm.value.transactionDetailsList[i].nLineNo);
      formData.append('sc_Items_Transactions_Details[' + i + '].s_item_id', this.transactionForm.value.transactionDetailsList[i].s_item_id);
      if(this.transactionForm.value.n_store_id == ''){
        formData.append('sc_Items_Transactions_Details[' + i + '].n_store_id', this.transactionForm.value.transactionDetailsList[i].n_store_id);
      }else{
        formData.append('sc_Items_Transactions_Details[' + i + '].n_store_id', this.transactionForm.value.n_store_id)
      }
      formData.append('sc_Items_Transactions_Details[' + i + '].n_unit_id', this.transactionForm.value.transactionDetailsList[i].n_unit_id);
      formData.append('sc_Items_Transactions_Details[' + i + '].n_qty', this.transactionForm.value.transactionDetailsList[i].n_qty);
      formData.append('sc_Items_Transactions_Details[' + i + '].n_unit_price', this.transactionForm.value.transactionDetailsList[i].n_unit_price);
      formData.append('sc_Items_Transactions_Details[' + i + '].n_transaction_value', this.transactionForm.value.transactionDetailsList[i].n_transaction_value);
      formData.append('sc_Items_Transactions_Details[' + i + '].s_job_order', this.transactionForm.value.transactionDetailsList[i].s_job_order);
    }
      if(this.transactionForm.value.accountsList.length > 0) {
        for(var j = 0; j < this.transactionForm.value.accountsList.length; j++) {
          // formData.append('sc_Items_Transactions_Acc[' + j + '].n_serial', this.transactionForm.value.accountsList[j].n_serial);
          formData.append('sc_Items_Transactions_Acc[' + j + '].s_Account_no', this.transactionForm.value.accountsList[j].s_account_no);
          formData.append('sc_Items_Transactions_Acc[' + j + '].n_D_value', this.transactionForm.value.accountsList[j].n_D_value);
          formData.append('sc_Items_Transactions_Acc[' + j + '].s_detailed_arabic_description', this.transactionForm.value.accountsList[j].s_detailed_arabic_description)
          formData.append('sc_Items_Transactions_Acc[' + j + '].s_detailed_english_description', this.transactionForm.value.accountsList[j].s_detailed_english_description);
      }
    }

    if(this.ifFromEditDocNo != null && this.ifFromEditDocNo > 0)
    {
      this._stockInService.EditTransaction(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/sc/stockinlst']);
        }
      });
    }
    else{
      this._stockInService.CreateTransaction(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/sc/stockinlst']);
        }
      });
    }
  }

  // Journal
  JournalShow() {
    var JournalID=0, edit=false;
    var savedJournals, currentJournals;
    var JournalType = 22;
    var currency=this.transactionForm.get('n_transaction_currency_id')?.value;
    var descAr=this.transactionForm.get('s_arabic_transaction_desceription')?.value;
    var descEn=this.transactionForm.get('s_english_transaction_desceription')?.value;
    var date=new DatePipe('en-US').transform(this.transactionForm.value.d_transaction_date, 'yyyy/MM/dd');
    $('#btnJournal').prop('disabled', true);

    if(this.DocNo !=null && this.DocNo > 0 ){
      edit=true;
      this._stockInService.GetJournalID(Number(this.transactionForm.get('n_documented_no')?.value),JournalType).subscribe(res=>{
        debugger
        JournalID=res;
        this._stockInService.GetSavedJournals(JournalID).subscribe(data=>{
          debugger
          savedJournals=data;
          this._stockInService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
            debugger
            currentJournals=current;
            $('#btnJournal').prop('disabled', false);
            const dialogRef = this.dialog.open(TransJournalsComponent, {
              width: '800px',
              height:'600px',
              data: { edit,JournalID,date,JournalType,currency,descAr,descEn, savedJournals,currentJournals }
            });
          });
        });
      });
    }
    else
    {
      this._stockInService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
        currentJournals=current;
        $('#btnJournal').prop('disabled', false);
        const dialogRef = this.dialog.open(TransJournalsComponent, {
          width: '800px',
          height:'600px',
          data: { edit,JournalID,date,JournalType,currency,descAr,descEn,currentJournals }
        });
      });
    }
  }

  SetJournalData(): any
  {
    var formData: any = new FormData();
    this.transactionForm.value.d_transaction_date=new DatePipe('en-US').transform(this.transactionForm.value.d_transaction_date, 'yyyy/MM/dd');
    formData.append('n_documented_no', this.transactionForm?.value.n_documented_no ?? '');
    formData.append('n_DataAreaID', this.transactionForm?.value.n_DataAreaID ?? '');
    formData.append('n_UserAdd', this.transactionForm?.value.n_UserAdd ?? '');
    formData.append('d_UserAddDate', this.transactionForm?.value.d_UserAddDate ?? '');
    formData.append('n_transaction_type', this.transactionForm?.value.n_transaction_type ?? '');
    formData.append('b_forProduction', this.transactionForm?.value.b_forProduction ?? '');
    formData.append('n_trans_source_no', this.transactionForm?.value.n_trans_source_no ?? '');
    formData.append('d_transaction_date', this.transactionForm?.value.d_transaction_date ?? '');
    formData.append('n_document_no', this.transactionForm?.value.n_document_no ?? '');
    formData.append('b_Multi_acc', this.transactionForm?.value.b_Multi_acc ?? '');
    // formData.append('n_transfere_type', this.transactionForm.value.n_transfere_type);
    formData.append('s_book_doc_no', this.transactionForm.value?.s_book_doc_no ?? '');
    formData.append('s_Account_no', this.transactionForm?.value.s_Account_no ?? '');
    formData.append('n_transaction_currency_id', this.transactionForm?.value.n_transaction_currency_id ?? '');
    formData.append('n_employee_id', this.transactionForm?.value.n_employee_id ?? '');
    formData.append('n_currency_coff', this.transactionForm?.value.n_currency_coff ?? '');
    formData.append('b_using_multi_store', this.transactionForm?.value.b_using_multi_store ?? '');
    formData.append('n_store_id', this.transactionForm?.value.n_store_id ?? '');
    formData.append('n_transfer_purpose', this.transactionForm?.value.n_transfer_purpose ?? '');
    formData.append('s_arabic_transaction_desceription', this.transactionForm?.value.s_arabic_transaction_desceription ?? '');
    formData.append('s_english_transaction_desceription', this.transactionForm?.value.s_english_transaction_desceription ?? '');
    formData.append('n_transaction_total_qty', this.transactionForm?.value.n_transaction_total_qty ?? '');
    formData.append('n_total_value', this.transactionForm.value?.n_total_value ?? '');

    for(var i = 0; i < this.transactionForm.value.transactionDetailsList.length; i++) {
      formData.append('sc_Items_Transactions_Details[' + i + '].n_transaction_type', this.transactionForm.value.n_transaction_type ?? 0);
      formData.append('sc_Items_Transactions_Details[' + i + '].nLineNo', this.transactionForm.value.transactionDetailsList[i].nLineNo ?? 0);
      formData.append('sc_Items_Transactions_Details[' + i + '].s_item_id', this.transactionForm.value.transactionDetailsList[i].s_item_id ?? "");
      formData.append('sc_Items_Transactions_Details[' + i + '].n_store_id', this.transactionForm.value.n_store_id ?? 0)
      formData.append('sc_Items_Transactions_Details[' + i + '].n_unit_id', this.transactionForm.value.transactionDetailsList[i].n_unit_id ?? 0);
      formData.append('sc_Items_Transactions_Details[' + i + '].n_qty', this.transactionForm.value.transactionDetailsList[i].n_qty ?? 0);
      formData.append('sc_Items_Transactions_Details[' + i + '].n_unit_price', this.transactionForm.value.transactionDetailsList[i].n_unit_price ?? 0);
      formData.append('sc_Items_Transactions_Details[' + i + '].n_transaction_value', this.transactionForm.value.transactionDetailsList[i].n_transaction_value ?? 0);
      formData.append('sc_Items_Transactions_Details[' + i + '].s_job_order', this.transactionForm.value.transactionDetailsList[i].s_job_order ?? "");
    }

    return formData;
  }
  //--------------------------------------------------------------------------

  displayJornal(){
    var date = this.transactionForm.get('d_transaction_date')?.value;
    var storeDetails = (this.transactionForm.get('transactionDetailsList') as FormArray)?.value;
    var accDetails = (this.transactionForm.get('accountsList') as FormArray)?.value;
    var totalVal = this.transactionForm.get('n_total_value')?.value;
    var store = +(this.transactionForm.get('n_store_id')?.value);

    if(this.isMultiStock){
      this.storeArr = storeDetails.reduce((res, {n_store_id, n_transaction_value}) => {res[n_store_id] = (res[n_store_id] || 0) + n_transaction_value;
        return res;}, {});
    }else{
      this.storeArr = {"": totalVal};
    }
    if(this.isMultiAcc){
      this.accArr = accDetails.reduce((res, {s_Account_no, n_D_value}) => {res[s_Account_no] = (res[s_Account_no] || 0) + n_D_value;
        return res;}, {});
    }

    const dialogRef = this.dialog.open(GornalLookUpComponent,{
      width:'700px',
      height:'600px',
      data:{'n_docNumber': 1, 'date': date, 'details_list': storeDetails}
    });
  }

  showSourcesTypes() {
    var id = this.selectedVal;
    // this.currentItemIndex=i;
     const dialogRef = this.dialog.open(TransSourceTypesComponent, {
       width: '700px',
       height:'600px',
       data: { id }
     });
     dialogRef.afterClosed().subscribe(res => {
      this._stockInService.GetGenericViewData(res.data[0], res.data[1]).subscribe((data) => {
        data.forEach(element => {
          this.transactionDetailsList.push(this.newTranactionRow(this.transactionDetailsList.length));
        });
        (this.transactionForm.get('transactionDetailsList') as FormArray)?.patchValue(data);
        for(var i = 0; i < this.transactionForm.value.transactionDetailsList.length; i++) {
          this.getTotal(i, false);
        }
      });
      // ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      // ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
     });
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  isNumberKey(evt)
  {
     var charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode != 46 && charCode > 31
       && (charCode < 48 || charCode > 57) || charCode == 45)
        return false
     return true;
  }

  onKeySearch(event: any, i) {

    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    this.executeListing(event.target.value, i);
  }


  private executeListing(value: string, i) {
    this._stockInService.GetItemName(value).subscribe((data) => {
      if(data.itemName != '' && data.itemName != null){
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.itemName);
        this.isItemExist[i] = true;
        this._scGeneral.GetLastCost(value,this.transactionForm.get("d_transaction_date")?.value,this.transactionForm.get("n_store_id")?.value==""? 0:Number(this.transactionForm.get("n_store_id")?.value)).subscribe((data)=>{
          ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(data);
          this.prices[i]=data;
         });
      }
      else{
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
        this.isItemExist[i] = false;
      }
    });

  }

  onKeyUnitSearch(event: any, i) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeUniteListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeUniteListing(value: number, i) {
    var itemId = ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._recieveQty.GetUnitName(value, itemId).subscribe((data) => {
      debugger;
      if(data.unitName != '' && data.unitName != null){
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.unitName);
        this.isUnitExist[i] = true
      }
      else{
        ((this.transactionForm.get("transactionDetailsList") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
        this.isUnitExist[i] = false;
      }
    });
  }
}
