import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArShiftsService } from 'src/app/Core/Api/AR/ar-shift.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-ar-shift-list',
  templateUrl: './ar-shift-list.component.html',
  styleUrls: ['./ar-shift-list.component.css']
})
export class ArShiftListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  shitList: any;
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};
  rowID:any;

  docNo: any;
  docDate: any;
  shiftType: any;
  empName: any;

  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  lang:any;
  isEnglish:boolean=false

  constructor(private _service: ArShiftsService, private _router  : Router, private _route  : ActivatedRoute, 
    private userservice:UserService, private _notification: NotificationServiceService) 
  {
    super(_route.data,userservice);
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
    this.LoadShifts()
  }

  LoadShifts(){
    this.shitList=[];
    this.showspinner=true;
    this._service.GetAllShifts().subscribe((data)=>{  
      this.shitList = data;
      debugger
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllShifts(this.docNo, this.docDate, this.shiftType, this.empName).subscribe((data)=>{  
        this.shitList = data;   
      })
    }, 1000);
  }

  deleteRow()
  {
    this._service.Delete(this.rowID).subscribe((data)=>{  
      this.showspinner=false;
      if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
      else
        this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton.nativeElement.click();   
        this.LoadShifts();
      }
    });
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
