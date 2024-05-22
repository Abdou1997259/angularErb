import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CustomersLkpComponent } from 'src/app/Controls/customers-lkp/customers-lkp.component';
import { SalersLkpComponent } from 'src/app/Controls/salers-lkp/salers-lkp.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { CustomerQuotationService } from 'src/app/Core/Api/AR/customer-quotations.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { GeneralSC } from 'src/app/Core/Api/SC/genereal-sc.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ItemsQuotationsComponent } from 'src/app/Controls/items-quotations/items-quotations.component';
import { PurchaseInvoiceService } from 'src/app/Core/Api/AP/purchase-invoice.service';

@Component({
  selector: 'app-customer-quotation-add',
  templateUrl: './customer-quotation-add.component.html',
  styleUrls: ['./customer-quotation-add.component.css']
})
export class CustomerQuotationAddComponent implements OnInit {
  ar_Customer_Quotation!: FormGroup;
  showspinner: boolean = false;
  n_Quotation_no: number = 0;
  localCurrency: number = 0;
  n_currency_id: number = 0;

  // Cost center
  CostData: any = [];
  Cost2Data: any = [];
  searchingsCustomers: any;
  searchingsSalesMen: any;
  searchingCost:boolean=false;
  searchingCost2:boolean=false;
  searchingCustomer:boolean=false;
  searchingSalesman:boolean=false;
  filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCustomerServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredSalesmanServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  currenciesList: any;
  deliveryPlacesList: any;
  transSourceList: any;
  paymentWays: any;
  priorityList: any;
  isCustomerExist: boolean = false;
  isSalerExist: boolean = false;
  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  isEnglish:boolean=false;
  timeout: any;
  transNo: number = 0;

