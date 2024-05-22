import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ItemsService } from 'src/app/_Services/Items/items.service';

@Component({
  selector: 'app-itemsales-lookup',
  templateUrl: './itemsales-lookup.component.html',
  styleUrls: ['./itemsales-lookup.component.css']
})
export class ItemsalesLookupComponent implements OnInit {


  constructor(private  _itemsService : ItemsService
    ,public dialogRef: MatDialogRef<ItemsalesLookupComponent>
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
    this._itemsService.GetSalesItemsLkp('',this.pageNumber, this.pageSize, this.data.storeNo).subscribe(data=>{
      this.items = data.modelNameLST; 
      this.totalCount = data.totalItems;
      this.currentPage=1;
    });
  }

  pageChanged(page: any){
    this._itemsService.GetSalesItemsLkp(this.KeyWord,page.page, this.pageSize, this.data.storeNo).subscribe(data=>{
      this.items = data.modelNameLST; 
      this.totalCount = data.totalItems;
    });
  }
      
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
      this._itemsService.GetSalesItemsLkp(this.KeyWord,this.pageNumber, this.pageSize, this.data.storeNo).subscribe(data=>{
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
