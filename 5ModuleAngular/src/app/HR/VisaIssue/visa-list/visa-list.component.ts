import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VisaService } from 'src/app/Core/Api/HR/visa.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-visa-list',
  templateUrl: './visa-list.component.html',
  styleUrls: ['./visa-list.component.css']
})
export class VisaListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  VisaIssuesData: any[] = [];
  showspinner: boolean = false;
  isEnglish: boolean = false;
  dtOptions: DataTables.Settings = {};

  docNo: any;
  docDate: any;
  sponserName: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  idColName: any = "n_doc_no";
  formID: any = 1420;

  constructor(private _service: VisaService, private userservice: UserService, private _router: Router,
    private _route: ActivatedRoute, private _notification: NotificationServiceService)
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
    this.lang = this.userservice.GetLanguage();
    this.comp = this.userservice.GetComp();
    this.year = this.userservice.GetYear();
    this.branch = this.userservice.GetBranch();
    this.LoadVisaIssues();
    LangSwitcher.translatefun();
  }

  LoadVisaIssues(){
    this.VisaIssuesData = [];
     this.showspinner=true;
    this._service.GetAllVisaIssue().subscribe((data)=>{
      this.VisaIssuesData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllVisaIssue(this.docNo, this.docDate, this.sponserName).subscribe((data)=>{
        this.VisaIssuesData = data;
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
        this.LoadVisaIssues();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
