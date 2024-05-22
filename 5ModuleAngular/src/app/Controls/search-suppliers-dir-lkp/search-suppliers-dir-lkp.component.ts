import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchSuppliersDirecionsLKPService } from 'src/app/Core/Api/LookUps/search-suppliers-dir-lkp.service';

@Component({
  selector: 'app-search-suppliers-dir-lkp',
  templateUrl: './search-suppliers-dir-lkp.component.html',
  styleUrls: ['./search-suppliers-dir-lkp.component.css']
})
export class SearchSuppliersDirLkpComponent implements OnInit {
  directionsList!: any;
  directionsCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _searchDirectionsService: SearchSuppliersDirecionsLKPService, public dialogRef: MatDialogRef<SearchSuppliersDirLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      this.getDirectionsLKP(this.pageNumber);
    }

    selectItem(item:any){
      this.dialogRef.close({ data: item });
    }

    getDirectionsLKP(page: number = 0) {
      debugger;
      var storeId = this.data.storeId;
      this.showspinner = true;
      this._searchDirectionsService.GetCurrenciesLKP(page, this.pageSize, this.searchString).subscribe((data) => {
        debugger;
        this.directionsList = data.modelNameLST;
        this.directionsCount = data.totalItems;
        this.showspinner = false;
      })
    }

    pageChanged(page: any){
      this.getDirectionsLKP(page.page);
    }

    keyupTimer:any;
    DoSearch(){
      clearTimeout(this.keyupTimer);
      this.keyupTimer = setTimeout(() => {
          this.getDirectionsLKP(this.pageNumber);
      }, 1000);
    }

    getRowId(rowNo) {
      this.rowId = rowNo;
     }

     onCloseClick() {
      this.dialogRef.close();
    }
}
