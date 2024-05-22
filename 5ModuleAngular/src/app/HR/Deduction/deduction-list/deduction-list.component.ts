import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DeductionService } from 'src/app/Core/Api/HR/deduction.service';
import { PenlityService } from 'src/app/Core/Api/HR/penlity.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-deduction-list',
  templateUrl: './deduction-list.component.html',
  styleUrls: ['./deduction-list.component.css']
})
export class DeductionListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  DeductionsData: any[] = [];
  showspinner: boolean = false;
  isEnglish: boolean = false;
  dtOptions: DataTables.Settings = {};

  deductionId: any;
  deductionNameAr: any;
  deductionNameEn: any;
  discountFrom: any;
  calcType: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  idColName: any = "n_deduction_id";
  formID: any = 1412;

  constructor(private _service: DeductionService, private userservice: UserService, private _router: Router,
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
    this.LoadDeductions();
    LangSwitcher.translatefun();
  }

  LoadDeductions(){
    this.DeductionsData = [];
     this.showspinner=true;
    this._service.GetAllDeduction().subscribe((data)=>{
      this.DeductionsData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllDeduction(this.deductionId, this.deductionNameAr, this.deductionNameEn, this.discountFrom, this.calcType).subscribe((data)=>{
        this.DeductionsData = data;
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
        this.LoadDeductions();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
