import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllowancesService } from 'src/app/Core/Api/HR/allowances.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-allowances',
  templateUrl: './allowances.component.html',
  styleUrls: ['./allowances.component.css']
})
export class AllowancesComponent implements OnInit {
  py_allowances!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  b_isRatio: boolean = false;
  allowanceId: any;

  AllowanceCatData: any[] = [];

  constructor(private _service: AllowancesService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_allowances = this._formBuilder.group({
      n_allowance_id: [''],
      s_allowance_name: ['', Validators.required],
      s_allowance_name_eng: [''],
      n_allowance_category: [''],
      b_value: [''],
      b_percent: [''],
      n_percent: [''],
      b_Addon: [''],
      b_addtoReward: [''],
      b_addtoVacation: [''],
      b_Vacation_discount_Free: [''],
      n_YearlyIncrease: [''],
      b_add_to_insurance: [''],
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
    this.allowanceId = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._service.GetAllowancesCategory().subscribe((data) => {
      this.AllowanceCatData = data;
    });

    if(this.allowanceId <= 0)
    {
      this._service.GetNextAllowance().subscribe((data) => {
        this.py_allowances.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.allowanceId > 0)
    {
      this._service.GetByID(this.allowanceId).subscribe((data) => {
        this.py_allowances.patchValue(data);
        this.showspinner = false;
      });
    }

    this.py_allowances.get('b_value')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_allowances.get('b_percent')?.setValue(false);
        this.b_isRatio = false;
        this.py_allowances.get('n_percent')?.patchValue('');
      }
    });
    this.py_allowances.get('b_percent')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_allowances.get('b_value')?.setValue(false);
        this.b_isRatio = true;
      }
    });

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    formData.append('n_allowance_id', this.py_allowances.value.n_allowance_id ?? 0);
    formData.append('s_allowance_name', this.py_allowances.value.s_allowance_name ?? '');
    formData.append('s_allowance_name_eng', this.py_allowances.value.s_allowance_name_eng ?? '');
    formData.append('n_allowance_category', this.py_allowances.value.n_allowance_category ?? 0);
    formData.append('b_percent', this.py_allowances.value.b_percent ?? false);
    formData.append('n_percent', this.py_allowances.value.n_percent ?? 0);
    formData.append('b_Addon', this.py_allowances.value.b_Addon ?? false);
    formData.append('b_addtoReward', this.py_allowances.value.b_addtoReward ?? false);
    formData.append('b_addtoVacation', this.py_allowances.value.b_addtoVacation ?? false);
    formData.append('b_Vacation_discount_Free', this.py_allowances.value.b_Vacation_discount_Free ?? false);
    formData.append('n_YearlyIncrease', this.py_allowances.value.n_YearlyIncrease ?? false);
    formData.append('b_add_to_insurance', this.py_allowances.value.b_add_to_insurance ?? false);
    formData.append('n_DataAreaID', this.py_allowances.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_allowances.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_allowances.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_allowances.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_allowances.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_allowances.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_allowances.value.n_current_year ?? 0);

    if(this.allowanceId !=null && this.allowanceId > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/allowanceslist']);
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
          this._router.navigate(['/hr/allowanceslist']);
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
