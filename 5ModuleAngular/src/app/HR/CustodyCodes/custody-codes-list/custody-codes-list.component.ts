import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustodyCodesService } from 'src/app/Core/Api/HR/custody-codes.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-custody-codes-list',
  templateUrl: './custody-codes-list.component.html',
  styleUrls: ['./custody-codes-list.component.css']
})
export class CustodyCodesListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  CustodyCodesData: any;
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};

  custodyNo: any;
  custodynameAr: any;
  custodynameEn: any;
  cashVal: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  isEnglish: boolean = false
  idColName: any = "n_custody_no";
  formID: any = 1426;

  constructor(private _service: CustodyCodesService, private userservice: UserService, private _router: Router,
    private _route: ActivatedRoute, private _notification: NotificationServiceService,)
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
    this.LoadCustodyCodes();
    LangSwitcher.translatefun();
  }

  LoadCustodyCodes(){
    this.CustodyCodesData = [];
     this.showspinner=true;
    this._service.GetAllCustodyCodes().subscribe((data)=>{
      this.CustodyCodesData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllCustodyCodes(this.custodyNo, this.custodynameAr, this.custodynameEn, this.cashVal).subscribe((data)=>{
        this.CustodyCodesData = data;
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
        this.LoadCustodyCodes();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
