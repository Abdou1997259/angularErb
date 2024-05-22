import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { JournalService } from 'src/app/Core/Api/GL/journal.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css']
})
export class JournalListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('excelClosebutton') excelClose;
  @ViewChild('myInput') myInputVariable;

  constructor(private dataSharingService:DataSharingService
    ,private _JournalService :JournalService
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
  JournalsData : Array<any>=[];
  DocNo:any;
  DocDate:any;
  isEnglish:boolean=false;
  JournalName:any;
  Description:any;
  AccountName:any;
  rowID:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=109;
  showExcelSpinner:boolean=false;
  lang:any;
  
  // currentPage!: number;
  // pageNumber: number = 1;
  // pageSize: number = 15;
  // journalsCount!: any;
  // searchString: any;

  LoadJournals(){
    debugger;
    this.JournalsData=[];
     this.showspinner=true;
    this._JournalService.GetAllJournals().subscribe((data)=>{  
      this.JournalsData = data;
      //this.JournalsData = data.modelNameLST;
      //this.journalsCount = data.totalItems;  
       this.showspinner=false;
       this.translateData();
    });

  }

  keyupTimer:any;
  Search(page:number=0) 
  {
    this.keyupTimer = setTimeout(() => {
      this._JournalService.GetAllJournals(this.DocNo, this.DocDate, this.JournalName, this.AccountName, this.Description).subscribe((data)=>{  
        this.JournalsData=data;   
      })
    }, 1000);
  };

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadJournals();
    this.translateData();
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
  } 

  deleteRow()
  {
    this._JournalService.DeleteJournal(this.rowID).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton.nativeElement.click();   
        this.LoadJournals();
      }
    });
  }


  getRowID(rowNo) {
    this.rowID = rowNo;
  }

  // getData(page: number = 0) {
  //   this.showspinner = true;
  //   this._JournalService.GetAllJournals(page, this.pageSize,this.DocNo, this.DocDate, this.JournalName, this.AccountName, this.Description).subscribe((data) => {
  //     this.JournalsData = data.modelNameLST;
  //     this.journalsCount = data.totalItems;
  //     this.showspinner = false;
  //   })
  // }

  // pageChanged(page: any){
  //   this.getData(page.page);
  // }

  PrintExcel(){
    $('#excelBTN').prop('disabled', true);
    this._JournalService.ExportJournals(this.DocNo,this.DocDate, this.JournalName, this.AccountName, this.Description);
  }

  translateData()
  {
    setTimeout(() => {
      if(window.sessionStorage.getItem("lan")==="English")
    {
      debugger
      let listOfElement=document.getElementsByClassName("translatedata");
      let regex=/[\u0600-\u06FF]/
      for(let i=0;i<listOfElement.length;++i)
      {
      
          if( regex.test(listOfElement[i].innerHTML))
             {
             
              let enWord=listOfElement[i].getAttribute("data-en") as string ;
              let arword=listOfElement[i].innerHTML;
              let swapper=enWord;
              enWord=arword;
              arword=swapper;
              listOfElement[i].setAttribute("data-en",enWord);
              listOfElement[i].innerHTML=arword;
             }
      }
  
    }
    }, 0);
    
  }
  translatefun()
  {
    debugger
    if(window.sessionStorage.getItem("lan")==="English")
    {
      let listOfElement=document.getElementsByClassName("translate");
      let regex=/[\u0600-\u06FF]/
      for(let i=0;i<listOfElement.length;++i)
      {
          if(listOfElement[i].nodeName=='INPUT')
          {
            let inputElement=(listOfElement[i] as HTMLInputElement);
            if( regex.test(inputElement.value))
            {
            
             let enWord=listOfElement[i].getAttribute("data-en") as string ;
             let arword=inputElement.value;
             let swapper=enWord;
             enWord=arword;
             arword=swapper;
             listOfElement[i].setAttribute("data-en",enWord);
             inputElement.value=arword;
            }

          }
          else
          {
            if( regex.test(listOfElement[i].innerHTML))
            {
            
             let enWord=listOfElement[i].getAttribute("data-en") as string ;
             let arword=listOfElement[i].innerHTML;
             let swapper=enWord;
             enWord=arword;
             arword=swapper;
             listOfElement[i].setAttribute("data-en",enWord);
             listOfElement[i].innerHTML=arword;
            }
      
         
      }
  
    }
    }
  }

  
  PrintTemplate(){
    this._JournalService.DownloadTemplate();
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
    
    this._JournalService.SaveExcelData(formData).subscribe(data=>{
      debugger;
      this.showExcelSpinner=false;
      $('#excelSave').prop('disabled', false);
      this.myInputVariable.nativeElement.value = "";
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1)
      {
        this.excelClose.nativeElement.click();  
        this.LoadJournals();
      }
    });
  }

}
