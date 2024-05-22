import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RecieveQtyService } from 'src/app/Core/Api/AP/recieve-qty.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-recieve-qty-list',
  templateUrl: './recieve-qty-list.component.html',
  styleUrls: ['./recieve-qty-list.component.css']
})
export class RecieveQtyListComponent extends BaseComponent implements OnInit {
  recieveQtyList: any;
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
  idColName:any="n_doc_no";
  formID:any=421;
  lang:any;
  isEnglish:boolean=false
  constructor(private _service: RecieveQtyService, private _notification: NotificationServiceService
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
    this.GetAllRecievedQty(this.pageNumber);
 
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  GetAllRecievedQty(page: number = 0) {
    this.showspinner = true;
    this._service.GetRecieveQtyLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      this.recieveQtyList = data.modelNameLST;
      this.PagingCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllRecievedQty(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllRecievedQty(this.pageNumber);
    }, 1000);
  }

  DeleteRow() {
    debugger
    this._service.Delete(this.rowId).subscribe((data)=>{
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
          this._notification.ShowMessage(data.Emsg,data.status)
      else
          this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetAllRecievedQty(this.pageNumber);
      }
    });
  }
  
}
