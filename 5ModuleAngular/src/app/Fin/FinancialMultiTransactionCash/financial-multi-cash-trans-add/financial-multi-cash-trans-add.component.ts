import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { FinancialMultiCahsTransService } from 'src/app/Core/Api/FIN/financial-multi-cash-trans.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-financial-multi-cash-trans-add',
  templateUrl: './financial-multi-cash-trans-add.component.html',
  styleUrls: ['./financial-multi-cash-trans-add.component.css']
})
export class FinancialMultiCashTransAddComponent implements OnInit {
  FinancialFormData!: FormGroup;
  showspinner: boolean = false;
  docNo: number = 0;

  GlCashesData: any = [];
  searchingGlCashes: boolean = false;
  filteredGlCashesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  selectedRowsList: any[] = [];

  constructor(private _service: FinancialMultiCahsTransService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private dialog: MatDialog, private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder,
    private _helperService: HelperService)
  {
    this.FinancialFormData = this._formBuilder.group({
      n_Cash_id: new FormControl(''),
      d_doc_date: new FormControl((new Date()).toISOString().substring(0,10)),
      b_ougoind_doc_date: new FormControl(''),
      detailsList: this._formBuilder.array([])
    });
  }

  get detailsList(): FormArray {
    return this.FinancialFormData.get('detailsList') as FormArray;
  }

  newdetailsList(line: number = 0): FormGroup {
    return this._formBuilder.group({
      nLineNo: line,
      b_select: '',
      n_doc_no: '',
      n_serial: '',
      d_doc_date: '',
      s_branch_name: '',
      s_source_no_name: '',
      n_credit: '',
      s_Desc_Master_Arabic: '',
      n_DataAreaID: '',
      n_source_id: '',
      b_Received_done: ''
    });
  }

  ngOnInit(): void {

    this.LoadGlCashesDL('');

  }

  LoadGlCashesDL(value: any)
  {
    this.searchingGlCashes = true;
    this._service.GetGlFinCashes(value).subscribe(res=>{
      this.GlCashesData = res;
      this.filteredGlCashesServerSide.next(this.GlCashesData.filter(x => x.s_cash_name.toLowerCase().indexOf(value) > -1));
      this.searchingGlCashes=false;
    });
  }

  GetData()
  {
    this.detailsList.clear();
    var cahsId = this.FinancialFormData.get('n_Cash_id')?.value;
    if(cahsId == null || cahsId == '' || cahsId == undefined || cahsId <= 0)
    {
      this._notificationService.ShowMessage('من فضلك اختر الخزنة اولآ', 3);
      return;
    }

    this._service.GetAllFinancialCash(cahsId).subscribe((data) => {
      debugger
      for (var i = 0; i < data.length; i++) {
        this.detailsList.push(
          this.newdetailsList(this.detailsList.length + 1)
        );
      }
      this.FinancialFormData.get('detailsList')?.patchValue(data);
    });
  }

  RowSelected(i: any)
  {
    var isRowSelected = ((this.FinancialFormData.get('detailsList') as FormArray).at(i) as FormGroup).get('b_select')?.value;
    if(isRowSelected == true)
    {
      this.selectedRowsList.push( ((this.FinancialFormData.get('detailsList') as FormArray).at(i) as FormGroup).value );
      this.selectedRowsList.push( ((this.FinancialFormData.get('detailsList') as FormArray).at(i) as FormGroup).get('b_Received_done')?.patchValue(true) );
    }
    else
      this.selectedRowsList.splice(i, 1);
  }

  Save()
  {
    if(this.selectedRowsList.length <= 0)
    {
      this._notificationService.ShowMessage('من فضلك اختر استلام التحويلات!', 2);
      return;
    }

    // this.disableButtons();
    var formData = new FormData();
    this.FinancialFormData.value.d_doc_date = new DatePipe('en-US').transform(this.FinancialFormData.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_Cash_id', this.FinancialFormData.value.n_Cash_id ?? 0);
    formData.append('d_doc_date', this.FinancialFormData.value.d_doc_date ?? '');
    formData.append('b_ougoind_doc_date', this.FinancialFormData.value.b_ougoind_doc_date ?? false);

    for(var i = 0; i < this.selectedRowsList.length-1; i++)
    {
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].b_select`, (this.selectedRowsList[i].b_select == true ? 1 : 0 ).toString() ?? 0);
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].n_doc_no`, this.selectedRowsList[i].n_doc_no ?? 0);
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].n_serial`, this.selectedRowsList[i].n_serial ?? 0);
      if(this.FinancialFormData.get('b_ougoind_doc_date')?.value == true)
        formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].d_doc_date`, this.selectedRowsList[i].d_doc_date ?? '');
      else
        formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].d_doc_date`, this.FinancialFormData.value.d_doc_date ?? '');
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].s_branch_name`, this.selectedRowsList[i].s_branch_name ?? '');
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].s_source_no_name`, this.selectedRowsList[i].s_source_no_name ?? '');
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].n_credit`, this.selectedRowsList[i].n_credit ?? 0);
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].s_Desc_Master_Arabic`, this.selectedRowsList[i].s_Desc_Master_Arabic ?? '');
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].n_DataAreaID`, this.selectedRowsList[i].n_DataAreaID ?? 0);
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].n_source_id`, this.selectedRowsList[i].n_source_id ?? 0);
      formData.append(`Financial_Multi_Transaction_OutGingCash_View[${i}].b_Received_done`, 'true');
    }

    this._service.Recieve(formData).subscribe(data=>{
      this.enableButtons();
      this. _notificationService.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this._router.navigate(['/fin/financialmulticahstranslist']);
      }
    });
  }

  OutgoingBChanged()
  {
    var isChecked = this.FinancialFormData.get('b_ougoind_doc_date')?.value;
    if(isChecked == true)
      this.FinancialFormData.get('d_doc_date')?.patchValue('');
    else
      this.FinancialFormData.get('d_doc_date')?.patchValue((new Date()).toISOString().substring(0,10));
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }
}
