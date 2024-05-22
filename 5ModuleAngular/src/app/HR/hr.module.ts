import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataTablesModule } from 'angular-datatables';
// import { NgxConfirmBoxModule,NgxConfirmBoxService } from 'ngx-confirm-box';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ApiInterceptorService } from '../Core/Api/Interceptor/api-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePickerFormatDirective } from '../DateSetting/DatePickerHR';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

import { HRRoutingModule } from './hr-routing.module';
import { EmployeesListComponent } from './Employees/employees-list/employees-list.component';
import { EmployeesComponent } from './Employees/employees/employees.component';
import { HrConfigurationComponent } from './HrConfiguration/hr-configuration/hr-configuration.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EmpPaymentsListComponent } from './Payments/emp-payments-list/emp-payments-list.component';
import { EmpPaymentsComponent } from './Payments/emp-payments/emp-payments.component';
import { CustodyCodesComponent } from './CustodyCodes/custody-codes/custody-codes.component';
import { CustodyCodesListComponent } from './CustodyCodes/custody-codes-list/custody-codes-list.component';
import { EvaluationGroupsComponent } from './EvaluationGroups/evaluation-groups/evaluation-groups.component';
import { EvaluationGroupsListComponent } from './EvaluationGroups/evaluation-groups-list/evaluation-groups-list.component';
import { AllowancesComponent } from './Allowances/allowances/allowances.component';
import { AllowancesListComponent } from './Allowances/allowances-list/allowances-list.component';
import { CertificateComponent } from './Certificates/certificate/certificate.component';
import { CertificatesListComponent } from './Certificates/certificates-list/certificates-list.component';
import { DeservedlyComponent } from './Deservedly/deservedly/deservedly.component';
import { DeservedlyListComponent } from './Deservedly/deservedly-list/deservedly-list.component';
import { PenaltiesListComponent } from './Penalties/penalties-list/penalties-list.component';
import { PenaltiesComponent } from './Penalties/penalties/penalties.component';
import { ViolationsComponent } from './Violations/violations/violations.component';
import { ViolationsListComponent } from './Violations/violations-list/violations-list.component';
import { SponsersComponent } from './Sponsers/sponsers/sponsers.component';
import { SponsersListComponent } from './Sponsers/sponsers-list/sponsers-list.component';
import { VisaComponent } from './VisaIssue/visa/visa.component';
import { VisaListComponent } from './VisaIssue/visa-list/visa-list.component';
import { IncometaxComponent } from './IncomTax/incometax/incometax.component';
import { IncometaxListComponent } from './IncomTax/incometax-list/incometax-list.component';
import { EmpClassListComponent } from './EmpClass/emp-class-list/emp-class-list.component';
import { EmpClassComponent } from './EmpClass/emp-class/emp-class.component';
import { EmpClassGroupComponent } from './EmpClassGroups/emp-class-group/emp-class-group.component';
import { EmpClassGroupListComponent } from './EmpClassGroups/emp-class-group-list/emp-class-group-list.component';
import { NationalityComponent } from './Nationality/nationality/nationality.component';
import { NationalityListComponent } from './Nationality/nationality-list/nationality-list.component';
import { PenalityAddComponent } from './Penality/penality-add/penality-add.component';
import { PenalityListComponent } from './Penality/penality-list/penality-list.component';
import { DeductionAddComponent } from './Deduction/deduction-add/deduction-add.component';
import { DeductionListComponent } from './Deduction/deduction-list/deduction-list.component';
import { DeductionAllownaceComponent } from './Deduction/deduction-allownace/deduction-allownace.component';
import { EmpContractListComponent } from './EmpContract/emp-contract-list/emp-contract-list.component';
import { EmpContractComponent } from './EmpContract/emp-contract/emp-contract.component';
import { DeservdlyTransComponent } from './DeservdlyTrans/deservdly-trans/deservdly-trans.component';
import { DeservdlyTransListComponent } from './DeservdlyTrans/deservdly-trans-list/deservdly-trans-list.component';
import { DeductionTransComponent } from './DeductionTrans/deduction-trans/deduction-trans.component';
import { DeductionTransListComponent } from './DeductionTrans/deduction-trans-list/deduction-trans-list.component';
import { EmpStatusComponent } from './EmployeStatus/emp-status/emp-status.component';
import { EmpStatusListComponent } from './EmployeStatus/emp-status-list/emp-status-list.component';
import { LoansTransComponent } from './LoansTrans/loans-trans/loans-trans.component';
import { LoansTransListComponent } from './LoansTrans/loans-trans-list/loans-trans-list.component';
import { ResumeWorkComponent } from './ResumeWork/resume-work/resume-work.component';
import { ResumeWorkListComponent } from './ResumeWork/resume-work-list/resume-work-list.component';
import { VacationRulesComponent } from './VacationRules/vacation-rules/vacation-rules.component';
import { VacationRulesListComponent } from './VacationRules/vacation-rules-list/vacation-rules-list.component';
import { DedcutionCategoryAddComponent } from './DeductionCat/dedcution-category-add/dedcution-category-add.component';
import { DedcutionCategoryListComponent } from './DeductionCat/dedcution-category-list/dedcution-category-list.component';
import { DeserveCatAddComponent } from './DeserveCat/deserve-cat-add/deserve-cat-add.component';
import { DeserveCatListComponent } from './DeserveCat/deserve-cat-list/deserve-cat-list.component';
import { VacationListComponent } from './Vacation/vacation-list/vacation-list.component';
import { VacationAddComponent } from './Vacation/vacation-add/vacation-add.component';
import { EmpMissionComponent } from './EmployeMissions/emp-mission/emp-mission.component';
import { EmpMissionListComponent } from './EmployeMissions/emp-mission-list/emp-mission-list.component';


