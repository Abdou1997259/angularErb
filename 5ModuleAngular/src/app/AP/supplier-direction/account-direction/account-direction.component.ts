import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SupplierPop } from 'src/app/Controls/popupservices/supplierPop.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-account-direction',
  templateUrl: './account-direction.component.html',
  styleUrls: ['./account-direction.component.css']
})
export class AccountDirectionComponent implements OnInit {

  itemsDetailsList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  itemsDetailsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor( public dialogRef: MatDialogRef<AccountDirectionComponent>,
    private _SERVICEPOP:SupplierPop
    
    ) { }

  ngOnInit(): void {
    debugger
    this.getItemsDetailsLKP(this.pageNumber);
    LangSwitcher.translatefun();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getItemsDetailsLKP(page: number = 0) {
    debugger;

    this.showspinner = true;
    this._SERVICEPOP.getAccountsLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.itemsDetailsList = data.modelNameLST;
      this.itemsDetailsCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
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

}
