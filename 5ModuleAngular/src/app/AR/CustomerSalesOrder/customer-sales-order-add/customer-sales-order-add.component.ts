import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { CustomersLkpComponent } from 'src/app/Controls/customers-lkp/customers-lkp.component';
import { StoresLookUpComponent } from 'src/app/Controls/stores-look-up/stores-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { CustomerSalesOrderService } from 'src/app/Core/Api/AR/customer-sales-order.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';
import { GeneralSC } from 'src/app/Core/Api/SC/genereal-sc.service';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ItemsSalesorderLkpComponent } from 'src/app/Controls/items-salesorder-lkp/items-salesorder-lkp.component';
import { PurchaseInvoiceService } from 'src/app/Core/Api/AP/purchase-invoice.service';

@Component({
  selector: 'app-customer-sales-order-add',
  templateUrl: './customer-sales-order-add.component.html',
  styleUrls: ['./customer-sales-order-add.component.css']
})
export class CustomerSalesOrderAddComponent implements OnInit {
  ar_customer_sales_order!: FormGroup;
  showspinner: boolean = false;
  n_doc_no: number = 0;

  currenciesList!: any;
  localCurrency!: any;
  n_currency_id: number = 0;
  currencyName!: string;

  searchingStoreList: any;
  searchingsCustomers: any;
  searchingStore: boolean = false;
  searchingCustomer:boolean=false;
  filteredStoreServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCustomerServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  isEnglish:boolean=false;
  transSourceList!: any;
  transNo: number = 0;
  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  isCustomerExist: boolean = false;
  isStoreExist: boolean = false;
  timeout: any;
  priorityList: any;
  paymentWays: any;

