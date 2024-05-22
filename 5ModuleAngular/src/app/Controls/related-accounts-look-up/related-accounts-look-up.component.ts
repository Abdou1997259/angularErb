import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { StoresLookUpComponent } from '../stores-look-up/stores-look-up.component';
import { ScStockInAddComponent } from 'src/app/SC/StockIn/sc-stock-in-add/sc-stock-in-add.component';

@Component({
  selector: 'app-related-accounts-look-up',
  templateUrl: './related-accounts-look-up.component.html',
  styleUrls: ['./related-accounts-look-up.component.css']
})
export class RelatedAccountsLookUpComponent implements OnInit {

  relatedAccList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  accountsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _stockInService: SCstockInService, public dialogRef: MatDialogRef<ScStockInAddComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getStoresLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getStoresLKP(page: number = 0) {
    this.showspinner = true;
    this._stockInService.GetRelatedAccLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.relatedAccList = data.modelNameLST;
      this.accountsCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getStoresLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getStoresLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
