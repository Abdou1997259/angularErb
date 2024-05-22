import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { SuppliercatService } from 'src/app/Core/Api/AP/suppliercat.service';

import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent extends BaseComponent implements OnInit {

  constructor(
    private dataSharingService:DataSharingService
    ,private _SERVICE:SuppliercatService
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
// end constructor

//start variables declartions
dtOptions: DataTables.Settings = {};
comp:any;
year:any;
ReportUrl:any;
currentPage!: number;
supplierCatData!: any;
pageNumber: number = 1;
pageSize: number = 10;
typeId: any;
typeName: any;
lastAutoNumber!: number;
showspinner: boolean = false;
totalItems: any;
keyupTimer:any;
rowId: any;
isEnglish:boolean=false;
branch:any;
idColName:any="n_id";
formID:any=471;
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

  LangSwitcher.translatefun();
 this.isEnglish=LangSwitcher.CheckLan();
}

// end hooks methods



// start functions
LoadStores(page: number = 0){

  this.showspinner=true;
  this._SERVICE.GetAllSupplierCat(page, this.pageSize, this.typeId, this.typeName).subscribe((data)=>{
    debugger
    this.supplierCatData = data.modelNameLST;
    this.totalItems = data.totalItems;
    this.showspinner=false;
LangSwitcher.translateData(1);
  });

}

pageChanged(page: any){
  this.LoadStores(page.page);
}

DeleteRow() {
  this._SERVICE.Delete(this.rowId).subscribe((data)=>{
    this.showspinner=false;
    if(this.isEnglish)
    this._notification.ShowMessage(data.Emsg,data.status);
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


// end functions

}
