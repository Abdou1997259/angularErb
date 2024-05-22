import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ARRoutingModule } from './ar-routing.module';
import { SalesComponent } from './SalesInvoice/sales/sales.component';
import { SalesListComponent } from './SalesInvoice/sales-list/sales-list.component';
import { ApiInterceptorService } from '../Core/Api/Interceptor/api-interceptor.service';
import {HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataTablesModule } from 'angular-datatables';
import { NgxConfirmBoxModule,NgxConfirmBoxService } from 'ngx-confirm-box';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { MaterialModule } from '../material/material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { SalesReturnesListComponent } from './SalesReturnes/sales-returnes-list/sales-returnes-list.component';
import { SalesReturnesAddComponent } from './SalesReturnes/sales-returnes-add/sales-returnes-add.component';
import { CustomerBalanceListComponent } from './CustomerBalance/customer-balance-list/customer-balance-list.component';
import { CustomerBalanceAddComponent } from './CustomerBalance/customer-balance-add/customer-balance-add.component';
import { CustomerSalesOrderListComponent } from './CustomerSalesOrder/customer-sales-order-list/customer-sales-order-list.component';
import { CustomerSalesOrderAddComponent } from './CustomerSalesOrder/customer-sales-order-add/customer-sales-order-add.component';
import { CustomerQuotationListComponent } from './CustomerQuotations/customer-quotation-list/customer-quotation-list.component';
import { CustomerQuotationAddComponent } from './CustomerQuotations/customer-quotation-add/customer-quotation-add.component';
import { DatePickerFormatDirective } from '../DateSetting/DatePickerAR';
import { RequestListComponent } from './RequestOrder/request-list/request-list.component';
import { RequestOrderComponent } from './RequestOrder/request-order/request-order.component';
import { SalesConfigurationComponent } from './sales-configuration/sales-configuration.component';
import { SalesmenListComponent } from './Salesmen/salesmen-list/salesmen-list.component';
import { SalesmenAddComponent } from './Salesmen/salesmen-add/salesmen-add.component';
import { CustomersListComponent } from './Customers/customers-list/customers-list.component';
import { CustomerAddComponent } from './Customers/customer-add/customer-add.component';
import { CustomerIndustryListComponent } from './CustomerIndustries/customer-industry-list/customer-industry-list.component';
import { CustomerIndustryAddComponent } from './CustomerIndustries/customer-industry-add/customer-industry-add.component';
import { SalesDirectionComponent } from './sales-direction/sales-direction.component';
import { CustomerClassesListComponent } from './CustomerClasses/customer-classes-list/customer-classes-list.component';
import { CustomerClassesAddComponent } from './CustomerClasses/customer-classes-add/customer-classes-add.component';
import { CustomerTypesListComponent } from './CustomerTypes/customer-types-list/customer-types-list.component';
import { CustomerTypesAddComponent } from './CustomerTypes/customer-types-add/customer-types-add.component';
import { SalesDirectionAddComponent } from './sales-direction/sales-direction-add/sales-direction-add.component';
import { ArResturantBill2AddComponent } from './Resturants/ar-resturant-bill2-add/ar-resturant-bill2-add.component';
import { ArShiftListComponent } from './Shifts/ar-shift-list/ar-shift-list.component';
import { ArShiftAddComponent } from './Shifts/ar-shift-add/ar-shift-add.component';
import { PricelistListComponent } from './PriceList/pricelist-list/pricelist-list.component';
import { PricelistAddComponent } from './PriceList/pricelist-add/pricelist-add.component';
import { ItemsTypeComponent } from './PriceList/popUps/items-type/items-type.component';
import { ItemGroupComponent } from './PriceList/popUps/item-group/item-group.component';
import { LookUpComponent } from '../Controls/look-up-ar/look-up-ar.component';
import { ItemsSalesorderLkpComponent } from '../Controls/items-salesorder-lkp/items-salesorder-lkp.component';

@NgModule({
  declarations: [
    SalesComponent,
    SalesListComponent,
    SalesReturnesAddComponent,
    SalesReturnesListComponent,
    SalesReturnesAddComponent,
    CustomerBalanceListComponent,
    CustomerBalanceAddComponent,
    CustomerSalesOrderListComponent,
    CustomerSalesOrderAddComponent,
    CustomerQuotationListComponent,
    CustomerQuotationAddComponent,
    DatePickerFormatDirective,
    RequestListComponent,
    RequestOrderComponent,
    SalesConfigurationComponent,
    SalesmenListComponent,
    SalesmenAddComponent,
    CustomersListComponent,
    CustomerAddComponent,
    CustomerIndustryListComponent,
    CustomerIndustryAddComponent,
    SalesDirectionComponent,
    CustomerClassesListComponent,
    CustomerClassesAddComponent,
    CustomerTypesListComponent,
    CustomerTypesAddComponent,
    SalesDirectionAddComponent,
    ArResturantBill2AddComponent,
    ArShiftListComponent,
    ArShiftAddComponent,
    PricelistListComponent, 
    PricelistAddComponent,
    ItemsTypeComponent,
    ItemGroupComponent,
    LookUpComponent,
    ItemsSalesorderLkpComponent
  ],
  imports: [
    CommonModule,
    ARRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    DataTablesModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    PaginationModule,
    NgMultiSelectDropDownModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorService,multi: true}
   ]
})
export class ARModule { }
