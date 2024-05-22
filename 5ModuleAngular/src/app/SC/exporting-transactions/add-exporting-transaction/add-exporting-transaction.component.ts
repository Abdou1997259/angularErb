import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';


import { StoresPopUpComponent } from '../stores-pop-up/stores-pop-up.component';
import { PopJournalUpComponent } from '../pop-journal-up/pop-journal-up.component';

import { MatSelectChange } from '@angular/material/select';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { GeneralSC } from 'src/app/Core/Api/SC/genereal-sc.service';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { LangSwitcher } from '../../../Core/Api/Helper/lang';
@Component({
  selector: 'app-add-exporting-transaction',
  templateUrl: './add-exporting-transaction.component.html',
  styleUrls: ['./add-exporting-transaction.component.css']
})
export class AddExportingTransactionComponent  extends BaseComponent implements OnInit {

filteredStoresServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
filteredStoresServerSideFilterd: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
filteredCurrencyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
transSourceFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
@ViewChild("Serverside")   selectserver!:SelectServerSideComponent;
@ViewChild("ServersideStore")   selectserverstore!:SelectServerSideComponent;
searchingStrore:boolean=false;
 searchingStroreFilterd:boolean=false;
 searchingCurrency:boolean=false;
 transSourceSearching:boolean=false;
 showspinner:boolean=false;
 stores:any=[];
 storesFilterd:any=[];
 transSourcesList:any=[];
 currencyType!: any [];
 items:any[]=[];
 units:any[]=[];
 prices:any[]=[]
 _currentAccountIndex:number=0
 selectedVal:any;
 isWithtransSource:boolean=false;
 isThereStock: boolean = false;
 @ViewChild("document_no") documentInput!:ElementRef;
 isEnglish:boolean=false;
  searchStoresFilterd(value:any)
 {
  this.searchingStroreFilterd=true;
  this._stockOutToStock.getStores(true).subscribe(data=>{
    this.storesFilterd=data;
    this.filteredStoresServerSideFilterd.next(this.storesFilterd.filter(x=>x.s_store_name.toLowerCase().indexOf(value)>-1));
    this.searchingStroreFilterd=false

  })
}
searchStores(value:any)
{
 this.searchingStrore=true;
 this._stockOutToStock.getStores(false).subscribe(data=>{
   this.stores=data;
   this.filteredStoresServerSide.next(this.stores.filter(x=>x.s_store_name.toLowerCase().indexOf(value)>-1));
   this.searchingStrore=false

 })
}
searchingCurrencies(value:any)
{
 this.searchingCurrency=true;
 this._stockOutToStock.GetCurrencies().subscribe(res=>{
   this.currencyType=res;
   this.filteredCurrencyServerSide.next(  this.currencyType.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
   this.searchingCurrency=false;

 })
}


  dtOptions: DataTables.Settings = {};
  isLocalcurrency: boolean = false;
  localCurencyName!:any;
  form: any;
  StockForm:FormGroup;
  myDatepipe!: any;
  storedID!: number;
  onSelection()
  {

    debugger
    this.storeID=this.StockForm.value.n_store_id;
    if(this.StockForm.value.n_store_id != null || this.StockForm.value.n_store_id != ''){
      this.isThereStock = true;
    }
    this._stockOutToStock.getInventoryItems(this.selectserver.selectForm.value.n_store_id).subscribe((res)=>{
      debugger
      this.items=res;
    })
    this._stockOutToStock.getFromTo(this.storeID).subscribe((res)=>{
      debugger;
      this.fromtoAccountinfo=res

    })
  }
  onCurrencuSelection($event)
  {
    debugger
    if(this.selectserver.selectForm.value.n_transaction_currency_id===this.localCurrency)
    {
      this.isLocalcurrency=false

    }
    else
    this.isLocalcurrency=true
  }
  constructor(
    private fb:FormBuilder,
    private _scGeneral:GeneralSC
    , private _stockOutToStock:StockOutToStock
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService
    ,private _router : Router, private _transSource: SCTransTypeService

    ,private _routeActive : ActivatedRoute
    ,private userservice:UserService) {
      super(_routeActive.data,userservice);

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers',
        pageLength: 2,
        processing: true

      };
      this.StockForm = this.fb.group({
        n_document_no: [''],
        n_documented_no:'',
        n_transaction_currency_id:'',
        n_store_id: ['',Validators.required],
        n_store_id2: '',
        s_arabic_transaction_desceription:'',
        s_english_transaction_desceription: '',
        n_trans_source_no:'',
        n_transaction_total_qty:'',
        n_total_value:'',
        b_Delivered:'',
        d_transaction_date:[(new Date()).toISOString().substring(0,10),Validators.required],
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',

        sc_Items_Transactions_Details: this.fb.array([])
      });
    }
ID:any
DataAreaNo: any;
Edit:boolean=false;
Add:boolean=true;
visble:boolean=false;
localCurrency;
 override ngOnInit(): void {
  this._stockOutToStock.getUnits().subscribe((res)=>{
    this.units=res;
  })
  this._stockOutToStock.getItems().subscribe((res)=>{
    this.items=res;
  })
  this.ID=this._routeActive.snapshot.paramMap.get("id");
  this.searchingStrore=true;
  this._stockOutToStock.GetLocalCurrencie().subscribe((val) => {
     debugger
    this.localCurrency = val.n_currency_id;
    this.localCurencyName=val.s_currency_name;

   ( this.selectserver.selectForm.get("n_transaction_currency_id")?.patchValue(val.n_currency_id));
   ( this.selectserver.selectForm.get("s_currency_name")?.patchValue(val.s_currency_name));

   console.log(this.selectserver.selectForm);

  })



  this.searchStores('');
  this.searchStoresFilterd('');
  this.searchingCurrencies('');
  this.transSourceSearch('');

  if(this.ID != null && this. ID > 0)
  {

    this._stockOutToStock.getById(this.ID).subscribe((data)=>{
      debugger;
      this.visble=true;
      this.documentInput.nativeElement.style.display="block";
      this.StockForm.get("n_document_no")?.patchValue(data["n_document_no"]);
      this.StockForm.get("d_transaction_date")?.patchValue(new Date(Number(data.d_transaction_date.substring(0,4)), Number(data.d_transaction_date.substring(5,7))-1, Number(data.d_transaction_date.substring(8,10))));

      this.StockForm.get("n_transaction_total_qty")?.patchValue(data["n_transaction_total_qty"]);
      this.StockForm.get("n_total_value")?.patchValue(data["n_total_value"]);
      this.StockForm.get("n_transaction_currency_id")?.patchValue(data["n_transaction_currency_id"]);
      this.StockForm.get("s_arabic_transaction_desceription")?.patchValue(data["s_arabic_transaction_desceription"]);
      this.StockForm.get("s_english_transaction_desceription")?.patchValue(data["s_english_transaction_desceription"])
      this.StockForm.get("n_store_id")?.patchValue(data["n_store_id"])
      if(data["n_store_id"] != null || data["n_store_id"] != "")
      {
        this.isThereStock = true;
      }
      this.StockForm.get("n_store_id2")?.patchValue(data["n_store_id2"])
      this.StockForm.get("n_DataAreaID")?.patchValue(data["n_DataAreaID"])
      this.DataAreaNo = data["n_DataAreaID"];
      this.StockForm.get("n_documented_no")?.patchValue(data["n_documented_no"])

      // line_p,

      data.vuw_StockOutToStock_DetailsLST.forEach(res => {

        debugger
        this.sc_Items_Transactions_Details.push(this.newItemssdetailsWithData('',res.s_item_id,res.s_item_name,res.n_unit_id,res.s_unit_name
          ,res.n_qty,res.n_unit_price,res.n_item_value,res.s_import_no,res.n_transaction_value,res.n_requested_limit,res.n_item_cost,res.n_trans_source_doc_no

          ));
      })
      this.Add=false;
      this.Edit=true;
    })
  }
  else{
    this.addItemsDetails();
    this.visble=false
  }

  LangSwitcher.translatefun();
  LangSwitcher.translateData(1)
  this.isEnglish=LangSwitcher.CheckLan();


  this.StockForm.get("d_transaction_date")?.patchValue(new Date())
  }
  sc_Items_Transactions_Details_Form!: FormGroup;
  get sc_Items_Transactions_Details():FormArray
  {
    return this.StockForm.get('sc_Items_Transactions_Details') as FormArray

  }

