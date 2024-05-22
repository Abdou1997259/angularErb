import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { SalesInvoiceService } from 'src/app/Core/Api/AR/sales-invoice.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;


  constructor(private dataSharingService:DataSharingService
    ,private _SalesInvoiceService :SalesInvoiceService
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
  Description:any;
  rowID:any;
  TypeID:any;
  SourceType:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_document_no";
  formID:any=311;
  lang:any;
  isEnglish:boolean=false

  LoadInvoices(){
    debugger;
    this.InvoiceData=[];
     this.showspinner=true;
    this._SalesInvoiceService.GetAllInvoices().subscribe((data)=>{  
      this.InvoiceData = data;
       this.showspinner=false;
      LangSwitcher.translateData(1)
    });

  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._SalesInvoiceService.GetAllInvoices(this.DocNo, this.DocDate, this.TypeName, this.CustomerName, this.SalesManName, this.Description).subscribe((data)=>{  
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
    LangSwitcher.translatefun();
  } 

  deleteRow()
  {
    this._SalesInvoiceService.DeleteInvoice(this.rowID,this.TypeID,this.SourceType).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
      else
        this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton.nativeElement.click();   
        this.LoadInvoices();
      }
    });
  }


  getRowID(rowNo, typeNo, sourceType) {
    this.rowID = rowNo;
    this.TypeID=typeNo;
    this.SourceType=sourceType;
  }

  PrintExcel(){
    $('#excelBTN').prop('disabled', true);
    this._SalesInvoiceService.ExportInvoices(this.DocNo,this.DocDate, this.TypeName, this.CustomerName, this.SalesManName, this.Description);
  }

}
