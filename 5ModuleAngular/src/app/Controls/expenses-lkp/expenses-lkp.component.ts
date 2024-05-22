import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseInvoiceService } from 'src/app/Core/Api/AP/purchase-invoice.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-expenses-lkp',
  templateUrl: './expenses-lkp.component.html',
  styleUrls: ['./expenses-lkp.component.css']
})
export class ExpensesLkpComponent implements OnInit {

  constructor(private  _PurchaseInvoiceService : PurchaseInvoiceService
    ,public dialogRef: MatDialogRef<ExpensesLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }
  currentPage!:number;
  page = 1;
  items: any=[];
  itemsPerPage = 10;
  totalItems : any;
  KeyWord:any;
  ngOnInit(): void {
    this.getAllData();
    LangSwitcher.translatefun();
    LangSwitcher.translateData(1);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }
  getAllData(page:number=0) {

    this._PurchaseInvoiceService.GetExpenses('').subscribe(data=>{
      debugger;
      this.items =  data;
    });

    };

    pageChanged(page: any){
      this.getAllData();
    }
      keyupTimer:any;
    DoSearch(){
      clearTimeout(this.keyupTimer);
      this.keyupTimer =    setTimeout(() => {
        this._PurchaseInvoiceService.GetExpenses(this.KeyWord).subscribe(data=>{
          this.items =  data;
        });
      }, 1000);


    }

    onCloseClick() {
      this.dialogRef.close();
    }
}
