import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { SubscribeComponent } from './Subscribe/subscribe.component';
import { ConfirmedComponent } from './confirmed/confirmed.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { AdduserComponent } from './adduser/adduser.component';

const routes: Routes = [ 
  { path: 'nlogin', component:LoginComponent },
  { path: 'subscribe', component:SubscribeComponent },
  { path: 'confirmed', component:ConfirmedComponent },
  { path: 'subrequests', component:RequestsListComponent },
  { path: 'adduser', component:AdduserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
