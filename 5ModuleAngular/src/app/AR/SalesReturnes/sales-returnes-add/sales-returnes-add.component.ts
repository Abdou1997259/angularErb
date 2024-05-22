import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { CurrenciesLkpComponent } from 'src/app/Controls/currencies-lkp/currencies-lkp.component';
import { CustomersLkpComponent } from 'src/app/Controls/customers-lkp/customers-lkp.component';
import { ExpensesLkpComponent } from 'src/app/Controls/expenses-lkp/expenses-lkp.component';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { SalersLkpComponent } from 'src/app/Controls/salers-lkp/salers-lkp.component';
import { SearchSuppliersDirLkpComponent } from 'src/app/Controls/search-suppliers-dir-lkp/search-suppliers-dir-lkp.component';
import { StoresLookUpComponent } from 'src/app/Controls/stores-look-up/stores-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { SalesInvoiceService } from 'src/app/Core/Api/AR/sales-invoice.service';
import { SalesReturnesService } from 'src/app/Core/Api/AR/sales-returnes.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { ExpensesLKPService } from 'src/app/Core/Api/LookUps/expenses-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { PopJournalUpComponent } from 'src/app/SC/exporting-transactions/pop-journal-up/pop-journal-up.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';
import { LookupControlService

 } from 'src/app/Core/Api/LookUps/lookup-control.service';
import { ItemsDetailsSalesReturnsComponent } from 'src/app/Controls/items-details-sales-returns/items-details-sales-returns.component';
@Component({
  selector: 'app-sales-returnes-add',
  templateUrl: './sales-returnes-add.component.html',
  styleUrls: ['./sales-returnes-add.component.css']
})
export class SalesReturnesAddComponent implements OnInit {
  ar_sales_returnes!: FormGroup;
  journals!: any;
  n_document_no: number = 0;

  showspinner: boolean = false;
  isStoreExist: boolean = false;
  isCustomerExist: boolean = false;
  isSalerExist: boolean = false;
  isMultiStock: boolean = false;
  isDirectionExist: boolean = false;
  hasTax: boolean = false;
  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  isStoreDetailsExist: boolean[] = [];
  isExpensesExist: boolean[] = [];
  isCurrencyExist: boolean[] = [];
  changedCurrency: any[] = [];
  CurrencyData:any=[];

  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  currencySearching:boolean=false;
  localCurrency!: any;
  n_currency_id: number = 0;
  currencyName!: string;

  transSourceList!: any;
  transSourceFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  transSourceSearching:boolean=false;
  transNo: number = 0;

  timeout: any;

  // Cost Center
  searchingCost:boolean=false;
  searchingCost2:boolean=false;
  filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  CostData:any=[];
  Cost2Data:any=[];
  //--------------

  // Calc Variables
  taxPercentage:any=[];
  taxStatus:boolean=false;
  totalValue:number=0;
  expensesValue:number=0;
  totalDiscount:number=0;
  isDiscounted:boolean=false;
  isMultiCost:boolean=false;
  isSelectedTrans:boolean=false;
  items:any=[];
  itemsTax:any=[];
  catTypes: any = [];
  UnitsData:any=[];
  editMode:boolean=false;
  bExtra=false;
  storeID:any=0;

  searchingStoreList: any;
  customersList: any;
  searchingCsutomerList: any[] = [];
  DirSearchList: any;
  serachingSalesmanList: any;

  searchingStore: boolean = false;
  searchingCustomer: boolean = false;
  searchingDirection: boolean = false;
  searchingSalesMan: boolean = false;
  balance:any=0;
  glJournalForm!:FormGroup
  filteredStoreServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCustomerServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDirectionServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredSalesManServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  isEnglish:boolean=false;
  bisMainCurrency=false;
  fromtoAccountinfo;
  @ViewChild("storeSelector") storeSelector!:SelectServerSideComponent
  constructor(private _service: SalesReturnesService, private _notification: NotificationServiceService,
    private _router: Router, private _activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder,
    private _Currency: CurrencyLKPService, private dialog: MatDialog, private _transSource: SCTransTypeService,
    private _Expenses: ExpensesLKPService,
    private _lookUp:GenerealLookup, private _helperService: HelperService
    ,private _SalesInvoiceService : SalesInvoiceService
    ,private _stockOutToStock:StockOutToStock
    ,private _LookupControlService:LookupControlService
    )
    {
      this.ar_sales_returnes = this._formBuilder.group({
        n_document_no: new FormControl(''),
        n_DataAreaID: new FormControl(''),
        n_UserAdd: new FormControl(''),
        d_UserAddDate: new FormControl(''),
        n_UserUpdate: new FormControl(''),
        d_UserUpdateDate: new FormControl(''),

        n_serial_inv_type: new FormControl(''),
        d_document_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        s_book_doc_no: new FormControl(''),
        n_invoice_type_id: new FormControl('', Validators.required),
        n_customer_id: new FormControl('', Validators.required),
        s_customer_name: new FormControl(''),
        n_sales_Man_id: new FormControl(''),
        s_sales_Man_name: new FormControl(''),
        n_store_id: new FormControl('', Validators.required),
        s_store_name: new FormControl(''),
        n_currency_id: new FormControl(''),
        s_currency_name: new FormControl(''),
        n_currency_coff: new FormControl('1'),
        n_trans_source_no: new FormControl(''),
        n_month_serial: new FormControl(''),
        n_store_serial: new FormControl(''),
        b_use_multi_cost_center: new FormControl(''),
        b_using_multi_store: new FormControl(''),
        s_description_arabic: new FormControl(''),
        s_description_eng: new FormControl(''),
        s_cost_center_id: new FormControl(''),
        s_cost_center_name: new FormControl(''),
        s_cost_center_id2: new FormControl(''),
        s_cost_center_name2: new FormControl(''),
        n_total_qty: new FormControl(''),
        b_has_extra_discount: new FormControl(''),
        n_extra_discount: new FormControl(''),
        n_Discount_ratio: new FormControl(''),
        n_discount_tax: new FormControl(''),
        n_discount_tax_ratio: new FormControl(''),
        n_additional_tax: new FormControl(''),
        n_additional_tax_ratio: new FormControl(''),
        b_has_extra_expnses: new FormControl(''),
        n_extra_expenses: new FormControl(''),
        n_total_value: new FormControl(''),
        n_sales_Tax: new FormControl(''),
        n_total_discount: new FormControl(''),
        n_no_of_items: new FormControl(''),
        n_net_value: new FormControl(''),
        n_acc_dir_id: new FormControl('', Validators.required),
        s_acc_dir_name: new FormControl(''),
        n_inv_cat_id: new FormControl(''),
        n_current_year: new FormControl(''),
        n_current_company: new FormControl(''),
        n_current_branch: new FormControl(''),

        ar_sales_returns_details: this._formBuilder.array([]),
        ar_expenses_sales_invoice_return: this._formBuilder.array([])
      });
    }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_document_no = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.CurrencySearch('');
    this.TransSourceSearch('');
    // this.searchCost('');
    // this.searchCost2('');
    this.searchStoreList('');
    //this.searchCustomerList('');
    this.searchDirectionList('');
    this.searchSalesManList('');

