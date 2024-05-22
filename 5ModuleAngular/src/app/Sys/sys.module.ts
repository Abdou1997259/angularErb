import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SysRoutingModule } from './sys-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { DatePickerFormatDirective } from '../DateSetting/DatePickerSYS';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptorService } from '../Core/Api/Interceptor/api-interceptor.service';

import { CurrenciesComponent } from './Currencies/currencies/currencies.component';
import { CurrenciesListComponent } from './Currencies/currencies-list/currencies-list.component';
import { UserPrevComponent } from './Users/user-prev/user-prev.component';
import { UserComponent } from './Users/user/user.component';
import { UsersListComponent } from './Users/users-list/users-list.component';
import { UserAdditinalPrevComponent } from './Users/user-additinal-prev/user-additinal-prev.component';
import { BranchListComponent } from './Branches/branch-list/branch-list.component';
import { BranchAddComponent } from './Branches/branch-add/branch-add.component';

@NgModule({
  declarations: [
    CurrenciesComponent,
    CurrenciesListComponent,
    UserPrevComponent,
    UserComponent,
    UsersListComponent,
    DatePickerFormatDirective,
    UserAdditinalPrevComponent,
    BranchListComponent,
    BranchAddComponent
  ],
  imports: [
    CommonModule,
    SysRoutingModule,
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
export class SysModule { }
