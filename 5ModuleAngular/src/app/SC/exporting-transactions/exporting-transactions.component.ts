import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { Subject } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-exporting-transactions',
  templateUrl: './exporting-transactions.component.html',
  styleUrls: ['./exporting-transactions.component.css']
})
export class ExportingTransactionsComponent extends BaseComponent  implements OnInit {
  tranactionsLST!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  tranactionsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;

  constructor(
    private _stockOutToStock:StockOutToStock,
    private _router  : Router ,private _route  : ActivatedRoute,
    private    userservice:UserService,privatedialog: MatDialog,
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
 @ViewChild('closebutton') closebutton;
 stockData;
 ReportUrl:any;
 DocumentedID:any;
 IsmodelShow:any;
 comp:any;
 year:any;
 branch:any;
 idColName:any="n_document_no";
 formID:any=213;
 isEnglish:boolean=false;
 lang:any;

 override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadTransactions(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish= LangSwitcher.CheckLan();
  }

  Show(id:number)
  {
    const dialogRef = this.dialogRef.open(PopUpComponent,{
      width:'700px',
      height:'600px',
      data:{'id':id}
    });
  }

  LoadTransactions(page: number = 0)
  {
    this.showspinner = true;
    this._stockOutToStock.GetAllTransactionsLKP(page, this.pageSize, this.searchString).subscribe((data)=>{
      this.tranactionsLST = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(0);
    });
  }

  pageChanged(page: any){
    this.LoadTransactions(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadTransactions(this.pageNumber);
    }, 1000);
  }

  DeleteRow()
  {
    this._stockOutToStock.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      this. _notification.ShowMessage(data.msg, data.status);
      if(data.status==1){
        this.LoadTransactions(this.pageNumber);
      }
    });
  }

  getRowID(rowNo,documeentedNo) {
    this.rowId = rowNo;
    this.DocumentedID=documeentedNo;
  }


}
