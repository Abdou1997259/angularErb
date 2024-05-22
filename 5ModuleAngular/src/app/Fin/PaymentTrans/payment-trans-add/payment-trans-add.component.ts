import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, filter } from 'rxjs';
import { PaymentTransService } from 'src/app/Core/Api/FIN/payment-trans.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LoadInvoicesComponent } from '../../Invoices/load-invoices/load-invoices.component';
import { DatePipe } from '@angular/common';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-payment-trans-add',
  templateUrl: './payment-trans-add.component.html',
  styleUrls: ['./payment-trans-add.component.css']
})
export class PaymentTransAddComponent implements OnInit {
  fin_payment_trans!: FormGroup;
  showspinner: boolean = false;
  n_doc_no: number = 0;
  localCurrency: number = 0;
  n_currency_id: number = 0;

  timeout: any;
  curencyList: any;
  salersList: any;
  employeeList: any;

  DebitTypes:any=[];
  CardData:any=[];
  CreditTypes:any=[];
  DebitData:any=[];
  CreditData:any=[];
  TransferData:any=[];
  searchingDebit:boolean=false;
  searchingCredit:boolean=false;
  searchingSalesman:boolean=false;
  searchingEmployee:boolean=false;
  searchingCost:boolean=false;
  searchingCost2:boolean=false;
  filteredDebitServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCreditServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredSalesmanServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredEmployeeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  isBank:boolean=false;
  isTransfer:boolean=false;
  isCard:boolean=false;
  isRecieved:boolean=false;
  isSupplier:boolean=false;
  editMode:boolean=false;

  invoicesLST: any[] = [];
  CostData:any=[];
  Cost2Data:any=[];
  isEnglish:boolean=false;

