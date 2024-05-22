import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ItemGeneralPopupComponent } from 'src/app/Controls/item-general-popup/item-general-popup.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { PriceListService } from 'src/app/Core/Api/AR/price-list.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { GeneralSC } from 'src/app/Core/Api/SC/genereal-sc.service';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { StoreService } from 'src/app/Core/Api/SC/store.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { ItemGroupComponent } from '../popUps/item-group/item-group.component';
import { ItemsTypeComponent } from '../popUps/items-type/items-type.component';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';
import { ItemPriceListLKPComponent } from 'src/app/Controls/item-price-list-lkp/item-price-list-lkp.component';

@Component({
  selector: 'app-pricelist-add',
  templateUrl: './pricelist-add.component.html',
  styleUrls: ['./pricelist-add.component.css']
})
export class PricelistAddComponent extends BaseComponent implements  OnInit {
  ar_PriceList!: FormGroup;
  showspinner: boolean = false;
  tablespinner: boolean = false;
  isEnglish: boolean = false
  n_doc_no: number = 0;
  DataAreaNo : any;

  itemTypesList: any[] = [];
  itemTypesSearching: boolean = false;
  filteredItemTypesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

 /////////////////////////////////////////////////////////
  // start contructor
  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private _stockOutToStock: StockOutToStock,
    private _notificationService: NotificationServiceService, private _router: Router, private _lookUp: GenerealLookup,
    private _service: PriceListService, private _activatedRoute: ActivatedRoute, private generalSC: GeneralSC,
    private _initialBalanceService: IntialBalnceService, private userservice: UserService, private _LookupControlService: LookupControlService)
  {
    super(_activatedRoute.data, userservice);
    this.myDatepipe = new DatePipe('en-US');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      processing: true
    };

    this.ar_PriceList = this._formBuilder.group({
      n_doc_no: [''],
      d_doc_date:[(new Date()).toISOString().substring(0,10),Validators.required],
      d_season_start_date: [(new Date()).toISOString().substring(0,10),Validators.required],
      d_season_end_date: [(new Date()).toISOString().substring(0,10),Validators.required],
      s_list_name:['', Validators.required],
      s_list_name_eng:[''],
      GroupItem_no:[],
      item_type_id:[],
      Discount:[],

      n_DataAreaID:'',
      n_UserAdd:'',
      d_UserAddDate:'',
      n_UserUpdate: '',
      d_UserUpdateDate: '',
      n_current_branch:'',
      n_current_company:'',
      n_current_year:'',

      ar_PriceList_details: this._formBuilder.array([])
    });
  }

  override ngOnInit(): void {
    this.showspinner = true;
    this.n_doc_no = Number(this._activatedRoute.snapshot.paramMap.get("id"));
    this.DataAreaNo = Number(this.userservice.GetDataAreaID());

    this.ItemTypesSearch('');

    this._initialBalanceService.getItems().subscribe((res)=>{
      this.items=res;
    })

   // this._initialBalanceService.getUnits().subscribe((res)=>{
     // this.units=res;
    //})

    this._service.itemWithUnits().subscribe((res)=>{
      this.itemsWithUnit= res;
    });

    if(this.n_doc_no <= 0)
    {
      this.ar_PriceList.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
      this.ar_PriceList.get("d_season_end_date")?.patchValue((new Date()).toISOString().substring(0,10));
      this.ar_PriceList.get("d_season_start_date")?.patchValue((new Date()).toISOString().substring(0,10));
      this.showspinner = false;
    }

    if(this.n_doc_no > 0)
    {
      this._service.getById(this.n_doc_no).subscribe((data) =>
      {
        this.ar_PriceList.patchValue(data);
        this.ar_PriceList.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        this.ar_PriceList.get("d_season_end_date")?.patchValue(new Date(Number(data.d_season_end_date.substring(0,4)), Number(data.d_season_end_date.substring(5,7))-1, Number(data.d_season_end_date.substring(8,10))));
        this.ar_PriceList.get("d_season_start_date")?.patchValue(new Date(Number(data.d_season_start_date.substring(0,4)), Number(data.d_season_start_date.substring(5,7))-1, Number(data.d_season_start_date.substring(8,10))));

        if(data.ar_PriceList_details != null && data.ar_PriceList_details != undefined)
        {
          data.ar_PriceList_details.forEach(data => {
            this.ar_PriceList_details.push(this.newItemssdetailsWithData(this.ar_PriceList_details.length + 1));
          });
          (this.ar_PriceList.get('ar_PriceList_details') as FormArray)?.patchValue(data.ar_PriceList_details);
        }

        this.showspinner = false;
     });
    }

    LangSwitcher.translateData(0);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  get ar_PriceList_details():FormArray
  {
    return this.ar_PriceList.get('ar_PriceList_details') as FormArray;
  }

  newItemssdetailsWithData(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_discount_value: '',
      n_season_price: '',
      n_AgentPrice: '',
      n_unit_price: '',
      n_lowest_price: '',
      n_storage_period: ''
    });
  }

  addItemsDetails() {
    this.ar_PriceList_details.push(this.newItemssdetailsWithData(this.ar_PriceList_details.length + 1));
  }

  removeItems(i:number)
  {
   this.ar_PriceList_details.removeAt(i);
  }

  ItemTypesSearch(value: any)
  {
    this.itemTypesSearching=true;
    this._service.GetTypes().subscribe(res=> {
      this.itemTypesList = res;
      this.filteredItemTypesServerSide.next(this.itemTypesList.filter(x => x.s_item_type_name.toLowerCase().indexOf(value) > -1));
      this.itemTypesSearching = false;
    });
  }

 isUnitExist: boolean[] = [];
 multiStore:boolean=false
 searchingStrore:boolean=false;
 searchingCurrency:boolean=false
 stores:any=[];
 ItemisEsixt:boolean=false;
 unitExist:boolean=true;
 currencyType!: any [];
 discount!:any;
 Doc:any;
 items:any[]=[];
 units:any[]=[];
 unitsForRow:Array<any>=[];
 isItemExist: boolean[] = [];
 searchingItems:any[]=[]
 searchingUnit:any[] =[];
 AccountCostType:number=0;
 isLocalcurrency: boolean=false;
 localCurencyName
 dtOptions: DataTables.Settings = {};
 itemId: any[] = [];
 form: any;
 myDatepipe!: any;
 localCurrency;
 item:any=0;
 itemgroup:any=''
 groupField:any;
 typeField:any;
 isYearExisted:boolean=false;
 @ViewChild("document_no") documentInput!:ElementRef;
 isThereStock: boolean = false;
 enableUnits:boolean=true;

 itemsWithUnit:any[]=[];

  getUnitByITem(id:number):any []{
    let arr= this.itemsWithUnit.filter(item=>item.s_item_id==id);
    return arr;
  }


   _currentAccountIndex = 0;
  loadItems(i: number) {
    var discountVal = Number( this.ar_PriceList.get('Discount')?.value );
    this._currentAccountIndex=i;
    const dialogRef = this.dialog.open(ItemPriceListLKPComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
      ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
      ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.patchValue(res.data.n_selling_price);
      if(discountVal > 0)
        {
          ((this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_discount_value')?.patchValue(res.data.n_selling_price * discountVal/100);
          ((this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_season_price')?.patchValue(res.data.n_selling_price - (res.data.n_selling_price * discountVal/100));
        }
    });

    let checkItem=((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.value;
    if( checkItem!==null||checkItem!=='')
    {
     this.ItemisEsixt=true;
    }
  }



  ChangeItems(i:number)
  {
    this._currentAccountIndex=i;
    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.patchValue('');
    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.patchValue('');
  }

  loadUnits(i:number) {
    let itemID=  ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.value;

    this._currentAccountIndex=i;
    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: { 'itemId': itemID   }
    });

    dialogRef.afterClosed().subscribe(res => {
      this._service.GetPricePerUnit(res.data.n_unit_id,this.item).subscribe((data)=>{
        ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(data);
      });

      ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
      ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
    });
  }

  ChangeUnits(i:number)
  {
    this._currentAccountIndex=i;
    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue('');
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;
    var formData: any = new FormData();

    this.ar_PriceList.value.d_doc_date=new DatePipe('en-US').transform(this.ar_PriceList.value.d_doc_date, 'yyyy/MM/dd');
    this.ar_PriceList.value.d_season_start_date=new DatePipe('en-US').transform(this.ar_PriceList.value.d_season_start_date, 'yyyy/MM/dd');
    this.ar_PriceList.value.d_season_end_date=new DatePipe('en-US').transform(this.ar_PriceList.value.d_season_end_date, 'yyyy/MM/dd');

    formData.append("n_doc_no", this.ar_PriceList.value.n_doc_no ?? 0);
    formData.append("d_doc_date", this.ar_PriceList.value.d_doc_date ?? '');
    formData.append("d_season_start_date", this.ar_PriceList.value.d_season_start_date ?? '');
    formData.append("d_season_end_date", this.ar_PriceList.value.d_season_end_date ?? '');
    formData.append("s_list_name", this.ar_PriceList.value.s_list_name ?? '');
    formData.append("s_list_name_eng", this.ar_PriceList.value.s_list_name_eng ?? '');
    formData.append("n_DataAreaID", this.ar_PriceList.value.n_DataAreaID ?? 0);

    formData.append("n_UserAdd", this.ar_PriceList.value.n_UserAdd ?? 0);
    formData.append("d_UserAddDate", this.ar_PriceList.value.d_UserAddDate ?? '');
    formData.append("n_UserUpdate", this.ar_PriceList.value.n_UserUpdate ?? 0);
    formData.append("d_UserUpdateDate", this.ar_PriceList.value.d_UserUpdateDate ?? '');
    formData.append("n_current_branch", this.ar_PriceList.value.n_current_branch ?? 0);
    formData.append("n_current_company", this.ar_PriceList.value.n_current_company ?? 0);
    formData.append("n_current_year", this.ar_PriceList.value.n_current_year ?? 0);

    if(this.ar_PriceList.value.ar_PriceList_details.length > 0)
    {
      for (var i = 0; i < this.ar_PriceList.value.ar_PriceList_details.length; i++)
      {
        formData.append("ar_PriceList_details[" + i + "].s_item_id", this.ar_PriceList.value.ar_PriceList_details[i].s_item_id ?? '');
        formData.append("ar_PriceList_details[" + i + "].n_unit_id", this.ar_PriceList.value.ar_PriceList_details[i].n_unit_id ?? 0);
        formData.append("ar_PriceList_details[" + i + "].n_unit_price", this.ar_PriceList.value.ar_PriceList_details[i].n_unit_price ?? 0);
        formData.append("ar_PriceList_details[" + i + "].n_discount_value", this.ar_PriceList.value.ar_PriceList_details[i].n_discount_value ?? 0);
        formData.append("ar_PriceList_details[" + i + "].n_season_price", this.ar_PriceList.value.ar_PriceList_details[i].n_season_price ?? 0);
        formData.append("ar_PriceList_details[" + i + "].n_AgentPrice", this.ar_PriceList.value.ar_PriceList_details[i].n_AgentPrice ?? 0);
        formData.append("ar_PriceList_details[" + i + "].n_lowest_price", this.ar_PriceList.value.ar_PriceList_details[i].n_lowest_price ?? 0);
        formData.append("ar_PriceList_details[" + i + "].n_storage_period", this.ar_PriceList.value.ar_PriceList_details[i].n_storage_period ?? 0);
      }
    }

    if(this.n_doc_no != null && this. n_doc_no > 0)
    {
      this._service.Edit(formData).subscribe( data => {
        this.enableButtons();
        this.showspinner=false;
        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);
        if(data.status==1)
            this._router.navigate(['/ar/priceList']);
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
        this.enableButtons();
        this.showspinner=false;

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);
        if(data.status==1)
          this._router.navigate(['/ar/priceList']);
      });
    }
  }

  getItemsNow($event,i)
  {
    this._currentAccountIndex=i;
    let uni=$event.target.value.trim(" ");
    var arr=this.items.filter((res) => {
      res.s_item_id=$event.target.value
    });

    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(i) as FormGroup).get("s_item_name")?.patchValue(arr[0]);
    var arr=this.items.filter((ele)=>
    {
      return ele.s_item_id==$event.target.value
    });

    if(arr.length==0)
      this.ItemisEsixt=false
    else
      this.ItemisEsixt=true;

    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(i) as FormGroup).get("s_item_name")?.patchValue(arr[0]?.s_item_name);
    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
  }

  OnItemChange($event, i)
  {
    var discountVal = Number( this.ar_PriceList.get('Discount')?.value );
    const currentFormGroup = (this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(i) as FormGroup;
    this._service.GetItemById($event.target.value).subscribe((item) => {
      if(item != null || item != undefined)
        {
          currentFormGroup.get('s_item_id')?.patchValue(item.s_item_id);
          currentFormGroup.get('s_item_name')?.patchValue(item.s_item_name);
          currentFormGroup.get('n_unit_id')?.patchValue(item.n_unit_id);
          currentFormGroup.get('s_unit_name')?.patchValue(item.s_unit_name);
          currentFormGroup.get('n_unit_price')?.patchValue(item.n_selling_price);
          if (discountVal > 0) {
            currentFormGroup.get('n_discount_value')?.patchValue(item.n_selling_price * discountVal / 100);
            currentFormGroup.get('n_season_price')?.patchValue(item.n_selling_price - (item.n_selling_price * discountVal / 100));
          }
        }
        else{
          currentFormGroup.get('s_item_id')?.patchValue('');
          currentFormGroup.get('s_item_name')?.patchValue('');
          currentFormGroup.get('n_unit_id')?.patchValue('');
          currentFormGroup.get('s_unit_name')?.patchValue('');
          currentFormGroup.get('n_unit_price')?.patchValue('');
        }
    });
  }

  OnUnitChange($event, i)
  {
    var discountVal = Number( this.ar_PriceList.get('Discount')?.value );
    const currentFormGroup = (this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(i) as FormGroup;
    var itemId = currentFormGroup.get('s_item_id')?.value;

    if(itemId == '' || itemId == null || itemId == undefined)
    {
      this._notificationService.ShowMessage(`من فضلك اختر الصنف اولآ في السطر رقم ${ i + 1}`, 3);
      currentFormGroup.get('n_unit_id')?.patchValue('');
      return;
    }

    this._service.GetUnitById($event.target.value, itemId).subscribe((item) => {
      if(item != null || item != undefined)
        {
          currentFormGroup.get('n_unit_id')?.patchValue(item.n_unit_id);
          currentFormGroup.get('s_unit_name')?.patchValue(item.s_unit_name);
          currentFormGroup.get('n_unit_price')?.patchValue(item.n_selling_price);
          if (discountVal > 0) {
            currentFormGroup.get('n_discount_value')?.patchValue(item.n_selling_price * discountVal / 100);
            currentFormGroup.get('n_season_price')?.patchValue(item.n_selling_price - (item.n_selling_price * discountVal / 100));
          }
        }
        else{
          currentFormGroup.get('n_unit_id')?.patchValue('');
          currentFormGroup.get('s_unit_name')?.patchValue('');
          currentFormGroup.get('n_unit_price')?.patchValue('');
        }
    });
  }

  getUnitsNow($event, i)
  {
    let uni=$event.target.value.trim(" ");
    var arr=this.items.filter((res)=>{
      res.s_item_id=$event.target.value
    });

    this._currentAccountIndex=i;
    var arr=this.units.filter((ele)=>
    {
      return ele.n_unit_id==$event.target.value
    });

    if(arr.length===0)
      this.unitExist===true;
    else
      this.unitExist=false;

    ((this.ar_PriceList.get("ar_PriceList_details") as FormArray).at(i) as FormGroup).get("s_unit_name")?.patchValue(arr[0]?.s_unit_name)
  }

  LoadItemsDetails()
  {
    var itemType = Number( this.ar_PriceList.get('item_type_id')?.value );
    var itemGroup = this.ar_PriceList.get('GroupItem_no')?.value;
    var discountVal = Number( this.ar_PriceList.get('Discount')?.value );

    this.tablespinner = true;
    this.ar_PriceList_details.clear();
    this._service.LoadItemsDetails(itemType, itemGroup).subscribe((data) => {
      if(data.length <= 0)
      {
        this._notificationService.ShowMessage("لا يوجد أصناف!...", 2);
        this.tablespinner = false;
        return;
      }

      let setOfData = new Set(data);
      let i = 0;
      for (const item of setOfData)
        {
          this.ar_PriceList_details.push(this.newItemssdetailsWithData(this.ar_PriceList_details.length + 1));
          const currentFormGroup = (this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(i) as FormGroup;
          currentFormGroup.get('s_item_id')?.patchValue(item.s_item_id);
          currentFormGroup.get('s_item_name')?.patchValue(item.s_item_name);
          currentFormGroup.get('n_unit_id')?.patchValue(item.n_unit_id);
          currentFormGroup.get('s_unit_name')?.patchValue(item.s_unit_name);
          currentFormGroup.get('n_unit_price')?.patchValue(item.n_selling_price);
          if (discountVal > 0) {
              currentFormGroup.get('n_discount_value')?.patchValue(item.n_selling_price * discountVal / 100);
              currentFormGroup.get('n_season_price')?.patchValue(item.n_selling_price - (item.n_selling_price * discountVal / 100));
          }
          i++;
        }
      this.tablespinner = false;
    });
  }

  SeasonPriceChanged(i)
  {
    var seasonPrice = Number( ((this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(i) as FormGroup).get('n_season_price')?.value );
    var unitPrice = Number( ((this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(i) as FormGroup).get('n_unit_price')?.value );

    ((this.ar_PriceList.get('ar_PriceList_details') as FormArray).at(i) as FormGroup).get('n_discount_value')?.patchValue(unitPrice - seasonPrice);
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
