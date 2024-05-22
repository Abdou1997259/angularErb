import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SalesReturnesService } from 'src/app/Core/Api/AR/sales-returnes.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-sales-returnes-list',
  templateUrl: './sales-returnes-list.component.html',
  styleUrls: ['./sales-returnes-list.component.css']
})
export class SalesReturnesListComponent extends BaseComponent implements OnInit {
  salesReturnesList: any;
  PagingCount: any;

  docNo:any;
  docDate:any;
  docType:any;
  store:any;
  customer:any;
  saler:any;
  currency:any;
  description:any;

  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  invType: any;
  isEnglish:boolean=false;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_document_no";
  formID:any=312;
  lang:any;

  constructor(private _service: SalesReturnesService
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
    this.GetSalesReturnsLKP();

   LangSwitcher.translatefun()
  this.isEnglish=LangSwitcher.CheckLan();
  }

  GetSalesReturnsLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetSalesReturnsLKP().subscribe((data) => {
      this.salesReturnesList = data;
      this.showspinner = false;
      LangSwitcher.translateData(1)
    });
  }

  getRowId(rowNo, invType) {
    this.rowId = rowNo;
    this.invType = invType;
   }

  pageChanged(page: any){
    this.GetSalesReturnsLKP(page.page);
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetSalesReturnsLKP(this.docNo, this.docDate, this.docType, this.store, this.customer, this.saler, this.currency, this.description).subscribe((data)=>{
        this.salesReturnesList=data;
      })
    }, 1000);
  }

  DeleteRow() {
    debugger
    this._service.Delete(this.rowId, this.invType).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);
      else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetSalesReturnsLKP();
      }
    });
  }

}