  getItemsNow($event,i)
{
  debugger
  var stockId = this.StockForm.value.n_store_id;
  if(stockId == null || stockId == 0 || stockId == ''){
    this.isThereStock = false;
   
    if(this.isEnglish)
       this._notification.ShowMessage("Insert the store first",3);
    else
    this._notification.ShowMessage("من فضلك اختر المخزن اولآ", 3);
    return;
  }else{
    this.isThereStock = true;
  }

  this._currentAccountIndex=i
  // let uni=$event.target.value.trim(" ");
  // let arr=this.items.filter((res)=>{
  //   res.s_item_id=$event.target.value

  // });

  debugger
  // console.log(arr);
  // ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_item_name").patchValue(arr[0]);
  let arr=this.items.filter((ele)=>
  {
   return ele.s_item_id==$event.target.value
  });


  ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get("s_item_name")?.patchValue(arr[0]?.s_item_name);



  ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue('');
  ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue('');

  this._scGeneral.GetLastCost(arr[0]?.s_item_id,this.StockForm.get("d_transaction_date")?.value,stockId).subscribe((data)=>{
    debugger
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(data);
    this.prices[this._currentAccountIndex]=data;
   });
}
getUnitsNow($event,i,itemID:any)
{
 debugger
  // let uni=$event.target.value.trim(" ");
  // let arr=this.items.filter((res)=>{
  //   res.s_item_id=$event.target.value

  // });
  this._currentAccountIndex=i;



    let arr=this.units.filter((ele)=>
  {
   return ele.n_unit_id==$event.target.value

  });
debugger
  ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get("s_unit_name")?.patchValue(arr[0]?.s_unit_name)
  this._stockOutToStock.GetCoff($event.target.value,itemID).subscribe((data)=>{

    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get("s_unit_name")?.patchValue(arr[0]?.s_unit_name);

debugger
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.patchValue(this.prices[this._currentAccountIndex] * data);
    this.getTotal(this._currentAccountIndex,false)
   })

  // console.log(arr);
  // ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_item_name").patchValue(arr[0]);


}







