import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { PurchaseCostcentersLkpComponent } from 'src/app/Controls/purchase-costcenters-lkp/purchase-costcenters-lkp.component';
import { StoresLookUpComponent } from 'src/app/Controls/stores-look-up/stores-look-up.component';
import { SuppliersLkpComponent } from 'src/app/Controls/suppliers-lkp/suppliers-lkp.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { ImportOrderService } from 'src/app/Core/Api/AP/import-order.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { PurchaseCostCentersLKPService } from 'src/app/Core/Api/LookUps/purchase-costcenter-lkp.service';
import { SuppliersLKPService } from 'src/app/Core/Api/LookUps/suppliers-lkp.service';
import { GeneralSC } from 'src/app/Core/Api/SC/genereal-sc.service';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-import-order-add',
  templateUrl: './import-order-add.component.html',
  styleUrls: ['./import-order-add.component.css']
})
export class ImportOrderAddComponent implements OnInit {
  importNo: number = 0;
  ap_import_order!: FormGroup;
  priorityList!: any;
  lengthList!: any;
  paymentsTypesList!: any;

  showspinner: boolean = false;
  b_has_multi_costCenter: boolean = false;
  isSupplierExist: boolean = false;
  isStoreExist: boolean = false;
  isProduction: boolean = false;

  employeesList!: any;
  employeesFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  employeesSearching:boolean=false;

  directionsList!: any;
  directionsFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  directionsSearching:boolean=false;
  isEnglish:boolean=false;
  storesList: any;
  suppliersList: any;
  storeSearching:boolean=false;
  supplierSearching:boolean=false;
  storeFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  supplierFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

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
  supllierSearch:any[]=[]
  // storeSearch:any[]=[];

  timeout: any;
  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  isCostCenter1Exist: boolean[] = [];
  isCostCenter2Exist: boolean[] = [];

  constructor(private _service: ImportOrderService, private _notification: NotificationServiceService,
    private _router: Router, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private _Currency: CurrencyLKPService, private _transSource: SCTransTypeService,
    private _lookUp:GenerealLookup, private _helperService: HelperService,
    private _supplierService: SuppliersLKPService, private _cosetCenter: PurchaseCostCentersLKPService, private _geCS:GeneralSC)
    {
      this.ap_import_order = this._formBuilder.group({
        n_import_no: new FormControl('', Validators.required),
        n_DataAreaID: new FormControl(),
        n_UserAdd: new FormControl(),
        d_UserAddDate: new FormControl(),
        n_UserUpdate: new FormControl(),
        d_UserUpdateDate: new FormControl(),
        n_supplier_id: new FormControl('', Validators.required),
        s_supplier_name: new FormControl(),
        n_purchaseMan_id: new FormControl(),
        n_store_id: new FormControl('', Validators.required),
        n_currency_id: new FormControl('', Validators.required),
        n_currency_coff: new FormControl(),
        s_notes: new FormControl(),
        b_stop: new FormControl(),
        b_Confirm: new FormControl(),
        b_use_multi_cost_center: new FormControl(),
        d_import_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_trans_source_no: new FormControl(),
        n_Requsttype: new FormControl(),
        s_policy_no: new FormControl(),
        s_paymentplace: new FormControl(),
        n_order_no: new FormControl(),
        n_bank_expenses: new FormControl(),
        s_transportation: new FormControl(),
        n_weight: new FormControl(),
        n_charge_expenses: new FormControl(),
        s_DocReference: new FormControl(),
        n_containers20_count: new FormControl(),
        n_containers20_Expens: new FormControl(),
        n_Custom_Amount: new FormControl(),
        d_Shipping_date: new FormControl(),
        d_Arival_date: new FormControl(),
        n_containers40_count: new FormControl(),
        n_containers40_Expens: new FormControl(),
        n_ImportOrder_Cost: new FormControl(),
        n_extra_discount: new FormControl(),
        n_net_value: new FormControl(),
        n_discount: new FormControl(),
        n_sales_tax: new FormControl(),
        n_purcahse_net: new FormControl(),
        ap_import_order_details: this._formBuilder.array([]),
        ap_import_order_installment: this._formBuilder.array([])
      });
    }

