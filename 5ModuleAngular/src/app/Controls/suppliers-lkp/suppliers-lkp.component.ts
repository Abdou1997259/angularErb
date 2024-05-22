import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuppliersLKPService } from 'src/app/Core/Api/LookUps/suppliers-lkp.service';

@Component({
  selector: 'app-suppliers-lkp',
  templateUrl: './suppliers-lkp.component.html',
  styleUrls: ['./suppliers-lkp.component.css']
})
export class SuppliersLkpComponent implements OnInit {
  suppliersList!: any;
  suppliersCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _suppliersService: SuppliersLKPService, public dialogRef: MatDialogRef<SuppliersLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      this.getSuppliersLKP(this.pageNumber);
    }

    selectItem(item:any){
      this.dialogRef.close({ data: item });
    }

    getSuppliersLKP(page: number = 0) {
      debugger;
      var storeId = this.data.storeId;
      this.showspinner = true;
      this._suppliersService.GetSuppliersLKP(page, this.pageSize, this.searchString).subscribe((data) => {
        debugger;
        this.suppliersList = data.modelNameLST;
        this.suppliersCount = data.totalItems;
        this.showspinner = false;
      })
    }

    pageChanged(page: any){
      this.getSuppliersLKP(page.page);
    }

    keyupTimer:any;
    DoSearch(){
      clearTimeout(this.keyupTimer);
      this.keyupTimer = setTimeout(() => {
          this.getSuppliersLKP(this.pageNumber);
      }, 1000);
    }

    getRowId(rowNo) {
      this.rowId = rowNo;
     }

     onCloseClick() {
      this.dialogRef.close();
    }
}
