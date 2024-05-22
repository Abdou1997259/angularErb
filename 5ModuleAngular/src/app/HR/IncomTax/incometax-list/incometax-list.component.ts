import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IncometaxService } from 'src/app/Core/Api/HR/incometax.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-incometax-list',
  templateUrl: './incometax-list.component.html',
  styleUrls: ['./incometax-list.component.css']
})
export class IncometaxListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  IncomeTaxData: any[] = [];
  showspinner: boolean = false;
  isEnglish: boolean = false;
  dtOptions: DataTables.Settings = {};

  docNo: any;
  fromDate: any;
  toDate: any;
  notes: any;
  annualDiscouint: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  idColName: any = "n_doc_no";
  formID: any = 1437;

  constructor(private _service: IncometaxService, private userservice: UserService, private _router: Router,
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
    this.LoadIncomeTax();
    LangSwitcher.translatefun();
  }

  LoadIncomeTax(){
    this.IncomeTaxData = [];
     this.showspinner=true;
    this._service.GetAllIncomeTax().subscribe((data)=>{
      this.IncomeTaxData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllIncomeTax(this.docNo, this.fromDate, this.toDate, this.notes, this.annualDiscouint).subscribe((data)=>{
        this.IncomeTaxData = data;
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
        this.LoadIncomeTax();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
