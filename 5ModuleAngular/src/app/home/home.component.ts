import { param } from 'jquery';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ScriptServiceService } from '../script-service.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_Services/user.service';
import { UsersPrevService } from '../_Services/Prev/users-prev.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private _scriptservice : ScriptServiceService, private _activatedRoute: ActivatedRoute, private _userService: UserService, private _userPrevService: UsersPrevService) {
  }

  ngOnInit(): void {
    this._scriptservice.loadScripts();
    var i = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this._userPrevService.GetUserForms(Number(this._activatedRoute.snapshot.paramMap.get('id'))).subscribe((data) => {
      this._userPrevService.GetAllUserForms().subscribe((res) => {
        this._userService.SaveAllUserForms(data,res);
        this._userPrevService.ChangeMenuTable(data);
        this._userService.SaveCurrentModule(i);
      });
    });
    this.revserseAsideLinksDiretion()
  }
  revserseAsideLinksDiretion()
  {
    debugger
   
   if(window.sessionStorage.getItem("lan")==="English")
   {
     setTimeout(() => {
       debugger
       let links =document.querySelectorAll('aside .sidebar nav ul li a');
       for(let i=0;i<links.length;++i)
       {
        ( links[i] as HTMLElement ).style.flexDirection='row-reverse';
       //  (( links[i] as HTMLElement ).children[2] as HTMLElement).style.transform="rotate(180deg)";
       }
      }, 780);
   }
 
  }
}

