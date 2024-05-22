import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ScriptServiceService } from '../../script-service.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../_Services/user.service';
import { UsersPrevService } from '../../_Services/Prev/users-prev.service';
import { DashboardService } from 'src/app/Core/Api/Dashboard/dashboard.service';

@Component({
  selector: 'app-sys',
  templateUrl: './sys.component.html',
  styleUrls: ['./sys.component.css']
})
export class SysComponent implements OnInit {

  public legendPosition: LegendPosition = LegendPosition.Below;

  isEnglish:boolean=false;
  
  constructor(private _scriptservice : ScriptServiceService
    , private _activatedRoute: ActivatedRoute
    , private _userService: UserService
    , private _userPrevService: UsersPrevService
    ,private _DashboardService:DashboardService) { 

  }

  
  ngOnInit() {
    this._scriptservice.loadScripts();
    var i = Number(this._activatedRoute.snapshot.url);
    this._userPrevService.GetUserForms(i).subscribe((data) => {
      this._userPrevService.GetAllUserForms().subscribe((res) => {
        this._userService.SaveAllUserForms(data,res);
        this._userPrevService.ChangeMenuTable(data);
        this._userService.SaveCurrentModule(i);
      });
    });
    this.revserseAsideLinksDiretion();
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
  }


  revserseAsideLinksDiretion()
  {
   if(window.sessionStorage.getItem("lan")==="English")
   {
     setTimeout(() => {
       let links =document.querySelectorAll('aside .sidebar nav ul li a');
       for(let i=0;i<links.length;++i)
       {
        ( links[i] as HTMLElement ).style.flexDirection='row-reverse';
       }
      }, 780);
   }
  }

  translateData()
  {
    setTimeout(() => {
      if(window.sessionStorage.getItem("lan")==="English")
      {
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
