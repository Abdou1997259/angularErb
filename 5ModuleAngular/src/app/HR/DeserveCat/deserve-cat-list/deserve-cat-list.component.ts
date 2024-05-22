import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeserveCategoryService } from 'src/app/Core/Api/HR/deserve-category.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-deserve-cat-list',
  templateUrl: './deserve-cat-list.component.html',
  styleUrls: ['./deserve-cat-list.component.css']
})
export class DeserveCatListComponent extends BaseComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  DeductionCatData: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};

  id: any;
  name: any;
  nameEng: any;
  notes: any;

  rowID: any;
  IsmodelShow: any;
  ReportUrl: any;
  comp: any;
  year: any;
  branch: any;
  lang: any;
  isEnglish: boolean = false;
  idColName: any = "n_id";
  formID: any = 14122;

  constructor(private _service:DeserveCategoryService , private userservice: UserService, private _router: Router,
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
    this.lang = this.userservice.GetLanguage();
    this.comp = this.userservice.GetComp();
    this.year = this.userservice.GetYear();
    this.branch = this.userservice.GetBranch();
    this.loadCat();
    LangSwitcher.translatefun();
  }

  loadCat(){
    this.DeductionCatData = [];
     this.showspinner = true;
    this._service.GetAllDeserveCat().subscribe((data)=>{
      this.DeductionCatData = data;
       this.showspinner = false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllDeserveCat(this.id, this.name, this.nameEng, this.notes).subscribe((data)=>{
        this.DeductionCatData = data;
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
        this.loadCat();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }

}
