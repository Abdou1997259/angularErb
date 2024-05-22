import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplierPop } from 'src/app/Controls/popupservices/supplierPop.service';
import { Supplier } from 'src/app/Core/Api/AP/supplier.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-purchase-man',
  templateUrl: './purchase-man.component.html',
  styleUrls: ['./purchase-man.component.css']
})
export class PurchaseManComponent implements OnInit {

  itemsDetailsList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  itemsDetailsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _SERVICE: Supplier, public dialogRef: MatDialogRef<PurchaseManComponent>,
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
    this._SERVICEPOP.GetPurchaseMenLKP(page, this.pageSize, this.searchString).subscribe((data) => {
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
