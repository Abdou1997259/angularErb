import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';

@Component({
  selector: 'app-units-look-up',
  templateUrl: './units-look-up.component.html',
  styleUrls: ['./units-look-up.component.css']
})
export class UnitsLookUpComponent implements OnInit {

  unitsList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  unitsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _stockInService: SCstockInService, public dialogRef: MatDialogRef<UnitsLookUpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getUnitsLKP(this.pageNumber);
    LangSwitcher.translatefun();
  }

  selectItem(item:any){

    this.dialogRef.close({ data:  item});
  }

  getUnitsLKP(page: number = 0) {
    this.showspinner = true;
    debugger;
    this._stockInService.GetUnitsLKP(page, this.pageSize, this.searchString, this.data.itemId).subscribe((data) => {
      debugger
      this.unitsList = data.modelNameLST;
      this.unitsCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getUnitsLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getUnitsLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
