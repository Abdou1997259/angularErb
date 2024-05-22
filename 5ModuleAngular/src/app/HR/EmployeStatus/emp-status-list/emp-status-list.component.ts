import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { EmpStatusService } from 'src/app/Core/Api/HR/emp-status.service';

@Component({
  selector: 'app-emp-status-list',
  templateUrl: './emp-status-list.component.html',
  styleUrls: ['./emp-status-list.component.css']
})
export class EmpStatusListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  EmpStatusData: any[] = [];
  tranactionsCount!: any;

  showspinner: boolean = false;
  isEnglish:boolean=false


  docNo: any;
  docDate: any;
  empName: any;
  empStatus: any;
  notes: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;

  ReportUrl:any;
  comp:any;
  year:any;
  blalanceList;
  branch:any;
  idColName: any = "n_doc_no";
  formID: any = 1467;
  lang:any;

  constructor(private _service: EmpStatusService, private _router: Router, private _route: ActivatedRoute, private userservice: UserService,
    privatedialog: MatDialog, private dialogRef: MatDialog, private _notification: NotificationServiceService
  )
  {
    super(_route.data,userservice);
  }

  override ngOnInit(): void {
    this.ReportUrl = ApiConfig.ReportUrl;
    this.lang = this.userservice.GetLanguage();
    this.comp = this.userservice.GetComp();
    this.year = this.userservice.GetYear();
    this.branch = this.userservice.GetBranch();
    this.LoadEmpStatus(this.pageNumber);
    LangSwitcher.translatefun();
  }

  LoadEmpStatus(page: number = 0) {
    this.showspinner = true;
    this._service.GetAllEmpStatus(page, this.pageSize, this.docNo, this.docDate, this.empName, this.empStatus, this.notes).subscribe((data)=>{
      this.EmpStatusData = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      LangSwitcher.translateData(1)
      this.showspinner = false;
    });
  }

  keyupTimer:any;
  DoSearch() {
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadEmpStatus(this.pageNumber);
    }, 1000);
  }

  DeleteRow()
  {
    this._service.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg, data.status)
      else
        this. _notification.ShowMessage(data.msg, data.status);

      if(data.status==1){
        this.LoadEmpStatus(this.pageNumber);
      }
    });
  }

  pageChanged(page: any){
    this.LoadEmpStatus(page.page);
  }

  getRowID(rowNo) {
    this.rowId = rowNo;
  }
}
