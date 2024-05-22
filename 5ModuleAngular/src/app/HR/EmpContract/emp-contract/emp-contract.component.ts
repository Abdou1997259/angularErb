import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { AllowancesLkpComponent } from 'src/app/Controls/allowances-lkp/allowances-lkp.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { EmpContractService } from 'src/app/Core/Api/HR/emp-contract.service';
import { AllowancesLkpService } from 'src/app/Core/Api/LookUps/allowances-lkp.service';

@Component({
  selector: 'app-emp-contract',
  templateUrl: './emp-contract.component.html',
  styleUrls: ['./emp-contract.component.css']
})
export class EmpContractComponent implements OnInit {
  py_employees_Contract!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  b_isManualCalc: boolean = false;
  b_noEnd: boolean = false;
  docNo: number = 0;

  ContractTypes: any[] = [];
  PaymentsTypes: any[] = [];

  EmpList: any[] = [];
  searchingEmp:boolean=false;
  filteredEmpServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  CalcTypesList: any[] = [];
  searchingCalcType:boolean=false;
  filteredCalcTypeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  VacationRulesList: any[] = [];
  searchingVacationRule:boolean=false;
  filteredVacationRuleServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: EmpContractService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog,
    private _allowanceService: AllowancesLkpService)
  {
    this.py_employees_Contract = this._formBuilder.group({
      n_doc_no: [''],
      n_Contract_Id: [],
      n_employee_id: ['', Validators.required],
      n_contract_type: [1],
      b_manual_calc: [''],
      n_calc_type: [''],
      n_vacation_rule_no: ['', Validators.required],
      b_have_insurance: [''],
      d_register_date: [''],
      d_hire_date: [(new Date()).toISOString().substring(0,10), Validators.required],
      d_start_contract: [(new Date()).toISOString().substring(0,10), Validators.required],
      d_end_contract: [''],
      n_contract_period: [''],
      b_no_end: [''],
      n_employee_basic_salary: ['', Validators.required],
      n_employee_full_salary: [''],
      n_days_with_pay: ['', Validators.required],
      n_Escorts_no: [''],
      d_insurance_start_date: [''],
      s_notes: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      py_employees_Contract_Details: this._formBuilder.array([])
    });
  }

  get py_employees_Contract_Details() : FormArray {
    return this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray
  }

  pushIn_py_employees_Contract_Details(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      n_Contract_Id: '',
      n_allowance_id: '',
      s_allowance_name: '',
      n_monthly_value: '',
      n_Payment_method: '',
      d_start_calculation: '',
      d_last_payment: ''
    });
  }

  Add_py_employees_Contract_Details_Row()
  {
    this.py_employees_Contract_Details.push(this.pushIn_py_employees_Contract_Details(this.Add_py_employees_Contract_Details_Row.length + 1));
  }

  RemoveEmpContractDetailsRow(i:number) {
    if(this.py_employees_Contract.value.py_employees_Contract_Details.length == 1)
      return;
    this.py_employees_Contract_Details.removeAt(i);
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._service.GetContractTypes().subscribe((data) => {
      this.ContractTypes = data;
    });
    this._service.GetPaymentTypes().subscribe((data) => {
      this.PaymentsTypes = data;
    });

    this.searchEmployee('');
    this.searchCalcTypes('');
    this.searchVacationRule('');

    if(this.docNo <= 0)
    {
      this._service.GetNextEmpContract().subscribe((data) => {
        this.py_employees_Contract.patchValue(data);
        this.py_employees_Contract.get("d_hire_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.py_employees_Contract.get("d_start_contract")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.Add_py_employees_Contract_Details_Row();
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_employees_Contract.patchValue(data);
        this.py_employees_Contract.get("d_register_date")?.patchValue(new Date(Number(data.d_register_date.substring(0,4)), Number(data.d_register_date.substring(5,7))-1, Number(data.d_register_date.substring(8,10))));
        this.py_employees_Contract.get("d_hire_date")?.patchValue(new Date(Number(data.d_hire_date.substring(0,4)), Number(data.d_hire_date.substring(5,7))-1, Number(data.d_hire_date.substring(8,10))));
        this.py_employees_Contract.get("d_start_contract")?.patchValue(new Date(Number(data.d_start_contract.substring(0,4)), Number(data.d_start_contract.substring(5,7))-1, Number(data.d_start_contract.substring(8,10))));
        this.py_employees_Contract.get("d_end_contract")?.patchValue(new Date(Number(data.d_end_contract.substring(0,4)), Number(data.d_end_contract.substring(5,7))-1, Number(data.d_end_contract.substring(8,10))));
        this.py_employees_Contract.get("d_insurance_start_date")?.patchValue(new Date(Number(data.d_insurance_start_date.substring(0,4)), Number(data.d_insurance_start_date.substring(5,7))-1, Number(data.d_insurance_start_date.substring(8,10))));

        if(data.b_manual_calc == true)
          this.b_isManualCalc = true;
        if(data.b_no_end == true)
          this.b_noEnd = true;

        if(data.py_employees_Contract_Details.length > 0)
        {
          data.py_employees_Contract_Details.forEach(element => {
            this.py_employees_Contract_Details.push(this.pushIn_py_employees_Contract_Details(this.py_employees_Contract_Details.length + 1));
          });
          (this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray)?.patchValue(data.py_employees_Contract_Details);

          for(var i = 0; i < this.py_employees_Contract.value.py_employees_Contract_Details.length; i++)
          {
            ((this.py_employees_Contract.get('py_employees_Contract_Details') as FormArray).at(i) as FormGroup).get('d_start_calculation')?.patchValue(new Date(Number(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_start_calculation.substring(0,4)), Number(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_start_calculation.substring(5,7))-1, Number(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_start_calculation.substring(8,10))));
            ((this.py_employees_Contract.get('py_employees_Contract_Details') as FormArray).at(i) as FormGroup).get('d_last_payment')?.patchValue(new Date(Number(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_last_payment.substring(0,4)), Number(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_last_payment.substring(5,7))-1, Number(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_last_payment.substring(8,10))));
          }
        }

        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchEmployee(value :any){
    this.searchingEmp = true;
    this._service.GetEmployees(value).subscribe(res=>{
      this.EmpList = res;
      this.filteredEmpServerSide.next(this.EmpList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmp = false;
    });
  }

  searchCalcTypes(value :any){
    this.searchingCalcType = true;
    this._service.GetSalaryItemCalcTypes(value).subscribe(res=>{
      this.CalcTypesList = res;
      this.filteredCalcTypeServerSide.next(this.CalcTypesList.filter(x => x.s_name.toLowerCase().indexOf(value) > -1));
      this.searchingCalcType = false;
    });
  }

  searchVacationRule(value :any){
    this.searchingVacationRule = true;
    this._service.GetVacationRules(value).subscribe(res=>{
      this.VacationRulesList = res;
      this.filteredVacationRuleServerSide.next(this.VacationRulesList.filter(x => x.s_rule_desc.toLowerCase().indexOf(value) > -1));
      this.searchingVacationRule = false;
    });
  }

  Save()
  {
    if(this.ValidateDetails() == false)
      return;

    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    this.py_employees_Contract.value.d_register_date=new DatePipe('en-US').transform(this.py_employees_Contract.value.d_register_date, 'yyyy/MM/dd');
    this.py_employees_Contract.value.d_hire_date=new DatePipe('en-US').transform(this.py_employees_Contract.value.d_hire_date, 'yyyy/MM/dd');
    this.py_employees_Contract.value.d_start_contract=new DatePipe('en-US').transform(this.py_employees_Contract.value.d_start_contract, 'yyyy/MM/dd');
    this.py_employees_Contract.value.d_end_contract=new DatePipe('en-US').transform(this.py_employees_Contract.value.d_end_contract, 'yyyy/MM/dd');
    this.py_employees_Contract.value.d_insurance_start_date=new DatePipe('en-US').transform(this.py_employees_Contract.value.d_insurance_start_date, 'yyyy/MM/dd');

    formData.append('n_doc_no', this.py_employees_Contract.value.n_doc_no ?? 0);
    formData.append('n_Contract_Id', this.py_employees_Contract.value.n_Contract_Id ?? 0);
    formData.append('n_employee_id', this.py_employees_Contract.value.n_employee_id ?? 0);
    formData.append('n_contract_type', this.py_employees_Contract.value.n_contract_type ?? 0);
    formData.append('b_manual_calc', this.py_employees_Contract.value.b_manual_calc ?? false);
    formData.append('n_calc_type', this.py_employees_Contract.value.n_calc_type ?? 0);
    formData.append('n_vacation_rule_no', this.py_employees_Contract.value.n_vacation_rule_no ?? 0);
    formData.append('b_have_insurance', this.py_employees_Contract.value.b_have_insurance ?? false);
    formData.append('d_register_date', this.py_employees_Contract.value.d_register_date ?? '');
    formData.append('d_hire_date', this.py_employees_Contract.value.d_hire_date ?? '');
    formData.append('d_start_contract', this.py_employees_Contract.value.d_start_contract ?? '');
    formData.append('d_end_contract', this.py_employees_Contract.value.d_end_contract ?? '');
    formData.append('n_contract_period', this.py_employees_Contract.value.n_contract_period ?? 0);
    formData.append('b_no_end', this.py_employees_Contract.value.b_no_end ?? false);
    formData.append('n_employee_basic_salary', this.py_employees_Contract.value.n_employee_basic_salary ?? 0);
    formData.append('n_employee_full_salary', this.py_employees_Contract.value.n_employee_full_salary ?? 0);
    formData.append('n_days_with_pay', this.py_employees_Contract.value.n_days_with_pay ?? 0);
    formData.append('n_Escorts_no', this.py_employees_Contract.value.n_Escorts_no ?? 0);
    formData.append('d_insurance_start_date', this.py_employees_Contract.value.d_insurance_start_date ?? '');
    formData.append('s_notes', this.py_employees_Contract.value.s_notes ?? '');
    formData.append('n_DataAreaID', this.py_employees_Contract.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_employees_Contract.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_employees_Contract.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_employees_Contract.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_employees_Contract.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_employees_Contract.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_employees_Contract.value.n_current_year ?? 0);

    for(var i = 0; i < this.py_employees_Contract_Details.length; i++)
    {
      this.py_employees_Contract.value.py_employees_Contract_Details[i].d_start_calculation=new DatePipe('en-US').transform(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_start_calculation, 'yyyy/MM/dd');
      this.py_employees_Contract.value.py_employees_Contract_Details[i].d_last_payment=new DatePipe('en-US').transform(this.py_employees_Contract.value.py_employees_Contract_Details[i].d_last_payment, 'yyyy/MM/dd');
      formData.append(`py_employees_Contract_Details[${i}].n_serial`, this.py_employees_Contract?.value.py_employees_Contract_Details[i].n_serial ?? 0);
      formData.append(`py_employees_Contract_Details[${i}].n_Contract_Id`, this.py_employees_Contract?.value.n_Contract_Id ?? 0);
      formData.append(`py_employees_Contract_Details[${i}].n_allowance_id`, this.py_employees_Contract?.value.py_employees_Contract_Details[i].n_allowance_id ?? 0);
      formData.append(`py_employees_Contract_Details[${i}].n_monthly_value`, this.py_employees_Contract?.value.py_employees_Contract_Details[i].n_monthly_value ?? 0);
      formData.append(`py_employees_Contract_Details[${i}].n_Payment_method`, this.py_employees_Contract?.value.py_employees_Contract_Details[i].n_Payment_method ?? 0);
      formData.append(`py_employees_Contract_Details[${i}].d_start_calculation`, this.py_employees_Contract?.value.py_employees_Contract_Details[i].d_start_calculation ?? '');
      formData.append(`py_employees_Contract_Details[${i}].d_last_payment`, this.py_employees_Contract?.value.py_employees_Contract_Details[i].d_last_payment ?? '');
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
          this._router.navigate(['/hr/emp-contract-list']);
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
          this._router.navigate(['/hr/emp-contract-list']);
        }
      });
    }
  }

  ValidateDetails(): boolean
  {
    var isValid = true;
    for(var i = 0; i < this.py_employees_Contract.value.py_employees_Contract_Details.length; i++)
    {
      if(this.py_employees_Contract.value.py_employees_Contract_Details[i].n_monthly_value == '' || this.py_employees_Contract.value.py_employees_Contract_Details[i].n_monthly_value == null)
      {
        this._notificationService.ShowMessage(`من فضلك ادخل القيمة الشهرية في السطر رقم ${i + 1}`, 3);
        isValid = false;
      }
    }
    return isValid;
  }

  LoadAllowances(i:number){
    const dialogRef = this.dialog.open(AllowancesLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray).at(i) as FormGroup).get('n_allowance_id')?.patchValue(res.data.n_allowance_id);
      ((this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray).at(i) as FormGroup).get('s_allowance_name')?.patchValue(res.data.s_allowance_name);
     });
  }

  ChangeAllowance(i:number){
    var allowanceId = ((this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray).at(i) as FormGroup).get('n_allowance_id')?.value;
    this._allowanceService.GetAllowanceName(allowanceId).subscribe((res) => {
      if(res==null)
      {
        ((this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray).at(i) as FormGroup).get('n_allowance_id')?.patchValue('');
        ((this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray).at(i) as FormGroup).get('s_allowance_name')?.patchValue('');
      }
      else
      {
        ((this.py_employees_Contract.get("py_employees_Contract_Details") as FormArray).at(i) as FormGroup).get('s_allowance_name')?.patchValue(res.s_allowance_name);
      }
    });
  }

  ManualCalcChanges()
  {
    var b_manual_calc = this.py_employees_Contract.get('b_manual_calc')?.value;
    if(b_manual_calc == true)
      this.b_isManualCalc = true;
    else
      this.b_isManualCalc = false;
  }

  NoEndChanged()
  {
    var b_no_end = this.py_employees_Contract.get('b_no_end')?.value;
    if(b_no_end == true)
      this.b_noEnd = true;
    else
      this.b_noEnd = false;
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
