import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PenlityService } from 'src/app/Core/Api/HR/penlity.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-penality-list',
  templateUrl: './penality-list.component.html',
  styleUrls: ['./penality-list.component.css']
})
export class PenalityListComponent extends BaseComponent implements OnInit {

  PenalityList!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  tranactionsCount!: any;
  searchString: any;
  showspinner: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  isEnglish:boolean=false
  constructor(
    private _Service:PenlityService,
    private _router  : Router ,
    private _route  : ActivatedRoute,
    private    userservice:UserService,privatedialog: MatDialog,
    private dialogRef:MatDialog,
    private _notification: NotificationServiceService
    ) {
      super(_route.data,userservice);    
    }
    
 @ViewChild('closebutton') closebutton;

 ReportUrl:any;
 UnitName:any;
 AccountName:any;
 IsmodelShow:any;
 comp:any;
 year:any;
 blalanceList;
 branch:any;
 idColName:any="n_bank_branch_id";
 formID:any=503;
 lang:any;

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    debugger
    this.LoadTransactions(this.pageNumber);
    LangSwitcher.translatefun();
  }

  LoadTransactions(page: number = 0) {
    debugger
    this.showspinner = true;
    this._Service.GetAllPenality(page, this.pageSize, this.searchString).subscribe((data)=>{
      this.PenalityList = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1)
    });
  }

  // Show(id:number)
  // {
  //   debugger
  //   const dialogRef = this.dialogRef.open(PopUpComponent,{
  //     width:'700px',
  //     height:'600px',
  //     data:{'id':id}
  //   });
  // }

  // LoadStores(){
  //   this.IntialBalanceData=[];
  //    this.showspinner=true;
  //   this._initialBalanceService.getAll().subscribe((data)=>{
  //     this.IntialBalanceData=data;
  //      this.showspinner=false;
  //   });
  // }
  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadTransactions(this.pageNumber);
    }, 1000);
  }

  DeleteRow()
  {
    debugger;
    this._Service.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status)
    else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.LoadTransactions(this.pageNumber);
      }
    });
  }

  pageChanged(page: any){
    this.LoadTransactions(page.page);
  }

  getRowID(rowNo) {
    this.rowId = rowNo;
  }

}
