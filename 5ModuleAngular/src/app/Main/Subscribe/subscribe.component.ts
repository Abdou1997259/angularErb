import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscribeService } from 'src/app/Core/Api/Main/subscribe.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataSharingSenderService } from '../../_Services/General/data-sharing-sender';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  
  constructor(private fb:FormBuilder
    ,private _SubscribeService : SubscribeService
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private dataSender:DataSharingSenderService) { 

      this.SubscribeForm = this.fb.group({
        s_name: new FormControl('', Validators.required),
        s_company_name: new FormControl('', Validators.required),
        s_email: new FormControl('', Validators.required),
        n_users_count: new FormControl('', Validators.required),
        s_phone_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
        s_country: new FormControl('', Validators.required),
        s_city: new FormControl('', Validators.required),
        s_phone_no2:new FormControl('', [Validators.pattern("^[0-9]*$")])
      }); 
    }

    SubscribeForm!: FormGroup;
    showspinner:boolean=false;
    mdlSampleIsOpen : boolean = false;
    confirmCode:string='';
    s_code:string='';
    SaveStatus: boolean=false;
    year:any;

    Save() 
    { 
      debugger;
      if(this.confirmCode==this.s_code)
      {
        this.disableButtons();
        this.showspinner=this.SaveStatus=true;
        var formData: any = new FormData();
        formData.append("s_name", this.SubscribeForm.value.s_name);
        formData.append("s_company_name", this.SubscribeForm.value.s_company_name);
        formData.append("s_country", this.SubscribeForm.value.s_country);
        formData.append("s_city", this.SubscribeForm.value.s_city);
        formData.append("s_email", this.SubscribeForm.value.s_email);
        formData.append("n_users_count", this.SubscribeForm.value.n_users_count);
        formData.append("s_phone_no", this.SubscribeForm.value.s_phone_no);
        formData.append("s_phone_no2", this.SubscribeForm.value.s_phone_no2);

        this._SubscribeService.SaveNewSubscribe(formData).subscribe(data=>{
          debugger;
          this.showspinner=this.SaveStatus=false;
          this. _notification.ShowMessage(data.msg,data.status);
          this.enableButtons();
          if(data.status==1){      
            this._router.navigate(['/main/confirmed']);
          }
        });
      }
      else
      {
        this. _notification.ShowMessage("كود التأكيد خطا",3);
      }
    }

    Confirm()
    {
      this.showspinner=this.SaveStatus=true;
      this.disableButtons();
      this._SubscribeService.SendEmailConfirmation(this.SubscribeForm.value.s_email).subscribe(data=>{
        debugger;
        this.showspinner=this.SaveStatus=false;
        this.enableButtons();
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){      
          this.confirmCode=data.extra;
          this.openModal(true);
        }
      });
    }

    openModal(open : boolean) : void {
      this.mdlSampleIsOpen = open;
    }

    closeModal(){
      this.openModal(false);
    }

  ngOnInit(): void {
    this.year=(new Date()).getFullYear();
    this.dataSender.sendDATA(true);
    this.translateData();
    this.translatefun();
  }

  disableButtons() {
    debugger;
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
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

} 
