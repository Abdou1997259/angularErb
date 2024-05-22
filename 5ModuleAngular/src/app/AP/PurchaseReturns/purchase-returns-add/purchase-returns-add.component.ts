import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CurrenciesLkpComponent } from 'src/app/Controls/currencies-lkp/currencies-lkp.component';
import { ExpensesLkpComponent } from 'src/app/Controls/expenses-lkp/expenses-lkp.component';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { PurchaseCostcentersLkpComponent } from 'src/app/Controls/purchase-costcenters-lkp/purchase-costcenters-lkp.component';
import { RealatedAccountsLkpComponent } from 'src/app/Controls/realated-accounts-lkp/realated-accounts-lkp.component';
import { SearchSuppliersDirLkpComponent } from 'src/app/Controls/search-suppliers-dir-lkp/search-suppliers-dir-lkp.component';
import { StoresLookUpComponent } from 'src/app/Controls/stores-look-up/stores-look-up.component';
import { SuppliersLkpComponent } from 'src/app/Controls/suppliers-lkp/suppliers-lkp.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { PurchaseReturnsService } from 'src/app/Core/Api/AP/purchase-returns.service';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { ExpensesLKPService } from 'src/app/Core/Api/LookUps/expenses-lkp.service';
import { PurchaseCostCentersLKPService } from 'src/app/Core/Api/LookUps/purchase-costcenter-lkp.service';
import { RelatedAccountsLKPService } from 'src/app/Core/Api/LookUps/related-accounts-lkp.service';
import { SearchSuppliersDirecionsLKPService } from 'src/app/Core/Api/LookUps/search-suppliers-dir-lkp.service';
import { SuppliersLKPService } from 'src/app/Core/Api/LookUps/suppliers-lkp.service';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';

@Component({
  selector: 'app-purchase-returns-add',
  templateUrl: './purchase-returns-add.component.html',
  styleUrls: ['./purchase-returns-add.component.css']
})
export class PurchaseReturnsAddComponent implements OnInit {
  purchaseReturnsForm: FormGroup;
  sources!: any[];
  documentNo: number = 0;
  timeout: any;
  transNo: number = 0;

  isLocalCurrency!: boolean[];
  isStoreExist!: boolean;
  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  isExpensesExist: boolean[] = [];
  isCurrencyExist: boolean[] = [];
  isSupplierExist: boolean[] = [];
  isAccountExist: boolean[] = [];
  isOppAccountExist: boolean[] = [];
  isCostCenter1Exist: boolean[] = [];
  isCostCenter2Exist: boolean[] = [];
  isExtraDiscountChecked!: boolean;
  isExtraExpensesChecked!: boolean;
  isCostCenter1MExist: boolean = false;
  isCostCenter2MExist: boolean = false;
  isDirectionExist: boolean = false;
  isDetailsStoreExist: boolean[] = [];

  bExtra=false;
  bAdvance=false;
  bisMainCurrency=false;
  taxPercentage:any=[];
  items:any=[];
  taxStatus:boolean=false;
  totalValue:number=0;
  expensesValue:number=0;
  totalDiscount:number=0;
  isDiscounted:boolean=false;
  unitCoff:any=[];
  itemsTax:any=[];

  showspinner: boolean = false;

  InvoiceTypesList!: any;
  InvoicesFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  InvoiceTypeSearching:boolean=false;

  currenciesList!: any;
  CurrencyData!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  currencySearching:boolean=false;

  suppliersList!: any;
  suppliersFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  suppliersSearching:boolean=false;

  employeesList!: any;
  employeesFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  employeesSearching:boolean=false;

  storesList!: any;
  storeSearching:boolean=false;
  storeFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  accDirList!: any;
  accDirSearching:boolean=false;
  accDirFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  transSourceList!: any;
  transSourceFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  transSourceSearching:boolean=false;
  searchingItems:any[]=[];
  searchingUnit:any[]=[]
  localCurrency!: any;
  n_currency_id!: number;
  currencyName!: string;
  changedCurrency: any[] = [];
  DirSearch:any[]=[];
  n_source_id: number[] = [];
  storeSearch:any[]=[]
  b_has_multi_costCenter: boolean = false;

  isEnglish:boolean=false;
  constructor(private _PurchaseSerive: PurchaseReturnsService, private _notification: NotificationServiceService,
    private _router: Router, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private _Expenses: ExpensesLKPService, private _Currency: CurrencyLKPService,
    private _supplierService: SuppliersLKPService, private _relatedAccount: RelatedAccountsLKPService,
    private _lookUp:GenerealLookup,
    private _cosetCenter: PurchaseCostCentersLKPService, private _transSource: SCTransTypeService, private _directionService: SearchSuppliersDirecionsLKPService,
    private _LookupControlService:LookupControlService,
    private _helperService:HelperService)
  {
    this.purchaseReturnsForm = this._formBuilder.group({
      n_document_no: new FormControl(),
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      d_document_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      s_book_doc_no: new FormControl(),
      n_ivoice_type_id: new FormControl('',Validators.required),
      n_supplier_id: new FormControl('',Validators.required),
      n_purchaseMan_id: new FormControl(),
      n_store_id: new FormControl('',Validators.required),
      s_store_name: new FormControl(),
      n_currency_id: new FormControl('',Validators.required),
      n_currency_coff: new FormControl('1'),
      s_description_arabic: new FormControl(),
      s_description_eng: new FormControl(),
      n_trans_source_no: new FormControl(),
      n_invoice_no_supp: new FormControl(),
      b_use_multi_cost_center: new FormControl(),
      b_has_extra_discount: new FormControl(),
      n_extra_discount: new FormControl(),
      b_has_extra_expnses: new FormControl(),
      n_extra_expenses: new FormControl(),
      n_total_value: new FormControl(),
      n_no_of_items: new FormControl(),
      n_total_discount: new FormControl(),
      n_net_value: new FormControl(),
      n_total_qty: new FormControl(),
      n_sales_tax: new FormControl(),
      n_net_valueWithBonus: new FormControl(),
      n_extra_expenses_Loaded: new FormControl(),
      n_expenses_tax: new FormControl(),
      n_discount_ratio: new FormControl(),
      s_cost_center_id: new FormControl(),
      s_cost_center_name: new FormControl(),
      s_cost_center_id2: new FormControl(),
      s_cost_center_name2: new FormControl(),
      n_acc_dir_id: new FormControl(''),
      s_acc_dir_name: new FormControl(),
      purchaseReturnesList: this._formBuilder.array([]),
      expensesList: this._formBuilder.array([])
    });
  }


