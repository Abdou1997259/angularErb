import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { StockIntoStock } from 'src/app/Core/Api/SC/stockINTOStock';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-importing-transactions',
  templateUrl: './importing-transactions.component.html',
  styleUrls: ['./importing-transactions.component.css']
})
export class ImportingTransactionsComponent extends BaseComponent implements OnInit {
 // constructor begin
  importsLST!: any;
  importsCount!: any;
  stockData;
  DocumentedID:any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  searchString: any;
  showspinner: boolean = false;
  isData: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_document_no";
  formID:any=212;
  lang:any;
  isEnglish:boolean=false
  constructor(
    private _stockIntoStock:StockIntoStock  ,
    private _router  : Router ,
    private _route  : ActivatedRoute,
    private    userservice:UserService,
    private dialogRef:MatDialog,
    private _notification: NotificationServiceService
  ) {
    super(_route.data,userservice);
    this.dtOptions = {
      pageLength: 7,
      processing: true,
      searching: false,
      destroy: true,
      ordering: false
    };
   }
   //constructor end


//ngONInit begin
  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadImports(this.pageNumber);
    this.isEnglish=LangSwitcher.CheckLan();
    LangSwitcher.translatefun();

  }
//ngONInit end



//function declartions begin

  LoadImports(page: number = 0)
  {
    this.showspinner = true;
      this._stockIntoStock.GetAllImportsLKP(page, this.pageSize, this.searchString).subscribe((data)=>{
        this.importsLST = data.modelNameLST;
        this.importsCount = data.totalItems;
        this.showspinner = false;
       LangSwitcher.translateData(1);
      });
  }

  pageChanged(page: any){
    this.LoadImports(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadImports(this.pageNumber);
    }, 1000);
  }

  DeleteRow()
  {
    this._stockIntoStock.Delete(this.rowId).subscribe((data:any)=>{
      this.showspinner=false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status)
    else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.LoadImports(this.pageNumber);
      }
    });
  }

  getRowID(rowNo,documeentedNo) {
    this.rowId = rowNo;
    this.DocumentedID=documeentedNo;
  }
  ////// translate into English
 
}