  constructor(private _service: CustomerQuotationService,
     private _notification: NotificationServiceService,
     private _activatedRoute: ActivatedRoute,
     private _router: Router,
     private _helperService: HelperService,
     private dialog: MatDialog,
     private _forBuilder: FormBuilder,
     private _lookUp:GenerealLookup,
     private _geCS:GeneralSC,
     private _PurchaseInvoiceService: PurchaseInvoiceService
     )
  {
    this.ar_Customer_Quotation = this._forBuilder.group({
      n_Quotation_no: new FormControl(),
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      n_UserUpdate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      d_Quotation_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      n_customer_id: new FormControl('', Validators.required),
      n_salesman_id: new FormControl(),
      s_AttachmentPerson: new FormControl(),
      d_quotation_start: new FormControl('', Validators.required),
      d_quotation_end: new FormControl('', Validators.required),
      n_currency_id: new FormControl(),
      n_currency_coff: new FormControl(),
      n_trans_source_no: new FormControl(),
      s_Referance: new FormControl(),
      s_cost_center_id: new FormControl(),
      s_cost_center_name: new FormControl(),
      s_cost_center_id2: new FormControl(),
      s_cost_center_name2: new FormControl(),
      s_DocReference: new FormControl(),
      n_delivery_place: new FormControl(),
      b_confirm: new FormControl(),
      n_insurValue: new FormControl(),
      n_TransportValue: new FormControl(),
      n_extra_discount: new FormControl(),
      n_extra_discount_ratio: new FormControl(),
      n_total_value: new FormControl(),
      n_total_discount: new FormControl(),
      serDiscRatio: new FormControl(),
      n_net_value: new FormControl(),

      ar_Customer_Quotation_Details: this._forBuilder.array([]),
      ar_Customer_Quot_Install: this._forBuilder.array([]),
      ar_Customer_Quotation_Discounts: this._forBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_Quotation_no = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.searchCustomers('');
    this.searchSalesman('');
    this.LoadData();

    if(this.n_Quotation_no <= 0)
    {
      this._service.GetCurrentQuotation().subscribe((data) => {
        this.ar_Customer_Quotation.patchValue(data);
        this.ar_Customer_Quotation.get("d_Quotation_date")?.patchValue((new Date()).toISOString().substring(0,10));

        this.showspinner = false;
      });
      this.Add_ar_Customer_Quotation_Details_Row();
    }

    if(this.n_Quotation_no > 0)
    {
      this._service.GetByID(this.n_Quotation_no).subscribe((data) => {
        this.ar_Customer_Quotation.patchValue(data);
        this.ar_Customer_Quotation.get("d_Quotation_date")?.patchValue(new Date(Number(data.d_Quotation_date.substring(0,4)), Number(data.d_Quotation_date.substring(5,7))-1, Number(data.d_Quotation_date.substring(8,10))));
        this.ar_Customer_Quotation.get("d_quotation_start")?.patchValue(new Date(Number(data.d_quotation_start.substring(0,4)), Number(data.d_quotation_start.substring(5,7))-1, Number(data.d_quotation_start.substring(8,10))));
        this.ar_Customer_Quotation.get("d_quotation_end")?.patchValue(new Date(Number(data.d_quotation_end.substring(0,4)), Number(data.d_quotation_end.substring(5,7))-1, Number(data.d_quotation_end.substring(8,10))));
        this.n_currency_id = data.n_currency_id;
        this.isCustomerExist = true;

        data.ar_Customer_Quotation_Details.forEach(element => {
          this.ar_Customer_Quotation_Details.push(this.pushIn_ar_Customer_Quotation_Details(this.ar_Customer_Quotation_Details.length + 1));
        });
        (this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray)?.patchValue(data.ar_Customer_Quotation_Details);

        data.ar_Customer_Quot_Install.forEach(element => {
          this.ar_Customer_Quot_Install.push(this.pushIn_ar_Customer_Quot_Install(this.ar_Customer_Quot_Install.length + 1));
        });
        (this.ar_Customer_Quotation.get('ar_Customer_Quot_Install') as FormArray)?.patchValue(data.ar_Customer_Quot_Install);

        data.ar_Customer_Quotation_Discounts.forEach(element => {
          this.ar_Customer_Quotation_Discounts.push(this.pushIn_ar_Customer_Quotation_Discounts(this.ar_Customer_Quotation_Discounts.length + 1));
        });
        (this.ar_Customer_Quotation.get('ar_Customer_Quotation_Discounts') as FormArray)?.patchValue(data.ar_Customer_Quotation_Discounts);

        for(var i = 0; i < this.ar_Customer_Quotation_Details.length; i++)
        {
          (this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i).get('d_ExpectedDate')?.patchValue(new Date(Number(data.ar_Customer_Quotation_Details[i].d_ExpectedDate.substring(0,4)), Number(data.ar_Customer_Quotation_Details[i].d_ExpectedDate.substring(5,7))-1, Number(data.ar_Customer_Quotation_Details[i].d_ExpectedDate.substring(8,10))));
          (this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i).get('d_ExpireDate')?.patchValue(new Date(Number(data.ar_Customer_Quotation_Details[i].d_ExpireDate.substring(0,4)), Number(data.ar_Customer_Quotation_Details[i].d_ExpireDate.substring(5,7))-1, Number(data.ar_Customer_Quotation_Details[i].d_ExpireDate.substring(8,10))));
          this.isItemExist[i] = true;
          this.isUnitExist[i] = true;
        }

        for(var i = 0; i < this.ar_Customer_Quot_Install.length; i++)
        {
          (this.ar_Customer_Quotation.get('ar_Customer_Quot_Install') as FormArray).at(i).get('d_installment_date')?.patchValue(new Date(Number(data.ar_Customer_Quot_Install[i].d_installment_date.substring(0,4)), Number(data.ar_Customer_Quot_Install[i].d_installment_date.substring(5,7))-1, Number(data.ar_Customer_Quot_Install[i].d_installment_date.substring(8,10))));
        }

        this.showspinner = false;
      });
    }
 
     LangSwitcher.translateData(1)
     LangSwitcher.translatefun();
     this.isEnglish=LangSwitcher.CheckLan();


  }

  LoadData(): void{
    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });

    this._helperService.GetCurrencies().subscribe((data) => {
      this.currenciesList = data;
    });

    this._helperService.GetDeliveryPlace().subscribe((data) => {
      this.deliveryPlacesList = data;
    });

    this._service.GetTransSourceDropList().subscribe((data) => {
      this.transSourceList = data;
    });

    this._helperService.GetPaymentWays().subscribe((data) => {
      this.paymentWays = data;
    });

    this._helperService.GetAppPriority().subscribe((data) => {
      this.priorityList = data;
    });

    this.searchCost('');
    this.searchCost2('');
  }

