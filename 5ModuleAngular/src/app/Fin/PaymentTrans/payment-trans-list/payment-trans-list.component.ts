import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PaymentTransService } from 'src/app/Core/Api/FIN/payment-trans.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-payment-trans-list',
  templateUrl: './payment-trans-list.component.html',
  styleUrls: ['./payment-trans-list.component.css']
})
export class PaymentTransListComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  paymentTransList: any;
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
  formID:any=513;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;
  lang:any;

  constructor(private _service: PaymentTransService, private _notification: NotificationServiceService,
    private _route  : ActivatedRoute, private userservice:UserService)
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
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.GetAllPaymentsTransLKP();

    LangSwitcher.translatefun()
    this.isEnglish=LangSwitcher.CheckLan();
  }

  GetAllPaymentsTransLKP()
  {
    this.paymentTransList = [];
    this.showspinner = true;
    this._service.GetAllPaymentsTransLKP().subscribe((data) => {
      this.paymentTransList = data;
      this.showspinner = false;
      LangSwitcher.translateData(1)
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllPaymentsTransLKP();
  }

  keyupTimer:any;
  Search(page:number=0) {
    this.keyupTimer = setTimeout(() => {
      this._service.GetAllPaymentsTransLKP(this.DocNo, this.DocDate, this.empName, this.salerName, this.description).subscribe((data)=>{
        this.paymentTransList = data;
      })
    }, 1000);
  }

  DeleteRow() {
    this._service.Delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      if(this.isEnglish)
       this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.GetAllPaymentsTransLKP();
      }
    });
  }

  // PrintExcel(){
  //   $('#excelBTN').prop('disabled', true);
  //   this..ExportRevenues(this.DocNo, this.DocSerial,this.DocDate, this.CurrencyName, this.Description, this.Total);
  // }
}
