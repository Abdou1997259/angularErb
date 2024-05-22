import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ItemDetailsSalesReturnsService } from 'src/app/Core/Api/LookUps/item-details-sales-returns.service';

@Component({
  selector: 'app-items-details-sales-returns',
  templateUrl: './items-details-sales-returns.component.html',
  styleUrls: ['./items-details-sales-returns.component.css']
})
export class ItemsDetailsSalesReturnsComponent implements OnInit {

  itemId: any;
  itemName: any;
  unitId: any;
  unitName: any;

  List!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  unitsCount!: any;
  showspinner: boolean = false;
  rowId: any;
  isEnglish:boolean=false;

  constructor(private _service: ItemDetailsSalesReturnsService, public dialogRef: MatDialogRef<ItemsDetailsSalesReturnsComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any)
  {

  }

  ngOnInit(): void
  {
    this.GetItemsDetailsSalesReturn(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  GetItemsDetailsSalesReturn(page: number = 0) {
    this.showspinner = true;
    this._service.GetItemDetailsSalesReturn(page, this.pageSize, this.itemId, this.itemName, this.unitId, this.unitName).subscribe((data) => {
      this.List = data.modelNameLST;
      this.unitsCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.GetItemsDetailsSalesReturn(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetItemsDetailsSalesReturn(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
