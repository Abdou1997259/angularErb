import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { SubscribeService } from 'src/app/Core/Api/Main/subscribe.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent extends BaseComponent implements OnInit  {

  @ViewChild('closebutton') closebutton;

  constructor(private dataSharingService:DataSharingService
    ,private _SubscribeService :SubscribeService
    ,private _router  : Router 
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService
    ,private fb:FormBuilder
    ) {
      super(_route.data,userservice);
      this.dtOptions = { 
        pageLength: 7, 
        processing: true,
        searching: false,
        destroy: true,
        ordering: false
      }; 

      this.RequestForm = this.fb.group({
        s_password:new FormControl('', Validators.required)
      });

     }

     
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};
  RequestData : any;
  CodeID:any;
  Name:any;
  CompName:any;
  Email:any;
  Phone:any;
  Address:any;
  isEnglish:boolean=false;
  RequestForm!: FormGroup;
  isAuthorized:boolean=false;
  display='none';

  LoadRequests(){
    this.RequestData=[];
    this.showspinner=true;
    this._SubscribeService.GetRequests(this.CodeID, this.Name, this.CompName, this.Email, this.Phone, this.Address).subscribe((data)=>{  
       this.RequestData = data;
       this.showspinner=false;
       this.translateData();
    });

  }

  keyupTimer:any;
  Search(page:number=0) {
    if(this.isAuthorized){
      this.keyupTimer = setTimeout(() => {
        this._SubscribeService.GetRequests(this.CodeID, this.Name, this.CompName, this.Email, this.Phone, this.Address).subscribe((data)=>{  
          this.RequestData=data;   
        })
      }, 1000);
    }
    else
    {
      this. _notification.ShowMessage("من فضلك اضغط زرار عرض البيانات",2);
    }
  }

  override ngOnInit(): void {
    this.showModal();
    //this.LoadRequests();
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
  } 


  Confirm()
  {
    if(this.isAuthorized)
    {
      this.LoadRequests();
      return;
    }
    debugger;
    var currPassword=this.RequestForm.value.s_password;
    var date= new Date();
    var hour = (date.getHours()>12) ?date.getHours()-12:date.getHours();
    var passEn='741'+hour+'aa';
    var passAr='741'+hour+'شش';
    if(currPassword==passEn || currPassword==passAr)
    {
      this.isAuthorized=true;
      this.LoadRequests();
      this.display='none';
    }
    else
    {
      this.isAuthorized=false;
      this. _notification.ShowMessage("الباسورد غير صحيح",3);
    }
  }
  
  showModal(){
    debugger;
    if(!this.isAuthorized)
      this.display='block';
  }

  closeModal(){
    this.display='none';
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
