import { Component, OnInit } from '@angular/core';
import { ModulesService } from '../Core/Api/System/modules.service';
import { Router } from '@angular/router';
import { UserService } from '../_Services/user.service';
import { UsersPrevService } from '../_Services/Prev/users-prev.service';
import { ApiConfig } from '../_Setting/ApiConfig';
import { ConfigService } from '../Core/Api/Sys/config.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  isEnglish:boolean=false
  modulesLST!: any;
  userName: string = '';
  colors: Array<any> = ["primary", "danger", "warning", "success", "info", "dark"];
  constructor(private _modulesService: ModulesService, private _router: Router, private userservice : UserService, 
    private userprevservice : UsersPrevService, private _configService: ConfigService) { }

  ngOnInit(): void {
    this._configService.GetConfigFileProperties().subscribe((data) => {
      ApiConfig.setConfig(data.apiUrl, data.qrUrl, data.reportUrl);
      this.getAllModules();
    });

    this.userName = this.userservice.GetUserName();
    this.contentDirectionChange()

  }

  getAllModules() {
    this.isEnglish=window.sessionStorage.getItem('lan')=='English'? true :false;

    this._modulesService.GetAllModules().subscribe((data) => {
      this.modulesLST = data;
    })
  }

  getModuleById(moduleId: Number) {
    debugger
    this._modulesService.GetModuleById(moduleId).subscribe((data) => {
      debugger
      this._router.navigate([`/home/${moduleId}`]);
    
      this.userservice.SaveUserForms(data);
      this.userprevservice.ChangeMenuTable(data);
      this.userservice.SaveCurrentModule(moduleId);
    })
  }

  contentDirectionChange()
  {
    if(window.sessionStorage.getItem("lan")==="English")
    {
      let content= document.querySelector(".content-wrapper");
      (content as HTMLElement).classList.add('changeDirection');
    }
  }

  SetSideParColor(i: number) {
    ApiConfig.sideParColor = this.colors[i];
  }

  SetCurrentMoudle(i: any) {
    localStorage.setItem("moduleId", i);
  }

}
