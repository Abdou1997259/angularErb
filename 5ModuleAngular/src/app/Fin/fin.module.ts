import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SharedModule } from '../shared/shared.module';
import { ApiInterceptorService } from '../Core/Api/Interceptor/api-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DatePickerFormatDirective } from '../DateSetting/DatePickerFIN';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { FinRoutingModule } from './fin-routing.module';
import { RevenueComponent } from './Revenues/revenue/revenue.component';
import { RevenueListComponent } from './Revenues/revenue-list/revenue-list.component';
import { FinMultiTransListComponent } from './MultiTrans/fin-multi-trans-list/fin-multi-trans-list.component';
import { FinMultiTransAddComponent } from './MultiTrans/fin-multi-trans-add/fin-multi-trans-add.component';
import { RevenuemultiComponent } from './RevenuesMulti/revenuemulti/revenuemulti.component';
import { RevenuemultiListComponent } from './RevenuesMulti/revenuemulti-list/revenuemulti-list.component';
import { CashCodeListComponent } from './Cash/cash-code-list/cash-code-list.component';
import { CashCodeAddComponent } from './Cash/cash-code-add/cash-code-add.component';
import { CashTypeListComponent } from './CashType/cash-type-list/cash-type-list.component';
import { CashTypeAddComponent } from './CashType/cash-type-add/cash-type-add.component';
import { BankBranchListComponent } from './BankBranches/bank-branch-list/bank-branch-list.component';
import { BankBranchAddComponent } from './BankBranches/bank-branch-add/bank-branch-add.component';
import { PaymentTransListComponent } from './PaymentTrans/payment-trans-list/payment-trans-list.component';
import { PaymentTransAddComponent } from './PaymentTrans/payment-trans-add/payment-trans-add.component';
import { MultiPaymentTransListComponent } from './MultiPaymentTrans/multi-payment-trans-list/multi-payment-trans-list.component';
import { MultiPaymentTransAddComponent } from './MultiPaymentTrans/multi-payment-trans-add/multi-payment-trans-add.component';
import { BankOpeningBalanceListComponent } from './BanckOpeningBalance/bank-opening-balance-list/bank-opening-balance-list.component';
import { BankOpeningBalanceAddComponent } from './BanckOpeningBalance/bank-opening-balance-add/bank-opening-balance-add.component';
import { CasheOpeningBalanceListComponent } from './CasheOpeningBalance/cashe-opening-balance-list/cashe-opening-balance-list.component';
import { CasheOpeningBalanceAddComponent } from './CasheOpeningBalance/cashe-opening-balance-add/cashe-opening-balance-add.component';
import { LoadInvoicesComponent } from './Invoices/load-invoices/load-invoices.component';
import { CustodyExchangeListComponent } from './CustodyExchange/custody-exchange-list/custody-exchange-list.component';
import { CustodyExchangeComponent } from './CustodyExchange/custody-exchange/custody-exchange.component';
import { FinConfigurationComponent } from './fin-configuration/fin-configuration.component';
import { OutgoingCashTransferListComponent } from './OutGoingCashTransfer/outgoing-cash-transfer-list/outgoing-cash-transfer-list.component';
import { OutgoingCashTransferAddComponent } from './OutGoingCashTransfer/outgoing-cash-transfer-add/outgoing-cash-transfer-add.component';
import { FinancialMultiCashTransAddComponent } from './FinancialMultiTransactionCash/financial-multi-cash-trans-add/financial-multi-cash-trans-add.component';
import { FinancialMultitranscashListComponent } from './FinancialMultiTransactionCash/financial-multitranscash-list/financial-multitranscash-list.component';
import { MainBankListComponent } from './MainBanks/main-bank-list/main-bank-list.component';
import { MainBankAddComponent } from './MainBanks/main-bank-add/main-bank-add.component';
import { LookUpComponent } from '../Controls/look-up-fin/look-up-fin.component';

@NgModule({
  declarations: [
    DatePickerFormatDirective,
    RevenueComponent,
    RevenueListComponent,
    FinMultiTransListComponent,
    FinMultiTransAddComponent,
    RevenuemultiComponent,
    RevenuemultiListComponent,
    CashCodeListComponent,
    CashCodeAddComponent,
    CashTypeListComponent,
    CashTypeAddComponent,
    BankBranchAddComponent,
    BankBranchListComponent,
    PaymentTransListComponent,
    PaymentTransAddComponent,
    MultiPaymentTransListComponent,
    MultiPaymentTransAddComponent,
    BankOpeningBalanceListComponent,
    BankOpeningBalanceAddComponent,
    CasheOpeningBalanceListComponent,
    CasheOpeningBalanceAddComponent,
    LoadInvoicesComponent,
    CustodyExchangeListComponent,
    CustodyExchangeComponent,
    FinConfigurationComponent,
    OutgoingCashTransferListComponent,
    OutgoingCashTransferAddComponent,
    FinancialMultiCashTransAddComponent,
    FinancialMultitranscashListComponent,
    MainBankListComponent,
    MainBankAddComponent,
    LookUpComponent
  ],
  imports: [
    CommonModule,
    FinRoutingModule,
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
export class FinModule { }
