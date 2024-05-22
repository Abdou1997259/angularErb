import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../_Services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSharingService } from '../_Services/General/data-sharing.service';
import { UsersPrevService } from '../_Services/Prev/users-prev.service';
import { ApiConfig } from '../_Setting/ApiConfig';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private renderer: Renderer2,private userservice : UserService
    ,private router: Router
    ,private toastr: ToastrService
    ,private dataSharingService:DataSharingService
    ,private userprevservice : UsersPrevService
    ) {

      this.renderer.addClass(document.body, 'customLogin');
      this.renderer.addClass(document.body, 'LoginFooter');

    }

    ngOnDestroy(): void {
      this.renderer.removeClass(document.body, 'customLogin');
      this.renderer.removeClass(document.body, 'LoginFooter');
    }


  user : users={ username:'',  password:''};
  showspinner:boolean=false;
  ngOnInit(): void {
    // this.userservice.GetUserType().subscribe(data=>{
    //   debugger;
    //   if(data==2)
    //     this.router.navigate(['/main/nlogin']);
    // });
    if(ApiConfig.userType==1)
      this.router.navigate(['/comp']);
    else
      this.router.navigate(['/main/nlogin']);

  }

  DoLogin(){
debugger;
    this.showspinner=true;

     this.userservice.GetUser(this.user.username,this.user.password).subscribe((data)=>{
      debugger;
      let _users:any=data;
      if(_users.isValid==true)
      {
          this.userprevservice.GetUserForms(_users.userID).subscribe((data)=>{
            debugger;
            this.userservice.SaveUserForms(data);
            this.userservice.ChangeUserName(this.user.username);
            this.userservice.SaveUserData(_users.userID , this.user.username, _users.userType, _users.cmop, _users.year, _users.branch, _users.token, _users.branchName,_users.compName, _users.s_branches, _users.s_stores, _users.s_cashes, _users.s_banks );
            this.userprevservice.ChangeMenuTable(data);
            this.router.navigate(['/modules']);
        });
      }
       else
       {
          this.toastr.warning('خطا!', 'إسم المستخدم او كلمة المرور خطأ');
       }
       this.showspinner=false;
     });
  }

}

export interface users {
  username :string,
  password : string
}
