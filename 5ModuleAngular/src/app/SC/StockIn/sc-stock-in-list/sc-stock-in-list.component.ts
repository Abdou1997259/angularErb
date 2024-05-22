import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { ModulesService } from 'src/app/Core/Api/System/modules.service';
import { UsersPrevService } from 'src/app/_Services/Prev/users-prev.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-sc-stock-in-list',
  templateUrl: './sc-stock-in-list.component.html',
  styleUrls: ['./sc-stock-in-list.component.css']
})
export class ScStockInListComponent extends BaseComponent implements OnInit {
  docNo: any; 
  docDate: any; 
  empName: any;  
  accName: any;  
  storeName: any;  
  description: any; 

  tranactionsLST!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  tranactionsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_document_no";
  formID:any=212;
  lang:any;
  isEnglish:boolean=false;
  constructor(
    private _stockInService: SCstockInService, 
    private _notificationService: NotificationServiceService,
    private userservice: UserService, 
    private _route: ActivatedRoute
    )
     {
    super(_route.data,userservice);
    this.dtOptions = {
      pageLength: 7,
      processing: true,
      searching: false,
      destroy: true,
      ordering: false
    };
   }

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.getTranactionsLKP(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  getTranactionsLKP(page: number = 0) {
    this.showspinner = true;
    this._stockInService.GetTransactionsLKP(page, this.pageSize, this.docNo, this.docDate, this.empName, this.accName, this.storeName, this.description).subscribe((data) => {
      this.tranactionsLST = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      this.showspinner = false; 
      LangSwitcher.translateData(1);
    })
  }
 
  pageChanged(page: any){
    this.getTranactionsLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getTranactionsLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  DeleteRow() {
    debugger
    this._stockInService.DeleteTransaction(this.rowId).subscribe((data)=>{
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
       this._notificationService.ShowMessage(data.Emsg,data.status)
      else
      this. _notificationService.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.getTranactionsLKP(this.pageNumber);
      }
    });
  }
}
