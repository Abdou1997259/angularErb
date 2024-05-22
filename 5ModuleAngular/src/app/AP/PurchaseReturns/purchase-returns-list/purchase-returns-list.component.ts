import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PurchaseReturnsService } from 'src/app/Core/Api/AP/purchase-returns.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-purchase-returns-list',
  templateUrl: './purchase-returns-list.component.html',
  styleUrls: ['./purchase-returns-list.component.css']
})
export class PurchaseReturnsListComponent  extends BaseComponent implements OnInit {
  purchaseReturnsList: any;
  purchasePagingCount: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;

  showspinner: boolean = false;

  docNo:any;
  docDate:any;
  docType:any;
  supplier:any;
  saler:any;
  store:any;
  description:any;

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
  formID:any=410;
  lang:any;

  constructor(
     private _PurchaseSerive: PurchaseReturnsService,
     private _notification: NotificationServiceService
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
      this.GetAllPurchasesList(this.pageNumber);
      
      this.isEnglish=LangSwitcher.CheckLan();
  
      LangSwitcher.translatefun();
    }

  GetAllPurchasesList(page: number = 0) {
    this.showspinner = true;
    this._PurchaseSerive.GetAllPurchaseReturns(page, this.pageSize, this.docNo, this.docDate, this.docType, this.supplier, this.saler, this.store, this.description).subscribe((data) => {
      this.purchaseReturnsList = data.modelNameLST;
      this.purchasePagingCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo, invType) {
    this.rowId = rowNo;
    this.invType = invType;
   }

  pageChanged(page: any){
    this.GetAllPurchasesList(page.page);
  }

  keyupTimer:any;
  DoSearch() {
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllPurchasesList(this.pageNumber);
    }, 1000);
  }

  DeleteRow() {
    this._PurchaseSerive.Delete(this.rowId, this.invType).subscribe((data)=>{
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)

      else
        this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetAllPurchasesList(this.pageNumber);
      }
    });
  }
 
}
