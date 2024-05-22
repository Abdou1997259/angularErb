import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CashesLKPService } from 'src/app/Core/Api/LookUps/cahses.service';

@Component({
  selector: 'app-cashes-lkp',
  templateUrl: './cashes-lkp.component.html',
  styleUrls: ['./cashes-lkp.component.css']
})
export class CashesLkpComponent implements OnInit {
  cashesList!: any;
  currencyCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _service: CashesLKPService, public dialogRef: MatDialogRef<CashesLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.GetCashesLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  GetCashesLKP(page: number = 0) {
    this.showspinner = true;
    this._service.GetCashesLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger;
      this.cashesList = data.modelNameLST;
      this.currencyCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.GetCashesLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetCashesLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