  constructor(private _service: PaymentTransService,private _notification: NotificationServiceService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder,
    private _helperService: HelperService, private dialog: MatDialog, private _lookUp:GenerealLookup)
  {
    this.fin_payment_trans = this._formBuilder.group({
      n_doc_no: '',
      n_serial: '',
      d_doc_date:new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      n_currency_id:new FormControl('', Validators.required),
      n_currency_coff:'',
      s_description:'',
      s_description_eng:'',
      n_total_value:new FormControl('', Validators.required),
      n_source_debit:new FormControl('', Validators.required),
      n_source_credit:new FormControl('', Validators.required),
      s_source_debit:new FormControl('', Validators.required),
      s_source_credit:new FormControl('', Validators.required),
      n_employee_id: '',
      n_salesman_id: '',
      s_cost_center_id:'',
      s_cost_center_id2:'',
      s_cheque_no:'',
      d_due_date:'',
      s_collection_bank:'',
      d_cheque_received_date:'',
      b_Cheque_Status:'',
      b_cheque_ReceiveDone:'',
      s_cheque_Benifer:'',
      n_transferType:'',
      s_transfer_no:'',
      s_IBAN:'',
      s_SwiftCode:'',
      s_TransferToAccount:'',
      s_Country:'',
      sCity:'',
      sAddress:'',
      n_bank_commission:'',
      b_received:'',
      n_credit_card_type:'',
      s_credit_card_no:'',
      s_credit_card_no_Auth:'',
      d_credit_card_expiry_date:'',
      n_DataAreaID:'',
      n_UserAdd:'',
      d_UserAddDate:'',
      n_current_branch:'',
      n_current_company:'',
      n_current_year:'',
      b_advanced_payment: '',
      s_detail_description_down: '',
      s_detail_description_eng_down: '',
      s_detail_description_up: '',
      s_detail_description_eng_up: '',

      fin_payment_trans_invoices: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_doc_no = Number( this._activatedRoute.snapshot.paramMap.get('id') );

    this.getTypes();
    this.getTransferTypes();
    this.getCardTypes();
    this.searchSalesman('');
    this.searchEmployee('');
    this.searchCost('');
    this.searchCost2('');

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });

    this._helperService.GetCurrencies().subscribe((data) => {
      this.curencyList = data;
    });

    if(this.n_doc_no <= 0)
    {
      this._service.GetCurrentPaymentTrans().subscribe((data) => {
        this.fin_payment_trans.patchValue(data);
        this.fin_payment_trans.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));

        this.showspinner = false;
      });
    }

    if(this.n_doc_no > 0)
    {
      this.editMode=true;
      this.showspinner=true;
      this._service.GetByID(this.n_doc_no).subscribe(data=>{
        this.n_currency_id = data.n_currency_id;
        this.fin_payment_trans.patchValue(data);
        this.fin_payment_trans.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        this.ChangeCreditItems();
        this.ChangeDebitItems();

        if(data.n_source_debit==3)
          this.fin_payment_trans.controls['s_source_debit'].setValue(data.s_source_debit);
        else
          this.fin_payment_trans.controls['s_source_debit'].setValue(Number(data.s_source_debit));

        if(data.n_source_credit==3)
          this.fin_payment_trans.controls['s_source_credit'].setValue(data.s_source_credit);
        else
          this.fin_payment_trans.controls['s_source_credit'].setValue(Number(data.s_source_credit));

          this.DebitChanged();
          this.CreditChanged();

        this.showspinner=false;
      });
    }
    LangSwitcher.translateData(1)
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan()

  }

  get fin_payment_trans_details(): FormArray
  {
    return this.fin_payment_trans.get('fin_payment_trans_details') as FormArray;
  }

  get fin_payment_trans_invoices(): FormArray
  {
    return this.fin_payment_trans.get('fin_payment_trans_invoices') as FormArray;
  }

  new_InvoiceDetailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      n_doc_no: '',
      n_DataAreaID: '',
      d_UserAddDate: '',
      d_UserUpdateDate: '',
      n_supplier_id: '',
      s_invoice_no: '',
      n_journal_id: '',
      d_invoice_date: '',
      n_invoice_value: '',
      n_ReturnInvoice_value: '',
      n_credit_note: '',
      n_pre_cash_discount: '',
      n_pre_paid_value: '',
      n_cash_discount: '',
      n_paid_valuee: '',
      n_remain_value: '',
      s_notes: ''
    });
  }

  add_InvoiceDetailsRow()
  {
    this.fin_payment_trans_invoices.push(this.new_InvoiceDetailsRow(this.fin_payment_trans_invoices.length + 1));
  }

  getTypes(){
    this._helperService.GetDebitTypes().subscribe(res=>{
      this.DebitTypes=res;
    });
    this._helperService.GetCreditTypes().subscribe(res=>{
      this.CreditTypes=res;
    });
  }

  getTransferTypes(){
    this._helperService.GetTransferTypes().subscribe(res=>{
      this.TransferData=res;
    });
  }

  getCardTypes(){
    this._helperService.GetCardTypes().subscribe(res=>{
      this.CardData=res;
    });
  }

  currencyChanged()
  {
    this.n_currency_id = Number( this.fin_payment_trans.value.n_currency_id );
    if(this.n_currency_id == this.localCurrency)
    {
      this.fin_payment_trans.get('n_currency_coff')?.patchValue(1);
    }
  }

  searchDebit(value :any){
    var type=this.fin_payment_trans.get("n_source_debit")?.value;
    this.searchingDebit=true;
    this._helperService.GetDebitItems(type, value).subscribe(res=>{
      this.DebitData=res;
      this.filteredDebitServerSide.next(  this.DebitData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.searchingDebit=false;
    });
  }

  searchCredit(value :any){
    var type=this.fin_payment_trans.get("n_source_credit")?.value;
    this.searchingCredit=true;
    this._helperService.GetCreditItems(type, value).subscribe(res=>{
      this.CreditData=res;
      this.filteredCreditServerSide.next(this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.searchingCredit=false;
    });
  }

  CreditChanged()
  {
    var type=this.fin_payment_trans.get("n_source_credit")?.value;
    var typeDebit=this.fin_payment_trans.get("n_source_debit")?.value;
    if(type==102 || typeDebit == 102)
      this.isBank=true;
    else
      this.isBank=false;

    if(type== 2)
      this.isSupplier = true;
    else
      this.isSupplier = false;
  }

  DebitChanged()
  {
    var type=this.fin_payment_trans.get("n_source_debit")?.value;
    if(type==102)
    this.isBank=true;
    else
      this.isBank=false;

    if(type==103)
      this.isTransfer=true;
    else
      this.isTransfer=false;

    if(type==104)
      this.isCard=true;
    else
      this.isCard=false;
  }

  searchSalesman(value :any){
    this.searchingSalesman=true;
    this._helperService.getAdverMenLKP(value).subscribe(res=>{
      this.salersList=res;
      this.filteredSalesmanServerSide.next(  this.salersList.filter(x => x.s_name.toLowerCase().indexOf(value) > -1));
      this.searchingSalesman=false;
    });
  }

  searchEmployee(value :any){
    this.searchingEmployee=true;
    this._helperService.getPaymentEmployeesLKP(value).subscribe(res=>{
      this.employeeList=res;
      this.filteredEmployeeServerSide.next(  this.employeeList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmployee=false;
    });
  }

  searchCost(value :any){
    this.searchingCost=true;
    this._helperService.getCostCebterLKP(value).subscribe(res=>{
      this.CostData=res;
      this.filteredCostCenterServerSide.next(  this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost=false;
    });
  }

  searchCost2(value :any){
    this.searchingCost2=true;
    this._helperService.getCostCebterLKP(value).subscribe(res=>{
      this.Cost2Data=res;
      this.filteredCostCenter2ServerSide.next(  this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost2=false;
    });
  }

  Save()
  {
    if(this.ValidateForm() == false)
      return;

    this.showspinner = true;
    var formData = new FormData();
    this.fin_payment_trans.value.d_doc_date=new DatePipe('en-US').transform(this.fin_payment_trans?.value.d_doc_date, 'yyyy/MM/dd');
    this.fin_payment_trans.value.d_due_date=new DatePipe('en-US').transform(this.fin_payment_trans?.value.d_due_date, 'yyyy/MM/dd');
    this.fin_payment_trans.value.d_cheque_received_date=new DatePipe('en-US').transform(this.fin_payment_trans?.value.d_cheque_received_date, 'yyyy/MM/dd');

    formData.append("n_doc_no", this.fin_payment_trans.value.n_doc_no ?? 0);
    formData.append("d_doc_date", this.fin_payment_trans.value.d_doc_date ?? '');
    formData.append("n_serial", this.fin_payment_trans.value.n_serial ?? 0);
    formData.append("n_currency_id", this.fin_payment_trans.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.fin_payment_trans.value.n_currency_coff ?? 0);
    formData.append("s_description", this.fin_payment_trans.value.s_description ?? '');
    formData.append("s_description_eng", this.fin_payment_trans.value.s_description_eng ?? '');
    formData.append("n_total_value", this.fin_payment_trans.value.n_total_value ?? 0);
    formData.append("n_source_debit", this.fin_payment_trans.value.n_source_debit ?? 0);
    formData.append("n_source_credit", this.fin_payment_trans.value.n_source_credit ?? 0);
    formData.append("s_source_debit", this.fin_payment_trans.value.s_source_debit ?? '');
    formData.append("s_source_credit", this.fin_payment_trans.value.s_source_credit ?? '');
    formData.append("s_cost_center_id", this.fin_payment_trans.value.s_cost_center_id ?? '');
    formData.append("s_cost_center_id2", this.fin_payment_trans.value.s_cost_center_id2 ?? '');
    formData.append("n_DataAreaID", this.fin_payment_trans.value.n_DataAreaID ?? 0);
    formData.append("n_UserAdd", this.fin_payment_trans.value.n_UserAdd ?? 0);
    formData.append("d_UserAddDate", this.fin_payment_trans.value.d_UserAddDate ?? '');
    formData.append("d_due_date", this.fin_payment_trans.value.d_due_date ?? '');
    formData.append("s_cheque_no", this.fin_payment_trans.value.s_cheque_no ?? '');
    formData.append("s_collection_bank", this.fin_payment_trans.value.s_collection_bank ?? '');
    formData.append("d_cheque_received_date", this.fin_payment_trans.value.d_cheque_received_date ?? '');
    formData.append("b_Cheque_Status", this.fin_payment_trans.value.b_Cheque_Status ?? false);
    formData.append("b_cheque_ReceiveDone", this.fin_payment_trans.value.b_cheque_ReceiveDone ?? false);
    formData.append("s_cheque_Benifer", this.fin_payment_trans.value.s_cheque_Benifer ?? '');
    formData.append("s_transfer_no", this.fin_payment_trans.value.s_transfer_no ?? '');
    formData.append("n_transferType", this.fin_payment_trans.value.n_transferType ?? 0);
    formData.append("s_IBAN", this.fin_payment_trans.value.s_IBAN ?? '');
    formData.append("s_SwiftCode", this.fin_payment_trans.value.s_SwiftCode ?? '');
    formData.append("s_TransferToAccount", this.fin_payment_trans.value.s_TransferToAccount ?? '');
    formData.append("s_Country", this.fin_payment_trans.value.s_Country ?? '');
    formData.append("sCity", this.fin_payment_trans.value.sCity ?? '');
    formData.append("sAddress", this.fin_payment_trans.value.sAddress ?? '');
    formData.append("n_bank_commission", this.fin_payment_trans.value.n_bank_commission ?? 0);
    formData.append("b_received", this.fin_payment_trans.value.b_received ?? false);
    formData.append("n_credit_card_type", this.fin_payment_trans.value.n_credit_card_type ?? 0);
    formData.append("s_credit_card_no", this.fin_payment_trans.value.s_credit_card_no ?? '');
    formData.append("s_credit_card_no_Auth", this.fin_payment_trans.value.s_credit_card_no_Auth ?? '');
    formData.append("d_credit_card_expiry_date", this.fin_payment_trans.value.d_credit_card_expiry_date ?? '');
    formData.append("n_employee_id", this.fin_payment_trans.value.n_employee_id ?? 0);
    formData.append("n_salesman_id", this.fin_payment_trans.value.n_salesman_id ?? 0);
    formData.append("b_advanced_payment", this.fin_payment_trans.value.b_advanced_payment ?? false);
    formData.append("s_detail_description_down", this.fin_payment_trans.value.s_description ?? '');
    formData.append("s_detail_description_eng_down", this.fin_payment_trans.value.s_description_eng ?? '');
    formData.append("s_detail_description_up", this.fin_payment_trans.value.s_description ?? '');
    formData.append("s_detail_description_eng_up", this.fin_payment_trans.value.s_description_eng ?? '');
    formData.append("n_journal_id", this.fin_payment_trans.value.n_journal_id ?? 52);

    // if(this.fin_payment_trans_invoices.length > 0)
    // {
    //   for(var i = 0; i < this.fin_payment_trans_invoices.length; i++)
    //   {
    //     this.fin_payment_trans.value.fin_payment_trans_invoices[i].d_invoice_date=new DatePipe('en-US').transform(this.fin_payment_trans.value.fin_payment_trans_invoices[i].d_invoice_date, 'yyyy/MM/dd');
    //     formData.append(`fin_payment_trans_invoices[${i}].nLineNo`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].nLineNo ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_doc_no`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_doc_no ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_DataAreaID`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_DataAreaID ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].d_UserAddDate`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].d_UserAddDate ?? '');
    //     formData.append(`fin_payment_trans_invoices[${i}].d_UserUpdateDate`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].d_UserUpdateDate ?? '');
    //     formData.append(`fin_payment_trans_invoices[${i}].n_supplier_id`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_supplier_id ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].s_invoice_no`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].s_invoice_no ?? '');
    //     formData.append(`fin_payment_trans_invoices[${i}].n_journal_id`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_journal_id ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].d_invoice_date`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].d_invoice_date ?? '');
    //     formData.append(`fin_payment_trans_invoices[${i}].n_invoice_value`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_invoice_value ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_ReturnInvoice_value`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_ReturnInvoice_value ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_credit_note`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_credit_note ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_pre_cash_discount`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_pre_cash_discount ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_pre_paid_value`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_pre_paid_value ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_cash_discount`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_cash_discount ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_paid_value`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_paid_valuee ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].n_remain_value`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].n_remain_value ?? 0);
    //     formData.append(`fin_payment_trans_invoices[${i}].s_notes`, this.fin_payment_trans.value.fin_payment_trans_invoices[i].s_notes ?? '');
    //   }
    // }

    if(this.n_doc_no !=null && this.n_doc_no > 0 ) {
      this._service.Edit(formData).subscribe(data=> {
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
         this._notification.ShowMessage(data.Emsg,data.status)
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/paymentTransList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
       this._notification.ShowMessage(data.Emsg,data.status)
      else
       this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/paymentTransList']);
        }
      });
    }
  }

  ValidateForm(): boolean
  {
    var isValid = true;
    if(this.fin_payment_trans.value.n_source_debit == '' || this.fin_payment_trans.value.n_source_debit == null || this.fin_payment_trans.value.n_source_debit == 0)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Please choose the credit source',3)
    else
      this._notification.ShowMessage('من فضلك اختر جهة الدائن', 3);
      isValid = false;
    }

    if(this.fin_payment_trans.value.n_total_value == '' || this.fin_payment_trans.value.n_total_value == null || this.fin_payment_trans.value.n_total_value == 0)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Please insert the sum ',3)
    else
      this._notification.ShowMessage('من فضلك ادخل المبلغ دائن!', 3);
      isValid = false;
    }

    if(this.fin_payment_trans.value.n_source_credit == '' || this.fin_payment_trans.value.n_source_credit == null || this.fin_payment_trans.value.n_source_credit == 0)
    {
      if(this.isEnglish)
         this._notification.ShowMessage('Please choose debit source',3)
      else
         this._notification.ShowMessage('من فضلك اختر جهة المدين', 3);
      isValid = false;
    }

    return isValid;
  }

  ChangeDebitItems()
    {
      var type=this.fin_payment_trans.get("n_source_debit")?.value;
      this.searchingDebit=true;
      this._helperService.GetDebitItems(type).subscribe(res=>{
        this.DebitData=res;
        this.filteredDebitServerSide.next(  this.DebitData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
        this.searchingDebit=false;
      });
  }

  ChangeCreditItems()
  {
    var type=this.fin_payment_trans.get("n_source_credit")?.value;
    this.searchingCredit=true;
    this._helperService.GetCreditItems(type).subscribe(res=>{
      this.CreditData=res;
      this.filteredCreditServerSide.next(this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
      this.searchingCredit=false;
    });
  }

  isRecievedChanged()
  {
    var isChecked = this.fin_payment_trans.get('b_cheque_ReceiveDone')?.value;
    if(isChecked == true)
      this.isRecieved = true;
    else
      this.isRecieved = false;
  }

  loadInvoices()
  {
    var sourceId=  Number( this.fin_payment_trans.get('n_source_credit')?.value );
    var sourceNo = Number( this.fin_payment_trans.get('s_source_credit')?.value );

    if(sourceId == 2)
    {
      if(sourceNo == 0 || sourceNo == null)
      {
        this._notification.ShowMessage(`من فضلك اختر كود المورد`, 3);
        return;
      }
      else
      {
        var sourceName = this.CreditData.filter(v => v.n_source_id == sourceNo)[0]['s_source_name'];
        const dialogRef = this.dialog.open(LoadInvoicesComponent, {
          width: '1200px',
          height:'700px',
          data: { sourceNo, sourceName }
        });
        dialogRef.afterClosed().subscribe(res => {
          debugger
          this.fin_payment_trans_invoices.clear();
          for(var i = 0; i < res.data2.length; i++)
          {
            this.fin_payment_trans_invoices.push(this.new_InvoiceDetailsRow(this.fin_payment_trans_invoices.length + 1));
          }
          this.fin_payment_trans_invoices.patchValue(res.data2);
          for(var i = 0; i < res.data2.length; i++)
          {
            ((this.fin_payment_trans.get('fin_payment_trans_invoices') as FormArray).at(i) as FormGroup).get('d_invoice_date')?.patchValue(new Date(Number(res.data2[i].d_invoice_date.substring(0,4)), Number(res.data2[i].d_invoice_date.substring(5,7))-1, Number(res.data2[i].d_invoice_date.substring(8,10))));
          }
        });
      }
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

  JournalShow(){
    var val = Number(this.fin_payment_trans.get('n_total_value')?.value);

    if(val <= 0)
    {
      this. _notification.ShowMessage('يجب ان يكون المبلغ اكبر من 0',3);
      return;
    }
    if(this.fin_payment_trans.get('s_source_debit')?.value=='')
    {
      this. _notification.ShowMessage('اختر رقم جهة الدائن من فضلك',3);
      return;
    }
    if(this.fin_payment_trans.get('s_source_credit')?.value=='')
    {
      this. _notification.ShowMessage('اختر رقم جهة المدين من فضلك',3);
      return;
    }
    if(this.fin_payment_trans.get('n_total_value')?.value==0 ||this.fin_payment_trans.get('n_total_value')?.value=='')
    {
      this. _notification.ShowMessage('ادخل مبلغ من فضلك',3);
      return;
    }
    var JournalID=0, edit=false;
    var savedJournals, currentJournals;
    var JournalType=52;
    var currency=this.fin_payment_trans.get('n_currency_id')?.value;
    var descAr=this.fin_payment_trans.get('s_description')?.value;
    var descEn='';
    var date=new DatePipe('en-US').transform(this.fin_payment_trans.value.d_doc_date, 'yyyy/MM/dd');
    $('#btnJournal').prop('disabled', true);

    if(this.n_doc_no !=null && this.n_doc_no > 0 ){
      debugger;
      edit=true;
      this._helperService.GetJournalID(this.n_doc_no,JournalType).subscribe(res=>{
        debugger;
        JournalID=res;
        this._service.GetSavedJournals(JournalID).subscribe(data=>{
          debugger;
          savedJournals=data;
          this._service.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
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
        currentJournals=current;
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
    this.fin_payment_trans.controls['n_doc_no'].enable();
    this.fin_payment_trans.value.d_doc_date=new DatePipe('en-US').transform(this.fin_payment_trans.value.d_doc_date, 'yyyy/MM/dd');
    formData.append("n_doc_no", this.fin_payment_trans.value.n_doc_no ?? 0);
    formData.append("d_doc_date", this.fin_payment_trans.value.d_doc_date);
    formData.append("n_serial", this.fin_payment_trans.value.n_serial ?? 0);
    formData.append("n_currency_id", this.fin_payment_trans.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.fin_payment_trans.value.n_currency_coff ?? 0);
    formData.append("s_description", this.fin_payment_trans.value.s_description);
    formData.append("n_total_value", this.fin_payment_trans.value.n_total_value ?? 0);
    formData.append("n_source_debit", this.fin_payment_trans.value.n_source_debit ?? 0);
    formData.append("n_source_credit", this.fin_payment_trans.value.n_source_credit ?? 0);
    formData.append("s_source_debit", this.fin_payment_trans.value.s_source_debit);
    formData.append("s_source_credit", this.fin_payment_trans.value.s_source_credit);

    return formData;
  }

}
