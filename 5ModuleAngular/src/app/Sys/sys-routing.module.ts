import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrenciesComponent } from './Currencies/currencies/currencies.component';
import { CurrenciesListComponent } from './Currencies/currencies-list/currencies-list.component';
import { AuthGuardServiceService } from '../_Guard/auth-guard-service.service';
import { FormsOperationGuard } from '../_Guard/forms-operation.guard';
import { UserComponent } from '../Sys/Users/user/user.component';
import { UsersListComponent } from '../Sys/Users/users-list/users-list.component';
import { UserPrevComponent } from '../Sys/Users/user-prev/user-prev.component';
import { UserAdditinalPrevComponent } from './Users/user-additinal-prev/user-additinal-prev.component';
import { BranchAddComponent } from './Branches/branch-add/branch-add.component';
import { BranchListComponent } from './Branches/branch-list/branch-list.component';

const routes: Routes = [
  
  { path: '', component:CurrenciesComponent },
  { path: 'currency', component:CurrenciesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/currencylist', op:'new'} },
  { path: 'editcurrency/:id', component: CurrenciesComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/currencylist', op:'edit'} },
  { path: 'currencylist', component:CurrenciesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/currencylist',op:'list'} },
  { path: 'user', component:UserComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/userslist', op:'new'} },
  { path: 'edituser/:id', component: UserComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/userslist', op:'edit'}  },
  { path: 'userslist', component:UsersListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/userslist', op:'list'} },
  { path: 'branchList', component: BranchListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/branchList', op:'list'}  },
  { path: 'branchListAdd', component:BranchAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/branchList', op:'new'} },
  { path: 'branchListEdit/:id', component:BranchAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/branchList', op:'edit'} },
  { path: 'userprev/:id', component:UserPrevComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/userslist', op:'new'} },
  { path: 'useraddtinaladd/:id',component:UserAdditinalPrevComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sys/userslist', op:'new'}}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
