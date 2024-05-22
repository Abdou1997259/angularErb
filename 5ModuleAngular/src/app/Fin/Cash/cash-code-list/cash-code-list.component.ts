import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CashTypeSerivce } from 'src/app/Core/Api/FIN/cash-type.service';
import { CashService } from 'src/app/Core/Api/FIN/cash.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
@Component({
  selector: 'app-cash-code-list',
  templateUrl: './cash-code-list.component.html',
  styleUrls: ['./cash-code-list.component.css']
})
export class CashCodeListComponent extends BaseComponent implements OnInit {
  cashId: any;
  cashName: any;

  constructor(
    private dataSharingService:DataSharingService
    ,private _SERIVEC:CashService,private _router  : Router
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService) { super(_route.data,userservice);
    this.dtOptions = {
      pageLength: 7,
      processing: true,
      searching: false,
      destroy: true,
      ordering: false
    };
   }
// end constructor

//start variables declartions
dtOptions: DataTables.Settings = {};
comp:any;
year:any;
ReportUrl:any;
currentPage!: number;
supplierTypeData!: any;
pageNumber: number = 1;
pageSize: number = 10;
searchString: any;
lastAutoNumber!: number;
showspinner: boolean = false;
totalItems: any;
keyupTimer:any;
rowId: any;
branch:any;
isEnglish:boolean=false;
idColName:any="n_cash_id";
formID:any=504;
lang:any;
@ViewChild('closebutton') closebutton;
//end variables declartions



//hooks Methods
 override ngOnInit(): void {
  this.ReportUrl=ApiConfig.ReportUrl;
  this.lang=this.userservice.GetLanguage();
  this.comp=this.userservice.GetComp();
  this.year=this.userservice.GetYear();
  this.branch=this.userservice.GetBranch();
  this.LoadStores(this.pageNumber);
  LangSwitcher.translatefun()
 this.isEnglish=LangSwitcher.CheckLan();
}

// end hooks methods



// start functions
LoadStores(page: number = 0){

   this.showspinner=true;
  this._SERIVEC.GetAllCashs(page, this.pageSize, this.cashId, this.cashName).subscribe((data)=>{
    debugger
    this.supplierTypeData = data.modelNameLST;
    this.totalItems = data.totalItems;
    this.showspinner=false;
    LangSwitcher.translateData(1)
  });

}
pageChanged(page: any){
  this.LoadStores(page.page);
}
DeleteRow() {
  this._SERIVEC.Delete(this.rowId).subscribe((data)=>{
    this.showspinner=false;
    if(this.isEnglish)
    this._notification.ShowMessage(data.Emsg,data.status)
  else
    this._notification.ShowMessage(data.msg,data.status);
    if(data.status==1){
      this.closebutton.nativeElement.click();
      this.LoadStores(this.pageNumber);
    }
  });
 }
 getRowId(rowNo) {
  this.rowId = rowNo;
 }

 DoSearch(){
  clearTimeout(this.keyupTimer);
  this.keyupTimer = setTimeout(() => {
      this.LoadStores(this.pageNumber);
  }, 1000);
}

}
