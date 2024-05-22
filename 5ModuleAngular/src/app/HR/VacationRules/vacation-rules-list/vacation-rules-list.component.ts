import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { VacationRulesService } from 'src/app/Core/Api/HR/vacation-rules.service';

@Component({
  selector: 'app-vacation-rules-list',
  templateUrl: './vacation-rules-list.component.html',
  styleUrls: ['./vacation-rules-list.component.css']
})
export class VacationRulesListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  VacationRulesData: any[] = [];
  tranactionsCount!: any;

  showspinner: boolean = false;
  isEnglish: boolean = false;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;

  ruleNo: any;
  ruleDescAr: any;
  ruleDescEn: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;

  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  idColName: any = "n_rule_no";
  formID: any = 1421;

  constructor(private _service: VacationRulesService, private userservice: UserService, private _router: Router,
    private _route: ActivatedRoute, private _notification: NotificationServiceService)
  {
    super(_route.data, userservice);
  }

  override ngOnInit(): void {
    this.ReportUrl = ApiConfig.ReportUrl;
    this.lang = this.userservice.GetLanguage();
    this.comp = this.userservice.GetComp();
    this.year = this.userservice.GetYear();
    this.branch = this.userservice.GetBranch();
    this.LoadVacationRules(this.pageNumber);
    LangSwitcher.translatefun();
  }

  LoadVacationRules(page: number = 0) {
     this.showspinner=true;
    this._service.GetAllVacationRules(page, this.pageSize, this.ruleNo, this.ruleDescAr, this.ruleDescEn).subscribe((data)=>{
      this.VacationRulesData = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      LangSwitcher.translateData(1);
      this.showspinner = false;
    });
  }

  keyupTimer:any;
  DoSearch() {
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadVacationRules(this.pageNumber);
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
        this.LoadVacationRules(this.pageNumber);
      }
    });
  }

  pageChanged(page: any){
    this.LoadVacationRules(page.page);
  }

  getRowID(rowNo) {
    this.rowId = rowNo;
  }
}
