import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { SCstockOutService } from 'src/app/Core/Api/SC/sc-stock-out.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-sc-stock-out-list',
  templateUrl: './sc-stock-out-list.component.html',
  styleUrls: ['./sc-stock-out-list.component.css']
})
export class ScStockOutListComponent extends BaseComponent implements OnInit {
  docNo: any; 
  docDate: any; 
  empName: any;  
  accName: any;  
  storeName: any;  
  description: any; 

  stockOutTranactionsLST!: any;
  stockOutTranactionsCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  searchString: any;
  showspinner: boolean = false;
  isData: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_document_no";
  formID:any=213;
  lang:any;
  isEnglish:boolean=false

  constructor(private _stockOutService: SCstockOutService, private _notificationService: NotificationServiceService,
    private userservice: UserService, private _route: ActivatedRoute) {
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
    this.getStockOutTranactionsLKP(this.pageNumber);
    this.isEnglish= LangSwitcher.CheckLan()
    LangSwitcher.translatefun();
  }

  getStockOutTranactionsLKP(page: number = 0) {
    this.showspinner = true;
    this._stockOutService.GetStockOutTranactionsLKP(page, this.pageSize, this.docNo, this.docDate, this.empName, this.accName, this.storeName, this.description).subscribe((data) => {
      if(data.modelNameLST.length > 0) {
        this.isData = true;
      } else{
        this.isData = false;
      }
      this.stockOutTranactionsLST = data.modelNameLST;
      this.stockOutTranactionsCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1)
    })
  
  }
  
  pageChanged(page: any){
    this.getStockOutTranactionsLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getStockOutTranactionsLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  DeleteRow() {
    debugger
    this._stockOutService.DeleteTransaction(this.rowId).subscribe((data)=>{
      debugger;
      this.showspinner=false;
      this. _notificationService.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.getStockOutTranactionsLKP(this.pageNumber);
      }
    });
  }
}
