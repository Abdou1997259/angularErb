import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomerClassesService } from 'src/app/Core/Api/AR/customer-classes.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-customer-classes-list',
  templateUrl: './customer-classes-list.component.html',
  styleUrls: ['./customer-classes-list.component.css']
})
export class CustomerClassesListComponent extends BaseComponent implements OnInit {
  customerClassesList: any;
  PagingCount: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  searchString: any;
  isEnglish:boolean=false;
  showspinner: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;

  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_Id";
  formID:any=3992;
  lang:any;

  constructor(private _service: CustomerClassesService
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
    this.GetAllCustomerClassesLKP(this.pageNumber);
    LangSwitcher.translatefun();
   this.isEnglish=LangSwitcher.CheckLan();
  }

  GetAllCustomerClassesLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetAllCustomerClassesLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger
      this.customerClassesList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
    LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllCustomerClassesLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllCustomerClassesLKP(this.pageNumber);
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
        this.GetAllCustomerClassesLKP(this.pageNumber);
      }
    });
  }

}
