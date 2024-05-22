import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PenaltiesService } from 'src/app/Core/Api/HR/penalties.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-penalties-list',
  templateUrl: './penalties-list.component.html',
  styleUrls: ['./penalties-list.component.css']
})
export class PenaltiesListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  PenaltiesData: any[] = [];
  showspinner: boolean = false;
  isEnglish: boolean = false;
  dtOptions: DataTables.Settings = {};

  docNo: any;
  penaltiesNameAr: any;
  penaltiesNameEn: any;
  notes: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  idColName: any = "n_doc_no";
  formID: any = 1409;

  constructor(private _service: PenaltiesService, private userservice: UserService, private _router: Router,
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
    this.LoadPenalties();
    LangSwitcher.translatefun();
  }

  LoadPenalties(){
    this.PenaltiesData = [];
     this.showspinner=true;
    this._service.GetAllPenalties().subscribe((data)=>{
      this.PenaltiesData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllPenalties(this.docNo, this.penaltiesNameAr, this.penaltiesNameEn, this.notes).subscribe((data)=>{
        this.PenaltiesData = data;
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
        this.LoadPenalties();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
