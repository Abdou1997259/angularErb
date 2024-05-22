import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColDef } from 'ag-grid-community';

import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { Observable, concat, concatMapTo } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { StoresPopUpComponent } from './stores-pop-up/stores-pop-up.component';
import { eventTupleToStore } from '@fullcalendar/core/structs/event-store';
import { formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { event } from 'jquery';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { Router } from '@angular/router';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { thumbnailsDownIcon } from '@progress/kendo-svg-icons';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';

@Component({
  selector: 'app-incoming-qty-recieve',
  templateUrl: './incoming-qty-recieve.component.html',
  styleUrls: ['./incoming-qty-recieve.component.css'],
})
export class IncomingQtyRecieveComponent implements OnInit {
  constructor(
    private _stockOutToStock: StockOutToStock,
    private _intialBalanceService:IntialBalnceService,
    public dialog: MatDialog,
    private _notification: NotificationServiceService,
    private _router: Router
  ) {}
  IncomingData: Array<any> = [];
  rowData$!: Observable<any[]>;
  rowItemsData$!: Observable<any[]>;
  gridApi: any;
  columnApi: any;
  getRowID: any;
  isEnglish:boolean=false
  @ViewChild("agGrid") agGrid;
  indexesOFdoc;

  @ViewChild('myInput') input!: ElementRef;
  @ViewChild('myInput1') input1!: ElementRef;
  colDefEn:ColDef[] =[
    {field:"n_documented_no" ,
     headerName:"Trans Doc"


    } ,
    {field:"n_document_no",
    headerName:'Doc No'

   },
    {
     field:"d_transaction_date",
     headerName:"Date"

   },
   {
     field:"n_transaction_total_qty",
     headerName:"Qty"

   },
   {
     field:"b_recive_done",

     headerName:"Recive",
     checkboxSelection:true,
   showDisabledCheckboxes:true,


     headerCheckboxSelection:true,



   },
   {
     field:"s_store_name",

     headerName:"From"

   },
   {
     field:"s_branch_name",
     headerName:"Branch Name"

   },
   {
     field:'sc_Items_Transactions_Details',

     hide:true
   },
   {
     field:'n_transaction_currency_id',
     hide:true
   }




   ];
  colDef:ColDef[] =[
    {field:"n_documented_no" ,
     headerName:"رقم الحركة"


    } ,
    {field:"n_document_no",
    headerName:'رقم السند'

   },
    {
     field:"d_transaction_date",
     headerName:"التاريخ"

   },
   {
     field:"n_transaction_total_qty",
     headerName:"الكمية"

   },
   {
     field:"b_recive_done",

     headerName:"استلام",
     checkboxSelection:true,
   showDisabledCheckboxes:true,


     headerCheckboxSelection:true,



   },
   {
     field:"s_store_name",

     headerName:"محول من مخزن "

   },
   {
     field:"s_branch_name",
     headerName:"الفرع"

   },
   {
     field:'sc_Items_Transactions_Details',

     hide:true
   },
   {
     field:'n_transaction_currency_id',
     hide:true
   }




   ];
   colDefItems:ColDef[] =[
     {
       field:"s_item_id" ,

       headerName:"كود الصنف"

     },
     {
       field:"s_unit_name" ,

       headerName:"اسم الوحدة"

     },
     {
       field:"n_qty" ,

       headerName:"الكمية"

     },
     {
       field:"n_unit_price" ,

       headerName:"السعر"
     },
     {
       field:"n_transaction_value" ,
       headerName:"الاجمالي"
     }
   ]
   colDefItemsEn:ColDef[] =[
    {
      field:"s_item_id" ,

      headerName:"Item Code"

    },
    {
      field:"s_unit_name" ,

      headerName:"Unit Name"

    },
    {
      field:"n_qty" ,

      headerName:"Qty"

    },
    {
      field:"n_unit_price" ,

      headerName:"Price"
    },
    {
      field:"n_transaction_value" ,
      headerName:"Total"
    }
  ]
   data!:any;
   stores:any=[];

  ngOnInit(): void {
    debugger;
  this.isEnglish=LangSwitcher.CheckLan();
    this.rowData$ = this._stockOutToStock.getIncomingQty(1000000);
    this.rowItemsData$ = this._stockOutToStock.getTransDetails(1000000);
    this._intialBalanceService.getStores().subscribe((data)=>{
      this.stores=data; 
    })
LangSwitcher.translatefun();
  }
  OnGridReady(params) {
    debugger;

    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  } 

  loadItems() {
    const dialogRef = this.dialog.open(StoresPopUpComponent, {
      width: '700px',
      height: '600px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((res) => {
      debugger;
      this.input.nativeElement.value = res.store_name;
      this.input1.nativeElement.value = res.store_id;
    });
    
    LangSwitcher.translateData(1);
  }
  getStoreByNow(value:any){
    
    setTimeout(()=>{
      debugger 
      console.log(value);
      const arrOfStores=this.stores.filter((data)=>data.n_store_id==value || data.s_store_name.includes(value));
       if(arrOfStores.length>0){
         
           this.input.nativeElement.value=arrOfStores[0].s_store_name;
           this.input1.nativeElement.value =arrOfStores[0].n_store_id;
       }

    },100)
  }
   
  getStoresRecievable() {

    debugger;
    var te=  this.input1.nativeElement.value;
    
    this.rowData$ = this._stockOutToStock.getIncomingQty(
      this.input1.nativeElement.value
    )

    this.rowData$.subscribe((data) => {
      debugger;
      if(data.length <= 0){
        if(this.isEnglish)
        this._notification.ShowMessage('There is not a store for that store',3)
      else
        this._notification.ShowMessage("لا يوجد عناصر لهذا المخزن", 3);
        return;
      }
    })
  }
  getItemsData(Itemsdata) {
    this.rowItemsData$ = this._stockOutToStock.getTransDetails(
      Itemsdata.data.n_document_no
    );
  }

  importing() {
    console.log(this.agGrid.api.getSelectedRows())
    debugger;
    if(this.input1.nativeElement.value=="" || this.input1.nativeElement.value==null)
    {
      if(this.isEnglish)
       this._notification.ShowMessage('Choose a store ',3)
      else
      this._notification.ShowMessage("اختر مخزن لديه حركات", 3)
      return
    }
    for(let i =0;i<this.gridApi.selectionService.selectedNodes.length;i++)
    {
      if(this.gridApi.selectionService.selectedNodes[this.gridApi.selectionService.getSelectedRow()]===undefined)
        {
          if(this.isEnglish)
          this._notification.ShowMessage('choose journal',3)
        else
        this._notification.ShowMessage(" اختر حركة  ",3)
        return
        }

    }


    console.log(this.gridApi.selectionService.selectedNodes);

    let header = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    this._stockOutToStock
      .importing(JSON.stringify(this.gridApi.getSelectedRows()), header)
      .subscribe((res) => {
        if (res.status == 1) {
          if(this.isEnglish)
           this._notification.ShowMessage('Recieved successfully',1)
          else
            this._notification.ShowMessage('تم التسليم بنجاح', 1);
          this._router.navigate(['/sc/importingTransactions']);
        }
        else
         this._notification.ShowMessage(res.msg, 3);

      });
    }
  getRecived($event) {
    console.log(this.gridApi.getSelectedRows());
  }

}
