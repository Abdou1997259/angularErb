import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { PurchaseCostcentersLkpComponent } from 'src/app/Controls/purchase-costcenters-lkp/purchase-costcenters-lkp.component';
import { StoresLookUpComponent } from 'src/app/Controls/stores-look-up/stores-look-up.component';
import { SuppliersLkpComponent } from 'src/app/Controls/suppliers-lkp/suppliers-lkp.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { RecieveQtyService } from 'src/app/Core/Api/AP/recieve-qty.service';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { PurchaseCostCentersLKPService } from 'src/app/Core/Api/LookUps/purchase-costcenter-lkp.service';
import { SuppliersLKPService } from 'src/app/Core/Api/LookUps/suppliers-lkp.service';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { RejectedGoodsComponent } from '../rejected-goods/rejected-goods.component';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ItemsRecieveComponent } from 'src/app/Controls/items-recieve/items-recieve.component';
import { PurchaseInvoiceService } from 'src/app/Core/Api/AP/purchase-invoice.service';

@Component({
  selector: 'app-recieve-qty-add',
  templateUrl: './recieve-qty-add.component.html',
  styleUrls: ['./recieve-qty-add.component.css']
})
export class RecieveQtyAddComponent implements OnInit {
  docuNumber: number = 0;
  ap_Recieve_Qty!: FormGroup;
  lengthList!: any;

  showspinner: boolean = false;

  currenciesList!: any;
  storesList: any;
  suppliersList: any;
  currencySearching:boolean=false;
  storeSearching:boolean=false;
  supplierSearching:boolean=false;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  storeFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  supplierFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  localCurrency!: any;
  n_currency_id: number = 0;
  currencyName!: string;

  transSourceList!: any;
  transSourceFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  transSourceSearching:boolean=false;
  transNo: any = '';

  qualityEngList!: any;
  qualityEngFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  qualityEngSearching:boolean=false;
  isEnglish:boolean=false
  timeout!: any;
  isSupplierExist: boolean = false;
  isStoreExist: boolean = false;
  b_has_multi_costCenter: boolean = false;
  isItemExist: boolean[] = [];
  isRejectedItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  isRejectedUnitExist: boolean[] = [];
  isCostCenter1Exist: boolean[] = [];
  isCostCenter2Exist: boolean[] = [];
  supllierSearch:any[]=[];
  @ViewChild("showInputid")showInputid!:ElementRef
  constructor(private _service: RecieveQtyService, private _notification: NotificationServiceService,
    private _router: Router, private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private _Currency: CurrencyLKPService, private _transSource: SCTransTypeService,
    private _supplierService: SuppliersLKPService, private _cosetCenter: PurchaseCostCentersLKPService,
    private _lookUp:GenerealLookup, private _helperService: HelperService, private _PurchaseInvoiceService:PurchaseInvoiceService) 
    {
      this.ap_Recieve_Qty = this._formBuilder.group({
        n_doc_no: new FormControl(),
        n_DataAreaID: new FormControl(),
        n_UserAdd: new FormControl(),
        d_UserAddDate: new FormControl(),
        n_UserUpdate: new FormControl(),
        d_UserUpdateDate: new FormControl(),
        d_doc_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_Actual_Doc_no: new FormControl(),
        n_supplier_id: new FormControl('',Validators.required),
        s_supplier_name: new FormControl(),
        n_store_id: new FormControl('',Validators.required),
        s_store_name: new FormControl(),
        n_currency_id: new FormControl('', Validators.required),
        s_currency_name: new FormControl(),
        n_currency_coff: new FormControl(),
        s_notes: new FormControl(),
        s_notes_eng: new FormControl(),
        b_Confirm: new FormControl(),
        n_trans_source_no: new FormControl(),
        b_use_multi_cost_center: new FormControl(),
        b_direct_delivery_order: new FormControl(),
        n_QualityEng_id: new FormControl(),
        n_shift_id: new FormControl(),
        ap_recieve_qty_details: this._formBuilder.array([]),
        ap_rejected_goods_details: this._formBuilder.array([])
      });
    }

