import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { OutgoingCahsTransService } from 'src/app/Core/Api/FIN/outgoing-cash-trans.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';

@Component({
  selector: 'app-outgoing-cash-transfer-add',
  templateUrl: './outgoing-cash-transfer-add.component.html',
  styleUrls: ['./outgoing-cash-transfer-add.component.css']
})
export class OutgoingCashTransferAddComponent implements OnInit {
  fin_Multi_trans!: FormGroup;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  docNo: number = 0;
  serialNo: number = 0;
  localCurrency: number = 0;
  n_currency_id: number = 0;

  SalesMenData: any = [];
  searchingSalesMen: boolean = false;
  filteredSalesMenServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  EmployeesData: any = [];
  searchingEmployees: boolean = false;
  filteredEmployeesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  GlCashesData: any = [];
  searchingGlCashes: boolean = false;
  filteredGlCashesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  GlCashesData2: any = [];
  searchingGlCashes2: boolean = false;
  filteredGlCashesServerSide2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  CurrencyData: any = [];

  constructor(private _service: OutgoingCahsTransService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private dialog: MatDialog, private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder,
    private _helperService: HelperService)
  {
    this.fin_Multi_trans = this._formBuilder.group({
      n_doc_no: new FormControl(''),
      n_DataAreaID: new FormControl(''),
      n_serial: new FormControl(''),
      d_doc_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      n_currency_id: new FormControl('', Validators.required),
      n_currency_coff: new FormControl(''),
      s_description: new FormControl(''),
      s_description_eng: new FormControl(''),
      n_journal_id: new FormControl(''),
      n_salesman_id: new FormControl(''),
      n_employee_id: new FormControl(''),
      n_total_value: new FormControl('', Validators.required),
      s_tafkita: new FormControl(''),
      n_source_id: new FormControl(),
      s_source_debit: new FormControl(''),
      s_source_credit: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      n_UserAdd: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      n_current_branch:'',
      n_current_company:'',
      n_current_year:''
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this.serialNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.LoadSalesMenDL('');
    this.LoadEmployeesDL('');
    this.LoadGlCashesDL('');
    this.LoadGlCashesDL2('');
    this.LoadCurrencyDL();

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });
    if(this.docNo <= 0)
    {
      this._service.GetCurrentTransfer().subscribe((data) => {
        this.fin_Multi_trans.patchValue(data);
        this.fin_Multi_trans.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetTransferByID(this.docNo).subscribe((data) => {
        this.serialNo = data.n_serial;
        this.fin_Multi_trans.patchValue(data);
        this.fin_Multi_trans.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        this.fin_Multi_trans.controls['s_source_credit'].setValue(Number(data.s_source_credit));
        this.fin_Multi_trans.controls['s_source_debit'].setValue(Number(data.s_source_debit));
        this.n_currency_id = data.n_currency_id;
        this.showspinner = false;
      });
    }

    this.translateData();
      this.translatefun();
      if(window.sessionStorage["lan"]==="English")
      {
        this.isEnglish=true
      }
  }

  LoadSalesMenDL(value: any)
  {
    this.searchingSalesMen = true;
    this._service.GetSalesMen(value).subscribe(res=>{
      this.SalesMenData = res;
      this.filteredSalesMenServerSide.next(this.SalesMenData.filter(x => x.s_name.toLowerCase().indexOf(value) > -1));
      this.searchingSalesMen=false;
    });
  }

  LoadEmployeesDL(value: any)
  {
    this.searchingEmployees = true;
    this._service.GetEmployees(value).subscribe(res=>{
      this.EmployeesData = res;
      this.filteredEmployeesServerSide.next(this.EmployeesData.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmployees=false;
    });
  }

  LoadGlCashesDL(value: any)
  {
    this.searchingGlCashes = true;
    this._service.GetGlCashes(value).subscribe(res=>{
      this.GlCashesData = res;
      this.filteredGlCashesServerSide.next(this.GlCashesData.filter(x => x.s_cash_name.toLowerCase().indexOf(value) > -1));
      this.searchingGlCashes=false;
    });
  }

  LoadGlCashesDL2(value: any)
  {
    this.searchingGlCashes2 = true;
    this._service.GetGlCashes(value).subscribe(res=>{
      this.GlCashesData2 = res;
      this.filteredGlCashesServerSide2.next(this.GlCashesData2.filter(x => x.s_cash_name.toLowerCase().indexOf(value) > -1));
      this.searchingGlCashes2 = false;
    });
  }

  LoadCurrencyDL()
  {
    this._helperService.GetCurrencies().subscribe(res=>{
      this.CurrencyData = res;
    });
  }

  ChangeCurrency()
  {
    this.n_currency_id = this.fin_Multi_trans.get('n_currency_id')?.value;
  }

  JournalShow()
  {
    if(this.fin_Multi_trans.get('n_total_value')?.value == '' || this.fin_Multi_trans.get('n_total_value')?.value == null || this.fin_Multi_trans.get('n_total_value')?.value <= 0)
    {
      this. _notificationService.ShowMessage('المبلغ يجب ان يكون اكبر من صفر',3);
      return;
    }

    var JournalID=0, edit=false;
    var savedJournals, currentJournals;
    var JournalType=101;
    var currency = this.fin_Multi_trans.get('n_currency_id')?.value;
    var descAr = this.fin_Multi_trans.get('s_description')?.value;
    var descEn='';
    var date=new DatePipe('en-US').transform(this.fin_Multi_trans.value.d_doc_date, 'yyyy/MM/dd');

    $('#btnJournal').prop('disabled', true);

    if(this.docNo !=null && this.docNo > 0 ){
      edit=true;
      this._service.GetJournalID(this.serialNo, JournalType).subscribe(res=>{
        JournalID=res;
        this._service.GetSavedJournals(JournalID).subscribe(data=>{
          savedJournals=data;
          this._service.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
            debugger
            currentJournals=current;
            $('#btnJournal').prop('disabled', false);
            const dialogRef = this.dialog.open(TransJournalsComponent, {
              width: '800px',
              height:'600px',
              data: { edit,JournalID,date,JournalType,currency,descAr,descEn, savedJournals,currentJournals }
            });
          });
        });
      });
    }
    else
    {
      this._service.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
        debugger;
        currentJournals = current;
        $('#btnJournal').prop('disabled', false);
        const dialogRef = this.dialog.open(TransJournalsComponent, {
          width: '800px',
          height:'600px',
          data: { edit,JournalID,date,JournalType,currency,descAr,descEn,currentJournals }
        });
      });
    }
  }

  SetJournalData(): any
  {
    var formData: any = new FormData();
    this.fin_Multi_trans.controls['n_doc_no'].enable();
    this.fin_Multi_trans.value.d_doc_date=new DatePipe('en-US').transform(this.fin_Multi_trans.value.d_doc_date, 'yyyy/MM/dd');
    formData.append("n_doc_no", this.fin_Multi_trans.value.n_doc_no ?? 0);
    formData.append("d_doc_date", this.fin_Multi_trans.value.d_doc_date);
    formData.append("n_serial", this.fin_Multi_trans.value.n_serial ?? 0);
    formData.append("n_currency_id", this.fin_Multi_trans.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.fin_Multi_trans.value.n_currency_coff ?? 0);
    formData.append("s_description", this.fin_Multi_trans.value.s_description);
    formData.append("n_total_value", this.fin_Multi_trans.value.n_total_value ?? 0);
    formData.append("n_source_id", this.fin_Multi_trans.value.n_source_id ?? 0);
    formData.append("s_source_credit", this.fin_Multi_trans.value.s_source_credit);
    formData.append("s_source_debit", this.fin_Multi_trans.value.s_source_debit);

    return formData;
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;
    var formData = new FormData();

    this.fin_Multi_trans.value.d_doc_date=new DatePipe('en-US').transform(this.fin_Multi_trans.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.fin_Multi_trans.value.n_doc_no ?? 0);
    formData.append('n_DataAreaID', this.fin_Multi_trans.value.n_DataAreaID ?? 0);
    formData.append('n_serial', this.fin_Multi_trans.value.n_serial ?? 0);
    formData.append('d_doc_date', this.fin_Multi_trans.value.d_doc_date ?? 0);
    formData.append('n_currency_id', this.fin_Multi_trans.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.fin_Multi_trans.value.n_currency_coff ?? 0);
    formData.append('s_description', this.fin_Multi_trans.value.s_description ?? '');
    formData.append('s_description_eng', this.fin_Multi_trans.value.s_description_eng ?? '');
    formData.append('n_journal_id', this.fin_Multi_trans.value.n_journal_id ?? 0);
    formData.append('n_salesman_id', this.fin_Multi_trans.value.n_salesman_id ?? 0);
    formData.append('n_employee_id', this.fin_Multi_trans.value.n_employee_id ?? 0);
    formData.append('n_total_value', this.fin_Multi_trans.value.n_total_value ?? 0);
    formData.append('s_tafkita', this.fin_Multi_trans.value.s_tafkita ?? '');
    formData.append('n_source_id', this.fin_Multi_trans.value.n_source_id ?? 0);
    formData.append('s_source_debit', this.fin_Multi_trans.value.s_source_debit ?? '');
    formData.append('s_source_credit', this.fin_Multi_trans.value.s_source_credit ?? '');
    formData.append('d_UserAddDate', this.fin_Multi_trans.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.fin_Multi_trans.value.d_UserUpdateDate ?? '');
    formData.append('n_UserAdd', this.fin_Multi_trans.value.n_UserAdd ?? 0);
    formData.append('n_UserUpdate', this.fin_Multi_trans.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.fin_Multi_trans.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.fin_Multi_trans.value.n_current_company ?? 0);
    formData.append('n_current_year', this.fin_Multi_trans.value.n_current_year ?? 0);

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        this. _notificationService.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/outgoingcashtransferlist']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      this. _notificationService.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/outgoingcashtransferlist']);
        }
      });
    }
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

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
