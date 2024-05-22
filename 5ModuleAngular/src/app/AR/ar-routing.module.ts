import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './SalesInvoice/sales/sales.component';
import { SalesListComponent } from './SalesInvoice/sales-list/sales-list.component';
import { AuthGuardServiceService } from '../_Guard/auth-guard-service.service';
import { FormsOperationGuard } from '../_Guard/forms-operation.guard';
import { SalesConfigurationComponent } from './sales-configuration/sales-configuration.component';
import { SalesReturnesListComponent } from './SalesReturnes/sales-returnes-list/sales-returnes-list.component';
import { SalesReturnesAddComponent } from './SalesReturnes/sales-returnes-add/sales-returnes-add.component';
import { CustomerBalanceListComponent } from './CustomerBalance/customer-balance-list/customer-balance-list.component';
import { CustomerBalanceAddComponent } from './CustomerBalance/customer-balance-add/customer-balance-add.component';
import { CustomerSalesOrderListComponent } from './CustomerSalesOrder/customer-sales-order-list/customer-sales-order-list.component';
import { CustomerSalesOrderAddComponent } from './CustomerSalesOrder/customer-sales-order-add/customer-sales-order-add.component';
import { CustomerQuotationListComponent } from './CustomerQuotations/customer-quotation-list/customer-quotation-list.component';
import { CustomerQuotationAddComponent } from './CustomerQuotations/customer-quotation-add/customer-quotation-add.component';
import { RequestOrderComponent } from './RequestOrder/request-order/request-order.component';
import { RequestListComponent } from './RequestOrder/request-list/request-list.component';
import { SalesmenListComponent } from './Salesmen/salesmen-list/salesmen-list.component';
import { SalesmenAddComponent } from './Salesmen/salesmen-add/salesmen-add.component';
import { CustomersListComponent } from './Customers/customers-list/customers-list.component';
import { CustomerAddComponent } from './Customers/customer-add/customer-add.component';
import { SalesDirectionComponent } from './sales-direction/sales-direction.component';
import { CustomerIndustryListComponent } from './CustomerIndustries/customer-industry-list/customer-industry-list.component';
import { CustomerIndustryAddComponent } from './CustomerIndustries/customer-industry-add/customer-industry-add.component';
import { CustomerClassesListComponent } from './CustomerClasses/customer-classes-list/customer-classes-list.component';
import { CustomerClassesAddComponent } from './CustomerClasses/customer-classes-add/customer-classes-add.component';
import { CustomerTypesListComponent } from './CustomerTypes/customer-types-list/customer-types-list.component';
import { CustomerTypesAddComponent } from './CustomerTypes/customer-types-add/customer-types-add.component';
import { SalesDirectionAddComponent } from './sales-direction/sales-direction-add/sales-direction-add.component';
import { ArResturantBill2AddComponent } from './Resturants/ar-resturant-bill2-add/ar-resturant-bill2-add.component';
import { ArShiftListComponent } from './Shifts/ar-shift-list/ar-shift-list.component';
import { ArShiftAddComponent } from './Shifts/ar-shift-add/ar-shift-add.component';
import { PricelistAddComponent } from './PriceList/pricelist-add/pricelist-add.component';
import { PricelistListComponent } from './PriceList/pricelist-list/pricelist-list.component';


