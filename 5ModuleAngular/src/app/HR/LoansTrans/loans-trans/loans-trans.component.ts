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
import { LoansTransService } from 'src/app/Core/Api/HR/loans-trans.service';

@Component({
  selector: 'app-loans-trans',
  templateUrl: './loans-trans.component.html',
  styleUrls: ['./loans-trans.component.css']
})
export class LoansTransComponent implements OnInit {
  Py_loans!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  isDebitLoan: boolean = false;
  loanNo: number = 0;

  TransTypes: any[] = [];
  SettelementTypes: any[] = [];

  EmpList: any[] = [];
  searchingEmp:boolean=false;
  filteredEmpServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  AccountsList: any[] = [];
  searchingAccounts:boolean=false;
  filteredAccountsServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: LoansTransService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog)
  {
    this.Py_loans = this._formBuilder.group({
      n_loan_no: [''],
      d_loan_date: [(new Date()).toISOString().substring(0,10), Validators.required],
      n_Trans_Type: [''],
      n_requestNo: [''],
      b_OldYear: [''],
      n_employee_id: ['', Validators.required],
      n_settlement_Type: [''],
      n_loan_value: ['', Validators.required],
      n_SubtractValue: [''],
      n_monthlyValue: ['', Validators.required],
      s_tafkita: [''],
      s_account_no: [''],
      n_count_of_installments: [''],
      d_start_of_deduction: [''],
      d_end_of_deduction: [''],
      s_Description: [''],
      s_Description_eng: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      Py_loans_details: this._formBuilder.array([])
    });
  }

  get Py_loans_details() : FormArray {
    return this.Py_loans.get("Py_loans_details") as FormArray
  }

  pushIn_Py_loans_details(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      d_Due_Date: '',
      n_Due_Value: '',
      b_deduct: '',
      d_deduct_date: '',
      b_postponted: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: ''
    });
  }

  Add_Py_loans_details_Row()
  {
    this.Py_loans_details.push(this.pushIn_Py_loans_details(this.Add_Py_loans_details_Row.length + 1));
  }

  RemoveLoanTransDetailsRow(i:number) {
    if(this.Py_loans.value.Py_loans_details.length == 1)
      return;
    this.Py_loans_details.removeAt(i);
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.loanNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._service.GetTransTypes().subscribe((data) => {
      this.TransTypes = data;
    });
    this._service.GetSettlementTypes().subscribe((data) => {
      this.SettelementTypes = data;
    });

    this.searchEmp('');
    this.searchAccounts('');

    if(this.loanNo <= 0)
    {
      this._service.GetNextLoansTrans().subscribe((data) => {
        this.Py_loans.patchValue(data);
        this.Py_loans.get("d_loan_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.Add_Py_loans_details_Row();
    }

    if(this.loanNo > 0)
    {
      this._service.GetByID(this.loanNo).subscribe((data) => {
        this.Py_loans.patchValue(data);
        this.Py_loans.get("d_loan_date")?.patchValue(new Date(Number(data.d_loan_date.substring(0,4)), Number(data.d_loan_date.substring(5,7))-1, Number(data.d_loan_date.substring(8,10))));
        this.Py_loans.get("d_start_of_deduction")?.patchValue(new Date(Number(data.d_start_of_deduction.substring(0,4)), Number(data.d_start_of_deduction.substring(5,7))-1, Number(data.d_start_of_deduction.substring(8,10))));
        this.Py_loans.get("d_end_of_deduction")?.patchValue(new Date(Number(data.d_end_of_deduction.substring(0,4)), Number(data.d_end_of_deduction.substring(5,7))-1, Number(data.d_end_of_deduction.substring(8,10))));

        if(data.n_Trans_Type == 2)
          this.isDebitLoan = true;

        if(data.py_loans_details.length > 0)
        {
          data.py_loans_details.forEach(element => {
            this.Py_loans_details.push(this.pushIn_Py_loans_details(this.Py_loans_details.length + 1));
          });
          (this.Py_loans.get("Py_loans_details") as FormArray)?.patchValue(data.py_loans_details);

          for(var i = 0; i < data.py_loans_details.length; i++)
          {
            ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('d_Due_Date')?.patchValue(new Date(Number(this.Py_loans.value.Py_loans_details[i].d_Due_Date.substring(0,4)), Number(this.Py_loans.value.Py_loans_details[i].d_Due_Date.substring(5,7))-1, Number(this.Py_loans.value.Py_loans_details[i].d_Due_Date.substring(8,10))));
            ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('d_deduct_date')?.patchValue(new Date(Number(this.Py_loans.value.Py_loans_details[i].d_deduct_date.substring(0,4)), Number(this.Py_loans.value.Py_loans_details[i].d_deduct_date.substring(5,7))-1, Number(this.Py_loans.value.Py_loans_details[i].d_deduct_date.substring(8,10))));
          }
        }

        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchEmp(value :any){
    this.searchingEmp = true;
    this._service.GetEmployee(value).subscribe(res=>{
      this.EmpList = res;
      this.filteredEmpServerSide.next(this.EmpList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmp = false;
    });
  }

  searchAccounts(value :any){
    this.searchingAccounts = true;
    this._service.GetAccountsTree(value).subscribe(res=>{
      this.AccountsList = res;
      this.filteredAccountsServerSide.next(this.AccountsList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingAccounts = false;
    });
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    this.Py_loans.value.d_loan_date=new DatePipe('en-US').transform(this.Py_loans.value.d_loan_date, 'yyyy/MM/dd');
    this.Py_loans.value.d_start_of_deduction=new DatePipe('en-US').transform(this.Py_loans.value.d_start_of_deduction, 'yyyy/MM/dd');
    this.Py_loans.value.d_end_of_deduction=new DatePipe('en-US').transform(this.Py_loans.value.d_end_of_deduction, 'yyyy/MM/dd');

    formData.append('n_loan_no', this.Py_loans.value.n_loan_no ?? 0);
    formData.append('d_loan_date', this.Py_loans.value.d_loan_date ?? '');
    formData.append('n_Trans_Type', this.Py_loans.value.n_Trans_Type ?? 0);
    formData.append('n_requestNo', this.Py_loans.value.n_requestNo ?? 0);
    formData.append('b_OldYear', this.Py_loans.value.b_OldYear ?? false);
    formData.append('n_employee_id', this.Py_loans.value.n_employee_id ?? 0);
    formData.append('n_settlement_Type', this.Py_loans.value.n_settlement_Type ?? 0);
    formData.append('n_loan_value', this.Py_loans.value.n_loan_value ?? 0);
    formData.append('n_SubtractValue', this.Py_loans.value.n_SubtractValue ?? 0);
    formData.append('n_monthlyValue', this.Py_loans.value.n_monthlyValue ?? 0);
    formData.append('s_tafkita', this.Py_loans.value.s_tafkita ?? '');
    formData.append('s_account_no', this.Py_loans.value.s_account_no ?? '');
    formData.append('n_count_of_installments', this.Py_loans.value.n_count_of_installments ?? 0);
    formData.append('d_start_of_deduction', this.Py_loans.value.d_start_of_deduction ?? '');
    formData.append('d_end_of_deduction', this.Py_loans.value.d_end_of_deduction ?? '');
    formData.append('s_Description', this.Py_loans.value.s_Description ?? '');
    formData.append('s_Description_eng', this.Py_loans.value.s_Description_eng ?? '');
    formData.append('n_DataAreaID', this.Py_loans.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.Py_loans.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.Py_loans.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.Py_loans.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.Py_loans.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.Py_loans.value.n_current_company ?? 0);
    formData.append('n_current_year', this.Py_loans.value.n_current_year ?? 0);

    for(var i = 0; i < this.Py_loans_details.length; i++)
    {
      this.Py_loans.value.Py_loans_details[i].d_Due_Date=new DatePipe('en-US').transform(this.Py_loans.value.Py_loans_details[i].d_Due_Date, 'yyyy/MM/dd');
      this.Py_loans.value.Py_loans_details[i].d_deduct_date=new DatePipe('en-US').transform(this.Py_loans.value.Py_loans_details[i].d_deduct_date, 'yyyy/MM/dd');
      formData.append(`Py_loans_details[${i}].n_serial`, this.Py_loans?.value.Py_loans_details[i].n_serial ?? 0);
      formData.append(`Py_loans_details[${i}].d_Due_Date`, this.Py_loans?.value.Py_loans_details[i].d_Due_Date ?? '');
      formData.append(`Py_loans_details[${i}].n_Due_Value`, this.Py_loans?.value.Py_loans_details[i].n_Due_Value ?? 0);
      formData.append(`Py_loans_details[${i}].b_deduct`, this.Py_loans?.value.Py_loans_details[i].b_deduct ?? false);
      formData.append(`Py_loans_details[${i}].d_deduct_date`, this.Py_loans?.value.Py_loans_details[i].d_deduct_date ?? '');
      formData.append(`Py_loans_details[${i}].b_postponted`, this.Py_loans?.value.Py_loans_details[i].b_postponted ?? false);
      formData.append(`Py_loans_details[${i}].s_cost_center_id`, this.Py_loans?.value.Py_loans_details[i].s_cost_center_id ?? '');
      formData.append(`Py_loans_details[${i}].s_cost_center_id2`, this.Py_loans?.value.Py_loans_details[i].s_cost_center_id2 ?? '');
    }

    if(this.loanNo !=null && this.loanNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/loans-trans-list']);
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
          this._router.navigate(['/hr/loans-trans-list']);
        }
      });
    }
  }

  LoadCostCenter1(i:number){

    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost1(i:number)
    {
      var costNo=((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;

      this._service.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
          ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
        }
        else
          ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.name);
      });
  }

  LoadCostCenter2(i:number){

    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
      ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost2(i:number)
    {
      var costNo=((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;

      this._service.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
          ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
        }
        else
          ((this.Py_loans.get("Py_loans_details") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.name);
      });
  }

  TransChanged()
  {
    var trans = Number( this.Py_loans.get('n_Trans_Type')?.value );
    if(trans == 2)
      this.isDebitLoan = true;
    else
      this.isDebitLoan = false;
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
