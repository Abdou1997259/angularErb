import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomersService } from 'src/app/Core/Api/AR/customers.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent  extends BaseComponent implements OnInit {
  customersList: any;
  PagingCount: any;

  customerId: any;
  customerName: any;
  customerType: any;
  supplierName: any;
  area: any;
  taxNumber: any;
  address: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  searchString: any;

  showspinner: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_customer_id";
  formID:any=396;
  isEnglish:boolean=false;
  lang:any;

  constructor(private _service: CustomersService
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
    this.GetAllCustomersLKP(this.pageNumber);
    
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  GetAllCustomersLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetCustomersLKP(page, this.pageSize, this.customerId, this.customerName, this.customerType, this.supplierName, this.area, this.taxNumber, this.address).subscribe((data) => {
      this.customersList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
      
     LangSwitcher.translateData(1)
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllCustomersLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllCustomersLKP(this.pageNumber);
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
        this.GetAllCustomersLKP(this.pageNumber);
      }
    });
  }

  
}
