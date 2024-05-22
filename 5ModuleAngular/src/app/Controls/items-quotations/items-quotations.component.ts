import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ItemsService } from 'src/app/_Services/Items/items.service';

@Component({
  selector: 'app-items-quotations',
  templateUrl: './items-quotations.component.html',
  styleUrls: ['./items-quotations.component.css']
})
export class ItemsQuotationsComponent implements OnInit {

  constructor(private  _itemsService : ItemsService
    ,public dialogRef: MatDialogRef<ItemsQuotationsComponent>
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
    this._itemsService.GetQuotationItems('',this.pageNumber, this.pageSize).subscribe(data=>{
      debugger;
      this.items = data.modelNameLST; 
      this.totalCount = data.totalItems;
      this.currentPage=1;
    });
  }

  pageChanged(page: any){
    this._itemsService.GetQuotationItems(this.KeyWord,page.page, this.pageSize).subscribe(data=>{
      this.items = data.modelNameLST; 
      this.totalCount = data.totalItems;
    });
  }
      
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer =    setTimeout(() => {
      this._itemsService.GetQuotationItems(this.KeyWord,this.pageNumber, this.pageSize).subscribe(data=>{
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
