import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { Subject } from 'rxjs';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';


@Component({
  selector: 'app-intial-balance',
  templateUrl: './intial-balance.component.html',
  styleUrls: ['./intial-balance.component.css']
})
export class IntialBalanceComponent extends BaseComponent  implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('excelClosebutton') excelClose;
  @ViewChild('myInput') myInputVariable;

  tranactionsLST!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  tranactionsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  isEnglish:boolean=false;
  rowId: any;

  constructor(
    private _initialBalanceService:IntialBalnceService,
    private _router  : Router ,private _route  : ActivatedRoute,
    private    userservice:UserService,privatedialog: MatDialog,
    private dialogRef:MatDialog,
    private _notification: NotificationServiceService
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

 ReportUrl:any;
 UnitName:any;
 AccountName:any;
 IsmodelShow:any;
 comp:any;
 year:any;
 blalanceList;
 branch:any;
 idColName:any="n_document_no";
 formID:any=211;
 showExcelSpinner:boolean=false;
 lang:any;

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadTransactions(this.pageNumber);
    LangSwitcher.translatefun();
    this.isEnglish= LangSwitcher.CheckLan();
  }

  LoadTransactions(page: number = 0) {
    this.showspinner = true;
    this._initialBalanceService.getAll(page, this.pageSize, this.searchString).subscribe((data)=>{
      this.tranactionsLST = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1.2);
    });
  }
  

  Show(id:number)
  {
   
    const dialogRef = this.dialogRef.open(PopUpComponent,{
      width:'700px',
      height:'600px',
      data:{'id':id}
    });
  }

  // LoadStores(){
  //   this.IntialBalanceData=[];
  //    this.showspinner=true;
  //   this._initialBalanceService.getAll().subscribe((data)=>{
  //     this.IntialBalanceData=data;
  //      this.showspinner=false;
  //   });
  // }
  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadTransactions(this.pageNumber);
    }, 1000);
  }

  DeleteRow()
  {

    this._initialBalanceService.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);
     else
    this. _notification.ShowMessage(data.msg,data.status);
   
      if(data.status==1){
        this.LoadTransactions(this.pageNumber);
      }
    });
  }

  pageChanged(page: any){
    this.LoadTransactions(page.page);
  }

  getRowID(rowNo) {
    this.rowId = rowNo;
  }


  
  PrintTemplate(){
    this._initialBalanceService.DownloadTemplate();
  }

  UploadExcel(){
    debugger;
    var attachments: any = document.getElementById('excelFile');
    if(attachments == null || attachments.files.length==0)
    {
      this. _notification.ShowMessage('الرجاء اختيار ملف اولاً',3);
      return;
    }
    this.showExcelSpinner=true;
    $('#excelSave').prop('disabled', true);
    var formData: any = new FormData();
    for (let i = 0; i < attachments.files.length; i++) {
      formData.append("file", attachments.files[i]);      
    }   
    
    this._initialBalanceService.SaveExcelData(formData).subscribe(data=>{
      debugger;
      this.showExcelSpinner=false;
      $('#excelSave').prop('disabled', false);
      this.myInputVariable.nativeElement.value = "";
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1)
      {
        this.excelClose.nativeElement.click();  
        this.LoadTransactions(this.pageNumber);
      }
    });
  }
}
