import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { StoresLookUpComponent } from '../stores-look-up/stores-look-up.component';

@Component({
  selector: 'app-store-lookup',
  templateUrl: './store-lookup.component.html',
  styleUrls: ['./store-lookup.component.css']
})
export class StoreLookupComponent implements OnInit {

  storesList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  storesCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _SERVICE: GenerealLookup, public dialogRef: MatDialogRef<StoreLookupComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getStoresLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getStoresLKP(page: number = 0) {
    this.showspinner = true;
    this._SERVICE.getStoreLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.storesList = data.modelNameLST;
      this.storesCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getStoresLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getStoresLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
