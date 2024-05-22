import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { Supplier } from 'src/app/Core/Api/AP/supplier.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent extends BaseComponent implements OnInit {

   // start constructor
   constructor(
    private dataSharingService:DataSharingService
    ,private _supplier:Supplier
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
supplierData:any;
comp:any;
year:any;
ReportUrl:any;
currentPage!: number;
pageNumber: number = 1;
pageSize: number = 5;
searchString: any;
lastAutoNumber!: number;
showspinner: boolean = false;
totalItems: any;
keyupTimer:any;
rowId: any;
branch:any;
idColName:any="n_supplier_id";
formID:any=402;
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
  debugger;
   this.showspinner=true;
  this._supplier.GetAllSupplierType(page, this.pageSize, this.searchString).subscribe((data)=>{
    this.supplierData = data.modelNameLST;
    this.totalItems = data.totalItems;
    this.showspinner=false;
 LangSwitcher.translateData(1);
  });


}
pageChanged(page: any){
  this.LoadStores(page.page);
}
DeleteRow() {
  this._supplier.Delete(this.rowId).subscribe((data)=>{
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
translateData()
{
  setTimeout(() => {
    if(window.sessionStorage.getItem("lan")==="English")
  {
    debugger
    let listOfElement=document.getElementsByClassName("translatedata");
    let regex=/[\u0600-\u06FF]/
    for(let i=0;i<listOfElement.length;++i)
    {
    
        if( regex.test(listOfElement[i].innerHTML))
           {
           
            let enWord=listOfElement[i].getAttribute("data-en") as string ;
            let arword=listOfElement[i].innerHTML;
            let swapper=enWord;
            enWord=arword;
            arword=swapper;
            listOfElement[i].setAttribute("data-en",enWord);
            listOfElement[i].innerHTML=arword;
           }
    }

  }
  }, 0);
  
}
translatefun()
{
  debugger
  if(window.sessionStorage.getItem("lan")==="English")
  {
    let listOfElement=document.getElementsByClassName("translate");
    let regex=/[\u0600-\u06FF]/
    for(let i=0;i<listOfElement.length;++i)
    {
        if(listOfElement[i].nodeName=='INPUT')
        {
          let inputElement=(listOfElement[i] as HTMLInputElement);
          if( regex.test(inputElement.value))
          {
          
           let enWord=listOfElement[i].getAttribute("data-en") as string ;
           let arword=inputElement.value;
           let swapper=enWord;
           enWord=arword;
           arword=swapper;
           listOfElement[i].setAttribute("data-en",enWord);
           inputElement.value=arword;
          }

        }
        else
        {
          if( regex.test(listOfElement[i].innerHTML))
          {
          
           let enWord=listOfElement[i].getAttribute("data-en") as string ;
           let arword=listOfElement[i].innerHTML;
           let swapper=enWord;
           enWord=arword;
           arword=swapper;
           listOfElement[i].setAttribute("data-en",enWord);
           listOfElement[i].innerHTML=arword;
          }
    
       
    }

  }
  }
}
}
