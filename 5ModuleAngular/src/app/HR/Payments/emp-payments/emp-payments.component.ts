import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpPaymentsService } from 'src/app/Core/Api/HR/emp-payments.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-emp-payments',
  templateUrl: './emp-payments.component.html',
  styleUrls: ['./emp-payments.component.css']
})
export class EmpPaymentsComponent implements OnInit {
  py_emp_payment!: FormGroup;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  docNo: number = 0;

  constructor(private _service: EmpPaymentsService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_emp_payment = this._formBuilder.group({
      n_doc_no: [''],
      s_pay_name: ['', Validators.required],
      s_pay_name_eng: [''],
      s_notes: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number( this._activatedRoute.snapshot.paramMap.get('id') );

    if(this.docNo <= 0)
    {
      this._service.GetCurrentPayment().subscribe((data) => {
        this.py_emp_payment.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_emp_payment.patchValue(data);
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;
    
    var formData: any = new FormData();
    formData.append('n_doc_no', this.py_emp_payment.value.n_doc_no ?? 0);
    formData.append('s_pay_name', this.py_emp_payment.value.s_pay_name ?? '');
    formData.append('s_pay_name_eng', this.py_emp_payment.value.s_pay_name_eng ?? '');
    formData.append('s_notes', this.py_emp_payment.value.s_notes ?? '');
    formData.append('n_DataAreaID', this.py_emp_payment.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_emp_payment.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_emp_payment.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_emp_payment.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_emp_payment.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_emp_payment.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_emp_payment.value.n_current_year ?? 0);

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/emppaymentlist']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/emppaymentlist']);
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
}
