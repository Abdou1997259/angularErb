import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllowancesService } from 'src/app/Core/Api/HR/allowances.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-allowances-list',
  templateUrl: './allowances-list.component.html',
  styleUrls: ['./allowances-list.component.css']
})
export class AllowancesListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  AllowancesData: any;
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};

  allowanceId: any;
  allowanceNameAr: any;
  allowanceNameEn: any;
  catName: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  isEnglish: boolean = false
  idColName: any = "n_allowance_id";
  formID: any = 1410;

  constructor(private userservice: UserService, private _router: Router, private _route: ActivatedRoute, private _notification: NotificationServiceService,
    private _service: AllowancesService)
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
    this.LoadAllowances();
    LangSwitcher.translatefun();
  }

  LoadAllowances(){
    this.AllowancesData = [];
     this.showspinner=true;
    this._service.GetAllAllowances().subscribe((data)=>{
      this.AllowancesData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllAllowances(this.allowanceId, this.allowanceNameAr, this.allowanceNameEn, this.catName).subscribe((data)=>{
        this.AllowancesData = data;
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
        this.LoadAllowances();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
