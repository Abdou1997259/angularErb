import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { PurchaseDemand } from 'src/app/Core/Api/AP/purchase-demand.service';
import { StoreService } from 'src/app/Core/Api/SC/store.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { SalersLkpComponent } from 'src/app/Controls/salers-lkp/salers-lkp.component';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ItemsDemandComponent } from 'src/app/Controls/items-demand/items-demand.component';

@Component({
  selector: 'app-add-purchase-demand',
  templateUrl: './add-purchase-demand.component.html',
  styleUrls: ['./add-purchase-demand.component.css']
})
export class AddPurchaseDemandComponent implements OnInit {
  ap_purchase_order!: FormGroup;
  showspinner: boolean = false;
  n_purchase_order_no: number = 0;

  transNo: any = '';
  storesList: any;
  storeSearching:boolean=false;
  storeFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  transSourceList!: any;
  transSourceFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  transSourceSearching:boolean=false;
  isEnglish:boolean=false;
  timeout: any;
  items: any;
  orderOptions: any;
  orderTypes: any;
  priorityList: any;

  constructor(private _SERVICE: PurchaseDemand, private _formBuilder: FormBuilder, public dialog: MatDialog, private _notification: NotificationServiceService,
    private _router: Router, private storeService: StoreService, private _routeActive: ActivatedRoute, private _lookUp: GenerealLookup,
    private userservice: UserService, private _helperService: HelperService, private _transSource: SCTransTypeService)
  {
    this.ap_purchase_order = this._formBuilder.group({
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      n_purchase_order_no: new FormControl(''),
      d_P_O_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      n_store_id: new FormControl('', Validators.required),
      n_purch_order_type: new FormControl(''),
      n_ordertype: new FormControl(''),
      s_DocReference: new FormControl(''),
      b_Confirm: new FormControl(''),
      s_description_arabic: new FormControl(''),
      s_description_eng: new FormControl(''),
      n_Purchase_order: new FormControl(''),
      n_trans_source_no: new FormControl(''),

      ap_Purchase_Orders_Details: this._formBuilder.array([])
    });
  }

//hooks Methods
  ngOnInit(): void {

    this.n_purchase_order_no= Number( this._routeActive.snapshot.paramMap.get("id") );

    this.TransSourceSearch('');
    this._lookUp.getItems().subscribe(res=>{
      this.items= res
    });

    this._SERVICE.GetOrderOptions().subscribe((data) => {
      this.orderOptions = data;
    });
    this._SERVICE.GetOrderTypes().subscribe((data) => {
      this.orderTypes = data;
    });
    this._helperService.GetAppPriority().subscribe((data) => {
      this.priorityList = data;
    });

    this.storeSearch('');

    if(this.n_purchase_order_no <= 0)
    {
      this._SERVICE.GetcurrentPurchaseOrder().subscribe((data) => {
        this.ap_purchase_order.patchValue(data);
        this.ap_purchase_order.get("d_P_O_date")?.patchValue((new Date()).toISOString().substring(0,10));
      });
      this.add_PurchaseDetails();
    }

    if(this.n_purchase_order_no > 0)
    {
      this.showspinner = true;
      this._SERVICE.GetByID(this.n_purchase_order_no).subscribe((data) => {
        this.ap_purchase_order.patchValue(data);
        this.ap_purchase_order.get("d_P_O_date")?.patchValue(new Date(Number(data.d_P_O_date.substring(0,4)), Number(data.d_P_O_date.substring(5,7))-1, Number(data.d_P_O_date.substring(8,10))));

        data.ap_Purchase_Orders_Details.forEach(element => {
          this.ap_Purchase_Orders_Details.push(this.inserNewDetailsRow(this.ap_Purchase_Orders_Details.length + 1));
        });
        (this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray)?.patchValue(data.ap_Purchase_Orders_Details);

        for(var i = 0; i < this.ap_Purchase_Orders_Details.length; i++)
        {
          ((this.ap_purchase_order.get('ap_Purchase_Orders_Details') as FormArray).at(i) as FormGroup).get('d_ExpectedDate')?.patchValue( new Date(Number(data.ap_Purchase_Orders_Details[i].d_ExpectedDate.substring(0,4)), Number(data.ap_Purchase_Orders_Details[i].d_ExpectedDate.substring(5,7))-1, Number(data.ap_Purchase_Orders_Details[i].d_ExpectedDate.substring(8,10))) )
        }

        this.showspinner = false;
      });
    }
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan(); 
  }

