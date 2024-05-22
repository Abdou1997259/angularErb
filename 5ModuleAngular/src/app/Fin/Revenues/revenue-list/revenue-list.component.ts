import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { RevenueService } from 'src/app/Core/Api/FIN/revenue.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrls: ['./revenue-list.component.css']
})
export class RevenueListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;


  constructor(private dataSharingService:DataSharingService
    ,private _RevenueService :RevenueService
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
  DocSerial:any;
  DocDate:any;
  CurrencyName:any;
  Description:any;
  Total:any;
  rowID:any;
  TypeID:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=511;
  isEnglish:boolean=false;
  lang:any;
  
  LoadInvoices(){
    debugger;
    this.InvoiceData=[];
     this.showspinner=true;
    this._RevenueService.GetAll().subscribe((data)=>{  
      this.InvoiceData = data;
       this.showspinner=false;
LangSwitcher.translateData(1);
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._RevenueService.GetAll(this.DocNo, this.DocSerial,this.DocDate, this.CurrencyName, this.Description, this.Total).subscribe((data)=>{  
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
    
  } 

  deleteRow()
  {
    this._RevenueService.Delete(this.rowID).subscribe((data)=>{  
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
    this._RevenueService.ExportRevenues(this.DocNo, this.DocSerial,this.DocDate, this.CurrencyName, this.Description, this.Total);
  }
 

}
