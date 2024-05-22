import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PriceListService } from 'src/app/Core/Api/AR/price-list.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-pricelist-list',
  templateUrl: './pricelist-list.component.html',
  styleUrls: ['./pricelist-list.component.css']
})
export class PricelistListComponent extends BaseComponent implements OnInit  {

priceListData: any;
tranactionsCount!: any;
  PagingCount: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;

  showspinner: boolean = false;

  menuId:any;
  menuName:any;
  startDate:any;
  EndDate:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  isEnglish:boolean=false;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_salesman_id";
  formID:any=304;
  lang:any;

  constructor(private _service: PriceListService
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
    this.GetAllPriceListLKP(this.pageNumber);
  LangSwitcher.translatefun();
  this.isEnglish=LangSwitcher.CheckLan();
  }

  GetAllPriceListLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetSalersLKP(page, this.pageSize, this.menuId, this.menuName, this.startDate, this.EndDate).subscribe((data) => {
      this.priceListData = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      LangSwitcher.translateData(1)
      this.showspinner = false;
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
  }

  pageChanged(page: any){
    this.GetAllPriceListLKP(page.page);
  }

  keyupTimer:any;
  DoSearch() {
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllPriceListLKP(this.pageNumber);
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
        this.GetAllPriceListLKP(this.pageNumber);
      }
    });
  }


}
