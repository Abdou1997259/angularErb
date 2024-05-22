import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuppliersTypesLKPService } from 'src/app/Core/Api/LookUps/suppliers-types-lkp.service';

@Component({
  selector: 'app-suppliers-types-lkp',
  templateUrl: './suppliers-types-lkp.component.html',
  styleUrls: ['./suppliers-types-lkp.component.css']
})
export class SuppliersTypesLkpComponent implements OnInit {
  suppliersTypesList!: any;
  suppliersTypesCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _service: SuppliersTypesLKPService, public dialogRef: MatDialogRef<SuppliersTypesLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getSuppliersTypesLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getSuppliersTypesLKP(page: number = 0) {
    this.showspinner = true;
    this._service.GetSuppliersTypesLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.suppliersTypesList = data.modelNameLST;
      this.suppliersTypesCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getSuppliersTypesLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getSuppliersTypesLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