  ngOnInit(): void {
    this.documentNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this.InvoiceTypeSearch('');
    this.currencySearch('');
    //this.suppliersSearch('');
    this.EmployeesSearch('');
    this.TransSourceSearch('');
    this.StoreSearch('');
    this.AccDirSearch('');

    this._PurchaseSerive.GetSourceId().subscribe((data) => {
      this.sources = data;
    });

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
      this.purchaseReturnsForm.get('n_currency_id')?.patchValue(data.n_currency_id);
    });

    if(this.documentNo <= 0)
    {
      this.addPurchaseReturnDetails();
    }

    if(this.documentNo > 0)
    {
      this.showspinner=true;
      this._PurchaseSerive.GetByID(this.documentNo).subscribe((data) => {
        this.localCurrency = data.n_currency_id;
        this.n_currency_id = data.n_currency_id;
        this.transNo = data['n_trans_source_no'];
        this.executeStoreListing(data['n_store_id']);
        this.executeDirectionListing(data['n_acc_dir_id']);

        this.purchaseReturnsForm?.patchValue(data);
        this._LookupControlService.SetName(this.purchaseReturnsForm, "sup", "n_supplier_id", "SupplierName");
        this._LookupControlService.SetName(this.purchaseReturnsForm, "cost", "s_cost_center_id", "CostName");
        this._LookupControlService.SetName(this.purchaseReturnsForm, "cost", "s_cost_center_id2", "CostName2");

        this.purchaseReturnsForm.get("d_document_date")?.patchValue(new Date(Number(data.d_document_date.substring(0,4)), Number(data.d_document_date.substring(5,7))-1, Number(data.d_document_date.substring(8,10))));

        this._helperService.GetCurrentCurrency().subscribe((currData) => {
          if(currData.n_currency_id != data.n_currency_id)
            this.bisMainCurrency=true;
        });
        
        // Fill ap_purchase_returns_list Data
        data.ap_purchase_returns_details_list.forEach((data) => {
          this.purchaseReturnesList.push(this.newPurchaseReturnRow(this.purchaseReturnesList.length + 1));
        });
        (this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray)?.patchValue(data.ap_purchase_returns_details_list);
        // for(var i = 0; i < data.ap_purchase_returns_details_list.length; i++)
        // {
        //   this.executeItemListing(data.ap_purchase_returns_details_list[i]['s_item_id'], i);
        //   this.executeUnitListing(data.ap_purchase_returns_details_list[i]['n_unit_id'], i);
        //   // this.executeDetailsStoreListing(data.ap_purchase_returns_details_list[i]['n_store_id'], i);
        // }

        if(data['b_use_multi_cost_center'] == true)
        {
          this.b_has_multi_costCenter = true;

          if(data['s_cost_center_id'] != '' || data['s_cost_center_id'] != null)
          {
            this.executeCostCenter1MasterListing(data['s_cost_center_id']);
            this.isCostCenter1MExist = true;
          }
          if(data['s_cost_center_id2'] != '' || data['s_cost_center_id2'] != null)
          {
            this.executeCostCenter2MasterListing(data['s_cost_center_id2']);
            this.isCostCenter2MExist = true;
          }
          for(var i = 0; i < data.ap_purchase_returns_details_list.length; i++)
          {
            this.executeCostCenter1Listing(data.ap_purchase_returns_details_list[i]['s_cost_center_id'], i);
            this.executeCostCenter2Listing(data.ap_purchase_returns_details_list[i]['s_cost_center_id2'], i);
            this.isCostCenter1Exist[i] = true;
            this.isCostCenter2Exist[i] = true;
          }
        }
        // End ap_purchase_returns_list

  
        // Fill ap_expenses_purchase_returns_list Data
        if(data['b_has_extra_expnses'] == true)
        {
          this.isExtraExpensesChecked = true;
          data.ap_expenses_purchase_returns_list.forEach((data) => {
            this.expensesList.push(this.newExpensesRow(this.expensesList.length + 1));
          });
          (this.purchaseReturnsForm.get("expensesList") as FormArray)?.patchValue(data.ap_expenses_purchase_returns_list);
          this.setMainValues();
          for(var i = 0; i < data.ap_expenses_purchase_returns_list.length; i++)
          {
            this.localCurrency = data['n_currency_id'];
            this.n_source_id[i] = data.ap_expenses_purchase_returns_list[i]['n_source_id'];
            this.executeExpenseListing(data.ap_expenses_purchase_returns_list[i]['s_expense_code'], i);
            this.executeCurrencyListing(data.ap_expenses_purchase_returns_list[i]['n_currency_id'], i);
            if(data.ap_expenses_purchase_returns_list[i]['n_source_id'] == 4)
            {
              this.executeSupplierListing(data.ap_expenses_purchase_returns_list[i]['s_source_no'], i);
            }
            if(data.ap_expenses_purchase_returns_list[i]['n_source_id'] == 3)
            {
              this.executeRelatedAccountListing(data.ap_expenses_purchase_returns_list[i]['s_source_no'], i);
            }
            this.executeRelatedAccountListing(data.ap_expenses_purchase_returns_list[i]['s_source_no'], i);
            this.executeOppRelatedAccountListing(data.ap_expenses_purchase_returns_list[i]['opp_acc'], i);
          }
        }
        // End ap_expenses_purchase_returns_list



        if(data['b_has_extra_discount'])
        {
          this.isExtraDiscountChecked = true;
        }
        this.setEditValues();
        this.showspinner=false;
      });
    }

    LangSwitcher.translateData(1)
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  get purchaseReturnesList() : FormArray {
    return this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray;
  }

  get expensesList() : FormArray {
    return this.purchaseReturnsForm.get("expensesList") as FormArray;
  }

  newPurchaseReturnRow(line: number = 0): FormGroup {
    return this._formBuilder.group({
      n_document_no: '',
      n_DataAreaID: '',
      nLineNo: line,
      n_store_id: '',
      s_store_name: '',
      s_item_id: '',
      // s_bar_code: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_qty: '',
      n_Bonus: '',
      n_unit_price: '',
      n_item_value: '',
      nItemDiscountP: '',
      nItemDiscountV: '',
      nInvDiscountV: '',
      n_item_expenses: '',
      n_item_net_value_WithoutTax: '',
      n_item_net_value: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: '',
      n_trans_source_doc_no: '',
      s_notes: '',
      n_item_cost: '',
      total_Qty: '',
      n_item_sales_Tax: ''
    });
  }

  newExpensesRow(line: number = 0): FormGroup {
    return this._formBuilder.group({
      n_document_no: '',
      n_DataAreaID: '',
      nLineNo: line,
      s_expense_code: '',
      s_expense_Name: '',
      b_has_tax: '',
      nExpensesValue: '',
      n_currency_id: this.localCurrency,
      s_currency_name: this.currencyName,
      nCoff: 1,
      n_sales_tax: '',
      n_value: 0,
      n_tax_type: '',
      n_source_id: '',
      s_source_no: '',
      s_source_no_name: '',
      n_loaded: '',
      opp_acc: '',
      opp_acc_name: '',
      s_descrip: ''
    });
  }

  addPurchaseReturnDetails() {
    this.purchaseReturnesList.push(this.newPurchaseReturnRow(this.purchaseReturnesList.length + 1));
  }
  addExpensesDetails() {
    this.expensesList.push(this.newExpensesRow(this.expensesList.length + 1));
    for(var i = 0; i< this.expensesList.length; i++){
      this.changedCurrency[i] = this.localCurrency;
      this.isCurrencyExist[i] = true;
    }
  }

  InvoiceTypeSearch(value: any){
    this.InvoiceTypeSearching=true;
    this._PurchaseSerive.InvoicesTypes().subscribe(res=>{
      this.InvoiceTypesList=res;
      this.InvoicesFilteredServerSide.next(this.InvoiceTypesList.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      this.InvoiceTypeSearching=false;
    })
  }

  currencySearch(value: any) {
    this.currencySearching=true;
    this._Currency.GetCurrencies().subscribe(res=> {
      this.currenciesList=res;
      this.CurrencyData=res;
      this.currencyFilteredServerSide.next(this.currenciesList.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
      this.currencySearching=false;
    })
  }

  getPostion(event)
  {
    let id ="#" +event.target.id;
    let ele=document.querySelector(id) as HTMLElement;
    console.log("top "+ele.offsetTop +"  left "+ ele.offsetLeft)

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
  searchHide(event)
  {
    let element =document.querySelector("#" + event.target.id +"+ .search-list " ) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";

  }


  searchStoreBegin(event)

  {

  setTimeout(() => {

    this._lookUp.getStoreSearch(event.target.value,event.target.value).subscribe(
      (res)=>{
    debugger;
        this.storeSearch=res
      }
    )

  }, 2000);

  }

searchBegin(event)

{

setTimeout(() => {

  this._lookUp.getSearchItems(event.target.value,event.target.value).subscribe(
    (res)=>{
  debugger;
      this.searchingItems=res
    }
  )

}, 2000);

}

searchUnitBegin(event)

{

setTimeout(() => {

  this._lookUp.getSearchUnit(event.target.value,event.target.value).subscribe(
    (res)=>{
  debugger;
      this.searchingUnit=res
    }
  )

}, 2000);

}
  searchDirBegin(event)

  {

  setTimeout(() => {

    this._lookUp.getDirSearch(event.target.value,event.target.value).subscribe(
      (res)=>{
    debugger;
        this.DirSearch=res
      }
    )

  }, 2000);

  }
  selectItem(i,j,event,inputName,inputNumber)
{
  debugger
  let DTf=''
  let DTs=''
  if((event.target.id as string).includes("F"))
  {
    DTf="#"+event.target.id
     DTs="#"+(event.target.id as string).replace('F','S');
  }
  else
  {
     DTf="#"+event.target.id
      DTs="#"+(event.target.id as string).replace('S','F');
  }


  let mainSearchList=(document.querySelector("#" + event.target.id) as HTMLElement ).parentElement?.parentElement?.parentElement?.parentElement?.id;
  let AccountNo=document.querySelector("#"+mainSearchList +" "+DTf) as HTMLElement;
  let AccountName=document.querySelector("#"+mainSearchList+" "+ DTs) as HTMLElement;

  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get(inputName)?.patchValue(AccountNo.innerHTML  + " # " + AccountName.innerHTML);
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get(inputNumber)?.patchValue(AccountNo.innerHTML );

  let element =document.querySelector((mainSearchList as string)) as HTMLElement
  element.style.opacity="0";
  element.style.zIndex="-1";
}
  selectMaterItem(i,searchInputNumber,inputName,inputNumber)
    {
    debugger
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdS" + i) as HTMLElement;

    (this.purchaseReturnsForm.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.purchaseReturnsForm.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
    }

  // suppliersSearch(value: any) {
  //   this.suppliersSearching=true;
  //   this._PurchaseSerive.GetSuppliers().subscribe(res=> {
  //     this.suppliersList=res;
  //     this.suppliersFilteredServerSide.next(this.suppliersList.filter(x => x.s_supplier_name.toLowerCase().indexOf(value) > -1));
  //     this.suppliersSearching=false;
  //   })
  // }


  changeSupplier(id:any){
    this._PurchaseSerive.GetPurchaseMan(id).subscribe(res=>{
      this.purchaseReturnsForm.get("n_purchaseMan_id")?.patchValue(res.n_employee_id);
    });
  }

  EmployeesSearch(value: any) {
    this.employeesSearching=true;
    this._PurchaseSerive.GetEmployees().subscribe(res=> {
      this.employeesList=res;
      this.employeesFilteredServerSide.next(this.employeesList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.employeesSearching=false;
    })
  }

  TransSourceSearch(value: any) {
    this.transSourceSearching=true;
    this._PurchaseSerive.GetTransSourceDropList().subscribe(res=> {
      this.transSourceList=res;
      this.transSourceFilteredServerSide.next(this.transSourceList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.transSourceSearching=false;
    })
  }

  StoreSearch(value: any) {
    this.storeSearching=true;
    this._PurchaseSerive.GetStores(value).subscribe(res=> {
      this.storesList=res;
      this.storeFilteredServerSide.next(this.storesList.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.storeSearching=false;
    })
  }
  
  AccDirSearch(value: any) {
    this.accDirSearching=true;
    this._PurchaseSerive.GetAccDirs(value).subscribe(res=> {
      this.accDirList=res;
      this.accDirFilteredServerSide.next(this.accDirList.filter(x => x.s_acc_dir_name.toLowerCase().indexOf(value) > -1));
      this.accDirSearching=false;
    })
  }

  TransSourceChanged() {
    this.transNo = this.purchaseReturnsForm.value.n_trans_source_no;
  }

  CheckIsMain(){
    if(this.purchaseReturnsForm.get('n_currency_id')?.value ==this.localCurrency)
    {
      this.bisMainCurrency=false;
    }
    else
    {
      this.bisMainCurrency=true;
    }
    this.purchaseReturnsForm.value.n_currency_coff=1;
    this.purchaseReturnsForm.get('n_currency_coff')?.patchValue(1);
  }

  LoadStores(event:any)
 {
    const dialogRef = this.dialog.open(StoresLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      (this.purchaseReturnsForm.get("s_store_name"))?.patchValue(res.data.s_store_name + " # " +res.data.n_store_id );
      (this.purchaseReturnsForm.get("n_store_id"))?.patchValue(res.data.n_store_id );
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
  this.purchaseReturnsForm.get('s_store_name')?.patchValue('');
  this._PurchaseSerive.GetStoreName(value).subscribe((data) => {
    debugger;
    if(data.storeName != "")
    {
      this.purchaseReturnsForm.get('s_store_name')?.patchValue(data.storeName + " # "+ value );
      this.isStoreExist = true;
    }
    else{
      this.isStoreExist = false;
    }
  });
 }

 currentStoreIndex: number = 0;
 loadDetailsStores(i: number)
 {
  debugger;
  this.currentStoreIndex = i;
    const dialogRef = this.dialog.open(StoresLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      debugger
      this.isDetailsStoreExist[i] = true;
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentStoreIndex) as FormGroup).get('n_store_id')?.patchValue(res.data.n_store_id);
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentStoreIndex) as FormGroup).get('s_store_name')?.patchValue(res.data.s_store_name);
    });
 }

 onKeyDetailsStoreSearch(event: any, i) {
  clearTimeout(this.timeout);
  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeDetailsStoreListing(event.target.value, i);
    }
  }, 1000);
 }

 private executeDetailsStoreListing(value: number, i) {
  debugger;
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue('');
  this._PurchaseSerive.GetStoreName(value).subscribe((res) => {
    debugger;
    if(res.storeName != "")
    {
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue(res.storeName);
      this.isDetailsStoreExist[i] = true;
    }
    else{
      this.isDetailsStoreExist[i] = false;
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue('');
    }
  });
 }

 currentItemIndex: number = 0;
  loadItems(i: number) {
    this.currentItemIndex=i;
    var storeId = this.purchaseReturnsForm.get('n_store_id')?.value;

    if(storeId=="" || storeId== null)
    {
      if(this.isEnglish)
        this._notification.ShowMessage('Please choose store first',3);
      else
        this._notification.ShowMessage('اختر مخزن اولاً من فضلك',3);
      this.resetValues(i);
      return;
    }

     const dialogRef = this.dialog.open(ItemsdetailsLookUpComponent, {
       width: '700px',
       height:'600px',
       data: { 'storeId': storeId }
     });

     dialogRef.afterClosed().subscribe(res => {
      debugger
      this.isItemExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue('');
    });
 }

 currentUnitIndex: number = 0;
  loadUnits(i: number) {
    this.currentUnitIndex=i;
    let itemID=  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isUnitExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
    });
  }

  onKeyUnitSearch(event: any, i) {
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);

    var itemId = ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._PurchaseSerive.GetUnitName(event.target.value, itemId).subscribe((data) => {
      debugger
      if(data.unitName != '' && data.unitName != null){
        this.isUnitExist[i] = true;
        ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.unitName);
      }
      else{
        this.isUnitExist[i] = false;
        ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
    });
   }

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
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentExpensesIndex) as FormGroup).get('s_expense_code')?.patchValue(res.data.s_expense_code);
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentExpensesIndex) as FormGroup).get('s_expense_Name')?.patchValue(res.data.s_expense_name);
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
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentCurrencyIndex) as FormGroup).get('n_currency_id')?.patchValue(res.data.n_currency_id);
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentCurrencyIndex) as FormGroup).get('s_currency_name')?.patchValue(res.data.s_currency_name);
    });
  }

  currentSuppliersIndex: number = 0;
  loadSuppliers(i: number) {
    this.currentSuppliersIndex=i;
    const dialogRef = this.dialog.open(SuppliersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isSupplierExist[i] = true;
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentSuppliersIndex) as FormGroup).get('s_source_no')?.patchValue(res.data.n_supplier_id);
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentSuppliersIndex) as FormGroup).get('s_source_no_name')?.patchValue(res.data.s_supplier_name);
    });
  }

  onKeySupplierSearch(event: any, i) {
    ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_source_no_name')?.patchValue('');
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeSupplierListing(event.target.value, i);
      }
    }, 1000);
   }

   private executeSupplierListing(value: number, i) {
    this._supplierService.GetSupplierName(value).subscribe((data) => {
      if(data.supplierName != '' && data.supplierName != null){
        this.isSupplierExist[i] = true;
        ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_source_no_name')?.patchValue(data.supplierName);
      }
      else{
        this.isSupplierExist[i] = false;
        ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_source_no_name')?.patchValue('');
      }
    });
   }

  currentAccountIndex: number = 0;
  loadRelatedAccounts(i: number) {
    this.currentAccountIndex=i;
    const dialogRef = this.dialog.open(RealatedAccountsLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isAccountExist[i] = true;
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentAccountIndex) as FormGroup).get('s_source_no')?.patchValue(res.data.s_account_no);
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentAccountIndex) as FormGroup).get('s_source_no_name')?.patchValue(res.data.s_account_name);
    });
  }

  onKeyRelatedAccountSearch(event: any, i) {
    ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_source_no_name')?.patchValue('');
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeRelatedAccountListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeRelatedAccountListing(value: string, i) {
    this._relatedAccount.GetRelatedAccountName(value).subscribe((data) => {
      if(data.accountName != '' && data.accountName != null){
        this.isAccountExist[i] = true;
        ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_source_no_name')?.patchValue(data.accountName);
      }
      else{
        this.isAccountExist[i] = false;
        ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_source_no_name')?.patchValue('');
      }
    });
  }

  currentOppAccountIndex: number = 0;
  loadOppRelatedAccounts(i: number) {
    this.currentOppAccountIndex=i;
    const dialogRef = this.dialog.open(RealatedAccountsLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isOppAccountExist[i] = true;
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentOppAccountIndex) as FormGroup).get('opp_acc')?.patchValue(res.data.s_account_no);
     ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(this.currentOppAccountIndex) as FormGroup).get('opp_acc_name')?.patchValue(res.data.s_account_name);
    });
  }

  onKeyOppRelatedAccountSearch(event: any, i) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeOppRelatedAccountListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeOppRelatedAccountListing(value: string, i) {
    this._relatedAccount.GetRelatedAccountName(value).subscribe((data) => {
      if(data.accountName != '' && data.accountName != null){
        this.isOppAccountExist[i] = true;
        ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('opp_acc_name')?.patchValue(data.accountName);
      }
      else{
        this.isOppAccountExist[i] = false;
        ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('opp_acc_name')?.patchValue('');
      }
    });
  }


 onKeyItemSearch(event: any, i) {
  clearTimeout(this.timeout);
  this.resetDetailsValues(i);
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

  var storeId = this.purchaseReturnsForm.value.n_store_id;
  if(storeId=="")
  {
    if(this.isEnglish)
      this._notification.ShowMessage('Please choose store first',3);
    else
      this._notification.ShowMessage('اختر مخزن اولاً من فضلك',3);
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    this.resetValues(i);
    return;
  }

  this._PurchaseSerive.GetItemName(event.target.value, storeId).subscribe((data) => {
    if(data.itemName != '' && data.itemName != null){
      this.isItemExist[i] = true;
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.itemName);
    }
    else{
      this.isItemExist[i] = false;
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
      ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    }
  });
 }



 onKeyExpenseSearch(event: any, i) {
  clearTimeout(this.timeout);
  ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_expense_Name')?.patchValue('');

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
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_expense_Name')?.patchValue(data.expenseName);
    }
    else{
      this.isExpensesExist[i] = false;
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_expense_Name')?.patchValue('');
    }
  });
 }

 onKeyCurrencySearch(event: any, i) {
  clearTimeout(this.timeout);
  ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue('');
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
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue(data.currencyName);
    }
    else{
      this.isCurrencyExist[i] = false;
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('s_currency_name')?.patchValue('');
    }
  });
 }

 loadCostCenters1MasterAccounts() {
  const dialogRef = this.dialog.open(PurchaseCostcentersLkpComponent, {
    width: '700px',
    height:'600px',
    data: {  }
  });

  dialogRef.afterClosed().subscribe(res => {
    this.isCostCenter1MExist = true;
   this.purchaseReturnsForm.get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
   this.purchaseReturnsForm.get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
  });
}

