import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { UnitsService } from 'src/app/Core/Api/SC/units.service';
import { UNIT } from 'src/app/Core/model/SC/units';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent   extends BaseComponent  implements OnInit {

  unitsData!: any;
  dtOptions: DataTables.Settings = {};
  rowId: any;
  showspinner: boolean = false;
  itemName!: any;
  dtTrigger: Subject<any> = new Subject<any>();

  // -------- Pagination Properties -------------------------
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalItems: any;
  searchString: any;
  lastAutoNumber!: number;

  constructor(
    private unitService:UnitsService
    ,private _router  : Router
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,private _notification: NotificationServiceService

  ) {
    super(_route.data,userservice);
    this.dtOptions = {
      pageLength: 7,
      processing: true,
      searching: false,
      destroy: true,
      ordering: false
    };
  }
  @ViewChild('closebutton') closebutton;
  ReportUrl:any;
  UnitName:any;
  AccountName:any;
  IsmodelShow:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_unit_id";
  formID:any=208;
  unitList ;
  isEnglish:boolean=false;
  lang:any;


 override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadUnits(this.pageNumber);
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  LoadUnits(page: number = 0) {
    this.showspinner=true;
    this.unitService.GetAllUnitsLKP(page, this.pageSize, this.searchString).subscribe((data)=>{
      this.unitsData = data.modelNameLST;
        this.totalItems = data.totalItems;
        this.showspinner=false;
    });
  }

  // LoadStores(){
  //   this.UnitsData=[];
  //    this.showspinner=true;
  //   this.unitService.getAllUnits().subscribe((data)=>{
  //     this.UnitsData=data;
  //      this.showspinner=false;
  //   });
  // }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadUnits(this.pageNumber);
    }, 1000);
  }

  pageChanged(page: any){
    this.LoadUnits(page.page);
  }

  deleteRow()
  {
    debugger;
    this.unitService.DelteUnit(this.rowId).subscribe((data:any)=>{
      this.showspinner=false;
      let comingMsg;
      if(this.isEnglish){
        comingMsg=data.Emsg
      }
      else
      {
        comingMsg=data.msg
      }
      this. _notification.ShowMessage(comingMsg,data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.LoadUnits(this.pageNumber);
      }
    });
  }

  getRowID(rowNo) {
    this.rowId = rowNo;
  }

}
