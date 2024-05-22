import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseDemand } from 'src/app/Core/Api/AP/purchase-demand.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-purchase-demand',
  templateUrl: './purchase-demand.component.html',
  styleUrls: ['./purchase-demand.component.css']
})
export class PurchaseDemandComponent extends BaseComponent implements OnInit {

   // start constructor
   constructor(
    
    private _SERVICE:PurchaseDemand
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
purchaseDemandData:any;
isEnglish:boolean=false;
comp:any;
year:any;
ReportUrl:any;
currentPage!: number;
pageNumber: number = 1;
pageSize: number = 10;
searchString: any;
lastAutoNumber!: number;
showspinner: boolean = false;
totalItems: any;
keyupTimer:any;
rowId: any;
branch:any;
idColName:any="n_purchase_order_no";
formID:any=418;
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
  this.LoadPurchaseDemand(this.pageNumber);
  LangSwitcher.translatefun();
  this.isEnglish=LangSwitcher.CheckLan(); 
  }

// end hooks methods



// start functions
LoadPurchaseDemand(page: number = 0){
  debugger;
   this.showspinner=true;
  this._SERVICE.GetAllPurchaseDemand(page, this.pageSize, this.searchString).subscribe((data)=>{
    this.purchaseDemandData = data.modelNameLST;
    this.totalItems = data.totalItems;
    this.showspinner=false;
  LangSwitcher.translateData(1);
  });

}
pageChanged(page: any){
  this.LoadPurchaseDemand(page.page);
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
      this.LoadPurchaseDemand(this.pageNumber);
    }
  });
 }
 getRowId(rowNo) {
  this.rowId = rowNo;
 }

 DoSearch(){
  clearTimeout(this.keyupTimer);
  this.keyupTimer = setTimeout(() => {
      this.LoadPurchaseDemand(this.pageNumber);
  }, 1000);
}
// end functions



}
