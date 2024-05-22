import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { SourceLkpComponent } from 'src/app/Controls/source-lkp/source-lkp.component';
import { MultiPaymentTransService } from 'src/app/Core/Api/FIN/multi-payment-trans.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LoadInvoicesComponent } from '../../Invoices/load-invoices/load-invoices.component';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-multi-payment-trans-add',
  templateUrl: './multi-payment-trans-add.component.html',
  styleUrls: ['./multi-payment-trans-add.component.css']
})
export class MultiPaymentTransAddComponent implements OnInit {
  fin_payment_trans!: FormGroup;
  showspinner: boolean = false;
  n_doc_no: number = 0;
  localCurrency: number = 0;
  n_currency_id: number = 0;

  timeout: any;
  curencyList: any;
  salersList: any;
  employeeList: any;
 isEnglish:boolean=false;
  DebitTypes:any=[];
  CardData:any=[];
  CreditTypes:any=[];
  DebitData:any=[];
  CreditData:any=[];
  TransferData:any=[];
  VatCategoryData:any=[];

  searchingDebit:boolean=false;
  searchingCredit:boolean=false;
  searchingSalesman:boolean=false;
  searchingEmployee:boolean=false;

  filteredDebitServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCreditServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredSalesmanServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredEmployeeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  isBank:boolean=false;
  isTransfer:boolean=false;
  isCard:boolean=false;
  isRecieved:boolean=false;
  isSupplier:boolean=false;

  localIndex: any;
 
  invoicesLST: any[] = [];

