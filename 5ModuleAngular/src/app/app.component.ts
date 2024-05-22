import { Component, DoCheck, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataSharingService } from './_Services/General/data-sharing.service';
import { LoaderServiceService } from './_Services/General/loader-service.service';
import { UserService } from './_Services/user.service';
import { DataSharingSenderService } from './_Services/General/data-sharing-sender';
import { ConfigService } from './Core/Api/Sys/config.service';
import { ApiConfig } from './_Setting/ApiConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'AngularAdminPanel';
  showLoader = false;


  loadArabic = false;
  dynamicCSSUrlar!: string;
  dynamicCSSUrleng!: string;

  constructor(private dataSharingService: DataSharingService
    ,public translate: TranslateService, public sanitizer: DomSanitizer,private datagetter:DataSharingSenderService,
    private _configService: ConfigService
  )
  {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('ar');
    this.switchLang('ar');
  }

  flagImg!:string;
  isEnglish=false
  mainsShow:boolean=false;
  ngOnInit() {
    // ApiConfig.setConfig(this._configService.getApiUrl(), this._configService.getQrUrl(), this._configService.getReportUrl());

    this.isEnglish=window.sessionStorage.getItem("lan")=='English'? true:false;
    
    this.dataSharingService.isLoaderShown.subscribe(isLoaderShown => this.showLoader = isLoaderShown);
    
    this.datagetter.data.subscribe(d=>{
      this.mainsShow=d;
    })
    
    
    this.dynamicCSSUrlar = 'assets/css/styles-ar.css'
    this.dynamicCSSUrleng = 'assets/css/styles-en.css'
    
    this.setImgFlag();
  }


  setImgFlag(){
    if(this.loadArabic){
      this.flagImg="../assets/dist/img/en-flag.png";
    }
    else{
      this.flagImg="../assets/dist/img/ar-flag.png";
    }
  }
  ChangeMe(event:any){
     if(this.loadArabic )
     {
      this.switchLang('en')
     }
     else{
      this.switchLang('ar')
     }

     this.setImgFlag();
  }


  dynamicLoadingar(){
    this.loadArabic = true;
  }

  dynamicLoadingen(){
    this.loadArabic = false;
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    if (lang == "ar")
    {
      this.loadArabic = true;
    }
    else
    {
      this.loadArabic = false;

    }
  }

}