  get ap_Purchase_Orders_Details(): FormArray
  {
    return this.ap_purchase_order.get('ap_Purchase_Orders_Details') as FormArray;
  }

  inserNewDetailsRow(line: number): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_qty: '',
      d_ExpectedDate: '',
      n_last_Purchase_Price: '',
      n_current_balance: '',
      n_trans_source_doc_no: '',
      n_consume_monthly_rate: '',
      n_Highpriority: '',
      n_salesman_id: '',
      s_salesman_name: '',
      s_notes: ''
    });
  }

  add_PurchaseDetails()
  {
    this.ap_Purchase_Orders_Details.push(this.inserNewDetailsRow(this.ap_Purchase_Orders_Details.length + 1));
  }

  reomve_PurchaseRow(i: number)
  {
    if(this.ap_Purchase_Orders_Details.length == 1)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('purchase demand must have a single item at least', 3);
    else
      this._notification.ShowMessage('يجب ان يحتوي طلب الشراء علي صنف واحد علي الاقل', 3);
      return;
    }
    this.ap_Purchase_Orders_Details.removeAt(i);
  }

  storeSearch(value: any) {
    this.storeSearching=true;
    this._helperService.GetStoresDP().subscribe(res=> {
      this.storesList=res;
      this.storeFilteredServerSide.next(this.storesList.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.storeSearching=false;
    })
  }

  loadItems(i: number) {
    if(this.ap_purchase_order.value.n_store_id == null || this.ap_purchase_order.value.n_store_id == '' || this.ap_purchase_order.value.n_store_id == 0)
    {
      if(this.isEnglish)
        this._notification.ShowMessage('Please choose store at first',3)
      else
        this._notification.ShowMessage(`من فضلك اختر المخزن اولآ...`, 3);
      return;
    }
     const dialogRef = this.dialog.open(ItemsDemandComponent, {
       width: '700px',
       height:'600px',
       data: {  }
     });

     dialogRef.afterClosed().subscribe(res => {
      if(res != undefined)
        this.resetDetailsValues(i);
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      //((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
      //((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
      this._SERVICE.GetItemData(res.data.s_item_id, this.ap_purchase_order.value.n_store_id).subscribe((data) => {
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_last_Purchase_Price')?.patchValue(data.n_purchase);
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_current_balance')?.patchValue(data.n_qty);
      });
    });
  }

  onKeyItemSearch(event: any, i) {
    if(this.ap_purchase_order.value.n_store_id == null || this.ap_purchase_order.value.n_store_id == '' || this.ap_purchase_order.value.n_store_id == 0)
    {
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert store at first ',3)
      else
      this._notification.ShowMessage(`من فضلك اختر المخزن اولآ...`, 3);
      return;
    }
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeItemListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeItemListing(value: string, i) {
  this._helperService.GetItemDetails(value).subscribe((data) => {
    if(data != '' || data != null || data != undefined){
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue(data.s_item_id);
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.s_item_name);
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(data.n_unit_id);
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
      this._SERVICE.GetItemData(data.s_item_id, this.ap_purchase_order.value.n_store_id).subscribe((data) => {
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_last_Purchase_Price')?.patchValue(data.n_purchase);
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_current_balance')?.patchValue(data.n_qty);
      });
    }
    else{
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_last_Purchase_Price')?.patchValue('');
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_current_balance')?.patchValue('');
    }
  });
  }

  loadUnits(i: number) {
    let itemID=  ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
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

  
  ChangeItem(i:number)
  {
    var storeNo=this.ap_purchase_order.get('n_store_id')?.value;
    if(storeNo=="" || storeNo == null)
    {
      if(this.isEnglish)
        this._notification.ShowMessage('Please choose store at first',3)
      else
        this._notification.ShowMessage(`من فضلك اختر المخزن اولآ...`, 3);
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_last_Purchase_Price')?.patchValue('');
      ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_current_balance')?.patchValue('');
      return;
    }
    var itemNo=((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;

    this._helperService.GetGlobalItemName(itemNo).subscribe(res=>{
      if(res==null || res=='')
      {
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
      else
      {
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.name);
        this._SERVICE.GetItemData(itemNo, storeNo).subscribe((data) => {
          ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_last_Purchase_Price')?.patchValue(data.n_purchase);
          ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_current_balance')?.patchValue(data.n_qty);
        });
      }
    });
  }

  ChangeUnit(i:number)
  {
    var itemNo=((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    var unitNo=((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;

    this._helperService.GetGlobalUnitName(itemNo,unitNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
      else
      {
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name); 
      }
    });

  }


  private executeUnitListing(value: any, i) {
    var itemId = ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._helperService.GetUnitName(value, itemId).subscribe((data) => {
      if(data.s_unit_name != '' && data.s_unit_name != null){
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
      }
      else{
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
    });
  }

  loadSalers(i: number) {
    const dialogRef = this.dialog.open(SalersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('n_salesman_id')?.patchValue(res.data.n_salesman_id);
     ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_salesman_name')?.patchValue(res.data.s_salesman_name);
    });
  }

  onKeySalerSearch(event: any, i) {
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeSalerListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeSalerListing(value: any, i) {
    this._helperService.GetSalerData(value).subscribe((data) => {
      if(data.s_salesman_name != '' && data.s_salesman_name != null){
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_salesman_name')?.patchValue(data.s_salesman_name);
      }
      else{
        ((this.ap_purchase_order.get("ap_Purchase_Orders_Details") as FormArray).at(i) as FormGroup).get('s_salesman_name')?.patchValue('');
      }
    });
  }

  TransSourceSearch(value: any) {
    this.transSourceSearching=true;
    this._SERVICE.GetDemandTransSourceDropList().subscribe(res=> {
      this.transSourceList=res;
      this.transSourceFilteredServerSide.next(this.transSourceList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.transSourceSearching=false;
    })
  }

  TransSourceChanged() {
    this.transNo = this.ap_purchase_order.value.n_trans_source_no;
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
        this.ap_Purchase_Orders_Details.clear();
        data.forEach(element => {
          this.ap_Purchase_Orders_Details.push(this.inserNewDetailsRow(this.ap_Purchase_Orders_Details.length));
        });
        this.ap_purchase_order.patchValue(data[0]);

        (this.ap_purchase_order.get('ap_Purchase_Orders_Details') as FormArray)?.patchValue(data);
        for(var i = 0; i < this.ap_purchase_order.value.ap_Purchase_Orders_Details.length; i++) {
          this.executeItemListing(((this.ap_purchase_order.get('ap_Purchase_Orders_Details') as FormArray).at(i) as FormGroup).get('s_item_id')?.value, i);
          this.executeUnitListing(((this.ap_purchase_order.get('ap_Purchase_Orders_Details') as FormArray).at(i) as FormGroup).get('n_unit_id')?.value, i);
          ((this.ap_purchase_order.get('ap_Purchase_Orders_Details') as FormArray).at(i) as FormGroup).get('n_trans_source_doc_no')?.patchValue(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_doc_no);
          ((this.ap_purchase_order.get('ap_Purchase_Orders_Details') as FormArray).at(i) as FormGroup).get('d_ExpectedDate')?.patchValue(new Date(Number(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].d_ExpectedDate.substring(0,4)), Number(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].d_ExpectedDate.substring(5,7))-1, Number(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].d_ExpectedDate.substring(8,10))));
        }
      });
     });
  }

  resetDetailsValues(i: number)
  {

  }

  Save()
  {
    if(this.ValidateDetails() == false)
      return;

    this.showspinner = true;
    var formData = new FormData();
    this.ap_purchase_order.value.d_P_O_date=new DatePipe('en-US').transform(this.ap_purchase_order.value.d_P_O_date, 'yyyy/MM/dd');
    formData.append('n_DataAreaID', this.ap_purchase_order.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd: ', this.ap_purchase_order.value.n_UserAdd  ?? 0);
    formData.append('d_UserAddDate: ', this.ap_purchase_order.value.d_UserAddDate  ?? '');
    formData.append('n_UserUpdate', this.ap_purchase_order.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ap_purchase_order.value.d_UserUpdateDate ?? '');
    formData.append('n_purchase_order_no', this.ap_purchase_order.value.n_purchase_order_no ?? 0);
    formData.append('d_P_O_date', this.ap_purchase_order.value.d_P_O_date ?? '');
    formData.append('n_store_id', this.ap_purchase_order.value.n_store_id ?? 0);
    formData.append('n_purch_order_type', this.ap_purchase_order.value.n_purch_order_type ?? 0);
    formData.append('n_ordertype', this.ap_purchase_order.value.n_ordertype ?? 0);
    formData.append('s_DocReference', this.ap_purchase_order.value.s_DocReference ?? '');
    formData.append('b_Confirm', this.ap_purchase_order.value.b_Confirm ?? false);
    formData.append('s_description_arabic', this.ap_purchase_order.value.s_description_arabic ?? '');
    formData.append('s_description_eng', this.ap_purchase_order.value.s_description_eng ?? '');
    formData.append('n_Purchase_order', this.ap_purchase_order.value.n_Purchase_order ?? 0);
    formData.append('n_trans_source_no', this.ap_purchase_order.value.n_trans_source_no ?? 0);

    for(var i = 0; i < this.ap_Purchase_Orders_Details.length; i++)
    {
      this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].d_ExpectedDate=new DatePipe('en-US').transform(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].d_ExpectedDate, 'yyyy/MM/dd');
      formData.append(`ap_Purchase_Orders_Details[${i}].nLineNo`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].nLineNo ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].s_item_id`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_item_id ?? '');
      formData.append(`ap_Purchase_Orders_Details[${i}].n_unit_id`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_unit_id ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].n_qty`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_qty ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].d_ExpectedDate`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].d_ExpectedDate ?? '');
      formData.append(`ap_Purchase_Orders_Details[${i}].n_last_Purchase_Price`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_last_Purchase_Price ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].n_current_balance`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_current_balance ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].n_trans_source_doc_no`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_trans_source_doc_no ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].n_consume_monthly_rate`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_consume_monthly_rate ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].n_Highpriority`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_Highpriority ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].n_salesman_id`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_salesman_id ?? 0);
      formData.append(`ap_Purchase_Orders_Details[${i}].s_notes`, this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_notes ?? '');
    }

    if(this.n_purchase_order_no <= 0) {
      this._SERVICE.Create(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
           this. _notification.ShowMessage(data.Emsg,data.status);
        else

           this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ap/purchaseDemandList']);
        }
      });
    }
    else{
      this._SERVICE.Update(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
           this. _notification.ShowMessage(data.Emsg,data.status);
        else
           this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ap/purchaseDemandList']);
        }
      });
    }
  }

  ValidateDetails(): boolean
  {
    var isValid = true;
    for(var i = 0; i < this.ap_Purchase_Orders_Details.length; i++)
    {
      if(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_item_id == null || this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_item_id == '')
      {
        if(this.isEnglish)
           this._notification.ShowMessage(`Please choose item number at line ${i+1 }`,3)
        else
        this._notification.ShowMessage(`من فضلك اختر كود الصنف في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_item_name == null || this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_item_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert item name at line ${i+1}`,3)
         else
        this._notification.ShowMessage(`من فضلك اسم الصنف غير موجود في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_unit_id == null || this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_unit_id == '')
      {
        if(this.isEnglish) 
         this._notification.ShowMessage(`Please insert unit number at line ${i+1}`,3)
        else

        this._notification.ShowMessage(`من فضلك اختر كود الوحدة في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_unit_name == null || this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].s_unit_name == '')
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert unit name at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك اسم الوحدة غير موجود في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_qty == null || this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_qty == '' || this.ap_purchase_order.value.ap_Purchase_Orders_Details[i].n_qty == 0)
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert qty at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل الكمية في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }
    }
    return isValid;
  }

  disableButtons() {
    debugger;
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }
 
}
