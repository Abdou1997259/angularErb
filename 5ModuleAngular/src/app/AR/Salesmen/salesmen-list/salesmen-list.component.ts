import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SalersService } from 'src/app/Core/Api/AR/salers.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-salesmen-list',
  templateUrl: './salesmen-list.component.html',
  styleUrls: ['./salesmen-list.component.css']
})
export class SalesmenListComponent extends BaseComponent implements OnInit {
  salersList: any;
  PagingCount: any;

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
  idColName:any="n_salesman_id";
  formID:any=304;
  lang:any;

  constructor(private _service: SalersService
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
    this.GetAllSalersLKP(this.pageNumber);
  LangSwitcher.translatefun();
  this.isEnglish=LangSwitcher.CheckLan();
  }

  GetAllSalersLKP(page: number = 0)
  {
    this.showspinner = true;
    this._service.GetSalersLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger
      this.salersList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
      
      LangSwitcher.translateData(1)
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
  }

  pageChanged(page: any){
    this.GetAllSalersLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllSalersLKP(this.pageNumber);
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
        this.GetAllSalersLKP(this.pageNumber);
      }
    });
  }

}
