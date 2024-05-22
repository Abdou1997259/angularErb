import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViolationsService } from 'src/app/Core/Api/HR/violations.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-violations',
  templateUrl: './violations.component.html',
  styleUrls: ['./violations.component.css']
})
export class ViolationsComponent implements OnInit {
  py_violations!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  docNo: number = 0;

  TimesList: any[] = [];
  PenaltiesList: any[] = [];

  constructor(private _service: ViolationsService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_violations = this._formBuilder.group({
      n_doc_no: [''],
      s_violation_name: ['', Validators.required],
      s_violation_name_eng: [''],
      n_pen_effect_days: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      b_month: [''],
      b_mid_year: [''],
      b_year: [''],
      py_violations_details: this._formBuilder.array([])
    });
  }

  get py_violations_details() : FormArray {
    return this.py_violations.get("py_violations_details") as FormArray
  }

  pushIn_py_violations_details(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      n_doc_no: '',
      n_time: this.TimesList[0].code,
      n_penalty_id: this.PenaltiesList[0].n_doc_no,
    });
  }

  Add_py_violations_details_Row()
  {
    this.py_violations_details.push(this.pushIn_py_violations_details(this.Add_py_violations_details_Row.length + 1));
  }

  RemoveViolationDetailsRaw(i:number) {
    this.py_violations_details.removeAt(i);
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._service.GetTimes().subscribe((data) => {
      this.TimesList = data;
    });
    this._service.GetPenalties().subscribe((data) => {
      this.PenaltiesList = data;
    });

    if(this.docNo <= 0)
    {
      this._service.GetNextViolation().subscribe((data) => {
        this.py_violations.patchValue(data);
        for(var i = 0; i < this.TimesList.length; i++)
        {
          this.py_violations_details.push(this.pushIn_py_violations_details(this.py_violations_details.length + 1));
          ((this.py_violations.get('py_violations_details') as FormArray).at(i) as FormGroup).get('n_time')?.patchValue(this.TimesList[i].code);
          ((this.py_violations.get('py_violations_details') as FormArray).at(i) as FormGroup).get('n_penalty_id')?.patchValue(this.PenaltiesList[0].n_doc_no);
        }
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_violations.patchValue(data);

        if(data.py_violations_details.length > 0)
        {
          data.py_violations_details.forEach(element => {
            this.py_violations_details.push(this.pushIn_py_violations_details(this.py_violations_details.length + 1));
          });
          (this.py_violations.get("py_violations_details") as FormArray)?.patchValue(data.py_violations_details);
        }

        if(data.n_pen_effect_days == 1)
          this.py_violations.get('b_month')?.setValue(true);
        if(data.n_pen_effect_days == 2)
          this.py_violations.get('b_mid_year')?.setValue(true);
        if(data.n_pen_effect_days == 3)
          this.py_violations.get('b_year')?.setValue(true);

        this.showspinner = false;
      });
    }

    this.py_violations.get('b_month')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_violations.get('b_mid_year')?.setValue(false);
        this.py_violations.get('b_year')?.setValue(false);
        this.py_violations.get('n_pen_effect_days')?.setValue(1);
      }
    });
    this.py_violations.get('b_mid_year')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_violations.get('b_month')?.setValue(false);
        this.py_violations.get('b_year')?.setValue(false);
        this.py_violations.get('n_pen_effect_days')?.setValue(2);
      }
    });
    this.py_violations.get('b_year')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_violations.get('b_month')?.setValue(false);
        this.py_violations.get('b_mid_year')?.setValue(false);
        this.py_violations.get('n_pen_effect_days')?.setValue(3);
      }
    });

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  Save()
  {
    this.showspinner = true;
    this.disableButtons();

    var formData: any = new FormData();
    formData.append('n_doc_no', this.py_violations.value.n_doc_no ?? 0);
    formData.append('s_violation_name', this.py_violations.value.s_violation_name ?? '');
    formData.append('s_violation_name_eng', this.py_violations.value.s_violation_name_eng ?? '');
    formData.append('n_pen_effect_days', this.py_violations.value.n_pen_effect_days ?? 0);
    formData.append('n_DataAreaID', this.py_violations.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_violations.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_violations.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_violations.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_violations.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_violations.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_violations.value.n_current_year ?? 0);

    for(var i = 0; i < this.py_violations_details.length; i++)
    {
      formData.append(`py_violations_details[${i}].n_serial`, this.py_violations?.value.py_violations_details[i].n_serial ?? 0);
      formData.append(`py_violations_details[${i}].n_time`, this.py_violations?.value.py_violations_details[i].n_time ?? 0);
      formData.append(`py_violations_details[${i}].n_penalty_id`, this.py_violations?.value.py_violations_details[i].n_penalty_id ?? 0);
    }

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/violationslist']);
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
          this._router.navigate(['/hr/violationslist']);
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
