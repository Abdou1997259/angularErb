import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { ItemsService } from 'src/app/Core/Api/SC/items.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  constructor(private dataSharingService:DataSharingService
    ,private _ItemsService :ItemsService
    ,private _router  : Router 
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService
    ) {
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
     ItemsData : Array<any>=[];
     ItemNo:any;
     ItemName:any;
     GroupName:any;
     MGroupName:any;
     rowID:any;
     IsmodelShow:any;
     ReportUrl:any;
     comp:any;
     isEnglish:boolean=false;
     year:any;
     branch:any;
     idColName:any="s_item_id";
     formID:any=209;
     lang:any;

  LoadItems(){
    debugger;
    this.ItemsData=[];
     this.showspinner=true;
    this._ItemsService.getAllItems().subscribe((data)=>{  
      this.ItemsData=data;   
       this.showspinner=false;
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._ItemsService.getAllItems(this.ItemNo,this.ItemName, this.GroupName, this.MGroupName).subscribe((data)=>{  
        console.log(data);
        this.ItemsData=data;   
      });
    }, 1000);
  };

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadItems();
    
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();

    
    this.isEnglish=LangSwitcher.CheckLan();
  } 

  
  deleteRow()
  {
    this._ItemsService.DeleteItem(this.rowID).subscribe((data)=>{  
      debugger;
      this.showspinner=false;
      if(this.isEnglish)
         this. _notification.ShowMessage(data.Emsg,data.status);
      else
       this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){  
        this.closebutton.nativeElement.click();   
        this.LoadItems();
      }
    });
  }


  getRowID(rowNo) {
    this.rowID = rowNo;
  }
}
