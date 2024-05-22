import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OutgoingCahsTransService } from 'src/app/Core/Api/FIN/outgoing-cash-trans.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-outgoing-cash-transfer-list',
  templateUrl: './outgoing-cash-transfer-list.component.html',
  styleUrls: ['./outgoing-cash-transfer-list.component.css']
})
export class OutgoingCashTransferListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};
  TransferData : Array<any>=[];
  DocNo:any;
  DocSerial:any;
  DocDate:any;
  CurrencyName:any;
  Description:any;
  Total:any;
  rowID:any;
  TypeID:any;
  IsmodelShow:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=511;
  isEnglish:boolean=false;
  lang:any;

  constructor( private _outgoingCashTransService :OutgoingCahsTransService, private _router  : Router, private _route  : ActivatedRoute,
    private userservice:UserService, public dialog: MatDialog, private _notification: NotificationServiceService)
  {
    super(_route.data,userservice);
      this.dtOptions = {
        pageLength: 7,
        processing: true,
        searching: false,
        destroy: true,
        ordering: false
      };
  }

  override ngOnInit(): void {
    this.ReportUrl = ApiConfig.ReportUrl;
    this.lang = this.userservice.GetLanguage();
    this.comp = this.userservice.GetComp();
    this.year = this.userservice.GetYear();
    this.branch = this.userservice.GetBranch();
    this.LoadOUtgoingCashTransferes();
    this.translatefun();
    if(window.sessionStorage["lan"]==="Englsih")
      this.isEnglish=true;
  }

  LoadOUtgoingCashTransferes(){
    this.TransferData=[];
    this.showspinner=true;
    this._outgoingCashTransService.GetAllOutgoingCashTrans().subscribe((data)=>{
      this.TransferData = data;
       this.showspinner=false;
       this.translateData();
    });
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._outgoingCashTransService.GetAllOutgoingCashTrans(this.DocNo, this.DocSerial,this.DocDate, this.CurrencyName, this.Description, this.Total).subscribe((data)=>{
        this.TransferData=data;
      })
    }, 1000);
  }

  getRowID(rowNo) {
    this.rowID = rowNo;
  }

  deleteRow()
  {
    this._outgoingCashTransService.Delete(this.rowID).subscribe((data)=>{
      this.showspinner=false;
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.LoadOUtgoingCashTransferes();
      }
    });
  }

  // PrintExcel(){
  //   $('#excelBTN').prop('disabled', true);
  //   this._RevenueService.ExportRevenues(this.DocNo, this.DocSerial,this.DocDate, this.CurrencyName, this.Description, this.Total);
  // }

  translateData()
  {
    setTimeout(() => {
      if(window.sessionStorage.getItem("lan")==="English")
      {
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
