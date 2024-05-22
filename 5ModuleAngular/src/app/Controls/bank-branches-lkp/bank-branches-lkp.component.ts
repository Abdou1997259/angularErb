import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BankBranchesLKPService } from 'src/app/Core/Api/LookUps/bank-branches.service';

@Component({
  selector: 'app-bank-branches-lkp',
  templateUrl: './bank-branches-lkp.component.html',
  styleUrls: ['./bank-branches-lkp.component.css']
})
export class BankBranchesLkpComponent implements OnInit {
  branchesList!: any;
  currencyCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _service: BankBranchesLKPService, public dialogRef: MatDialogRef<BankBranchesLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any)
  {

  }

  ngOnInit(): void {
    this.GetBankBranchesLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  GetBankBranchesLKP(page: number = 0) {
    this.showspinner = true;
    this._service.GetBankBranchesLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger;
      this.branchesList = data.modelNameLST;
      this.currencyCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.GetBankBranchesLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetBankBranchesLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
