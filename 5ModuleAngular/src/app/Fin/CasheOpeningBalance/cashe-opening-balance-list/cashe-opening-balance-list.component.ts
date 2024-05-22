import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CashOpeningBalanceService } from 'src/app/Core/Api/FIN/cash-opening-balance.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-cashe-opening-balance-list',
  templateUrl: './cashe-opening-balance-list.component.html',
  styleUrls: ['./cashe-opening-balance-list.component.css']
})
export class CasheOpeningBalanceListComponent extends BaseComponent implements OnInit {
  cashOpeningBalanceList: any;
  PagingCount: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=509;
  isEnglish:boolean=false;
  lang:any;

  docNo: any;
  financialYear: any;
  docDate: any;
  cashType: any;
  description: any;

  constructor(private _service: CashOpeningBalanceService
    ,private _notification: NotificationServiceService
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService) {
      super(_route.data,userservice);
     }

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.GetAllCasheBalancesLKP(this.pageNumber);
    LangSwitcher.translatefun();
  }

  GetAllCasheBalancesLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetAllCasheBalancesLKP(page, this.pageSize, this.docNo, this.financialYear, this.docDate, this.cashType, this.description).subscribe((data) => {
      this.cashOpeningBalanceList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllCasheBalancesLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllCasheBalancesLKP(this.pageNumber);
    }, 1000);
  }

  DeleteRow() {
    this._service.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status)
    else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetAllCasheBalancesLKP(this.pageNumber);
      }
    });
  }

}
