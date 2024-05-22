import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { StocktackingService } from 'src/app/Core/Api/SC/stocktacking.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-stocktaking-list',
  templateUrl: './stocktaking-list.component.html',
  styleUrls: ['./stocktaking-list.component.css']
})
export class StocktakingListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  constructor(private dataSharingService:DataSharingService
    ,private _StocktackingService :StocktackingService
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
     StockData : Array<any>=[];
     DocNo:any;
     Date:any;
     Store:any;
     Description:any;
     rowID:any;
     IsmodelShow:any;
     ReportUrl:any;
     comp:any;
     year:any;
     branch:any;
     idColName:any="n_document_no";
     formID:any=214;
     isEnglish:boolean=false;
     lang:any;
     
     LoadItems(){
      debugger;
      this.StockData=[];
       this.showspinner=true;
      this._StocktackingService.GetAll().subscribe((data)=>{  
        this.StockData=data;   
         this.showspinner=false;
      });
  
    }
  
    keyupTimer:any;
    Search(page:number=0) {
      this.keyupTimer = setTimeout(() => {
        this._StocktackingService.GetAll(this.DocNo, this.Date, this.Store, this.Description).subscribe((data)=>{  
          console.log(data);
          this.StockData=data;   
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
      this._StocktackingService.Delete(this.rowID).subscribe((data)=>{  
        debugger;
        this.showspinner=false;
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