  newItemssdetailsWithData(
    line_p,s_item_id_p,s_item_name_p,n_unit_id_p,
    s_unit_name_p,n_qty_p,n_unit_price_p,
    n_item_value_p,s_import_no_p
    ,n_transaction_value_p,n_requested_limit_p,n_item_cost_p,n_trans_source_doc_no_p
    ): FormGroup {

    return this.fb.group({
      nlineno:line_p,
      s_item_id:[s_item_id_p],
      s_item_name:[s_item_name_p],
      n_unit_id:[n_unit_id_p,],
      s_unit_name:s_unit_name_p,
      n_trans_source_doc_no:n_trans_source_doc_no_p,
      n_item_cost:n_item_cost_p,
      n_requested_limit:n_requested_limit_p,
      s_import_no:s_import_no_p,



      n_transaction_value:n_transaction_value_p,
      n_qty:n_qty_p,
      n_unit_price:[n_unit_price_p],
      n_item_value:n_item_value_p,
      n_qty_main_unit:''

    })
  }
  loadItems(i:number){
    var stockId = this.StockForm.value.n_store_id;
    if(stockId == null || stockId == 0 || stockId == ''){
      this.isThereStock = false;
      this._notification.ShowMessage("من فضلك اختر المخزن اولآ", 3);
      return;
    }else{
      this.isThereStock = true;
    }

    this._currentAccountIndex=i;
    const dialogRef = this.dialog.open(ItemsdetailsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: { 'storeId': stockId }
    });
  dialogRef.afterClosed().subscribe(res => {

      ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue('');
      this.getUnitsFromApi();
      debugger
      this.StockForm.value.d_transaction_date=new DatePipe('en-US').transform(this.StockForm.value.d_transaction_date, 'yyyy/MM/dd');
   
      this._scGeneral.GetLastCost(res.data.s_item_id,this.StockForm.value.d_transaction_date,stockId).subscribe((data)=>{
        debugger
        ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue(data);
         this.prices[this._currentAccountIndex]=data;
       });

     });

