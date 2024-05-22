import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { EmployeesService } from 'src/app/Core/Api/HR/employees.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent extends BaseComponent implements OnInit {

  @ViewChild('closebutton') closebutton;


  constructor(private dataSharingService:DataSharingService
    ,private _EmployeesService :EmployeesService
    ,private _router  : Router 
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,public dialog: MatDialog
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

     
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};
  EmployeesData : Array<any>=[];

  EmpNo:any;
  EmpName:any;
  DateOB:any;
  JobTitle:any;
  Nationality:any;
  MartialStatus:any;
  Gender:any;

  rowID:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_employee_id";
  formID:any=1414;
  lang:any;
  isEnglish:boolean=false

  LoadInvoices(){
    debugger;
    this.EmployeesData=[];
     this.showspinner=true;
    this._EmployeesService.GetAllEmployees().subscribe((data)=>{  
      this.EmployeesData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });

  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._EmployeesService.GetAllEmployees(this.EmpNo, this.EmpName, this.DateOB, this.JobTitle, this.Nationality, this.MartialStatus, this.Gender).subscribe((data)=>{  
        this.EmployeesData=data;   
      })
    }, 1000);
  }

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadInvoices();
    LangSwitcher.translatefun();
  } 

  deleteRow()
  {
    this._EmployeesService.DeleteEmployee(this.rowID).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status);
      else
        this._notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton.nativeElement.click();   
        this.LoadInvoices();
      }
    });
  }

  getRowID(rowNo, typeNo, sourceType) {
    this.rowID = rowNo;
  }

}
