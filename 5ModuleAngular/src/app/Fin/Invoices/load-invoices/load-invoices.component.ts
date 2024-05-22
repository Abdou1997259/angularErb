import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-load-invoices',
  templateUrl: './load-invoices.component.html',
  styleUrls: ['./load-invoices.component.css']
})
export class LoadInvoicesComponent implements OnInit {
  invoicesForm!: FormGroup;
  currentPage!:number;
  page = 1;
  itemsPerPage = 10;
  totalItems : any;
  n_totalRest: number = 0;
  s_supplier_name!: any;

  selectedInvoices: any[] = [];
 isEnglish:boolean=false
  constructor(
    private _service: HelperService, 
    public dialogRef: MatDialogRef<LoadInvoicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _formBuilder: FormBuilder, 
    private _notification: NotificationServiceService
    )
  {
    this.invoicesForm = this._formBuilder.group({
      n_doc_no: new FormControl(''),
      d_doc_date: new FormControl(''),
      n_total_value: new FormControl(''),
      n_total_rest: new FormControl(''),

      invoicesList: this._formBuilder.array([])
    })
  }

  ngOnInit(): void {
    this.s_supplier_name = this.data.sourceNo + ' # ' + this.data.sourceName;
    this._service.loadInvoices(this.data.sourceNo, 0, '').subscribe(data=>{
      data.forEach(element => {
        this.invoicesList.push(this.new_DetailsRow(this.invoicesList.length + 1));
        this.n_totalRest += Number( element.n_remain_value );
      });
      this.invoicesForm.get('invoicesList')?.patchValue(data);
      this.invoicesForm.get('n_total_rest')?.patchValue(this.n_totalRest);
    });
    this.isEnglish=LangSwitcher.CheckLan();
    LangSwitcher.translatefun();
  
  }

  get invoicesList(): FormArray
  {
    return this.invoicesForm.get('invoicesList') as FormArray;
  }

  new_DetailsRow(line: number): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      n_DataAreaID: '',
      s_invoice_no: '',
      SuppInvoiceNo: '',
      d_invoice_date: '',
      n_invoice_value: '',
      n_ReturnInvoice_value: '',
      n_credit_note: '',
      SaleNetValue: '',
      n_pre_paid_value: '',
      n_AdvancedPayment: '',
      n_requested: '',
      n_paid_valuee: '',
      n_remain_value: '',
      s_notes: ''
    });
  }

  add_DetailsRow()
  {
    this.invoicesList.push(this.new_DetailsRow(this.invoicesList.length + 1));
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  keyupTimer:any;
  DoSearch(){
    var docNo = Number( this.invoicesForm.get('n_doc_no')?.value );
    this.invoicesForm.value.d_doc_date = new DatePipe('en-US').transform(this.invoicesForm.value.d_doc_date, 'yyyy/MM/dd');
    var docDate = this.invoicesForm.value.d_doc_date ?? '';

    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
      this.invoicesList.clear();
      this.n_totalRest = 0;
      this.invoicesForm.get('n_total_value')?.patchValue('');
      this._service.loadInvoices(this.data.sourceNo, docNo, docDate).subscribe(data=>{
        data.forEach(element => {
          this.invoicesList.push(this.new_DetailsRow(this.invoicesList.length + 1));
          this.n_totalRest += Number( element.n_remain_value );
        });
        this.invoicesForm.get('invoicesList')?.patchValue(data);
        this.invoicesForm.get('n_total_rest')?.patchValue(this.n_totalRest);
      });
    }, 1000);
  }

  isPaid(i: number)
  {
    var sum = 0;
    for(var i = 0; i < this.invoicesList.length; i++)
      sum += Number( ((this.invoicesForm.get('invoicesList') as FormArray).at(i) as FormGroup).get('n_paid_valuee')?.value );

    this.invoicesForm.get('n_total_value')?.patchValue(sum);
    this.invoicesForm.get('n_total_rest')?.patchValue( this.n_totalRest - sum);
  }

  getPaidInvoices()
  {
    var value = Number( this.invoicesForm.get('n_total_value')?.value );
    if(value == 0)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Insert the deduction or paymenst value',2)
      this._notification.ShowMessage('ادخل قيمة السداد او الخصم النقدي', 2);
      return;
    }
    else
      this.dialogRef.close({ data: value, data2: this.selectedInvoices });
  }

  insertIntoList(row)
  {
    this.selectedInvoices.push(row.value);
  }
}
