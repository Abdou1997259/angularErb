import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { EmpContractService } from 'src/app/Core/Api/HR/emp-contract.service';

@Component({
  selector: 'app-emp-contract-list',
  templateUrl: './emp-contract-list.component.html',
  styleUrls: ['./emp-contract-list.component.css']
})
export class EmpContractListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  EmpContractsData: any[] = [];
  tranactionsCount!: any;

  showspinner: boolean = false;
  isEnglish: boolean = false;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;

  docNo: any;
  contractId: any;
  empName: any;
  contractType: any;
  startDate: any;
  endaDate: any;
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
  formID: any = 1428;

  constructor(private _service: EmpContractService, private userservice: UserService, private _router: Router,
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
    this.LoadEmpContracts(this.pageNumber);
    LangSwitcher.translatefun();
  }

  LoadEmpContracts(page: number = 0) {
     this.showspinner=true;
    this._service.GetAllEmpsContracts(page, this.pageSize, this.docNo, this.contractId, this.empName, this.contractType, this.startDate, this.endaDate, this.notes).subscribe((data)=>{
      this.EmpContractsData = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      LangSwitcher.translateData(1);
      this.showspinner=false;
    });
  }

  keyupTimer:any;
  DoSearch() {
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadEmpContracts(this.pageNumber);
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
        this.LoadEmpContracts(this.pageNumber);
      }
    });
  }

  pageChanged(page: any){
    this.LoadEmpContracts(page.page);
  }

  getRowID(rowNo) {
    this.rowId = rowNo;
  }
}
