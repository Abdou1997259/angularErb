import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';

import { StocktackingService } from 'src/app/Core/Api/SC/stocktacking.service';
import { ItemsLookUpComponent } from 'src/app/Controls/items-look-up/items-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

declare var $: any;
@Component({
  selector: 'app-stocktaking',
  templateUrl: './stocktaking.component.html',
  styleUrls: ['./stocktaking.component.css']
})
export class StocktakingComponent extends BaseComponent implements OnInit   {
  @ViewChild('closebutton1') closebutton1;
  @ViewChild('closebutton2') closebutton2;

  dtOptions: DataTables.Settings = {};
  StoreTakingForm!: FormGroup;
  form: any;
  isEnglish:boolean=false;
  myDatepipe!: any;
  DocNo:any;
  showspinner:boolean=false;
  showLoadspinner:boolean=false;
  invalidColor='';
  isPosted:boolean=false;
  negtiveDoc:number=0;
  postiveDoc:number=0;

  constructor(private fb:FormBuilder
    ,private _StocktackingService : StocktackingService
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private userservice:UserService) {
      super(_route.data,userservice);

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers', 
        pageLength: 2, 
        processing: true
  
      };

      this.StoreTakingForm = this.fb.group({
        n_document_no: '',
        s_book_doc_no: '',
        d_stock_tacking_date:new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_stock_tacking_currency_id: new FormControl('', Validators.required),
        n_currency_coff: '',
        n_store_id: new FormControl('', Validators.required),
        s_transaction_description: '',
        s_transaction_description_eng: '',
        s_cost_center_id: '',
        s_cost_center_id2: '',
        s_GroupItem_no: '',
        s_to_GroupItem_no: '',
        n_item_type_id: '',
        s_location: '',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',
        storeDetails: this.fb.array([] , Validators.required)
      });

  }


  bisMainCurrency=false;
  mainCurrency:number=0;

  CurrencyData:any=[];
  StoreData:any=[];
  CostData:any=[];
  Cost2Data:any=[];
  UnitsData:any=[];
  FromData:any=[];
  ToData:any=[];
  TypeData:any=[];
  filteredStoreServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredFromServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredToServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredTypeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchingStore:boolean=false;
  searchingCost:boolean=false;
  searchingCost2:boolean=false;
  searchingFrom:boolean=false;
  searchingTo:boolean=false;
  searchingType:boolean=false;

  get storeDetails() : FormArray {
    return this.StoreTakingForm.get("storeDetails") as FormArray
  }

  RemoveDetail(i:number) {
    debugger;
    this.storeDetails.removeAt(i);
  }

  AddDetail() {
    this.storeDetails.push(this.NewDetail(this.storeDetails.length+1)); 
  }

  NewDetail(line:number=0): FormGroup {
    return this.fb.group({
      n_serial_no:line,
      s_item_id:'',
      s_item_name:'',
      n_unit_id:'',
      s_unit_name:'',
      n_current_qty:0,
      n_actual_count:'',
      n_counting_qty:'',
      n_diff:'',
      n_stock_tacking_unit_price:'',
      s_cost_center_id:'',
      s_cost_center_name:'',
      s_cost_center_id2:'',
      s_cost_center_name2:'',
      s_GroupItem_no:'',
      s_GroupItem_name:'',
      s_item_color:'',
      s_unit_color:''
    })
  }

  
  override ngOnInit(): void {
    debugger;
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.getCurrencies();
    this.searchCost('');
    this.searchCost2('');
    this.searchStore('');
    this.searchFrom('');
    this.searchTo('');
    this.searchType('');

    if(this.DocNo !=null && this.DocNo > 0 ){
      this.showspinner=true;
      this.showLoadspinner=true;
      this._StocktackingService.GetByID(this.DocNo).subscribe(data=>{

        this._StocktackingService.CheckIsPosted(this.DocNo).subscribe(res=>{
          this.isPosted=res.isPosted;
          this.negtiveDoc=res.n_negative;
          this.postiveDoc=res.n_positive;
        });

        data.sc_stock_tacking_detailsLst.forEach( (res) => {
          this.AddDetail();
        });
        this.StoreTakingForm.patchValue(data);
        this.StoreTakingForm.get("d_stock_tacking_date")?.patchValue(new Date(Number(data.d_stock_tacking_date.substring(0,4)), Number(data.d_stock_tacking_date.substring(5,7))-1, Number(data.d_stock_tacking_date.substring(8,10))));
        (this.StoreTakingForm.get("storeDetails") as FormArray)?.patchValue(data.sc_stock_tacking_detailsLst);

        this._StocktackingService.GetMainCurrency().subscribe(res=>{
          if(res != data.n_stock_tacking_currency_id)
            this.bisMainCurrency=true;
        });

        this.calcTotals();
        this.showspinner=false;
        this.showLoadspinner=false;
      });

    }
    else
    {
      this.setMainCurrency();
      this.AddDetail();
    }
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();

  
    
    this.isEnglish=LangSwitcher.CheckLan()


  }

  setMainCurrency(){
    this._StocktackingService.GetMainCurrency().subscribe(res=>{
      this.StoreTakingForm.get('n_stock_tacking_currency_id')?.patchValue(res);
      this.mainCurrency=res;
    });
  }

  getCurrencies(){
    this._StocktackingService.GetCurrencies().subscribe(res=>{
      this.CurrencyData=res;
    });
  }

  searchStore(value :any){
    this.searchingStore=true;
    this._StocktackingService.GetStores(value).subscribe(res=>{
      this.StoreData=res;
      this.filteredStoreServerSide.next(this.StoreData.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.searchingStore=false;
    });
  }

  searchCost(value :any){
    this.searchingCost=true;
    this._StocktackingService.GetCostCenters(value).subscribe(res=>{
      this.CostData=res;
      this.filteredCostCenterServerSide.next(  this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost=false;
    });
  }

  searchCost2(value :any){
    this.searchingCost2=true;
    this._StocktackingService.GetCostCenters(value).subscribe(res=>{
      this.Cost2Data=res;
      this.filteredCostCenter2ServerSide.next(  this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost2=false;
    });
  }

  
  searchFrom(value :any){
    this.searchingFrom=true;
    this._StocktackingService.GetGroups(value).subscribe(res=>{
      this.FromData=res;
      this.filteredFromServerSide.next(  this.FromData.filter(x => x.s_GroupItem_name.toLowerCase().indexOf(value) > -1));
      this.searchingFrom=false;
    });
  }

  searchTo(value :any){
    this.searchingTo=true;
    this._StocktackingService.GetGroups(value).subscribe(res=>{
      this.ToData=res;
      this.filteredToServerSide.next(  this.ToData.filter(x => x.s_GroupItem_name.toLowerCase().indexOf(value) > -1));
      this.searchingTo=false;
    });
  }

  searchType(value :any){
    this.searchingType=true;
    this._StocktackingService.GetItemTypes(value).subscribe(res=>{
      this.TypeData=res;
      this.filteredTypeServerSide.next(  this.TypeData.filter(x => x.s_item_type_name.toLowerCase().indexOf(value) > -1));
      this.searchingType=false;
    });
  }

  CheckIsMain(){
    if(this.StoreTakingForm.get('n_stock_tacking_currency_id')?.value ==this.mainCurrency)
    {
      this.bisMainCurrency=false;
      this.StoreTakingForm.get('n_currency_coff')?.patchValue(1);
    }
    else
    {
      this.StoreTakingForm.get('n_currency_coff')?.patchValue('');
      this.bisMainCurrency=true;
    }
  }

  LoadItems(i:number){
     const dialogRef = this.dialog.open(ItemsLookUpComponent, {
       width: '700px',
       height:'600px',
       data: {    }
     });

     dialogRef.afterClosed().subscribe(res => {
       ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
       ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
       this.getSelectedUnit(res.data.s_item_id);
      });
  }

  resetUnit(i:number){
    ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
  }

  
  getSelectedUnit(item :any){
    this._StocktackingService.GetUnits(item).subscribe(data=>{
      this.UnitsData =  data;
    });
  }

  
  ChangeItem(i:number)
  {

    var itemNo=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;

    this._StocktackingService.GetItemName(itemNo).subscribe(res=>{
      if(res==null)
      {
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
      }
      else
      {
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.name);  
      }
      this.resetUnit(i);
    });
    this.getUnit(i);
  }

  getUnit(i :number){
    var item=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._StocktackingService.GetUnits(item).subscribe(data=>{
      this.UnitsData =  data;
    });
  }

  LoadUnits(i:number){
    let itemID=  ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {'itemId': itemID}
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
      ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
      this.getSelectedUnit(res.data.s_item_id);
     });
  }

  ChangeUnit(i:number)
  {
    var itemNo=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    var unitNo=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;

    this._StocktackingService.GetUnitName(itemNo,unitNo).subscribe(res=>{
      if(res==null)
      {
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
      else
      {
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name); 
      }
    });
  }

  LoadCostCenter1(i:number)
  { 
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost1(i:number)
  {
    var costNo=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;

    this._StocktackingService.GetCostName(costNo).subscribe(res=>{
      if(res==null)
      {
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
      }
      else
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.name); 
    });
  }

  LoadCostCenter2(i:number){
  
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
      ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost2(i:number)
  {
    var costNo=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;

    this._StocktackingService.GetCostName(costNo).subscribe(res=>{
      if(res==null)
      {
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
      }
      else
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.name); 
    });
  }

  calcDiff(i:number)
  {
    var itemBalance=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_current_qty')?.value;
    var actualBalance=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_counting_qty')?.value;
    var diff =Number(itemBalance-actualBalance);
    ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_diff')?.patchValue(diff);
    this.calcTotals();
  }

  calcTotals()
  {
    var countN=0, countP=0, totalN=0, totalP=0;
    for (let i = 0; i < this.storeDetails.controls.length; i++) {
      var total=Number(((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_current_qty')?.value)-Number(((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_counting_qty')?.value);
      if(total>0)
      {
        countN++;
        totalN+=total;
      }
      else if(total<0)
      {
        countP++;
        totalP+=total;
      }
    }
    $('#n_negative_count').val(countN);
    $('#n_positive_count').val(countP);
    $('#n_negative_total').val(totalN);
    $('#n_positive_total').val(totalP);
  }

  LoadStoreItems()
  {
    var store=this.StoreTakingForm.get("n_store_id")?.value;
    var date=new DatePipe('en-US').transform(this.StoreTakingForm.value.d_stock_tacking_date, 'yyyy/MM/dd');
    if(store=='')
    {

      if(!this.isEnglish)
      this._notification.ShowMessage('اختر مخزن من فضلك',3);
     else 
     this._notification.ShowMessage('Please insert store number',3);
      return;
    }
    if(date=='')
    {
      
      if(!this.isEnglish)
      this._notification.ShowMessage('ادخل تاريخ الجرد من فضلك',3);
     else 
     this._notification.ShowMessage('Please insert date number',3);
      return;
    }
    this.storeDetails.clear();
    this.showLoadspinner=true;
    this._StocktackingService.LoadItems(store,date).subscribe(data=>{
      data.forEach( (data) => {
        this.AddDetail();
      });
      (this.StoreTakingForm.get("storeDetails") as FormArray)?.patchValue(data);
      this.showLoadspinner=false;
    });
  }

  ReloadItems()
  {
    var store=this.StoreTakingForm.get("n_store_id")?.value;
    var date=new DatePipe('en-US').transform(this.StoreTakingForm.value.d_stock_tacking_date, 'yyyy/MM/dd');
    if(store=='')
    {
 
      if(this.isEnglish)
      this._notification.ShowMessage('اختر مخزن من فضلك',3);
    else
    this._notification.ShowMessage('Please insert store',3);
      return;
    }
    if(date=='')
    {
      if(this.isEnglish)
      this._notification.ShowMessage('ادخل تاريخ الجرد من فضلك',3);
    else
    this._notification.ShowMessage('Please date ',3);
  
      return;
    }
    this.showLoadspinner=true;
    this._StocktackingService.LoadItems(store,date).subscribe(data=>{
      data.forEach( (data) => {
        debugger;
        for (let i = 0; i < this.storeDetails.controls.length; i++) {
          var item=((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
          if(data.s_item_id==item){
            ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_current_qty')?.patchValue(data.n_current_qty);
            ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_stock_tacking_unit_price')?.patchValue(data.n_stock_tacking_unit_price);
            this.calcDiff(i);
            break;
          }
        }
      });
      this.showLoadspinner=false;
    });
  }

  invalidRowNo:string='';
  validateDetails():boolean{
    let i=0;
    let validrows : boolean=true;
    this.invalidRowNo='';
    for (let c of this.storeDetails.controls) {  
       if(((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value=='' )
       {
         ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidRowNo+=(i+1)+" ";
       }
       if(((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value=='' )
       {
         ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_unit_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidRowNo+=(i+1)+" ";
       }
       i++;
    }
    return validrows;
  }

  save(){
    debugger;
    this.disableButtons();
    if(!this.validateDetails())
    {
      this.showspinner=false;
    if(!this.isEnglish)
    this. _notification.ShowMessage('من فضلك اكمل ادخال البيانات فى السطر رقم ' + this.invalidRowNo,3);
  else
  this. _notification.ShowMessage('Please insert complete info in line ' + this.invalidRowNo,3);
      
      this.enableButtons();
      return;
    } 

      this.showspinner=true;
      var formData: any = new FormData();
      this.StoreTakingForm.controls['n_document_no'].enable();
      this.StoreTakingForm.value.d_stock_tacking_date=new DatePipe('en-US').transform(this.StoreTakingForm.value.d_stock_tacking_date, 'yyyy/MM/dd');
      formData.append("n_document_no", this.StoreTakingForm.value.n_document_no ?? 0);
      formData.append("d_stock_tacking_date", this.StoreTakingForm.value.d_stock_tacking_date);
      formData.append("s_book_doc_no", this.StoreTakingForm.value.s_book_doc_no);
      formData.append("n_stock_tacking_currency_id", this.StoreTakingForm.value.n_stock_tacking_currency_id ?? 0);
      formData.append("n_currency_coff", this.StoreTakingForm.value.n_currency_coff ?? 0);
      formData.append("n_store_id", this.StoreTakingForm.value.n_store_id ?? 0);
      formData.append("s_transaction_description", this.StoreTakingForm.value.s_transaction_description);
      formData.append("s_transaction_description_eng", this.StoreTakingForm.value.s_transaction_description_eng);
      formData.append("s_cost_center_id", this.StoreTakingForm.value.s_cost_center_id);
      formData.append("s_cost_center_id2", this.StoreTakingForm.value.s_cost_center_id2);
      formData.append("s_GroupItem_no", this.StoreTakingForm.value.s_GroupItem_no);
      formData.append("s_to_GroupItem_no", this.StoreTakingForm.value.s_to_GroupItem_no);
      formData.append("n_item_type_id", this.StoreTakingForm.value.n_item_type_id ?? 0);
      formData.append("n_DataAreaID", this.StoreTakingForm.value.n_DataAreaID ?? 0);
      formData.append("n_UserAdd", this.StoreTakingForm.value.n_UserAdd ?? 0);
      formData.append("d_UserAddDate", this.StoreTakingForm.value.d_UserAddDate);

      formData.append("sc_stock_taking.sc_stock_tacking_detailsLst", this.StoreTakingForm.value.storeDetails);
      for (var i = 0; i < this.StoreTakingForm.value.storeDetails.length;i++) 
      {
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_current_qty')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_counting_qty')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_diff')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('n_stock_tacking_unit_price')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.enable();
        ((this.StoreTakingForm.get("storeDetails") as FormArray).at(i) as FormGroup).get('s_GroupItem_no')?.enable();

        formData.append("sc_stock_tacking_detailsLst[" + i + "].s_item_id", this.StoreTakingForm.value.storeDetails[i].s_item_id);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].n_unit_id", this.StoreTakingForm.value.storeDetails[i].n_unit_id ?? 0);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].n_current_qty", this.StoreTakingForm.value.storeDetails[i].n_current_qty ?? 0);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].n_counting_qty", this.StoreTakingForm.value.storeDetails[i].n_counting_qty ?? 0);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].n_diff", this.StoreTakingForm.value.storeDetails[i].n_diff ?? 0);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].n_stock_tacking_unit_price", this.StoreTakingForm.value.storeDetails[i].n_stock_tacking_unit_price ?? 0);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].s_cost_center_id", this.StoreTakingForm.value.storeDetails[i].s_cost_center_id);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].s_cost_center_id2", this.StoreTakingForm.value.storeDetails[i].s_cost_center_id2);
        formData.append("sc_stock_tacking_detailsLst[" + i + "].s_GroupItem_no", this.StoreTakingForm.value.storeDetails[i].s_GroupItem_no);

      }


      if(this.DocNo !=null && this.DocNo > 0 ){

        this._StocktackingService.SaveEdit(formData).subscribe(data=>{
          debugger;
          this.showspinner=false;
          this.enableButtons();
          if(this.isEnglish)
          this. _notification.ShowMessage(data.Emsg,data.status);
          else
          this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){      
            this._router.navigate(['/sc/stocktakinglist']);
          }
        });
      }
      else
      {
        this._StocktackingService.Save(formData).subscribe(data=>{
        debugger;
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){    
          this._router.navigate(['/sc/stocktakinglist']);
        }
    });
  }

  }

  Post(){
    this.showspinner=true;
    $('#btnPost').prop('disabled', true);
    $('#btnPostSave').prop('disabled', true);
    this._StocktackingService.Post(this.DocNo).subscribe(data=>{
      debugger;
      this.showspinner=false;
      $('#btnPost').prop('disabled', false);
      $('#btnPostSave').prop('disabled', false);
      if(data.isPosted==true){  
   
        if(!this.isEnglish)
        this._notification.ShowMessage('تم التسوية بنجاح',1);
      else
      this. _notification.ShowMessage(`done successfully`,1);
        this.closebutton1.nativeElement.click();
        this.isPosted=true;  
        this.postiveDoc=data.n_positive;
        this.negtiveDoc=data.n_negative;
      }
      else
      {
        if(!this.isEnglish)
        this._notification.ShowMessage('حدثت مشكلة فى التسوية',3);
      else
      this. _notification.ShowMessage(`Something went wrong`,3);
   
      }
    });
  }

  UnPost(){
    this.showspinner=true;
    $('#btnUnPost').prop('disabled', true);
    $('#btnUnPostSave').prop('disabled', true);
    this._StocktackingService.UnPost(this.DocNo).subscribe(data=>{
      this.showspinner=false;
      $('#btnUnPost').prop('disabled', false);
      $('#btnUnPostSave').prop('disabled', false);
      this._notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton2.nativeElement.click();
        this.isPosted=false;  
      }
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


}
