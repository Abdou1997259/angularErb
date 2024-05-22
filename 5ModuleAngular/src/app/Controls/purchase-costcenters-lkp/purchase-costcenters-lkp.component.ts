import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseCostCentersLKPService } from 'src/app/Core/Api/LookUps/purchase-costcenter-lkp.service';

@Component({
  selector: 'app-purchase-costcenters-lkp',
  templateUrl: './purchase-costcenters-lkp.component.html',
  styleUrls: ['./purchase-costcenters-lkp.component.css']
})
export class PurchaseCostcentersLkpComponent implements OnInit {
  costCentersList!: any;
  costCentersCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _costCenters: PurchaseCostCentersLKPService, public dialogRef: MatDialogRef<PurchaseCostcentersLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      this.getCostCentersLKP(this.pageNumber);
    }

    selectItem(item:any){
      this.dialogRef.close({ data: item });
    }

    getCostCentersLKP(page: number = 0) {
      this.showspinner = true;
      this._costCenters.GetCostCenterLKP(page, this.pageSize, this.searchString).subscribe((data) => {
        debugger;
        this.costCentersList = data.modelNameLST;
        this.costCentersCount = data.totalItems;
        this.showspinner = false;
      })
    }

    pageChanged(page: any){
      this.getCostCentersLKP(page.page);
    }

    keyupTimer:any;
    DoSearch(){
      clearTimeout(this.keyupTimer);
      this.keyupTimer = setTimeout(() => {
          this.getCostCentersLKP(this.pageNumber);
      }, 1000);
    }

    getRowId(rowNo) {
      this.rowId = rowNo;
     }

     onCloseClick() {
      this.dialogRef.close();
    }
}
