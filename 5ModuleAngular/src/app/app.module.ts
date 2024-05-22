import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule  ,FormsModule  } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CustomerComponent } from './customer/customer.component';
import { AddCustomerComponent } from './AR/add-customer/add-customer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { SaleschartsComponent } from './Charts/salescharts/salescharts.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './_Services/user.service';
import { AuthGuardServiceService } from './_Guard/auth-guard-service.service';
import { DataSharingService } from './_Services/General/data-sharing.service';
import { LoaderComponent } from './loader/loader.component';
import { PrevComponent } from './Admin/prev/prev.component';
import { MasterFormComponent } from './DynamicForms/master-form/master-form.component';
import { CommonModule } from '@angular/common';
import { IndexFormComponent } from './DynamicForms/index-form/index-form.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxConfirmBoxModule,NgxConfirmBoxService } from 'ngx-confirm-box';
import { ProcedurePopUpComponent } from './customer/procedure-pop-up/procedure-pop-up.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CustomerProceduresComponent } from './customer/customer-procedures/customer-procedures.component';
import { ItemsLookUpComponent } from './Controls/items-look-up/items-look-up.component';
import { MaterialModule } from './material/material.module';
import { CustomersLookupComponent } from './Controls/customers-lookup/customers-lookup.component';
import { BaseComponent } from './base/base.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReportsComponent } from './Reports/Reports.component';
import { SharedModule } from './shared/shared.module';
import { JournalTypesLookupComponent } from './Controls/journal-types-lookup/journal-types-lookup.component';
import { CurrencyLookupComponent } from './Controls/currency-lookup/currency-lookup.component';
import { AccountsLookupComponent } from './Controls/accounts-lookup/accounts-lookup.component';
import { CostcentersLookupComponent } from './Controls/costcenters-lookup/costcenters-lookup.component';
import { GlCostCentersLookupComponent } from './Controls/gl-cost-centers-lookup/gl-cost-centers-lookup.component';
import { CompaniesComponent } from './companies/companies.component';
import { LoginCompanyComponent } from './login-company/login-company.component';
import { ApiInterceptorService } from './Core/Api/Interceptor/api-interceptor.service';
import {HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmpPopUpComponent } from './SC/stores/emp-pop-up/emp-pop-up.component';
import { ModulesComponent } from './modules/modules.component';
import { ItemsdetailsLookUpComponent } from './Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { UnitsLookUpComponent } from './Controls/units-look-up/units-look-up.component';
import { StoresLookUpComponent } from './Controls/stores-look-up/stores-look-up.component';
import { GornalLookUpComponent } from './Controls/gornal-look-up/gornal-look-up.component';
import { RelatedAccountsLookUpComponent } from './Controls/related-accounts-look-up/related-accounts-look-up.component';
import { TransSourceTypesComponent } from './DynamicForms/trans-source-types/trans-source-types.component';
import { PopUpComponent } from './SC/exporting-transactions/pop-up/pop-up.component';
import { UnitPopUpComponent} from './SC/exporting-transactions/unit-pop-up/unit-pop-up.component';
import { ItemsPopUpComponent} from './SC/exporting-transactions/items-pop-up/items-pop-up.component';
import {StoresPopUpComponent} from './SC/exporting-transactions/stores-pop-up/stores-pop-up.component';
import { UnitMeasurmentsComponent } from './Controls/unit-measurments/unit-measurments.component';
import { StoresLookupComponent } from './Controls/stores-lookup/stores-lookup.component';
import { AgGridModule } from 'ag-grid-angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ExpensesLkpComponent } from './Controls/expenses-lkp/expenses-lkp.component';
import { CurrenciesLkpComponent } from './Controls/currencies-lkp/currencies-lkp.component';
import { SuppliersLkpComponent } from './Controls/suppliers-lkp/suppliers-lkp.component';
import { RealatedAccountsLkpComponent } from './Controls/realated-accounts-lkp/realated-accounts-lkp.component';
import { PurchaseCostcentersLkpComponent } from './Controls/purchase-costcenters-lkp/purchase-costcenters-lkp.component';
import { SearchSuppliersDirLkpComponent } from './Controls/search-suppliers-dir-lkp/search-suppliers-dir-lkp.component';
import { SuppliersTypesLkpComponent } from './Controls/suppliers-types-lkp/suppliers-types-lkp.component';
import { CostCentersLkpComponent } from './Controls/cost-centers-lkp/cost-centers-lkp.component';

