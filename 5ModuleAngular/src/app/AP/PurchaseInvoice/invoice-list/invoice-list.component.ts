import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PurchaseInvoiceService } from 'src/app/Core/Api/AP/purchase-invoice.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('excelClosebutton') excelClose;
  @ViewChild('myInput') myInputVariable;


  constructor(private dataSharingService:DataSharingService
    ,private _PurchaseInvoiceService :PurchaseInvoiceService
    ,private _router  : Router 
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService
    ) {
      super(_route.data,userservice);
      this.dtOptions = { 
        pageLength:5, 
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
  SupplierName:any;
  ManName:any;
  Description:any;
  rowID:any;
  isEnglish:boolean=false;
  TypeID:any;
  SourceType:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_purchase_invoice_no";
  formID:any=403;
  lang:any;
  showExcelSpinner:boolean=false;

  LoadInvoices(){
    debugger;
    this.InvoiceData=[];
     this.showspinner=true;
    this._PurchaseInvoiceService.GetAllInvoices().subscribe((data)=>{  
      this.InvoiceData = data;
       this.showspinner=false;
       LangSwitcher.translateData(1);
       
    });

  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._PurchaseInvoiceService.GetAllInvoices(this.DocNo, this.DocDate, this.TypeName, this.SupplierName, this.ManName, this.Description).subscribe((data)=>{  
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

    this.isEnglish=LangSwitcher.CheckLan();
  } 

  deleteRow()
  {
    this._PurchaseInvoiceService.DeleteInvoice(this.rowID,this.TypeID,this.SourceType).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
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
    this.TypeID=typeNo;
    this.SourceType=sourceType;
  }

  PrintExcel(){
    $('#excelBTN').prop('disabled', true);
    this._PurchaseInvoiceService.ExportInvoices(this.DocNo,this.DocDate, this.TypeName, this.SupplierName, this.ManName, this.Description);
  }


  PrintTemplate(){
    this._PurchaseInvoiceService.DownloadTemplate();
  }

  UploadExcel(){
    debugger;
    var attachments: any = document.getElementById('excelFile');
    if(attachments == null || attachments.files.length==0)
    {
      if(this.isEnglish)
        this._notification.ShowMessage(`Choose the file `,3)
      else

      this. _notification.ShowMessage('الرجاء اختيار ملف اولاً',3);
      return;
    }
    this.showExcelSpinner=true;
    $('#excelSave').prop('disabled', true);
    var formData: any = new FormData();
    for (let i = 0; i < attachments.files.length; i++) {
      formData.append("file", attachments.files[i]);      
    }   
    
    this._PurchaseInvoiceService.SaveExcelData(formData).subscribe(data=>{
      debugger;
      this.showExcelSpinner=false;
      $('#excelSave').prop('disabled', false);
      this.myInputVariable.nativeElement.value = "";
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);
    else
    this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1)
      {
        this.excelClose.nativeElement.click();  
        this.LoadInvoices();
      }
    });
  }

}
