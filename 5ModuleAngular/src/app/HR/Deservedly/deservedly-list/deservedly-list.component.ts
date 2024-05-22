import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeservedlyService } from 'src/app/Core/Api/HR/deservedly.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-deservedly-list',
  templateUrl: './deservedly-list.component.html',
  styleUrls: ['./deservedly-list.component.css']
})
export class DeservedlyListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  DeservedlyData: any[] = [];
  showspinner: boolean = false;
  isEnglish: boolean = false;
  dtOptions: DataTables.Settings = {};

  docNo: any;
  deservedlyNameAr: any;
  deservedlyNameEn: any;
  discountFrom: any;
  calcType: any;
  payType: any;
  category: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  idColName: any = "n_doc_no";
  formID: any = 1413;

  constructor(private _service: DeservedlyService, private userservice: UserService, private _router: Router,
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
    this.LoadDeservedly();
    LangSwitcher.translatefun();
  }

  LoadDeservedly(){
    this.DeservedlyData = [];
     this.showspinner=true;
    this._service.GetAllDeservedly().subscribe((data)=>{
      this.DeservedlyData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllDeservedly(this.docNo, this.deservedlyNameAr, this.deservedlyNameEn, this.discountFrom, this.calcType, this.payType, this.category).subscribe((data)=>{
        this.DeservedlyData = data;
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
        this.LoadDeservedly();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