  constructor(private _service: CustomerSalesOrderService, private _notificationService: NotificationServiceService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder,
    private _helperService: HelperService,
    private dialog: MatDialog,
    private _lookUp:GenerealLookup,
    private _geCS:GeneralSC,
    private _transSource: SCTransTypeService,
    private _LookupControlService:LookupControlService,
    private _PurchaseInvoiceService: PurchaseInvoiceService
    )
    {
      this.ar_customer_sales_order = this._formBuilder.group({
        n_doc_no: new FormControl(),
        n_DataAreaID: new FormControl(),
        n_UserAdd: new FormControl(),
        d_UserAddDate: new FormControl(),
        n_UserUpdate: new FormControl(),
        d_UserUpdateDate: new FormControl(),
        d_doc_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_Actual_Doc_no: new FormControl(),
        n_customer_id: new FormControl('', Validators.required),
        s_customer_name: new FormControl(),
        n_store_id: new FormControl('', Validators.required),
        s_store_name: new FormControl(),
        n_currency_id: new FormControl(),
        n_currency_coff: new FormControl(),
        b_confirm: new FormControl(),
        n_trans_source_no: new FormControl(),
        s_delivery_place: new FormControl(),
        s_notes: new FormControl(),
        s_notes_eng: new FormControl(),
        s_reference: new FormControl(),
        n_total_value: new FormControl(),
        n_discount: new FormControl(),
        n_extra_discount: new FormControl(),
        n_net_value: new FormControl(),
        ar_customer_sales_order_details: this._formBuilder.array([]),
        ar_Customer_sales_order_Installment: this._formBuilder.array([])
      });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_doc_no = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.searchStores('');
    this.searchCustomers('');
    this.LoadData();

    if(this.n_doc_no <= 0)
    {
      this._service.GetCurrentOrder().subscribe((data) => {
        this.ar_customer_sales_order.patchValue(data);
        this.ar_customer_sales_order.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.Add_ar_customer_sales_order_details();
    }

    if(this.n_doc_no > 0)
    {
      this._service.GetByID(this.n_doc_no).subscribe((data) => {
        this.transNo = data.n_trans_source_no;
        this.ar_customer_sales_order.patchValue(data);
        this._LookupControlService.SetName(this.ar_customer_sales_order, "cust", "n_customer_id", "CustomerName");
        this.ar_customer_sales_order.get('d_doc_date')?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))))
        this.n_currency_id = data['n_currency_id'];
        if(data.n_customer_id !== null || data.n_customer_id !== "")
        {
          this.executeCustomersListing(data.n_customer_id);
          this.isCustomerExist = true;
        }
        if(data.n_store_id !== null || data.n_store_id !== "")
        {
          this.executeStoreListing(data.n_store_id);
          this.isStoreExist = true;
        }
        data.ar_customer_sales_order_details.forEach(element => {
          this.ar_customer_sales_order_details.push(this.push_ar_customer_sales_order_detailsRow(this.ar_customer_sales_order_details.length + 1));
        });
        (this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray)?.patchValue(data.ar_customer_sales_order_details);

        for(var i = 0; i < this.ar_customer_sales_order_details.length; i++)
        {
          (this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i).get('d_ExpectedDate')?.patchValue(new Date(Number(data.ar_customer_sales_order_details[i].d_ExpectedDate.substring(0,4)), Number(data.ar_customer_sales_order_details[i].d_ExpectedDate.substring(5,7))-1, Number(data.ar_customer_sales_order_details[i].d_ExpectedDate.substring(8,10))));
          this.isItemExist[i] = true;
          this.isUnitExist[i] = true;
        }

        data.ar_Customer_sales_order_Installment.forEach(element => {
          this.ar_Customer_sales_order_Installment.push(this.push_ar_Customer_sales_order_InstallmentRow(this.ar_Customer_sales_order_Installment.length + 1));
        });
        (this.ar_customer_sales_order.get('ar_Customer_sales_order_Installment') as FormArray)?.patchValue(data.ar_Customer_sales_order_Installment);

        for(var i = 0; i < this.ar_Customer_sales_order_Installment.length; i++)
          (this.ar_customer_sales_order.get('ar_Customer_sales_order_Installment') as FormArray).at(i).get('d_installment_date')?.patchValue(new Date(Number(data.ar_Customer_sales_order_Installment[i].d_installment_date.substring(0,4)), Number(data.ar_Customer_sales_order_Installment[i].d_installment_date.substring(5,7))-1, Number(data.ar_Customer_sales_order_Installment[i].d_installment_date.substring(8,10))));


        this.showspinner = false;
      });
    }

    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();

    this.isEnglish=LangSwitcher.CheckLan()
  }

  LoadData(): void
  {
    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });

    this._helperService.GetCurrencies().subscribe((data) => {
      this.currenciesList = data;
    });

    this._service.GetTransSourceDropList().subscribe((data) => {
      this.transSourceList = data;
    });

    this._helperService.GetAppPriority().subscribe((data) => {
      this.priorityList = data;
    });

    this._helperService.GetPaymentWays().subscribe((data) => {
      this.paymentWays = data;
    });
  }

  get ar_customer_sales_order_details(): FormArray {
    return this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray;
  }

  get ar_Customer_sales_order_Installment(): FormArray {
    return this.ar_customer_sales_order.get('ar_Customer_sales_order_Installment') as FormArray;
  }

  push_ar_customer_sales_order_detailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_qty: '',
      n_unit_price: '',
      n_item_value: 0,
      n_discount_percent: '',
      n_discount_value: '',
      n_extra_discount: '',
      n_net_value: '',
      n_Bonus: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: '',
      d_ExpectedDate: '',
      n_Highpriority: '',
      s_notes: '',
      n_trans_source_doc_no: ''
    });
  }

  push_ar_Customer_sales_order_InstallmentRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      n_installment_value: '',
      d_installment_date: '',
      n_payment_type: ''
    });
  }

  Add_ar_customer_sales_order_details()
  {
    this.ar_customer_sales_order_details.push(this.push_ar_customer_sales_order_detailsRow(this.ar_customer_sales_order_details.length + 1));
  }

  Add_ar_Customer_sales_order_Installment()
  {
    this.ar_Customer_sales_order_Installment.push(this.push_ar_Customer_sales_order_InstallmentRow(this.Add_ar_Customer_sales_order_Installment.length + 1));
  }

  removeItem(i)
  {
    if(this.ar_customer_sales_order_details.length == 1)
    {
      if(this.isEnglish)
      this._notificationService.ShowMessage("must contain a single item ", 3);
     else
      this._notificationService.ShowMessage("يجب ان يحتوي الأمر علي صنف واحد علي الاقل", 3);

      return;
    }

    this.ar_customer_sales_order_details.removeAt(i);
  }

  removeInstallment(i)
  {
    this.ar_Customer_sales_order_Installment.removeAt(i);
  }

  // Dropdowns
  currencyChanged(){
    this.n_currency_id = this.ar_customer_sales_order.value.n_currency_id;
    if(this.n_currency_id == this.localCurrency)
      this.ar_customer_sales_order.get('n_currency_coff')?.patchValue(1);
  }

  searchStores(value :any){
    this.searchingStore=true;
    this._service.GetStoresDP(value).subscribe(res=>{
      this.searchingStoreList=res;
      this.filteredStoreServerSide.next(this.searchingStoreList.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.searchingStore=false;
    });
  }

  searchCustomers(value :any){
    this.searchingCustomer=true;
    this._service.GetCustomersDP(value).subscribe(res=>{
      this.searchingsCustomers=res;
      this.filteredCustomerServerSide.next(  this.searchingsCustomers.filter(x => x.s_customer_name.toLowerCase().indexOf(value) > -1));
      this.searchingCustomer=false;
    });
  }

  TransSourceChanged() {
    this.transNo = this.ar_customer_sales_order.value.n_trans_source_no;
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
        this.ar_customer_sales_order_details.clear();
        data.forEach(element => {
          this.ar_customer_sales_order_details.push(this.push_ar_customer_sales_order_detailsRow(this.ar_customer_sales_order_details.length));
        });
        this.ar_customer_sales_order.patchValue(data[0]);
        this.executeStoreListing(data[0]['n_store_id']);

        (this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray)?.patchValue(data);
        for(var i = 0; i < this.ar_customer_sales_order.value.ar_customer_sales_order_details.length; i++) {
          // ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data[i].s_item_name);
          // ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('s_unit_name')?..patchValue(data[i].s_unit_name);
          ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_trans_source_doc_no')?.patchValue(data[i].n_doc_no);
        }
      });
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
      this.ar_customer_sales_order.get("n_customer_id")?.patchValue(res.data.n_customer_id );
      this.ar_customer_sales_order.get("s_customer_name")?.patchValue(res.data.n_customer_id +" # "+ res.data.s_customer_name );
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
    this.ar_customer_sales_order.get('s_customer_name')?.patchValue('');
    this._helperService.GetCustomerData(value).subscribe((data) => {
      if(data.s_customer_name !== "" && data.s_customer_name !== null)
      {
        this.ar_customer_sales_order.get('s_customer_name')?.patchValue(data.s_customer_name +" # "+value);
        this.isCustomerExist = true;
      }
      else{
        this.isCustomerExist = false;
        this.ar_customer_sales_order.get('s_customer_name')?.patchValue('');
      }
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
      this.ar_customer_sales_order.get("n_store_id")?.patchValue(res.data.n_store_id );
      this.ar_customer_sales_order.get("s_store_name")?.patchValue(res.data.s_store_name);
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
  // searchBegin(event)

  // {

  // setTimeout(() => {

  //   this._lookUp.getSearchCustromers(event.target.value,event.target.value).subscribe(
  //     (res)=>{
  //   debugger;
  //       this.searchingCustomer=res
  //     }
  //   )

  // }, 2000);

  // }

  // searchStoreBegin(event)
  // {
  //   setTimeout(() => {

  //     this._lookUp.getStoreSearch(event.target.value,event.target.value).subscribe(
  //       (res)=>{
  //     debugger;
  //         this.searchingStore=res
  //       }
  //     )

  //   }, 2000);
  // }
selectItem(i,searchInputNumber,inputName,inputNumber)
{
  debugger
  let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
  let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber+" #tdS" + i) as HTMLElement;

  (this.ar_customer_sales_order.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
  (this.ar_customer_sales_order.get(inputNumber))?.patchValue(AccountNo.innerHTML);
  let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
  element.style.opacity="0";
  element.style.zIndex="-1";
}

  private executeStoreListing(value: number) {
  this.ar_customer_sales_order.get('s_store_name')?.patchValue('');
  this._helperService.GetStoreData(value).subscribe((data) => {
    debugger
    if(data.s_store_name !== "" && data.s_store_name !== null)
    {
      this.ar_customer_sales_order.get('s_store_name')?.patchValue(data.s_store_name + " # "+value);
      this.isStoreExist = true;
    }
    else{
      this.isStoreExist = false;
      this.ar_customer_sales_order.get('s_store_name')?.patchValue('');
    }
  });
  }
  //___________________________________

  // Details LookUps
  currentItemIndex: number = 0;
  loadItems(i: number) {
    this.currentItemIndex=i;
    
     const dialogRef = this.dialog.open(ItemsSalesorderLkpComponent, {
       width: '700px',
       height:'600px',
       data: { }
     });

     dialogRef.afterClosed().subscribe(res => {
      this.isItemExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      // ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
      // ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
      // this._geCS.GetLastCost(res.data.s_item_id,this.ar_customer_sales_order.get("d_doc_date")?.value,this.ar_customer_sales_order.get("n_store_id")?.value==""? 0:Number(this.ar_customer_sales_order.get("n_store_id")?.value)).subscribe((data)=>{
      //   ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_price')?.patchValue(data);
      // });
      // this.GetItemCost(i);
    });
  }

  onKeyItemSearch(event: any, i) {
  clearTimeout(this.timeout);
  this.resetDetailsValues(i);
  ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
  ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeItemListing(event.target.value, i);
    }
    }, 1000);
  }

  private executeItemListing(value: string, i) {
  this._service.GetItemName(value).subscribe((data) => {
    if(data != '' && data != null && data != undefined){
      this.isItemExist[i] = true;
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.name);
      // ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(data.n_unit_id);
      // ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
    }
    else{
      this.isItemExist[i] = false;
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    }
  });
  }

  ChangeUnit(i:number)
  {
    var itemNo=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    var unitNo=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;

    this._PurchaseInvoiceService.GetUnitName(itemNo,unitNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
      else
      {
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name); 
      }
    });

  }

  currentUnitIndex: number = 0;
  loadUnits(i: number) {
    this.currentUnitIndex=i;
    let itemID=  ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isUnitExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
    });
  }

  onKeyUnitSearch(event: any, i) {
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeUnitListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeUnitListing(value: number, i) {
    var itemId = ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._helperService.GetUnitData(value, itemId).subscribe((data) => {
      if(data.s_unit_name != '' && data.s_unit_name != null){
        this.isUnitExist[i] = true;
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
      }
      else{
        this.isUnitExist[i] = false;
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
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
      debugger
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost1(i:number)
  {
    var costNo=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;
    this._helperService.GetCostData(costNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
      }
      else
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.s_cost_center_name);
    });
  }

  LoadCostCenter2(i:number){
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
      ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost2(i:number)
  {
    var costNo=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;
    this._helperService.GetCostData(costNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
      }
      else
        ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.s_cost_center_name);
    });
  }

  resetDetailsValues(i)
  {
    ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
    ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
    ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
  }
  //___________________________________________

  Save()
  {
    if(this.ValidateMaster() == false || this.ValidateDetails() == false)
      return;

    this.showspinner = true;

    var formData = new FormData();
    this.ar_customer_sales_order.value.d_doc_date=new DatePipe('en-US').transform(this.ar_customer_sales_order.value.d_doc_date, 'yyyy/MM/dd');
    formData.append("n_doc_no", this.ar_customer_sales_order?.value.n_doc_no ?? 0);
    formData.append("n_DataAreaID", this.ar_customer_sales_order?.value.n_DataAreaID ?? 0);
    formData.append("n_UserAdd", this.ar_customer_sales_order?.value.n_UserAdd ?? 0);
    formData.append("d_UserAddDate", this.ar_customer_sales_order?.value.d_UserAddDate ?? '');
    formData.append("n_UserUpdate", this.ar_customer_sales_order?.value.n_UserUpdate ?? 0);
    formData.append("d_UserUpdateDate", this.ar_customer_sales_order?.value.d_UserUpdateDate ?? '');
    formData.append("d_doc_date", this.ar_customer_sales_order?.value.d_doc_date ?? '');
    formData.append("n_Actual_Doc_no", this.ar_customer_sales_order?.value.n_Actual_Doc_no ?? 0);
    formData.append("n_customer_id", this.ar_customer_sales_order?.value.n_customer_id ?? 0);
    formData.append("n_store_id", this.ar_customer_sales_order?.value.n_store_id ?? 0);
    formData.append("n_currency_id", this.ar_customer_sales_order?.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.ar_customer_sales_order?.value.n_currency_coff ?? 0);
    formData.append("b_confirm", this.ar_customer_sales_order?.value.b_confirm ?? false);
    formData.append("n_trans_source_no", this.ar_customer_sales_order?.value.n_trans_source_no ?? 0);
    formData.append("s_delivery_place", this.ar_customer_sales_order?.value.s_delivery_place ?? '');
    formData.append("s_notes", this.ar_customer_sales_order?.value.s_notes ?? '');
    formData.append("s_notes_eng", this.ar_customer_sales_order?.value.s_notes_eng ?? '');
    formData.append("s_reference", this.ar_customer_sales_order?.value.s_reference ?? '');
    formData.append("n_total_value", this.ar_customer_sales_order?.value.n_total_value ?? 0);
    formData.append("n_discount", this.ar_customer_sales_order?.value.n_discount ?? 0);
    formData.append("n_extra_discount", this.ar_customer_sales_order?.value.n_extra_discount ?? 0);
    formData.append("n_net_value", this.ar_customer_sales_order?.value.n_net_value ?? 0);

    for(var i = 0; i < this.ar_customer_sales_order_details.length; i++)
    {
      this.ar_customer_sales_order.value.ar_customer_sales_order_details[i].d_ExpectedDate=new DatePipe('en-US').transform(this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].d_ExpectedDate, 'yyyy/MM/dd')
      formData.append(`ar_customer_sales_order_details[${i}].s_item_id`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_item_id ?? '');
      formData.append(`ar_customer_sales_order_details[${i}].n_unit_id`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_unit_id ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_qty`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_qty ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_unit_price`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_unit_price ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_item_value`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_item_value ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_discount_percent`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_discount_percent ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_discount_value`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_discount_value ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_extra_discount`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_extra_discount ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_net_value`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_net_value ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].n_Bonus`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_Bonus ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].s_cost_center_id`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_cost_center_id ?? '');
      formData.append(`ar_customer_sales_order_details[${i}].s_cost_center_id2`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_cost_center_id2 ?? '');
      formData.append(`ar_customer_sales_order_details[${i}].d_ExpectedDate`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].d_ExpectedDate ?? '');
      formData.append(`ar_customer_sales_order_details[${i}].n_Highpriority`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_Highpriority ?? 0);
      formData.append(`ar_customer_sales_order_details[${i}].s_notes`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_notes ?? '');
      formData.append(`ar_customer_sales_order_details[${i}].n_trans_source_doc_no`, this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_trans_source_doc_no ?? 0);
    }

    if(this.ar_Customer_sales_order_Installment.length > 0)
    {
      for(var i = 0; i < this.ar_Customer_sales_order_Installment.length; i++)
      {
        this.ar_customer_sales_order.value.ar_Customer_sales_order_Installment[i].d_installment_date=new DatePipe('en-US').transform(this.ar_customer_sales_order?.value.ar_Customer_sales_order_Installment[i].d_installment_date, 'yyyy/MM/dd')
        formData.append(`ar_Customer_sales_order_Installment[${i}].n_installment_value`, this.ar_customer_sales_order?.value.ar_Customer_sales_order_Installment[i].n_installment_value ?? 0);
        formData.append(`ar_Customer_sales_order_Installment[${i}].d_installment_date`, this.ar_customer_sales_order?.value.ar_Customer_sales_order_Installment[i].d_installment_date ?? '');
        formData.append(`ar_Customer_sales_order_Installment[${i}].n_payment_type`, this.ar_customer_sales_order?.value.ar_Customer_sales_order_Installment[i].n_payment_type ?? 0);
      }
    }

    if(this.n_doc_no !=null && this.n_doc_no > 0 ){

      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        this. _notificationService.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customerSalesOrderList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      this. _notificationService.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customerSalesOrderList']);
        }
      });
    }
  }

  // Form Validation
  ValidateMaster(): boolean
  {
    var isValid = true;
    if(this.ar_customer_sales_order?.value.d_doc_date == "" || this.ar_customer_sales_order?.value.d_doc_date == null)
    {
      if(this.isEnglish)
        this._notificationService.ShowMessage('Please insert date',3)
      else
      this._notificationService.ShowMessage("من فضلك ادخل تاريخ الآمر", 3);
      isValid = false;
    }
    if(this.ar_customer_sales_order?.value.n_customer_id == "" || this.ar_customer_sales_order?.value.n_customer_id == null || this.ar_customer_sales_order?.value.n_customer_id == 0)
    {
      if(this.isEnglish)
       this._notificationService.ShowMessage('Please choose the customer' ,3)
      else
      this._notificationService.ShowMessage("من فضلك اختر العميل", 3);
      isValid = false;
    }
    if(this.ar_customer_sales_order?.value.n_store_id == "" || this.ar_customer_sales_order?.value.n_store_id == null || this.ar_customer_sales_order?.value.n_store_id == 0)
    {
      if(this.isEnglish)
       this._notificationService.ShowMessage('Please choose store',3)
      else
      this._notificationService.ShowMessage("من فضلك اختر المخزن", 3);
      isValid = false;
    }
    return isValid;
  }

  ValidateDetails(): boolean
  {
    var isValid = true;
    for(var i = 0; i < this.ar_customer_sales_order_details.length; i++)
    {
      if(this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_item_id == "" || this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_item_id == null)
      {
        if(this.isEnglish)
        this._notificationService.ShowMessage(`Please choose item number in line   ${ i + 1}`, 3);
        else
        this._notificationService.ShowMessage(`من فضلك اختر رقم الصنف في السطر رقم  ${ i + 1}`, 3);
        isValid = false;
      }
      if(this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_item_name == "" || this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_item_name == null)
      {
        if(this.isEnglish)
          this._notificationService.ShowMessage(`Item number isnt in line ${i+1}` ,3)
        else

         this._notificationService.ShowMessage(`اسم الصنف غير موجود في السطر رقم  ${ i + 1}`, 3);
        isValid = false;
      }
      if(this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_unit_id == "" || this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_unit_id == null)
      {
        if(this.isEnglish)
        this._notificationService.ShowMessage(`Please choose unit number  in line  ${ i + 1}`, 3);
        else
        this._notificationService.ShowMessage(`من فضلك اختر رقم الوحدة في السطر رقم  ${ i + 1}`, 3);

        isValid = false;
      }
      if(this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_unit_name == "" || this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].s_unit_name == null)
      {
        if(this.isEnglish)
          this._notificationService.ShowMessage(`the unit name isn't in line ${i+1}`,3)
       else
         this._notificationService.ShowMessage(`اسم الوحدة غير موجود في السطر رقم  ${ i + 1}`, 3);
        isValid = false;
      }
      if(this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_qty == "" || this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_qty == null)
      {
        if(this.isEnglish)
           this._notificationService.ShowMessage(`Please insert qty in line ${i+1}`,3)
        else
        this._notificationService.ShowMessage(`من فضلك ادخل الكمية في السطر رقم  ${ i + 1}`, 3);

        isValid = false;
      }
      if(this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_unit_price == "" || this.ar_customer_sales_order?.value.ar_customer_sales_order_details[i].n_unit_price == null)
      {
        if(this.isEnglish)
          this._notificationService.ShowMessage(`Please insert price in line ${i+1}`,3)
        else
        this._notificationService.ShowMessage(`من فضلك ادخل سعر الوحدة في السطر رقم  ${ i + 1}`, 3);
        isValid = false;
      }
    }
    return isValid;
  }
  //____________________________________

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  // Calculations
  calcRows(i: number)
  {
    var qty = ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var unitPrice = ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var discountP = ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_discount_percent')?.value;
    var discountV = ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_discount_value')?.value;
    ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(qty * unitPrice);
    var itemValue = ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value;

    if(discountP !== "" || discountP !== null || discountP !== 0)
    {
      ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_discount_value')?.patchValue(itemValue * discountP/100);
      discountV = itemValue * discountP/100;
    }
  }

  calcTaxP(i:number){
    var discountP=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_discount_percent')?.value;
    var qty=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discV=(discountP/100)*total;
    ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_discount_value')?.patchValue(discV);
    // this.calcRows(i,1);
  }

  calcTaxV(i:number){
    var discountV=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_discount_value')?.value;
    var qty=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discP=(discountV/total)*100;
    ((this.ar_customer_sales_order.get("ar_customer_sales_order_details") as FormArray).at(i) as FormGroup).get('n_discount_percent')?.patchValue(discP);
    // this.calcRows(i,1);
  }

  calcNetVal(i: number)
  {
    var itemValue = ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value;
    var discountV = ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_discount_value')?.value;

    ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_net_value')?.patchValue(itemValue - discountV);
  }

  calcMaster()
  {
    debugger;
    var totalVal = 0;  var totalDisc = 0; var totalNet = 0;
    for(var i = 0; i < this.ar_customer_sales_order_details.length; i++)
    {
      totalVal += Number(((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value ?? 0);
      totalDisc += Number( ((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_discount_value')?.value ?? 0);
      totalNet += Number(((this.ar_customer_sales_order.get('ar_customer_sales_order_details') as FormArray).at(i) as FormGroup).get('n_net_value')?.value ?? 0);
    }
    this.ar_customer_sales_order.get('n_total_value')?.patchValue(totalVal);
    this.ar_customer_sales_order.get('n_discount')?.patchValue(totalDisc);
    this.ar_customer_sales_order.get('n_net_value')?.patchValue(totalNet);
  }

  //_____________________________________
}