import { ItemGeneralPopupComponent } from './Controls/item-general-popup/item-general-popup.component';
import { StoreLookupComponent } from './Controls/store-lookup/store-lookup.component';
import { CustomersLkpComponent } from './Controls/customers-lkp/customers-lkp.component';
import { SalersLkpComponent } from './Controls/salers-lkp/salers-lkp.component';
import { DataSharingSenderService } from './_Services/General/data-sharing-sender';
import { SourceLkpComponent } from './Controls/source-lkp/source-lkp.component';
import { BankBranchesLkpComponent } from './Controls/bank-branches-lkp/bank-branches-lkp.component';
import { CashesLkpComponent } from './Controls/cashes-lkp/cashes-lkp.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { DatePickerFormatDirective } from './DateSetting/DatePicker';
import { ItemsalesLookupComponent } from './Controls/itemsales-lookup/itemsales-lookup.component';
import { CreditCardTypesLkpComponent } from './Controls/credit-card-types-lkp/credit-card-types-lkp.component';
import { CalculatorLKPComponent } from './Controls/calculator-lkp/calculator-lkp.component';
import { ResturantInvoice2BillComponent } from './Controls/ResturantInvoice2Bill/resturant-invoice2-bill/resturant-invoice2-bill.component';
import { PassenterLkpComponent } from './Controls/passenter-lkp/passenter-lkp.component';
import { SalersComponent } from './Controls/SalersShift/salers/salers.component';
import { CashesComponent } from './Controls/CashesTypes/cashes/cashes.component';
import { JobLkpComponent } from './Controls/job-lkp/job-lkp.component';
import { NationalityLkpComponent } from './Controls/nationality-lkp/nationality-lkp.component';
import { AllowancesLkpComponent } from './Controls/allowances-lkp/allowances-lkp.component';
import { EmployeeLkpComponent } from './Controls/employee-lkp/employee-lkp.component';
import { ItemPriceListLKPComponent } from './Controls/item-price-list-lkp/item-price-list-lkp.component';
import { ItemsDetailsSalesReturnsComponent } from './Controls/items-details-sales-returns/items-details-sales-returns.component';
import { ItemsQuotationsComponent } from './Controls/items-quotations/items-quotations.component';
import { ItemsRecieveComponent } from './Controls/items-recieve/items-recieve.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CustomerComponent,
    AddCustomerComponent,
    SaleschartsComponent,
    LoginComponent,
    LoaderComponent,    
    PrevComponent,
    MasterFormComponent,
    IndexFormComponent,
    ProcedurePopUpComponent,
    CustomerProceduresComponent,
    ItemsLookUpComponent,
    CustomersLookupComponent,
    BaseComponent,
    ReportsComponent,
    JournalTypesLookupComponent,
    CurrencyLookupComponent,
    AccountsLookupComponent,
    CostcentersLookupComponent,
    GlCostCentersLookupComponent,
    CompaniesComponent,
    LoginCompanyComponent,
    EmpPopUpComponent,
    ModulesComponent,
    ItemsdetailsLookUpComponent,
    UnitsLookUpComponent,
    StoresLookUpComponent,
    GornalLookUpComponent,
    RelatedAccountsLookUpComponent,
    TransSourceTypesComponent,
    PopUpComponent,
    UnitPopUpComponent,
    ItemsPopUpComponent,
    StoresPopUpComponent,
    UnitMeasurmentsComponent,
    StoresLookupComponent,
    ExpensesLkpComponent,
    CurrenciesLkpComponent,
    SuppliersLkpComponent,
    RealatedAccountsLkpComponent,
    PurchaseCostcentersLkpComponent,
    SearchSuppliersDirLkpComponent,
    SuppliersTypesLkpComponent,
    ExpensesLkpComponent,
    CostCentersLkpComponent,
    ItemGeneralPopupComponent,
    StoreLookupComponent,
    CustomersLkpComponent,
    SalersLkpComponent,
    SourceLkpComponent,
    BankBranchesLkpComponent,
    CashesLkpComponent,
    DatePickerFormatDirective,
    ItemsalesLookupComponent,
    CreditCardTypesLkpComponent,
    CalculatorLKPComponent,
    ResturantInvoice2BillComponent,
    PassenterLkpComponent,
    SalersComponent,
    CashesComponent,
    JobLkpComponent,
    NationalityLkpComponent,
    AllowancesLkpComponent,
    EmployeeLkpComponent,
    ItemPriceListLKPComponent,
    ItemsDetailsSalesReturnsComponent,
    ItemsQuotationsComponent,
    ItemsRecieveComponent
   ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DataTablesModule,
    MaterialModule,
    NgxConfirmBoxModule,
    AgGridModule,
    PaginationModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right'
    }),
    NgxChartsModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    UserService,
    AuthGuardServiceService,
    DataSharingService,
    NgxConfirmBoxService,
    DataSharingSenderService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
  ,entryComponents: [ProcedurePopUpComponent,ItemsLookUpComponent,CustomersLookupComponent, ExpensesLkpComponent, CurrenciesLkpComponent]
})
export class AppModule { 

}
  
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
//return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
