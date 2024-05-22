import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ReplaySubject } from 'rxjs';
import { HrConfigService } from 'src/app/Core/Api/HR/hr-config-service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-hr-configuration',
  templateUrl: './hr-configuration.component.html',
  styleUrls: ['./hr-configuration.component.css']
})
export class HrConfigurationComponent implements OnInit {
  py_HR_configuration!: FormGroup;
  showspinner: boolean = false;

  selectedItems: any[] = [];
  preselectedItemIds!: number[];
  dropdownSettings: IDropdownSettings = {};

  countriesDL: any;
  employeesStatusDL: any;
  latancyCalcTypeDL: any;
  additionalDaysCalcDL: any;
  insuranceCalcTypesDL: any;
  s_emp_status: string = "";

  b_Salary_withCostCenters_CHECKED: boolean = false;

  vacationsRulesList: any = [];
  deductionsList: any = [];
  deservedlyList: any = [];
  costCenterMaxList: any = [];
  accountTreeOrderList: any = [];
  glAccountsTreeList: any = [];
  glGosiAccountsList: any = [];
  searchingVacations:boolean=false;
  searchingDeductions:boolean=false;
  searchingDeservedly:boolean=false;
  searchingCostCenterMax:boolean=false;
  searchingaccountTreeOrder:boolean=false;
  searchingglAccountsTree:boolean=false;
  searchingGosiAccountsTree:boolean=false;
  filteredVacationsServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDeductionsServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDeservedlyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenterMaxServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccountTreeOrderServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredglAccountsTreeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredGosiAccountsTreeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _configService: HrConfigService, private _formBuilder: FormBuilder,
    private _notification: NotificationServiceService, private _activatedRoute: ActivatedRoute, private _userService: UserService,
    private _router: Router)
  {
    this.py_HR_configuration = this._formBuilder.group({
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),

      // Tab1 " تهيئة الشئون الادارية "
      b_Display_Alert_For_Doc_Expire_Date: new FormControl(''),
      b_Display_Alert_For_Contract_Expire_Date: new FormControl(''),
      b_Display_Alert_For_Visa_Expire_Date: new FormControl(''),
      b_Display_Alert_For_Medical_Ins_Expire_Date: new FormControl(''),
      b_Display_Alert_For_Profision_Ceritifacte_Expire_Date: new FormControl(''),
      b_Display_Alert_For_Annual_Reward: new FormControl(''),
      b_Display_alert_For_Due_Employee_Vacations: new FormControl(''),
      b_Display_Alert_For_Vacation_Visa: new FormControl(''),

      n_vacation_rule_no: new FormControl(''),
      s_bank_symbol_salary_issue: new FormControl(''),

      n_country: new FormControl(''),
      s_emp_status: new FormControl(''),
      n_year_days_for_endServices: new FormControl(''),
      n_year_days_for_vacation: new FormControl(''),
      b_calc_vacation_reward_per_contract: new FormControl(''),
      b_vacation_days_per_contract: new FormControl(''),
      b_insurance_salary_last_contract: new FormControl(''),
      n_max_Escorts_no: new FormControl(''),
      n_max_installment_percent_value: new FormControl(''),
      n_max_installment_cont: new FormControl(''),
      b_create_more_loan_one_time: new FormControl(''),

      b_stop_create_indirect_payment: new FormControl(''),
      b_show_costcenter2_only_in_loan: new FormControl(''),
      b_stop_costcenter2_in_loan: new FormControl(''),
      b_stop_costcenter1_in_loan: new FormControl(''),
      b_show_costcenter_in_salaryissue: new FormControl(''),
      b_show_indebtedness_account_endservice_Payment: new FormControl(''),
      b_stop_cost_center_in_overtime_salary_due_journal: new FormControl(''),
      // *End Tab1

      // Tab2 " تهيئة المؤثرات "
      n_Latancy_Allowed_Hours: new FormControl(''),
      n_Latancy_Calc_Type: new FormControl(''),

      n_Phase_One_From: new FormControl(''),
      n_Phase_One_To: new FormControl(''),
      n_Phase_One_Rate: new FormControl(''),
      n_Phase_Two_From: new FormControl(''),
      n_Phase_Two_To: new FormControl(''),
      n_Phase_Two_Rate: new FormControl(''),
      n_Phase_Three_From: new FormControl(''),
      n_Phase_Three_To: new FormControl(''),
      n_Phase_Three_Rate: new FormControl(''),

      n_Early_departure_Deduction_code: new FormControl(''),
      n_Delay_Deduction_Code: new FormControl(''),
      n_not_registered_deduction_id: new FormControl(''),

      n_Absence_Without_Permision_Rate: new FormControl(''),
      n_Absent_Deduction_Code: new FormControl(''),

      n_AddtionalParameter: new FormControl(''),
      n_Additional_Deduction_Code: new FormControl(''),
      n_AddtionalParameter_basic: new FormControl(''),
      n_technical_deserved_code: new FormControl(''),
      n_addtional_calc_days: new FormControl(''),
      n_overtime_payment_method: new FormControl(''),

      b_deduc_absent_first: new FormControl(''),
      b_deduc_attendance_first: new FormControl(''),
      // *End Tab2

      // Tab3 " تهيئة المرتبات "
      n_WorkDays_per_month: new FormControl(''),
      n_Hours: new FormControl(''),
      b_using_round: new FormControl(''),
      b_deduct_EndServiceLoan_From_EndService: new FormControl(''),

      b_year_days: new FormControl(''),
      b_year_days_subtract_due_vacations: new FormControl(''),

      b_edit_endService_ticket: new FormControl(''),
      b_calc_salaries_payable_by_each_allowance: new FormControl(''),

      b_AbsentDaysFromDeserved: new FormControl(''),
      // b_deduct_EndServiceLoan_From_EndService: new FormControl(''), عمل قيد استحقاق للموظف من مخصص نهاية الخدمة
      b_employee_cost_center_auto_coding: new FormControl(''),
      s_main_cost_center: new FormControl({ value: '', disabled: true }),
      b_employee_cost_center_2_auto_coding: new FormControl(''),
      s_main_cost_center_2: new FormControl({ value: '', disabled: true }),

      b_Link_With_GL_config: new FormControl(''),
      s_additional_deduction_endservicePayment: new FormControl(''),
      s_additional_deserve_endservicePayment: new FormControl(''),

      b_linkAccWithEachEmp: new FormControl({ value: '', disabled: true }),
      b_show_journal_within_trans: new FormControl({ value: '', disabled: true }),
      b_activate_bank_comision: new FormControl({ value: '', disabled: true }),
      b_use_multi_provisions_accounts: new FormControl({ value: '', disabled: true }),

      s_meleted_salary_account: new FormControl({ value: '', disabled: true }),
      s_general_emp_salary_acc: new FormControl({ value: '', disabled: true }),
      s_Receivables_Acc: new FormControl({ value: '', disabled: true }),
      s_close_loan_acc: new FormControl({ value: '', disabled: true }),
      s_settelment_loan_Acc: new FormControl({ value: '', disabled: true }),
      s_overtime_acc: new FormControl({ value: '', disabled: true }),
      b_use_multi_allowance_accounts: new FormControl({ value: '', disabled: true }),
      s_allowances_account_no: new FormControl({ value: '', disabled: true }),
      b_use_deduction_meleted_acc: new FormControl({ value: '', disabled: true }),
      s_meleted_deduction_account_no: new FormControl({ value: '', disabled: true }),
      b_use_multi_deservedly_accounts: new FormControl({ value: '', disabled: true }),
      s_meleted_deservedly_account_no: new FormControl({ value: '', disabled: true }),
      b_Salary_withCostCenters: new FormControl({ value: '', disabled: true }),
      b_DaysWithCostCenter: new FormControl(''),
      b_HoursWithCostCenter: new FormControl(''),
      s_settelment_salaries_Acc: new FormControl({ value: '', disabled: true }),

      s_termination_account: new FormControl({ value: '', disabled: true }),
      s_ticket_acc: new FormControl({ value: '', disabled: true }),
      s_vacation_acc: new FormControl({ value: '', disabled: true }),
      s_termination_account_x: new FormControl({ value: '', disabled: true }),
      s_ticket_acc_x: new FormControl({ value: '', disabled: true }),
      s_vacation_acc_x: new FormControl({ value: '', disabled: true }),
      s_visa_acc: new FormControl({ value: '', disabled: true }),
      s_visa_expenses_acc: new FormControl({ value: '', disabled: true }),
      s_additional_deduction_endservicePayment_expenses: new FormControl({ value: '', disabled: true }),
      s_additional_deserve_endservicePayment_expenses: new FormControl({ value: '', disabled: true }),

      b_LoanAcc_auto_coding: new FormControl({ value: '', disabled: true }),
      s_main_loan_acc: new FormControl({ value: '', disabled: true }),
      b_show_emp_code_in_journals: new FormControl({ value: '', disabled: true }),
      // *End Tab3

      // Tab4 " تهيئة التأمينات "
      b_gosi_calc: new FormControl(''),
      n_Insurance_Calc_Type: new FormControl({ value: '', disabled: true }),
      n_Forign_Emp_Profision_Risk_Rate: new FormControl({ value: '', disabled: true }),
      n_Forign_Emp_Medical_insurance_Rate: new FormControl({ value: '', disabled: true }),
      n_Citizen_Emp_Profision_Risk_Rate: new FormControl({ value: '', disabled: true }),
      n_Citizen_Emp_Medical_insurance_Rate: new FormControl({ value: '', disabled: true }),
      n_Citizen_Emp_Gosi_Rate: new FormControl({ value: '', disabled: true }),
      n_Company_Rate_For_Gosi: new FormControl({ value: '', disabled: true }),

      b_one_Insurance_Acc: new FormControl({ value: '', disabled: true }),
      b_multi_Insurance_Acc: new FormControl({ value: '', disabled: true }),

      n_Gosi_Expense_Acc: new FormControl({ value: '', disabled: true }),
      n_Gosi_Accrued_Acc: new FormControl({ value: '', disabled: true }),
      // *End Tab4
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'code',
      textField: 'name_arabic',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.loadDropDowns();
    this.searchVacations('');
    this.searchDeductions('');
    this.searchDeservedly('');
    this.searchCostCenterMax('');
    this.searchaccountTreeOrder('');
    this.searchglAccountsTree('');
    this.searchGosiAccounts('');

    this._configService.GetCurrentDataAreaConfiguration(Number(this._userService.GetDataAreaID())).subscribe((data) => {
      this.s_emp_status = data.s_emp_status;
      data.s_emp_status = "";
      this.py_HR_configuration.patchValue(data);
      this.py_HR_configuration.get('n_DataAreaID')?.patchValue(data.n_DataAreaID);
      this.py_HR_configuration.get('n_UserAdd')?.patchValue(data.n_UserAdd);
      this.py_HR_configuration.get('n_UserUpdate')?.patchValue(data.n_UserUpdate);
      this.py_HR_configuration.get('d_UserAddDate')?.patchValue(data.d_UserAddDate);
      this.py_HR_configuration.get('d_UserUpdateDate')?.patchValue(data.d_UserUpdateDate);
      if(this.s_emp_status != null)
      {
        const initialValues: number[] = this.s_emp_status.split(',').map(Number);
        this.py_HR_configuration.get('s_emp_status')?.patchValue(initialValues);
      }
      this.b_Link_With_GL_config_CHANGED();
      this.b_use_multi_provisions_accounts_CHANGED();
      this.b_Salary_withCostCenters_CHECKEDFun();
      this.b_employee_cost_center_auto_coding_CHANGED();
      this.b_employee_cost_center_2_auto_coding_CHANGED();
      this.b_gosi_calcChanged();
    });

    this.py_HR_configuration.get('b_deduc_absent_first')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_deduc_attendance_first')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_deduc_attendance_first')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_deduc_absent_first')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_year_days')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_year_days_subtract_due_vacations')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_year_days_subtract_due_vacations')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_year_days')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_year_days')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_year_days_subtract_due_vacations')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_year_days_subtract_due_vacations')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_year_days')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_DaysWithCostCenter')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_HoursWithCostCenter')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_HoursWithCostCenter')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_DaysWithCostCenter')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_one_Insurance_Acc')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_multi_Insurance_Acc')?.setValue(false);
      }
    });

    this.py_HR_configuration.get('b_multi_Insurance_Acc')?.valueChanges.subscribe((value) => {
      if (value) {
        this.py_HR_configuration.get('b_one_Insurance_Acc')?.setValue(false);
      }
    });
  }

  loadDropDowns()
  {
    this._configService.GetEmployeesStatus().subscribe((data) => {
      this.employeesStatusDL = data;
    });

    this._configService.GetCountries().subscribe((data) => {
      this.countriesDL = data;
    });

    this._configService.GetAdditionalDaysCalc().subscribe((data) => {
      this.additionalDaysCalcDL = data;
    });

    this._configService.GetEmployeeLatencyTypes().subscribe((data) => {
      this.latancyCalcTypeDL = data;
    });

    this._configService.GetInsuranceCalcTypes().subscribe((data) => {
      this.insuranceCalcTypesDL = data;
    });
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
  }

  onSelectAll(items: any) {
    this.selectedItems = [];
    items.forEach(element => {
      this.selectedItems.push(element);
    });
  }

  searchVacations(value :any) {
    this.searchingVacations = true;
    this._configService.GetVacationRules().subscribe(res=>{
      this.vacationsRulesList = res;
      this.filteredVacationsServerSide.next(this.vacationsRulesList.filter(x => x.s_rule_desc.toLowerCase().indexOf(value) > -1));
      this.searchingVacations = false;
    });
  }

  searchDeductions(value :any) {
    this.searchingDeductions = true;
    this._configService.GetDeductions().subscribe(res=>{
      this.deductionsList = res;
      this.filteredDeductionsServerSide.next(this.deductionsList.filter(x => x.s_deduction_name.toLowerCase().indexOf(value) > -1));
      this.searchingDeductions = false;
    });
  }

  searchDeservedly(value :any) {
    this.searchingDeservedly = true;
    this._configService.GetDeservedly().subscribe(res=>{
      this.deservedlyList = res;
      this.filteredDeservedlyServerSide.next(this.deservedlyList.filter(x => x.s_Deservedly_name.toLowerCase().indexOf(value) > -1));
      this.searchingDeservedly = false;
    });
  }

  searchCostCenterMax(value :any) {
    this.searchingCostCenterMax = true;
    this._configService.GetCostCentersMaxLevel().subscribe(res=>{
      this.costCenterMaxList = res;
      this.filteredCostCenterMaxServerSide.next(this.costCenterMaxList.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCostCenterMax = false;
    });
  }

  searchaccountTreeOrder(value :any) {
    this.searchingaccountTreeOrder = true;
    this._configService.GetAccountsTreeOrder().subscribe(res=>{
      this.accountTreeOrderList = res;
      this.filteredaccountTreeOrderServerSide.next(this.accountTreeOrderList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingaccountTreeOrder = false;
    });
  }

  searchglAccountsTree(value :any) {
    this.searchingglAccountsTree = true;
    this._configService.GetGlAccountsTree().subscribe(res=>{
      this.glAccountsTreeList = res;
      this.filteredglAccountsTreeServerSide.next(this.glAccountsTreeList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingglAccountsTree = false;
    });
  }

  searchGosiAccounts(value :any) {
    this.searchingGosiAccountsTree = true;
    this._configService.GetGosiExpenseAccounts().subscribe(res=>{
      this.glGosiAccountsList = res;
      this.filteredGosiAccountsTreeServerSide.next(this.glGosiAccountsList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingGosiAccountsTree = false;
    });
  }

  b_Link_With_GL_config_CHANGED()
  {
    var bLinkWithConfig = this.py_HR_configuration.get('b_Link_With_GL_config')?.value;
    if(bLinkWithConfig == true)
    {
      this.py_HR_configuration.get('b_linkAccWithEachEmp')?.enable();
      this.py_HR_configuration.get('b_show_journal_within_trans')?.enable();
      this.py_HR_configuration.get('b_activate_bank_comision')?.enable();
      this.py_HR_configuration.get('b_use_multi_provisions_accounts')?.enable();
      this.py_HR_configuration.get('s_meleted_salary_account')?.enable();
      this.py_HR_configuration.get('s_general_emp_salary_acc')?.enable();
      this.py_HR_configuration.get('s_Receivables_Acc')?.enable();
      this.py_HR_configuration.get('s_close_loan_acc')?.enable();
      this.py_HR_configuration.get('s_settelment_loan_Acc')?.enable();
      this.py_HR_configuration.get('s_overtime_acc')?.enable();
      this.py_HR_configuration.get('b_use_multi_allowance_accounts')?.enable();
      this.py_HR_configuration.get('s_allowances_account_no')?.enable();
      this.py_HR_configuration.get('b_use_deduction_meleted_acc')?.enable();
      this.py_HR_configuration.get('s_meleted_deduction_account_no')?.enable();
      this.py_HR_configuration.get('b_use_multi_deservedly_accounts')?.enable();
      this.py_HR_configuration.get('s_meleted_deservedly_account_no')?.enable();
      this.py_HR_configuration.get('b_Salary_withCostCenters')?.enable();
      this.py_HR_configuration.get('b_DaysWithCostCenter')?.enable();
      this.py_HR_configuration.get('b_HoursWithCostCenter')?.enable();
      this.py_HR_configuration.get('s_settelment_salaries_Acc')?.enable();
      this.py_HR_configuration.get('s_termination_account')?.enable();
      this.py_HR_configuration.get('s_ticket_acc')?.enable();
      this.py_HR_configuration.get('s_vacation_acc')?.enable();
      this.py_HR_configuration.get('s_termination_account_x')?.enable();
      this.py_HR_configuration.get('s_ticket_acc_x')?.enable();
      this.py_HR_configuration.get('s_vacation_acc_x')?.enable();
      this.py_HR_configuration.get('s_visa_acc')?.enable();
      this.py_HR_configuration.get('s_visa_expenses_acc')?.enable();
      this.py_HR_configuration.get('s_additional_deduction_endservicePayment_expenses')?.enable();
      this.py_HR_configuration.get('s_additional_deserve_endservicePayment_expenses')?.enable();
      this.py_HR_configuration.get('b_LoanAcc_auto_coding')?.enable();
      this.py_HR_configuration.get('s_main_loan_acc')?.enable();
      this.py_HR_configuration.get('b_show_emp_code_in_journals')?.enable();
    }else{
      {
        this.py_HR_configuration.get('b_linkAccWithEachEmp')?.disable();
        this.py_HR_configuration.get('b_show_journal_within_trans')?.disable();
        this.py_HR_configuration.get('b_activate_bank_comision')?.disable();
        this.py_HR_configuration.get('b_use_multi_provisions_accounts')?.disable();
        this.py_HR_configuration.get('s_meleted_salary_account')?.disable();
        this.py_HR_configuration.get('s_general_emp_salary_acc')?.disable();
        this.py_HR_configuration.get('s_Receivables_Acc')?.disable();
        this.py_HR_configuration.get('s_close_loan_acc')?.disable();
        this.py_HR_configuration.get('s_settelment_loan_Acc')?.disable();
        this.py_HR_configuration.get('s_overtime_acc')?.disable();
        this.py_HR_configuration.get('b_use_multi_allowance_accounts')?.disable();
        this.py_HR_configuration.get('s_allowances_account_no')?.disable();
        this.py_HR_configuration.get('b_use_deduction_meleted_acc')?.disable();
        this.py_HR_configuration.get('s_meleted_deduction_account_no')?.disable();
        this.py_HR_configuration.get('b_use_multi_deservedly_accounts')?.disable();
        this.py_HR_configuration.get('s_meleted_deservedly_account_no')?.disable();
        this.py_HR_configuration.get('b_Salary_withCostCenters')?.disable();
        this.py_HR_configuration.get('b_DaysWithCostCenter')?.disable();
        this.py_HR_configuration.get('b_HoursWithCostCenter')?.disable();
        this.py_HR_configuration.get('s_settelment_salaries_Acc')?.disable();
        this.py_HR_configuration.get('s_termination_account')?.disable();
        this.py_HR_configuration.get('s_ticket_acc')?.disable();
        this.py_HR_configuration.get('s_vacation_acc')?.disable();
        this.py_HR_configuration.get('s_termination_account_x')?.disable();
        this.py_HR_configuration.get('s_ticket_acc_x')?.disable();
        this.py_HR_configuration.get('s_vacation_acc_x')?.disable();
        this.py_HR_configuration.get('s_visa_acc')?.disable();
        this.py_HR_configuration.get('s_visa_expenses_acc')?.disable();
        this.py_HR_configuration.get('s_additional_deduction_endservicePayment_expenses')?.disable();
        this.py_HR_configuration.get('s_additional_deserve_endservicePayment_expenses')?.disable();
        this.py_HR_configuration.get('b_LoanAcc_auto_coding')?.disable();
        this.py_HR_configuration.get('s_main_loan_acc')?.disable();
        this.py_HR_configuration.get('b_show_emp_code_in_journals')?.disable();
      }
    }
  }

  b_use_multi_provisions_accounts_CHANGED()
  {
    var bMultiProvisions = this.py_HR_configuration.get('b_use_multi_provisions_accounts')?.value;
    if(bMultiProvisions == true)
    {
      this.py_HR_configuration.get('s_termination_account')?.disable();
      this.py_HR_configuration.get('s_ticket_acc')?.disable();
      this.py_HR_configuration.get('s_vacation_acc')?.disable();
      this.py_HR_configuration.get('s_termination_account_x')?.disable();
      this.py_HR_configuration.get('s_ticket_acc_x')?.disable();
      this.py_HR_configuration.get('s_vacation_acc_x')?.disable();
      this.py_HR_configuration.get('s_visa_acc')?.disable();
      this.py_HR_configuration.get('s_visa_expenses_acc')?.disable();
      this.py_HR_configuration.get('s_additional_deduction_endservicePayment_expenses')?.disable();
      this.py_HR_configuration.get('s_additional_deserve_endservicePayment_expenses')?.disable();
    }else{
      this.py_HR_configuration.get('s_termination_account')?.enable();
      this.py_HR_configuration.get('s_ticket_acc')?.enable();
      this.py_HR_configuration.get('s_vacation_acc')?.enable();
      this.py_HR_configuration.get('s_termination_account_x')?.enable();
      this.py_HR_configuration.get('s_ticket_acc_x')?.enable();
      this.py_HR_configuration.get('s_vacation_acc_x')?.enable();
      this.py_HR_configuration.get('s_visa_acc')?.enable();
      this.py_HR_configuration.get('s_visa_expenses_acc')?.enable();
      this.py_HR_configuration.get('s_additional_deduction_endservicePayment_expenses')?.enable();
      this.py_HR_configuration.get('s_additional_deserve_endservicePayment_expenses')?.enable();
    }
  }

  b_Salary_withCostCenters_CHECKEDFun()
  {
    var bSalary = this.py_HR_configuration.get('b_Salary_withCostCenters')?.value;
    if(bSalary == true)
      this.b_Salary_withCostCenters_CHECKED = true;
    else
      this.b_Salary_withCostCenters_CHECKED = false;
  }

  b_employee_cost_center_auto_coding_CHANGED()
  {
    var empCostCenterChanged = this.py_HR_configuration.get('b_employee_cost_center_auto_coding')?.value;
    if(empCostCenterChanged == true)
      this.py_HR_configuration.get('s_main_cost_center')?.enable();
    else
      this.py_HR_configuration.get('s_main_cost_center')?.disable();
  }

  b_employee_cost_center_2_auto_coding_CHANGED()
  {
    var empCostCenter2Changed = this.py_HR_configuration.get('b_employee_cost_center_2_auto_coding')?.value;
    if(empCostCenter2Changed == true)
      this.py_HR_configuration.get('s_main_cost_center_2')?.enable();
    else
      this.py_HR_configuration.get('s_main_cost_center_2')?.disable();
  }

  b_gosi_calcChanged()
  {
    var gosiCalc = this.py_HR_configuration.get('b_gosi_calc')?.value;
    if(gosiCalc == true)
    {
      this.py_HR_configuration.get('n_Insurance_Calc_Type')?.enable();
      this.py_HR_configuration.get('n_Forign_Emp_Profision_Risk_Rate')?.enable();
      this.py_HR_configuration.get('n_Forign_Emp_Medical_insurance_Rate')?.enable();
      this.py_HR_configuration.get('n_Citizen_Emp_Profision_Risk_Rate')?.enable();
      this.py_HR_configuration.get('n_Citizen_Emp_Medical_insurance_Rate')?.enable();
      this.py_HR_configuration.get('n_Citizen_Emp_Gosi_Rate')?.enable();
      this.py_HR_configuration.get('n_Company_Rate_For_Gosi')?.enable();
      this.py_HR_configuration.get('b_one_Insurance_Acc')?.enable();
      this.py_HR_configuration.get('b_multi_Insurance_Acc')?.enable();
      this.py_HR_configuration.get('n_Gosi_Expense_Acc')?.enable();
      this.py_HR_configuration.get('n_Gosi_Accrued_Acc')?.enable();
    }else{
      this.py_HR_configuration.get('n_Insurance_Calc_Type')?.disable();
      this.py_HR_configuration.get('n_Forign_Emp_Profision_Risk_Rate')?.disable();
      this.py_HR_configuration.get('n_Forign_Emp_Medical_insurance_Rate')?.disable();
      this.py_HR_configuration.get('n_Citizen_Emp_Profision_Risk_Rate')?.disable();
      this.py_HR_configuration.get('n_Citizen_Emp_Medical_insurance_Rate')?.disable();
      this.py_HR_configuration.get('n_Citizen_Emp_Gosi_Rate')?.disable();
      this.py_HR_configuration.get('n_Company_Rate_For_Gosi')?.disable();
      this.py_HR_configuration.get('b_one_Insurance_Acc')?.disable();
      this.py_HR_configuration.get('b_multi_Insurance_Acc')?.disable();
      this.py_HR_configuration.get('n_Gosi_Expense_Acc')?.disable();
      this.py_HR_configuration.get('n_Gosi_Accrued_Acc')?.disable();
    }
  }

  save()
  {
    this.disableButtons();
    this.showspinner = true;
    var formData: any = new FormData();

    formData.append('n_DataAreaID', this.py_HR_configuration.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.py_HR_configuration.value.n_UserAdd ?? 0);
    formData.append('n_UserUpdate', this.py_HR_configuration.value.n_UserUpdate ?? 0);
    formData.append('d_UserAddDate', this.py_HR_configuration.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_HR_configuration.value.d_UserUpdateDate ?? '');

    // Tab1 _<|>_
    formData.append('b_Display_Alert_For_Doc_Expire_Date', this.py_HR_configuration.value.b_Display_Alert_For_Doc_Expire_Date ?? false);
    formData.append('b_Display_Alert_For_Contract_Expire_Date', this.py_HR_configuration.value.b_Display_Alert_For_Contract_Expire_Date ?? false);
    formData.append('b_Display_Alert_For_Visa_Expire_Date', this.py_HR_configuration.value.b_Display_Alert_For_Visa_Expire_Date ?? false);
    formData.append('b_Display_Alert_For_Medical_Ins_Expire_Date', this.py_HR_configuration.value.b_Display_Alert_For_Medical_Ins_Expire_Date ?? false);
    formData.append('b_Display_Alert_For_Profision_Ceritifacte_Expire_Date', this.py_HR_configuration.value.b_Display_Alert_For_Profision_Ceritifacte_Expire_Date ?? false);
    formData.append('b_Display_Alert_For_Annual_Reward', this.py_HR_configuration.value.b_Display_Alert_For_Annual_Reward ?? false);
    formData.append('b_Display_alert_For_Due_Employee_Vacations', this.py_HR_configuration.value.b_Display_alert_For_Due_Employee_Vacations ?? false);
    formData.append('b_Display_Alert_For_Vacation_Visa', this.py_HR_configuration.value.b_Display_Alert_For_Vacation_Visa ?? false);
    formData.append('n_vacation_rule_no', this.py_HR_configuration.value.n_vacation_rule_no ?? 0);
    formData.append('s_bank_symbol_salary_issue', this.py_HR_configuration.value.s_bank_symbol_salary_issue ?? '');
    formData.append('n_country', this.py_HR_configuration.value.n_country ?? 0);
    // const selectedItemsCodes = this.selectedItems.map(element => element.code).join(',');
    // this.py_HR_configuration.get('s_emp_status')?.patchValue(selectedItemsCodes);

    formData.append('s_emp_status', this.py_HR_configuration.value.s_emp_status ?? '');
    formData.append('n_year_days_for_endServices', this.py_HR_configuration.value.n_year_days_for_endServices ?? 0);
    formData.append('n_year_days_for_vacation', this.py_HR_configuration.value.n_year_days_for_vacation ?? 0);
    formData.append('b_calc_vacation_reward_per_contract', this.py_HR_configuration.value.b_calc_vacation_reward_per_contract ?? false);
    formData.append('b_vacation_days_per_contract', this.py_HR_configuration.value.b_vacation_days_per_contract ?? false);
    formData.append('b_insurance_salary_last_contract', this.py_HR_configuration.value.b_insurance_salary_last_contract ?? false);
    formData.append('n_max_Escorts_no', this.py_HR_configuration.value.n_max_Escorts_no ?? 0);
    formData.append('n_max_installment_percent_value', this.py_HR_configuration.value.n_max_installment_percent_value ?? 0);
    formData.append('n_max_installment_cont', this.py_HR_configuration.value.n_max_installment_cont ?? 0);
    formData.append('b_create_more_loan_one_time', this.py_HR_configuration.value.b_create_more_loan_one_time ?? false);
    formData.append('b_stop_create_indirect_payment', this.py_HR_configuration.value.b_stop_create_indirect_payment ?? false);
    formData.append('b_show_costcenter2_only_in_loan', this.py_HR_configuration.value.b_show_costcenter2_only_in_loan ?? false);
    formData.append('b_stop_costcenter2_in_loan', this.py_HR_configuration.value.b_stop_costcenter2_in_loan ?? false);
    formData.append('b_stop_costcenter1_in_loan', this.py_HR_configuration.value.b_stop_costcenter1_in_loan ?? false);
    formData.append('b_show_costcenter_in_salaryissue', this.py_HR_configuration.value.b_show_costcenter_in_salaryissue ?? false);
    formData.append('b_show_indebtedness_account_endservice_Payment', this.py_HR_configuration.value.b_show_indebtedness_account_endservice_Payment ?? false);
    formData.append('b_stop_cost_center_in_overtime_salary_due_journal', this.py_HR_configuration.value.b_stop_cost_center_in_overtime_salary_due_journal ?? false);
    // *End Tab1

    // Tab2
    formData.append('n_Latancy_Allowed_Hours', this.py_HR_configuration.value.n_Latancy_Allowed_Hours ?? 0);
    formData.append('n_Latancy_Calc_Type', this.py_HR_configuration.value.n_Latancy_Calc_Type ?? 0);
    formData.append('n_Phase_One_From', this.py_HR_configuration.value.n_Phase_One_From ?? 0);
    formData.append('n_Phase_One_To', this.py_HR_configuration.value.n_Phase_One_To ?? 0);
    formData.append('n_Phase_One_Rate', this.py_HR_configuration.value.n_Phase_One_Rate ?? 0);
    formData.append('n_Phase_Two_From', this.py_HR_configuration.value.n_Phase_Two_From ?? 0);
    formData.append('n_Phase_Two_To', this.py_HR_configuration.value.n_Phase_Two_To ?? 0);
    formData.append('n_Phase_Two_Rate', this.py_HR_configuration.value.n_Phase_Two_Rate ?? 0);
    formData.append('n_Phase_Three_From', this.py_HR_configuration.value.n_Phase_Three_From ?? 0);
    formData.append('n_Phase_Three_To', this.py_HR_configuration.value.n_Phase_Three_To ?? 0);
    formData.append('n_Phase_Three_Rate', this.py_HR_configuration.value.n_Phase_Three_Rate ?? 0);
    formData.append('n_Early_departure_Deduction_code', this.py_HR_configuration.value.n_Early_departure_Deduction_code ?? 0);
    formData.append('n_Delay_Deduction_Code', this.py_HR_configuration.value.n_Delay_Deduction_Code ?? 0);
    formData.append('n_not_registered_deduction_id', this.py_HR_configuration.value.n_not_registered_deduction_id ?? 0);
    formData.append('n_Absence_Without_Permision_Rate', this.py_HR_configuration.value.n_Absence_Without_Permision_Rate ?? 0);
    formData.append('n_Absent_Deduction_Code', this.py_HR_configuration.value.n_Absent_Deduction_Code ?? 0);
    formData.append('n_AddtionalParameter', this.py_HR_configuration.value.n_AddtionalParameter ?? 0);
    formData.append('n_Additional_Deduction_Code', this.py_HR_configuration.value.n_Additional_Deduction_Code ?? 0);
    formData.append('n_AddtionalParameter_basic', this.py_HR_configuration.value.n_AddtionalParameter_basic ?? 0);
    formData.append('n_technical_deserved_code', this.py_HR_configuration.value.n_technical_deserved_code ?? 0);
    formData.append('n_addtional_calc_days', this.py_HR_configuration.value.n_addtional_calc_days ?? 0);
    formData.append('n_overtime_payment_method', this.py_HR_configuration.value.n_overtime_payment_method ?? 0);
    debugger
    formData.append('b_deduc_absent_first', this.py_HR_configuration.value.b_deduc_absent_first ?? false);
    formData.append('b_deduc_attendance_first', this.py_HR_configuration.value.b_deduc_attendance_first ?? false);
    // *End Tab2

    // Tab3
    formData.append('n_WorkDays_per_month', this.py_HR_configuration.value.n_WorkDays_per_month ?? 0);
    formData.append('n_Hours', this.py_HR_configuration.value.n_Hours ?? 0);
    formData.append('b_using_round', this.py_HR_configuration.value.b_using_round ?? false);
    formData.append('b_deduct_EndServiceLoan_From_EndService', this.py_HR_configuration.value.b_deduct_EndServiceLoan_From_EndService ?? false);
    formData.append('b_year_days', this.py_HR_configuration.value.b_year_days ?? false);
    formData.append('b_year_days_subtract_due_vacations', this.py_HR_configuration.value.b_year_days_subtract_due_vacations ?? false);
    formData.append('b_edit_endService_ticket', this.py_HR_configuration.value.b_edit_endService_ticket ?? false);
    formData.append('b_calc_salaries_payable_by_each_allowance', this.py_HR_configuration.value.b_calc_salaries_payable_by_each_allowance ?? false);
    formData.append('b_AbsentDaysFromDeserved', this.py_HR_configuration.value.b_AbsentDaysFromDeserved ?? false);
    formData.append('b_employee_cost_center_auto_coding', this.py_HR_configuration.value.b_employee_cost_center_auto_coding ?? false);
    formData.append('s_main_cost_center', this.py_HR_configuration.value.s_main_cost_center ?? '');
    formData.append('b_employee_cost_center_2_auto_coding', this.py_HR_configuration.value.b_employee_cost_center_2_auto_coding ?? false);
    formData.append('s_main_cost_center_2', this.py_HR_configuration.value.s_main_cost_center_2 ?? '');
    formData.append('b_Link_With_GL_config', this.py_HR_configuration.value.b_Link_With_GL_config ?? false);
    formData.append('s_additional_deduction_endservicePayment', this.py_HR_configuration.value.s_additional_deduction_endservicePayment ?? '');
    formData.append('s_additional_deserve_endservicePayment', this.py_HR_configuration.value.s_additional_deserve_endservicePayment ?? '');
    formData.append('b_linkAccWithEachEmp', this.py_HR_configuration.value.b_linkAccWithEachEmp ?? false);
    formData.append('b_show_journal_within_trans', this.py_HR_configuration.value.b_show_journal_within_trans ?? false);
    formData.append('b_activate_bank_comision', this.py_HR_configuration.value.b_activate_bank_comision ?? false);
    formData.append('b_use_multi_provisions_accounts', this.py_HR_configuration.value.b_use_multi_provisions_accounts ?? false);
    formData.append('s_meleted_salary_account', this.py_HR_configuration.value.s_meleted_salary_account ?? '');
    formData.append('s_general_emp_salary_acc', this.py_HR_configuration.value.s_general_emp_salary_acc ?? '');
    formData.append('s_Receivables_Acc', this.py_HR_configuration.value.s_Receivables_Acc ?? '');
    formData.append('s_close_loan_acc', this.py_HR_configuration.value.s_close_loan_acc ?? '');
    formData.append('s_settelment_loan_Acc', this.py_HR_configuration.value.s_settelment_loan_Acc ?? '');
    formData.append('s_overtime_acc', this.py_HR_configuration.value.s_overtime_acc ?? '');
    formData.append('b_use_multi_allowance_accounts', this.py_HR_configuration.value.b_use_multi_allowance_accounts ?? false);
    formData.append('s_allowances_account_no', this.py_HR_configuration.value.s_allowances_account_no ?? '');
    formData.append('b_use_deduction_meleted_acc', this.py_HR_configuration.value.b_use_deduction_meleted_acc ?? false);
    formData.append('s_meleted_deduction_account_no', this.py_HR_configuration.value.s_meleted_deduction_account_no ?? '');
    formData.append('b_use_multi_deservedly_accounts', this.py_HR_configuration.value.b_use_multi_deservedly_accounts ?? false);
    formData.append('s_meleted_deservedly_account_no', this.py_HR_configuration.value.s_meleted_deservedly_account_no ?? '');
    formData.append('b_Salary_withCostCenters', this.py_HR_configuration.value.b_Salary_withCostCenters ?? false);
    formData.append('b_DaysWithCostCenter', this.py_HR_configuration.value.b_DaysWithCostCenter ?? false);
    formData.append('b_HoursWithCostCenter', this.py_HR_configuration.value.b_HoursWithCostCenter ?? false);
    formData.append('s_settelment_salaries_Acc', this.py_HR_configuration.value.s_settelment_salaries_Acc ?? '');
    formData.append('s_termination_account', this.py_HR_configuration.value.s_termination_account ?? '');
    formData.append('s_ticket_acc', this.py_HR_configuration.value.s_ticket_acc ?? '');
    formData.append('s_vacation_acc', this.py_HR_configuration.value.s_vacation_acc ?? '');
    formData.append('s_termination_account_x', this.py_HR_configuration.value.s_termination_account_x ?? '');
    formData.append('s_ticket_acc_x', this.py_HR_configuration.value.s_ticket_acc_x ?? '');
    formData.append('s_vacation_acc_x', this.py_HR_configuration.value.s_vacation_acc_x ?? '');
    formData.append('s_visa_acc', this.py_HR_configuration.value.s_visa_acc ?? '');
    formData.append('s_visa_expenses_acc', this.py_HR_configuration.value.s_visa_expenses_acc ?? '');
    formData.append('s_additional_deduction_endservicePayment_expenses', this.py_HR_configuration.value.s_additional_deduction_endservicePayment_expenses ?? '');
    formData.append('s_additional_deserve_endservicePayment_expenses', this.py_HR_configuration.value.s_additional_deserve_endservicePayment_expenses ?? '');
    formData.append('b_LoanAcc_auto_coding', this.py_HR_configuration.value.b_LoanAcc_auto_coding ?? false);
    formData.append('s_main_loan_acc', this.py_HR_configuration.value.s_main_loan_acc ?? '');
    formData.append('b_show_emp_code_in_journals', this.py_HR_configuration.value.b_show_emp_code_in_journals ?? false);
    // *End Tab3

    // Tab4
    formData.append('b_gosi_calc', this.py_HR_configuration.value.b_gosi_calc ?? false);
    formData.append('n_Insurance_Calc_Type', this.py_HR_configuration.value.n_Insurance_Calc_Type ?? 0);
    formData.append('n_Forign_Emp_Profision_Risk_Rate', this.py_HR_configuration.value.n_Forign_Emp_Profision_Risk_Rate ?? 0);
    formData.append('n_Forign_Emp_Medical_insurance_Rate', this.py_HR_configuration.value.n_Forign_Emp_Medical_insurance_Rate ?? 0);
    formData.append('n_Citizen_Emp_Profision_Risk_Rate', this.py_HR_configuration.value.n_Citizen_Emp_Profision_Risk_Rate ?? 0);
    formData.append('n_Citizen_Emp_Medical_insurance_Rate', this.py_HR_configuration.value.n_Citizen_Emp_Medical_insurance_Rate ?? 0);
    formData.append('n_Citizen_Emp_Gosi_Rate', this.py_HR_configuration.value.n_Citizen_Emp_Gosi_Rate ?? 0);
    formData.append('n_Company_Rate_For_Gosi', this.py_HR_configuration.value.n_Company_Rate_For_Gosi ?? 0);
    formData.append('b_one_Insurance_Acc', this.py_HR_configuration.value.b_one_Insurance_Acc ?? false);
    formData.append('b_multi_Insurance_Acc', this.py_HR_configuration.value.b_multi_Insurance_Acc ?? false);
    formData.append('n_Gosi_Expense_Acc', this.py_HR_configuration.value.n_Gosi_Expense_Acc ?? 0);
    formData.append('n_Gosi_Accrued_Acc', this.py_HR_configuration.value.n_Gosi_Accrued_Acc ?? 0);
    // *End Tab4

    this._configService.ResetConfiguration(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this._router.navigate(['/hr/hrconfig']);
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
