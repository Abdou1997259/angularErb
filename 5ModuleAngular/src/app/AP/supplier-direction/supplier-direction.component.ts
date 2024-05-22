import { FormatWidth } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierDirection } from 'src/app/Core/Api/AP/supplier-direction.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { AccountDirectionComponent } from './account-direction/account-direction.component';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { BaseComponent } from 'src/app/base/base.component';
import { SupplierType } from 'src/app/Core/Api/AP/supplier-type.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-supplier-direction',
  templateUrl: './supplier-direction.component.html',
  styleUrls: ['./supplier-direction.component.css']
})
export class SupplierDirectionComponent extends BaseComponent implements OnInit {

  constructor(
    private dataSharingService:DataSharingService
    ,private _SERVICE:SupplierDirection
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
idColName:any="n_acc_dir_no";
formID:any=411;
isEnglish:boolean=false;
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
this.isEnglish=LangSwitcher.CheckLan()
  }

// end hooks methods



// start functions
LoadStores(page: number = 0){

   this.showspinner=true;
  this._SERVICE.GetAllDirType(page, this.pageSize, this.searchString).subscribe((data)=>{
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
  debugger
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
  debugger
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
