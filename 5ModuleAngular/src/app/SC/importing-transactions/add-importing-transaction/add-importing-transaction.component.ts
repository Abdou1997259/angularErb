import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { StockIntoStock } from 'src/app/Core/Api/SC/stockINTOStock';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';

import { ImportingPopJournalUpComponent } from '../importing-pop-journal-up/importing-pop-journal-up.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';

@Component({
  selector: 'app-add-importing-transaction',
  templateUrl: './add-importing-transaction.component.html',
  styleUrls: ['./add-importing-transaction.component.css']
})

export class AddImportingTransactionComponent extends BaseComponent implements OnInit{
//constructor Begin


  constructor(private fb:FormBuilder
    , private _stockIntoToStock:StockIntoStock
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService
    ,private _router : Router

    ,private _routeActive : ActivatedRoute
    ,private userservice:UserService) {
      super(_routeActive.data,userservice);

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers',
        pageLength: 2,
        processing: true

      };
      this.StockINForm = this.fb.group({
        n_document_no: [''],
        n_documented_no:'',
        n_transaction_currency_id:'',
        n_store_id: ['',Validators.required],
        n_store_id2: '',
        s_english_transaction_desceription:'',
        s_arabic_transaction_desceription: '',
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
//constructor end

//variables Declartions
  filteredStoresServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCurrencyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  transSourceFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  searchingStrore:boolean=false;
  searchingCurrency:boolean=false;
  transSourceSearching:boolean=false;
  showspinner:boolean=false;
  stores:any=[];
  transSourcesList:any=[];
  currencyType!:any [];
  items:any[]=[];
  units:any[]=[];
  _currentAccountIndex:number=0
  selectedVal:any;
  isWithtransSource:boolean=false;
  dtOptions: DataTables.Settings = {};
  isLocalcurrency:boolean=false;
  form: any;
  StockINForm:FormGroup;
  myDatepipe!: any;
  storedID!:number;
  ID:any
  Edit:boolean=false;
  Add:boolean=true;
  earchingStrore:boolean=false;
  storeID!:Number
  fromtoAccountinfo;
  currencyNamevar;
  glJournalForm!:FormGroup;
  isEnglish:boolean=false
get sc_Items_Transactions_Details():FormArray
  {
    return this.StockINForm.get('sc_Items_Transactions_Details') as FormArray

  }


//variables Declartions end

//HooksMethods begin
  override ngOnInit(): void {
    this.ID=this._routeActive.snapshot.paramMap.get("id");
    this.searchingStrore=true;
    this.searchStores('');
    this.searchingCurrencies('');
    this.transSourceSearch('');
    this.isEnglish=LangSwitcher.CheckLan();
    LangSwitcher.translateData(1.5)
    LangSwitcher.translatefun();
    if(this.ID != null && this. ID > 0)
    {
      this._stockIntoToStock.getItems().subscribe((res)=>{
        this.items=res;
      })
      this._stockIntoToStock.getUnits().subscribe((res)=>{
        this.units=res;
      })

      this._stockIntoToStock.getById(this.ID).subscribe((data)=>{
        debugger;

        this.StockINForm.patchValue(data)
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
    else
    {

    this.addItemsDetails();
    }
    if(this.ID == null || this.ID <= 0) {
      this._stockIntoToStock.GetLocalCurrencie().subscribe((val) => {
        this.StockINForm?.patchValue({n_transaction_currency_id: val});
        this.isLocalcurrency = true;
      })
    }
    this._stockIntoToStock.getItems().subscribe((res)=>{
      this.items=res;
    })
    this._stockIntoToStock.getUnits().subscribe((res)=>{
      this.units=res;
    })

    this.StockINForm.get("d_transaction_date")?.patchValue(new Date())
  }
//HooksMethods end


  ////// translate into English

//Function Delcartions here
disableButtons() {
  debugger;
  $(':button').prop('disabled', true);
  $("input[type=button]").attr("disabled", "disabled");
}

enableButtons() {
  $(':button').prop('disabled', false);
  $('input[type=button]').removeAttr("disabled");
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
    debugger;
    this._stockIntoToStock.GetGenericViewData(res.data[0], res.data[1]).subscribe((data) => {
      debugger;
      data.forEach(element => {
        this.sc_Items_Transactions_Details.push(this.newItemssdetails(this.sc_Items_Transactions_Details.length));
      });
      (this.StockINForm.get('sc_Items_Transactions_Details') as FormArray)?.patchValue(data);
      for(var i = 0; i < this.StockINForm.value.sc_Items_Transactions_Details.length; i++) {
        this.getTotal(i, false);
      }
    });
    // ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
    // ((this.transactionForm.get("transactionDetailsList") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
   });
}
newItemssdetailsWithData(
  line_p,s_item_id_p,s_item_name_p,n_unit_id_p,
  s_unit_name_p,n_qty_p,n_unit_price_p,
  n_item_value_p,s_import_no_p
  ,n_transaction_value_p,n_requested_limit_p,n_item_cost_p,n_trans_source_doc_no_p
  ): FormGroup {

  return this.fb.group({
    nlineno:line_p,
    s_item_id:[s_item_id_p,Validators.required],
    s_item_name:[s_item_name_p,Validators.required],
    n_unit_id:[n_unit_id_p,Validators.required],
    s_unit_name:s_unit_name_p,
    n_trans_source_doc_no:n_trans_source_doc_no_p,
    n_item_cost:n_item_cost_p,
    n_requested_limit:n_requested_limit_p,
    s_import_no:s_import_no_p,



    n_transaction_value:n_transaction_value_p,
    n_qty:n_qty_p,
    n_unit_price:[n_unit_price_p,Validators.required],
    n_item_value:n_item_value_p,
    n_qty_main_unit:''

  })
}
transSourceSearch(value: any){
  this.transSourceSearching=true;
  this._stockIntoToStock.GetTransSourceDropList().subscribe(res=>{
    this.transSourcesList=res;
    this.transSourceFilteredServerSide.next(this.transSourcesList.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
    this.transSourceSearching=false;
  })
}

valueChanged() {
  this.selectedVal = this.StockINForm.value.n_trans_source_no;
  if(this.selectedVal !== 0 && this.selectedVal !== ''){
    this.isWithtransSource = true;
  } else {
    this.isWithtransSource = false;
  }
}
searchStores(value:any)
{
 this.searchingStrore=true;
 this._stockIntoToStock.getStores().subscribe(data=>{
   this.stores=data;
   this.filteredStoresServerSide.next(this.stores.filter(x=>x.s_store_name.toLowerCase().indexOf(value)>-1));
   this.searchingStrore=false

 })
}
searchingCurrencies(value:any)
{
this.searchingCurrency=true;
this._stockIntoToStock.GetCurrencies().subscribe(res=>{
  this.currencyType=res;
  this.filteredCurrencyServerSide.next(  this.currencyType.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
  this.searchingCurrency=false;
  this.isLocalcurrency=false;
})
}

addItemsDetails() {
  this.sc_Items_Transactions_Details.push(this.newItemssdetails(this.sc_Items_Transactions_Details.length+1));
}
newItemssdetails(line:number=0): FormGroup {

  return this.fb.group({
    nlineno:line,
    s_item_id:['',Validators.required],
    s_item_name:['',Validators.required],
    n_unit_id:['',Validators.required],
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
removeItems(i:number)
{

  this.getTotal(i,true);

this.sc_Items_Transactions_Details.removeAt(i);

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

  itemIDVal=Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_item_name')?.value)
  unitIDVal=Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_id')?.value)
  pricControl= Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
  qtyControl=Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)

  if(fromDelte==false)
  {
    pricControl= Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
    qtyControl=Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)
    if(unitIDVal!=0 && itemIDVal!=0  )
  {

          result=pricControl*qtyControl;
        ((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_transaction_value')?.patchValue(result);



        for( let item of (this.StockINForm.get('sc_Items_Transactions_Details') as FormArray ).controls)
        {

          accumlatedQty+=Number(item.get('n_qty')?.value)
          accumlatedPrice+=Number(item.get('n_transaction_value')?.value);

        }

        this.StockINForm.get('n_transaction_total_qty')?.patchValue(accumlatedQty);
        this.StockINForm.get('n_total_value')?.patchValue(accumlatedPrice);


      }


  }
  if(fromDelte==true)
  {
    debugger
    let total:number
     pricControl=0;
     qtyControl=0;

     pricControl= Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_unit_price')?.value)
     qtyControl=Number(((this.StockINForm.get('sc_Items_Transactions_Details') as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_qty')?.value)
     result=pricControl*qtyControl;
     console.log(qtyControl);
    this.StockINForm.get('n_total_value')?.patchValue( this.StockINForm.get('n_total_value')?.value-result);
    this.StockINForm.get('n_transaction_total_qty')?.patchValue( this.StockINForm.get('n_transaction_total_qty')?.value-qtyControl);


  }

  }

  getItemsNow($event,i)
  {


    // let uni=$event.target.value.trim(" ");
    // let arr=this.items.filter((res)=>{
    //   res.s_item_id=$event.target.value

    // });


    // console.log(arr);
    // ((this.intialBalanceForm.get("sc_initial_balance_details_Lst") as FormArray).at(i) as FormGroup).get("s_item_name").patchValue(arr[0]);
    let arr=this.items.filter((ele)=>
    {
     return ele.s_item_id==$event.target.value
    });

    ((this.StockINForm.get("sc_Items_Transactions_Details") as FormArray).at(i) as FormGroup).get("s_item_name")?.patchValue(arr[0]?.s_item_name)

  }

  onSelection()
  {

    this.storeID=this.StockINForm.value.n_store_id;
    this._stockIntoToStock.getFromTo(this.storeID).subscribe((res)=>{
      this.fromtoAccountinfo=res

    })
  }

  JournalShow()
  {
    var JournalID=0, edit=false;
    var savedJournals, currentJournals;
    var JournalType=34;
    var currency=this.StockINForm.get('n_transaction_currency_id')?.value;
    var descAr=this.StockINForm.get('s_arabic_transaction_desceription')?.value;
    var descEn=this.StockINForm.get('s_english_transaction_desceription')?.value;
    var date=new DatePipe('en-US').transform(this.StockINForm.value.d_transaction_date, 'yyyy/MM/dd');
    $('#btnJournal').prop('disabled', true);

    if(this.ID !=null && this.ID > 0 ){
      edit=true;
      this._stockIntoToStock.GetJournalID(this.StockINForm.value.n_documented_no,JournalType).subscribe(res=>{
        JournalID=res;
        this._stockIntoToStock.GetSavedJournals(JournalID).subscribe(data=>{
          savedJournals=data;
          this._stockIntoToStock.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
            currentJournals=current;
            $('#btnJournal').prop('disabled', false);
            const dialogRef = this.dialog.open(TransJournalsComponent, {
              width: '800px',
              height:'600px',
              data: { edit,JournalID,date,JournalType,currency,descAr,descEn, savedJournals,currentJournals }
            });
          });
        });
      });
    }
    else
    {
      this._stockIntoToStock.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
        currentJournals=current;
        $('#btnJournal').prop('disabled', false);
        const dialogRef = this.dialog.open(TransJournalsComponent, {
          width: '800px',
          height:'600px',
          data: { edit,JournalID,date,JournalType,currency,descAr,descEn,currentJournals }
        });
      });
    }
  }

  SetJournalData(): any
  {
    var formData: any = new FormData();
    this.StockINForm.value.d_document_date=new DatePipe('en-US').transform(this.StockINForm.value.d_document_date, 'yyyy/MM/dd');

    formData.append("n_document_no", this.StockINForm.value.n_document_no ?? 0);
    formData.append("d_document_date", this.StockINForm.value.d_transaction_date ?? 0);
    formData.append("n_store_id", this.StockINForm.value.n_store_id ?? 0);
    formData.append("n_store_id2", this.StockINForm.value.n_store_id2 ?? 0);
    formData.append("n_currency_id", this.StockINForm.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.StockINForm.value.n_currency_coff ?? 0);
    formData.append("s_arabic_transaction_desceription", this.StockINForm.value.s_arabic_transaction_desceription);
    formData.append("s_english_transaction_desceription", this.StockINForm.value.s_english_transaction_desceription);
    formData.append("n_trans_source_no", this.StockINForm.value.n_trans_source_no ?? 0);
    formData.append("n_transaction_total_qty", this.StockINForm.value.n_transaction_total_qty ?? 0);
    formData.append("n_total_value", this.StockINForm.value.n_total_value ?? 0);

    for (var i = 0; i < this.StockINForm.value.sc_Items_Transactions_Details.length;i++)
    {
      formData.append("sc_Items_Transactions_Details[" + i + "].nLineNo", this.StockINForm.value.sc_Items_Transactions_Details[i].nLineNo ?? 0);
      formData.append("sc_Items_Transactions_Details[" + i + "].s_item_id", this.StockINForm.value.sc_Items_Transactions_Details[i].s_item_id ?? 0);
      formData.append("sc_Items_Transactions_Details[" + i + "].n_unit_id", this.StockINForm.value.sc_Items_Transactions_Details[i].n_unit_id ?? 0);
      formData.append("sc_Items_Transactions_Details[" + i + "].n_store_id", this.StockINForm.value.n_store_id ?? 0);
      formData.append("sc_Items_Transactions_Details[" + i + "].n_qty", this.StockINForm.value.sc_Items_Transactions_Details[i].n_qty ?? 0);
      formData.append("sc_Items_Transactions_Details[" + i + "].n_unit_price", this.StockINForm.value.sc_Items_Transactions_Details[i].n_unit_price ?? 0);
      formData.append("sc_Items_Transactions_Details[" + i + "].n_transaction_value", this.StockINForm.value.sc_Items_Transactions_Details[i].n_transaction_value ?? 0);
    }
    return formData;
  }


//Function Delcartions


}
