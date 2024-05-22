import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomerSalesOrderService } from 'src/app/Core/Api/AR/customer-sales-order.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-customer-sales-order-list',
  templateUrl: './customer-sales-order-list.component.html',
  styleUrls: ['./customer-sales-order-list.component.css']
})
export class CustomerSalesOrderListComponent extends BaseComponent implements OnInit {

  customerSalesOrderList: any;
  PagingCount: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;

  showspinner: boolean = false;

  orderId: any;
  orderDate: any;
  customer: any;
  store: any;
  description: any;
  total: any;
  net: any;
  confirm: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  isEnglish:boolean=false;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=313;
  lang:any;

  constructor(private _service: CustomerSalesOrderService
    , private _notification: NotificationServiceService
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService)
    {
    super(_route.data,userservice);
    }

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.GetCustomerSalesOrderLKP(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  GetCustomerSalesOrderLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetCustomerSalesOrderLKP(page, this.pageSize, this.orderId, this.orderDate, this.customer, this.store, this.description, this.total, this.net, this.confirm).subscribe((data) => {
      this.customerSalesOrderList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetCustomerSalesOrderLKP(page.page);
  }

  keyupTimer:any;
  DoSearch() {
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetCustomerSalesOrderLKP(this.pageNumber);
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
        this.GetCustomerSalesOrderLKP(this.pageNumber);
      }
    });
  }

}
