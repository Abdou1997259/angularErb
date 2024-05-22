import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpPaymentsService } from 'src/app/Core/Api/HR/emp-payments.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-emp-payments-list',
  templateUrl: './emp-payments-list.component.html',
  styleUrls: ['./emp-payments-list.component.css']
})
export class EmpPaymentsListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  PaymentsData: any;
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};

  docNo: any;
  payNameAr: any;
  payNameEn: any;
  notes: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  isEnglish: boolean = false
  idColName: any = "n_doc_no";
  formID: any = 1408;

  constructor(private userservice: UserService, private _router: Router, private _route: ActivatedRoute, private _notification: NotificationServiceService,
    private _service: EmpPaymentsService)
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
    this.LoadEmpPayments();
    LangSwitcher.translatefun();
  }

  LoadEmpPayments(){
    this.PaymentsData = [];
     this.showspinner=true;
    this._service.GetAllPayments().subscribe((data)=>{
      this.PaymentsData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllPayments(this.docNo, this.payNameAr, this.payNameEn, this.notes).subscribe((data)=>{
        this.PaymentsData = data;
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
        this.LoadEmpPayments();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
