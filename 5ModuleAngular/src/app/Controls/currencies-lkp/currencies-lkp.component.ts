import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';

@Component({
  selector: 'app-currencies-lkp',
  templateUrl: './currencies-lkp.component.html',
  styleUrls: ['./currencies-lkp.component.css']
})
export class CurrenciesLkpComponent implements OnInit {
  currencyList!: any;
  currencyCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _currencyService: CurrencyLKPService, public dialogRef: MatDialogRef<CurrenciesLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getCurrenciesLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getCurrenciesLKP(page: number = 0) {
    this.showspinner = true;
    this._currencyService.GetCurrenciesLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger;
      this.currencyList = data.modelNameLST;
      this.currencyCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getCurrenciesLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getCurrenciesLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
