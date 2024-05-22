import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CashesComponent } from 'src/app/Controls/CashesTypes/cashes/cashes.component';
import { SalersComponent } from 'src/app/Controls/SalersShift/salers/salers.component';
import { ArShiftsService } from 'src/app/Core/Api/AR/ar-shift.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-ar-shift-add',
  templateUrl: './ar-shift-add.component.html',
  styleUrls: ['./ar-shift-add.component.css']
})
export class ArShiftAddComponent implements OnInit {
  Pos_shifts!: FormGroup;
  showspinner: boolean = false;
  docNo: number = 0;

  shiftTypesList: any;
  isEnglish: boolean = false;

  constructor(private _service: ArShiftsService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog)
  {
    this.Pos_shifts = this._formBuilder.group({
      n_doc_no: [''],
      d_doc_date: [new Date().toISOString().substring(0,10), Validators.required],
      n_DataAreaID: [''],
      n_UserAdd: [''],
      d_UserAddDate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      n_shift_id: ['', Validators.required],
      n_saler_id: [''],
      b_is_closed: [''],
      Pos_shifts_Details: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._service.GetShiftTypesDP().subscribe((data) => {
      this.shiftTypesList = data;
    });

    if(this.docNo <= 0)
    {
      this._service.GetNextShiftDefaultData().subscribe((data) => {
        this.Pos_shifts.patchValue(data);
        this.Pos_shifts.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.AddShiftDetailsRow();
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.Pos_shifts.patchValue(data);
        this.Pos_shifts.get('d_doc_date')?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));

        data.pos_shifts_Details.forEach(element => {
          this.Pos_shifts_Details.push(this.NewShiftDetailsRow(this.Pos_shifts_Details.length + 1));
        });
        (this.Pos_shifts.get('Pos_shifts_Details') as FormArray)?.patchValue(data.pos_shifts_Details);
        this.showspinner = false;
      });
    }
  }

  get Pos_shifts_Details() : FormArray {
    return this.Pos_shifts.get("Pos_shifts_Details") as FormArray
  }

  NewShiftDetailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      n_saler_id: [''],
      s_employee_name: [''],
      n_cash_id: [''],
      s_cash_name: [''],
      n_open_balance: [''],
      n_FoundCash: [''],
      n_found_credit_value: [''],
      b_is_closed: [''],
      n_sales_count: [''],
      n_Returnsales_count: [''],
      n_multi_doc_no: ['']
    });
  }

  AddShiftDetailsRow()
  {
    this.Pos_shifts_Details.push(this.NewShiftDetailsRow(this.Pos_shifts_Details.length + 1));
  }

  RemoveShiftDetailsRow(i: number) {
    this.Pos_shifts_Details.removeAt(i);
  }

  Save()
  {
    if(this.Pos_shifts.value.Pos_shifts_Details.length <= 0)
    {
      this._notification.ShowMessage('لا يمكن الحفظ بدون الوردية', 3);
      return;
    }

    for(var i = 0; i < this.Pos_shifts.value.Pos_shifts_Details.length; i++)
    {
      if(this.Pos_shifts.value.Pos_shifts_Details[i].n_saler_id == null || this.Pos_shifts.value.Pos_shifts_Details[i].n_saler_id == '' || this.Pos_shifts.value.Pos_shifts_Details[i].n_saler_id == undefined || this.Pos_shifts.value.Pos_shifts_Details[i].n_saler_id == 0)
      {
        this._notification.ShowMessage('لا يمكن الحفظ بدون الوردية', 3);
        return;
      }
    }

    this.disableButtons();
    var formData = new FormData();
    this.Pos_shifts.value.d_doc_date=new DatePipe('en-US').transform(this.Pos_shifts.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.Pos_shifts.value.n_doc_no ?? 0);
    formData.append('d_doc_date', this.Pos_shifts.value.d_doc_date ?? '');
    formData.append('n_DataAreaID', this.Pos_shifts.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.Pos_shifts.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.Pos_shifts.value.d_UserAddDate ?? '');
    formData.append('n_current_branch', this.Pos_shifts.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.Pos_shifts.value.n_current_company ?? 0);
    formData.append('n_current_year', this.Pos_shifts.value.n_current_year ?? 0);
    formData.append('n_shift_id', this.Pos_shifts.value.n_shift_id ?? 0);
    formData.append('n_saler_id', this.Pos_shifts.value.n_saler_id ?? 0);
    debugger
    formData.append('b_is_closed', this.Pos_shifts.value.b_is_closed ?? false);

    for (var i = 0; i < this.Pos_shifts.value.Pos_shifts_Details.length; i++)
    {
      formData.append("Pos_shifts_Details[" + i + "].n_serial", this.Pos_shifts.value.Pos_shifts_Details[i].n_serial ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].n_saler_id", this.Pos_shifts.value.Pos_shifts_Details[i].n_saler_id ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].n_cash_id", this.Pos_shifts.value.Pos_shifts_Details[i].n_cash_id ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].n_open_balance", this.Pos_shifts.value.Pos_shifts_Details[i].n_open_balance ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].n_FoundCash", this.Pos_shifts.value.Pos_shifts_Details[i].n_FoundCash ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].n_found_credit_value", this.Pos_shifts.value.Pos_shifts_Details[i].n_found_credit_value ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].b_is_closed", this.Pos_shifts.value.Pos_shifts_Details[i].b_is_closed ?? false);
      formData.append("Pos_shifts_Details[" + i + "].n_sales_count", this.Pos_shifts.value.Pos_shifts_Details[i].n_sales_count ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].n_Returnsales_count", this.Pos_shifts.value.Pos_shifts_Details[i].n_Returnsales_count ?? 0);
      formData.append("Pos_shifts_Details[" + i + "].n_multi_doc_no", this.Pos_shifts.value.Pos_shifts_Details[i].n_multi_doc_no ?? 0);
    }

    if(this.docNo !=null && this.docNo > 0 )
    {
      this._service.Edit(formData).subscribe(data => {
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
           this. _notification.ShowMessage(data.Emsg,data.status);
        else
          this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/shiftslst']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
        debugger
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
         this. _notification.ShowMessage(data.Emsg,data.status);
      else
         this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
          this._router.navigate(['/ar/shiftslst']);
        }
      });
    }
  }

  LoadSalers(i: number)
  {
    const dialogRef = this.dialog.open(SalersComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      this._service.IsSalerHasOpenShift(res.data.n_saler_id).subscribe((data) => {
        if(data == false)
        {
          this._notification.ShowMessage('هذا البائع لديه ورديه مفتوحه', 3);
          ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_saler_id')?.patchValue('');
          ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue('');
        }
        else
        {
          ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_saler_id')?.patchValue(res.data.n_saler_id);
          ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue(res.data.s_employee_name);
        }
      });
    });
  }

  ChangeSaler(i: number)
  {
    var salerId = ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_saler_id')?.value;
    this._service.IsSalerHasOpenShift(salerId).subscribe((data) => {
      if(data == false)
      {
        this._notification.ShowMessage('هذا البائع لديه ورديه مفتوحه', 3);
        ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_saler_id')?.patchValue('');
        ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue('');
      }
      else
      {
        this._service.GetSalerName(salerId).subscribe((res) => {
          if(res==null)
          {
            ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_saler_id')?.patchValue('');
            ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue('');
          }
          else
          {
            ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue(res.salerName);
          }
        });
      }
    });
  }

  LoadCashes(i: number)
  {
    const dialogRef = this.dialog.open(CashesComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_cash_id')?.patchValue(res.data.n_cash_id);
      ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_cash_name')?.patchValue(res.data.s_cash_name);
     });
  }

  ChangeCashe(i: number)
  {
    var cashId = ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_cash_id')?.value;
    this._service.GetCashName(cashId).subscribe((res) => {
      if(res==null)
      {
        ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('n_cash_id')?.patchValue('');
        ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_cash_name')?.patchValue('');
      }
      else
      {
        ((this.Pos_shifts.get("Pos_shifts_Details") as FormArray).at(i) as FormGroup).get('s_cash_name')?.patchValue(res.cashName);
      }
    });
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