@NgModule({
  declarations: [
    DatePickerFormatDirective,
    EmployeesListComponent,
    EmployeesComponent,
    HrConfigurationComponent,
    EmpPaymentsListComponent,
    EmpPaymentsComponent,
    CustodyCodesComponent,
    CustodyCodesListComponent,
    EvaluationGroupsComponent,
    EvaluationGroupsListComponent,
    AllowancesComponent,
    AllowancesListComponent,
    CertificateComponent,
    CertificatesListComponent,
    DeservedlyComponent,
    DeservedlyListComponent,
    PenaltiesListComponent,
    PenaltiesComponent,
    ViolationsComponent,
    ViolationsListComponent,
    SponsersComponent,
    SponsersListComponent,
    VisaComponent,
    VisaListComponent,
    IncometaxComponent,
    IncometaxListComponent,
    EmpClassListComponent,
    EmpClassComponent,
    EmpClassGroupComponent,
    EmpClassGroupListComponent,
    NationalityComponent,
    NationalityListComponent,
    PenalityAddComponent,
    PenalityListComponent,
    DeductionAddComponent,
    DeductionListComponent,
    DeductionAllownaceComponent,
    EmpContractListComponent,
    EmpContractComponent,
    DeservdlyTransComponent,
    DeservdlyTransListComponent,
    DeductionTransComponent,
    DeductionTransListComponent,
    EmpStatusComponent,
    EmpStatusListComponent,
    LoansTransComponent,
    LoansTransListComponent,
    ResumeWorkComponent,
    ResumeWorkListComponent,
    VacationRulesComponent,
    VacationRulesListComponent,
    DedcutionCategoryAddComponent,
    DedcutionCategoryListComponent,
    DeserveCatAddComponent,
    DeserveCatListComponent,
    VacationListComponent,
    VacationAddComponent,
    EmpMissionComponent,
    EmpMissionListComponent
  ],
  imports: [
    CommonModule,
    HRRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DataTablesModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    PaginationModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorService,multi: true}
  ]
})
export class HRModule { }
