import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ImportOrderService } from 'src/app/Core/Api/AP/import-order.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-import-order-list',
  templateUrl: './import-order-list.component.html',
  styleUrls: ['./import-order-list.component.css']
})
export class ImportOrderListComponent  extends BaseComponent implements OnInit {
  importOrdersList: any;
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
  idColName:any="n_import_no";
  formID:any=419;
  isEnglish:boolean=false;
  lang:any;
  
  constructor(private _service: ImportOrderService
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
    this.GetAllImportOrdersLKP(this.pageNumber);

   LangSwitcher.translatefun();
   this.isEnglish=LangSwitcher.CheckLan()

  }

  GetAllImportOrdersLKP(page: number = 0) {
    this.showspinner = true;
    this._service.GetImportsOrdersLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.importOrdersList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllImportOrdersLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllImportOrdersLKP(this.pageNumber);
    }, 1000);
  }

  DeleteRow() {
    debugger
    this._service.Delete(this.rowId).subscribe((data)=>{
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);
    else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetAllImportOrdersLKP(this.pageNumber);
      }
    });
  }
 

}
