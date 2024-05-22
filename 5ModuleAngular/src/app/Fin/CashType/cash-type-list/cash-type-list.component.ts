import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CashTypeSerivce } from 'src/app/Core/Api/FIN/cash-type.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-cash-type-list',
  templateUrl: './cash-type-list.component.html',
  styleUrls: ['./cash-type-list.component.css']
})
export class CashTypeListComponent extends BaseComponent implements OnInit {

  constructor(
    private dataSharingService:DataSharingService
    ,private _SERIVEC:CashTypeSerivce,private _router  : Router
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
idColName:any="n_cash_type_id";
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
}

// end hooks methods



// start functions
LoadStores(page: number = 0){

   this.showspinner=true;
  this._SERIVEC.GetAllCashtypes(page, this.pageSize, this.searchString).subscribe((data)=>{
    debugger
    this.supplierTypeData = data.modelNameLST;
    this.totalItems = data.totalItems;
    this.showspinner=false;
  });

}
pageChanged(page: any){
  this.LoadStores(page.page);
}
DeleteRow() {
  this._SERIVEC.Delete(this.rowId).subscribe((data)=>{
    this.showspinner=false;
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