  ngOnInit(): void {
    this.importNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.EmployeesSearch('');
    this.DirectionsSearch('');
    this.CurrencySearch('');
    this.TransSourceSearch('');
    this.storeSearch('');
    this.supplierSearch('');

    this._helperService.GetAppPriority().subscribe((data) => {
      this.priorityList = data;
    });

    this._service.GetLength().subscribe((data) => {
      this.lengthList = data;
    });

    this._service.GetPaymentsTypes().subscribe((data) => {
      this.paymentsTypesList = data;
    });

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    })


    if(this.importNo <= 0)
    {
      
      this._service.GeyCurrentImportOrder().subscribe((data) => {
        this.ap_import_order.patchValue(data);
        this.ap_import_order.get("d_import_date")?.patchValue((new Date()).toISOString().substring(0,10));

        this.executeStoreListing(data.n_store_id);
      });
      this.addOrderDetails();
    }

    if(this.importNo > 0)
    {
      this.showspinner = true;
      this._service.GetByID(this.importNo).subscribe((data) => {
        debugger
        this.n_currency_id = data.n_currency_id;
        this.ap_import_order?.patchValue(data);
        this.ap_import_order.get("d_import_date")?.patchValue(new Date(Number(data.d_import_date.substring(0,4)), Number(data.d_import_date.substring(5,7))-1, Number(data.d_import_date.substring(8,10))));
        if(data.d_Shipping_date !== null)
        {
          this.ap_import_order.get("d_Shipping_date")?.patchValue(new Date(Number(data.d_Shipping_date.substring(0,4)), Number(data.d_Shipping_date.substring(5,7))-1, Number(data.d_Shipping_date.substring(8,10))));
          this.ap_import_order.get("d_Arival_date")?.patchValue(new Date(Number(data.d_Arival_date.substring(0,4)), Number(data.d_Arival_date.substring(5,7))-1, Number(data.d_Arival_date.substring(8,10))));
        }
        this.executeSupplierListing(data.n_supplier_id);
        this.executeStoreListing(data.n_store_id);
        if(data.n_Requsttype == 1)
          this.isProduction = true;
        if(data.b_use_multi_cost_center == true)
          this.b_has_multi_costCenter = true;

          data.ap_import_order_details.forEach((data) => {
            this.ap_import_order_details.push(this.newOrderDetailsRow(this.ap_import_order_details.length + 1));
          });
          (this.ap_import_order.get("ap_import_order_details") as FormArray)?.patchValue(data.ap_import_order_details);
          for(var i = 0; i < data.ap_import_order_details.length; i++)
          {
            this.executeItemListing(data.ap_import_order_details[i]['s_item_id'], i);
            this.executeUnitListing(data.ap_import_order_details[i]['n_unit_id'], i);
            this.executeCostCenter1Listing(data.ap_import_order_details[i]['s_cost_center_id'], i);
            this.executeCostCenter2Listing(data.ap_import_order_details[i]['s_cost_center_id2'], i);
          }

          data.ap_import_order_installment.forEach((data) => {
            this.ap_import_order_installment.push(this.newInstallmentRow(this.ap_import_order_installment.length + 1));
          });
          (this.ap_import_order.get("ap_import_order_installment") as FormArray)?.patchValue(data.ap_import_order_installment);

          for(var i = 0; i < this.ap_import_order_details.length; i++)
          {
            ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('d_ExpectedDate')?.patchValue(new Date(Number(data.ap_import_order_details[i].d_ExpectedDate.substring(0,4)), Number(data.ap_import_order_details[i].d_ExpectedDate.substring(5,7))-1, Number(data.ap_import_order_details[i].d_ExpectedDate.substring(8,10))));
          }

          for(var i = 0; i < this.ap_import_order_installment.length; i++)
          {
            ((this.ap_import_order.get('ap_import_order_installment') as FormArray).at(i) as FormGroup).get('d_installment_date')?.patchValue(new Date(Number(data.ap_import_order_installment[i].d_installment_date.substring(0,4)), Number(data.ap_import_order_installment[i].d_installment_date.substring(5,7))-1, Number(data.ap_import_order_installment[i].d_installment_date.substring(8,10))));
          }

          this.CalcMasterFields();
          this.showspinner = false;
      })
    }

    
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  get ap_import_order_details(): FormArray
  {
    return this.ap_import_order.get('ap_import_order_details') as FormArray;
  }

  get ap_import_order_installment(): FormArray
  {
    return this.ap_import_order.get('ap_import_order_installment') as FormArray;
  }

  newOrderDetailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_import_no: '',
      n_UserAdd: '',
      d_UserAddDate: '',
      n_UserUpdate: '',
      d_UserUpdateDate: '',
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_qty: '',
      n_unit_price: '',
      n_item_value: '',
      nInvDiscountV: '',
      n_item_net_value: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: '',
      d_ExpectedDate: '',
      n_Highpriority: '',
      s_notes: '',
      n_Item_Custom: '',
      n_trans_source_doc_no: '',
      n_scr_pallet_no: '',
      n_scr_length_no: '',
      n_scr_average: '',
      b_qty_sufficiency: ''
    });
  }

  newInstallmentRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_import_no: '',
      d_UserAddDate: '',
      d_UserUpdateDate: '',
      nLineNo: line,
      n_installment_value: '',
      d_installment_date: '',
      n_payment_type: ''
    });
  }

  addOrderDetails()
  {
    this.ap_import_order_details.push(this.newOrderDetailsRow(this.ap_import_order_details.length + 1));
    this.onExtraDiscountChanged();
  }

  removeOrderDetailsRow(i: number)
  {
    if(this.ap_import_order_details.length==1)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Invoice must contain a single item',2)
    else 
   
      this._notification.ShowMessage('يجب ان تحتوى الفاتورة على صنف واحد على الاقل', 2);
      return;
    }
    else
    {
      this.ap_import_order_details.removeAt(i);
      this.onExtraDiscountChanged();
      this.CalcMasterFields();
    }
  }

  removeInstallmentRow(i: number)
  {
    this.ap_import_order_installment.removeAt(i);
  }

  addPaymentLine()
  {
    this.ap_import_order_installment.push(this.newInstallmentRow(this.ap_import_order_installment.length + 1));
  }

  EmployeesSearch(value: any) {
    this.employeesSearching=true;
    this._service.GetEmployees().subscribe(res=> {
      this.employeesList=res;
      this.employeesFilteredServerSide.next(this.employeesList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.employeesSearching=false;
    })
  }

  DirectionsSearch(value: any) {
    this.directionsSearching=true;
    this._service.GetDirections().subscribe(res=> {
      this.directionsList=res;
      this.directionsFilteredServerSide.next(this.directionsList.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      this.directionsSearching=false;
    })
  }

  directionChanged()
  {
    if(this.ap_import_order?.value.n_Requsttype == 1)
      this.isProduction = true;
    else
      this.isProduction = false;
  }

  CurrencySearch(value: any) {
    this.currencySearching=true;
    this._Currency.GetCurrencies().subscribe(res=> {
      this.currenciesList=res;
      this.currencyFilteredServerSide.next(this.currenciesList.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
      this.currencySearching=false;
    })
  }
  currencyChanged(){
    this.n_currency_id = this.ap_import_order.value.n_currency_id;
  }

  TransSourceSearch(value: any) {
    this.transSourceSearching=true;
    this._service.GetTransSourceDropList().subscribe(res=> {
      this.transSourceList=res;
      this.transSourceFilteredServerSide.next(this.transSourceList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.transSourceSearching=false;
    })
  }

  storeSearch(value: any) {
    this.storeSearching=true;
    this._helperService.GetStoresDP().subscribe(res=> {
      this.storesList=res;
      this.storeFilteredServerSide.next(this.storesList.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.storeSearching=false;
    })
  }

  supplierSearch(value: any) {
    this.supplierSearching=true;
    this._helperService.getSuppliersLKP().subscribe(res=> {
      this.suppliersList=res;
      this.supplierFilteredServerSide.next(this.suppliersList.filter(x => x.s_supplier_name.toLowerCase().indexOf(value) > -1));
      this.supplierSearching=false;
    })
  }

  TransSourceChanged() {
    this.transNo = this.ap_import_order.value.n_trans_source_no;
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
        this.ap_import_order_details.clear();
        data.forEach(element => {
          this.ap_import_order_details.push(this.newOrderDetailsRow(this.ap_import_order_details.length));
        });
        this.ap_import_order.patchValue(data[0]);
        this.executeSupplierListing(data[0]['n_supplier_id']);
        this.executeStoreListing(data[0]['n_store_id']);

        (this.ap_import_order.get('ap_import_order_details') as FormArray)?.patchValue(data);
        for(var i = 0; i < this.ap_import_order.value.ap_import_order_details.length; i++) {
          // this.getTotal(i, false);
          this.executeItemListing(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('s_item_id')?.value, i);
          this.executeUnitListing(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_unit_id')?.value, i);
          this.executeCostCenter1Listing(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value, i);
          this.executeCostCenter2Listing(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value, i);
          ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_trans_source_doc_no')?.patchValue(data[i].n_doc_no);
        }
      });
     });
  }

  loadSuppliers() {
    const dialogRef = this.dialog.open(SuppliersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isSupplierExist = true;
      this.ap_import_order.get('s_supplier_name')?.patchValue(res.data.s_supplier_name  +" # " +res.data.n_supplier_id);
     this.ap_import_order.get('n_supplier_id')?.patchValue(res.data.n_supplier_id);
    });
  }

  onKeySupplierSearch(event: any) {
    this.ap_import_order.get('s_supplier_name')?.patchValue('');
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeSupplierListing(event.target.value);
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
  searchBegin(event)

  {

  setTimeout(() => {

    this._lookUp.getSupplierSearch(event.target.value,event.target.value).subscribe(
      (res)=>{
    debugger;
        this.supllierSearch=res
      }
    )

  }, 2000);

  }
  // searchStoreBegin(event)

  // {

  // setTimeout(() => {

  //   this._lookUp.getStoreSearch(event.target.value,event.target.value).subscribe(
  //     (res)=>{
  //   debugger;
  //       this.storeSearch=res
  //     }
  //   )

  // }, 2000);

  // }
  selectItem(i,searchInputNumber,inputName,inputNumber)
    {
    debugger
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdS" + i) as HTMLElement;

    (this.ap_import_order.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.ap_import_order.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
    }
  private executeSupplierListing(value: number) {
    this._supplierService.GetSupplierName(value).subscribe((data) => {
      if(data.supplierName != '' && data.supplierName != null){
        this.isSupplierExist = true;
        this.ap_import_order.get('s_supplier_name')?.patchValue(data.supplierName);
      }
      else{
        this.isSupplierExist = false;
        this.ap_import_order.get('s_supplier_name')?.patchValue('');
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
      this.ap_import_order.get("s_store_name")?.patchValue(res.data.s_store_name +" # "+res.data.n_store_id);
      this.ap_import_order.get("n_store_id")?.patchValue(res.data.n_store_id );
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
  this.ap_import_order.get('s_store_name')?.patchValue('');
  this._service.GetStoreName(value).subscribe((data) => {
    if(data.storeName != "")
    {
      this.ap_import_order.get('s_store_name')?.patchValue(data.storeName +
        " # " +value);
      this.isStoreExist = true;
    }
    else{
      this.isStoreExist = false;
      this.ap_import_order.get('s_store_name')?.patchValue('');
    }
  });
  }

  currentItemIndex: number = 0;
  loadItems(i: number) {
    this.currentItemIndex=i;
    var storeId = this.ap_import_order.value.n_store_id;

     const dialogRef = this.dialog.open(ItemsdetailsLookUpComponent, {
       width: '700px',
       height:'600px',
       data: { 'storeId': storeId }
     });

     dialogRef.afterClosed().subscribe(res => {
      this.isItemExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
        this._geCS.GetLastCost(res.data.s_item_id,this.ap_import_order.get("d_import_date")?.value,this.ap_import_order.get("n_store_id")?.value==""? 0:Number(this.ap_import_order.get("n_store_id")?.value)).subscribe((data)=>{
          ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_price')?.patchValue(data);
        });
    });
  }

  onKeyItemSearch(event: any, i) {
  clearTimeout(this.timeout);
  this.resetDetailsValues(i);
  ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
  ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

  var $this = this;
  this.timeout = setTimeout(function () {
    if (event.keyCode != 13) {
      $this.executeItemListing(event.target.value, i);
    }
  }, 1000);
  }

  private executeItemListing(value: string, i) {
  var storeId = this.ap_import_order.value.n_store_id;
  this._helperService.GetItemDetails(value).subscribe((data) => {
    if(data != '' || data != null || data != undefined){
      ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.s_item_name);
      ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(data.n_unit_id);
      ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
      this._geCS.GetLastCost(data.s_item_id,this.ap_import_order.get("d_import_date")?.value,this.ap_import_order.get("n_store_id")?.value==""? 0:Number(this.ap_import_order.get("n_store_id")?.value)).subscribe((data)=>{
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(data);
       });
    }
    else{
      this.isItemExist[i] = false;
      ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    }
  });
  }

  currentUnitIndex: number = 0;
  loadUnits(i: number) {
    this.currentUnitIndex=i;
    let itemID=  ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isUnitExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
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
    var itemId = ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._service.GetUnitName(value, itemId).subscribe((data) => {
      if(data.unitName != '' && data.unitName != null){
        this.isUnitExist[i] = true;
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.unitName);
      }
      else{
        this.isUnitExist[i] = false;
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
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
     ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentCostCenter1Index) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
     ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentCostCenter1Index) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
    });
  }

  onKeyCostCenter1Search(event: any, i) {
    clearTimeout(this.timeout);
    ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
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
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(data.costCenterName);
      }
      else{
        this.isCostCenter1Exist[i] = false;
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
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
     ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentCostCenter2Index) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
     ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(this.currentCostCenter2Index) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
    });
  }

  onKeyCostCenter2Search(event: any, i) {
    clearTimeout(this.timeout);
    ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
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
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(data.costCenterName);
      }
      else{
        this.isCostCenter2Exist[i] = false;
        ((this.ap_import_order.get("ap_import_order_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
      }
    });
  }

  MultiCostChecked()
  {
    var b_multi_cost = this.ap_import_order.value.b_use_multi_cost_center;
    if(b_multi_cost == true)
    {
      this.b_has_multi_costCenter = true
    }
    else{
      this.b_has_multi_costCenter = false;
    }
  }

  Save()
  {
    if(this.ValidateDetailsTable() == false)
    {
      return;
    }

    this.showspinner = true;
    var formData = new FormData();
    this.ap_import_order.value.d_import_date=new DatePipe('en-US').transform(this.ap_import_order.value.d_import_date, 'yyyy/MM/dd');
    this.ap_import_order.value.d_Shipping_date=new DatePipe('en-US').transform(this.ap_import_order.value.d_Shipping_date, 'yyyy/MM/dd');
    this.ap_import_order.value.d_Arival_date=new DatePipe('en-US').transform(this.ap_import_order.value.d_Arival_date, 'yyyy/MM/dd');
    formData.append('n_import_no', this.ap_import_order?.value.n_import_no ?? 0);
    formData.append('n_DataAreaID', this.ap_import_order?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ap_import_order?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ap_import_order?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ap_import_order?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ap_import_order?.value.d_UserUpdateDate ?? '');
    formData.append('n_supplier_id', this.ap_import_order?.value.n_supplier_id ?? 0);
    formData.append('n_purchaseMan_id', this.ap_import_order?.value.n_purchaseMan_id ?? 0);
    formData.append('n_Requesttype', this.ap_import_order?.value.n_Requesttype ?? 0);
    formData.append('n_store_id', this.ap_import_order?.value.n_store_id ?? 0);
    formData.append('n_currency_id', this.ap_import_order?.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.ap_import_order?.value.n_currency_coff ?? 0);
    formData.append('s_notes', this.ap_import_order?.value.s_notes ?? '');
    formData.append('b_stop', this.ap_import_order?.value.b_stop ?? false);
    formData.append('b_Confirm', this.ap_import_order?.value.b_Confirm ?? false);
    formData.append('b_use_multi_cost_center', this.ap_import_order?.value.b_use_multi_cost_center ?? false);
    formData.append('d_import_date', this.ap_import_order?.value.d_import_date ?? '');
    formData.append('n_trans_source_no', this.ap_import_order?.value.n_trans_source_no ?? 0);
    formData.append('n_Requsttype', this.ap_import_order?.value.n_Requsttype ?? 0);
    formData.append('s_policy_no', this.ap_import_order?.value.s_policy_no ?? '');
    formData.append('s_paymentplace', this.ap_import_order?.value.s_paymentplace ?? '');
    formData.append('n_order_no', this.ap_import_order?.value.n_order_no ?? 0);
    formData.append('n_bank_expenses', this.ap_import_order?.value.n_bank_expenses ?? 0);
    formData.append('s_transportation', this.ap_import_order?.value.s_transportation ?? '');
    formData.append('n_weight', this.ap_import_order?.value.n_weight ?? 0);
    formData.append('n_charge_expenses', this.ap_import_order?.value.n_charge_expenses ?? 0);
    formData.append('s_DocReference', this.ap_import_order?.value.s_DocReference ?? '');
    formData.append('n_containers20_count', this.ap_import_order?.value.n_containers20_count ?? 0);
    formData.append('n_containers20_Expens', this.ap_import_order?.value.n_containers20_Expens ?? 0);
    formData.append('n_Custom_Amount', this.ap_import_order?.value.n_Custom_Amount ?? 0);
    formData.append('d_Shipping_date', this.ap_import_order?.value.d_Shipping_date ?? '');
    formData.append('d_Arival_date', this.ap_import_order?.value.d_Arival_date ?? '');
    formData.append('n_containers40_count', this.ap_import_order?.value.n_containers40_count ?? 0);
    formData.append('n_containers40_Expens', this.ap_import_order?.value.n_containers40_Expens ?? 0);
    formData.append('n_ImportOrder_Cost', this.ap_import_order?.value.n_ImportOrder_Cost ?? 0);
    formData.append('n_extra_discount', this.ap_import_order?.value.n_extra_discount ?? 0);
    formData.append('n_net_value', this.ap_import_order?.value.n_net_value ?? 0);
    formData.append('n_discount', this.ap_import_order?.value.n_discount ?? 0);
    formData.append('n_sales_tax', this.ap_import_order?.value.n_sales_tax ?? 0);
    formData.append('n_purcahse_net', this.ap_import_order?.value.n_purcahse_net ?? 0);

    for(var i = 0; i < this.ap_import_order_details.length; i++)
    {
      this.ap_import_order.value.ap_import_order_details[i].d_ExpectedDate=new DatePipe('en-US').transform(this.ap_import_order.value.ap_import_order_details[i].d_ExpectedDate, 'yyyy/MM/dd');
      formData.append(`ap_import_order_details[${i}].n_import_no`, this.ap_import_order?.value.n_import_no ?? 0);
      formData.append(`ap_import_order_details[${i}].n_UserAdd`, this.ap_import_order?.value.n_UserAdd ?? 0);
      formData.append(`ap_import_order_details[${i}].d_UserAddDate`, this.ap_import_order?.value.d_UserAddDate ?? '');
      formData.append(`ap_import_order_details[${i}].n_UserUpdate`, this.ap_import_order?.value.n_UserUpdate ?? 0);
      formData.append(`ap_import_order_details[${i}].d_UserUpdateDate`, this.ap_import_order?.value.d_UserUpdateDate ?? '');
      formData.append(`ap_import_order_details[${i}].nLineNo`, this.ap_import_order?.value.ap_import_order_details[i].nLineNo ?? 0);
      formData.append(`ap_import_order_details[${i}].s_item_id`, this.ap_import_order?.value.ap_import_order_details[i].s_item_id ?? '' );
      formData.append(`ap_import_order_details[${i}].n_unit_id`, this.ap_import_order?.value.ap_import_order_details[i].n_unit_id ?? 0);
      formData.append(`ap_import_order_details[${i}].n_qty`, this.ap_import_order?.value.ap_import_order_details[i].n_qty ?? 0);
      formData.append(`ap_import_order_details[${i}].n_unit_price`, this.ap_import_order?.value.ap_import_order_details[i].n_unit_price ?? 0);
      formData.append(`ap_import_order_details[${i}].n_item_value`, this.ap_import_order?.value.ap_import_order_details[i].n_item_value ?? 0);
      formData.append(`ap_import_order_details[${i}].nInvDiscountV`, this.ap_import_order?.value.ap_import_order_details[i].nInvDiscountV ?? 0);
      formData.append(`ap_import_order_details[${i}].n_item_net_value`, this.ap_import_order?.value.ap_import_order_details[i].n_item_net_value ?? 0);
      formData.append(`ap_import_order_details[${i}].s_cost_center_id`, this.ap_import_order?.value.ap_import_order_details[i].s_cost_center_id ?? '');
      formData.append(`ap_import_order_details[${i}].s_cost_center_id2`, this.ap_import_order?.value.ap_import_order_details[i].s_cost_center_id2 ?? '');
      formData.append(`ap_import_order_details[${i}].d_ExpectedDate`, this.ap_import_order?.value.ap_import_order_details[i].d_ExpectedDate ?? '');
      formData.append(`ap_import_order_details[${i}].n_Highpriority`, this.ap_import_order?.value.ap_import_order_details[i].n_Highpriority ?? 0);
      formData.append(`ap_import_order_details[${i}].s_notes`, this.ap_import_order?.value.ap_import_order_details[i].s_notes ?? '');
      formData.append(`ap_import_order_details[${i}].n_Item_Custom`, this.ap_import_order?.value.ap_import_order_details[i].n_Item_Custom ?? 0);
      formData.append(`ap_import_order_details[${i}].n_trans_source_doc_no`, this.ap_import_order?.value.ap_import_order_details[i].n_trans_source_doc_no ?? 0);
      formData.append(`ap_import_order_details[${i}].n_scr_pallet_no`, this.ap_import_order?.value.ap_import_order_details[i].n_scr_pallet_no ?? 0);
      formData.append(`ap_import_order_details[${i}].n_scr_length_no`, this.ap_import_order?.value.ap_import_order_details[i].n_scr_length_no ?? 0);
      formData.append(`ap_import_order_details[${i}].n_scr_average`, this.ap_import_order?.value.ap_import_order_details[i].n_scr_average ?? 0);
      formData.append(`ap_import_order_details[${i}].b_qty_sufficiency`, this.ap_import_order?.value.ap_import_order_details[i].b_qty_sufficiency ?? false);
    }

    if(this.ap_import_order_installment.length > 0)
    {
      for(var i = 0; i < this.ap_import_order_installment.length; i++)
      {
        this.ap_import_order.value.ap_import_order_installment[i].d_installment_date=new DatePipe('en-US').transform(this.ap_import_order.value.ap_import_order_installment[i].d_installment_date, 'yyyy/MM/dd');
        formData.append(`ap_import_order_installment[${i}].n_import_no`, this.ap_import_order?.value.n_import_no ?? 0);
        formData.append(`ap_import_order_installment[${i}].n_UserAdd`, this.ap_import_order?.value.n_UserAdd ?? 0);
        formData.append(`ap_import_order_installment[${i}].d_UserAddDate`, this.ap_import_order?.value.d_UserAddDate ?? '');
        formData.append(`ap_import_order_installment[${i}].n_UserUpdate`, this.ap_import_order?.value.n_UserUpdate ?? 0);
        formData.append(`ap_import_order_installment[${i}].d_UserUpdateDate`, this.ap_import_order?.value.d_UserUpdateDate ?? '');
        formData.append(`ap_import_order_installment[${i}].nLineNo`, this.ap_import_order?.value.ap_import_order_installment[i].nLineNo ?? 0);
        formData.append(`ap_import_order_installment[${i}].n_installment_value`, this.ap_import_order?.value.ap_import_order_installment[i].n_installment_value ?? 0);
        formData.append(`ap_import_order_installment[${i}].d_installment_date`, this.ap_import_order?.value.ap_import_order_installment[i].d_installment_date ?? '');
        formData.append(`ap_import_order_installment[${i}].n_payment_type`, this.ap_import_order?.value.ap_import_order_installment[i].n_payment_type ?? 0);
      }
    }

    if(this.importNo <= 0) {
      this.disableButtons();
      this._service.Create(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
      else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ap/importsorderslist']);
        }
      });
    }
    else{
      this._service.Edit(formData).subscribe(data=>{

        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
      else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ap/importsorderslist']);
        }
      });
    }
  }

  ValidateDetailsTable(): boolean {
    var isValid = true;
    if(this.ap_import_order_details.length <= 0)
    {
      if(this.isEnglish)
      this._notification.ShowMessage(`can't save without item or unit `, 2);
      else
      this._notification.ShowMessage(`لا يمكنك الحفظ بدون ان ادخال اصناف ووحدات الفاتورة`, 2);
      isValid = false;
    }

    for(var i = 0; i < this.ap_import_order_details.length; i++)
    {
      if(this.ap_import_order.value.ap_import_order_details[i].s_item_id == '')
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert item code at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل كود الصنف في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_import_order.value.ap_import_order_details[i].s_item_name == '')
      {
        if(this.isEnglish) 
           this._notification.ShowMessage(`Please insert item name at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل اسم الصنف في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_import_order.value.ap_import_order_details[i].n_unit_id == '')
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert unit code at line  ${i+1}`, 3)
        else
         this._notification.ShowMessage(`من فضلك ادخل كود الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_import_order.value.ap_import_order_details[i].s_unit_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert unit name at line  ${i+1}`, 3)
       else
      
        this._notification.ShowMessage(`من فضلك ادخل اسم الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_import_order.value.ap_import_order_details[i].n_qty == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert Qty  at line  ${i+1}`, 3)
       else

        this._notification.ShowMessage(`من فضلك ادخل الكمية في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_import_order.value.ap_import_order_details[i].n_unit_price == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert price  at line  ${i+1}`, 3)
       else
       
        this._notification.ShowMessage(`من فضلك ادخل سعر الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
    }
    return isValid;
   }

  resetDetailsValues(i: number)
  {
    ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
    ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
    ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
    ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue('');
    ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue('');
  }

  qtyAndunitChanged(i: number)
  {
    var sum = 0;
    var qty = Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_qty')?.value);
    var unitPrice = Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.value);
    var invDiscount = Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.value);
    ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(qty * unitPrice);
    ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue((qty * unitPrice) - invDiscount);
  }

  onExtraDiscountChanged()
  {
    var extraDiscount = Number(this.ap_import_order.get('n_extra_discount')?.value);
    var detailsCount = Number(this.ap_import_order_details.length);
    for(var i = 0; i < this.ap_import_order_details.length; i++)
    {
      ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue((extraDiscount/detailsCount).toFixed(3));
      ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue(((Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_qty')?.value) * ((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.value) - Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.value)).toFixed(3));
    }
  }

  CalcMasterFields()
  {
    var nNetValue = 0;
    var nDiscount = 0;
    var nPurchaseNet = 0;
    var nCustomAmount = 0;
    var bankEx = Number(this.ap_import_order.get('n_bank_expenses')?.value);
    var charge = Number(this.ap_import_order.get('n_charge_expenses')?.value);
    var container20Ex = Number(this.ap_import_order.get('n_containers20_Expens')?.value);
    var container40Ex = Number(this.ap_import_order.get('n_containers40_Expens')?.value);
    this.ap_import_order.get('n_ImportOrder_Cost')?.patchValue((bankEx + charge + container20Ex + container40Ex));
    for(var i = 0; i < this.ap_import_order_details.length; i++)
    {
      nNetValue += Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value);
      nDiscount += Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.value);
      nPurchaseNet += Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_item_net_value')?.value);
      nCustomAmount += Number(((this.ap_import_order.get('ap_import_order_details') as FormArray).at(i) as FormGroup).get('n_Item_Custom')?.value);
    }
    this.ap_import_order.get('n_net_value')?.patchValue(nNetValue);
    this.ap_import_order.get('n_discount')?.patchValue(nDiscount);
    this.ap_import_order.get('n_purcahse_net')?.patchValue(nPurchaseNet.toFixed(3));
    this.ap_import_order.get('n_Custom_Amount')?.patchValue(nCustomAmount);
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
 
}
