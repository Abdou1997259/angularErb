import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SuppliersOpeningBalanceService } from 'src/app/Core/Api/AP/suppliers-opening-balance.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-suppliers-opening-balance-list',
  templateUrl: './suppliers-opening-balance-list.component.html',
  styleUrls: ['./suppliers-opening-balance-list.component.css']
})
export class SuppliersOpeningBalanceListComponent  extends BaseComponent implements OnInit {
  suppliersBalanceList: any;
  suppliersBalancePagingCount: any;

  docNo: any;
  docDate: any;
  finYear: any;
  currency: any;
  supplierType: any;

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
  formID:any=443;
  lang:any;

  constructor(private _service: SuppliersOpeningBalanceService
    , private _notification: NotificationServiceService
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
    this.GetAllSuppliersOPeningBalanceList(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  GetAllSuppliersOPeningBalanceList(page: number = 0) {
    this.showspinner = true;
    this._service.GetSuppliersOpeningBalanceLKP(page, this.pageSize, this.docNo, this.docDate, this.finYear, this.currency, this.supplierType).subscribe((data) => {
      this.suppliersBalanceList = data.modelNameLST;
      this.suppliersBalancePagingCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllSuppliersOPeningBalanceList(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllSuppliersOPeningBalanceList(this.pageNumber);
    }, 1000);
  }

  DeleteRow() {
    this._service.Delete(this.rowId).subscribe((data)=>{
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetAllSuppliersOPeningBalanceList(this.pageNumber);
      }
    });
  }


  
}