const routes: Routes = [
  { path: '', component:SalesComponent },
  { path: 'salesInvoice', component:SalesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesinvoicelist', op:'new'} },
  { path: 'editsalesInvoice/:id', component: SalesComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesinvoicelist', op:'edit'} },
  { path: 'salesinvoicelist', component:SalesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesinvoicelist',op:'list'} },
  { path: 'salesReturnesList', component:SalesReturnesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesReturnesList', op:'new'} },
  { path: 'salesReturnesAdd', component:SalesReturnesAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesReturnesList',op:'list'} },
  { path: 'salesReturnesEdit/:id', component: SalesReturnesAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesReturnesList', op:'edit'} },
  { path: 'customerBalanceList', component:CustomerBalanceListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerBalanceList', op:'list'} },
  { path: 'customerBalanceAdd', component:CustomerBalanceAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerBalanceList',op:'new'} },
  { path: 'customerBalanceEdit/:id', component: CustomerBalanceAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerBalanceList', op:'edit'} },
  { path: 'customerSalesOrderList', component:CustomerSalesOrderListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerSalesOrderList', op:'list'} },
  { path: 'customerSalesOrderAdd', component:CustomerSalesOrderAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerSalesOrderList',op:'new'} },
  { path: 'customerSalesOrderEdit/:id', component: CustomerSalesOrderAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerSalesOrderList', op:'edit'} },
  { path: 'customerQuotationList', component:CustomerQuotationListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerQuotationList', op:'list'} },
  { path: 'customerQuotationAdd', component:CustomerQuotationAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerQuotationList',op:'new'} },
  { path: 'customerQuotationEdit/:id', component: CustomerQuotationAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerQuotationList', op:'edit'} },
  { path: 'requestOrder', component:RequestOrderComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/requestorderlist', op:'new'} },
  { path: 'editrequestOrder/:id', component: RequestOrderComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/requestorderlist', op:'edit'} },
  { path: 'requestorderlist', component:RequestListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/requestorderlist',op:'list'} },
  { path: 'salesConfiguartion', component:SalesConfigurationComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesConfiguartion',op:'new'} },
  { path: 'salesmenList', component:SalesmenListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesmenList',op:'list'} },
  { path: 'salesmenAdd', component:SalesmenAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesmenList',op:'new'} },
  { path: 'salesmenEdit/:id', component: SalesmenAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesmenList', op:'edit'} },
  { path: 'customersList', component:CustomersListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customersList',op:'list'} },
  { path: 'customerAdd', component:CustomerAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customersList',op:'new'} },
  { path: 'customerEdit/:id', component: CustomerAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customersList', op:'edit'} },
  { path: 'salesDirection', component:SalesDirectionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesDirection',op:'new'} },
  { path: 'customerIndustryList', component:CustomerIndustryListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerIndustryList',op:'list'} },
  { path: 'customerIndustryAdd', component:CustomerIndustryAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerIndustryList',op:'new'} },
  { path: 'customerIndustryEdit/:id', component: CustomerIndustryAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerIndustryList', op:'edit'} },
  { path: 'customerClassesList', component:CustomerClassesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerClassesList',op:'list'} },
  { path: 'customerClassAdd', component:CustomerClassesAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerClassesList',op:'new'} },
  { path: 'customerClassEdit/:id', component: CustomerClassesAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerClassesList', op:'edit'} },
  { path: 'customerTypesList', component:CustomerTypesListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerTypesList',op:'list'} },
  { path: 'customerTypesAdd', component:CustomerTypesAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerTypesList',op:'new'} },
  { path: 'customerTypesEdit/:id', component: CustomerTypesAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/customerTypesList', op:'edit'} },
  { path: 'salesDirection', component:SalesDirectionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesDirection',op:'list'} },
  { path: 'salesDirectionAdd', component:SalesDirectionAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesDirection',op:'new'} },
  { path: 'salesDirectionEdit/:id', component:SalesDirectionAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/salesDirection',op:'edit'} },
  { path: 'resturantbill2add/:id/:salerId/:salerName', component:ArResturantBill2AddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/resturantbill2add',op:'new'} },
  { path: 'shiftslst', component:ArShiftListComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/shiftslst',op:'list'} },
  { path: 'shiftsadd', component:ArShiftAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/shiftslst',op:'new'} },
  { path: 'shiftsedit/:id', component:ArShiftAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/shiftslst',op:'edit'} },
  { path: 'priceList', component:PricelistListComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/priceList',op:'list'} },
  { path: 'priceListAdd', component:PricelistAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/priceList',op:'new'} },
  { path: 'priceListEdit/:id', component:PricelistAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ar/priceList',op:'edit'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ARRoutingModule { }
