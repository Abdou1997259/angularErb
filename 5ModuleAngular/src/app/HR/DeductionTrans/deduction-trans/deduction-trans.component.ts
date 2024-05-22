import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { EmployeeLkpComponent } from 'src/app/Controls/employee-lkp/employee-lkp.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { DeductionTransService } from 'src/app/Core/Api/HR/deduction-trans.service';
import { EmpLkpService } from 'src/app/Core/Api/LookUps/emp-lkp.service';

@Component({
  selector: 'app-deduction-trans',
  templateUrl: './deduction-trans.component.html',
  styleUrls: ['./deduction-trans.component.css']
})
export class DeductionTransComponent implements OnInit {
  py_deduction_transaction!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  is_RetroactiveCalc: boolean = false;
  docNo: number = 0;

  JobCodeList: any[] = [];
  searchingJobCode:boolean=false;
  filteredJobCodeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  KUPList: any[] = [];
  searchingKUP:boolean=false;
  filteredKUPServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  SourcesList: any[] = [];
  searchingSources:boolean=false;
  filteredSourcesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: DeductionTransService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog,
    private _empLkpService: EmpLkpService)
  {
    this.py_deduction_transaction = this._formBuilder.group({
      n_doc_no: [''],
      d_doc_date: [(new Date()).toISOString().substring(0,10), Validators.required],
      n_year_of_transaction: [''],
      n_month_of_transaction: [''],
      n_source_id: ['', Validators.required],
      b_Retroactive_calc: [''],
      b_periodic_deduction: [''],
      n_calculated_month: [''],
      s_notes: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      _jobCode: [''],
      kUp1: [''],
      py_deduction_transactions_details: this._formBuilder.array([])
    });
  }

  get py_deduction_transactions_details() : FormArray {
    return this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray
  }

  pushIn_py_deduction_transactions_details(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      n_employee_id: '',
      s_employee_name: '',
      n_salary: '',
      n_DayValue: '',
      n_value: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: '',
      s_description: '',
      s_description_eng: ''
    });
  }

  Add_py_deduction_transactions_details_Row()
  {
    this.py_deduction_transactions_details.push(this.pushIn_py_deduction_transactions_details(this.Add_py_deduction_transactions_details_Row.length + 1));
  }

  RemoveDeductionTransDetailsRow(i:number) {
    if(this.py_deduction_transaction.value.py_deduction_transactions_details.length == 1)
      return;
    this.py_deduction_transactions_details.removeAt(i);
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.searchJobCodes('');
    this.searchKUPs('');
    this.searchSources('');

    if(this.docNo <= 0)
    {
      this._service.GetNextDeductionTrans().subscribe((data) => {
        this.py_deduction_transaction.patchValue(data);
        this.py_deduction_transaction.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.Add_py_deduction_transactions_details_Row();
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_deduction_transaction.patchValue(data);
        this.py_deduction_transaction.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        if(data.b_Retroactive_calc == true)
          this.is_RetroactiveCalc = true;

        if(data.py_deduction_transactions_details.length > 0)
        {
          data.py_deduction_transactions_details.forEach(element => {
            this.py_deduction_transactions_details.push(this.pushIn_py_deduction_transactions_details(this.py_deduction_transactions_details.length + 1));
          });
          (this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray)?.patchValue(data.py_deduction_transactions_details);
        }

        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchJobCodes(value :any){
    this.searchingJobCode = true;
    this._service.GetJobCodes(value).subscribe(res=>{
      this.JobCodeList = res;
      this.filteredJobCodeServerSide.next(this.JobCodeList.filter(x => x.s_name.toLowerCase().indexOf(value) > -1));
      this.searchingJobCode = false;
    });
  }

  searchKUPs(value :any){
    this.searchingKUP = true;
    this._service.GetKUPs(value).subscribe(res=>{
      this.KUPList = res;
      this.filteredKUPServerSide.next(this.KUPList.filter(x => x.s_job_name.toLowerCase().indexOf(value) > -1));
      this.searchingKUP = false;
    });
  }

  searchSources(value :any){
    this.searchingSources = true;
    this._service.GetSources(value).subscribe(res=>{
      this.SourcesList = res;
      this.filteredSourcesServerSide.next(this.SourcesList.filter(x => x.s_deduction_name.toLowerCase().indexOf(value) > -1));
      this.searchingSources = false;
    });
  }

  Save()
  {
    if(this.ValidateDetails() == false)
      return;

    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    this.py_deduction_transaction.value.d_doc_date=new DatePipe('en-US').transform(this.py_deduction_transaction.value.d_doc_date, 'yyyy/MM/dd');

    formData.append('n_doc_no', this.py_deduction_transaction.value.n_doc_no ?? 0);
    formData.append('d_doc_date', this.py_deduction_transaction.value.d_doc_date ?? '');
    formData.append('n_year_of_transaction', this.py_deduction_transaction.value.n_year_of_transaction ?? 0);
    formData.append('n_month_of_transaction', this.py_deduction_transaction.value.n_month_of_transaction ?? 0);
    formData.append('n_source_id', this.py_deduction_transaction.value.n_source_id ?? 0);
    formData.append('b_Retroactive_calc', this.py_deduction_transaction.value.b_Retroactive_calc ?? false);
    formData.append('b_periodic_deduction', this.py_deduction_transaction.value.b_periodic_deduction ?? false);
    formData.append('n_calculated_month', this.py_deduction_transaction.value.n_calculated_month ?? 0);
    formData.append('s_notes', this.py_deduction_transaction.value.s_notes ?? '');
    formData.append('n_DataAreaID', this.py_deduction_transaction.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_deduction_transaction.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_deduction_transaction.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_deduction_transaction.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_deduction_transaction.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_deduction_transaction.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_deduction_transaction.value.n_current_year ?? 0);

    for(var i = 0; i < this.py_deduction_transactions_details.length; i++)
    {
      formData.append(`py_deduction_transactions_details[${i}].n_serial`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].n_serial ?? 0);
      formData.append(`py_deduction_transactions_details[${i}].n_employee_id`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].n_employee_id ?? 0);
      formData.append(`py_deduction_transactions_details[${i}].n_salary`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].n_salary ?? 0);
      formData.append(`py_deduction_transactions_details[${i}].n_DayValue`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].n_DayValue ?? 0);
      formData.append(`py_deduction_transactions_details[${i}].n_value`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].n_value ?? 0);
      formData.append(`py_deduction_transactions_details[${i}].s_cost_center_id`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].s_cost_center_id ?? '');
      formData.append(`py_deduction_transactions_details[${i}].s_cost_center_id2`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].s_cost_center_id2 ?? '');
      formData.append(`py_deduction_transactions_details[${i}].s_description`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].s_description ?? '');
      formData.append(`py_deduction_transactions_details[${i}].s_description_eng`, this.py_deduction_transaction?.value.py_deduction_transactions_details[i].s_description_eng ?? '');
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
          this._router.navigate(['/hr/deduction-trans-list']);
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
          this._router.navigate(['/hr/deduction-trans-list']);
        }
      });
    }
  }

  ValidateDetails(): boolean
  {
    var isValid = true;
    for(var i = 0; i < this.py_deduction_transaction.value.py_deduction_transactions_details.length; i++)
    {
      if(this.py_deduction_transaction.value.py_deduction_transactions_details[i].n_employee_id == '' || this.py_deduction_transaction.value.py_deduction_transactions_details[i].n_employee_id == null || this.py_deduction_transaction.value.py_deduction_transactions_details[i].n_employee_id == 0)
      {
        this._notificationService.ShowMessage(`من فضلك اختر الموظف في السطر رقم ${i + 1}`, 3);
        isValid = false;
      }

      if(this.py_deduction_transaction.value.py_deduction_transactions_details[i].n_value == '' || this.py_deduction_transaction.value.py_deduction_transactions_details[i].n_value == null || this.py_deduction_transaction.value.py_deduction_transactions_details[i].n_value == 0)
      {
        this._notificationService.ShowMessage(`من فضلك ادخل القيمة في السطر رقم ${i + 1}`, 3);
        isValid = false;
      }
    }
    return isValid;
  }

  LoadEmployee(i:number){
    const dialogRef = this.dialog.open(EmployeeLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('n_employee_id')?.patchValue(res.data.n_employee_id);
      ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue(res.data.s_employee_name);
     });
  }

  ChangeEmploye(i:number){
    var empId = ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('n_employee_id')?.value;
    ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue('');
    this._empLkpService.GetEmployeName(empId).subscribe((res) => {
      if(res==null)
      {
        ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('n_employee_id')?.patchValue('');
        ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue('');
      }
      else
      {
        ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_employee_name')?.patchValue(res.s_employee_name);
      }
    });
  }

  LoadCostCenter1(i:number){

    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost1(i:number)
    {
      var costNo=((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;

      this._service.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
          ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
        }
        else
          ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.name);
      });
  }

  LoadCostCenter2(i:number){

    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
      ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost2(i:number)
    {
      var costNo=((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;

      this._service.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
          ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
        }
        else
          ((this.py_deduction_transaction.get("py_deduction_transactions_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.name);
      });
  }

  RetroactiveCalcChanged()
  {
    var isRetroactiveCalc = this.py_deduction_transaction.get('b_Retroactive_calc')?.value;
    if(isRetroactiveCalc == true)
      this.is_RetroactiveCalc = true;
    else
      this.is_RetroactiveCalc = false;
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
