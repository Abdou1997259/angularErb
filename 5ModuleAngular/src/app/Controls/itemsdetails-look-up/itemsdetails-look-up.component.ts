import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-itemsdetails-look-up',
  templateUrl: './itemsdetails-look-up.component.html',
  styleUrls: ['./itemsdetails-look-up.component.css']
})
export class ItemsdetailsLookUpComponent implements OnInit {
  itemsDetailsList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  itemsDetailsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;
  isEnglish:any;
  isOpen: boolean = true;

  constructor(private _stockInService: SCstockInService, public dialogRef: MatDialogRef<ItemsdetailsLookUpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getItemsDetailsLKP(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getItemsDetailsLKP(page: number = 0) {
    var storeId = this.data.storeId;
    this.showspinner = true;
    this._stockInService.GetItemsLKP(page, this.pageSize, this.searchString, storeId).subscribe((data) => {
      this.itemsDetailsList = data.modelNameLST;
      this.itemsDetailsCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getItemsDetailsLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getItemsDetailsLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
