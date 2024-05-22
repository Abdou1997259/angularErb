import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardServiceService } from '../_Guard/auth-guard-service.service';
import { FormsOperationGuard } from '../_Guard/forms-operation.guard';

import { EmployeesListComponent } from './Employees/employees-list/employees-list.component';
import { EmployeesComponent } from './Employees/employees/employees.component';
import { HrConfigurationComponent } from './HrConfiguration/hr-configuration/hr-configuration.component';
import { EmpPaymentsListComponent } from './Payments/emp-payments-list/emp-payments-list.component';
import { EmpPaymentsComponent } from './Payments/emp-payments/emp-payments.component';
import { CustodyCodesListComponent } from './CustodyCodes/custody-codes-list/custody-codes-list.component';
import { CustodyCodesComponent } from './CustodyCodes/custody-codes/custody-codes.component';
import { EvaluationGroupsListComponent } from './EvaluationGroups/evaluation-groups-list/evaluation-groups-list.component';
import { EvaluationGroupsComponent } from './EvaluationGroups/evaluation-groups/evaluation-groups.component';
import { AllowancesListComponent } from './Allowances/allowances-list/allowances-list.component';
import { AllowancesComponent } from './Allowances/allowances/allowances.component';
import { CertificatesListComponent } from './Certificates/certificates-list/certificates-list.component';
import { CertificateComponent } from './Certificates/certificate/certificate.component';
import { DeservedlyListComponent } from './Deservedly/deservedly-list/deservedly-list.component';
import { DeservedlyComponent } from './Deservedly/deservedly/deservedly.component';
import { PenaltiesListComponent } from './Penalties/penalties-list/penalties-list.component';
import { PenaltiesComponent } from './Penalties/penalties/penalties.component';
import { ViolationsListComponent } from './Violations/violations-list/violations-list.component';
import { ViolationsComponent } from './Violations/violations/violations.component';
import { SponsersListComponent } from './Sponsers/sponsers-list/sponsers-list.component';
import { SponsersComponent } from './Sponsers/sponsers/sponsers.component';
import { VisaListComponent } from './VisaIssue/visa-list/visa-list.component';
import { VisaComponent } from './VisaIssue/visa/visa.component';
import { IncometaxListComponent } from './IncomTax/incometax-list/incometax-list.component';
import { IncometaxComponent } from './IncomTax/incometax/incometax.component';
import { EmpClassComponent } from './EmpClass/emp-class/emp-class.component';
import { EmpClassListComponent } from './EmpClass/emp-class-list/emp-class-list.component';
import { EmpClassGroupListComponent } from './EmpClassGroups/emp-class-group-list/emp-class-group-list.component';
import { EmpClassGroupComponent } from './EmpClassGroups/emp-class-group/emp-class-group.component';
import { NationalityListComponent } from './Nationality/nationality-list/nationality-list.component';
import { NationalityComponent } from './Nationality/nationality/nationality.component';
import { PenalityListComponent } from './Penality/penality-list/penality-list.component';
import { PenalityAddComponent } from './Penality/penality-add/penality-add.component';
import { DeductionAddComponent } from './Deduction/deduction-add/deduction-add.component';
import { DeductionListComponent } from './Deduction/deduction-list/deduction-list.component';
import { EmpContractListComponent } from './EmpContract/emp-contract-list/emp-contract-list.component';
import { EmpContractComponent } from './EmpContract/emp-contract/emp-contract.component';
import { DeservdlyTransListComponent } from './DeservdlyTrans/deservdly-trans-list/deservdly-trans-list.component';
import { DeservdlyTransComponent } from './DeservdlyTrans/deservdly-trans/deservdly-trans.component';
import { DeductionTransListComponent } from './DeductionTrans/deduction-trans-list/deduction-trans-list.component';
import { DeductionTransComponent } from './DeductionTrans/deduction-trans/deduction-trans.component';
import { EmpStatusListComponent } from './EmployeStatus/emp-status-list/emp-status-list.component';
import { EmpStatusComponent } from './EmployeStatus/emp-status/emp-status.component';
import { LoansTransListComponent } from './LoansTrans/loans-trans-list/loans-trans-list.component';
import { LoansTransComponent } from './LoansTrans/loans-trans/loans-trans.component';
import { ResumeWorkListComponent } from './ResumeWork/resume-work-list/resume-work-list.component';
import { ResumeWorkComponent } from './ResumeWork/resume-work/resume-work.component';
import { VacationRulesListComponent } from './VacationRules/vacation-rules-list/vacation-rules-list.component';
import { VacationRulesComponent } from './VacationRules/vacation-rules/vacation-rules.component';
import { DedcutionCategoryAddComponent } from './DeductionCat/dedcution-category-add/dedcution-category-add.component';
import { DedcutionCategoryListComponent } from './DeductionCat/dedcution-category-list/dedcution-category-list.component';
import { DeserveCatAddComponent } from './DeserveCat/deserve-cat-add/deserve-cat-add.component';
import { DeserveCatListComponent } from './DeserveCat/deserve-cat-list/deserve-cat-list.component';
import { VacationAddComponent } from './Vacation/vacation-add/vacation-add.component';
import { VacationListComponent } from './Vacation/vacation-list/vacation-list.component';
import { EmpMissionListComponent } from './EmployeMissions/emp-mission-list/emp-mission-list.component';
import { EmpMissionComponent } from './EmployeMissions/emp-mission/emp-mission.component';

