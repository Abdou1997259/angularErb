import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CustomerSalesOrderService } from 'src/app/Core/Api/AR/customer-sales-order.service';

@Component({
  selector: 'app-items-salesorder-lkp',
  templateUrl: './items-salesorder-lkp.component.html',
  styleUrls: ['./items-salesorder-lkp.component.css']
})
export class ItemsSalesorderLkpComponent implements OnInit {


  constructor(private  _CustomerSalesOrderService : CustomerSalesOrderService
    ,public dialogRef: MatDialogRef<ItemsSalesorderLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }

  items: any=[];
  totalItems : any;
  KeyWord:any;
  totalCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  keyupTimer:any;

  ngOnInit(): void {
    this.getAllData();
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getAllData(page:number=0) {
    this._CustomerSalesOrderService.GetItemsLKP('',this.pageNumber, this.pageSize).subscribe(data=>{
      debugger
      this.items = data.modelNameLST; 
      this.totalCount = data.totalItems;
      this.currentPage=1;
    });
  }

  pageChanged(page: any){
    this._CustomerSalesOrderService.GetItemsLKP(this.KeyWord,page.page, this.pageSize).subscribe(data=>{
      this.items = data.modelNameLST; 
      this.totalCount = data.totalItems;
    });
  }
      
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
      this._CustomerSalesOrderService.GetItemsLKP(this.KeyWord,this.pageNumber, this.pageSize).subscribe(data=>{
        this.items = data.modelNameLST; 
        this.totalCount = data.totalItems;
        this.currentPage=1;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }

}
