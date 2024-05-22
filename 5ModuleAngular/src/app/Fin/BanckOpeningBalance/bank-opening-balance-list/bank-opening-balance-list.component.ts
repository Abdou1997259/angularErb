import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BanckOpeningBalanceService } from 'src/app/Core/Api/FIN/banck-opening-balance.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-bank-opening-balance-list',
  templateUrl: './bank-opening-balance-list.component.html',
  styleUrls: ['./bank-opening-balance-list.component.css']
})
export class BankOpeningBalanceListComponent extends BaseComponent implements OnInit {
  banckOpeningBalanceList: any;
  PagingCount: any;

  docNo: any;
  financialYear: any;
  docDate: any;
  mainBank: any;
  description: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  isEnglish:boolean=false;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=508;
  lang:any;

  constructor(private _service: BanckOpeningBalanceService
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
    this.GetAllBankBalancesLKP(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan()

  }

  GetAllBankBalancesLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetAllBankBalancesLKP(page, this.pageSize, this.docNo, this.financialYear, this.docDate, this.mainBank, this.description).subscribe((data) => {
      this.banckOpeningBalanceList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
    LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllBankBalancesLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllBankBalancesLKP(this.pageNumber);
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
        this.GetAllBankBalancesLKP(this.pageNumber);
      }
    });
  }

}
