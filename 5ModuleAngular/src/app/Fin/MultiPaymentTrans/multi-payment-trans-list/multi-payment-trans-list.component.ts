import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MultiPaymentTransService } from 'src/app/Core/Api/FIN/multi-payment-trans.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-multi-payment-trans-list',
  templateUrl: './multi-payment-trans-list.component.html',
  styleUrls: ['./multi-payment-trans-list.component.css']
})
export class MultiPaymentTransListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  multiPaymentTransList: any;
  PagingCount: any;
  DocNo:any;
  DocDate:any;
  empName:any;
  salerName:any;
  description:any;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=512;

  showspinner: boolean = false;
  isEnglsih:boolean=false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  lang:any;
 isEnglish:boolean=false
  constructor(
    private _service: MultiPaymentTransService
    ,private _notification: NotificationServiceService
    ,private _route  : ActivatedRoute
    ,private userservice:UserService) {
      super(_route.data,userservice);
     }

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.GetAllMultiPaymentsLKP();
    this.isEnglsih=LangSwitcher.CheckLan();
    LangSwitcher.translatefun();
  }

  GetAllMultiPaymentsLKP()
  {
    this.showspinner = true;
    this._service.GetAllMultiPaymentsLKP().subscribe((data) => {
      this.multiPaymentTransList = data;
      this.showspinner = false;
      LangSwitcher.translateData(1);
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllMultiPaymentsLKP();
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllMultiPaymentsLKP(this.DocNo, this.DocDate, this.empName, this.salerName, this.description).subscribe((data)=>{
        this.multiPaymentTransList = data;
      })
    }, 1000);
  }

  DeleteRow() {
    this._service.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      if(!this.isEnglsih)
      this. _notification.ShowMessage(data.Emsg,data.status);
       else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.GetAllMultiPaymentsLKP();
      }
    });
  }

}
