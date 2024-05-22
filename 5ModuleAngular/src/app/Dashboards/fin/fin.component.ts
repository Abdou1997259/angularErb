import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ScriptServiceService } from '../../script-service.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../_Services/user.service';
import { UsersPrevService } from '../../_Services/Prev/users-prev.service';

@Component({
  selector: 'app-fin',
  templateUrl: './fin.component.html',
  styleUrls: ['./fin.component.css']
})
export class FINComponent implements OnInit {

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
    { name: "المقبوضات", value: 925 },
    { name: "المصروفات", value: 3062 }
  ];

  
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
  

}
