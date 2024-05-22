import { DatePipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme } from '@fullcalendar/core';
import { extend } from 'jquery';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';



import { id } from '@swimlane/ngx-charts';
import { StoreService } from 'src/app/Core/Api/SC/store.service';

import 'moment/locale/pt-br';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { ItemGeneralPopupComponent } from 'src/app/Controls/item-general-popup/item-general-popup.component';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { GeneralSC } from 'src/app/Core/Api/SC/genereal-sc.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';


@Component({
  selector: 'app-add-intial-balance',
  templateUrl: './add-intial-balance.component.html',
  styleUrls: ['./add-intial-balance.component.css']
})
export class AddIntialBalanceComponent  extends BaseComponent  implements OnInit ,AfterViewChecked{


  
/////////////////////////////////////////////////////////
  // start contructor
  constructor(
     private fb:FormBuilder
    ,private _initialBalanceService:IntialBalnceService
    ,public dialog: MatDialog,
    private _stockOutToStock:StockOutToStock
    ,private _notification: NotificationServiceService
    ,private _router : Router,
     private _lookUp:GenerealLookup,
     private storeService:StoreService
    ,private _routeActive : ActivatedRoute,
    private generalSC:GeneralSC
    ,private userservice:UserService) {
      super(_routeActive.data,userservice);

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers',
        pageLength: 2,
        processing: true

      };

   
    }

  //end construtor
///////////////////////////////////////////////////

///////////////////////////////////////////////////
  // START VARIABLES DELCLERATION
  filteredStoresServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCurrencyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;
  date;
  ID:any
  DataAreaNo: any;
  Edit:boolean=false;
  visble:boolean=false
  Add:boolean=true;
  isUnitExist: boolean[] = [];
  showspinner:boolean=false;
  multiStore:boolean=false
  searchingStrore:boolean=false;
  searchingCurrency:boolean=false
  stores:any=[];
  ItemisEsixt:boolean=false;
  unitExist:boolean=true;
  currencyType!: any [];
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
  isYearExisted:boolean=false;
  @ViewChild("document_no") documentInput!:ElementRef;
  isThereStock: boolean = false;
  enableUnits:boolean=true;
  intialBalanceForm!: FormGroup;
  isEnglish:boolean=false
  get sc_initial_balance_details_Lst():FormArray
  {
    return this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray

  }

  // END VARIABLES DELCLERATION
 //////////////////////////////////////////////////////////////





 //////////////////////////////////////////////////////////////
  // START HOOKS METHODS 
  override ngOnInit(): void {
  
    LangSwitcher.translateData(0);
    LangSwitcher.translatefun();
   this.isEnglish=LangSwitcher.CheckLan();
    this.intialBalanceForm = this.fb.group({
      n_document_no: [''],
      d_initial_balance_date:[(new Date()).toISOString().substring(0,10),Validators.required],
      n_initial_balance_total_qty: ['',Validators.required],
      n_total_value: '',
      n_currency_id:'',
      n_intial_balance_currency_id:'',
      s_arabic_transaction_description:'',
      s_english_transaction_description: '',

      n_store_id: ['',Validators.required],
      s_store_name: '',
      b_using_multi_store:'',
      n_DataAreaID:'',
      n_UserAdd:'',
      d_UserAddDate:'',
      n_current_branch:'',
      n_current_company:'',
      n_current_year:'',
      sc_initial_balance_details_Lst: this.fb.array([])
    });

   this._stockOutToStock.GetLocalCurrencie().subscribe((val) => {
   
   this.localCurrency = val.n_currency_id;
   this.localCurencyName=val.s_currency_name;

  ( this.selectserver.selectForm.get("n_intial_balance_currency_id")?.patchValue(val.n_currency_id));
  ( this.selectserver.selectForm.get("s_currency_name")?.patchValue(val.s_currency_name));

 
 })





this._initialBalanceService.getItems().subscribe((res)=>{
  this.items=res;
})
 this.searchStores('');
   
 this.searchingCurrencies('');
 this.searchingStrore=true;  

  // this.generalSC.GetLastCost('1109',this.intialBalanceForm.get("d_initial_balance_date")?.value,1).subscribe((data)=>{
  //   console.log('mohamed is '+data);
   
  // });
console.log(this.intialBalanceForm.get("n_store_id")?.value)



   this.ID=this._routeActive.snapshot.paramMap.get("id");

    
   if(this.ID != null && this. ID > 0)
   {


                this._initialBalanceService.getById(this.ID).subscribe((data)=>
                {
                  debugger
                  this.visble=true;
                  this.documentInput.nativeElement.style.display="block";
                  this.intialBalanceForm.get("n_DataAreaID")?.patchValue(data["n_DataAreaID"]);
                  this.DataAreaNo = data["n_DataAreaID"];
                  this.intialBalanceForm.patchValue({n_document_no: data["n_document_no"]});
                  this.intialBalanceForm.get("n_UserAdd")?.patchValue(data["n_UserAdd"])
                  this.intialBalanceForm.get("n_UserUpdate")?.patchValue(data["n_UserUpdate"])
                  this.intialBalanceForm.get("d_UserUpdateDate")?.patchValue(data["d_UserUpdateDate"])
                  this.intialBalanceForm.get("d_UserAddDate")?.patchValue(data["d_UserAddDate"])
                  this.intialBalanceForm.get("d_initial_balance_date")?.patchValue(new Date(Number(data.d_initial_balance_date.substring(0,4)), Number(data.d_initial_balance_date.substring(5,7))-1, Number(data.d_initial_balance_date.substring(8,10))));
                  this.intialBalanceForm.get("n_initial_balance_total_qty")?.patchValue(data["n_initial_balance_total_qty"]);
                  this.intialBalanceForm.get("n_total_value")?.patchValue(data["n_total_value"]);
                  this.intialBalanceForm.get("n_intial_balance_currency_id")?.patchValue(data["n_intial_balance_currency_id"]);
                  this.intialBalanceForm.get("s_arabic_transaction_description")?.patchValue(data["s_arabic_transaction_description"]);
                  this.intialBalanceForm.get("s_english_transaction_description")?.patchValue(data["s_english_transaction_description"])
                  this.intialBalanceForm.get("n_store_id")?.patchValue(data["n_store_id"])
                 
                  this.intialBalanceForm.get("s_store_name")?.patchValue(data["s_store_name"])
                  this.intialBalanceForm.get("b_using_multi_store")?.patchValue(data["b_using_multi_store"]);
                  data.sc_initial_balance_details_Lst.forEach(data => {
                 
                    this.sc_initial_balance_details_Lst.push(this.newItemssdetailsWithData(data.nLineNo,data.s_item_id,data.s_item_name,data.n_unit_id,data.s_unit_name,data.n_store_id,data.s_store_name
                      ,data.n_qty,data.n_unit_price,data.n_item_value,data.n_qty_main_unit

                      ));
                  })

                this.Add=false;
                this.Edit=true;
    })
   }
   else{
     this.addItemsDetails();
     this.visble=false;

    //  let year:string= localStorage.getItem("year") as string;
    // this.generalSC.YearExisted(year).subscribe((data)=>{
    
    //  this.isYearExisted=data;
     
    // })
 
   }



    this.intialBalanceForm.get("d_initial_balance_date")?.patchValue(new Date())
   console.log(this.intialBalanceForm);
  }
  //END HOOKS METHODS

