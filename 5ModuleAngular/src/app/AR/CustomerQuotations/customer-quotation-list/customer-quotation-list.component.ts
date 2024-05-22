import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomerQuotationService } from 'src/app/Core/Api/AR/customer-quotations.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-customer-quotation-list',
  templateUrl: './customer-quotation-list.component.html',
  styleUrls: ['./customer-quotation-list.component.css']
})
export class CustomerQuotationListComponent  extends BaseComponent implements OnInit {
  customerQuotationsList: any;
  PagingCount: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
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
  idColName:any="n_Quotation_no";
  formID:any=317;
  lang:any;

  constructor(private _service: CustomerQuotationService
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
    this.GetAllCustomerQuotationsLKP(this.pageNumber);

   LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();

  }

  GetAllCustomerQuotationsLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetAllCustomerQuotationsLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger
      this.customerQuotationsList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllCustomerQuotationsLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllCustomerQuotationsLKP(this.pageNumber);
    }, 1000);
  }

  DeleteRow() {
    this._service.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
    if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);
    else 
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetAllCustomerQuotationsLKP(this.pageNumber);
      }
    });
  }
 
}
