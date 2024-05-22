import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { BankBranch } from 'src/app/Core/Api/FIN/bank-branch.service';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';
import { PopUpComponent } from 'src/app/SC/exporting-transactions/pop-up/pop-up.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-bank-branch-list',
  templateUrl: './bank-branch-list.component.html',
  styleUrls: ['./bank-branch-list.component.css']
})
export class BankBranchListComponent extends BaseComponent implements OnInit {

  tranactionsLST!: any;
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
    private _Service:BankBranch,
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
    this.LoadTransactions(this.pageNumber);
    LangSwitcher.translatefun();
  }

  LoadTransactions(page: number = 0) {
    this.showspinner = true;
    this._Service.GetAllBankBranches(page, this.pageSize, this.searchString).subscribe((data)=>{
      this.tranactionsLST = data.modelNameLST;
      this.tranactionsCount = data.totalItems;
      this.showspinner = false;
      LangSwitcher.translateData(1)
    });
  }

  Show(id:number)
  {
    debugger
    const dialogRef = this.dialogRef.open(PopUpComponent,{
      width:'700px',
      height:'600px',
      data:{'id':id}
    });
  }

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