  // Details
  get ar_Customer_Quotation_Details(): FormArray{
    return this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray;
  }

  get ar_Customer_Quot_Install(): FormArray{
    return this.ar_Customer_Quotation.get('ar_Customer_Quot_Install') as FormArray;
  }

  get ar_Customer_Quotation_Discounts(): FormArray{
    return this.ar_Customer_Quotation.get('ar_Customer_Quotation_Discounts') as FormArray;
  }

  pushIn_ar_Customer_Quotation_Details(line: number = 0): FormGroup
  {
    return this._forBuilder.group({
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      sBatchNO: '',
      d_ExpireDate: '',
      n_qty: '',
      n_unit_price: '',
      n_item_value: '',
      nItemDiscountP: '',
      nItemDiscountV: '',
      nInvDiscountP: '',
      nInvDiscountV: '',
      n_over_Discount_Ratio: '',
      n_over_Discount2_Ratio: '',
      n_item_net_value: '',
      n_Bonus: '',
      d_ExpectedDate: '',
      n_Highpriority: '',
      n_trans_source_doc_no: '',
      s_notes: ''
    });
  }

  pushIn_ar_Customer_Quot_Install(line: number = 0): FormGroup
  {
    return this._forBuilder.group({
      nLineNo: line,
      n_installment_serial: '',
      n_installment_value: '',
      d_installment_date: '',
      n_payment_type: ''
    });
  }

  pushIn_ar_Customer_Quotation_Discounts(line: number = 0): FormGroup
  {
    return this._forBuilder.group({
      nLineNo: line,
      n_Quotation_no: '',
      n_discount_ratio: ''
    });
  }

  Add_ar_Customer_Quotation_Details_Row()
  {
    this.ar_Customer_Quotation_Details.push(this.pushIn_ar_Customer_Quotation_Details(this.ar_Customer_Quotation_Details.length + 1));
  }

  Add_ar_Customer_Quot_Install_Row()
  {
    this.ar_Customer_Quot_Install.push(this.pushIn_ar_Customer_Quot_Install(this.ar_Customer_Quot_Install.length + 1));
  }

  Add_ar_Customer_Quotation_Discounts_Row()
  {
    this.ar_Customer_Quotation_Discounts.push(this.pushIn_ar_Customer_Quotation_Discounts(this.ar_Customer_Quotation_Discounts.length + 1));
  }

  Remove_ar_Customer_Quotation_Details_Row(i: number)
  {
    if(this.ar_Customer_Quotation_Details.length == 1)
    {
      if(this.isEnglish)
         
      this._notification.ShowMessage("must be one price at single item  ", 3);
      else
      this._notification.ShowMessage("يجب ان يحتوي عرض السعر علي صنف واحد علي الآقل", 3);
      return;
    }
    this.ar_Customer_Quotation_Details.removeAt(i);
  }

  Remove_ar_Customer_Quot_Install_Row(i: number)
  {
    this.ar_Customer_Quot_Install.removeAt(i);
  }

  Remove_ar_Customer_Quotation_Discounts_Row(i: number)
  {
    this.ar_Customer_Quotation_Discounts.removeAt(i);
  }
  //______________________________________

