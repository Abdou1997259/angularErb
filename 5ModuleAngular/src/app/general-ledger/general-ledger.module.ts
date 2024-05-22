import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralLedgerRoutingModule } from './general-ledger-routing.module';
import { AccountFormComponent } from './account-form/account-form.component';
import { JournalsComponent } from './journals/journals.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataTablesModule } from 'angular-datatables';
import { NgxConfirmBoxModule,NgxConfirmBoxService } from 'ngx-confirm-box';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { JournalListComponent } from './journal-list/journal-list.component';
import { AccountLevelsComponent } from './account-settings/account-levels/account-levels.component';
import { AccountSetupComponent } from './account-settings/account-setup/account-setup.component';
import { CostcentersLevelsComponent } from './account-settings/costcenters-levels/costcenters-levels.component';
import { AccountListTreeComponent } from './account-list-tree/account-list-tree.component';
import { GlCostCentersComponent } from './gl-cost-centers/gl-cost-centers.component';
import { ReportComponent } from './Reports/report/report.component';
import { ReportDetailsComponent } from './Reports/report-details/report-details.component';
import { ReportFiltersComponent } from './Reports/report-filters/report-filters.component';
import { ApiInterceptorService } from '../Core/Api/Interceptor/api-interceptor.service';
import {HTTP_INTERCEPTORS } from '@angular/common/http';
import { CostcentersTreeComponent } from './costcenters-tree/costcenters-tree/costcenters-tree.component';

import { DatePickerFormatDirective } from '../DateSetting/DatePickerGL';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { AccountsTreeComponent } from './accounts-tree/accounts-tree.component';
import { LookUpComponent } from '../Controls/look-up-gl/look-up-gl.component';

@NgModule({
  declarations: [
    AccountFormComponent,
    JournalsComponent,
    JournalListComponent,
    AccountLevelsComponent,
    AccountSetupComponent,
    CostcentersLevelsComponent,
    AccountListTreeComponent,
    GlCostCentersComponent,
    ReportComponent,
    ReportDetailsComponent,
    ReportFiltersComponent,
    DatePickerFormatDirective,
    AccountsTreeComponent,
    CostcentersTreeComponent,
    LookUpComponent
  ],
  imports: [
    CommonModule,
    GeneralLedgerRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DataTablesModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    PaginationModule
  ],
  providers: [
   {provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorService,multi: true}
  ]
})
export class GeneralLedgerModule { }
