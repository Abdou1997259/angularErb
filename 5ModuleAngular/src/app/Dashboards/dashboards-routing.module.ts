import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ARComponent } from './ar/ar.component';
import { APComponent } from './ap/ap.component';
import { SCComponent } from './sc/sc.component';
import { FINComponent } from './fin/fin.component';
import { GLComponent } from './gl/gl.component';
import { SysComponent } from './sys/sys.component';
import { HrComponent } from './hr/hr.component';

const routes: Routes = [
  { path: '-1', component:SysComponent },
  { path: '1', component:GLComponent },
  { path: '2', component:SCComponent },
  { path: '3', component:ARComponent }, 
  { path: '4', component:APComponent },
  { path: '5', component:FINComponent },
  { path: '14', component:HrComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
