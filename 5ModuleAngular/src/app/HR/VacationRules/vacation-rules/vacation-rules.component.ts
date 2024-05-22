import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { VacationRulesService } from 'src/app/Core/Api/HR/vacation-rules.service';

@Component({
  selector: 'app-vacation-rules',
  templateUrl: './vacation-rules.component.html',
  styleUrls: ['./vacation-rules.component.css']
})
export class VacationRulesComponent implements OnInit {
  py_vacation_Rule!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  ruleNo: number = 0;

  constructor(private _service: VacationRulesService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_vacation_Rule = this._formBuilder.group({
      n_rule_no: [''],
      s_rule_desc: ['', Validators.required],
      s_rule_desc_eng: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      py_vacation_rules_details: this._formBuilder.array([])
    });
  }

  get py_vacation_rules_details() : FormArray {
    return this.py_vacation_Rule.get("py_vacation_rules_details") as FormArray
  }

  pushIn_py_vacation_rules_details(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      n_vacation_type: '',
      s_vacation_type_name: '',
      n_year_balance: '',
    });
  }

  Add_py_vacation_rules_details_Row()
  {
    this.py_vacation_rules_details.push(this.pushIn_py_vacation_rules_details(this.Add_py_vacation_rules_details_Row.length + 1));
  }

  RemoveVacationRuleRow(i:number) {
    this.py_vacation_rules_details.removeAt(i);
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.ruleNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    if(this.ruleNo <= 0)
    {
      this._service.GetNextVacationRule().subscribe((data) => {
        this.py_vacation_Rule.patchValue(data);
        if(data.py_vacation_rules_details.length > 0)
        {
          data.py_vacation_rules_details.forEach(element => {
            this.py_vacation_rules_details.push(this.pushIn_py_vacation_rules_details(this.py_vacation_rules_details.length + 1));
          });
          (this.py_vacation_Rule.get("py_vacation_rules_details") as FormArray)?.patchValue(data.py_vacation_rules_details);
        }
        this.showspinner = false;
      });
    }

    if(this.ruleNo > 0)
    {
      this._service.GetByID(this.ruleNo).subscribe((data) => {
        this.py_vacation_Rule.patchValue(data);

        if(data.py_vacation_rules_details.length > 0)
        {
          data.py_vacation_rules_details.forEach(element => {
            this.py_vacation_rules_details.push(this.pushIn_py_vacation_rules_details(this.py_vacation_rules_details.length + 1));
          });
          (this.py_vacation_Rule.get("py_vacation_rules_details") as FormArray)?.patchValue(data.py_vacation_rules_details);
        }
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  Save()
  {
    this.showspinner = true;
    this.disableButtons();

    var formData: any = new FormData();
    formData.append('n_rule_no', this.py_vacation_Rule.value.n_rule_no ?? 0);
    formData.append('s_rule_desc', this.py_vacation_Rule.value.s_rule_desc ?? '');
    formData.append('s_rule_desc_eng', this.py_vacation_Rule.value.s_rule_desc_eng ?? '');
    formData.append('n_DataAreaID', this.py_vacation_Rule.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_vacation_Rule.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_vacation_Rule.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_vacation_Rule.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_vacation_Rule.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_vacation_Rule.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_vacation_Rule.value.n_current_year ?? 0);

    for(var i = 0; i < this.py_vacation_rules_details.length; i++)
    {
      formData.append(`py_vacation_rules_details[${i}].n_serial`, this.py_vacation_Rule?.value.py_vacation_rules_details[i].n_serial ?? 0);
      formData.append(`py_vacation_rules_details[${i}].n_vacation_type`, this.py_vacation_Rule?.value.py_vacation_rules_details[i].n_vacation_type ?? 0);
      formData.append(`py_vacation_rules_details[${i}].n_year_balance`, this.py_vacation_Rule?.value.py_vacation_rules_details[i].n_year_balance ?? 0);
    }

    if(this.ruleNo !=null && this.ruleNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/vacation-rules-list']);
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
          this._router.navigate(['/hr/vacation-rules-list']);
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
