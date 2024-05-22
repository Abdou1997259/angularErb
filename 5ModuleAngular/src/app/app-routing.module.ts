import { SCModule } from './SC/sc.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrevComponent } from './Admin/prev/prev.component';
import { AddCustomerComponent } from './AR/add-customer/add-customer.component';
import { SaleschartsComponent } from './Charts/salescharts/salescharts.component';
import { CustomerComponent } from './customer/customer.component';
import { IndexFormComponent } from './DynamicForms/index-form/index-form.component';
import { MasterFormComponent } from './DynamicForms/master-form/master-form.component';
import { AuthGuardServiceService } from './_Guard/auth-guard-service.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ItemsComponent } from './SC/items/items.component';
import { CustomerProceduresComponent } from './customer/customer-procedures/customer-procedures.component';
import { FormsOperationGuard } from './_Guard/forms-operation.guard';
import { ReportsComponent } from './Reports/Reports.component';
import { UsersListComponent } from './Sys/Users/users-list/users-list.component';
import { CompaniesComponent } from './companies/companies.component';
import { LoginCompanyComponent } from './login-company/login-company.component';
import { ModulesComponent } from './modules/modules.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login/:Id/:year', component: LoginComponent  },
  { path: 'logincompany/:comp/:year', component: LoginCompanyComponent  },
  { path: 'comp', component: CompaniesComponent},
  { path: '', component: ModulesComponent ,canActivate:[AuthGuardServiceService] },
  { path: 'modules', component: ModulesComponent ,canActivate:[AuthGuardServiceService] },
  { path: 'Prev', component: PrevComponent  ,canActivate:[AuthGuardServiceService]},
  { path: 'home', component: HomeComponent ,canActivate:[AuthGuardServiceService] },
  { path: 'home/:id', component: HomeComponent ,canActivate:[AuthGuardServiceService] },
  { path: 'reports', component: ReportsComponent},
  { path: 'gl', loadChildren: () => import('src/app/general-ledger/general-ledger.module').then(m => m.GeneralLedgerModule)},
  { path: 'sc', loadChildren: () => import('src/app/SC/sc.module').then(m => m.SCModule)},
  { path: 'main', loadChildren: () => import('src/app/Main/main.module').then(m => m.MainModule) },
  { path: 'ar', loadChildren: () => import('src/app/AR/ar.module').then(m => m.ARModule) },
  { path: 'ap', loadChildren: () => import('src/app/AP/ap.module').then(m => m.APModule) },
  { path: 'fin', loadChildren: () => import('src/app/Fin/fin.module').then(m => m.FinModule) },
  { path: 'sys', loadChildren: () => import('src/app/Sys/sys.module').then(m => m.SysModule) },
  { path: 'dashboards', loadChildren: () => import('src/app/Dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'hr', loadChildren: () => import('src/app/HR/hr.module').then(m => m.HRModule) }
  
  // { path: 'customer', component: CustomerComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard], data : {formname : 'customer',op:'list'}},
  // { path: 'customerProcedures/:id', component: CustomerProceduresComponent ,canActivate:[AuthGuardServiceService] },
  // { path: 'addcustomer', component: AddCustomerComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard], data : {formname : 'customer',op:'new'}},
  // { path: 'addcustomer/:id', component: AddCustomerComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard], data : {  formname : 'customer',op:'edit'}},
  // { path: 'Salescharts', component: SaleschartsComponent  ,canActivate:[AuthGuardServiceService]},
  // { path: 'items', component: ItemsComponent ,canActivate:[AuthGuardServiceService] },
  // { path: 'masterform/:id', component: MasterFormComponent},
  // { path: 'masterform/:id/:key', component: MasterFormComponent},
  // { path: 'indexform/:id', component: IndexFormComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
