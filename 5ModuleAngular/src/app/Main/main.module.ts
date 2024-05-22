import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './main-routing.module';
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
import { LoginComponent } from './Login/login.component';
import { SubscribeComponent } from './Subscribe/subscribe.component';
import { ConfirmedComponent } from './confirmed/confirmed.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { AdduserComponent } from './adduser/adduser.component';

@NgModule({
  declarations: [
    LoginComponent,
    SubscribeComponent,
    ConfirmedComponent,
    RequestsListComponent,
    AdduserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DataTablesModule,
    MaterialModule,
    SharedModule,
    FormsModule
  ]
})
export class MainModule { }
