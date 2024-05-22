import { Component, ElementRef, OnInit,ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EmpPopUpComponent } from './emp-pop-up/emp-pop-up.component';
import { Event, data } from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { StoreService } from 'src/app/Core/Api/SC/store.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpViewModel } from 'src/app/Core/model/SC/empolyee';
import { UserService } from 'src/app/_Services/user.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { BaseComponent } from 'src/app/base/base.component';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { Store } from 'src/app/Core/model/SC/Store';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css'],

})
export class StoresComponent  extends BaseComponent  implements OnInit {
  storeData!: any;
  dtOptions: DataTables.Settings = {};
  rowId: any;
  showspinner: boolean = false;
  itemName!: any;
  dtTrigger: Subject<any> = new Subject<any>();

  // -------- Pagination Properties -------------------------
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalItems: any;
  searchString: any;
  lastAutoNumber!: number;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_store_id";
  formID:any=201;

  constructor(private dataSharingService:DataSharingService
    ,private storeService:StoreService
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
     @ViewChild('closebutton') closebutton;
     totalRecords!: number;
     datasource;

     setPage(pageNo: number): void {
       this.currentPage = pageNo;
     }

     StoreName:any;
     AccountName:any;
     IsmodelShow:any;
     displayedColumns=["n_store_id","s_store_name","s_store_name_eng","n_employee_store_name"];
     isEnglish:boolean=false;
     lang:any;

     LoadStores(page: number = 0){
      debugger;
      this.showspinner=true;
      this.storeService.getAllStores(page, this.pageSize, this.searchString).subscribe((data)=>{
        this.storeData = data.modelNameLST;
        this.totalItems = data.totalItems;
        this.showspinner=false;
       LangSwitcher.translateData(1);
      });
    }

    override ngOnInit(): void {
      this.ReportUrl=ApiConfig.ReportUrl;
      this.lang=this.userservice.GetLanguage();
      this.comp=this.userservice.GetComp();
      this.year=this.userservice.GetYear();
      this.branch=this.userservice.GetBranch();
      this.LoadStores(this.pageNumber);
      LangSwitcher.translatefun();
      this.isEnglish=window.sessionStorage.getItem("lan")==='English' ?true : false;
      this.ChangeDirectionTable();
    } 

    pageChanged(page: any){
      this.LoadStores(page.page);
    }

    getRowId(rowNo) {
    this.rowId = rowNo;
   }

   keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadStores(this.pageNumber);
    }, 1000);
  }
  ChangeDirectionTable()
  {
    setTimeout(() => {
      debugger
      let tds=document.querySelectorAll(".custom-table-add > tbody > tr > td") ;
      for(let i =0;i<tds.length ;++i)
      {
        (tds[i] as HTMLElement ).style.textAlign='left'
      }
     
    }, 2000);
 
   
   

  }

  DeleteRow() {
    this.storeService.DeleteStore(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      let comingMsg=this.isEnglish? data.Emsg :data.msg
      this._notification.ShowMessage(comingMsg,data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.LoadStores(this.pageNumber);
      }
    });
   }

 
  }

