import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../_Services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSharingService } from '../../_Services/General/data-sharing.service';
import { UsersPrevService } from '../../_Services/Prev/users-prev.service';
import { SubscribeService } from 'src/app/Core/Api/Main/subscribe.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ModulesService } from '../../Core/Api/System/modules.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataSharingSenderService } from '../../_Services/General/data-sharing-sender';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  LoginForm!: FormGroup;
  lang:Array<string>=["عربي",'English']
  isEnglish:boolean=false;
  activeIndex: any;
  loadArabic = false;
  dynamicCSSUrlar!: string;
  dynamicCSSUrleng!: string;

  constructor(private renderer: Renderer2,private userservice : UserService
    ,private router: Router
    ,private toastr: ToastrService
    ,private dataSharingService:DataSharingService
    ,private userprevservice : UsersPrevService
    ,private _SubscribeService:SubscribeService
    ,private fb:FormBuilder
    ,private _modulesService:ModulesService
    ,public sanitizer: DomSanitizer
    ,private dataSender:DataSharingSenderService
    ) {
      if(ApiConfig.userType==1)
        this.router.navigate(['/comp']);

      this.renderer.addClass(document.body, 'customLogin');
      this.renderer.addClass(document.body, 'LoginFooter');

      this.LoginForm = this.fb.group({
        s_user_name: new FormControl('', Validators.required),
        s_user_password: new FormControl('', Validators.required)
      });

    }

    ngOnDestroy(): void {
      this.renderer.removeClass(document.body, 'customLogin');
      this.renderer.removeClass(document.body, 'LoginFooter');
    }



  showspinner:boolean=false;
  ngOnInit(): void {
    this.dataSender.sendDATA(true);
    this.setLang();
    this.translatefun();
    this.dynamicCSSUrlar = 'assets/css/styles-ar.css';
    this.dynamicCSSUrleng = 'assets/css/styles-en.css';
  }

  DoLogin(){
     this.showspinner=true;
     this._SubscribeService.Login(this.LoginForm.value.s_user_name,this.LoginForm.value.s_user_password).subscribe((data)=>{
      debugger;
      let _users:any=data;
      if(_users.isValid==true)
      {
        this.userservice.ChangeUserName(this.LoginForm.value.s_user_name);
        this.userservice.SaveUserData(_users.userID, this.LoginForm.value.s_user_name, _users.userType, _users.comp, _users.year, _users.branch, _users.token, _users.branchName,_users.compName, _users.s_branches, _users.s_stores, _users.s_cashes, _users.s_banks );

        this._modulesService.GetAllModules().subscribe((data) => {
          this.router.navigate(['/modules']).then(() => {
            window.location.reload();
          });
        });

      }
      else
      {
        this.toastr.warning('خطا!', 'إسم المستخدم او كلمة المرور خطأ');
      }
      this.showspinner=false;

     });
  }

  getLang(l)
  {

   window.sessionStorage.setItem("lan",l);
   this.isEnglish=window.sessionStorage.getItem("lan")=="English" ? true:false
  }

  setLang()
  {
    this.isEnglish= (window.sessionStorage.getItem("lan")=="English") ? true:false
  }

  translatefun()
  {
    let regex=/[\u0600-\u06FF]/
    let listOfElement=document.getElementsByClassName("translate")
    if(this.isEnglish)
    {
      for(let i=0;i<listOfElement.length;++i)
      {
        if(regex.test(listOfElement[i].innerHTML))
        {
          let word= listOfElement[i].innerHTML
          let dataEn=listOfElement[i].getAttribute("data-en") as string;

          listOfElement[i].innerHTML  =dataEn ;
          listOfElement[i].setAttribute("data-en",word)
        }
      }
    }
    else
    {
      for(let i=0;i<listOfElement.length;++i)
      {
        if(!regex.test(listOfElement[i].innerHTML))
        {
          let word= listOfElement[i].innerHTML
          let dataEn=listOfElement[i].getAttribute("data-en") as string;

          listOfElement[i].innerHTML  =dataEn ;
          listOfElement[i].setAttribute("data-en",word)
        }
      }
    }
  }

}
