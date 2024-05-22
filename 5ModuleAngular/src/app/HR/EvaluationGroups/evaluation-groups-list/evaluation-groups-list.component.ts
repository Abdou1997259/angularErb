import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationGroupsService } from 'src/app/Core/Api/HR/evaluation-groups.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-evaluation-groups-list',
  templateUrl: './evaluation-groups-list.component.html',
  styleUrls: ['./evaluation-groups-list.component.css']
})
export class EvaluationGroupsListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  EvaluationGroupsData: any;
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};

  docNo: any;
  evalNameAr: any;
  evalNameEn: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  isEnglish: boolean = false
  idColName: any = "n_doc_no";
  formID: any = 1471;
  
  constructor(private userservice: UserService, private _router: Router, private _route: ActivatedRoute, private _notification: NotificationServiceService,
    private _service: EvaluationGroupsService)
  {
    super(_route.data, userservice);
    this.dtOptions = {
      pageLength: 7,
      processing: true,
      searching: false,
      destroy: true,
      ordering: false
    };
  }

  override ngOnInit(): void {
    this.ReportUrl = ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadEvaluationGroups();
    LangSwitcher.translatefun();
  }

  LoadEvaluationGroups()
  {
    this.EvaluationGroupsData = [];
     this.showspinner=true;
    this._service.GetAllEvaluationGroups().subscribe((data)=>{
      this.EvaluationGroupsData = data;
      this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllEvaluationGroups(this.docNo, this.evalNameAr, this.evalNameEn).subscribe((data)=>{
        this.EvaluationGroupsData = data;
      })
    }, 1000);
  }

  deleteRow()
  {
    this._service.Delete(this.rowID).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg, data.status);
      else
        this._notification.ShowMessage(data.msg, data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.LoadEvaluationGroups();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
