import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { CurrenciesService } from 'src/app/Core/Api/Sys/currencies.service';

@Component({
  selector: 'app-currencies-list',
  templateUrl: './currencies-list.component.html',
  styleUrls: ['./currencies-list.component.css']
})
export class CurrenciesListComponent extends BaseComponent implements OnInit  {

  @ViewChild('closebutton') closebutton;


  constructor(private dataSharingService:DataSharingService
    ,private _CurrenciesService :CurrenciesService
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
  CurrencyData : Array<any>=[];
  CurrID:any;
  NameArabic:any;
  NameEnglish:any;
  IsMain:any;

  rowID:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_currency_id";
  formID:any=100;
  isEnglish:boolean=false;
  lang:any;
  
  LoadInvoices(){
    debugger;
    this.CurrencyData=[];
     this.showspinner=true;
    this._CurrenciesService.GetAllCurrencies().subscribe((data)=>{  
      this.CurrencyData = data;
       this.showspinner=false;
       this.translateData();
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._CurrenciesService.GetAllCurrencies(this.CurrID, this.NameArabic, this.NameEnglish, this.IsMain).subscribe((data)=>{  
        this.CurrencyData=data;   
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
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
  } 

  deleteRow()
  {
    this._CurrenciesService.Delete(this.rowID).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
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
    }, 1000);
    
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
}
