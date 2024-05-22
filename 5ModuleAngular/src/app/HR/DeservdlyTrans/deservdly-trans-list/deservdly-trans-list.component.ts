import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { DeservdlyTransService } from 'src/app/Core/Api/HR/deservdly-trans.service';

@Component({
  selector: 'app-deservdly-trans-list',
  templateUrl: './deservdly-trans-list.component.html',
  styleUrls: ['./deservdly-trans-list.component.css']
})
export class DeservdlyTransListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  DeservdlyTransData: any[] = [];
  tranactionsCount!: any;

  showspinner: boolean = false;
  isEnglish: boolean = false;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;

  docNo: any;
  docDate: any;
  transYear: any;
  transMonth: any;
  notes: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;

  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  idColName: any = "n_doc_no";
  formID: any = 1436;

  constructor(private _service: DeservdlyTransService, private userservice: UserService, private _router: Router,
    private _route: ActivatedRoute, private _notification: NotificationServiceService)
  {
    super(_route.data,userservice);
  }

  override ngOnInit(): void {
    this.ReportUrl = ApiConfig.ReportUrl;
    this.lang = this.userservice.GetLanguage();
    this.comp = this.userservice.GetComp();
    this.year = this.userservice.GetYear();
    this.branch = this.userservice.GetBranch();
    this.LoadDeservdlyTrans(this.pageNumber);
    LangSwitcher.translatefun();
  }

  LoadDeservdlyTrans(page: number = 0) {
    this.DeservdlyTransData = [];
     this.showspinner=true;
    this._service.GetAllDeservdlyTrans(page, this.pageSize, this.docNo, this.docDate, this.transYear, this.transMonth, this.notes).subscribe((data)=>{
      this.DeservdlyTransData = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      LangSwitcher.translateData(1);
       this.showspinner = false;
    });
  }

  keyupTimer:any;
  DoSearch() {
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadDeservdlyTrans(this.pageNumber);
    }, 1000);
  }

  deleteRow()
  {
    this._service.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg, data.status);
      else
        this._notification.ShowMessage(data.msg, data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.LoadDeservdlyTrans(this.pageNumber);
      }
    });
  }

  pageChanged(page: any){
    this.LoadDeservdlyTrans(page.page);
  }

  getRowID(rowNo) {
    this.rowId = rowNo;
  }
}