onKeyCostCenter1MasterSearch(event: any) {
  clearTimeout(this.timeout);
  this.purchaseReturnsForm.get('s_cost_center_name')?.patchValue('');
  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeCostCenter1MasterListing(event.target.value);
    }
  }, 1000);
}

private executeCostCenter1MasterListing(value: string) {
  this._cosetCenter.GetCostCenterName(value).subscribe((data) => {
    if(data.costCenterName != '' && data.costCenterName != null){
      this.isCostCenter1MExist = true;
      this.purchaseReturnsForm.get('s_cost_center_name')?.patchValue(data.costCenterName);
    }
    else{
      this.isCostCenter1MExist = false;
      this.purchaseReturnsForm.get('s_cost_center_name')?.patchValue('');
    }
  });
}

loadCostCenters2MasterAccounts() {
  const dialogRef = this.dialog.open(PurchaseCostcentersLkpComponent, {
    width: '700px',
    height:'600px',
    data: {  }
  });

  dialogRef.afterClosed().subscribe(res => {
    this.isCostCenter2MExist = true;
   this.purchaseReturnsForm.get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
   this.purchaseReturnsForm.get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
  });
}

onKeyCostCenter2MasterSearch(event: any) {
  clearTimeout(this.timeout);
  this.purchaseReturnsForm.get('s_cost_center_name2')?.patchValue('');
  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeCostCenter2MasterListing(event.target.value);
    }
  }, 1000);
}

