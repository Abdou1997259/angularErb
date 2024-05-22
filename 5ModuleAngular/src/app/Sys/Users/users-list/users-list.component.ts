import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UsersService } from 'src/app/Core/Api/Users/users.service';
import { ReplaySubject } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  constructor(private dataSharingService:DataSharingService
    ,private _UsersService :UsersService
    ,private _router  : Router 
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService) {
      super(_route.data,userservice);
      this.dtOptions = { 
        pageLength: 7, 
        processing: true,
        searching: false,
        destroy: true,
        ordering: false
      };
     }

     showspinner:boolean=false;
     dtOptions: DataTables.Settings = {};
     UsersData : Array<any>=[];
     UserID: any;
     UserName:any;
     GroupName:any;
     EmpName:any;
     rowID:any;
     IsmodelShow:any;
     isSubscribed:boolean=false;
     isEnglish:boolean=false;
  override ngOnInit(): void {
    if(ApiConfig.userType==2)
      this.isSubscribed=true;
    LangSwitcher.translatefun();
    this.LoadUsers();
  }

  LoadUsers(){
    debugger;
    this.UsersData=[];
     this.showspinner=true;
    this._UsersService.GetAllUsers().subscribe((data)=>{  
      this.UsersData=data;   
       this.showspinner=false;
       LangSwitcher.translateData(1);
    });

  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._UsersService.GetAllUsers(this.UserID,this.UserName, this.GroupName, this.EmpName).subscribe((data)=>{  
        console.log(data);
        this.UsersData=data;   
      });
    }, 1000);
  };

  DeleteUser()
  {
    debugger;
    this._UsersService.DeleteUser(this.rowID).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
      if(this.isEnglish) 
      this. _notification.ShowMessage(data.Emsg,data.status);
      else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton.nativeElement.click();   
        this.LoadUsers();
      }
    });
  }


  getRowID(rowNo) {
    this.rowID = rowNo;
  }


}
