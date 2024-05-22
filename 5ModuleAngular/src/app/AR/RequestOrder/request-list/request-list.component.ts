import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { RequestOrderService } from 'src/app/Core/Api/AR/request-order.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent extends BaseComponent implements OnInit  {

  @ViewChild('closebutton') closebutton;


  constructor(private dataSharingService:DataSharingService
    ,private _RequestOrderService :RequestOrderService
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
  InvoiceData : Array<any>=[];
  DocNo:any;
  DocDate:any;
  TypeName:any;
  CustomerName:any;
  SalesManName:any;
  EmployeeName:any;
  Description:any;
  rowID:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_document_no";
  formID:any=314;
  isEnglish:boolean=false;
  lang:any;

  LoadInvoices(){
    debugger;
    this.InvoiceData=[];
    this.showspinner=true;
    this._RequestOrderService.GetAllRequests().subscribe((data)=>{  
      this.InvoiceData = data;
       this.showspinner=false;
  
       LangSwitcher.translateData(1);
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._RequestOrderService.GetAllRequests(this.DocNo, this.DocDate, this.TypeName, this.CustomerName, this.SalesManName, this.Description).subscribe((data)=>{  
        this.InvoiceData=data;   
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
  LangSwitcher.translatefun()
  this.isEnglish=LangSwitcher.CheckLan();
  } 

  deleteRow()
  {
    this._RequestOrderService.DeleteRequest(this.rowID).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
         this._notification.ShowMessage(data.Emsg,data.status)
       else
         this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton.nativeElement.click();   
        this.LoadInvoices();
      }
    });
  }


  getRowID(rowNo) {
    this.rowID = rowNo;
  }

  PrintExcel(){
    $('#excelBTN').prop('disabled', true);
    this._RequestOrderService.ExportRequests(this.DocNo,this.DocDate, this.TypeName, this.CustomerName, this.SalesManName, this.EmployeeName, this.Description);
  }


}
