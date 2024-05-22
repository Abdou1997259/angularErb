import { Component, EventEmitter, Input, OnInit, Output,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { user_prev } from '../_model/Prev/UserPrev';
import { UsersPrevService } from '../_Services/Prev/users-prev.service';
import { UserService } from '../_Services/user.service';
import { ApiConfig } from '../_Setting/ApiConfig';
import { DataSharingService } from '../_Services/General/data-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { CalculatorLKPComponent } from '../Controls/calculator-lkp/calculator-lkp.component';
import { NotificationServiceService } from '../_Services/notification-service.service';
import { PassenterLkpComponent } from '../Controls/passenter-lkp/passenter-lkp.component';
import { CompanyService } from '../Core/Api/GL/company.service';
import { ConfigService } from '../Core/Api/Sys/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  subscription: any;
  username: string = '';
  compName = ApiConfig.compName;
  userType = ApiConfig.userType;
  menutables: any = [];
  sideColor!: any;
  branches: any[] = [];
  icons: string[] = ["bi bi-gear" ,"bi bi-person-gear","bi bi-plus-circle","bi bi-vector-pen"]
  openCloseIcon: string[] = [ "bi bi-door-open","bi bi-door-closed"]
  currentYear!: any;
  currentUser!: any;
  currentCompany!: any;
  compID!:any;
  years: any[] = []
  currentBranch!: any;
  isEnglish: boolean = false;
  changeIcon: boolean = false;
  sendIconState:EventEmitter<boolean> = new EventEmitter<boolean>();
  comp: any = 0;
  userId:any=0;
  branchesByUser:Array<any>=[];
  @Output() ChangeLangClick = new EventEmitter();
  @Input() ImgFlag: string = '';
  constructor(private userservice : UserService, private router: Router, private userprevservice : UsersPrevService,
    private dialogRef: MatDialog, private datasender:DataSharingService, public dialog: MatDialog,
    private _companyService: CompanyService, private _notification: NotificationServiceService, private _configService: ConfigService)
  {
  }

  closeModal() {
    this.dialogRef.closeAll();
  }

  removeAside(){
    this.changeIcon= !(this.changeIcon);
  }

  ngOnInit(): void {
    this.isEnglish=window.sessionStorage.getItem("lan")=='English' ? true :false;
    setTimeout(() => {
      this.translatefun();
    }, 0);
    this.changeNavDirection()
    this.currentYear = this.userservice.GetYear();
    this.currentUser = this.userservice.GetUserName();
    this.currentCompany = this.userservice.GetCompName();
    this.userId=this.userservice.GetUserID();
    this.currentBranch = this.userservice.GetBranch();
    this.compID = this.userservice.GetComp();
    this.comp=window.localStorage.getItem("comp");
    this.sideColor = ApiConfig.sideParColor;
    this.subscription = this.userservice.currentusername.subscribe(x=>this.username = x);
    this.username = this.userservice.GetUserName();
    this.subscription = this.userprevservice.currentmenutables.subscribe(x=>this.menutables = x);


    this._configService.GetConfigFileProperties().subscribe((data) => {
      ApiConfig.setConfig(data.apiUrl, data.qrUrl, data.reportUrl);

      this._companyService.GetCompanyBranches(this.comp,this.currentYear).subscribe((branches) => {
        this.branches = branches;
      });

      this._companyService.GetAllYears().subscribe((data)=>{
        this.years=data;
      });

      this._companyService.GetCompanyBranchesByUser(this.comp,this.currentYear,this.userId).subscribe(val=>{
        this.branchesByUser=val
      });

      this.userprevservice.GetUserForms(Number(this.userservice.GetCurrentModule())).subscribe(data=>{
        this.sideColor = ApiConfig.sideParColor;
        this.menutables = data;
        this.userservice.SaveUserForms(data);
        this.revserseAsideLinksDiretion();
      });
      
    });
  }

  revserseAsideLinksDiretion()
  {
    if(this.isEnglish)
    {
      setTimeout(() => {
        // let links =document.querySelectorAll('aside .sidebar nav ul li a');
        // for(let i=0;i<links.length;++i)
        // {
        //  ( links[i] as HTMLElement ).style.flexDirection='row-reverse';

        // }
        }, 100);
    }
  }

  changeNavDirection()
  {
    setTimeout(() => {
      if(window.sessionStorage.getItem("lan")==="English")
      {
        let nav =document.querySelector("nav.main-header.navbar-expand");
        let navbar1=  nav?.children[0] as HTMLElement;
        let navbar2=  nav?.children[1] as HTMLElement;
        // ( nav as HTMLElement).style.flexDirection='row-reverse';
        // ( nav as HTMLElement).classList.add('changeDirection');
        // navbar1.style.flexDirection='row-reverse'
        // navbar2.style.flexDirection='row-reverse';
        // navbar2.style.justifyContent="flex-end"
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
           let enWord=listOfElement[i].getAttribute("data-en") as string;
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

  LogOut() {
    this.userservice.LogOut();
    this.userservice.ChangeUserName('');
    if( ApiConfig.userType==1)
    {
      window.sessionStorage.setItem('lan','عربي')
      this.router.navigate(['/comp']);
    }
    else
    {
      this.router.navigate(['/main/nlogin']);
    }
  }

  getColor(data: any) {
    console.log(data);
  }

  ChangeLang()
  {
      this.ChangeLangClick.emit(1);
  }

  GetModeuleNo()
  {
    return localStorage.getItem("moduleId") == null ? '0' : localStorage.getItem("moduleId");
  }

  OpenNavLink(item: any)
  {
    if(item.s_Menu_Arabic_Name == "فاتورة المطاعم - 2")
    {
      const dialogRef = this.dialog.open(PassenterLkpComponent, {
        width: '400px',
        height:'350px',
        data: {    }
      });
      dialogRef.afterClosed().subscribe(res => {
        this.userservice.GetUserShift(res.data).subscribe((data) => {
          if(data != null)
          {
            if(data.b_is_closed == 1 || data.b_is_closed == true)
            {
              this._notification.ShowMessage("هذه الورديه غير متاحة", 3);
              return;
            }
            else{
              var link = `${item.s_url}/?id=${data.n_shift_id}&saler=${data.s_employee_name}`;
              this.router.navigate([`${item.s_url}/${data.n_shift_id}/${data.n_saler_id}/${data.s_employee_name}`]);
            }
          }
          else{
            this._notification.ShowMessage("لا يوجد وردية لهذا الرقم", 3);
            return;
          }
        })
      });
    }
    else
    {
      this.router.navigate([item.s_url]);
    }
  }

  UpdateBranch()
  {
    this.userservice.UpdateBranch(this.compID,this.currentYear,this.currentBranch).subscribe(_users=>{
      this.userservice.SaveUserData(_users.userID , this.currentUser, _users.userType, _users.comp, _users.year, _users.branch, _users.token, _users.branchName,_users.compName, _users.s_branches, _users.s_stores, _users.s_cashes, _users.s_banks );
    });
    this.router.navigate(["#"]);
  }

  UpdateYear()
  {
    this.userservice.UpdateBranch(this.compID,this.currentYear,this.currentBranch).subscribe(_users=>{
      this.userservice.SaveUserData(_users.userID , this.currentUser, _users.userType, _users.comp, _users.year, _users.branch, _users.token, _users.branchName,_users.compName, _users.s_branches, _users.s_stores, _users.s_cashes, _users.s_banks );
    })
    this.router.navigate(["#"]);
  }
}
