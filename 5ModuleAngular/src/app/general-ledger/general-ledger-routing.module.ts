import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountFormComponent } from './account-form/account-form.component';
import { JournalsComponent } from './journals/journals.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { AuthGuardServiceService } from '../_Guard/auth-guard-service.service';
import { FormsOperationGuard } from '../_Guard/forms-operation.guard';
import { ReportDetailsComponent } from './Reports/report-details/report-details.component';
import { ReportFiltersComponent } from './Reports/report-filters/report-filters.component';
import { ReportComponent } from './Reports/report/report.component';
import { AccountListTreeComponent } from './account-list-tree/account-list-tree.component';
import { AccountSetupComponent } from './account-settings/account-setup/account-setup.component';
import { GlCostCentersComponent } from './gl-cost-centers/gl-cost-centers.component';
import { AccountsTreeComponent } from './accounts-tree/accounts-tree.component';
import { CostcentersTreeComponent } from './costcenters-tree/costcenters-tree/costcenters-tree.component';
const routes: Routes = [

  { path: '', component:JournalsComponent },
  { path: 'journals', component:JournalsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/gl/journalslist', op:'new'} },
  { path: 'editjournal/:id', component: JournalsComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/gl/journalslist', op:'edit'} },
  { path: 'journalslist', component:JournalListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/gl/journalslist',op:'list'} },
  { path: 'accountsetup', component:AccountSetupComponent },
  { path: 'report/:id', component:ReportComponent },
  { path: 'report-details/:id1/:id2', component:ReportDetailsComponent },
  { path: 'report-filters/:id1/:id2', component:ReportFiltersComponent },
  { path: 'accounttree', component: AccountsTreeComponent },
  { path: 'costcentertree', component:CostcentersTreeComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralLedgerRoutingModule { }
