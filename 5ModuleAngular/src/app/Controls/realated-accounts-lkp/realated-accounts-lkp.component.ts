import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RelatedAccountsLKPService } from 'src/app/Core/Api/LookUps/related-accounts-lkp.service';

@Component({
  selector: 'app-realated-accounts-lkp',
  templateUrl: './realated-accounts-lkp.component.html',
  styleUrls: ['./realated-accounts-lkp.component.css']
})
export class RealatedAccountsLkpComponent implements OnInit {
  accountsList!: any;
  accountsCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _relatedAccService: RelatedAccountsLKPService, public dialogRef: MatDialogRef<RealatedAccountsLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getRelatedAccountsLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getRelatedAccountsLKP(page: number = 0) {
    debugger;
    var storeId = this.data.storeId;
    this.showspinner = true;
    this._relatedAccService.GetRelatedAccountsLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger;
      this.accountsList = data.modelNameLST;
      this.accountsCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getRelatedAccountsLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getRelatedAccountsLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