        //this.calctotal();


  }
  ChangeItems(i:number)
  {
    this._currentAccountIndex=i;
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_id')?.patchValue('');
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.patchValue('');
  }

  loadUnits(i:number,itemID:any,price:any){
    debugger
    // $('#ItemModal').modal('toggle');
    
    this._currentAccountIndex=i;
    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: { 'itemId': itemID   }
    });
  dialogRef.afterClosed().subscribe(res => {

      

      
       this._stockOutToStock.GetCoff(res.data.n_unit_id,itemID).subscribe((data)=>{
        debugger
        ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
        ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);

    
        ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.patchValue(this.prices[this._currentAccountIndex] * data);
        this.getTotal(this._currentAccountIndex,false)
       })


     });

        //this.calctotal();


  }
  ChangeUnits(i:number)
  {
    this._currentAccountIndex=i;
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_unit_name')?.patchValue('');
  }
  loadStores(i:number){
    // $('#ItemModal').modal('toggle');
    this._currentAccountIndex=i;
    const dialogRef = this.dialog.open(StoresPopUpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });
  dialogRef.afterClosed().subscribe(res => {


      ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_store_id')?.patchValue(res.data.n_store_id);
      ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_store_name')?.patchValue(res.data.s_store_name );






     });

        //this.calctotal();


  }
  ChangeStores(i:number)
  {
    this._currentAccountIndex=i;
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_store_id')?.patchValue('');
    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_store_name')?.patchValue('');
  }
  newItemssdetails(line:number=0): FormGroup {

    return this.fb.group({
      nlineno:line,
      s_item_id:['',Validators.required],
      s_item_name:['',],
      n_unit_id:['',[Validators.required,this.errorcode()]],
      s_unit_name:'',
      n_trans_source_doc_no:'',
      n_item_cost:'',
      n_requested_limit:'',
      s_import_no:'',



      n_transaction_value:'',
      n_qty:['',Validators.required],
      n_unit_price:['',Validators.required],
      n_item_value:'',
      n_qty_main_unit:'',

    })
 }
 addItemsDetails() {
  this.sc_Items_Transactions_Details.push(this.newItemssdetails(this.sc_Items_Transactions_Details.length+1));
}
removeItems(i:number)
{

  this.getTotal(i,true);

this.sc_Items_Transactions_Details.removeAt(i);

}
getUnitsFromApi()
{
  debugger
  let value = ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(this._currentAccountIndex) as FormGroup).get("s_item_id")?.value;

  setTimeout(() => {
    this._stockOutToStock.getUnitForItems(value).subscribe((ele)=>{
      this.units=ele



    })


      }
  , 500);
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

  itemIDVal=Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.value)
  unitIDVal=Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.value)
  pricControl= Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
  qtyControl=Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)

  if(fromDelte==false)
  {
    pricControl= Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
    qtyControl=Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)
    if(unitIDVal!=0 && itemIDVal!=0  )
  {

          result=pricControl*qtyControl;
        ((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_transaction_value')?.patchValue(result);



        for( let item of (this.StockForm.get('sc_Items_Transactions_Details') as FormArray ).controls)
        {

          accumlatedQty+=Number(item.get('n_qty')?.value)
          accumlatedPrice+=Number(item.get('n_transaction_value')?.value);

        }

        this.StockForm.get('n_transaction_total_qty')?.patchValue(accumlatedQty);
        this.StockForm.get('n_total_value')?.patchValue(accumlatedPrice);


      }


  }
  if(fromDelte==true)
  {
    let total!: number;
     pricControl=0;
     qtyControl=0;

     pricControl= Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
     qtyControl=Number(((this.StockForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)
     result=pricControl*qtyControl;
     console.log(qtyControl);
     console.log(total);
    this.StockForm.get('n_total_value')?.patchValue( this.StockForm.get('n_total_value')?.value-result);
    this.StockForm.get('n_transaction_total_qty')?.patchValue( this.StockForm.get('n_transaction_total_qty')?.value-qtyControl);


  }

  }
  storeID!: Number;
  fromtoAccountinfo;
  currencyNamevar;
  glJournalForm!: FormGroup;
  getCurrencyName(event:MatSelectChange)
  {
    this.currencyNamevar=event.source.triggerValue;
  }
  errorcode()
{
  return (control:FormControl)=>
  {




  let arr=this.units.filter((ele)=>{

        return ele.n_unit_id==control.value
  })

  if(arr.length!=0)
       return null

  return {notfound:true }

  }

  }


  openJournal()
  {
    var store = this.StockForm.value.n_store_id;
    if(store == null || store == '' || store <= 0) {
     
      if(!this.isEnglish)
      this._notification.ShowMessage("من فضلك اختر المخزن", 3);
     else 
     this. _notification.ShowMessage("insert inventory please" ,3);
      
      return;
    }
    this.storeID=this.StockForm.value.n_store_id;
   let CreditAndDebit =this.StockForm.get("n_total_value")?.value
   let History =this.StockForm.get("d_transaction_date")?.value;
   let Currency=this.StockForm.get("n_transaction_currency_id")?.value
   let descEng=this.StockForm.get("s_english_transaction_desceription")?.value
   let descArab=this.StockForm.get("s_arabic_transaction_desceription")?.value
    this._stockOutToStock.getFromTo(this.storeID).subscribe((res)=>{

      this.fromtoAccountinfo=res
      const dia=this.dialog.open(PopJournalUpComponent,{

        width:(window.innerWidth*0.40).toString(),
        height:'500px',
        panelClass: 'my-custom-dialog-class',
        data: {

          accountNo1: this.fromtoAccountinfo.toAccountNo,
          accountNo2:this.fromtoAccountinfo.fromAccountNo,
          accountName1:this.fromtoAccountinfo.toAccountName,
          accountName2:this.fromtoAccountinfo.fromAccountName,
          History:History,
          Credit:CreditAndDebit,
          Debit:CreditAndDebit,
          Currency:Currency,
          descEng:descEng,
          descArab:descArab


        }
      })


    dia.afterClosed().subscribe((res)=>{
      debugger;
      this.glJournalForm=res
    })



    })





  }
  public save()
  {
  if(this.StockForm.get("d_transaction_date")?.invalid)
  {
    this.showspinner=false;
    
    if(!this.isEnglish)
 
    this._notification.ShowMessage("منفضلك ادخل التاريخ",3)
   else 
     this._notification.ShowMessage("Please insert date",3) 
    return
  }
  if(!this.StockForm.get("n_store_id")?.value)
  {
    this.showspinner=false;
   
    if(!this.isEnglish)
 
    this._notification.ShowMessage("منفضلك ادخل مخزن",3)
    else 
        this._notification.ShowMessage("Please insert inventory",3) 
    return
  }
  if(this.StockForm.get("n_transaction_currency_id")?.invalid)
  {
    this.showspinner=false;
   
    if(!this.isEnglish)
 
    this._notification.ShowMessage("منفضلك ادخل العملة ",3)
    else 
        this._notification.ShowMessage("Please insert currency",3) 
    return
  }
  if(!this.StockForm.get("n_store_id2")?.value)
    {
      this.showspinner=false;
      
      if(!this.isEnglish)
        this._notification.ShowMessage("منفضلك ادخل مخزن",3)
     else 
     this._notification.ShowMessage("Please insert inventory",3) 
      return
    }



      var formData: any = new FormData();
      this.StockForm.value.d_transaction_date=new DatePipe('en-US').transform(this.StockForm.value.d_transaction_date, 'yyyy/MM/dd');
    formData.append("n_document_no",this.StockForm.value.n_document_no)
    formData.append("n_documented_no",this.StockForm.value.n_documented_no)

    formData.append("d_transaction_date",this.StockForm.value.d_transaction_date)
    formData.append("n_transaction_total_qty",this.StockForm.value.n_transaction_total_qty)
    formData.append("n_transaction_currency_id",this.StockForm.value.n_transaction_currency_id)
    formData.append("s_arabic_transaction_desceription",this.StockForm.value.s_arabic_transaction_desceription)
    formData.append("s_english_transaction_desceription",this.StockForm.value.s_english_transaction_desceription)
    formData.append("n_store_id",this.StockForm.value.n_store_id)
    formData.append("n_store_id2",this.StockForm.value.n_store_id2)
    formData.append("n_trans_source_no",this.StockForm.value.n_trans_source_no)
    formData.append("n_transaction_total_qty",this.StockForm.value.n_transaction_total_qty)
    formData.append("n_total_value", this.StockForm.value.n_total_value)
    formData.append("n_DataAreaID", this.StockForm.value.n_DataAreaID);

    formData.append('n_UserAdd', this.StockForm.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.StockForm.value.d_UserAddDate)

  for (var i = 0; i < this.StockForm.value.sc_Items_Transactions_Details.length;i++)
  {

    ((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get('n_item_value')?.enable();




     if(!(((this.StockForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get('s_item_name')?.value))
     {
      console.log("notvalid")
      this.showspinner=false;

      if(!this.isEnglish)
          this._notification.ShowMessage("منفضلك ادخل الصنف",3)
      else 
        this._notification.ShowMessage("Please insert item ",3) 
       return
     }
     else
     {
      formData.append("sc_Items_Transactions_Details[" + i + "].s_item_id", this.StockForm.value.sc_Items_Transactions_Details[i].s_item_id);

     }

     if(!(((this.StockForm.get("sc_Items_Transactions_Details")  as FormArray).at(i) as FormGroup).get('n_unit_id')?.value))
     {
         console.log("notvalid")
         this.showspinner=false;
     
       if(!this.isEnglish)
       this._notification.ShowMessage("منفضلك ادخل وحدة",3)
      else 
        this._notification.ShowMessage("Please insert Unit ",3) 
       
        return
     }
     else
     {
      formData.append("sc_Items_Transactions_Details[" + i + "].n_unit_id", this.StockForm.value.sc_Items_Transactions_Details[i].n_unit_id);
     }
     if(((this.StockForm.get("sc_Items_Transactions_Details")as FormArray).at(i) as FormGroup).controls["s_item_id"].errors?.["notfound"] && ((this.StockForm.get("sc_Items_Transactions_Details")as FormArray).at(i) as FormGroup).controls["s_item_id"].touched)
  {
    this.showspinner=false;
    
    if(!this.isEnglish)
    this._notification.ShowMessage("من فضلك ادخل رقم الصنف السليم ",3)
   else 
     this._notification.ShowMessage("Please insert proper item number",3) 
    
    return
  }
  if(((this.StockForm.get("sc_Items_Transactions_Details")as FormArray).at(i) as FormGroup).controls["n_unit_id"].errors?.["notfound"] && ((this.StockForm.get("sc_Items_Transactions_Details")as FormArray).at(i) as FormGroup).controls["n_unit_id"].touched)
  {
    this.showspinner=false;

    if(!this.isEnglish)
    this._notification.ShowMessage("من فضلك ادخل رقم الوحدة السليم ",3)
   else 
     this._notification.ShowMessage("Please insert proper unit number",3) 
    
    return
  }
     if(!(((this.StockForm.get("sc_Items_Transactions_Details")  as FormArray).at(i) as FormGroup).get('n_qty')?.value))
     {
         console.log("notvalid")
         this.showspinner=false;
    
       if(!this.isEnglish)
       this._notification.ShowMessage("منفضلك ادخل الكمية",3)
      else 
        this._notification.ShowMessage("Please insert qty",3) 
        return
     }
     else
     {
      formData.append("sc_Items_Transactions_Details[" + i + "].n_qty", this.StockForm.value.sc_Items_Transactions_Details[i].n_qty);

     }
     if(!(((this.StockForm.get("sc_Items_Transactions_Details")  as FormArray).at(i) as FormGroup).get('n_unit_price')?.value))
     {
      this.showspinner=false;
         console.log("notvalid")

         
       if(!this.isEnglish)
       this._notification.ShowMessage("منفضلك ادخل السعر",3)
      else 
        this._notification.ShowMessage("Please insert price",3) 
         
    
        return
     }
     else
     {
      formData.append("sc_Items_Transactions_Details[" + i + "].n_unit_price", this.StockForm.value.sc_Items_Transactions_Details[i].n_unit_price);

     }

     formData.append("sc_Items_Transactions_Details[" + i + "].n_transaction_value", this.StockForm.value.sc_Items_Transactions_Details[i].n_transaction_value);

    formData.append("sc_Items_Transactions_Details[" + i + "].nlineno", this.StockForm.value.sc_Items_Transactions_Details[i].nlineno);








    formData.append("sc_Items_Transactions_Details[" + i + "].n_item_value", this.StockForm.value.sc_Items_Transactions_Details[i].n_item_value);
    formData.append("sc_Items_Transactions_Details[" + i + "].n_qty_main_unit", this.StockForm.value.sc_Items_Transactions_Details[i].n_qty_main_unit);

  }
  this.showspinner=true;
  this.disableButtons();

  if(this.ID != null && this. ID > 0)
  {
    this._stockOutToStock.Update(formData).subscribe(data=>{


      this.enableButtons();
      this.showspinner=false;
      
      if(!this.isEnglish)
      this. _notification.ShowMessage(data.msg,data.status);
     else 
     this. _notification.ShowMessage(data.Emsg,data.status);
      
      if(data.status==1){


       this._router.navigate(['/sc/exportingTransactions']);
       this.StockForm = this.fb.group({
         n_document_no:'',
         n_documented_no:'',
         n_transaction_currency_id:'',
         n_store_id: ['',Validators.required],
         n_store_id2: '',
         s_arabic_transaction_desceription:'',
         s_english_transaction_desceription: '',
         n_trans_source_no:'',
         n_transaction_total_qty:'',
         n_total_value:'',
         b_Delivered:'',
         d_transaction_date:[(new Date()).toISOString().substring(0,10),Validators.required],
         n_DataAreaID:'',
         n_UserAdd:'',
         d_UserAddDate:'',
         n_current_branch:'',
         n_current_company:'',
         n_current_year:'',

         sc_Items_Transactions_Details: this.fb.array([])
        });
      }


  });
  }
 else{
  this._stockOutToStock.Create(formData).subscribe(data=>{
    debugger
    this.enableButtons();
    this.showspinner=false;
    if(!this.isEnglish)
    this. _notification.ShowMessage(data.msg,data.status);
   else 
   this. _notification.ShowMessage(data.Emsg,data.status);
    

     if(data.status==1 ){

       this._router.navigate(['/sc/exportingTransactions']);
       this.StockForm = this.fb.group({
         n_document_no:'',
         n_documented_no:'',
         n_transaction_currency_id:'',
         n_store_id:[''],
         n_store_id2: '',
         s_arabic_transaction_desceription:'',
         s_english_transaction_description: '',
         n_trans_source_no:'',
         n_transaction_total_qty:'',
         n_total_value:'',
         b_Delivered:'',
         d_transaction_date:[(new Date()).toISOString().substring(0,10),Validators.required],
         n_DataAreaID:'',
         n_UserAdd:'',
         d_UserAddDate:'',
         n_current_branch:'',
         n_current_company:'',
         n_current_year:'',

         sc_Items_Transactions_Details: this.fb.array([])
       });
     }




 });

 }







  }
  showSourcesTypes() {
    var id = this.selectedVal;
    // this.currentItemIndex=i;
     const dialogRef = this.dialog.open(TransSourceTypesComponent, {
       width: '700px',
       height:'600px',
       data: { id }
     });
     dialogRef.afterClosed().subscribe(res => {
      this._transSource.GetGenericViewData(res.data[0], res.data[1]).subscribe((data) => {
        this.sc_Items_Transactions_Details.clear();
        this.StockForm.patchValue(data[0]);

        data.forEach(element => {
          this.sc_Items_Transactions_Details.push(this.newItemssdetails(this.sc_Items_Transactions_Details.length));
        });
        (this.StockForm.get('sc_Items_Transactions_Details') as FormArray)?.patchValue(data);
        for(var i = 0; i < this.StockForm.value.sc_Items_Transactions_Details.length; i++) {
          this.getTotal(i, false);
        }
      });
     });
  }
  transSourceSearch(value: any){
    this.transSourceSearching=true;
    this._stockOutToStock.GetTransSourceDropList().subscribe(res=>{
      this.transSourcesList=res;
      this.transSourceFilteredServerSide.next(this.transSourcesList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.transSourceSearching=false;
    })
  }

  valueChanged() {
    this.selectedVal = this.StockForm.value.n_trans_source_no;
    if(this.selectedVal !== 0 && this.selectedVal !== ''){
      this.isWithtransSource = true;
    } else {
      this.isWithtransSource = false;
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
   ////// translate into English

}