/////////////////////////////////////////////


















/////////////////////////////////////////////////////////////////
//START FUNCTIONS

  getUnitsFromApi(){
    debugger
    let value = ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get("s_item_id")?.value;

      setTimeout(() => {
        this._initialBalanceService.getUnitForItems(value).subscribe((ele)=>{
          this.units=ele



        })


          }
      , 500);




  }

  searchingCurrencies(value:any)
  {
   this.searchingCurrency=true;
   this._initialBalanceService.GetCurrencies().subscribe(res=>{
     this.currencyType=res;
     this.filteredCurrencyServerSide.next(  this.currencyType.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
     this.searchingCurrency=false;
   })
  }
  




  onCurrencuSelection($event)
  {
    debugger
    if(this.selectserver.selectForm.value.n_intial_balance_currency_id===this.localCurrency)
    {
      this.isLocalcurrency=false

    }
    else
    this.isLocalcurrency=true
  }
  searchStores(value:any)
  {

   this.searchingStrore=true;
   this._initialBalanceService.getStores().subscribe(data=>{
     this.stores=data;
     debugger
     this.filteredStoresServerSide.next(this.stores.filter(x=>x.s_store_name.toLowerCase().indexOf(value)>-1));
     this.searchingStrore=false
   })
  }
  _currentAccountIndex:number=0

  loadItems(i:number){


   
    
    this._currentAccountIndex=i;
    const dialogRef = this.dialog.open(ItemGeneralPopupComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
  dialogRef.afterClosed().subscribe(res => {

    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue('');
      this.getUnitsFromApi();
     });
     let checkItem=((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.value;
     this.getUnitByItemId(checkItem);
     if( checkItem!==null||checkItem!=='')
     {
      this.ItemisEsixt=true;

     }

        //this.calctotal();


  }



  ChangeItems(i:number)
  {
    debugger
    this._currentAccountIndex=i;
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.patchValue('');
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.patchValue('');
  }
  loadUnits(i:number,itemID:any){
    debugger
    // $('#ItemModal').modal('toggle');
  
    this._currentAccountIndex=i;
    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: { 'itemId': itemID   }
    });
  dialogRef.afterClosed().subscribe(res => {
   
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);






     });

        //this.calctotal();


  }
  ChangeUnits(i:number)
  {
    this._currentAccountIndex=i;
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue('');
  }


  newItemssdetails(line:number=0): FormGroup {

    return this.fb.group({
      nLineNo:line,
      s_item_id:[''],
      s_item_name:[''],
      n_unit_id:[''],
      s_unit_name:'',
      n_store_id:'',
      s_store_name:'',
      n_qty:[''],
      n_unit_price:[''],
      n_item_value:'',
      n_qty_main_unit:'',

    })
 }
 newItemssdetailsWithData(line_p,s_item_id_p,s_item_name_p,n_unit_id_p,s_unit_name_p,n_store_id_p,s_store_name_p,n_qty_p,n_unit_price_p,n_item_value_p,n_qty_main_unit_p): FormGroup {

  return this.fb.group({


    nLineNo:line_p,
    s_item_id:[s_item_id_p],
    s_item_name:[s_item_name_p],
    n_unit_id:[n_unit_id_p],
    s_unit_name:s_unit_name_p ,
    n_store_id:n_store_id_p,
    s_store_name:s_store_name_p,
    n_qty:[n_qty_p],
    n_unit_price:[n_unit_price_p],
    n_item_value:n_item_value_p,
    n_qty_main_unit:n_qty_main_unit_p,

  })
}

  addItemsDetails() {
    this.sc_initial_balance_details_Lst.push(this.newItemssdetails(this.sc_initial_balance_details_Lst.length+1));
  }
removeItems(i:number)
{
  this.getTotal(i,true);
  this.sc_initial_balance_details_Lst.removeAt(i);

}
makeMulti()
{
  this.multiStore=!this.multiStore
}


getTotal(i:number,fromDelte:boolean)
{
  let pricControl:number=0;
  let qtyControl:number=0
  let result:number=0
  let accumlatedQty:number=0;
  let itemIDVal:number=0;
  let unitIDVal:number=0;
  let accumlatedPrice:number=0;
  this._currentAccountIndex=i;

  itemIDVal=Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.value)
  unitIDVal=Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.value)
  pricControl= Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
  qtyControl=Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)

  if(fromDelte==false)
  {
    pricControl= Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
    qtyControl=Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)
    if(unitIDVal!=0 && itemIDVal!=0  )
  {

          result=pricControl*qtyControl;
        ((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_item_value')?.patchValue(result);
        ((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty_main_unit')?.patchValue(qtyControl);


        for( let item of (this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray ).controls)
        {

          accumlatedQty+=Number(item.get('n_qty')?.value)
          accumlatedPrice+=Number(item.get('n_item_value')?.value);

        }

        this.intialBalanceForm.get('n_initial_balance_total_qty')?.patchValue(accumlatedQty);
        this.intialBalanceForm.get('n_total_value')?.patchValue(accumlatedPrice);


      }


  }
  if(fromDelte==true)
  {
    let total!: number;
     pricControl=0;
     qtyControl=0;

     pricControl= Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
     qtyControl=Number(((this.intialBalanceForm.get('sc_initial_balance_details_Lst') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)
     result=pricControl*qtyControl;
     console.log(qtyControl);
     console.log(total);
    this.intialBalanceForm.get('n_total_value')?.patchValue( this.intialBalanceForm.get('n_total_value')?.value-result);
    this.intialBalanceForm.get('n_initial_balance_total_qty')?.patchValue( this.intialBalanceForm.get('n_initial_balance_total_qty')?.value-qtyControl);


  }

  }
  save()
{
  debugger
  if(this.intialBalanceForm.get("d_initial_balance_date")?.invalid)
  {
    this.showspinner=false;
    
    if(this.isEnglish) 
      this._notification.ShowMessage('Please insert date' ,3);
    else
       this._notification.ShowMessage("منفضلك ادخل التاريخ",3)
    return
  }
  if(this.intialBalanceForm.get("n_store_id")?.invalid)
  {
    this.showspinner=false;
    if(this.isEnglish)
      this._notification.ShowMessage('Please insert the store',3);
    else 
       this._notification.ShowMessage("منفضلك ادخل مخزن",3)
    return
  }
  if(this.isYearExisted)
  {
    if(this.isEnglish)
       this._notification.ShowMessage('the year is exited before',3)
    else
       this._notification.ShowMessage("العام المالي موجود من قبل ",3)
   return;
  }


  debugger
  this.intialBalanceForm.value.d_initial_balance_date=new DatePipe('en-US').transform(this.intialBalanceForm.value.d_initial_balance_date, 'yyyy/MM/dd');
  var formData: any = new FormData();
  formData.append("n_document_no",this.intialBalanceForm.value.n_document_no)
  formData.append("d_initial_balance_date",this.intialBalanceForm.value.d_initial_balance_date)
  formData.append("n_initial_balance_total_qty",this.intialBalanceForm.value.n_initial_balance_total_qty)
  formData.append("n_intial_balance_currency_id",this.intialBalanceForm.value.n_intial_balance_currency_id)
  formData.append("s_arabic_transaction_description",this.intialBalanceForm.value.s_arabic_transaction_description)
  formData.append("s_english_transaction_description",this.intialBalanceForm.value.s_english_transaction_description)
  formData.append("n_store_id",this.intialBalanceForm.value.n_store_id)
  formData.append("s_store_name",this.intialBalanceForm.value.s_store_name)
  formData.append("b_using_multi_store",this.multiStore)
  formData.append("n_total_value",this.intialBalanceForm.value.n_total_value)
  formData.append("n_DataAreaID", this.intialBalanceForm.value.n_DataAreaID);
  formData.append('n_UserAdd', this.intialBalanceForm.value.n_UserAdd ?? 0);
  formData.append('d_UserAddDate', this.intialBalanceForm.value.d_UserAddDate)

   

  for (var i = 0; i < this.intialBalanceForm.value.sc_initial_balance_details_Lst.length;i++)
  {
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('s_item_name')?.enable();
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('s_unit_name')?.enable();
    ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('n_item_value')?.enable();
    if(!(((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('s_item_name')?.value))
    {
        console.log("notvalid")
        if(this.isEnglish)
          this._notification.ShowMessage('Please insert the item' ,3)
        else 
          this._notification.ShowMessage("منفضلك ادخل الصنف",3)
       return
    }
    else
    {
      formData.append("sc_initial_balance_details_Lst[" + i + "].s_item_id", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].s_item_id);
      formData.append("sc_initial_balance_details_Lst[" + i + "].s_item_name", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].s_item_name);

    }

  if(((this.intialBalanceForm.get("sc_initial_balance_details_Lst")as FormArray).at(i) as FormGroup).controls["s_item_id"].errors?.["notfound"] && ((this.intialBalanceForm.get("sc_initial_balance_details_Lst")as FormArray).at(i) as FormGroup).controls["s_item_id"].touched)
  {
    this.showspinner=false;
    if(this.isEnglish)
      this._notification.ShowMessage('Please insert the proper item' ,3)
    else 

      this._notification.ShowMessage("من فضلك ادخل رقم الصنف السليم ",3)
    return
  }
  if(((this.intialBalanceForm.get("sc_initial_balance_details_Lst")as FormArray).at(i) as FormGroup).controls["n_unit_id"].errors?.["notfound"] && ((this.intialBalanceForm.get("sc_initial_balance_details_Lst")as FormArray).at(i) as FormGroup).controls["n_unit_id"].touched)
  {
    this.showspinner=false;
    if(this.isEnglish)
      this._notification.ShowMessage('Please insert the proper unit number' ,3)
    else
    this._notification.ShowMessage("من فضلك ادخل رقم الوحدة السليم ",3)
    return
  }

    if(!(((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value))
    {
        console.log("notvalid")
        if(this.isEnglish)
          this._notification.ShowMessage('Please insert unit number',3)
       else
         this._notification.ShowMessage("منفضلك ادخل وحدة",3)
       return
    }
    else
    {
      formData.append("sc_initial_balance_details_Lst[" + i + "].n_unit_id", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].n_unit_id);
      formData.append("sc_initial_balance_details_Lst[" + i + "].s_unit_name", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].s_unit_name);
    }
    if(!(((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('n_qty')?.value))
    {
      this.showspinner=false;
        console.log("notvalid")

      if(this.isEnglish)
        this._notification.ShowMessage('Please insert qty',3)
      else 
      this._notification.ShowMessage("منفضلك ادخل الكمية",3)
       return
    }
    else
    {
      formData.append("sc_initial_balance_details_Lst[" + i + "].n_qty", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].n_qty);

    }
    if(!(((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value))
    {
      debugger
      this.showspinner=false;
        console.log("notvalid")
        if(this.isEnglish) 
          this._notification.ShowMessage(`Please insert price at line ${i+1}`,3)
        else
          this._notification.ShowMessage(`منفضلك ادخل السعر في السطر رقم ${i+1}`,3)
       return
    }
    else
    {
      formData.append("sc_initial_balance_details_Lst[" + i + "].n_unit_price", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].n_unit_price);

    }


    formData.append("sc_initial_balance_details_Lst[" + i + "].nLineNo", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].nLineNo ?? 0);




    formData.append("sc_initial_balance_details_Lst[" + i + "].n_item_value", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].n_item_value);
    formData.append("sc_initial_balance_details_Lst[" + i + "].n_qty_main_unit", this.intialBalanceForm.value.sc_initial_balance_details_Lst[i].n_qty_main_unit);

  }
  this.showspinner=true;
  this.disableButtons();
  if(this.ID != null && this. ID > 0)
  {
    this._initialBalanceService.Update(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
        this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){


        this._router.navigate(['/sc/intialBalances']);
        this.intialBalanceForm = this.fb.group({
          n_document_no: '',
          d_initial_balance_date:[(new Date()).toISOString().substring(0,10)],
          n_initial_balance_total_qty: '',
          n_total_value: '',
          n_intial_balance_currency_id:'',
          s_arabic_transaction_description:'',
          s_english_transaction_description: '',

          b_using_multi_store:'',
          n_DataAreaID:'',
          n_UserAdd:'',
          d_UserAddDate:'',
          n_current_branch:'',
          n_current_company:'',
          n_current_year:'',
          sc_initial_balance_details_Lst: this.fb.array([])
        });
      }


  });

  }
  else
  {
    this._initialBalanceService.Create(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
        this. _notification.ShowMessage(data.msg,data.status);
       if(data.status==1){


         this._router.navigate(['/sc/intialBalances']);
         this.intialBalanceForm = this.fb.group({
           n_document_no:'',
           d_initial_balance_date:[ (new Date()).toISOString().substring(0,10)],
           n_initial_balance_total_qty: '',
           n_total_value: [''],
           n_intial_balance_currency_id:'',
           s_arabic_transaction_description:'',
           s_english_transaction_description: '',
           n_store_id: [''],
           s_store_name: '',
           b_using_multi_store:'',
           n_DataAreaID:'',
           n_UserAdd:'',
           d_UserAddDate:'',
           n_current_branch:'',
           n_current_company:'',
           n_current_year:'',
           sc_initial_balance_details_Lst: this.fb.array([] )
         });
       }



   });

  }








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

getItemsNow($event,i)
{
  this._currentAccountIndex=i;
  let arr=this.items.filter((ele)=>
  {
   return ele.s_item_id==$event.target.value
  });
  console.log(arr);
  if(arr.length==0)
  {
  this.ItemisEsixt=false
  }
  else
  this.ItemisEsixt=true;

  ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_item_name")?.patchValue(arr[0]?.s_item_name);
  ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
  ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
}

clearItem(i:number)
{
  debugger
  
  if(!this.ItemisEsixt)
    {
      ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_item_id")?.patchValue('');
      ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_item_name")?.patchValue('');
    }
}
getUnitByItemId(itemId:any){
  setTimeout(()=>{
    this._initialBalanceService.getUnits(itemId).subscribe((res)=>{
      
      this.units=res;
      
  })

  },1000)
}
getUnitsNow($event,i)
{
    this._currentAccountIndex=i;

  let arr=this.units.filter((ele)=>
  {
   return ele.n_unit_id==$event.target.value

  });

  if(arr.length==0)
   this.unitExist=false;
  else
  this.unitExist=true;
  ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_unit_name")?.patchValue(arr[0]?.s_unit_name)

}

clearUnit(i:number)
{
  debugger
  if(!this.unitExist)
    {
      ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    }
}
onSelection() {
  this._initialBalanceService.getInventoryItems(this.selectserver.selectForm.value.n_store_id).subscribe((res)=>{
    debugger
    this.items=res;
  })
    if(this.intialBalanceForm.value.n_store_id != null || this.intialBalanceForm.value.n_store_id != ''){
      this.isThereStock = true;
    }

}

}