  constructor(private _service: MultiPaymentTransService,private _notification: NotificationServiceService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder,
    private _helperService: HelperService, private dialog: MatDialog, private _lookUp:GenerealLookup)
  {
    this.fin_payment_trans = this._formBuilder.group({
      n_doc_no: '',
      n_serial: '',
      s_book_doc_no:'',
      d_doc_date:new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      n_currency_id:new FormControl('', Validators.required),
      n_currency_coff:'',
      s_description:'',
      s_description_eng:'',
      n_employee_id:'',
      n_salesman_id:new FormControl('', Validators.required),
      n_total_debit:'',
      n_total_credit:'',
      n_total_tax:'',
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
      b_Multi: '',
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
      n_journal_id: '',
      fin_payment_trans_details: this._formBuilder.array([]),
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
    this.getVatCategories();

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
      this.add_PaymentDetailsRow();
    }

    if(this.n_doc_no > 0)
    {
      this._service.GetByID(this.n_doc_no).subscribe((data) => {
        this.n_currency_id = data.n_currency_id;
        this.fin_payment_trans.patchValue(data);
        this.fin_payment_trans.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));

        data.fin_payment_trans_details.forEach(element => {
          this.fin_payment_trans_details.push(this.new_paymnentDetailsRow(this.fin_payment_trans_details.length + 1));
        });
        (this.fin_payment_trans.get("fin_payment_trans_details") as FormArray)?.patchValue(data.fin_payment_trans_details);

        if(data.fin_payment_trans_invoices !== null)
        {
          data.fin_payment_trans_invoices.forEach(element => {
            this.fin_payment_trans_invoices.push(this.new_InvoiceDetailsRow(this.fin_payment_trans_invoices.length + 1));
          });
          (this.fin_payment_trans.get("fin_payment_trans_invoices") as FormArray)?.patchValue(data.fin_payment_trans_invoices);
  
          for(var i = 0; i < this.fin_payment_trans_invoices.length; i++)
            ((this.fin_payment_trans.get('fin_payment_trans_invoices') as FormArray).at(i) as FormGroup).get('n_paid_valuee')?.patchValue(data.fin_payment_trans_invoices[i].n_paid_value);
        }

          for (let i = 0; i < data.fin_payment_trans_details.length; i++) {
            this.SetTotals(i);
            this.ChangeType(i);
            this.ChangeSource(i);
          }

        this.showspinner = false;
      });
    }
   LangSwitcher.translateData(1);
   LangSwitcher.translatefun();
   this.isEnglish=LangSwitcher.CheckLan();
  }

  get fin_payment_trans_details(): FormArray
  {
    return this.fin_payment_trans.get('fin_payment_trans_details') as FormArray;
  }

  get fin_payment_trans_invoices(): FormArray
  {
    return this.fin_payment_trans.get('fin_payment_trans_invoices') as FormArray;
  }

  new_paymnentDetailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      n_type: '',
      n_doc_no: '',
      n_DataAreaID: '',
      d_UserAddDate: '',
      d_UserUpdateDate: '',
      n_source_id: '',
      s_source_no: '',
      s_source_name: '',
      n_debit: '',
      n_credit: '',
      n_tax_type: '',
      b_has_tax: '',
      n_sales_tax: '',
      n_tax_category: '',
      n_discount: '',
      s_description: '',
      s_description_eng: '',
      s_cheque_no: '',
      d_due_date: '',
      b_Cheque_Status: '',
      s_tax_company_name: '',
      s_tax_company_no: '',
      s_collection_bank: '',
      s_cheque_Benifer: '',
      b_cheque_ReceiveDone: '',
      b_Normal_Cheque: '',
      b_cheque_FirstBenfit: '',
      b_Dash_Cheque: '',
      n_transferType: '',
      s_Country: '',
      sCity: '',
      s_transfer_no: '',
      sAddress: '',
      s_IBAN: '',
      s_SwiftCode: '',
      s_TransferToAccount: '',
      n_bank_commission: '',
      b_load_commision_on_source: '',
      b_detail_journal_on_bank: '',
      b_received: '',
      n_credit_card_type: '',
      s_credit_card_no: '',
      s_credit_card_no_Auth: '',
      d_credit_card_expiry_date: '',
      d_cheque_received_date: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: ''
    });
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

  add_PaymentDetailsRow()
  {
    this.fin_payment_trans_details.push(this.new_paymnentDetailsRow(this.fin_payment_trans_details.length + 1));
  }

  add_InvoiceDetailsRow()
  {
    this.fin_payment_trans_invoices.push(this.new_InvoiceDetailsRow(this.fin_payment_trans_invoices.length + 1));
  }

  remove_PaymentDetailsRow(i: number)
  {
    if(this.fin_payment_trans_details.length == 1)
    {
      if(this.isEnglish) 
      this._notification.ShowMessage('Invoice must contain one trans at lease ',3)
    else
      this._notification.ShowMessage('يجب ان تحتوي الحركة علي فاتورة واحدة علي الاقل', 3);
      return;
    }
    this.fin_payment_trans_details.removeAt(i);
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

  getVatCategories(){
    this._helperService.GetVatCategory().subscribe(res=>{
      this.VatCategoryData=res;
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
      this.filteredCreditServerSide.next(  this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
      this.searchingCredit=false;
    });
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

  Save()
  {
    if(this.ValidateForm() == false)
      return;

      if(this.fin_payment_trans.value.n_total_debit != this.fin_payment_trans.value.n_total_credit )
      {
        if(this.isEnglish)
         this._notification.ShowMessage('the net debit must equal to net credit',3)
        else
        this._notification.ShowMessage('يجب ان يكون اجمالى المدين يساوى اجمالى الدائن',3);
        return;
      } 

    this.showspinner = true;
    var formData = new FormData();
    this.fin_payment_trans.controls['n_doc_no'].enable();
    this.fin_payment_trans.value.d_doc_date=new DatePipe('en-US').transform(this.fin_payment_trans.value.d_doc_date, 'yyyy/MM/dd');
    formData.append("n_doc_no", this.fin_payment_trans.value.n_doc_no ?? 0);
    formData.append("d_doc_date", this.fin_payment_trans.value.d_doc_date);
    formData.append("n_serial", this.fin_payment_trans.value.n_serial ?? 0);
    formData.append("n_salesman_id", this.fin_payment_trans.value.n_salesman_id ?? 0);
    formData.append("n_employee_id", this.fin_payment_trans.value.n_employee_id ?? 0);
    formData.append("s_book_doc_no", this.fin_payment_trans.value.s_book_doc_no ?? '');
    formData.append("n_currency_id", this.fin_payment_trans.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.fin_payment_trans.value.n_currency_coff ?? 0);
    formData.append("s_description", this.fin_payment_trans.value.s_description ?? '');
    formData.append("s_description_eng", this.fin_payment_trans.value.s_description_eng ?? '');
    formData.append("n_DataAreaID", this.fin_payment_trans.value.n_DataAreaID ?? 0);
    formData.append("n_UserAdd", this.fin_payment_trans.value.n_UserAdd ?? 0);
    formData.append("d_UserAddDate", this.fin_payment_trans.value.d_UserAddDate ?? '');
    
    formData.append("b_advanced_payment", this.fin_payment_trans.value.b_advanced_payment ?? false);
    formData.append("b_Multi", this.fin_payment_trans.value.b_Multi ?? false);
    formData.append("d_due_date", this.fin_payment_trans.value.d_due_date ?? '');
    formData.append("s_cheque_no", this.fin_payment_trans.value.s_cheque_no ?? '');
    formData.append("s_collection_bank", this.fin_payment_trans.value.s_collection_bank ?? '');
    formData.append("d_cheque_received_date", this.fin_payment_trans.value.d_cheque_received_date ?? '');
    formData.append("d_UserAb_Cheque_StatusddDate", this.fin_payment_trans.value.b_Cheque_Status ?? false);
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
    debugger
    formData.append("n_journal_id", this.fin_payment_trans.value.n_journal_id ?? 0);

      
    formData.append("fin_payment_trans.fin_payment_trans_details", this.fin_payment_trans.value.fin_payment_trans_details);
    for (var i = 0; i < this.fin_payment_trans.value.fin_payment_trans_details.length;i++)
    {
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('b_has_tax')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.enable();

      formData.append("fin_payment_trans_details[" + i + "].nLineNo", this.fin_payment_trans.value.fin_payment_trans_details[i].nLineNo ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_source_id", this.fin_payment_trans.value.fin_payment_trans_details[i].n_source_id ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].s_source_no", this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_no ?? '');
      formData.append("fin_payment_trans_details[" + i + "].n_debit", this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_credit", this.fin_payment_trans.value.fin_payment_trans_details[i].n_credit ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_tax_type", this.fin_payment_trans.value.fin_payment_trans_details[i].n_tax_type ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].b_has_tax", this.fin_payment_trans.value.fin_payment_trans_details[i].b_has_tax ?? false);
      formData.append("fin_payment_trans_details[" + i + "].n_sales_tax", this.fin_payment_trans.value.fin_payment_trans_details[i].n_sales_tax ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_tax_category", this.fin_payment_trans.value.fin_payment_trans_details[i].n_tax_category ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_discount", this.fin_payment_trans.value.fin_payment_trans_details[i].n_discount ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].s_description", this.fin_payment_trans.value.s_description ?? '');
      formData.append("fin_payment_trans_details[" + i + "].s_description_eng", this.fin_payment_trans.value.s_description_eng ?? '');
      formData.append("fin_payment_trans_details[" + i + "].s_cost_center_id", this.fin_payment_trans.value.fin_payment_trans_details[i].s_cost_center_id ?? '');
      formData.append("fin_payment_trans_details[" + i + "].s_cost_center_id2", this.fin_payment_trans.value.fin_payment_trans_details[i].s_cost_center_id2 ?? '');
      if(this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit=='' || this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit==0)
        ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.disable();
      else
        ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.disable();

      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('b_has_tax')?.disable();
    }

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
          this._router.navigate(['/fin/multiPaymentTransList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.stauts)
    else
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1) {
          this._router.navigate(['/fin/multiPaymentTransList']);
        }
      });
    }
  }

  ValidateForm(): boolean
  {
    var isValid = true;
    for(var i = 0; i < this.fin_payment_trans_details.length; i++)
    {
      if(this.fin_payment_trans.value.fin_payment_trans_details[i].n_type == '' || this.fin_payment_trans.value.fin_payment_trans_details[i].n_type == null || this.fin_payment_trans.value.fin_payment_trans_details[i].n_type == 0)
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please choose source type at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فضلك اختر جهة النوع في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(this.fin_payment_trans.value.fin_payment_trans_details[i].n_source_id == '' || this.fin_payment_trans.value.fin_payment_trans_details[i].n_source_id == null || this.fin_payment_trans.value.fin_payment_trans_details[i].n_source_id == 0)
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please choose source number at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فضلك اختر رقم الجهة في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_no == '' || this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_no == null || this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_no == 0)
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please choose source code at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك اختر كود الجهة في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_name == '' || this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_name == null || this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_name == 0)
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please source name at line ${i+1 }`,3)
      else
        this._notification.ShowMessage(`من فضلك اختر اسم الجهة في السطر رقم ${ i + 1 }`, 3);
        isValid = false;
      }

      if(
          (this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit == ''
            ||
          this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit == null
            ||
          this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit == 0)
        && (this.fin_payment_trans.value.fin_payment_trans_details[i].n_credit == ''
          ||
        this.fin_payment_trans.value.fin_payment_trans_details[i].n_credit == null
          ||
        this.fin_payment_trans.value.fin_payment_trans_details[i].n_credit == 0))
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert debit and credit at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فضلك ادخل المبلغ دائن او مدين في السطر رقم ${ i + 1 }!`, 3);
        isValid = false;
      }
    }

    return isValid;
  }

  ChangeDebitItems(i:number)
    {
      var type=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_type')?.value;
      var sourceType=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;

      this.searchingDebit=false;
      this._helperService.GetDebitItems(type).subscribe(res=>{
        this.DebitData=res;
        this.filteredDebitServerSide.next(  this.DebitData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
      });
      if(sourceType==102)
        this.isBank=true;
      else
        this.isBank=false;

      if(sourceType==103)
        this.isTransfer=true;
      else
        this.isTransfer=false;

      if(sourceType==104)
        this.isCard=true;
      else
        this.isCard=false;
      
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue('');
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue('');
  }

  ChangeCreditItems(i:number)
    {
      var type=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_type')?.value;
      var sourceType=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;

      this.searchingCredit=false;
      this._helperService.GetCreditItems(type, '').subscribe(res=>{
        this.CreditData=res;
        this.filteredCreditServerSide.next(  this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
      });

      if(sourceType==102)
        this.isBank=true;
      else
        this.isBank=false;

      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue('');
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue('');
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
        if(this.isEnglish)
        this._notification.ShowMessage('Please insert supplier code',3)
      else
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
          this.fin_payment_trans_invoices.clear();
          for(var i = 0; i < res.data2.length; i++)
          {
            this.fin_payment_trans_invoices.push(this.new_InvoiceDetailsRow(this.fin_payment_trans_invoices.length + 1));
          }
          this.fin_payment_trans_invoices.patchValue(res.data2);
          this.invoicesLST.push(res.data2);
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

  ChangeSource(i:number){
    debugger
    var type=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_type')?.value;
    var source=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;
    var item=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_no')?.value;
  
    this._helperService.GetSourceName(type,source,item).subscribe(res=>{
      debugger
      if(res==null)
      {
        ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue('');
        ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue('');
      }
      else
      {
        ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue(res.name); 
      }
    });
  
  }

  loadItems(i: number)
  {
    var type = (((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_type')?.value==1)?2:1;
    var source = ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;
    const dialogRef = this.dialog.open(SourceLkpComponent, {
      width: '700px',
      height:'600px',
      data: { type, source }
    });
    dialogRef.afterClosed().subscribe(res => {
     ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue(res.data.n_source_id);
     ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue(res.data.s_source_name);
    });
  }

  LoadCostCenter1(i:number){
  
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
     });
  }

  LoadCostCenter2(i:number){

    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost1(i:number)
    {
      var costNo=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;

      this._helperService.GetCostData(costNo).subscribe(res=>{
        if(res.s_cost_center_name == null || res.s_cost_center_name == '') 
        {
          ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
          ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
        }
        else
          ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.s_cost_center_name); 
      });
  }

  ChangeDetailsCost2(i:number)
    {
      var costNo=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;

      this._helperService.GetCostData(costNo).subscribe(res=>{
        if(res.s_cost_center_name == null || res.s_cost_center_name == '')
        {
          ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
          ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
        }
        else
          ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.s_cost_center_name); 
      });
  }

  ChangeType(i:number){
    var type=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_type')?.value;
    if(type=='2')
    {
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.disable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.patchValue('');
    }
    else if(type=='1')
    {
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.disable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.patchValue('');
    }
  }

  JournalShow(){
    if(this.fin_payment_trans.get('s_source_debit')?.value=='')
    {
      if(this.isEnglish)
      this. _notification.ShowMessage('Choose credit source ',3);
    else 
      this. _notification.ShowMessage('اختر رقم جهة الدائن من فضلك',3);
      return;
    }
    if(this.fin_payment_trans.get('s_source_credit')?.value=='')
    {
      if(this.isEnglish)
      this. _notification.ShowMessage('Choose debit source ',3);
    else 
    
      this. _notification.ShowMessage('اختر رقم جهة المدين من فضلك',3);
      return;
    }
    if(this.fin_payment_trans.get('n_total_value')?.value==0 ||this.fin_payment_trans.get('n_total_value')?.value=='')
    {
      if(this.isEnglish)
      this. _notification.ShowMessage('insert sum value ',3);
    else 
     
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
      edit=true;
      this._helperService.GetJournalID(this.n_doc_no,JournalType).subscribe(res=>{
        JournalID=res;
        this._service.GetSavedJournals(JournalID).subscribe(data=>{
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

    formData.append("fin_payment_trans.fin_payment_trans_details", this.fin_payment_trans.value.fin_payment_trans_details);
    for (var i = 0; i < this.fin_payment_trans.value.fin_payment_trans_details.length;i++)
    {

      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('b_has_tax')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.enable();
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.enable();


      formData.append("fin_payment_trans_details[" + i + "].nLineNo", this.fin_payment_trans.value.fin_payment_trans_details[i].nLineNo ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_source_id", this.fin_payment_trans.value.fin_payment_trans_details[i].n_source_id ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].s_source_no", this.fin_payment_trans.value.fin_payment_trans_details[i].s_source_no);
      formData.append("fin_payment_trans_details[" + i + "].n_debit", this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_credit", this.fin_payment_trans.value.fin_payment_trans_details[i].n_credit ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_tax_type", this.fin_payment_trans.value.fin_payment_trans_details[i].n_tax_type ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].b_has_tax", this.fin_payment_trans.value.fin_payment_trans_details[i].b_has_tax);
      formData.append("fin_payment_trans_details[" + i + "].n_sales_tax", this.fin_payment_trans.value.fin_payment_trans_details[i].n_sales_tax ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_tax_category", this.fin_payment_trans.value.fin_payment_trans_details[i].n_tax_category ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].n_discount", this.fin_payment_trans.value.fin_payment_trans_details[i].n_discount ?? 0);
      formData.append("fin_payment_trans_details[" + i + "].s_description", this.fin_payment_trans.value.fin_payment_trans_details[i].s_description);
      formData.append("fin_payment_trans_details[" + i + "].s_description_eng", this.fin_payment_trans.value.fin_payment_trans_details[i].s_description_eng);
      formData.append("fin_payment_trans_details[" + i + "].s_cost_center_id", this.fin_payment_trans.value.fin_payment_trans_details[i].s_cost_center_id);
      formData.append("fin_payment_trans_details[" + i + "].s_cost_center_id2", this.fin_payment_trans.value.fin_payment_trans_details[i].s_cost_center_id2);

      if(this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit=='' || this.fin_payment_trans.value.fin_payment_trans_details[i].n_debit==0)
        ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.disable();
      else
        ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.disable();

      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('b_has_tax')?.disable();
    }
    return formData;
  }

  LoadSources(i:number){
    var type=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_type')?.value;
    var source=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;
    const dialogRef = this.dialog.open(SourceLkpComponent, {
      width: '700px',
      height:'600px',
      data: { type, source }
    });
  
    dialogRef.afterClosed().subscribe(res => {
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue(res.data.n_source_id);
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue(res.data.s_source_name);
     });
  }

  TotalTaxed(i:number) {
    this.SetTotals(i);
    this.CheckIsTaxed(i);
  }

  SetTotals(i:number){
    var debit=0, credit=0, tax=0;
    for (var i = 0; i < this.fin_payment_trans.value.fin_payment_trans_details.length;i++)
    {
      debit+=Number(((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.value);
      credit+=Number(((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.value);
      tax+=Number(((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.value);
    }
    this.fin_payment_trans.get('n_total_debit')?.patchValue(debit);
    this.fin_payment_trans.get('n_total_credit')?.patchValue(credit);
    this.fin_payment_trans.get('n_total_tax')?.patchValue(tax);
  }

  CheckIsTaxed(i){
    var debit=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_debit')?.value;
    var credit=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_credit')?.value;

    var isTaxed=((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_tax_type')?.value;
    if(isTaxed=='1')
    {
      var value=(debit!='')?debit:credit;
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('b_has_tax')?.patchValue(true);
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue(value*.15);

    }
    else
    {
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('b_has_tax')?.patchValue(false);
      ((this.fin_payment_trans.get("fin_payment_trans_details") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue('');
    }
    this.SetTotals(i);
  }
  
}
