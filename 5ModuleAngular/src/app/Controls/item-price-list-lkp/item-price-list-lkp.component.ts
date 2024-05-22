import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';

@Component({
  selector: 'app-item-price-list-lkp',
  templateUrl: './item-price-list-lkp.component.html',
  styleUrls: ['./item-price-list-lkp.component.css']
})
export class ItemPriceListLKPComponent implements OnInit {
  List!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  unitsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;
  isEnglish:boolean=false;

  constructor(private _SERVICE: GenerealLookup, public dialogRef: MatDialogRef<ItemPriceListLKPComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) 
  { 

  }

  ngOnInit(): void 
  {
    this.GetItemPriceList(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  GetItemPriceList(page: number = 0) {
    this.showspinner = true;
    this._SERVICE.GetItemPriceList(page, this.pageSize, this.searchString).subscribe((data) => {
      this.List = data.modelNameLST;
      this.unitsCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.GetItemPriceList(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetItemPriceList(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
