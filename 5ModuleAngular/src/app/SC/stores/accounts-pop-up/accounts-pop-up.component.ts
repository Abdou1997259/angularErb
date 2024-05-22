import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { StoreService } from 'src/app/Core/Api/SC/store.service';

@Component({
  selector: 'app-accounts-pop-up',
  templateUrl: './accounts-pop-up.component.html',
  styleUrls: ['./accounts-pop-up.component.css']
})
export class AccountsPopUpComponent implements OnInit {
  accountsData!: any;
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
    ,public dialogRef: MatDialogRef<AccountsPopUpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }

  ngOnInit(): void {
    this.getAllData(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getAllData(page:number=0) {
    this.showspinner=true;
    this._StoreService.getAccountsLKP(page, this.pageSize, this.searchString).subscribe(data=>{
        this.accountsData = data.modelNameLST;
        this.totalItems = data.totalItems;
        this.showspinner=false;
        LangSwitcher.translateData(1);
    });
  };

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
 
}