    this._service.GetInvCatTypes().subscribe((data) => {
      this.catTypes = data;
    });

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });

    this._service.GetJournalTypes().subscribe((data) => {
      this.journals = data;
    });

    if(this.n_document_no <= 0)
    {
      this._service.GetCurrentSalesReturn().subscribe((data) => {
        this.ar_sales_returnes.patchValue(data);
        this.ar_sales_returnes.get("d_document_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.addNewDetailsRow();
    }

    if(this.n_document_no > 0)
    {
      this.editMode=true;
      this._service.GetByID(this.n_document_no).subscribe((data) => {
        this.n_currency_id = data.n_currency_id;
        this.ar_sales_returnes.patchValue(data);
        this._LookupControlService.SetName(this.ar_sales_returnes, "cust", "n_customer_id", "CustomerName");
        this._LookupControlService.SetName(this.ar_sales_returnes, "cost", "s_cost_center_id", "CostName");
        this._LookupControlService.SetName(this.ar_sales_returnes, "cost", "s_cost_center_id2", "CostName2");

        this.ar_sales_returnes.get('d_document_date')?.patchValue(new Date(Number(data.d_document_date.substring(0,4)), Number(data.d_document_date.substring(5,7))-1, Number(data.d_document_date.substring(8,10))))

        this._SalesInvoiceService.GetMainCurrency().subscribe(res=>{
          if(res != data.n_currency_id)
            this.bisMainCurrency=true;
        });

        // Details
        data.ar_sales_returns_details.forEach(element => {
          this.ar_sales_returns_details.push(this.newSalesReturnListRow(this.ar_sales_returns_details.length + 1));
        });
        (this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray)?.patchValue(data.ar_sales_returns_details);
        // for(var i = 0; i < data.ar_sales_returns_details.length; i++)
        // {
        //   this.executeItemListing(data.ar_sales_returns_details[i]['s_item_id'], i);
        //   this.executeUnitListing(data.ar_sales_returns_details[i]['n_unit_id'], i);
        // }
        //_________

        // Discount
        if(data.b_has_extra_discount)
        {
          this.isDiscounted = true;
        }
        //_____________________

        // Expenses
        if(data.b_has_extra_expnses == true)
        {
          this.bExtra = true;

          data.ar_expenses_sales_invoice_return.forEach(element => {
            this.ar_expenses_sales_invoice_return.push(this.newExpensesRow(this.ar_expenses_sales_invoice_return.length + 1));
          });
          (this.ar_sales_returnes.get('ar_expenses_sales_invoice_return') as FormArray)?.patchValue(data.ar_expenses_sales_invoice_return);

          for(var i = 0; i < data.ar_expenses_sales_invoice_return.length; i++)
          {
            this.executeExpenseListing(data.ar_expenses_sales_invoice_return[i]['s_expense_code'], i);
            //this.executeCurrencyListing(data.ar_expenses_sales_invoice_return[i]['n_currency_id'], i);
          }
          this.setMainValues();
        }
        //_______________

        this.showspinner = false;
        this.editMode=false;
      });
    }
    LangSwitcher.translateData(1)
    LangSwitcher.translatefun()
  }

  // Details And Expenses Details_________________________________________________________
  get ar_sales_returns_details(): FormArray{
    return this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray;
  }

  newSalesReturnListRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_store_id: '',
      s_store_name: '',
      n_qty: '',
      n_unit_price: '',
      n_item_value: 0,
      nItemDiscountP: '',
      nItemDiscountV: '',
      n_item_expenses: 0,
      nInvDiscountV: 0,
      n_item_net_value_WithoutTax: 0,
      n_item_sales_Tax: '',
      n_item_discount_tax: '',
      n_item_additional_tax: '',
      n_item_net_value: 0,
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: '',
      n_bonus_ratio: '',
      n_Bonus: '',
      s_notes: '',
      total_Qty: 0,
      n_item_cost: 0,
      n_trans_source_doc_no: ''
    });
  }

  addNewDetailsRow()
  {
    this.ar_sales_returns_details.push(this.newSalesReturnListRow(this.ar_sales_returns_details.length + 1));
  }

  get ar_expenses_sales_invoice_return(): FormArray{
    return this.ar_sales_returnes.get('ar_expenses_sales_invoice_return') as FormArray;
  }

  newExpensesRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      s_expense_code: '',
      s_expense_name: '',
      b_has_tax: '',
      nExpensesValue: '',
      n_currency_id: this.ar_sales_returnes.get('n_currency_id')?.value,
      s_currency_name: this.ar_sales_returnes.get('s_currency_name')?.value,
      nCoff: this.ar_sales_returnes.get('n_currency_coff')?.value,
      n_sales_tax: '',
      n_value: '',
      n_loaded: '',
      s_descrip: ''
    });
  }

  addExpensesRow()
  {
    this.ar_expenses_sales_invoice_return.push(this.newExpensesRow(this.ar_expenses_sales_invoice_return.length + 1));
    for(var i = 0; i< this.ar_expenses_sales_invoice_return.length; i++){
      this.changedCurrency[i] = this.localCurrency;
      this.isCurrencyExist[i] = true;
    }
  }

  removeExpensiseRow(i)
  {
    this.ar_expenses_sales_invoice_return.removeAt(i);
  }
  //

  CurrencySearch(value: any) {
    this.currencySearching=true;
    this._Currency.GetCurrencies().subscribe(res=> {
      this.currenciesList=res;
      this.CurrencyData=res;
      this.currencyFilteredServerSide.next(this.currenciesList.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
      this.currencySearching=false;
    })
  }


  searchStoreList(value: any) {
    this.searchingStore=true;
    this._service.GetStoresDL(value).subscribe(res=> {
      this.searchingStoreList=res;
      this.filteredStoreServerSide.next(this.searchingStoreList.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.searchingStore=false;
    })
  }

  // searchCustomerList(value: any) {
  //   var res: any;
  //   this.searchingCustomer=true;
  //   this._helperService.getCustomersLKP(value).subscribe(res=> {
  //     this.searchingCsutomerList = res;
  //     this.filteredCustomerServerSide.next(this.searchingCsutomerList.filter(x => x.s_customer_name.toLowerCase().indexOf(value) > -1));
  //     this.searchingCustomer=false;
  //   })
  // }

  searchDirectionList(value: any) {
    this.searchingDirection=true;
    this._service.GetCustomerAccDirectionDL(value).subscribe(res=> {
      this.DirSearchList=res;
      this.filteredDirectionServerSide.next(this.DirSearchList.filter(x => x.s_acc_dir_name.toLowerCase().indexOf(value) > -1));
      this.searchingDirection=false;
    })
  }

  searchSalesManList(value: any) {
    this.searchingSalesMan=true;
    this._helperService.getSalesmenLKP(value).subscribe(res=> {
      this.serachingSalesmanList=res;
      this.filteredSalesManServerSide.next(this.serachingSalesmanList.filter(x => x.s_salesman_name.toLowerCase().indexOf(value) > -1));
      this.searchingSalesMan=false;
    })
  }

  CheckIsMain(){
    if(this.ar_sales_returnes.get('n_currency_id')?.value ==this.localCurrency)
    {
      this.bisMainCurrency=false;
    }
    else
    {
      this.bisMainCurrency=true;
    }  
    this.ar_sales_returnes.get('n_currency_coff')?.patchValue(1);
    this.ar_sales_returnes.value.n_currency_coff=1;
  }

  searchCost(value :any){
    this.searchingCost=true;
    this._service.GetCostCenters(value).subscribe(res=>{
      this.CostData=res;
      this.filteredCostCenterServerSide.next(this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost=false;
    });
  }

  searchCost2(value :any){
    this.searchingCost2=true;
    this._service.GetCostCenters(value).subscribe(res=>{
      this.Cost2Data=res;
      this.filteredCostCenter2ServerSide.next(this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost2=false;
    });
  }

  TransSourceSearch(value: any) {
    this.transSourceSearching=true;
    this._service.GetTransSourceDropList().subscribe(res=> {
      this.transSourceList=res;
      this.transSourceFilteredServerSide.next(this.transSourceList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.transSourceSearching=false;
    })
  }

  TransSourceChanged()
  {
    this.transNo = this.ar_sales_returnes.value.n_trans_source_no;
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


  // searchStoreBegin(event)

  // {

  // setTimeout(() => {

  //   this._lookUp.getStoreSearch(event.target.value,event.target.value).subscribe(
  //     (res)=>{
  //   debugger;
  //       this.searchingStore=res
  //     }
  //   )

  // }, 2000);

  // }

  // searchDirBegin(event)

  // {

  // setTimeout(() => {

  //   this._lookUp.getDirSearch(event.target.value,event.target.value).subscribe(
  //     (res)=>{
  //   debugger;
  //       this.DirSearch=res
  //     }
  //   )

  // }, 2000);

  // }

  // searchSalesManBegin(event)

  // {

  // setTimeout(() => {

  //   this._lookUp.getSearchSalesMen(event.target.value,event.target.value).subscribe(
  //     (res)=>{
  //   debugger;
  //       this.serachingSalesman=res
  //     }
  //   )

  // }, 2000);

  // }
  // searchCustomerBegin(event)

  // {

  // setTimeout(() => {

  //   this._lookUp.getSearchCustromers(event.target.value,event.target.value).subscribe(
  //     (res)=>{
  //   debugger;
  //       this.searchingCsutomer=res
  //     }
  //   )

  // }, 2000);

  // }
  selectItem(i,searchInputNumber,inputName,inputNumber)
  {
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber+" #tdS" + i) as HTMLElement;

    (this.ar_sales_returnes.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.ar_sales_returnes.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  selectMaterItem(i,searchInputNumber,inputName,inputNumber)
    {
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdS" + i) as HTMLElement;

    (this.ar_sales_returnes.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.ar_sales_returnes.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
    }

  showSourcesTypes() {
    var id = this.transNo;
     const dialogRef = this.dialog.open(TransSourceTypesComponent, {
       width: '700px',
       height:'600px',
       data: { id }
     });

     dialogRef.afterClosed().subscribe(res => {
      this._transSource.GetGenericViewData(res.data[0], res.data[1]).subscribe((data) => {
        this.ar_sales_returns_details.clear();
        data.forEach(element => {
          this.ar_sales_returns_details.push(this.newSalesReturnListRow(this.ar_sales_returns_details.length));
        });
        this.ar_sales_returnes.patchValue(data[0]);

        (this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray)?.patchValue(data);
        for(var i = 0; i < this.ar_sales_returnes.value.ar_sales_returns_details.length; i++) {
          ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_trans_source_doc_no')?.patchValue(data[i].n_doc_no);
        }
      });
     });
  }

  LoadStores(event:any)
 {
    const dialogRef = this.dialog.open(StoresLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isStoreExist = true;
      this.ar_sales_returnes.get("n_store_id")?.patchValue(res.data.n_store_id );
      this.ar_sales_returnes.get("s_store_name")?.patchValue(res.data.s_store_name);
    });
  }

  LoadSuppliersDirections() {
    const dialogRef = this.dialog.open(SearchSuppliersDirLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isDirectionExist = true;
      this.ar_sales_returnes.get('s_acc_dir_name')?.patchValue(res.data.s_acc_dir_name +" # "+res.data.n_acc_dir_no);
      this.ar_sales_returnes.get('n_acc_dir_id')?.patchValue(res.data.n_acc_dir_no);
    });
  }

  onKeyStoreSearch(event: any) {
  clearTimeout(this.timeout);
  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeStoreListing(event.target.value);
    }
  }, 1000);
  }

  private executeStoreListing(value: number) {
  this.ar_sales_returnes.get('s_store_name')?.patchValue('');
  this._service.GetStoreName(value).subscribe((data) => {
    if(data.storeName != "")
    {
      this.ar_sales_returnes.get('s_store_name')?.patchValue(data.storeName);
      this.isStoreExist = true;
    }
    else{
      this.isStoreExist = false;
      this.ar_sales_returnes.get('s_store_name')?.patchValue('');
    }
  });
  }

  LoadCustomers(event:any)
 {
    const dialogRef = this.dialog.open(CustomersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isCustomerExist = true;
      this.ar_sales_returnes.get("n_customer_id")?.patchValue(res.data.n_customer_id );
      this.ar_sales_returnes.get("s_customer_name")?.patchValue(res.data.s_customer_name);
    });
  }

  onKeyCustomerSearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeCustomersListing(event.target.value);
      }
    }, 1000);
  }

  private executeCustomersListing(value: number) {
    this.ar_sales_returnes.get('s_customer_name')?.patchValue('');
    this._service.GetCustomerName(value).subscribe((data) => {
      if(data.customerName != "")
      {
        this.ar_sales_returnes.get('s_customer_name')?.patchValue(data.customerName);
        this.isCustomerExist = true;
      }
      else{
        this.isCustomerExist = false;
        this.ar_sales_returnes.get('s_customer_name')?.patchValue('');
      }
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
      this.ar_sales_returnes.get("n_sales_Man_id")?.patchValue(res.data.n_salesman_id );
      this.ar_sales_returnes.get("s_sales_Man_name")?.patchValue(res.data.s_salesman_name);
    });
  }

  onKeySalersSearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeSalerListing(event.target.value);
      }
    }, 1000);
  }

  private executeSalerListing(value: number) {
    this.ar_sales_returnes.get('s_sales_Man_name')?.patchValue('');
    this._service.GetSalerName(value).subscribe((data) => {
      if(data.salerName != "")
      {
        this.ar_sales_returnes.get('s_sales_Man_name')?.patchValue(data.salerName);
        this.isSalerExist = true;
      }
      else{
        this.isSalerExist = false;
        this.ar_sales_returnes.get('s_sales_Man_name')?.patchValue('');
      }
    });
  }

  showDetailsCost(){
    if (this.ar_sales_returnes.get('b_use_multi_cost_center')?.value==true)
    {
      this.isMultiCost=true;
      this.ar_sales_returnes.get('s_cost_center_id')?.patchValue('');
      this.ar_sales_returnes.get('s_cost_center_id2')?.patchValue('');
    }
    else
    {
      this.isMultiCost=false;
      for (let i = 0; i <  this.ar_sales_returnes.value.ar_sales_returns_details.length; i++) {
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
      }
    }
  }

  MultiStockChecked()
  {
    var checked = this.ar_sales_returnes.get('b_using_multi_store')?.value;
    if(checked == true)
      this.isMultiStock = true;
    else
      this.isMultiStock = false;
  }

  HasTax(i: number)
  {
    var hasT = ((this.ar_sales_returnes.get('ar_expenses_sales_invoice_return') as FormArray).at(i) as FormGroup).get('b_has_tax')?.value;
    if(hasT == false)
    {
      ((this.ar_sales_returnes.get('ar_expenses_sales_invoice_return') as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue('');
      this.setExpense();
    }
  }

  // Load Details Data

  currentItemIndex: number = 0;
  loadItems(i: number) {
    this.currentItemIndex=i;

     const dialogRef = this.dialog.open(ItemsDetailsSalesReturnsComponent, {
       width: '1200px',
       height:'600px',
       data: {  }
     });

     dialogRef.afterClosed().subscribe(res => {
      if(res != null || res != undefined)
      {
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
        this.GetItemCost(i);
      }
      else
      {
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');

        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
        ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_item_cost')?.patchValue('');
      }
    });
  }

  onKeyItemSearch(event: any, i) {
    this._service.GetItemName(event.target.value).subscribe((data) => {
      if(data.itemName != '' && data.itemName != null){
        this.isItemExist[i] = true;
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.itemName);
        this.GetItemCost(i);
      }
      else{
        this.isItemExist[i] = false;
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
      }
    });
  }


  LoadUnits(i:number){
    let itemID=  ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {'itemId': itemID}
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
      this.getSelectedUnit(res.data.s_item_id);
      this._service.GetItemPrice(itemID, res.data.n_unit_id).subscribe(res1=>{
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(res1);
      });
     });
  }

  getUnit(i :number){
    var item=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._service.GetUnits(item).subscribe(data=>{
      this.UnitsData =  data;
    });
  }

  getSelectedUnit(item :any){
    this._service.GetUnits(item).subscribe(data=>{
      this.UnitsData =  data;
    });
  }

  resetUnit(i:number){
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
  }
  resetItem(i:number){
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
  }

  resetValues(i:number){
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue('');
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.patchValue('');
  }

  currentUnitIndex: number = 0;
  loadUnits(i: number) {
    this.currentUnitIndex=i;
    let itemID=  ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isUnitExist[i] = true;
      if(res != undefined)
      {
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
      }
    });
  }

  openJournal()
  {
    var store = this.ar_sales_returnes.value.n_store_id;
    if(store == null || store == '' || store <= 0) {

      if(!this.isEnglish)
      this._notification.ShowMessage("من فضلك اختر المخزن", 3);
     else
     this. _notification.ShowMessage("insert inventory please" ,3);

      return;
    }
    this.storeID=this.ar_sales_returnes.value.n_store_id;
   let CreditAndDebit =this.ar_sales_returnes.get("n_total_value")?.value
   let History =this.ar_sales_returnes.get("d_document_date")?.value;
   let Currency=this.ar_sales_returnes.get("n_currency_id")?.value
   let descEng=this.ar_sales_returnes.get("s_description_arabic")?.value
   let descArab=this.ar_sales_returnes.get("s_description_eng")?.value
    this._stockOutToStock.getFromTo(this.storeID).subscribe((res)=>{

      this.fromtoAccountinfo=res
      const dia=this.dialog.open(PopJournalUpComponent,{

        width:(window.innerWidth*0.40).toString(),
        height:'500px',
        panelClass: 'my-custom-dialog-class',
        data: {

          accountNo1: this.fromtoAccountinfo.toAccountNo,
          accountNo2:this.fromtoAccountinfo.fromAccountNo,
          accountName1:this.fromtoAccountinfo.toAccountName,
          accountName2:this.fromtoAccountinfo.fromAccountName,
          History:History,
          Credit:CreditAndDebit,
          Debit:CreditAndDebit,
          Currency:Currency,
          descEng:descEng,
          descArab:descArab


        }
      })


    dia.afterClosed().subscribe((res)=>{
      debugger;
      this.glJournalForm=res
    })



    })





  }

  JournalShow() {
    if(this.ar_sales_returnes.get('n_acc_dir_id')?.value==0 ||this.ar_sales_returnes.get('n_acc_dir_id')?.value=='')
    {
      if(this.isEnglish)
        this. _notification.ShowMessage('Please direction first',3);
      else
        this. _notification.ShowMessage('اختر توجيه اولاً من فضلك',3);
      return;
    }

    if(this.ar_sales_returnes.get('n_customer_id')?.value==0 ||this.ar_sales_returnes.get('n_customer_id')?.value=='' || this.ar_sales_returnes.get('n_customer_id')?.value == null)
    {
      if(this.isEnglish)
        this. _notification.ShowMessage('Please customer first',3);
       else
        this. _notification.ShowMessage('اختر عميل اولاً من فضلك',3);
      return;
    }

    if(this.ar_sales_returnes.get('n_invoice_type_id')?.value==0 ||this.ar_sales_returnes.get('n_invoice_type_id')?.value=='')
    {
      if(this.isEnglish)
        this. _notification.ShowMessage('Please choose invoice type',3);
       else
        this. _notification.ShowMessage('اختر نوع الفاتورة اولاً من فضلك',3);
      return;
    }

    var JournalID=0, edit=false;
    var savedJournals, currentJournals;
    var JournalType=this.ar_sales_returnes.get('n_invoice_type_id')?.value;
    var currency=this.ar_sales_returnes.get('n_currency_id')?.value;
    var descAr=this.ar_sales_returnes.get('s_description_arabic')?.value;
    var descEn=this.ar_sales_returnes.get('s_description_eng')?.value;
    var date=new DatePipe('en-US').transform(this.ar_sales_returnes.value.d_document_date, 'yyyy/MM/dd');
    $('#btnJournal').prop('disabled', true);

    if(this.n_document_no !=null && this.n_document_no > 0 ){
      edit=true;
      this._SalesInvoiceService.GetJournalID(this.n_document_no, JournalType).subscribe(res=>{
        JournalID=res;
        this._service.GetSavedJournals(JournalID).subscribe(data=>{
          savedJournals=data;
          this._service.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
            currentJournals=current;
            $('#btnJournal').prop('disabled', false);
            const dialogRef = this.dialog.open(TransJournalsComponent, {
              width: '800px',
              height:'600px',
              data: { edit, JournalID, date, JournalType, currency, descAr, descEn, savedJournals, currentJournals }
            });
          });
        });
      });
    }
    else
    {
      this._service.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
        debugger
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
    this.ar_sales_returnes.controls['n_total_qty'].enable();
    this.ar_sales_returnes.controls['n_no_of_items'].enable();
    this.ar_sales_returnes.controls['n_total_value'].enable();
    this.ar_sales_returnes.controls['n_net_value'].enable();
    this.ar_sales_returnes.controls['n_total_discount'].enable();
    this.ar_sales_returnes.controls['n_sales_Tax'].enable();
    // this.ar_sales_returnes.controls['n_expenses_tax'].enable();
    this.ar_sales_returnes.controls['n_extra_expenses'].enable();
    this.ar_sales_returnes.controls['n_discount_tax'].enable();
    this.ar_sales_returnes.controls['n_additional_tax'].enable();

    this.ar_sales_returnes.value.d_document_date=new DatePipe('en-US').transform(this.ar_sales_returnes.value.d_document_date, 'yyyy/MM/dd');

    formData.append("n_document_no", this.ar_sales_returnes.value.n_document_no ?? 0);
    formData.append("d_document_date", this.ar_sales_returnes.value.d_document_date ?? 0);
    formData.append("n_invoice_type_id", this.ar_sales_returnes.value.n_invoice_type_id ?? 0);
    formData.append("n_customer_id", this.ar_sales_returnes.value.n_customer_id ?? 0);
    formData.append("n_sales_Man_id", this.ar_sales_returnes.value.n_sales_Man_id ?? 0);
    formData.append("n_store_id", this.ar_sales_returnes.value.n_store_id ?? 0);
    formData.append("n_currency_id", this.ar_sales_returnes.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.ar_sales_returnes.value.n_currency_coff ?? 0);
    formData.append("s_description_arabic", this.ar_sales_returnes.value.s_description_arabic);
    formData.append("s_description_eng", this.ar_sales_returnes.value.s_description_eng);
    formData.append("n_trans_source_no", this.ar_sales_returnes.value.n_trans_source_no ?? 0);
    formData.append("n_acc_dir_id", this.ar_sales_returnes.value.n_acc_dir_id ?? 0);
    formData.append("n_total_qty", this.ar_sales_returnes.value.n_total_qty ?? 0);
    formData.append("n_no_of_items", this.ar_sales_returnes.value.n_no_of_items ?? 0);
    formData.append("n_total_value", this.ar_sales_returnes.value.n_total_value ?? 0);
    formData.append("n_net_value", this.ar_sales_returnes.value.n_net_value ?? 0);
    formData.append("n_total_discount", this.ar_sales_returnes.value.n_total_discount ?? 0);
    formData.append("n_sales_Tax", this.ar_sales_returnes.value.n_sales_Tax ?? 0);
    formData.append("n_expenses_tax", this.ar_sales_returnes.value.n_expenses_tax ?? 0);
    formData.append("n_extra_expenses", this.ar_sales_returnes.value.n_extra_expenses ?? 0);
    formData.append("n_Discount_ratio", this.ar_sales_returnes.value.n_Discount_ratio ?? 0);
    formData.append("n_extra_discount", this.ar_sales_returnes.value.n_extra_discount ?? 0);
    formData.append("n_discount_tax", isNaN(this.ar_sales_returnes.value.n_discount_tax) ? 0 : this.ar_sales_returnes.value.n_discount_tax ?? 0);
    formData.append("n_discount_tax_ratio", this.ar_sales_returnes.value.n_discount_tax_ratio ?? 0);
    formData.append("n_additional_tax", isNaN(this.ar_sales_returnes.value.n_additional_tax) ? 0 : this.ar_sales_returnes.value.n_additional_tax ?? 0);
    formData.append("n_additional_tax_ratio", this.ar_sales_returnes.value.n_additional_tax_ratio ?? 0);
    formData.append("n_manual_sales_tax", this.ar_sales_returnes.value.n_manual_sales_tax ?? 0);

    formData.append("ar_sales_returnes.ar_sales_returns_details", this.ar_sales_returnes.value.ar_sales_returns_details);
    for (var i = 0; i < this.ar_sales_returnes.value.ar_sales_returns_details.length;i++)
    {
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_value')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_discount_tax')?.enable();
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_additional_tax')?.enable();

      formData.append("ar_sales_returns_details[" + i + "].nLineNo", this.ar_sales_returnes.value.ar_sales_returns_details[i].nLineNo ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].s_item_id", this.ar_sales_returnes.value.ar_sales_returns_details[i].s_item_id ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_unit_id", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_unit_id ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_store_id", this.ar_sales_returnes.value.n_store_id ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_qty", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_qty ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_received_qty", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_received_qty ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_unit_price", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_unit_price ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_item_value", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_value ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].nItemDiscountP", this.ar_sales_returnes.value.ar_sales_returns_details[i].nItemDiscountP ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].nItemDiscountV", this.ar_sales_returnes.value.ar_sales_returns_details[i].nItemDiscountV ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_item_expenses", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_expenses ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].nInvDiscountV", this.ar_sales_returnes.value.ar_sales_returns_details[i].nInvDiscountV ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_item_net_value_WithoutTax", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_net_value_WithoutTax ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_item_sales_Tax", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_sales_Tax ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_item_net_value", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_net_value ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_credit_discount", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_credit_discount ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_modification_unit_price", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_modification_unit_price ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_trans_source_doc_no", this.transNo);
      formData.append("ar_sales_returns_details[" + i + "].n_item_discount_tax", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_discount_tax ?? 0);
      formData.append("ar_sales_returns_details[" + i + "].n_item_additional_tax", this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_additional_tax ?? 0);
    }

    this.ar_sales_returnes.controls['n_total_qty'].disable();
    this.ar_sales_returnes.controls['n_no_of_items'].disable();
    this.ar_sales_returnes.controls['n_total_value'].disable();
    this.ar_sales_returnes.controls['n_net_value'].disable();
    this.ar_sales_returnes.controls['n_total_discount'].disable();
    this.ar_sales_returnes.controls['n_sales_Tax'].disable();
    // this.ar_sales_returnes.controls['n_expenses_tax'].disable();
    this.ar_sales_returnes.controls['n_extra_expenses'].disable();
    this.ar_sales_returnes.controls['n_discount_tax'].disable();
    this.ar_sales_returnes.controls['n_additional_tax'].disable();
    return formData;
  }


  ChangeUnit(i:number)
    {
      var itemNo=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
      var unitNo=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;
      this._service.GetUnitName(unitNo, itemNo).subscribe(res=>{
        if(res==null)
        {
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
        }
        else
        {
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name);
          this._service.GetItemPrice(itemNo,unitNo).subscribe(res1=>{
            ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(res1);
          });
        }
      });

    }

  onKeyUnitSearch(event: any, i) {
    clearTimeout(this.timeout);
    // this.resetDetailsValues(i);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeUnitListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeUnitListing(value: number, i) {
    var itemId = ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._service.GetUnitName(value, itemId).subscribe((data) => {
      if(data.unitName != '' && data.unitName != null){
        this.isUnitExist[i] = true;
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.unitName);
      }
      else{
        this.isUnitExist[i] = false;
        ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
    });
  }

  LoadStoresDetails(i)
 {
    const dialogRef = this.dialog.open(StoresLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isStoreDetailsExist[i] = true;
      ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_store_id')?.patchValue(res.data.n_store_id);
      ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue(res.data.n_store_id);
    });
  }

  onKeyStoreDetailsSearch(event: any, i) {
  clearTimeout(this.timeout);
  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeStoreDetailsListing(event.target.value, i);
    }
  }, 1000);
  }

  private executeStoreDetailsListing(value: number, i) {
    ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue('');
  this._service.GetStoreName(value).subscribe((data) => {
    if(data.storeName != "")
    {
      ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue(data.storeName);
      this.isStoreDetailsExist[i] = true;
    }
    else{
      ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue('');
      this.isStoreDetailsExist[i] = false;
    }
  });
  }

  LoadCostCenter1(i:number){
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(res => {
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
     });
  }

  LoadCostCenter2(i:number){
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost1(i:number)
    {
      var costNo=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;
      this._service.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
        }
        else
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.name);
      });
    }

    ChangeDetailsCost2(i:number)
    {
      var costNo=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;
      this._service.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
        }
        else
          ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.name);
      });
    }


  // *****************************************************

  // Calculations________________________________________

  GetItemBalance(storeId,itemId, i){
    this._SalesInvoiceService.GetItemBalance(storeId,itemId).subscribe({
      next:(res)=>{
        if(res=='0')
        {
          if(this.isEnglish)
          {
            this._notification.ShowMessage("item balance is zero", 2)
          }
          else
          {
            this._notification.ShowMessage("رصيد الصنف 0", 2)
          }
          this.resetUnit(i);
          this.resetItem(i);
          this.resetValues(i);
          this.calcRows(i,0);
        }
      }
    });
  }

  GetItemCost(i)
  {
    var storeId = this.ar_sales_returnes.get('n_store_id')?.value ?? 0;
    var itemId = ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('s_item_id')?.value;

    this._service.GetItemCost(storeId, itemId).subscribe((data) => {
      ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('n_item_cost')?.patchValue(data.n_ite_cost);
    });
  }

  resetDiscountV(i)
  {
    ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue('');
  }

  resetDiscountP(i)
  {
    ((this.ar_sales_returnes.get('ar_sales_returns_details') as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue('');
  }

  setExpense(){
    this.expensesValue=0;

    for (let i = 0; i < this.ar_expenses_sales_invoice_return.controls.length; i++) {
      var value=((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('nExpensesValue')?.value;
      //var tax=((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.value;
      var currency=((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
      var coff=((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('nCoff')?.value;

      if(coff=="")
      {
        if(this.isEnglish)
          this. _notification.ShowMessage("Please insert factor for the expense at line : "+(i+1),3);
        else
          this. _notification.ShowMessage("ادخل المعامل من فضلك للمصروف فى السطر رقم: "+(i+1),3);
        continue;
      }
      
      if(((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('b_has_tax')?.value==true)
      {
        var tax=Number((value*coff)*(15/100));
        var expVal=((value*coff)-tax);
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_value')?.patchValue(expVal);
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue(tax);
        this.expensesValue+=Number(expVal);
        continue;
      }
      else
      {
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue('');
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_value')?.patchValue(value*coff);

        this.expensesValue+=Number(value*coff);
        continue;
      }
    }
    for(let i = 0; i < this.ar_sales_returns_details.controls.length; i++){
      this.calcRows(i,1);
    }
  }

  calcDiscountP(){
    var discountP=this.ar_sales_returnes.get('n_Discount_ratio')?.value;
    var total=this.totalValue;
    var discountV=(discountP/100)*total;
    this.ar_sales_returnes.get('n_extra_discount')?.patchValue(discountV);
    if(discountV>total)
    {
      if(this.isEnglish)
        this. _notification.ShowMessage('deduction invoice value is more than net invoice value',2);
      else
        this. _notification.ShowMessage('قيمة خصم الفاتورة اكبر من قيمة صافى الفاتورة',2);
      return;
    }
    for (let i = 0; i < this.ar_sales_returns_details.controls.length; i++)
    {
      this.calcRows(i,1);
    }
  }

  calcDiscountV(){
    var discountV=this.ar_sales_returnes.get('n_extra_discount')?.value;
    var total=this.totalValue;
    var discountP=(discountV/total)*100;
    this.ar_sales_returnes.get('n_Discount_ratio')?.patchValue(discountP);
    if(discountV>total)
    {
      if(this.isEnglish)
        this. _notification.ShowMessage('deduction invoice value is more than net invoice value', 2);
      else
        this. _notification.ShowMessage('قيمة خصم الفاتورة اكبر من قيمة صافى الفاتورة', 2);
      return;
    }
    for (let i = 0; i < this.ar_sales_returns_details.controls.length; i++)
    {
      this.calcRows(i,1);
    }
  }
  //************************************************************************** */

  // Expenses Rows________________________________________
  currentExpensesIndex: number = 0;
  loadExpenses(i: number) {
    this.currentExpensesIndex=i;
    const dialogRef = this.dialog.open(ExpensesLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isExpensesExist[i] = true;
     ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(this.currentExpensesIndex) as FormGroup).get('s_expense_code')?.patchValue(res.data.s_expense_code);
     ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(this.currentExpensesIndex) as FormGroup).get('s_expense_name')?.patchValue(res.data.s_expense_name);
    });
  }

  onKeyExpenseSearch(event: any, i) {
    clearTimeout(this.timeout);
    ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('s_expense_Name')?.patchValue('');

    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeExpenseListing(event.target.value, i);
      }
    }, 1000);
   }

   private executeExpenseListing(value: string, i) {
    this._Expenses.GetExpensesName(value).subscribe((data) => {
      if(data.expenseName != '' && data.expenseName != null){
        this.isExpensesExist[i] = true;
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('s_expense_name')?.patchValue(data.expenseName);
      }
      else{
        this.isExpensesExist[i] = false;
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('s_expense_name')?.patchValue('');
      }
    });
   }

  currentCurrencyIndex: number = 0;
  loadCurrencies(i: number) {
    this.currentCurrencyIndex=i;
    const dialogRef = this.dialog.open(CurrenciesLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isCurrencyExist[i] = true;
      this.changedCurrency[i] = res.data.n_currency_id;
     ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(this.currentCurrencyIndex) as FormGroup).get('n_currency_id')?.patchValue(res.data.n_currency_id);
     ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(this.currentCurrencyIndex) as FormGroup).get('s_currency_name')?.patchValue(res.data.s_currency_name);
    });
  }

  onKeyCurrencySearch(event: any, i) {
    clearTimeout(this.timeout);
    ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue('');
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeCurrencyListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeCurrencyListing(value: number, i) {
    this._Currency.GetCurrencyName(value).subscribe((data) => {
      if(data.currencyName != '' && data.currencyName != null){
        this.changedCurrency[i] = value;
        this.isCurrencyExist[i] = true;
        this.currencyName = data.currencyName;
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue(data.currencyName);
      }
      else{
        this.isCurrencyExist[i] = false;
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue('');
      }
    });
  }

  setCoffDisable(i:number){
    var currency=((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
    if(this.localCurrency==currency)
    {
      ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('nCoff')?.patchValue(1);
      ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('nCoff')?.disable();
    }
    else
    {
      ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
    }
  }

  removeItem(i: number)
  {
    if(this.ar_sales_returns_details.length == 1)
    {
      if(this.isEnglish)
      this. _notification.ShowMessage('Invoice must contain a single item ',2);
      else

      this._notification.ShowMessage("يجب ان تحتوي الفاتورة علي صنف واحد علي الاقل", 2);
      return;
    }
    else
    {
      this.ar_sales_returns_details.removeAt(i);
      this.items.splice(i, 1);
      this.itemsTax.splice(i, 1);
      this.taxPercentage.splice(i, 1);
      for (let i = 0; i < this.items.length; i++) {
        this.items[i]=i;
      }
      this.setItemTotal();
      this.calcDiscountP();
    }
    this.calcRows(i,1);
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

  //Save________________________________
  Save()
  {
    if(this.validateMasterForm() == false)
      return;
    if(this.validateDetailsForm() == false)
      return;

    this.showspinner = true;
    // this.disableButtons();

    var formData = new FormData();
    this.ar_sales_returnes.value.d_document_date=new DatePipe('en-US').transform(this.ar_sales_returnes.value.d_document_date, 'yyyy/MM/dd');
    formData.append('n_document_no', this.ar_sales_returnes?.value.n_document_no ?? 0);
    formData.append('n_DataAreaID', this.ar_sales_returnes?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ar_sales_returnes?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ar_sales_returnes?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ar_sales_returnes?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ar_sales_returnes?.value.d_UserUpdateDate ?? '');

    formData.append('n_serial_inv_type', this.ar_sales_returnes?.value.n_serial_inv_type ?? 0);
    formData.append('d_document_date', this.ar_sales_returnes?.value.d_document_date ?? '');
    formData.append('s_book_doc_no', this.ar_sales_returnes?.value.s_book_doc_no ?? '');
    formData.append('n_invoice_type_id', this.ar_sales_returnes?.value.n_invoice_type_id ?? 0);
    formData.append('n_customer_id', this.ar_sales_returnes?.value.n_customer_id ?? 0);
    formData.append('n_sales_Man_id', this.ar_sales_returnes?.value.n_sales_Man_id ?? 0);
    formData.append('n_store_id', this.ar_sales_returnes?.value.n_store_id ?? 0);
    formData.append('n_currency_id', this.ar_sales_returnes?.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.ar_sales_returnes?.value.n_currency_coff ?? 1);
    formData.append('n_trans_source_no', this.ar_sales_returnes?.value.n_trans_source_no ?? 0);
    formData.append('n_month_serial', this.ar_sales_returnes?.value.n_month_serial ?? 0);
    formData.append('n_store_serial', this.ar_sales_returnes?.value.n_store_serial ?? 0);
    formData.append('b_use_multi_cost_center', this.ar_sales_returnes?.value.b_use_multi_cost_center ?? false);
    formData.append('b_using_multi_store', this.ar_sales_returnes?.value.b_using_multi_store ?? false);
    formData.append('s_description_arabic', this.ar_sales_returnes?.value.s_description_arabic ?? '');
    formData.append('s_description_eng', this.ar_sales_returnes?.value.s_description_eng ?? '');
    formData.append('s_cost_center_id', this.ar_sales_returnes?.value.s_cost_center_id ?? '');
    formData.append('s_cost_center_id2', this.ar_sales_returnes?.value.s_cost_center_id2 ?? '');
    formData.append('n_total_qty', this.ar_sales_returnes?.value.n_total_qty ?? 0);
    formData.append('b_has_extra_discount', this.ar_sales_returnes?.value.b_has_extra_discount ?? false);
    formData.append('n_extra_discount', this.ar_sales_returnes?.value.n_extra_discount ?? 0);
    formData.append('n_Discount_ratio', this.ar_sales_returnes?.value.n_Discount_ratio ?? 0);
    formData.append('n_discount_tax', this.ar_sales_returnes?.value.n_discount_tax ?? 0);
    formData.append('n_discount_tax_ratio', this.ar_sales_returnes?.value.n_discount_tax_ratio ?? 0);
    formData.append('n_additional_tax', this.ar_sales_returnes?.value.n_additional_tax ?? 0);
    formData.append('n_additional_tax_ratio', this.ar_sales_returnes?.value.n_additional_tax_ratio ?? 0);
    formData.append('b_has_extra_expnses', this.ar_sales_returnes?.value.b_has_extra_expnses ?? false);
    formData.append('n_extra_expenses', this.ar_sales_returnes?.value.n_extra_expenses ?? 0);
    formData.append('n_total_value', this.ar_sales_returnes?.value.n_total_value ?? 0);
    formData.append('n_sales_Tax', this.ar_sales_returnes?.value.n_sales_Tax ?? 0);
    formData.append('n_total_discount', this.ar_sales_returnes?.value.n_total_discount ?? 0);
    formData.append('n_no_of_items', this.ar_sales_returnes?.value.n_no_of_items ?? 0);
    formData.append('n_net_value', this.ar_sales_returnes?.value.n_net_value ?? 0);
    formData.append('n_acc_dir_id', this.ar_sales_returnes?.value.n_acc_dir_id ?? 0);
    formData.append('n_inv_cat_id', this.ar_sales_returnes?.value.n_inv_cat_id ?? 0);
    formData.append('n_current_branch', this.ar_sales_returnes?.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.ar_sales_returnes?.value.n_current_company ?? 0);
    formData.append('n_current_year', this.ar_sales_returnes?.value.n_current_year ?? 0);

    for(var i = 0; i < this.ar_sales_returns_details.length; i++)
    {
      formData.append(`ar_sales_returns_details[${ i }].s_item_id`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].s_item_id ?? '');
      formData.append(`ar_sales_returns_details[${ i }].n_unit_id`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_unit_id ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_store_id`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_store_id ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_qty`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_qty ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_unit_price`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_unit_price ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_value`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_value ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].nItemDiscountP`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].nItemDiscountP ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].nItemDiscountV`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].nItemDiscountV ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_expenses`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_expenses ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].nInvDiscountV`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].nInvDiscountV ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_net_value_WithoutTax`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_net_value_WithoutTax ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_sales_Tax`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_sales_Tax ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_discount_tax`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_discount_tax ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_additional_tax`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_additional_tax ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_net_value`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_net_value ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].s_cost_center_id`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].s_cost_center_id ?? '');
      formData.append(`ar_sales_returns_details[${ i }].s_cost_center_id2`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].s_cost_center_id2 ?? '');
      formData.append(`ar_sales_returns_details[${ i }].n_bonus_ratio`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_bonus_ratio ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_Bonus`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_Bonus ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].s_notes`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].s_notes ?? '');
      formData.append(`ar_sales_returns_details[${ i }].total_Qty`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].total_Qty ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_item_cost`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_item_cost ?? 0);
      formData.append(`ar_sales_returns_details[${ i }].n_trans_source_doc_no`, this.ar_sales_returnes?.value.ar_sales_returns_details[i].n_trans_source_doc_no ?? 0);
    }

    if(this.ar_expenses_sales_invoice_return.length > 0)
    {
      for(var i = 0; i < this.ar_expenses_sales_invoice_return.length; i++)
      {
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_value')?.enable();

        formData.append(`ar_expenses_sales_invoice_return[${ i }].s_expense_code`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].s_expense_code ?? '');
        formData.append(`ar_expenses_sales_invoice_return[${ i }].b_has_tax`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].b_has_tax ?? false);
        formData.append(`ar_expenses_sales_invoice_return[${ i }].nExpensesValue`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].nExpensesValue ?? 0);
        formData.append(`ar_expenses_sales_invoice_return[${ i }].n_currency_id`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].n_currency_id ?? 0);
        formData.append(`ar_expenses_sales_invoice_return[${ i }].nCoff`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].nCoff ?? 0);
        formData.append(`ar_expenses_sales_invoice_return[${ i }].n_sales_tax`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].n_sales_tax ?? 0);
        formData.append(`ar_expenses_sales_invoice_return[${ i }].n_value`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].n_value ?? 0);
        formData.append(`ar_expenses_sales_invoice_return[${ i }].n_loaded`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].n_loaded ?? false);
        formData.append(`ar_expenses_sales_invoice_return[${ i }].s_descrip`, this.ar_sales_returnes?.value.ar_expenses_sales_invoice_return[i].s_descrip ?? '');
      }
    }

    if(this.n_document_no !=null && this.n_document_no > 0 ){

      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/salesReturnesList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);
      else
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/salesReturnesList']);
        }
      });
    }
  }

  validateMasterForm(): boolean
  {
    var isValid = true;
    if(this.ar_sales_returnes.get('d_document_date')?.value == '' || this.ar_sales_returnes.get('d_document_date')?.value == null)
    {
      if(this.isEnglish)
         this._notification.ShowMessage("Please insert invoice date", 2);
      else
        this._notification.ShowMessage("من فضلك ادخل تاريخ الفاتورة", 2);
      isValid = false;
    }

    if(this.ar_sales_returnes.get('n_invoice_type_id')?.value == '' || this.ar_sales_returnes.get('n_invoice_type_id')?.value == null)
    {
      if(this.isEnglish)
         this._notification.ShowMessage("Please choose invoice type", 2);
      else

      this._notification.ShowMessage("من فضلك اختر نوع الفاتورة", 2);
      isValid = false;
    }

    if(this.ar_sales_returnes.get('n_currency_id')?.value == '' || this.ar_sales_returnes.get('n_currency_id')?.value == null)
    {
      if(this.isEnglish)
         this._notification.ShowMessage("Please insert currency", 2);
      else

      this._notification.ShowMessage("من فضلك اختر العملة", 2);
      isValid = false;
    }

    if(this.ar_sales_returnes.get('n_customer_id')?.value == '' || this.ar_sales_returnes.get('n_customer_id')?.value == null)
    {
      if(this.isEnglish)
         this._notification.ShowMessage("Please choose customer ", 2);
      else

      this._notification.ShowMessage("من فضلك اختر العميل", 2);
      isValid = false;
    }

    if(this.ar_sales_returnes.get('n_store_id')?.value == '' || this.ar_sales_returnes.get('n_store_id')?.value == null)
    {
      if(this.isEnglish)
         this._notification.ShowMessage("Please choose store", 2);
      else

      this._notification.ShowMessage("من فضلك اختر المخزن", 2);
      isValid = false;
    }
    return isValid;
  }

  validateDetailsForm(): boolean
  {
    var isValid = true;
    for(var i =0; i < this.ar_sales_returns_details.length; i++)
    {
      if(this.ar_sales_returnes.value.ar_sales_returns_details[i].s_item_id == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please item number at line ${i+1}`, 3);
        else

        this._notification.ShowMessage(`من فضلك ادخل رقم الصنف في السطر رقم ${i+1}`, 3);
        isValid = false;
      }

      if(this.ar_sales_returnes.value.ar_sales_returns_details[i].s_item_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please item name at line ${i+1}`, 3);
        else


        this._notification.ShowMessage(`من فضلك ادخل اسم الصنف في السطر رقم ${i+1}`, 3);
        isValid = false;
      }

      if(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_unit_id == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please unit number at line ${i+1}`, 3);
        else


        this._notification.ShowMessage(`من فضلك ادخل رقم الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }

      if(this.ar_sales_returnes.value.ar_sales_returns_details[i].s_unit_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please item name at line ${i+1}`, 3);
        else


        this._notification.ShowMessage(`من فضلك ادخل اسم الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }

      if(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_qty == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please qty at line ${i+1}`, 3);
        else


        this._notification.ShowMessage(`من فضلك ادخل الكمية في السطر رقم ${i+1}`, 3);
        isValid = false;
      }

      if(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_unit_price == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please unit price at line ${i+1}`, 3);
        else


        this._notification.ShowMessage(`من فضلك ادخل سعر الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
    }
    return isValid;
  }
  //_______________________________________


  // Calculations
  calcRows(i:number, TaxStatus:number){
    //Calculate row     
    var qty=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var discountV=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;
    var taxV=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.value;

    var total=0, discP=0,discV=0, netNoTax=0, tax=0, net=0,expenseValue=0,expensePercentage=0, invoiceDiscountValue=0,invoiceDiscountPercentage=0
    , discountTax=0, taxDiscountV=0,taxDiscountP=0, taxAdditionV=0,taxAdditionP=0;

    //الكمية المستلمة واجمالى الكمية
    if(qty!="")
    {
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('total_Qty')?.patchValue(qty);
    }

    //الاجمالى
    if(price!="" && qty!="")
    {
      total=Number(qty)*Number(price);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(total);
    }

    this.setItemTotal();

    //ق المصروفات
    if(this.expensesValue>0)
    {
      expensePercentage=Number(total/this.totalValue);
      expenseValue=Number(expensePercentage*this.expensesValue);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue(expenseValue);
    }
    else
    {
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue(0);
    }


    //ق خصم فاتورة
    this.totalDiscount=this.ar_sales_returnes.get('n_extra_discount')?.value;
    if(this.totalDiscount>0)
    {
      invoiceDiscountPercentage=Number(total/this.totalValue);
      invoiceDiscountValue=Number(invoiceDiscountPercentage*this.totalDiscount);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(invoiceDiscountValue);
      discountTax=invoiceDiscountValue*(this.taxPercentage[i]/100);
    }
    else
    {
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(0);
    }

    //الصافى بدون ضريبة
    if(total>0)
    {
      netNoTax=Number(Number(total)-Number(discountV)-Number(invoiceDiscountValue))+Number(expenseValue);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.patchValue(netNoTax);
    }

    //القيمة المضافة
    if(TaxStatus==1)
    {
      tax=taxV;
    }
    else
    {
      if(this.expensesValue>0 && this.itemsTax[i]==true)
        tax= ((this.taxPercentage[i]/100)*(netNoTax-expenseValue));
      else if(this.itemsTax[i]==true && total>0)
        tax= ((this.taxPercentage[i]/100)*(netNoTax));
      else
        tax=0;
    }
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue(tax);


    //ضريبة خصم
    var taxDiscount=this.ar_sales_returnes.get("n_discount_tax_ratio")?.value;
    if(taxDiscount!='')
    {
      debugger;
      var value=Number(Number(taxDiscount/100)*this.totalValue);
      taxDiscountP=Number(total/this.totalValue);
      taxDiscountV=Number(taxDiscountP*value);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_discount_tax')?.patchValue(taxDiscountV);
    }

    //ضريبة اضافية
    var taxAdditional=this.ar_sales_returnes.get("n_additional_tax_ratio")?.value;
    if(taxDiscount!='')
    {
      var value=Number(Number(taxAdditional/100)*this.totalValue);
      taxAdditionP=Number(total/this.totalValue);
      taxAdditionV=Number(taxAdditionP*value);
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_additional_tax')?.patchValue(taxAdditionV);
    }

    //الصافى
    if(total>0)
    {
      net = Number((Number(tax) + Number(netNoTax) + Number(taxAdditionV))-Number(taxDiscountV));
      ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue(net);
    }

    this.setDetailsTotals();
  }

  setItemTotal(){
    this.totalValue=0;
    for (let i = 0; i < this.ar_sales_returns_details.controls.length; i++)
    {
      var total=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_item_value')?.value;
      this.totalValue += total;
    }
  }

  setDetailsTotals(){
    var totalQty=0,totalNItem=0, totalExpLoad=0,totalExpUnLoad=0, totalBonus=0,
     totalValue=0, totalNet=0, totalDiscount=0, totalTax=0, totalExpensesTax=0, totalLocalExpense=0,
     totalTaxDiscount=0, totalAddotionTax=0;

    for (let i = 0; i < this.ar_sales_returns_details.length; i++) {
      totalQty += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_qty);
      totalBonus += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_Bonus+this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_net_value);
      totalValue += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_value);
      totalNet += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_net_value);
      totalDiscount += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].nItemDiscountV);
      totalTax += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_sales_Tax);
      totalTaxDiscount += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_discount_tax);
      totalAddotionTax += Number(this.ar_sales_returnes.value.ar_sales_returns_details[i].n_item_additional_tax);
    }

    totalDiscount+=Number(this.ar_sales_returnes.get('n_extra_discount')?.value);

    for (let i = 0; i < this.ar_expenses_sales_invoice_return.length; i++) {
      if(this.ar_sales_returnes.value.ar_expenses_sales_invoice_return[i].n_loaded==true){
        totalExpLoad+= Number(this.ar_sales_returnes.value.ar_expenses_sales_invoice_return[i].n_value);
      }
      else{
        totalExpUnLoad += Number(this.ar_sales_returnes.value.ar_expenses_sales_invoice_return[i].n_value);
      }
      totalLocalExpense+= Number(this.ar_sales_returnes.value.ar_expenses_sales_invoice_return[i].n_value);
      totalExpensesTax += Number(this.ar_sales_returnes.value.ar_expenses_sales_invoice_return[i].n_sales_tax);
    }

    totalNItem+= Number(this.ar_sales_returns_details.length);

    this.ar_sales_returnes.get('n_total_qty')?.patchValue(totalQty);
    this.ar_sales_returnes.get('n_no_of_items')?.patchValue(totalNItem);
    this.ar_sales_returnes.get('n_total_value')?.patchValue(totalValue);
    this.ar_sales_returnes.get('n_net_value')?.patchValue(totalNet);
    this.ar_sales_returnes.get('n_total_discount')?.patchValue(totalDiscount);
    this.ar_sales_returnes.get('n_sales_tax')?.patchValue(totalTax);
    this.ar_sales_returnes.get('n_extra_expenses')?.patchValue(Number(totalExpLoad+totalExpUnLoad));
    this.ar_sales_returnes.get('n_discount_tax')?.patchValue(totalTaxDiscount);
    this.ar_sales_returnes.get('n_additional_tax')?.patchValue(totalAddotionTax);
  }

  setEditValues(){
    this.editMode=true;
    for (let i = 0; i < this.ar_sales_returns_details.controls.length; i++) {
      var itemNo=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
      var unitID=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;
      var supplierNo=this.ar_sales_returnes.get('n_supplier_id')?.value;
      this.items.push(itemNo);
      this.taxPercentage.push(0);
      this.itemsTax.push(false);
    }
  }

  SetTaxes(){
    if(this.editMode==false)
    {
      for (let i = 0; i < this.ar_sales_returns_details.length; i++)
      {
        this.calcRows(i,1);
      }
    }
  }

  calcTaxP(i:number){
    var discountP=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.value;
    var qty=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discV=(discountP/100)*total;
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue(discV);
    this.calcRows(i,1);
  }

  calcTaxV(i:number){
    var discountV=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;
    var qty=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discP=(discountV/total)*100;
    ((this.ar_sales_returnes.get("ar_sales_returns_details") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue(discP);
    this.calcRows(i,1);
  }

  setDiscount(){
    if(this.ar_sales_returnes.get('b_has_extra_discount')?.value== true)
    {
      this.isDiscounted=true;
    }
    else
    {
      this.isDiscounted=false;
      this.ar_sales_returnes.get('n_discount_ratio')?.patchValue(0);
      this.ar_sales_returnes.get('n_extra_discount')?.patchValue(0);
    }
    for (let i = 0; i < this.ar_sales_returns_details.controls.length; i++)
    {
      this.calcRows(i,1);
    }
  }

  SetExtraTab(){
    if(this.ar_sales_returnes.get('b_has_extra_expnses')?.value == true)
    {
      this.bExtra=true;
      if(this.ar_expenses_sales_invoice_return.controls.length==0)
      {
        this.addExpensesRow();
        ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(0) as FormGroup).get('nCoff')?.disable();
      }
    }
    else
    {
      this.bExtra=false;
      this.ar_expenses_sales_invoice_return.clear();
      this.setExpense();
    }
  }

  setMainValues(){
    this._SalesInvoiceService.GetMainCurrency().subscribe(res=>{
      this.localCurrency=res;
      for (let i = 0; i < this.ar_expenses_sales_invoice_return.length; i++) {
        if( this.ar_sales_returnes.value.ar_expenses_sales_invoice_return[i].n_currency_id == this.localCurrency)
        {
          ((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('nCoff')?.disable();
        }
        this.expensesValue +=((this.ar_sales_returnes.get("ar_expenses_sales_invoice_return") as FormArray).at(i) as FormGroup).get('n_value')?.value;
      }
    });
  }

  //-------------------
}
