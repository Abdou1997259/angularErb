import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SupplierPop } from 'src/app/Controls/popupservices/supplierPop.service';
import { SupplierConfiguartion } from 'src/app/Core/Api/AP/supplier-configruation.service';
import { AccountSupplierComponent } from '../account-supplier/account-supplier.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-accounts-primary',
  templateUrl: './accounts-primary.component.html',
  styleUrls: ['./accounts-primary.component.css']
})
export class AccountsPrimaryComponent implements OnInit {
  itemsDetailsList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  itemsDetailsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _SERVICE: SupplierConfiguartion, public dialogRef: MatDialogRef<AccountSupplierComponent>,
    private _SERVICEPOP:SupplierPop
    
    ) { }

  ngOnInit(): void {

    this.getItemsDetailsLKP(this.pageNumber);
    LangSwitcher.translatefun();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getItemsDetailsLKP(page: number = 0) {


    this.showspinner = true;
    this._SERVICEPOP.getAccountsPrimary(page, this.pageSize, this.searchString).subscribe((data) => {
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


}