  // LKP
  LoadCustomers(event:any)
 {
    const dialogRef = this.dialog.open(CustomersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isCustomerExist = true;
      this.ar_Customer_Quotation.get("n_customer_id")?.patchValue(res.data.n_customer_id );
      this.ar_Customer_Quotation.get("s_customer_name")?.patchValue(  res.data.n_customer_id + " # "+res.data.s_customer_name);
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
    this.ar_Customer_Quotation.get('s_customer_name')?.patchValue('');
    this._helperService.GetCustomerData(value).subscribe((data) => {
      if(data.s_customer_name !== "" && data.s_customer_name !== null)
      {
        this.ar_Customer_Quotation.get('s_customer_name')?.patchValue(data.s_customer_name +" # "+value);
        this.isCustomerExist = true;
      }
      else{
        this.isCustomerExist = false;
        this.ar_Customer_Quotation.get('s_customer_name')?.patchValue('');
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
      this.ar_Customer_Quotation.get("n_salesman_id")?.patchValue(res.data.n_salesman_id );
      this.ar_Customer_Quotation.get("s_salesman_name")?.patchValue( res.data.n_salesman_id  +" # "+res.data.s_salesman_name);
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
  // searchSalesMenBegin(event)
  // {
  //   setTimeout(() => {
  //     this._lookUp.getSearchSalesMen(event.target.value,event.target.value).subscribe(
  //       (res)=>{
  //         this.searchingsSalesMen=res
  //      }
  //     )
  //   }, 2000);
  // }

  searchCustomers(value :any){
    this.searchingCustomer=true;
    this._service.GetCustomerDP(value).subscribe(res=>{
      debugger
      this.searchingsCustomers=res;
      this.filteredCustomerServerSide.next(this.searchingsCustomers.filter(x => x.s_customer_name.toLowerCase().indexOf(value) > -1));
      this.searchingCustomer=false;
    });
  }

  searchSalesman(value :any){
    this.searchingSalesman=true;
    this._service.GetSalesmenDP(value).subscribe(res=>{
      this.searchingsSalesMen=res;
      this.filteredSalesmanServerSide.next(this.searchingsSalesMen.filter(x => x.s_salesman_name.toLowerCase().indexOf(value) > -1));
      this.searchingSalesman=false;
    });
  }

  // searchSalesCustomers(event)

  // {

  // setTimeout(() => {

  //   this._lookUp.getSearchCustromers(event.target.value,event.target.value).subscribe(
  //     (res)=>{
  //   debugger;
  //       this.searchingsCustomers=res
  //     }
  //   )

  // }, 2000);

  // }
  selectItem(i,searchInputNumber,inputName,inputNumber)
  {
    debugger
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber+" #tdS" + i) as HTMLElement;

    (this.ar_Customer_Quotation.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.ar_Customer_Quotation.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  private executeSalerListing(value: number) {
    this.ar_Customer_Quotation.get('s_salesman_name')?.patchValue('');
    this._helperService.GetSalerData(value).subscribe((data) => {
      if(data.s_salesman_name != "")
      {
        this.ar_Customer_Quotation.get('s_salesman_name')?.patchValue(data.s_salesman_name);
        this.isSalerExist = true;
      }
      else{
        this.isSalerExist = false;
        this.ar_Customer_Quotation.get('s_salesman_name')?.patchValue('');
      }
    });
  }

  TransSourceChanged() {
    this.transNo = this.ar_Customer_Quotation.value.n_trans_source_no;
  }
  //_________________________________________

  // Dropdowns
  searchCost(value :any){
    this.searchingCost=true;
    this._helperService.GetCostCenters(value).subscribe(res=>{
      this.CostData=res;
      this.filteredCostCenterServerSide.next(this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost=false;
    });
  }

  searchCost2(value :any){
    this.searchingCost2=true;
    this._helperService.GetCostCenters(value).subscribe(res=>{
      this.Cost2Data=res;
      this.filteredCostCenter2ServerSide.next(this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost2=false;
    });
  }

  currencyChanged(){
    this.n_currency_id = this.ar_Customer_Quotation.value.n_currency_id;
    if(this.n_currency_id == this.localCurrency)
      this.ar_Customer_Quotation.get('n_currency_coff')?.patchValue(1);
  }
  //______________________________________________________

  // Details LKP
  currentItemIndex: number = 0;
  loadItems(i: number) {
    this.currentItemIndex=i;

     const dialogRef = this.dialog.open(ItemsQuotationsComponent, {
       width: '700px',
       height:'600px',
       data: { }
     });

     dialogRef.afterClosed().subscribe(res => {
      this.isItemExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
        debugger
        this._geCS.GetItemLastCostByDate(res.data.s_item_id,this.ar_Customer_Quotation.get("d_Quotation_date")?.value).subscribe((data)=>{
          ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_price')?.patchValue(data);
        });
      // this.GetItemCost(i);
    });
  }

  onKeyItemSearch(event: any, i) {
  clearTimeout(this.timeout);
  this.resetDetailsValues(i);
  ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
  ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeItemListing(event.target.value, i);
    }
    }, 1000);
  }

  private executeItemListing(value: string, i) {
  this._helperService.GetItemData(value).subscribe((data) => {
    if(data.s_item_name != '' && data.s_item_name != null){
      this.isItemExist[i] = true;
      ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.s_item_name);
      ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(data.n_unit_id);
      ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
      this._geCS.GetItemLastCostByDate(data.s_item_id,this.ar_Customer_Quotation.get("d_import_date")?.value).subscribe((data)=>{
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(data);
       });
      // this.GetItemCost(i);
    }
    else{
      this.isItemExist[i] = false;
      ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    }
  });
  }

  currentUnitIndex: number = 0;
  loadUnits(i: number) {
    this.currentUnitIndex=i;
    let itemID=  ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isUnitExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
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
    var itemId = ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._helperService.GetUnitData(value, itemId).subscribe((data) => {
      if(data.s_unit_name != '' && data.s_unit_name != null){
        this.isUnitExist[i] = true;
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
      }
      else{
        this.isUnitExist[i] = false;
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
    });
  }

  resetDetailsValues(i : number)
  {
    ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
    ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
    ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
  }

  ChangeUnit(i:number)
  {
    var itemNo=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    var unitNo=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;

    this._PurchaseInvoiceService.GetUnitName(itemNo,unitNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
      else
      {
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name); 
      }
    });
  }

  ChangeItem(i:number)
  {
    var itemNo=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;

    this._service.GetItemName(itemNo).subscribe((data) => {
      if(data==null)
      {
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
      }
      else
        ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.name);  
    });
  }
  //________________________________________________________

  // Calculations
  calcRows(i: number)
  {
    var qty = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var unitPrice = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var discountP = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.value;
    var discountInvP = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nInvDiscountP')?.value;
    var discountV = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;
    var discountInvV = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.value;
    ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(qty * unitPrice);
    var itemValue = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value;

    if(discountP !== "" || discountP !== null || discountP !== 0)
    {
      ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue(itemValue * discountP/100);
      discountV = itemValue * discountP/100;
    }

    if(discountInvP !== "" || discountInvP !== null || discountInvP !== 0)
    {
      ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(itemValue * discountInvP/100);
      discountInvV = itemValue * discountInvP/100;
    }
  }

  calcTaxP(i:number){
    var discountP=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.value;
    var qty=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discV=(discountP/100)*total;
    ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue(discV);
    // this.calcRows(i,1);
  }

  calcTaxV(i:number){
    var discountV=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;
    var qty=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discP=(discountV/total)*100;
    ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue(discP);
    // this.calcRows(i,1);
  }

  calcTaxInvP(i:number){
    var discountP=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nInvDiscountP')?.value;
    var qty=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discV=(discountP/100)*total;
    ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(discV);
    // this.calcRows(i,1);
  }

  calcTaxInvV(i:number){
    var discountV=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.value;
    var qty=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
    var price=((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
    var total=qty*price;
    var discP=(discountV/total)*100;
    ((this.ar_Customer_Quotation.get("ar_Customer_Quotation_Details") as FormArray).at(i) as FormGroup).get('nInvDiscountP')?.patchValue(discP);
    // this.calcRows(i,1);
  }

  calcNetVal(i: number)
  {
    var itemValue = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value;
    var discountV = ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;

    ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_net_value')?.patchValue(itemValue - discountV);
  }

  calcMaster()
  {
    debugger;
    var totalVal = 0;  var totalDisc = 0; var totalNet = 0;
    for(var i = 0; i < this.ar_Customer_Quotation_Details.length; i++)
    {
      totalVal += Number(((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value ?? 0);
      totalDisc += Number( ((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value ?? 0);
      totalNet += Number(((this.ar_Customer_Quotation.get('ar_Customer_Quotation_Details') as FormArray).at(i) as FormGroup).get('n_net_value')?.value ?? 0);
    }
    this.ar_Customer_Quotation.get('n_total_value')?.patchValue(totalVal);
    this.ar_Customer_Quotation.get('n_discount')?.patchValue(totalDisc);
    this.ar_Customer_Quotation.get('n_net_value')?.patchValue(totalNet);
  }
  //_________________________________________________________

  Save()
  {
    if(this.ValidateMaster() == false || this.ValidateDetails() == false)
      return;
    this.showspinner = true;
    var formData = new FormData();
    this.ar_Customer_Quotation.value.d_Quotation_date=new DatePipe('en-US').transform(this.ar_Customer_Quotation.value.d_Quotation_date, 'yyyy/MM/dd');
    this.ar_Customer_Quotation.value.d_quotation_start=new DatePipe('en-US').transform(this.ar_Customer_Quotation.value.d_quotation_start, 'yyyy/MM/dd');
    this.ar_Customer_Quotation.value.d_quotation_end=new DatePipe('en-US').transform(this.ar_Customer_Quotation.value.d_quotation_end, 'yyyy/MM/dd');

    formData.append('n_Quotation_no' , this.ar_Customer_Quotation?.value.n_Quotation_no ?? 0);
    formData.append('n_DataAreaID' , this.ar_Customer_Quotation?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd' , this.ar_Customer_Quotation?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate' , this.ar_Customer_Quotation?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate' , this.ar_Customer_Quotation?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate' , this.ar_Customer_Quotation?.value.d_UserUpdateDate ?? '');
    formData.append('d_Quotation_date' , this.ar_Customer_Quotation?.value.d_Quotation_date ?? '');
    formData.append('n_customer_id' , this.ar_Customer_Quotation?.value.n_customer_id ?? 0);
    formData.append('n_salesman_id' , this.ar_Customer_Quotation?.value.n_salesman_id ?? 0);
    formData.append('s_AttachmentPerson' , this.ar_Customer_Quotation?.value.s_AttachmentPerson ?? '');
    formData.append('d_quotation_start' , this.ar_Customer_Quotation?.value.d_quotation_start ?? '');
    formData.append('d_quotation_end' , this.ar_Customer_Quotation?.value.d_quotation_end ?? '');
    formData.append('n_currency_id' , this.ar_Customer_Quotation?.value.n_currency_id ?? 0);
    formData.append('n_currency_coff' , this.ar_Customer_Quotation?.value.n_currency_coff ?? 1);
    formData.append('n_trans_source_no' , this.ar_Customer_Quotation?.value.n_trans_source_no ?? 0);
    formData.append('s_Referance' , this.ar_Customer_Quotation?.value.s_Referance ?? '');
    formData.append('s_cost_center_id' , this.ar_Customer_Quotation?.value.s_cost_center_id ?? '');
    formData.append('s_cost_center_id2' , this.ar_Customer_Quotation?.value.s_cost_center_id2 ?? '');
    formData.append('s_DocReference' , this.ar_Customer_Quotation?.value.s_DocReference ?? '');
    formData.append('n_delivery_place' , this.ar_Customer_Quotation?.value.n_delivery_place ?? 0);
    formData.append('b_confirm' , this.ar_Customer_Quotation?.value.b_confirm ?? false);
    formData.append('n_insurValue' , this.ar_Customer_Quotation?.value.n_insurValue ?? 0);
    formData.append('n_TransportValue' , this.ar_Customer_Quotation?.value.n_TransportValue ?? 0);
    formData.append('n_extra_discount' , this.ar_Customer_Quotation?.value.n_extra_discount ?? 0);
    formData.append('n_extra_discount_ratio' , this.ar_Customer_Quotation?.value.n_extra_discount_ratio ?? 0);
    formData.append('n_total_value' , this.ar_Customer_Quotation?.value.n_total_value ?? 0);
    formData.append('n_total_discount' , this.ar_Customer_Quotation?.value.n_total_discount ?? 0);
    formData.append('n_net_value' , this.ar_Customer_Quotation?.value.n_net_value ?? 0);

    for(var i = 0; i < this.ar_Customer_Quotation_Details.length; i++)
    {
      this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].d_ExpireDate=new DatePipe('en-US').transform(this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].d_ExpireDate, 'yyyy/MM/dd');
      this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].d_ExpectedDate=new DatePipe('en-US').transform(this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].d_ExpectedDate, 'yyyy/MM/dd');
      formData.append(`ar_Customer_Quotation_Details[${i}].nLineNo`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].nLineNo ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].s_item_id`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].s_item_id ?? '');
      formData.append(`ar_Customer_Quotation_Details[${i}].n_unit_id`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_unit_id ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].sBatchNO`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].sBatchNO ?? '');
      formData.append(`ar_Customer_Quotation_Details[${i}].d_ExpireDate`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].d_ExpireDate ?? '');
      formData.append(`ar_Customer_Quotation_Details[${i}].n_qty`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_qty ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].n_unit_price`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_unit_price ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].n_item_value`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_item_value ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].nItemDiscountP`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].nItemDiscountP ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].nItemDiscountV`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].nItemDiscountV ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].nInvDiscountP`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].nInvDiscountP ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].nInvDiscountV`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].nInvDiscountV ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].n_over_Discount_Ratio`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_over_Discount_Ratio ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].n_over_Discount2_Ratio`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_over_Discount2_Ratio ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].n_item_net_value`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_item_net_value ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].n_Bonus`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_Bonus ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].d_ExpectedDate`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].d_ExpectedDate ?? '');
      formData.append(`ar_Customer_Quotation_Details[${i}].n_Highpriority`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_Highpriority ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].n_trans_source_doc_no`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].n_trans_source_doc_no ?? 0);
      formData.append(`ar_Customer_Quotation_Details[${i}].s_notes`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Details[i].s_notes ?? '');
    }

    if(this.ar_Customer_Quot_Install.length > 0)
    {
      for(var i = 0; i < this.ar_Customer_Quot_Install.length; i++)
      {
        this.ar_Customer_Quotation.value.ar_Customer_Quot_Install[i].d_installment_date=new DatePipe('en-US').transform(this.ar_Customer_Quotation.value.ar_Customer_Quot_Install[i].d_installment_date, 'yyyy/MM/dd');
        formData.append(`ar_Customer_Quot_Install[${i}].nLineNo`, this.ar_Customer_Quotation?.value.ar_Customer_Quot_Install[i].nLineNo ?? 0);
        formData.append(`ar_Customer_Quot_Install[${i}].n_installment_serial`, this.ar_Customer_Quotation?.value.ar_Customer_Quot_Install[i].n_installment_serial ?? 0);
        formData.append(`ar_Customer_Quot_Install[${i}].n_installment_value`, this.ar_Customer_Quotation?.value.ar_Customer_Quot_Install[i].n_installment_value ?? 0);
        formData.append(`ar_Customer_Quot_Install[${i}].d_installment_date`, this.ar_Customer_Quotation?.value.ar_Customer_Quot_Install[i].d_installment_date ?? '');
        formData.append(`ar_Customer_Quot_Install[${i}].n_payment_type`, this.ar_Customer_Quotation?.value.ar_Customer_Quot_Install[i].n_payment_type ?? 0);
      }
    }

    if(this.ar_Customer_Quotation_Discounts.length > 0)
    {
      for(var i = 0; i < this.ar_Customer_Quotation_Discounts.length; i++)
      {
        formData.append(`ar_Customer_Quotation_Discounts[${i}].nLineNo`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Discounts[i].nLineNo ?? 0);
        formData.append(`ar_Customer_Quotation_Discounts[${i}].n_Quotation_no`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Discounts[i].n_Quotation_no ?? 0);
        formData.append(`ar_Customer_Quotation_Discounts[${i}].n_discount_ratio`, this.ar_Customer_Quotation?.value.ar_Customer_Quotation_Discounts[i].n_discount_ratio ?? 0);
      }
    }

    if(this.n_Quotation_no !=null && this.n_Quotation_no > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
      else 
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customerQuotationList']);
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
          this._router.navigate(['/ar/customerQuotationList']);
        }
      });
    }
  }

  ValidateMaster(): boolean {
    var isValid = true;
    if(this.ar_Customer_Quotation.value.d_Quotation_date == null || this.ar_Customer_Quotation.value.d_Quotation_date == '')
    {
      if(this.isEnglish)
      this._notification.ShowMessage("Please insert show date", 3);
    else
      this._notification.ShowMessage("من فضلك ادخل تاريخ العرض", 3);
      isValid = false;
    }

    if(this.ar_Customer_Quotation.value.d_quotation_start == null || this.ar_Customer_Quotation.value.d_quotation_start == '')
    {
      if(this.isEnglish)
      this._notification.ShowMessage("Please insert start show date", 3);
    else
   
      this._notification.ShowMessage("من فضلك ادخل تاريخ بداية العرض", 3);
      isValid = false;
    }

    if(this.ar_Customer_Quotation.value.d_quotation_end == null || this.ar_Customer_Quotation.value.d_quotation_end == '')
    {
      if(this.isEnglish)
      this._notification.ShowMessage("Please insert end show date", 3);
    else
  
      this._notification.ShowMessage("من فضلك ادخل تاريخ نهاية العرض", 3);
      isValid = false;
    }

    if(this.ar_Customer_Quotation.value.n_customer_id == null || this.ar_Customer_Quotation.value.n_customer_id == '')
    {
      if(this.isEnglish)
      this._notification.ShowMessage("Please choose supplier", 3);
    else
      this._notification.ShowMessage("من فضلك اختر العميل", 3);
      isValid = false;
    }

    return isValid;
  }

  ValidateDetails(): boolean {
    var isValid = true;
    for(var i = 0; i < this.ar_Customer_Quotation_Details.length; i++)
    {
      if(this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].s_item_id == null
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].s_item_id == ''
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].s_item_name == null
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].s_item_name == '')
      {
        if(this.isEnglish)
           this._notification.ShowMessage(`Please choose item in line ${i+1}`, 3);
       else
  
         this._notification.ShowMessage(`من فضلك اختر الصنف في السطر رقم ${ i + 1}`, 3);
        isValid = false;
      }

      if(this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_unit_id == null
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_unit_id == ''
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].s_unit_name == null
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].s_unit_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please choose unit in line ${i+1}`, 3);
    else

   
        this._notification.ShowMessage(`من فضلك اختر الوحدة في السطر رقم ${ i + 1}`, 3);
        isValid = false;
      }

      if(this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_qty == null
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_qty == ''
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_qty == 0)
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please choose qty in line ${i+1}`, 3);
    else

  
        this._notification.ShowMessage(`من فضلك ادخل الكمية في السطر رقم ${ i + 1}`, 3);
        isValid = false;
      }

      if(this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_unit_price == null
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_unit_price == ''
        || this.ar_Customer_Quotation.value.ar_Customer_Quotation_Details[i].n_unit_price == 0)
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please choose unit price in line ${i+1}`, 3);
    else


        this._notification.ShowMessage(`من فضلك ادخل سعر الوحدة في السطر رقم ${ i + 1}`, 3);
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

}