  ngOnInit(): void {
    this.docuNumber = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.CurrencySearch('');
    this.storeSearch('');
    this.supplierSearch('');
    this.TransSourceSearch('');
    this.QualityEngSearch('');

    this._service.GetLength().subscribe((data) => {
      this.lengthList = data;
    });

    if(this.docuNumber <= 0)
    {
      // Fill Form with current document number and other initial details
      this._service.GetCurrentRecieveQty().subscribe((data) => {
        this.localCurrency = data.n_currency_id;
        this.n_currency_id = 0;
        this.currencyName = data.s_currency_name;
        // this.executeCurrencyListing(data.n_currency_id, 0);

        this.ap_Recieve_Qty.patchValue(data);
        this.ap_Recieve_Qty.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));

        this.addNewDetailsRow();
      });
      //----------
    }
    if(this.docuNumber > 0)
    {
      this.showspinner=true;
      this._service.GetByID(this.docuNumber).subscribe((data) => {
        this.localCurrency = data.n_currency_id;
        this.n_currency_id = data.n_currency_id;
        debugger

        this.ap_Recieve_Qty.patchValue(data);
        // this.showInputid.nativeElement.style.display="block";
     
        this.ap_Recieve_Qty.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));

        this.executeSupplierListing(data.n_supplier_id);
        this.executeStoreListing(data.n_store_id);


        data.ap_recieve_qty_details.forEach((data) => {
          this.ap_recieve_qty_details.push(this.inertDEtailsRow(this.ap_recieve_qty_details.length + 1));
        });
        (this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray)?.patchValue(data.ap_recieve_qty_details);
        for(var i = 0; i < data.ap_recieve_qty_details.length; i++)
        {
          this.executeItemListing(data.ap_recieve_qty_details[i]['s_item_id'], i);
          this.executeUnitListing(data.ap_recieve_qty_details[i]['n_unit_id'], i);
          this.executeCostCenter1Listing(data.ap_recieve_qty_details[i]['s_cost_center_id'], i);
          this.executeCostCenter2Listing(data.ap_recieve_qty_details[i]['s_cost_center_id2'], i);
          ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('d_ExpectedDate')?.patchValue(new Date(Number(data.ap_recieve_qty_details[i].d_ExpectedDate.substring(0,4)), Number(data.ap_recieve_qty_details[i].d_ExpectedDate.substring(5,7))-1, Number(data.ap_recieve_qty_details[i].d_ExpectedDate.substring(8,10))));
        }

        data.ap_rejected_goods_details.forEach((data) => {
          this.ap_rejected_goods_details.push(this.newRejectedGoodsRow(this.ap_rejected_goods_details.length + 1));
        });
        (this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray)?.patchValue(data.ap_rejected_goods_details);
        for(var i = 0; i < data.ap_rejected_goods_details.length; i++)
        {
          this.executeRejectedItemListing(data.ap_rejected_goods_details[i]['s_item_id'], i);
          this.executeRejectedUnitListing(data.ap_rejected_goods_details[i]['n_unit_id'], i);
        }


        if(data.b_use_multi_cost_center == true)
          this.b_has_multi_costCenter = true;

        this.showspinner = false;
      });
    }
   LangSwitcher.translatefun();
   this.isEnglish=LangSwitcher.CheckLan();
    
  }

  get ap_recieve_qty_details(): FormArray{
    return this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray;
  }

  inertDEtailsRow(line: number = 0)
  {
    return this._formBuilder.group({
      n_doc_no: '',
      n_DataAreaID: '',
      n_UserAdd: '',
      d_UserAddDate: '',
      n_UserUpdate: '',
      d_UserUpdateDate: '',

      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_import_qty: '',
      n_qty: '',
      d_ExpectedDate: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: '',
      n_trans_source_doc_no: '',
      n_scr_pallet_no: '',
      n_scr_length_no: '',
      n_scr_average: '',
      n_weight: ''
    });
  }

  addNewDetailsRow()
  {
    this.ap_recieve_qty_details.push(this.inertDEtailsRow(this.ap_recieve_qty_details.length + 1));
  }

  get ap_rejected_goods_details(): FormArray{
    return this.ap_Recieve_Qty.get('ap_rejected_goods_details') as FormArray;
  }

  newRejectedGoodsRow(line: number = 0){
    return this._formBuilder.group({
      n_doc_no: '',
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_qty: '',
      s_notes: ''
    });
  }

  addNewRejectedRow()
  {
    this.ap_rejected_goods_details.push(this.newRejectedGoodsRow(this.ap_rejected_goods_details.length + 1));
  }

  CurrencySearch(value: any) {
    this.currencySearching=true;
    this._Currency.GetCurrencies().subscribe(res=> {
      this.currenciesList=res;
      this.currencyFilteredServerSide.next(this.currenciesList.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
      this.currencySearching=false;
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

  currencyChanged(){
    this.n_currency_id = this.ap_Recieve_Qty.value.n_currency_id;
  }

  TransSourceSearch(value: any) {
    this.transSourceSearching=true;
    this._service.GetTransSourceDropList().subscribe(res=> {
      this.transSourceList=res;
      this.transSourceFilteredServerSide.next(this.transSourceList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.transSourceSearching=false;
    })
  }

  TransSourceChanged() {
    this.transNo = this.ap_Recieve_Qty.value.n_trans_source_no;
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
        this.ap_recieve_qty_details.clear();
        data.forEach(element => {
          this.ap_recieve_qty_details.push(this.inertDEtailsRow(this.ap_recieve_qty_details.length));
        });
        this.ap_Recieve_Qty.patchValue(data[0]);
        this.executeSupplierListing(data[0]['n_supplier_id']);
        this.executeStoreListing(data[0]['n_store_id']);

        (this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray)?.patchValue(data);
        for(var i = 0; i < this.ap_Recieve_Qty.value.ap_recieve_qty_details.length; i++) {
          debugger
          this.executeItemListing(((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('s_item_id')?.value, i);
          this.executeUnitListing(((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('n_unit_id')?.value, i);
          ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('n_trans_source_doc_no')?.patchValue(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].n_doc_no); 
          ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('n_import_qty')?.patchValue(data[i].n_qty); 
          ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue(''); 
          ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('d_ExpectedDate')?.patchValue(new Date(Number(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].d_ExpectedDate.substring(0,4)), Number(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].d_ExpectedDate.substring(5,7))-1, Number(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].d_ExpectedDate.substring(8,10))));
        }
      });
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
  searchBegin(event,controlName)
  
  {
  
  setTimeout(() => {
    
    this._lookUp.getSupplierSearch(event.target.value,event.target.value).subscribe(
      (res)=>{
    debugger;
        this.supllierSearch=res
      }
    )
    
  }, 2000);
  if(event.target.value=='')
  {
    this.ap_Recieve_Qty.get(controlName)?.patchValue(0);
  }
  
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
 let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber+" #tdS" + i) as HTMLElement;
 
 (this.ap_Recieve_Qty.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
 (this.ap_Recieve_Qty.get(inputNumber))?.patchValue(AccountNo.innerHTML);
 let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
 element.style.opacity="0";
 element.style.zIndex="-1";
}
  QualityEngSearch(value: any) {
    this.qualityEngSearching=true;
    this._service.GetQualityEng().subscribe(res=> {
      this.qualityEngList=res;
      this.qualityEngFilteredServerSide.next(this.qualityEngList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.qualityEngSearching=false;
    })
  }

  loadSuppliers() {
    const dialogRef = this.dialog.open(SuppliersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isSupplierExist = true;
  
     this.ap_Recieve_Qty.get('s_supplier_name')?.patchValue(res.data.s_supplier_name +" # "+res.data.n_supplier_id);
     this.ap_Recieve_Qty.get('n_supplier_id')?.patchValue(res.data.n_supplier_id);
    });
  }

  onKeySupplierSearch(event: any) {
    this.ap_Recieve_Qty.get('s_supplier_name')?.patchValue('');
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeSupplierListing(event.target.value);
      }
    }, 1000);
  }

  private executeSupplierListing(value: number) {
    this._supplierService.GetSupplierName(value).subscribe((data) => {
      if(data.supplierName != '' && data.supplierName != null){
        this.isSupplierExist = true;
        this.ap_Recieve_Qty.get('s_supplier_name')?.patchValue(data.supplierName +" # "+value );
      }
      else{
        this.isSupplierExist = false;
        this.ap_Recieve_Qty.get('s_supplier_name')?.patchValue('');
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
    
      this.ap_Recieve_Qty.get("s_store_name")?.patchValue(res.data.s_store_name + " # "+res.data.n_store_id );
      this.ap_Recieve_Qty.get("n_store_id")?.patchValue(res.data.n_store_id );
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
    this.ap_Recieve_Qty.get('s_store_name')?.patchValue('');
    this._service.GetStoreName(value).subscribe((data) => {
      if(data.storeName != "")
      {
        this.ap_Recieve_Qty.get('s_store_name')?.patchValue(data.storeName + " # "+value);
        this.isStoreExist = true;
      }
      else{
        this.isStoreExist = false;
        this.ap_Recieve_Qty.get('s_store_name')?.patchValue('');
      }
    });
  }

  currentItemIndex: number = 0;
  loadItems(i: number) {
    if(this.ap_Recieve_Qty.value.n_store_id == "" || this.ap_Recieve_Qty.value.n_store_id == null)
    {
      if(this.isEnglish)
        this._notification.ShowMessage(`Please choose a store at first`,3)
      else
        this._notification.ShowMessage("من فضلك اختر المخزن اولآ", 3);
      return;
    }

    this.currentItemIndex=i;
    var storeId = this.ap_Recieve_Qty.value.n_store_id;

     const dialogRef = this.dialog.open(ItemsRecieveComponent, {
       width: '700px',
       height:'600px',
       data: { 'storeId': storeId }
     });

     dialogRef.afterClosed().subscribe(res => {
      this.isItemExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
      ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue('');
    });
  }

  onKeyItemSearch(event: any, i) {
    if(this.ap_Recieve_Qty.value.n_store_id == "" || this.ap_Recieve_Qty.value.n_store_id == null)
    {
      if(this.isEnglish)
       this._notification.ShowMessage(`Please choose a store at first`,3)
      else
      this._notification.ShowMessage("من فضلك اختر المخزن اولآ", 3);
      ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
      return;
    }
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeItemListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeItemListing(value: string, i) {
  var storeId = this.ap_Recieve_Qty.value.n_store_id;
  this._service.GetItemName(value, storeId).subscribe((data) => {
    if(data.itemName != '' && data.itemName != null){
      this.isItemExist[i] = true;
      ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.itemName);
    }
    else{
      this.isItemExist[i] = false;
      ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    }
  });
  }

  currentRejectedItemIndex: number = 0;
  loadRejectedItems(i: number) {
    if(this.ap_Recieve_Qty.value.n_store_id == "" || this.ap_Recieve_Qty.value.n_store_id == null)
    {
      if(this.isEnglish)
        this._notification.ShowMessage(`choose a store `,3)
      else
        this._notification.ShowMessage("من فضلك اختر المخزن اولآ", 3);
      return;
    }

    this.currentRejectedItemIndex=i;
    var storeId = this.ap_Recieve_Qty.value.n_store_id;

     const dialogRef = this.dialog.open(ItemsRecieveComponent, {
       width: '700px',
       height:'600px',
       data: { 'storeId': storeId }
     });

     dialogRef.afterClosed().subscribe(res => {
      this.isRejectedItemExist[i] = true;
      if(res != undefined)
        this.resetRejectedValues(i);
      ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(this.currentRejectedItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(this.currentRejectedItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(this.currentRejectedItemIndex) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(this.currentRejectedItemIndex) as FormGroup).get('s_unit_name')?.patchValue('');
    });
  }

  onKeyRejectedItemSearch(event: any, i) {
    if(this.ap_Recieve_Qty.value.n_store_id == "" || this.ap_Recieve_Qty.value.n_store_id == null)
    {
      this._notification.ShowMessage("من فضلك اختر المخزن اولآ", 3);
      ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
      return;
    }
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeRejectedItemListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeRejectedItemListing(value: string, i) {
  var storeId = this.ap_Recieve_Qty.value.n_store_id;
  this._service.GetItemName(value, storeId).subscribe((data) => {
    if(data.itemName != '' && data.itemName != null){
      this.isRejectedItemExist[i] = true;
      ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.itemName);
    }
    else{
      this.isRejectedItemExist[i] = false;
      ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    }
  });
  }

  currentUnitIndex: number = 0;
  loadUnits(i: number) {
    this.currentUnitIndex=i;
    let itemID=  ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isUnitExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
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

  ChangeUnit(i:number)
  {
    var itemNo=((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    var unitNo=((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;

    this._PurchaseInvoiceService.GetUnitName(itemNo,unitNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
      else
      {
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name); 
      }
    });
  }

  ChangeItem(i:number)
  {
    var itemNo=((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;

    this._service.GetItemName(itemNo, 0).subscribe((data) => {
      if(data.itemName=="")
      {
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
      }
      else
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.itemName);  
    });
  }

  private executeUnitListing(value: number, i) {
    var itemId = ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._service.GetUnitName(value, itemId).subscribe((data) => {
      if(data.unitName != '' && data.unitName != null){
        this.isUnitExist[i] = true;
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.unitName);
      }
      else{
        this.isUnitExist[i] = false;
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
    });
  }

  currentRejectedUnitIndex: number = 0;
  loadRejectedUnits(i: number) {
    this.currentRejectedUnitIndex=i;
    let itemID=  ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(this.currentRejectedUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isRejectedUnitExist[i] = true;
      if(res != undefined)
        this.resetRejectedValues(i);
     ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(this.currentRejectedUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(this.currentRejectedUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
    });
  }

  onKeyRejectedUnitSearch(event: any, i) {
    clearTimeout(this.timeout);
    this.resetRejectedValues(i);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeRejectedUnitListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeRejectedUnitListing(value: number, i) {
    debugger;
    var itemId = ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._service.GetUnitName(value, itemId).subscribe((data) => {
      debugger
      if(data.unitName != '' && data.unitName != null){
        this.isRejectedUnitExist[i] = true;
        ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.unitName);
      }
      else{
        this.isRejectedUnitExist[i] = false;
        ((this.ap_Recieve_Qty.get("ap_rejected_goods_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
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
     ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentCostCenter1Index) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
     ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentCostCenter1Index) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
    });
  }

  onKeyCostCenter1Search(event: any, i) {
    clearTimeout(this.timeout);
    ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
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
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(data.costCenterName);
      }
      else{
        this.isCostCenter1Exist[i] = false;
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
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
      debugger
      this.isCostCenter2Exist[i] = true;
     ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentCostCenter2Index) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
     ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(this.currentCostCenter2Index) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
    });
  }

  onKeyCostCenter2Search(event: any, i) {
    clearTimeout(this.timeout);
    ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
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
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(data.costCenterName);
      }
      else{
        this.isCostCenter2Exist[i] = false;
        ((this.ap_Recieve_Qty.get("ap_recieve_qty_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
      }
    });
  }

  resetDetailsValues(i: number)
  {
    ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    ((this.ap_Recieve_Qty.get('ap_recieve_qty_details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
  }
  resetRejectedValues(i: number)
  {
    ((this.ap_Recieve_Qty.get('ap_rejected_goods_details') as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ap_Recieve_Qty.get('ap_rejected_goods_details') as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    ((this.ap_Recieve_Qty.get('ap_rejected_goods_details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
  }

  MultiCostChecked()
  {
    var b_multi_cost = this.ap_Recieve_Qty.value.b_use_multi_cost_center;
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
    this.showspinner = true;
    if(this.ValidateDetailsTable() == false)
      {
        this.showspinner = false;
        return;
      }

    var formData = new FormData();
    this.ap_Recieve_Qty.value.d_doc_date=new DatePipe('en-US').transform(this.ap_Recieve_Qty.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.ap_Recieve_Qty.value.n_doc_no ?? 0);
    formData.append('n_DataAreaID', this.ap_Recieve_Qty.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ap_Recieve_Qty.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ap_Recieve_Qty.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ap_Recieve_Qty.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ap_Recieve_Qty.value.d_UserUpdateDate ?? '');
    formData.append('d_doc_date', this.ap_Recieve_Qty.value.d_doc_date ?? '');
    formData.append('n_Actual_Doc_no', this.ap_Recieve_Qty.value.n_Actual_Doc_no ?? 0);
    formData.append('n_supplier_id', this.ap_Recieve_Qty.value.n_supplier_id ?? 0);
    formData.append('n_store_id', this.ap_Recieve_Qty.value.n_store_id ?? 0);
    formData.append('n_currency_id', this.ap_Recieve_Qty.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.ap_Recieve_Qty.value.n_currency_coff ?? 0);
    formData.append('s_notes', this.ap_Recieve_Qty.value.s_notes ?? '');
    formData.append('s_notes_eng', this.ap_Recieve_Qty.value.s_notes_eng ?? '');
    formData.append('b_Confirm', this.ap_Recieve_Qty.value.b_Confirm ?? false);
    formData.append('n_trans_source_no', this.ap_Recieve_Qty.value.n_trans_source_no ?? 0);
    formData.append('b_use_multi_cost_center', this.ap_Recieve_Qty.value.b_use_multi_cost_center ?? false);
    formData.append('b_direct_delivery_order', this.ap_Recieve_Qty.value.b_direct_delivery_order ?? false);
    formData.append('n_QualityEng_id', this.ap_Recieve_Qty.value.n_QualityEng_id ?? 0);
    formData.append('n_shift_id', this.ap_Recieve_Qty.value.n_shift_id ?? 0);

    for(var i = 0; i < this.ap_recieve_qty_details.length; i++)
    {
      this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].d_ExpectedDate=new DatePipe('en-US').transform(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].d_ExpectedDate, 'yyyy/MM/dd');
      formData.append(`ap_recieve_qty_details[${i}].n_doc_no`, this.ap_Recieve_Qty?.value.n_doc_no ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_DataAreaID`, this.ap_Recieve_Qty?.value.n_DataAreaID ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_UserAdd`, this.ap_Recieve_Qty?.value.n_UserAdd ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].d_UserAddDate`, this.ap_Recieve_Qty?.value.d_UserAddDate ?? '');
      formData.append(`ap_recieve_qty_details[${i}].n_UserUpdate`, this.ap_Recieve_Qty?.value.n_UserUpdate ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].d_UserUpdateDate`, this.ap_Recieve_Qty?.value.d_UserUpdateDate ?? '');
      formData.append(`ap_recieve_qty_details[${i}].nLineNo`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].nLineNo ?? 0); //this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].nLineNo
      formData.append(`ap_recieve_qty_details[${i}].s_item_id`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].s_item_id ?? '');
      formData.append(`ap_recieve_qty_details[${i}].n_unit_id`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].n_unit_id ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_import_qty`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].n_import_qty ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_qty`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].n_qty ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].d_ExpectedDate`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].d_ExpectedDate ?? '');
      formData.append(`ap_recieve_qty_details[${i}].s_cost_center_id`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].s_cost_center_id ?? '');
      formData.append(`ap_recieve_qty_details[${i}].s_cost_center_id2`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].s_cost_center_id2 ?? '');
      formData.append(`ap_recieve_qty_details[${i}].n_trans_source_doc_no`, this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].n_trans_source_doc_no ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_scr_pallet_no`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].n_scr_pallet_no ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_scr_length_no`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].n_scr_length_no ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_scr_average`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].n_scr_average ?? 0);
      formData.append(`ap_recieve_qty_details[${i}].n_weight`, this.ap_Recieve_Qty?.value.ap_recieve_qty_details[i].n_weight ?? 0);
    }

    if(this.ap_rejected_goods_details != null || this.ap_rejected_goods_details != '')
    {
      for(var i = 0; i < this.ap_rejected_goods_details.length; i++)
      {
        formData.append(`ap_rejected_goods_details[${i}].n_doc_no`, this.ap_Recieve_Qty?.value.n_doc_no ?? 0);
        formData.append(`ap_rejected_goods_details[${i}].n_DataAreaID`, this.ap_Recieve_Qty?.value.n_DataAreaID ?? 0);
        formData.append(`ap_rejected_goods_details[${i}].d_UserAddDate`, this.ap_Recieve_Qty?.value.d_UserAddDate ?? '');
        formData.append(`ap_rejected_goods_details[${i}].d_UserUpdateDate`, this.ap_Recieve_Qty?.value.d_UserUpdateDate ?? '');
        formData.append(`ap_rejected_goods_details[${i}].nLineNo`, this.ap_Recieve_Qty?.value.ap_rejected_goods_details[i].nLineNo ?? 0);
        formData.append(`ap_rejected_goods_details[${i}].s_item_id`, this.ap_Recieve_Qty?.value.ap_rejected_goods_details[i].s_item_id ?? '');
        formData.append(`ap_rejected_goods_details[${i}].n_qty`, this.ap_Recieve_Qty?.value.ap_rejected_goods_details[i].n_qty ?? 0);
        formData.append(`ap_rejected_goods_details[${i}].n_unit_id`, this.ap_Recieve_Qty?.value.ap_rejected_goods_details[i].n_unit_id ?? 0);
        formData.append(`ap_rejected_goods_details[${i}].s_notes`, this.ap_Recieve_Qty?.value.ap_rejected_goods_details[i].s_notes ?? '');
      }
    }

    if(this.docuNumber <= 0) {
      // this.disableButtons();
      this._service.Create(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
           this._notification.ShowMessage(data.Emsg,data.status)
        else
            this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ap/recieveqtyList']);
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
          this._router.navigate(['/ap/recieveqtyList']);
        }
      });
    }
  }

  ValidateDetailsTable(): boolean {
    var isValid = true;
    if(this.ap_recieve_qty_details.length <= 0)
    {
      if(this.isEnglish)
        this._notification.ShowMessage(`You can't save without inserting an item or unit `,2)
      else
      this._notification.ShowMessage(`لا يمكنك الحفظ بدون ان ادخال اصناف ووحدات الفاتورة`, 2);
      isValid = false;
    }

    for(var i = 0; i < this.ap_recieve_qty_details.length; i++)
    {
      if(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].s_item_id == '')
      {
        if(this.isEnglish)
          this._notification.ShowMessage(`Please insert item code at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل كود الصنف في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].s_item_name == '')
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert item name at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل اسم الصنف في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].n_unit_id == '')
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert unit code at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل كود الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ap_Recieve_Qty.value.ap_recieve_qty_details[i].s_unit_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert item name at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فضلك ادخل اسم الوحدة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
    }
    return isValid;
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

  removeOrderDetailsRow(i: number)
  {
    if(this.ap_recieve_qty_details.length == 1)
    {
      if(this.isEnglish)
       this._notification.ShowMessage(`it must contain a single item at least`,3)
      else
      this._notification.ShowMessage("يجب ان يحتوي الأمر علي صنف واحد علي الأقل", 3);
      return
    }
    else{
      this.ap_recieve_qty_details.removeAt(i);
    }
  }

  removeRejectedRow(i: number)
  {
    this.ap_rejected_goods_details.removeAt(i);
  }

  OpenRejectDialaog() {
    var storeId = this.ap_Recieve_Qty.value.n_store_id;

     const dialogRef = this.dialog.open(RejectedGoodsComponent, {
       width: '1000px',
       height:'600px',
       data: {  }
     });
  }
  
}
