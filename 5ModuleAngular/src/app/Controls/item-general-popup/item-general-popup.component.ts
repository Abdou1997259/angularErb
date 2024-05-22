import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocaleService } from 'ag-grid-community';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';


@Component({
  selector: 'app-item-general-popup',
  templateUrl: './item-general-popup.component.html',
  styleUrls: ['./item-general-popup.component.css']
})
export class ItemGeneralPopupComponent implements OnInit {

  List!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  unitsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;
  isEnglish:boolean=false;

  constructor(private _SERVICE: GenerealLookup, public dialogRef: MatDialogRef<ItemGeneralPopupComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getItemsLKP(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getItemsLKP(page: number = 0) {
    this.showspinner = true;
    this._SERVICE.getItemsLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.List = data.modelNameLST;
      this.unitsCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getItemsLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getItemsLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }

}
