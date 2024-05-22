import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';

@Component({
  selector: 'app-stores-pop-up',
  templateUrl: './stores-pop-up.component.html',
  styleUrls: ['./stores-pop-up.component.css'],
})
export class StoresPopUpComponent implements OnInit {
  storeData!: any;
  dtOptions: DataTables.Settings = {};
  rowId: any;
  showspinner: boolean = false;
  itemName!: any;
  dtTrigger: Subject<any> = new Subject<any>();

  // -------- Pagination Properties -------------------------
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItems: any;
  searchString: any;
  lastAutoNumber!: number;

  constructor(
    private _initialBalanceService: IntialBalnceService,
    public dialogRef: MatDialogRef<StoresPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    this.getAllData(this.pageNumber);
    LangSwitcher.translatefun();
  }

  selectItem(item: any, itemid: any) {
    this.dialogRef.close({
      store_name: item,
      store_id: itemid,
    });
  }

  getAllData(page: number = 0) {
    this.showspinner=true;
    this._initialBalanceService.getStoresLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.storeData = data.modelNameLST;
      this.totalItems = data.totalItems;
      
      this.showspinner=false;
      LangSwitcher.translateData(1);
    });
  }

  pageChanged(page: any){
    this.getAllData(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getAllData(this.pageNumber);
    }, 1000);
  }
  
  onCloseClick() {
    this.dialogRef.close();
  }
}