private executeCostCenter2MasterListing(value: string) {
  this._cosetCenter.GetCostCenterName(value).subscribe((data) => {
    if(data.costCenterName != '' && data.costCenterName != null){
      this.isCostCenter2MExist = true;
      this.purchaseReturnsForm.get('s_cost_center_name2')?.patchValue(data.costCenterName);
    }
    else{
      this.isCostCenter2MExist = false;
      this.purchaseReturnsForm.get('s_cost_center_name2')?.patchValue('');
    }
  });
}

 currentCostCenter1Index: number = 0;
  loadCostCenters1Accounts(i: number) {
    this.currentCostCenter1Index=i;
    const dialogRef = this.dialog.open(PurchaseCostcentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isCostCenter1Exist[i] = true;
     ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentCostCenter1Index) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
     ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentCostCenter1Index) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
    });
  }

  onKeyCostCenter1Search(event: any, i) {
    clearTimeout(this.timeout);
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeCostCenter1Listing(event.target.value, i);
      }
    }, 1000);
  }

  private executeCostCenter1Listing(value: string, i) {
    this._cosetCenter.GetCostCenterName(value).subscribe((data) => {
      if(data.costCenterName != '' && data.costCenterName != null){
        this.isCostCenter1Exist[i] = true;
        ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(data.costCenterName);
      }
      else{
        this.isCostCenter1Exist[i] = false;
        ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
      }
    });
  }

  currentCostCenter2Index: number = 0;
  loadCostCenters2Accounts(i: number) {
    this.currentCostCenter2Index=i;
    const dialogRef = this.dialog.open(PurchaseCostcentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isCostCenter2Exist[i] = true;
     ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentCostCenter2Index) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
     ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(this.currentCostCenter2Index) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
    });
  }

  onKeyCostCenter2Search(event: any, i) {
    clearTimeout(this.timeout);
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeCostCenter2Listing(event.target.value, i);
      }
    }, 1000);
  }

  private executeCostCenter2Listing(value: string, i) {
    this._cosetCenter.GetCostCenterName(value).subscribe((data) => {
      if(data.costCenterName != '' && data.costCenterName != null){
        this.isCostCenter2Exist[i] = true;
        ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(data.costCenterName);
      }
      else{
        this.isCostCenter2Exist[i] = false;
        ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
      }
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
      this.purchaseReturnsForm.get('s_acc_dir_name')?.patchValue(res.data.s_acc_dir_name +" # "+res.data.n_acc_dir_no);
     this.purchaseReturnsForm.get('n_acc_dir_id')?.patchValue(res.data.n_acc_dir_no);
    });
  }

  onKeyDirectionsSearch(event: any) {
    clearTimeout(this.timeout);
    this.purchaseReturnsForm.get('s_acc_dir_name')?.patchValue('');
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeDirectionListing(event.target.value);
      }
    }, 1000);
  }

  private executeDirectionListing(value: number) {
    this._directionService.GetCurrencyName(value).subscribe((data) => {
      if(data.directionName != '' && data.directionName != null){
        this.isDirectionExist = true;
        this.purchaseReturnsForm.get('s_acc_dir_name')?.patchValue(data.directionName + " # " +value );
      }
      else{
        this.isDirectionExist = false;
        this.purchaseReturnsForm.get('s_acc_dir_name')?.patchValue('');
      }
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

 calcIndex: number = 0;
  getTotal(i:number, fromDelte:boolean) {
    let pricControl:number=0;
    let qtyControl:number=0
    let result:number=0
    let accumlatedQty:number=0;
    let itemIDVal:number=0;
    let unitIDVal:number=0;
    let accumlatedPrice:number=0;
    this.calcIndex=i;
    itemIDVal=Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('s_item_id')?.value)
    unitIDVal=Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_id')?.value)
    pricControl= Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_price')?.value)
    qtyControl=Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_qty')?.value)
    if(fromDelte==false)
    {
      pricControl= Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_price')?.value)
      qtyControl=Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_qty')?.value)
      result=pricControl*qtyControl;
      ((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_transaction_value')?.patchValue(result);
      for( let item of (this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray ).controls)
        {
          accumlatedQty+=Number(item.get('n_qty')?.value)
          accumlatedPrice+=Number(item.get('n_transaction_value')?.value);
        }
      this.purchaseReturnsForm.get('n_transaction_total_qty')?.patchValue(accumlatedQty);
      this.purchaseReturnsForm.get('n_total_value')?.patchValue(accumlatedPrice);
    }
    if(fromDelte==true)
    {
      let total:number
       pricControl=0;
       qtyControl=0;

       pricControl= Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_unit_price')?.value)
       qtyControl=Number(((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(this.calcIndex) as FormGroup).get('n_qty')?.value)
       result=pricControl*qtyControl;
      this.purchaseReturnsForm.get('n_total_value')?.patchValue( this.purchaseReturnsForm.get('n_total_value')?.value-result);
      this.purchaseReturnsForm.get('n_transaction_total_qty')?.patchValue( this.purchaseReturnsForm.get('n_transaction_total_qty')?.value-qtyControl);
    }
 }

 removeDetailsRow(i: number) {
  if(this.purchaseReturnesList.length==1)
  {
    this._notification.ShowMessage('يجب ان تحتوى الفاتورة على صنف واحد على الاقل',2);
    return;
  }
  else
  {
    var itemNo=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this.purchaseReturnesList.removeAt(i);
    var index = this.items.indexOf(itemNo);
    this.items.splice(index, 1);
    this.itemsTax.splice(i, 1);
    this.unitCoff.splice(i, 1);
    this.setItemTotal();
    this.calcDiscountP();
  }
  this.checkTax(i);
 }

 removeExpensiseRow(row: number){
   this.expensesList.removeAt(row);
 }

 SetExtraTab()
 {
    if(this.purchaseReturnsForm.get('b_has_extra_expnses')?.value == true)
    {
      this.isExtraExpensesChecked=true;
      if(this.expensesList.controls.length==0)
      {
        this.addExpensesDetails();
        ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(0) as FormGroup).get('nCoff')?.disable();
      }
    }
    else
    {
      this.isExtraExpensesChecked=false;
      this.expensesList.clear();
      this.setExpense();
    }
 }

 onHasExtraDiscountChanged(event)
 {
  if(event.target.checked)
    {
      this.isExtraDiscountChecked = true;
    }
    else{
      this.isExtraDiscountChecked = false;
    }
 }

 changeSource(eve, i) {
  debugger;
  this.n_source_id[i] = ((this.purchaseReturnsForm.get('expensesList') as FormArray).at(i) as FormGroup).get('n_source_id')?.value;
  ((this.purchaseReturnsForm.get('expensesList') as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue('');
  ((this.purchaseReturnsForm.get('expensesList') as FormArray).at(i) as FormGroup).get('s_source_no_name')?.patchValue('');
}

 Save()
 {
  debugger
  if(this.ValidateMasterTable() == false || this.ValidateDetailsTable() == false)
    return;

  if(this.expensesList.length > 0)
  {
    if(this.ValidateExpensisDetailsTable() == false)
      return;
  }

  this.showspinner = true;
  var formData = new FormData();
  this.purchaseReturnsForm.value.d_document_date=new DatePipe('en-US').transform(this.purchaseReturnsForm.value.d_document_date, 'yyyy/MM/dd');
  formData.append('n_document_no', this.purchaseReturnsForm?.value.n_document_no ?? 0);
  formData.append('n_DataAreaID', this.purchaseReturnsForm?.value.n_DataAreaID ?? 0);
  formData.append('n_UserAdd', this.purchaseReturnsForm?.value.n_UserAdd ?? 0);
  formData.append('d_UserAddDate', this.purchaseReturnsForm?.value.d_UserAddDate ?? '');
  formData.append('d_document_date', this.purchaseReturnsForm?.value.d_document_date ?? '');
  formData.append('s_book_doc_no', this.purchaseReturnsForm?.value.s_book_doc_no ?? '');
  formData.append('n_ivoice_type_id', this.purchaseReturnsForm?.value.n_ivoice_type_id ?? 0);
  formData.append('n_supplier_id', this.purchaseReturnsForm?.value.n_supplier_id ?? 0);
  formData.append('n_purchaseMan_id', this.purchaseReturnsForm?.value.n_purchaseMan_id ?? 0);
  formData.append('n_store_id', this.purchaseReturnsForm?.value.n_store_id ?? 0);
  formData.append('n_currency_id', this.purchaseReturnsForm?.value.n_currency_id ?? 0);
  formData.append('n_currency_coff', this.purchaseReturnsForm?.value.n_currency_coff ?? 0);
  formData.append('s_description_arabic', this.purchaseReturnsForm?.value.s_description_arabic ?? '');
  formData.append('s_description_eng', this.purchaseReturnsForm?.value.s_description_eng ?? '');
  formData.append('n_trans_source_no', this.purchaseReturnsForm?.value.n_trans_source_no ?? 0);
  formData.append('n_invoice_no_supp', this.purchaseReturnsForm?.value.n_invoice_no_supp ?? 0);
  formData.append('b_use_multi_cost_center', this.purchaseReturnsForm?.value.b_use_multi_cost_center ?? false);
  formData.append('b_has_extra_discount', this.purchaseReturnsForm?.value.b_has_extra_discount ?? false);
  formData.append('n_discount_ratio', this.purchaseReturnsForm?.value.n_discount_ratio ?? 0);
  formData.append('n_extra_discount', this.purchaseReturnsForm?.value.n_extra_discount ?? 0);
  formData.append('b_has_extra_expnses', this.purchaseReturnsForm?.value.b_has_extra_expnses ?? false);
  formData.append('n_extra_expenses', this.purchaseReturnsForm?.value.n_extra_expenses ?? 0);
  formData.append('n_total_value', this.purchaseReturnsForm?.value.n_total_value ?? 0);
  formData.append('n_no_of_items', this.purchaseReturnsForm?.value.n_no_of_items ?? 0);
  formData.append('n_total_discount', this.purchaseReturnsForm?.value.n_total_discount ?? 0);
  formData.append('n_net_value', this.purchaseReturnsForm?.value.n_net_value ?? 0);
  formData.append('n_sales_tax', this.purchaseReturnsForm?.value.n_sales_tax ?? 0);
  formData.append('n_total_qty', this.purchaseReturnsForm?.value.n_total_qty ?? 0);
  formData.append('n_extra_expenses_Loaded', this.purchaseReturnsForm?.value.n_extra_expenses_Loaded ?? 0);
  formData.append('s_cost_center_id', this.purchaseReturnsForm?.value.s_cost_center_id ?? '');
  formData.append('s_cost_center_name', this.purchaseReturnsForm?.value.s_cost_center_name ?? '');
  formData.append('s_cost_center_id2', this.purchaseReturnsForm?.value.s_cost_center_id2 ?? '');
  formData.append('s_cost_center_name2', this.purchaseReturnsForm?.value.s_cost_center_name2 ?? '');
  formData.append('n_expenses_tax', this.purchaseReturnsForm?.value.n_expenses_tax ?? '');
  formData.append('n_acc_dir_id', this.purchaseReturnsForm?.value.n_acc_dir_id ?? '');

  for(var i = 0; i < this.purchaseReturnsForm.value.purchaseReturnesList.length; i++) {
    formData.append('ap_purchase_returns_details_list[' + i + '].n_document_no', this.purchaseReturnsForm.value.n_document_no ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_DataAreaID', this.purchaseReturnsForm.value.n_DataAreaID ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].nLineNo', this.purchaseReturnsForm.value.purchaseReturnesList[i].nLineNo ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_store_id', this.purchaseReturnsForm?.value.n_store_id ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].s_item_id', this.purchaseReturnsForm.value.purchaseReturnesList[i].s_item_id ?? '');
    // formData.append('ap_purchase_returns_details_list[' + i + '].s_bar_code', this.purchaseReturnsForm.value.purchaseReturnesList[i].s_bar_code ?? '');
    formData.append('ap_purchase_returns_details_list[' + i + '].n_unit_id', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_unit_id ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_qty', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_qty ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_Bonus', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_Bonus ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_unit_price', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_unit_price ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_item_value', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_value ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].nItemDiscountP', this.purchaseReturnsForm.value.purchaseReturnesList[i].nItemDiscountP ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].nItemDiscountV', this.purchaseReturnsForm.value.purchaseReturnesList[i].nItemDiscountV ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].nInvDiscountV', this.purchaseReturnsForm.value.purchaseReturnesList[i].nInvDiscountV ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_item_expenses', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_expenses ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_item_net_value_WithoutTax', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_net_value_WithoutTax ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_item_sales_Tax', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_sales_Tax ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_item_net_value', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_net_value ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].n_trans_source_doc_no', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_trans_source_doc_no ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].s_notes', this.purchaseReturnsForm.value.purchaseReturnesList[i].s_notes ?? '');
    formData.append('ap_purchase_returns_details_list[' + i + '].n_item_cost', this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_cost ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].total_Qty', this.purchaseReturnsForm.value.purchaseReturnesList[i].total_Qty ?? 0);
    formData.append('ap_purchase_returns_details_list[' + i + '].s_cost_center_id', this.purchaseReturnsForm.value.purchaseReturnesList[i].s_cost_center_id ?? '');
    formData.append('ap_purchase_returns_details_list[' + i + '].s_cost_center_id2', this.purchaseReturnsForm.value.purchaseReturnesList[i].s_cost_center_id2 ?? '');
  }

  if(this.purchaseReturnsForm.value.expensesList.length > 0)
  {
    for(var i = 0; i < this.purchaseReturnsForm.value.expensesList.length; i++)
    {
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_value')?.enable();
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.enable();

      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_document_no', this.purchaseReturnsForm.value.n_document_no ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_DataAreaID', this.purchaseReturnsForm.value.n_DataAreaID ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].nLineNo', this.purchaseReturnsForm.value.expensesList[i].nLineNo ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].s_expense_code', this.purchaseReturnsForm.value.expensesList[i].s_expense_code ?? '');
      formData.append('ap_expenses_purchase_returns_list[' + i + '].b_has_tax', this.purchaseReturnsForm.value.expensesList[i].b_has_tax ?? false);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].nExpensesValue', this.purchaseReturnsForm.value.expensesList[i].nExpensesValue ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_currency_id', this.purchaseReturnsForm.value.expensesList[i].n_currency_id ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].nCoff', this.purchaseReturnsForm.value.expensesList[i].nCoff ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_sales_tax', this.purchaseReturnsForm.value.expensesList[i].n_sales_tax ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_value', this.purchaseReturnsForm.value.expensesList[i].n_value ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_tax_type', this.purchaseReturnsForm.value.expensesList[i].n_tax_type ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_source_id', this.purchaseReturnsForm.value.expensesList[i].n_source_id ?? 0);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].s_source_no', this.purchaseReturnsForm.value.expensesList[i].s_source_no ?? '');
      formData.append('ap_expenses_purchase_returns_list[' + i + '].n_loaded', this.purchaseReturnsForm.value.expensesList[i].n_loaded ?? false);
      formData.append('ap_expenses_purchase_returns_list[' + i + '].opp_acc', this.purchaseReturnsForm.value.expensesList[i].opp_acc ?? '');
      formData.append('ap_expenses_purchase_returns_list[' + i + '].s_descrip', this.purchaseReturnsForm.value.expensesList[i].s_descrip ?? '');
    }
  }

  if(this.documentNo <= 0) {
    // this.disableButtons();
    this._PurchaseSerive.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
       this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this._router.navigate(['/ap/purchasereturnslist']);
      }
    });
  }
  else{
    this._PurchaseSerive.Edit(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
          this._notification.ShowMessage(data.Emsg,data.status)
      else
        this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this._router.navigate(['/ap/purchasereturnslist']);
      }
    });
  }
}

 ValidateMasterTable(): boolean {
  var isValid = true;
  if(this.purchaseReturnsForm?.value.d_document_date == '' || this.purchaseReturnsForm?.value.d_document_date == null)
  {
    this._notification.ShowMessage("من فضلك ادخل تاريخ الفاتورة", 3);
    isValid = false;
  }
  if(this.purchaseReturnsForm?.value.n_store_id == 0 || this.purchaseReturnsForm?.value.n_store_id == '' || this.purchaseReturnsForm?.value.n_store_id == null)
  {
    this._notification.ShowMessage("من فضلك اختر المخزن", 3);
    isValid = false;
  }
  if(this.purchaseReturnsForm?.value.n_supplier_id == 0 || this.purchaseReturnsForm?.value.n_supplier_id == '' || this.purchaseReturnsForm?.value.n_supplier_id == null)
  {
    this._notification.ShowMessage("من فضلك اختر المورد", 3);
    isValid = false;
  }
  return isValid;
 }

 ValidateDetailsTable(): boolean {
  var isValid = true;
  if(this.purchaseReturnesList.length <= 0)
  {
    this._notification.ShowMessage(`لا يمكنك الحفظ بدون ان ادخال اصناف ووحدات الفاتورة`, 2);
    isValid = false;
  }

  for(var i = 0; i < this.purchaseReturnesList.length; i++)
  {
    if(this.purchaseReturnsForm.value.purchaseReturnesList[i].s_item_id == '')
    {
      this._notification.ShowMessage(`من فضلك ادخل كود الصنف في السطر رقم ${i+1}`, 3);
      isValid = false;
    }
    if(this.purchaseReturnsForm.value.purchaseReturnesList[i].s_item_name == '')
    {
      this._notification.ShowMessage(`من فضلك ادخل اسم الصنف في السطر رقم ${i+1}`, 3);
      isValid = false;
    }
    if(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_unit_id == '')
    {
      this._notification.ShowMessage(`من فضلك ادخل كود الوحدة في السطر رقم ${i+1}`, 3);
      isValid = false;
    }
    if(this.purchaseReturnsForm.value.purchaseReturnesList[i].s_unit_name == '')
    {
      this._notification.ShowMessage(`من فضلك ادخل اسم الوحدة في السطر رقم ${i+1}`, 3);
      isValid = false;
    }
    if(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_qty == '')
    {
      this._notification.ShowMessage(`من فضلك ادخل الكمية في السطر رقم ${i+1}`, 3);
      isValid = false;
    }
  }
  return isValid;
 }

 ValidateExpensisDetailsTable(): boolean
 {
  var isValid = true;
  for(var i = 0; i < this.expensesList.length; i++)
  {
    if(this.purchaseReturnsForm.value.expensesList[i].s_expense_code == '')
    {
      if(this.isEnglish)
       this._notification.ShowMessage(`Please insert expence code at line ${i+1}`,3)
      else
      this._notification.ShowMessage(`من فضلك ادخل كود المصروف في السطر رقم ${i+1}`, 3);
      isValid = false;
    }
    if(this.purchaseReturnsForm.value.expensesList[i].nExpensesValue == '')
    {
      if(this.isEnglish)
        this._notification.ShowMessage(`Please insert expence value at line ${i+1}`,3)
      else
      this._notification.ShowMessage(`من فضلك ادخل قيمة المصروف في السطر رقم ${i+1}`, 3);
      isValid = false;
    }
    if(this.purchaseReturnsForm.value.expensesList[i].n_value == '')
    {
      if(this.isEnglish)
         this._notification.ShowMessage(`Please insert value with your local currency ${i+1 }`,3)
      else
      this._notification.ShowMessage(`من فضلك ادخل القيمة بالعملة المحلية في السطر رقم ${i+1}`, 3);
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

MultiCostChecked()
{
  var b_multi_cost = this.purchaseReturnsForm.value.b_use_multi_cost_center;
  if(b_multi_cost == true)
  {
    this.b_has_multi_costCenter = true
  }
  else{
    this.b_has_multi_costCenter = false;
  }
}

getPurchaseDetailsRowsCount()
{
  var count = this.purchaseReturnsForm.value.purchaseReturnesList.length;
  this.purchaseReturnsForm.get('n_no_of_items')?.patchValue(count);
}

showSourcesTypes() {
  if(this.purchaseReturnsForm.value.n_supplier_id == '' || this.purchaseReturnsForm.value.n_supplier_id == null)
  {
    this._notification.ShowMessage("يجب ان تختار المورد اولآ", 3);
    return;
  }
  var id = this.transNo;
  // this.currentItemIndex=i;
   const dialogRef = this.dialog.open(TransSourceTypesComponent, {
     width: '700px',
     height:'600px',
     data: { id }
   });

   dialogRef.afterClosed().subscribe(res => {
    this._transSource.GetGenericViewData(res.data[0], res.data[1]).subscribe((data) => {
      this.purchaseReturnesList.clear();

      this.purchaseReturnsForm.patchValue(data[0]);
      this.executeStoreListing(data[0]['n_store_id']);
      this.purchaseReturnsForm.get('n_supplier_id')?.patchValue(data[0]['n_supplier_id']);

      data.forEach(element => {
        this.purchaseReturnesList.push(this.newPurchaseReturnRow(this.purchaseReturnesList.length));
      });
      (this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray)?.patchValue(data);

      for(var i = 0; i < this.purchaseReturnsForm.value.purchaseReturnesList.length; i++) {
        this.getTotal(i, false);
        ((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(i) as FormGroup).get('n_trans_source_doc_no')?.patchValue(data[i].n_doc_no);
        this.isItemExist[i] = true;
        this.isUnitExist[i] = true;
      }
    });
   });
}


checkTax(i:number){
  //Check item tax status
  var itemNo=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
  var unitID=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;
  var supplierNo=this.purchaseReturnsForm.get('n_supplier_id')?.value;

  if(supplierNo=="" || supplierNo == null)
  {
    if(this.isEnglish)
       this._notification.ShowMessage('Choose supplier at first ',3)
     else
    this._notification.ShowMessage('اختر مورد اولا من فضلك',3);
    this.resetValues(i);
    return;
  }

  if(itemNo=="")
  {
    this._notification.ShowMessage('اختر صنف اولا من فضلك',3);
    this.resetValues(i);
    return;
  }
  if(unitID=="")
  {
    this._notification.ShowMessage('اختر كود الوحدة من فضلك',3);
    this.resetValues(i);
    return;
  }

  if(this.items.length==0 || !this.items.includes(itemNo)){
    this.items.push(itemNo);
    this._PurchaseSerive.GetTaxStatus(supplierNo,itemNo).subscribe(res=>{
      if(res.n_taxes_type== 1 && res.n_supplier_tax==1)
      {
        this.taxPercentage.push(res.n_VAT);
        this.itemsTax.push(true);
      }
      else
      {
        this.taxPercentage.push(0);
        this.itemsTax.push(false);
      }
      this._PurchaseSerive.GetUnitCoff(itemNo,unitID).subscribe(res=>{
        this.unitCoff.push(res);
        this.calcRows(i);
      });

    });
  }
  else{
    this.calcRows(i);
  }

}

resetValues(i:number){
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.patchValue('');
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('total_Qty')?.patchValue('');
  // this.purchaseReturnsForm.get('n_discount_ratio')?.patchValue('');
  // this.purchaseReturnsForm.get('n_extra_discount')?.patchValue('');
  // ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_modification_unit_price')?.patchValue('');
  // ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_received_qty')?.patchValue('');
}

setItemTotal(){
  this.totalValue=0
  for (let i = 0; i < this.purchaseReturnesList.controls.length; i++)
  {
    var total=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_value')?.value;
    this.totalValue+=total;
  }
}

calcRows(i:number){
  //Calculate row
  var qty=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
  var price=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
  var discountV=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;
  var taxV=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.value;
  var total=0, discP=0,discV=0, netNoTax=0, tax=0, net=0,expenseValue=0,expensePercentage=0, invoiceDiscountValue=0,invoiceDiscountPercentage=0
  , discountTax=0;

  //الكمية المستلمة واجمالى الكمية
  if(qty!="")
  {
    // ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_received_qty')?.patchValue(qty);
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('total_Qty')?.patchValue(qty);
  }

  //الاجمالى
  if(price!="" && qty!="")
  {
    total=qty*price;
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(total);
  }

  this.setItemTotal();

  //ق المصروفات
  if(this.expensesValue>0)
  {
    expensePercentage=(total/this.totalValue);
    expenseValue=expensePercentage*this.expensesValue;
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue(expenseValue);
  }
  else
  {
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue(0);
  }


  //ق خصم فاتورة
  this.totalDiscount=this.purchaseReturnsForm.get('n_extra_discount')?.value;
  if(this.totalDiscount>0)
  {
    invoiceDiscountPercentage=(total/this.totalValue);
    invoiceDiscountValue=invoiceDiscountPercentage*this.totalDiscount;
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(invoiceDiscountValue);
    discountTax=invoiceDiscountValue*(this.taxPercentage/100);
  }
  else
  {
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(0);
  }

  //الصافى بدون ضريبة
  if(total>0)
  {
    netNoTax=(total-discountV-invoiceDiscountValue)+expenseValue;
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.patchValue(netNoTax);
  }

  //القيمة المضافة
    if(this.expensesValue>0 && this.itemsTax[i]==true)
        tax= ((this.taxPercentage[i]/100)*(netNoTax-expenseValue));
      else if(this.itemsTax[i]==true && total>0)
        tax= ((this.taxPercentage[i]/100)*(netNoTax));
      else if(taxV>0)
        tax=taxV;
      else
        tax=0;

  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue(tax);


  //الصافى
  if(total>0)
  {
    net = (tax + netNoTax);
    ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue(net);
  }

  //الكمية بالوحدة الاساسية
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.patchValue(Number(this.unitCoff*qty));


  this.setDetailsTotals();
}

setDetailsTotals(){
  var totalQty=0,totalModified=0,totalNItem=0, totalExpLoad=0,totalExpUnLoad=0, totalBonus=0,
   totalValue=0, totalNet=0, totalDiscount=0, totalTax=0, totalExpensesTax=0, totalLocalExpense=0;

  for (let i = 0; i < this.purchaseReturnesList.length; i++) {
    totalQty += Number(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_qty);
    // totalModified+= Number(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_modification_unit_price);
    totalBonus+= Number(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_Bonus+this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_net_value);
    totalValue+= Number(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_value);
    totalNet+= Number(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_net_value);
    totalDiscount+= Number(this.purchaseReturnsForm.value.purchaseReturnesList[i].nItemDiscountV);
    totalTax+= Number(this.purchaseReturnsForm.value.purchaseReturnesList[i].n_item_sales_Tax);
  }
  // this.purchaseReturnsForm.get('n_total_item_discount_ratio')?.patchValue((totalDiscount/totalValue)*100);

  totalDiscount+=Number(this.purchaseReturnsForm.get('n_extra_discount')?.value);

  for (let i = 0; i < this.expensesList.length; i++) {
    if(this.purchaseReturnsForm.value.expensesList[i].n_loaded==true){
      totalExpLoad+= Number(this.purchaseReturnsForm.value.expensesList[i].n_value);
    }
    else{
      totalExpUnLoad += Number(this.purchaseReturnsForm.value.expensesList[i].n_value);
    }
    totalLocalExpense+= Number(this.purchaseReturnsForm.value.expensesList[i].n_value);
    totalExpensesTax += Number(this.purchaseReturnsForm.value.expensesList[i].n_sales_tax);
  }

  totalNItem+= Number(this.purchaseReturnesList.length);

  this.purchaseReturnsForm.get('n_total_qty')?.patchValue(totalQty);
  // this.purchaseReturnsForm.get('n_total_modified_price')?.patchValue(totalModified);
  this.purchaseReturnsForm.get('n_no_of_items')?.patchValue(totalNItem);
  this.purchaseReturnsForm.get('n_extra_expenses_Loaded')?.patchValue(totalExpLoad);
  this.purchaseReturnsForm.get('n_net_valueWithBonus')?.patchValue(totalBonus);
  this.purchaseReturnsForm.get('n_total_value')?.patchValue(totalValue);
  // this.purchaseReturnsForm.get('n_extra_expenses_UnLoaded')?.patchValue(totalExpUnLoad);
  this.purchaseReturnsForm.get('n_net_value')?.patchValue(totalNet);
  this.purchaseReturnsForm.get('n_total_discount')?.patchValue(totalDiscount);
  this.purchaseReturnsForm.get('n_sales_tax')?.patchValue(totalTax);
  this.purchaseReturnsForm.get('n_expenses_tax')?.patchValue(totalExpensesTax);
  this.purchaseReturnsForm.get('n_extra_expenses')?.patchValue(Number(totalExpLoad+totalExpUnLoad));
  // this.purchaseReturnsForm.get('n_local_total_expenses')?.patchValue(totalLocalExpense);

}

setExpense(){
  this.expensesValue=0;

  for (let i = 0; i < this.expensesList.controls.length; i++) {
    var value=((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('nExpensesValue')?.value;
    //var tax=((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.value;
    var currency=((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
    var coff=((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('nCoff')?.value;

    if(coff=="")
    {
      if(this.isEnglish)
        this. _notification.ShowMessage("Please insert factor for the expense at line : "+(i+1),3);
      else
        this. _notification.ShowMessage("ادخل المعامل من فضلك للمصروف فى السطر رقم: "+(i+1),3);
      continue;
    }
    
    if(((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('b_has_tax')?.value==true)
    {
      var tax=Number((value*coff)*(15/100));
      var expVal=((value*coff)-tax);
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_value')?.patchValue(expVal);
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue(tax);
      this.expensesValue+=Number(expVal);
      continue;
    }
    else
    {
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue('');
      ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_value')?.patchValue(value*coff);

      this.expensesValue+=Number(value*coff);
      continue;
    }
  }
  for(let i = 0; i < this.purchaseReturnesList.controls.length; i++){
    this.calcRows(i)
  }
}

setCoffDisable(i:number){
  var currency=((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
  if(this.localCurrency==currency)
  {
    ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('nCoff')?.patchValue(1);
    ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('nCoff')?.disable();
  }
  else
  {
    ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
  }
}

calcDiscountP(){
  var discountP=this.purchaseReturnsForm.get('n_discount_ratio')?.value;
  var total=this.totalValue;
  var discountV=(discountP/100)*total;
  this.purchaseReturnsForm.get('n_extra_discount')?.patchValue(discountV);
  if(discountV>total)
  {
    if(this.isEnglish)
     this._notification.ShowMessage(`Invoice deduction value is more than the net value`,2)
    else
    this. _notification.ShowMessage('قيمة خصم الفاتورة اكبر من قيمة صافى الفاتورة',2);
    return;
  }
  for (let i = 0; i < this.purchaseReturnesList.controls.length; i++)
  {
    this.checkTax(i);
  }
}

calcTaxP(i:number){
  var discountP=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.value;
  var qty=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
  var price=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
  var total=qty*price;
  var discV=(discountP/100)*total;
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue(discV);
  this.checkTax(i);
}

calcTaxV(i:number){
  var discountV=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;
  var qty=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
  var price=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
  var total=qty*price;
  var discP=(discountV/total)*100;
  ((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue(discP);
  this.checkTax(i);
}
calcDiscountV(){
  var discountV=this.purchaseReturnsForm.get('n_extra_discount')?.value;
  var total=this.totalValue;
  var discountP=(discountV/total)*100;
  this.purchaseReturnsForm.get('n_discount_ratio')?.patchValue(discountP);
  if(discountV>total)
  {
    if(this.isEnglish)
    this._notification.ShowMessage(`the invoice deduction value is more than the net value`,2);
  else
    this. _notification.ShowMessage('قيمة خصم الفاتورة اكبر من قيمة صافى الفاتورة',2);
    return;
  }
  for (let i = 0; i < this.purchaseReturnesList.controls.length; i++)
  {
    this.checkTax(i);
  }
}

setEditValues(){
  for (let i = 0; i < this.purchaseReturnesList.controls.length; i++) {
    var itemNo=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    var unitID=((this.purchaseReturnsForm.get("purchaseReturnesList") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;
    var supplierNo=this.purchaseReturnsForm.get('n_supplier_id')?.value;
    this.items.push(itemNo);
    this._PurchaseSerive.GetTaxStatus(supplierNo,itemNo).subscribe(res=>{
      if(res.n_taxes_type== 1 && res.n_supplier_tax==1)
      {
        this.taxPercentage.push(res.n_VAT);
        this.itemsTax.push(true);
      }
      else
      {
        this.taxPercentage.push(0);
        this.itemsTax.push(false);
      }
      this._PurchaseSerive.GetUnitCoff(itemNo,unitID).subscribe(data=>{
        this.unitCoff.push(data);
      });
    });
  }
}

  resetDetailsValues(i: number)
  {
    ((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
    ((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
    ((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
    ((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue('');
    ((this.purchaseReturnsForm.get('purchaseReturnesList') as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue('');
  }

  setMainValues(){
    this._helperService.GetCurrentCurrency().subscribe(res=>{
      debugger;
      this.localCurrency=res.n_currency_id;
      for (let i = 0; i < this.expensesList.length; i++) {
        if( this.purchaseReturnsForm.value.expensesList[i].n_currency_id == this.localCurrency)
        {
          ((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('nCoff')?.disable();
        }
        this.expensesValue +=((this.purchaseReturnsForm.get("expensesList") as FormArray).at(i) as FormGroup).get('n_value')?.value;
      }
    });
  }

}


