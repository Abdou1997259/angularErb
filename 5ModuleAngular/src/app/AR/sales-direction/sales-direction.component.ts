import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDirectionComponent } from 'src/app/AP/supplier-direction/account-direction/account-direction.component';
import { SupplierDirection } from 'src/app/Core/Api/AP/supplier-direction.service';
import { salesDirection } from 'src/app/Core/Api/AR/customer-direction.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-sales-direction',
  templateUrl: './sales-direction.component.html',
  styleUrls: ['./sales-direction.component.css']
})
export class SalesDirectionComponent extends BaseComponent implements  OnInit {

  constructor(
    private dataSharingService:DataSharingService
    ,private _SERVICE:salesDirection
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
pageSize: number = 5;
searchString: any;
lastAutoNumber!: number;
showspinner: boolean = false;
totalItems: any;
isEnglish:boolean=false;
keyupTimer:any;
rowId: any;
@ViewChild('closebutton') closebutton;
//end variables declartions



//hooks Methods
 override ngOnInit(): void {
  debugger
  this.ReportUrl=ApiConfig.Apiurl2
  this.comp=this.userservice.GetComp();

  this.year=this.userservice.GetYear();

  this.LoadStores(this.pageNumber);
  this.translateData();
  this.translatefun();
  if(window.sessionStorage["lan"]==="English")
  {
    this.isEnglish=true;
  }
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
    this.translateData();
  });

}
pageChanged(page: any){
  this.LoadStores(page.page);
}
DeleteRow() {
  debugger
  this._SERVICE.Delete(this.rowId).subscribe((data)=>{
    this.showspinner=false;
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
