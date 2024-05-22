import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptorService } from '../Core/Api/Interceptor/api-interceptor.service';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { ARComponent } from './ar/ar.component';
import { APComponent } from './ap/ap.component';
import { SCComponent } from './sc/sc.component';
import { FINComponent } from './fin/fin.component';
import { GLComponent } from './gl/gl.component';
import { SysComponent } from './sys/sys.component';
import { HrComponent } from './hr/hr.component';


@NgModule({
  declarations: [
    ARComponent,
    APComponent,
    SCComponent,
    FINComponent,
    GLComponent,
    SysComponent,
    HrComponent
  ],
  imports: [
    CommonModule,
    DashboardsRoutingModule,
    HttpClientModule,
    NgxChartsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorService,multi: true}
  ]
})
export class DashboardsModule { }
