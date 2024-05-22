import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ScriptServiceService } from '../../script-service.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../_Services/user.service';
import { UsersPrevService } from '../../_Services/Prev/users-prev.service';

@Component({
  selector: 'app-gl',
  templateUrl: './gl.component.html',
  styleUrls: ['./gl.component.css']
})
export class GLComponent implements OnInit {

  public legendPosition: LegendPosition = LegendPosition.Below;
  
  gdpData = [
    { name: "يناير", value: 925 },
    { name: "فبراير", value: 3062 },
    { name: "مارس", value: 1600 },
    { name: "ابريل", value: 840 },
    { name: "مايو", value: 3000 },
    { name: "يونيه", value: 1500 },
    { name: "يوليو", value: 300 },
    { name: "اغسطس", value: 2000 },
    { name: "سبتمبر", value: 2555 },
    { name: "اكتوبر", value: 1000 },
    { name: "نوفمبر", value: 2020 },
    { name: "ديسمبر", value: 2500 },
  ];

  pieData = [
    { name: "الموردين", value: 925 },
    { name: "العملاء", value: 3062 },
    { name: "المخازن", value: 1600 },
    { name: "البنوك", value: 840 },
    { name: "الخزن", value: 3000 },
    { name: "المرتبات", value: 1500 }
  ];

  isEnglish:boolean=false;
  
  constructor(private _scriptservice : ScriptServiceService, private _activatedRoute: ActivatedRoute, private _userService: UserService, private _userPrevService: UsersPrevService) { 

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
