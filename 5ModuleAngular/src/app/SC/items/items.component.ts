import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from 'src/app/Core/Api/SC/items.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyLookupComponent } from 'src/app/Controls/currency-lookup/currency-lookup.component';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { UnitMeasurmentsComponent } from 'src/app/Controls/unit-measurments/unit-measurments.component';
import { StoresLookupComponent } from 'src/app/Controls/stores-lookup/stores-lookup.component';
import {map, startWith} from 'rxjs/operators';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';

declare var $: any;
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent  extends BaseComponent implements OnInit  {
  //filteredCategoryerverSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredMainGroupServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredGroupServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredTypeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredConfigServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredRelatedSuppServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredMarkServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  //filteredOnEyeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDefaultServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredItemProdCompServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  //searchingCategory:boolean=false;
  searchingMainGroup:boolean=false;
  searchingGroup:boolean=false;
  searchingType:boolean=false;
  searchingConfig:boolean=false;
  searchingRelated:boolean=false;
  searchingMark:boolean=false;
  //searchingOnEye:boolean=false;
  searchingDefault:boolean=false;
  searchingItemProdComp:boolean=false;

  categoryType:any=[];
  mainGroupType:any=[];
  groupType:any=[];
  itemType:any=[];
  configType:any=[];
  relatedType:any=[];
  markType:any=[];
  onEyeType:any=[];
  ItemDefaultUnit:any=[];
  itemCompType:any=[];
  taxType:any=[];
  ItemsName:any=[];
  UnitsData:any=[];
  StoresData:any=[];
  AccountCostType:number=0;
  FilteringCtrl: FormControl = new FormControl();

  dtOptions: DataTables.Settings = {};
  ItemForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  itemNo:any;
  showspinner:boolean=false;
  invalidColor='';
  isEnglish:boolean=false;

  constructor(private fb:FormBuilder
    ,private _ItemsService : ItemsService
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private userservice:UserService
    ,private _LookupControlService:LookupControlService) {

      super(_route.data,userservice);
      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {
        pagingType: 'full_numbers', 
        pageLength: 2, 
        processing: true
      };
      
      this.ItemForm = this.fb.group({
        n_Id: '',
        n_itemcategory: '',
        s_main_item_id: '',
        s_GroupItem_no: new FormControl('', Validators.required),
        s_item_id:new FormControl('', Validators.required),
        s_item_name:new FormControl('', Validators.required),
        s_item_name_eng:'',
        s_item_bar_code: '',
        s_item_bar_code_2: '',
        s_item_bar_code_3: '',
        s_item_bar_code_4:'',
        n_item_type_id: new FormControl('', Validators.required),
        n_itemconfig: '',
        s_arabic_item_description:'',
        s_english_item_description:'',
        n_static_period:'',
        n_sales_percent:'',
        n_related_supplier_id:'',
        s_mark_id:'',
        s_old_item_id:'',
        s_factory_code:'',
        n_selling_price:new FormControl('', Validators.required),
        n_lowest_cost:new FormControl('', Validators.required),
        n_Customer_Price:'',
        n_last_p_price:'',
        n_manual_cost:'',
        n_cost_price:'',
        n_profit_margin:'',
        n_keep_period:'',
        n_wait_period:'',
        s_itemNo:'',
        n_discount_ratio:'',
        b_over_draft:false,
        b_stop:false,
        n_on_eye_re:'',
        s_pics_path:'',
        b_is_grouped:false,
        b_have_alternative_item:false,
        b_has_Addon:false,
        b_tax_deductible:false,
        b_not_return_invoice:false,
        n_item_comp_id:'',
        n_weight:'',
        n_Volume:'',
        n_Customs_ratio:'',
        n_taxes_type:'',
        n_VAT:'',
        n_selective_tax_type:'',
        n_selective_tax_percent:'',
        s_international_classification_code:'',
        s_tax_authority_code:'',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',
        unitsDetails: this.fb.array([] , Validators.required),
        storesLimitDetails: this.fb.array([]),
        storeUnitDetails: this.fb.array([])
      }); 
     }

    get unitsDetails() : FormArray {
      return this.ItemForm.get("unitsDetails") as FormArray
    }

    get storesLimitDetails() : FormArray {
      return this.ItemForm.get("storesLimitDetails") as FormArray
    }

    get storeUnitDetails() : FormArray {
      return this.ItemForm.get("storeUnitDetails") as FormArray
    }
    
  
    GetCategory(){
      //this.searchingCategory=true; 
      this._ItemsService.GetItemCategories().subscribe(res=>{
        this.categoryType=res; 
        //this.filteredCategoryerverSide.next(  this.categoryType.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      });   
      //this.searchingCategory=false;
    }

    GetUnit(){
      this._ItemsService.GetItemUnits('').subscribe(data=>{
        this.UnitsData =  data;
      });
    }

    GetStores(){
      this._ItemsService.GetItemStores('').subscribe(data=>{
        this.StoresData =  data;
      });
    }

    GetLastPrice(id : any){
      this._ItemsService.GetItemLastPrice(id).subscribe(data=>{
        this.ItemForm.get('n_last_p_price')?.patchValue(data.price);
      });
    }

    GetLastCost(id : any){
      this._ItemsService.GetItemLastCost(id).subscribe(data=>{
        this.ItemForm.get('n_cost_price')?.patchValue(data.cost);
      });
    }

    searchMainGroup(value :any ){
      this.searchingMainGroup=true; 
      this._ItemsService.GetMainGroups().subscribe(res=>{
        this.mainGroupType=res; 
        this.filteredMainGroupServerSide.next(  this.mainGroupType.filter(x => x.s_GroupItem_name.toLowerCase().indexOf(value) > -1));
      });   
      this.searchingMainGroup=false;
    }

    searchGroup(value :any ){
      this.searchingGroup=true; 
      this._ItemsService.GetGroups('').subscribe(res=>{
        this.groupType=res; 
        this.filteredGroupServerSide.next(  this.groupType.filter(x => x.s_GroupItem_name.toLowerCase().indexOf(value) > -1));
      }) ;  
      this.searchingGroup=false;
    }

    searchItemType(value :any ){
      this.searchingType=true; 
      this._ItemsService.GetItemTypes().subscribe(res=>{
        this.itemType=res; 
        this.filteredTypeServerSide.next(  this.itemType.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      });   
      this.searchingType=false;
    }

    searchConfig(value :any ){
      this.searchingConfig=true; 
      this._ItemsService.GetItemConfig().subscribe(res=>{
        this.configType=res; 
        this.filteredConfigServerSide.next(  this.configType.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      });   
      this.searchingConfig=false;
    }

    searchItemSupp(value :any ){
      this.searchingRelated=true; 
      this._ItemsService.GetItemRelatedSupplier().subscribe(res=>{
        this.relatedType=res; 
        this.filteredRelatedSuppServerSide.next(  this.relatedType.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      });   
      this.searchingRelated=false;
    }

    searchMark(value :any ){
      this.searchingMark=true; 
      this._ItemsService.GetItemMark().subscribe(res=>{
        this.markType=res; 
        this.filteredMarkServerSide.next(  this.markType.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      });   
      this.searchingMark=false;
    }

    GetOnEye(){
      //this.searchingOnEye=true; 
      this._ItemsService.GetItemOnEye().subscribe(res=>{
        this.onEyeType=res; 
        //this.filteredOnEyeServerSide.next(  this.onEyeType.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      });   
      //this.searchingOnEye=false;
    }

    GetItemDefaultUnit(value :any){
      this.searchingDefault=true;
      this._ItemsService.GetItemDefaultUnit().subscribe(res=>{
        this.ItemDefaultUnit=res; 
        this.filteredDefaultServerSide.next(  this.ItemDefaultUnit.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
      }); 
      this.searchingDefault=false;
    }

    GetItemsName(){
      this._ItemsService.GetItemNames(this.ItemForm.value.s_item_name).subscribe(res=>{
        this.ItemsName=res; 
      }); 
    }

    searchItemProdComp(value :any){
      this.searchingItemProdComp=true;
      this._ItemsService.GetItemProductionCompany().subscribe(res=>{
        this.itemCompType=res; 
        this.filteredItemProdCompServerSide.next(  this.itemCompType.filter(x => x.s_item_comp_name.toLowerCase().indexOf(value) > -1));
      }); 
      this.searchingItemProdComp=false;
    }

    GetTaxTypes(){
      this._ItemsService.GetTaxTypes().subscribe(res=>{
        this.taxType=res; 
      }); 
    }

    isMain=false;
    isOnlyMain=false;
    ChangeCategory(){
      if(this.ItemForm.get('n_itemcategory')?.value == 1)
      {
        this.ItemForm.get('s_main_item_id')?.patchValue(1);
        this.ItemForm.get('s_main_item_id')?.disable();
        this.isMain=true;
        this.isOnlyMain=true;
        this.ItemForm.controls['s_main_item_id'].clearValidators();

        this.mainGroupType.push({s_main_item_id: this.ItemForm.get('s_item_id')?.value, s_GroupItem_name:this.ItemForm.get('s_item_id')?.value});
        this.filteredMainGroupServerSide.next(this.mainGroupType);
        this.ItemForm.get('s_main_item_id')?.patchValue(this.ItemForm.get('s_item_id')?.value);
      }
      else if (this.ItemForm.get('n_itemcategory')?.value == 2)
      {
        this.ItemForm.get('s_main_item_id')?.enable();
        this.isMain=true;
        this.isOnlyMain=false;
        this.ItemForm.controls['s_main_item_id'].setValidators([Validators.required]);
        this.searchGroup('');
        this.searchMainGroup('');
      }
      else if (this.ItemForm.get('n_itemcategory')?.value == 0)
      {
        this.isMain=false;
        this.isOnlyMain=false;
        this.ItemForm.controls['s_main_item_id'].clearValidators();
        this.ItemForm.get('s_main_item_id')?.patchValue('');
        this.searchGroup('');
      }

    }

    ChangeBarcodeValue(i:number)
    {
      var price=(this.ItemForm.get('n_selling_price')?.value>0) ? Number(this.ItemForm.get('n_selling_price')?.value) : 0;
      var coff=(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_Coff')?.value>0) ? Number(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_Coff')?.value) : 0;
      ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_barcode_unit_price')?.patchValue(price*coff);
    }

    ChangeUnits(i:number)
    {
      var unitNo=((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_ID')?.value;

      this._ItemsService.GetUnitName(unitNo).subscribe(res=>{
        if(res==null)
        {
          ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_ID')?.patchValue('');
          ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
        }
        else
        {
          ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name); 
        }
      });

    }

    ChangeUnit(){
      //((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_barcode_unit_price')?.patchValue(this.ItemForm.value.n_selling_price);
      var price=Number(this.ItemForm.value.n_selling_price);
      for (var i=0; i< this.unitsDetails.controls.length; i++)
      {
        var coff=(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_Coff')?.value>0) ? Number(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_Coff')?.value) : 0;
        ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_barcode_unit_price')?.patchValue(price*coff);
      }
    }

    copyInputMessage(inputElement){
      if(this.ItemForm.controls['s_item_id'].disabled)
      {
        this.ItemForm.get("s_item_id")?.enable();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.ItemForm.get("s_item_id")?.disable();
      }
      else
      {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
      }
    }

    searchName(value :any ){
      this._ItemsService.GetItemNames(this.ItemForm.value.s_item_name).subscribe(res=>{
        this.ItemsName=res; 
        this.ItemsName.filter(option => option.s_item_name.toLowerCase().indexOf(value));
      }); 
    }

    itemSetting=""; 
    CheckItemSetting(){
      this._ItemsService.CheckItemCodeType().subscribe(res=>{
        debugger;
        if(res.b_use_character_in_items==true && this.itemNo ==null )
          this.itemSetting="text";
        else
        {
          this.itemSetting="number";
        }
        
        if(res.b_use_item_serial==true && this.itemNo ==null )
        {
            this._ItemsService.GetItemCode('').subscribe(data=>{
            this.ItemForm.get('s_item_id')?.patchValue(data);
            this.ItemForm.get('s_item_id')?.disable();
          });
        }
        this.showspinner=false;
      }); 
    }

    GetCode(){
      this._ItemsService.CheckItemCodeType().subscribe(res=>{
        if(res.b_itemCode_by_group==true && this.itemNo ==null )
        {
          this._ItemsService.GetItemCode(this.ItemForm.value.s_GroupItem_no).subscribe(data=>{
            debugger;
            this.ItemForm.get('s_item_id')?.patchValue(data);
            this.ItemForm.get('s_item_id')?.disable();
          }, err => {
            if(this.itemNo ==null ){
              this.ItemForm.get('s_item_id')?.patchValue('');       
              this.ItemForm.get('s_item_id')?.enable();
            }
          });
        }
        else if(res.b_use_item_serial==true && this.itemNo ==null ){
          this._ItemsService.GetItemCode('').subscribe(data=>{
            debugger;
            this.ItemForm.get('s_item_id')?.patchValue(data);
            this.ItemForm.get('s_item_id')?.disable();
          },
           err => {
            if(this.itemNo ==null ){
              this.ItemForm.get('s_item_id')?.patchValue('');
              this.ItemForm.get('s_item_id')?.enable();
            }
          });
        }
      });
    }

    SetMainGroup()
    {
      debugger;
      if(this.ItemForm.value.n_itemcategory==1)
      {
        this.mainGroupType.push({s_main_item_id:this.ItemForm.value.s_item_id, s_GroupItem_name:this.ItemForm.value.s_item_id});
        this.filteredMainGroupServerSide.next(this.mainGroupType);
        this.ItemForm.get('s_main_item_id')?.patchValue(this.ItemForm.value.s_item_id);
      }
    }

    ChangeUnitNumber(i:number)
    {
      ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_ID')?.patchValue('');
      ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    }

    ChangeUnitStore(i:number)
    {
      ((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('n_Unit_ID')?.patchValue('');
      ((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    }

    ChangeStore(i:number)
    {
      ((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('n_store_id')?.patchValue('');
      ((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('s_store_name')?.patchValue('');
    }

  override ngOnInit(): void {
    this.showspinner=true;
    this.itemNo = this._activatedRoute.snapshot.paramMap.get('id');

    this.GetCategory();
    this.searchConfig('');
    this.searchGroup('');
    this.searchItemSupp('');
    this.searchItemType('');
    this.searchMainGroup('');
    this.searchMark('');
    this.GetOnEye();
    this.searchItemProdComp('');
    this.GetTaxTypes();
    //this.AddUnitsDetail();
    this.GetItemDefaultUnit('');
    this.GetItemsName();
    this.GetUnit();
    this.GetStores();

    this._ItemsService.LoadScConfiguration().subscribe((data) => {
      this.ItemForm.get('b_over_draft')?.patchValue(data.b_on_eye);
      this.ItemForm.get('n_on_eye_re')?.patchValue(data.n_on_eye_re);
    });

    if(this.itemNo !=null && this.itemNo > 0 ){
      this._ItemsService.GetItemById(this.itemNo).subscribe(data=>{
        debugger;
        this.ItemForm.get('s_item_id')?.disable();
        this.ItemForm.patchValue(data);
        this._LookupControlService.SetName(this.ItemForm, "sup", "n_related_supplier_id", "SupplierName");
        this.ChangeCategory(); 
        //this.SetMainGroup();
        
        var index:number=0;
        data.vuw_ItemUnitDetails.forEach( (res) => {
          this.unitsDetails.push(this.NewUnitsDetail(this.unitsDetails.length+1)); 
          if(index==0)
            ((this.ItemForm.get("unitsDetails") as FormArray).at(index) as FormGroup).get('n_default_id')?.disable();
          index++;
        }); 
        (this.ItemForm.get("unitsDetails") as FormArray)?.patchValue(data.vuw_ItemUnitDetails );   

        if(data.vuw_ItemStoreLimitDetails.length>0)
        {
          data.vuw_ItemStoreLimitDetails.forEach( (res) => {
            this.storesLimitDetails.push(this.NewStoreLimitDetail()); 
          }); 
          (this.ItemForm.get("storesLimitDetails") as FormArray)?.patchValue(data.vuw_ItemStoreLimitDetails );   
        }
        else
        {
          this._ItemsService.GetItemStores('').subscribe(data =>{
            data.forEach( (res) => {
              this.AddStoreLimitDetail(res.n_store_id, res.s_store_name);
            });
          });
        }

        data.vuw_ItemStoresUnitDetails.forEach( (res) => {
          this.storeUnitDetails.push(this.NewStoreUnitDetail(this.storeUnitDetails.length+1)); 
        }); 
        (this.ItemForm.get("storeUnitDetails") as FormArray)?.patchValue(data.vuw_ItemStoresUnitDetails );   

        ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_default_id')?.disable();
        ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_Unit_Coff')?.disable();
        ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_barcode_unit_price')?.disable();
        this.GetLastPrice(data.s_item_id);
        this.GetLastCost(data.s_item_id);
        this.showspinner=false;
      });

    }
    else
    {
      this.showspinner=true;
      this.ItemForm.get('n_itemcategory')?.patchValue(0);
      this.ItemForm.get('n_taxes_type')?.patchValue(1);
      this.CheckItemSetting();
      this.AddUnitsDetail();
      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_default_id')?.patchValue(0);
      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_default_id')?.disable();
      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_Unit_Coff')?.patchValue(1);
      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_Unit_Coff')?.disable();
      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_barcode_unit_price')?.disable();
      this._ItemsService.GetItemStores('').subscribe(data =>{
        data.forEach( (res) => {
          this.AddStoreLimitDetail(res.n_store_id, res.s_store_name);
        });
      });
    }
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }


  AddUnitsDetail() {
    this.unitsDetails.push(this.NewUnitsDetail(this.unitsDetails.length+1)); 
  }

  NewUnitsDetail(line:number=0): FormGroup {
    return this.fb.group({
      n_ID:line,
      n_default_id:'',
      n_Unit_ID:'',
      s_unit_name:'',
      n_Unit_Coff:'',
      n_weight_by_gram:'',
      s_Barcode:'',
      n_barcode_unit_price:'',
      b_is_cobon:false,
      b_not_part:false,
      s_unit_color:'',
      s_coff_color:'',
      s_default_color:''
    })
  }

  AddStoreLimitDetail(storeID:number=0, storeName:string='') {
    this.storesLimitDetails.push(this.NewStoreLimitDetail(storeID, storeName)); 
  }

  NewStoreLimitDetail(storeID:number=0, storeName:string=''): FormGroup {
    return this.fb.group({
      n_store_id: storeID,
      s_store_name: storeName,
      n_lower_limit:0,
      n_requested_limit:0,
      n_higher_limit:0,
      n_fair_limit:0,
      s_item_place:'',
      b_custody:false
    })
  }

  AddStoreUnitDetail() {
    this.storeUnitDetails.push(this.NewStoreUnitDetail(this.storeUnitDetails.length+1)); 
  }

  NewStoreUnitDetail(line:number=0): FormGroup {
    return this.fb.group({
      n_line_no:line,
      n_store_id:'',
      s_store_name:'',
      n_Unit_ID:'',
      s_unit_name:'',
      s_store_color:'',
      s_unit_color:''
    })
  }

  RemoveUnitDetail(i:number) {
    debugger;
    if(this.unitsDetails.length==1)
    {
      this._notification.ShowMessage('يجب ان تحتوى وحدات الصنف على سطر على الاقل',2);
      return;
    }
    else
    {
      this.unitsDetails.removeAt(i);
    }
  }

  RemoveStoreUnitDetail(i:number) {
    debugger;
    this.storeUnitDetails.removeAt(i);
  }

  _currentUnitsMeasure:number=0; 
  LoadUnitsMeasure(i:number){
   this._currentUnitsMeasure=i; 
   const dialogRef = this.dialog.open(UnitMeasurmentsComponent, {
     width: '700px',
     height:'600px',
     data: {    }
   });
   dialogRef.afterClosed().subscribe(res => {

     ((this.ItemForm.get("unitsDetails") as FormArray).at(this._currentUnitsMeasure) as FormGroup).get('n_Unit_ID')?.patchValue(res.data.n_unit_id);
     ((this.ItemForm.get("unitsDetails") as FormArray).at(this._currentUnitsMeasure) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);

    });

 }

 _currentStoreUnitsMeasure:number=0; 
 LoadStoreUnitsMeasure(i:number){
  this._currentStoreUnitsMeasure=i; 
  const dialogRef = this.dialog.open(UnitMeasurmentsComponent, {
    width: '700px',
    height:'600px',
    data: {    }
  });
  dialogRef.afterClosed().subscribe(res => {

    ((this.ItemForm.get("storeUnitDetails") as FormArray).at(this._currentStoreUnitsMeasure) as FormGroup).get('n_Unit_ID')?.patchValue(res.data.n_unit_id);
    ((this.ItemForm.get("storeUnitDetails") as FormArray).at(this._currentStoreUnitsMeasure) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);

   });
}

_currentStore:number=0; 
LoadStores(i:number){
 this._currentStore=i; 
 const dialogRef = this.dialog.open(StoresLookupComponent, {
   width: '700px',
   height:'600px',
   data: {    }
 });
 dialogRef.afterClosed().subscribe(res => {

   ((this.ItemForm.get("storeUnitDetails") as FormArray).at(this._currentStore) as FormGroup).get('n_store_id')?.patchValue(res.data.n_store_id);
   ((this.ItemForm.get("storeUnitDetails") as FormArray).at(this._currentStore) as FormGroup).get('s_store_name')?.patchValue(res.data.s_store_name);

  });

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

  invalidUnitNo:string='';
  invalidCoffNo:string='';
  invalidDefaultNo:string='';
  validateUnits():boolean{
    let i=0;
    let validrows : boolean=true;
    this.invalidUnitNo='';
    this.invalidCoffNo='';
    for (let c of this.unitsDetails.controls) {  
       if(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_ID')?.value=='' )
       {
         ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('s_unit_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidUnitNo+=(i+1)+" ";
       }
       if(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_Unit_Coff')?.value<=0)
       {
         ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('s_coff_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidCoffNo+=(i+1)+" ";
       }
       if(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_default_id')?.value =='' && i>0 || ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_default_id')?.value =='0' && i>0)
       {
         ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('s_default_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidDefaultNo+=(i+1)+" ";
       }
       i++;
    }
    return validrows;
  }

  invalidStoreNo:string='';
  invalidStoreUnitNo:string='';
  invalidLineNo:string='';
  validateStoreUnit():boolean{
    let i=0;
    let validrows : boolean=true;
    this.invalidStoreNo='';
    this.invalidStoreUnitNo='';
    for (let c of this.storeUnitDetails.controls) {  
       if(((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('n_store_id')?.value =='' )
       {
         ((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('s_store_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidStoreNo+=(i+1)+" ";
       }
       if(((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('n_Unit_ID')?.value =='' )
       {
         ((this.ItemForm.get("storeUnitDetails") as FormArray).at(i) as FormGroup).get('s_unit_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidStoreUnitNo+=(i+1)+" ";
       }
       i++;
    }
    return validrows;
  }

  // validateDefault():boolean{
  //   let i=0;
  //   let validrows : boolean=true;
  //   this.invalidLineNo='';
  //   for (let c of this.storeUnitDetails.controls) {  
  //      if(((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('n_default_id')?.value =='0' && i>0)
  //      {
  //        ((this.ItemForm.get("unitsDetails") as FormArray).at(i) as FormGroup).get('s_default_color')?.patchValue('bg-warning');
  //         validrows=false;
  //         this.invalidLineNo+=(i+1)+" ";
  //      }
  //      i++;
  //   }
  //   return validrows;
  // }


  save(){
    debugger;

    if(!this.validateUnits())
    {
      this.showspinner=false;
      if(this.isEnglish)
         this. _notification.ShowMessage('Please complete the data in line' + this.invalidUnitNo,3);
      else 
         this. _notification.ShowMessage('من فضلك اكمل ادخال البيانات فى السطر رقم ' + this.invalidUnitNo,3);
     
      return;
    } 

    if(!this.validateStoreUnit())
    {
      $("#pills-storeunits-tab").click();
      this.showspinner=false;
      if(this.isEnglish)
        this. _notification.ShowMessage('Please complete the data in line' + this.invalidUnitNo,3);
      else 
        this. _notification.ShowMessage('من فضلك اكمل ادخال البيانات فى السطر رقم ' + this.invalidUnitNo,3); 
      
      return;
    } 

    if(this.ItemForm.value.n_lowest_cost > this.ItemForm.value.n_selling_price)
    {
      this.showspinner=false;
      if(this.isEnglish)
           this. _notification.ShowMessage('the least price is more than the price' ,3);
      else 
           this. _notification.ShowMessage('اقل سعر للبيع اكبر من سعر البيع',3);
   
      return;
    } 

    

    this.showspinner=true;
    this.disableButtons();
      var formData: any = new FormData();

      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_default_id')?.enable();
      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_Unit_Coff')?.enable();
      ((this.ItemForm.get("unitsDetails") as FormArray).at(0) as FormGroup).get('n_barcode_unit_price')?.enable();
      this.ItemForm.get("s_item_id")?.enable();
      this.ItemForm.get("s_main_item_id")?.enable();
      this.ItemForm.get("n_last_p_price")?.enable();
      this.ItemForm.get("n_cost_price")?.enable();

      formData.append("n_Id", this.ItemForm.value.n_Id ?? 0);
      formData.append("n_itemcategory", this.ItemForm.value.n_itemcategory ?? 0);
      formData.append("s_main_item_id", this.ItemForm.value.s_main_item_id);
      formData.append("s_GroupItem_no", this.ItemForm.value.s_GroupItem_no);
      formData.append("s_item_id", this.ItemForm.value.s_item_id);
      formData.append("s_item_name", this.ItemForm.value.s_item_name);
      formData.append("s_item_name_eng", this.ItemForm.value.s_item_name_eng);
      formData.append("s_item_bar_code", this.ItemForm.value.s_item_bar_code);
      formData.append("s_item_bar_code_2", this.ItemForm.value.s_item_bar_code_2);
      formData.append("s_item_bar_code_3", this.ItemForm.value.s_item_bar_code_3);
      formData.append("s_item_bar_code_4", this.ItemForm.value.s_item_bar_code_4);
      formData.append("n_item_type_id", this.ItemForm.value.n_item_type_id ?? 0);
      formData.append("n_itemconfig", this.ItemForm.value.n_itemconfig ?? 0);
      formData.append("s_arabic_item_description", this.ItemForm.value.s_arabic_item_description);
      formData.append("s_english_item_description", this.ItemForm.value.s_english_item_description);
      formData.append("n_static_period", this.ItemForm.value.n_static_period ?? 0);
      formData.append("n_sales_percent", this.ItemForm.value.n_sales_percent ?? 0);
      formData.append("n_related_supplier_id", this.ItemForm.value.n_related_supplier_id ?? 0);
      formData.append("s_mark_id", this.ItemForm.value.s_mark_id);
      formData.append("s_old_item_id", this.ItemForm.value.s_old_item_id);
      formData.append("s_factory_code", this.ItemForm.value.s_factory_code);
      formData.append("n_selling_price", this.ItemForm.value.n_selling_price ?? 0);
      formData.append("n_lowest_cost", this.ItemForm.value.n_lowest_cost ?? 0);
      formData.append("n_Customer_Price", this.ItemForm.value.n_Customer_Price ?? 0);
      formData.append("n_last_p_price", this.ItemForm.value.n_last_p_price ?? 0);
      formData.append("n_manual_cost", this.ItemForm.value.n_manual_cost ?? 0);
      formData.append("n_cost_price", this.ItemForm.value.n_cost_price ?? 0);
      formData.append("n_profit_margin", this.ItemForm.value.n_profit_margin ?? 0);
      formData.append("n_keep_period", this.ItemForm.value.n_keep_period ?? 0);
      formData.append("n_wait_period", this.ItemForm.value.n_wait_period ?? 0);
      formData.append("s_itemNo", this.ItemForm.value.s_itemNo);
      formData.append("n_discount_ratio", this.ItemForm.value.n_discount_ratio ?? 0);
      formData.append("b_over_draft", this.ItemForm.value.b_over_draft);
      formData.append("b_stop", this.ItemForm.value.b_stop);
      formData.append("n_on_eye_re", this.ItemForm.value.n_on_eye_re ?? 0);
      formData.append("s_pics_path", this.ItemForm.value.s_pics_path);
      formData.append("b_is_grouped", this.ItemForm.value.b_is_grouped);
      formData.append("b_have_alternative_item", this.ItemForm.value.b_have_alternative_item);
      formData.append("b_has_Addon", this.ItemForm.value.b_has_Addon);
      formData.append("b_tax_deductible", this.ItemForm.value.b_tax_deductible);
      formData.append("b_not_return_invoice", this.ItemForm.value.b_not_return_invoice);
      formData.append("n_DataAreaID", this.ItemForm.value.n_DataAreaID ?? 0);
      formData.append("n_UserAdd", this.ItemForm.value.n_UserAdd ?? 0);
      formData.append("d_UserAddDate", this.ItemForm.value.d_UserAddDate);
      formData.append("n_taxes_type", this.ItemForm.value.n_taxes_type ?? 0);
      formData.append("n_VAT", this.ItemForm.value.n_VAT ?? 0);
      formData.append("n_selective_tax_type", this.ItemForm.value.n_selective_tax_type ?? 0);
      formData.append("n_selective_tax_percent", this.ItemForm.value.n_selective_tax_percent ?? 0);
      formData.append("s_international_classification_code", this.ItemForm.value.s_international_classification_code);
      formData.append("s_tax_authority_code", this.ItemForm.value.s_tax_authority_code);
      formData.append("n_item_comp_id", this.ItemForm.value.n_item_comp_id ?? 0);
      formData.append("n_weight", this.ItemForm.value.n_weight ?? 0);
      formData.append("n_Volume", this.ItemForm.value.n_Volume ?? 0);
      formData.append("n_Customs_ratio", this.ItemForm.value.n_Customs_ratio ?? 0);
      
      var input: any = document.getElementById('file');
      formData.append("files", input.files[0]);

      // var attachments: any = document.getElementById('attachments');
      // if(attachments != null){
      //   for (let i = 0; i < attachments.files.length; i++) {
      //     formData.append("attachments", attachments.files[i]);      
      //   }
      // }


      // if (this.ItemForm.value.s_pics_path != '' && this.ItemForm.value.s_pics_path != undefined) {
      //   var input: any = document.getElementById('s_pics_path');
      //   var file = input.files.length;
      //   if (input != null) {
      //       for (var i = 0; i < file; i++) {
      //           var file = input.files[i];
      //           formData.append("files", file);
      //       }
      //   }
      // }

      formData.append("sc_items_details.sc_Items_Details_UnitsLst", this.ItemForm.value.unitsDetails);
      for (var i = 0; i < this.ItemForm.value.unitsDetails.length;i++) 
      {
        formData.append("sc_Items_Details_UnitsLst[" + i + "].s_Item_ID", this.ItemForm.value.s_item_id);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].n_ID", this.ItemForm.value.unitsDetails[i].n_ID ?? 0);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].n_default_id", this.ItemForm.value.unitsDetails[i].n_default_id ?? 0);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].n_Unit_ID", this.ItemForm.value.unitsDetails[i].n_Unit_ID ?? 0);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].n_Unit_Coff", this.ItemForm.value.unitsDetails[i].n_Unit_Coff ?? 0);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].n_weight_by_gram", this.ItemForm.value.unitsDetails[i].n_weight_by_gram ?? 0);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].s_Barcode", this.ItemForm.value.unitsDetails[i].s_Barcode);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].n_barcode_unit_price", this.ItemForm.value.unitsDetails[i].n_barcode_unit_price ?? 0);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].b_is_cobon", this.ItemForm.value.unitsDetails[i].b_is_cobon);
        formData.append("sc_Items_Details_UnitsLst[" + i + "].b_not_part", this.ItemForm.value.unitsDetails[i].b_not_part);

      }

      formData.append("sc_items_details.sc_items_storesLst", this.ItemForm.value.storesLimitDetails);
      for (var i = 0; i < this.ItemForm.value.storesLimitDetails.length;i++) 
      {
        formData.append("sc_items_storesLst[" + i + "].s_item_id", this.ItemForm.value.s_item_id);
        formData.append("sc_items_storesLst[" + i + "].n_store_id", this.ItemForm.value.storesLimitDetails[i].n_store_id ?? 0);
        formData.append("sc_items_storesLst[" + i + "].s_store_name", this.ItemForm.value.storesLimitDetails[i].s_store_name);
        formData.append("sc_items_storesLst[" + i + "].n_lower_limit", this.ItemForm.value.storesLimitDetails[i].n_lower_limit ?? 0);
        formData.append("sc_items_storesLst[" + i + "].n_requested_limit", this.ItemForm.value.storesLimitDetails[i].n_requested_limit ?? 0);
        formData.append("sc_items_storesLst[" + i + "].n_higher_limit", this.ItemForm.value.storesLimitDetails[i].n_higher_limit ?? 0);
        formData.append("sc_items_storesLst[" + i + "].n_fair_limit", this.ItemForm.value.storesLimitDetails[i].n_fair_limit ?? 0);
        formData.append("sc_items_storesLst[" + i + "].s_item_place", this.ItemForm.value.storesLimitDetails[i].s_item_place);
        formData.append("sc_items_storesLst[" + i + "].b_custody", this.ItemForm.value.storesLimitDetails[i].b_custody);
      }

      formData.append("sc_items_details.sc_item_stores_unitsLst", this.ItemForm.value.storeUnitDetails);
      for (var i = 0; i < this.ItemForm.value.storeUnitDetails.length;i++) 
      {
        formData.append("sc_item_stores_unitsLst[" + i + "].s_item_id", this.ItemForm.value.s_item_id);
        formData.append("sc_item_stores_unitsLst[" + i + "].n_store_id", this.ItemForm.value.storeUnitDetails[i].n_store_id ?? 0);
        formData.append("sc_item_stores_unitsLst[" + i + "].s_store_name", this.ItemForm.value.storeUnitDetails[i].s_store_name);
        formData.append("sc_item_stores_unitsLst[" + i + "].n_Unit_ID", this.ItemForm.value.storeUnitDetails[i].n_Unit_ID ?? 0);
        formData.append("sc_item_stores_unitsLst[" + i + "].s_unit_name", this.ItemForm.value.storeUnitDetails[i].s_unit_name);
      }

      if(this.itemNo !=null && this.itemNo > 0 ){

        this._ItemsService.SaveEditItem(formData).subscribe(data=>{
          debugger;
          this.showspinner=false;
          this.enableButtons();
          if(this.isEnglish)
            this._notification.ShowMessage(data.Emsg,data.status);
          else
            this._notification.ShowMessage(data.msg,data.status);    
          if(data.status==1){      
            this._router.navigate(['/sc/itemslist']);
          }
        });
      }
      else
      {
        this._ItemsService.SaveItem(formData).subscribe(data=>{
        debugger;
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
          this._notification.ShowMessage(data.Emsg,data.status);
        else
          this._notification.ShowMessage(data.msg,data.status);
        if(data.status==1){    
          this._router.navigate(['/sc/itemslist']);
        }
    });
  }

  }




}
