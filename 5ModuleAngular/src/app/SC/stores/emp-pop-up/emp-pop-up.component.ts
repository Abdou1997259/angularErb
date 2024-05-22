import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { StoreService } from 'src/app/Core/Api/SC/store.service';

@Component({
  selector: 'app-emp-pop-up',
  templateUrl: './emp-pop-up.component.html',
  styleUrls: ['./emp-pop-up.component.css']
})
export class EmpPopUpComponent implements OnInit {
  empData!: any;
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
 isEnglish:boolean=false;
  constructor(private  _StoreService : StoreService
    ,public dialogRef: MatDialogRef<EmpPopUpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }

  ngOnInit(): void {
    this.getAllData(1);
    LangSwitcher.translatefun();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }
  getAllData(page:number=0) {
    this.showspinner=true;
      this._StoreService.getAllEmpLKP(page, this.pageSize, this.searchString).subscribe(data=>{
        this.empData = data.modelNameLST;
        this.totalItems = data.totalItems;
        this.showspinner=false;
      });
  };

  pageChanged(page: any){
    this.getAllData(page.page);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  keyupTimer:any;
  DoSearch(){
      clearTimeout(this.keyupTimer);
      this.keyupTimer =    setTimeout(() => {
          this.getAllData(this.pageNumber);
      }, 1000);
  }
}