const routes: Routes = [
  { path: '', component:EmployeesComponent },
  { path: 'employee', component:EmployeesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/employeelist', op:'new'} },
  { path: 'editemployee/:id', component: EmployeesComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/employeelist', op:'edit'} },
  { path: 'employeelist', component:EmployeesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/employeelist',op:'list'} },
  { path: 'hrconfig', component: HrConfigurationComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/hrconfig', op:'new'} },
  { path: 'emppaymentlist', component:EmpPaymentsListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emppaymentlist',op:'list'} },
  { path: 'emppaymentadd', component:EmpPaymentsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emppaymentlist', op:'new'} },
  { path: 'emppaymentedit/:id', component: EmpPaymentsComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emppaymentlist', op:'edit'} },
  { path: 'custodycodeslist', component:CustodyCodesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/custodycodeslist',op:'list'} },
  { path: 'custodycodesadd', component:CustodyCodesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/custodycodeslist', op:'new'} },
  { path: 'custodycodesedit/:id', component: CustodyCodesComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/custodycodeslist', op:'edit'} },
  { path: 'evaluationgroupslist', component:EvaluationGroupsListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/evaluationgroupslist',op:'list'} },
  { path: 'evaluationgroupsadd', component:EvaluationGroupsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/evaluationgroupslist', op:'new'} },
  { path: 'evaluationgroupsedit/:id', component: EvaluationGroupsComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/evaluationgroupslist', op:'edit'} },
  { path: 'allowanceslist', component:AllowancesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/allowanceslist',op:'list'} },
  { path: 'allowanceadd', component:AllowancesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/allowanceslist', op:'new'} },
  { path: 'allowanceedit/:id', component: AllowancesComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/allowanceslist', op:'edit'} },
  { path: 'certificateslist', component:CertificatesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/certificateslist',op:'list'} },
  { path: 'certificateadd', component:CertificateComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/certificateslist', op:'new'} },
  { path: 'certificateedit/:id', component: CertificateComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/certificateslist', op:'edit'} },
  { path: 'deservedlylist', component:DeservedlyListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservedlylist',op:'list'} },
  { path: 'deservedlyadd', component:DeservedlyComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservedlylist', op:'new'} },
  { path: 'deservedlyedit/:id', component: DeservedlyComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservedlylist', op:'edit'} },
  { path: 'penaltieslist', component:PenaltiesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/penaltieslist',op:'list'} },
  { path: 'pentaladd', component:PenaltiesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/penaltieslist', op:'new'} },
  { path: 'pentaledit/:id', component: PenaltiesComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/penaltieslist', op:'edit'} },
  { path: 'violationslist', component:ViolationsListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/violationslist',op:'list'} },
  { path: 'violationadd', component:ViolationsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/violationslist', op:'new'} },
  { path: 'violationedit/:id', component: ViolationsComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/violationslist', op:'edit'} },
  { path: 'sponserslist', component:SponsersListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/sponserslist',op:'list'} },
  { path: 'sponseradd', component:SponsersComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/sponserslist', op:'new'} },
  { path: 'sponseredit/:id', component: SponsersComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/sponserslist', op:'edit'} },
  { path: 'visalist', component:VisaListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/visalist',op:'list'} },
  { path: 'visaadd', component:VisaComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/visalist', op:'new'} },
  { path: 'visaedit/:id', component: VisaComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/visalist', op:'edit'} },
  { path: 'incomtaxlist', component:IncometaxListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/incomtaxlist',op:'list'} },
  { path: 'incomtaxadd', component:IncometaxComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/incomtaxlist', op:'new'} },
  { path: 'incomtaxedit/:id', component: IncometaxComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/incomtaxlist', op:'edit'} },
  { path: 'empclass', component:  EmpClassListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/empclass',op:'list'} },
  { path: 'empclassadd', component:EmpClassComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/empclass', op:'new'} },
  { path: 'empclassedit/:id', component: EmpClassComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/empclass', op:'edit'} },
  { path: 'empclassgroup', component:  EmpClassGroupListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/empclassgroup',op:'list'} },
  { path: 'empclassgroupadd', component:EmpClassGroupComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/empclassgroup', op:'new'} },
  { path: 'empclassgroupedit/:id', component: EmpClassGroupComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/empclassgroup', op:'edit'} },
  { path: 'nationality', component:  NationalityListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/nationality',op:'list'} },
  { path: 'nationalityadd', component:NationalityComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/nationality', op:'new'} },
  { path: 'nationalityedit/:id', component: NationalityComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/nationality', op:'edit'} },
  { path: 'penality', component:  PenalityListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/penality',op:'list'} },
  { path: 'penalityadd', component:PenalityAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/penality', op:'new'} },
  { path: 'penalityedit/:id', component: PenalityAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/penality', op:'edit'} },
  { path: 'deduction', component:  DeductionListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : 'hr/deduction',op:'list'} },
  { path: 'deductionadd', component:DeductionAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : 'hr/deduction', op:'new'} },
  { path: 'deductionedit/:id', component: DeductionAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : 'hr/deduction', op:'edit'} },
  { path: 'emp-contract-list', component:  EmpContractListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-contract-list',op:'list'} },
  { path: 'emp-contract-add', component:EmpContractComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-contract-list', op:'new'} },
  { path: 'emp-contract-edit/:id', component: EmpContractComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-contract-list', op:'edit'} },
  { path: 'deservdly-trans-list', component:  DeservdlyTransListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservdly-trans-list',op:'list'} },
  { path: 'deservdly-trans-add', component:DeservdlyTransComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservdly-trans-list', op:'new'} },
  { path: 'deservdly-trans-edit/:id', component: DeservdlyTransComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservdly-trans-list', op:'edit'} },
  { path: 'deduction-trans-list', component:  DeductionTransListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deduction-trans-list',op:'list'} },
  { path: 'deduction-trans-add', component:DeductionTransComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deduction-trans-list', op:'new'} },
  { path: 'deduction-trans-edit/:id', component: DeductionTransComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deduction-trans-list', op:'edit'} },
  { path: 'emp-status-list', component:  EmpStatusListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-status-list',op:'list'} },
  { path: 'emp-status-add', component:EmpStatusComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-status-list', op:'new'} },
  { path: 'emp-status-edit/:id', component: EmpStatusComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-status-list', op:'edit'} },
  { path: 'loans-trans-list', component:  LoansTransListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/loans-trans-list',op:'list'} },
  { path: 'loans-trans-add', component:LoansTransComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/loans-trans-list', op:'new'} },
  { path: 'loans-trans-edit/:id', component: LoansTransComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/loans-trans-list', op:'edit'} },
  { path: 'resume-work-list', component:  ResumeWorkListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/resume-work-list',op:'list'} },
  { path: 'resume-work-add', component:ResumeWorkComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/resume-work-list', op:'new'} },
  { path: 'resume-work-edit/:id', component: ResumeWorkComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/resume-work-list', op:'edit'} },
  { path: 'vacation-rules-list', component: VacationRulesListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/vacation-rules-list',op:'list'} },
  { path: 'vacation-rules-add', component: VacationRulesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/vacation-rules-list', op:'new'} },
  { path: 'vacation-rules-edit/:id', component: VacationRulesComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/vacation-rules-list', op:'edit'} },
  { path: 'deductioncat', component:  DedcutionCategoryListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deductioncat',op:'list'} },
  { path: 'deductioncatadd', component:DedcutionCategoryAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deductioncat', op:'new'} },
  { path: 'deductioncatedit/:id', component: DedcutionCategoryAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deductioncat', op:'edit'} },
  { path: 'deservecat', component:  DeserveCatListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservecat',op:'list'} },
  { path: 'deservecatadd', component:DeserveCatAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservecat', op:'new'} },
  { path: 'deservecatedit/:id', component: DeserveCatAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/deservecat', op:'edit'} },
  { path: 'vacation', component:  VacationListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/vacation',op:'list'} },
  { path: 'vacationadd', component:VacationAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/vacation', op:'new'} },
  { path: 'vacationedit/:id', component: VacationAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/vacation', op:'edit'} },
  { path: 'emp-mission-list', component:  EmpMissionListComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-mission-list',op:'list'} },
  { path: 'emp-mission-add', component:EmpMissionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-mission-list', op:'new'} },
  { path: 'emp-mission-edit/:id', component: EmpMissionComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/hr/emp-mission-list', op:'edit'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRRoutingModule { }
