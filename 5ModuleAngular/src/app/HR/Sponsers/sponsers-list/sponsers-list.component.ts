import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SponsersService } from 'src/app/Core/Api/HR/sponsers.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-sponsers-list',
  templateUrl: './sponsers-list.component.html',
  styleUrls: ['./sponsers-list.component.css']
})
export class SponsersListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  SponsersData: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};

  sponserId: any;
  type: any;
  sponserNameAr: any;
  sponserNameEn: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  isEnglish: boolean = false;
  idColName: any = "n_Sponser_id";
  formID: any = 1406;

  constructor(private userservice: UserService, private _router: Router, private _route: ActivatedRoute, private _notification: NotificationServiceService,
    private _service: SponsersService)
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
    this.LoadSponsers();
    LangSwitcher.translatefun();
  }

  LoadSponsers(){
    this.SponsersData = [];
     this.showspinner=true;
    this._service.GetAllSponsers().subscribe((data)=>{
      this.SponsersData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllSponsers(this.sponserId, this.type, this.sponserNameAr, this.sponserNameEn).subscribe((data)=>{
        this.SponsersData = data;
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
        this.LoadSponsers();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
