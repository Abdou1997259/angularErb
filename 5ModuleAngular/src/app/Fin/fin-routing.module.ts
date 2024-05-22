import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardServiceService } from '../_Guard/auth-guard-service.service';
import { FormsOperationGuard } from '../_Guard/forms-operation.guard';
import { RevenueComponent } from './Revenues/revenue/revenue.component';
import { RevenueListComponent } from './Revenues/revenue-list/revenue-list.component';
import { FinMultiTransListComponent } from './MultiTrans/fin-multi-trans-list/fin-multi-trans-list.component';
import { FinMultiTransAddComponent } from './MultiTrans/fin-multi-trans-add/fin-multi-trans-add.component';
import { RevenuemultiComponent } from './RevenuesMulti/revenuemulti/revenuemulti.component';
import { RevenuemultiListComponent } from './RevenuesMulti/revenuemulti-list/revenuemulti-list.component';
import { CashCodeListComponent } from './Cash/cash-code-list/cash-code-list.component';
import { CashCodeAddComponent } from './Cash/cash-code-add/cash-code-add.component';
import { CashTypeAddComponent } from './CashType/cash-type-add/cash-type-add.component';
import { CashTypeListComponent } from './CashType/cash-type-list/cash-type-list.component';
import { BankBranchListComponent } from './BankBranches/bank-branch-list/bank-branch-list.component';
import { BankBranchAddComponent } from './BankBranches/bank-branch-add/bank-branch-add.component';
import { PaymentTransListComponent } from './PaymentTrans/payment-trans-list/payment-trans-list.component';
import { MultiPaymentTransListComponent } from './MultiPaymentTrans/multi-payment-trans-list/multi-payment-trans-list.component';
import { MultiPaymentTransAddComponent } from './MultiPaymentTrans/multi-payment-trans-add/multi-payment-trans-add.component';
import { BankOpeningBalanceListComponent } from './BanckOpeningBalance/bank-opening-balance-list/bank-opening-balance-list.component';
import { BankOpeningBalanceAddComponent } from './BanckOpeningBalance/bank-opening-balance-add/bank-opening-balance-add.component';
import { CasheOpeningBalanceListComponent } from './CasheOpeningBalance/cashe-opening-balance-list/cashe-opening-balance-list.component';
import { CasheOpeningBalanceAddComponent } from './CasheOpeningBalance/cashe-opening-balance-add/cashe-opening-balance-add.component';
import { PaymentTransAddComponent } from './PaymentTrans/payment-trans-add/payment-trans-add.component';
import { FinConfigurationComponent } from './fin-configuration/fin-configuration.component';
import { OutgoingCashTransferListComponent } from './OutGoingCashTransfer/outgoing-cash-transfer-list/outgoing-cash-transfer-list.component';
import { OutgoingCashTransferAddComponent } from './OutGoingCashTransfer/outgoing-cash-transfer-add/outgoing-cash-transfer-add.component';
import { FinancialMultiCashTransAddComponent } from './FinancialMultiTransactionCash/financial-multi-cash-trans-add/financial-multi-cash-trans-add.component';
import { FinancialMultitranscashListComponent } from './FinancialMultiTransactionCash/financial-multitranscash-list/financial-multitranscash-list.component';
import { MainBankAddComponent } from './MainBanks/main-bank-add/main-bank-add.component';
import { MainBankListComponent } from './MainBanks/main-bank-list/main-bank-list.component';

const routes: Routes = [
  { path: '', component:RevenueComponent },
  { path: 'revenue', component:RevenueComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/revenuelist', op:'new'} },
  { path: 'editrevenue/:id', component: RevenueComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/revenuelist', op:'edit'} },
  { path: 'revenuelist', component:RevenueListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/revenuelist',op:'list'} },
  { path: 'multitransList', component:FinMultiTransListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/multitransList',op:'list'} },
  { path: 'multitransAdd', component:FinMultiTransAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/multitransList', op:'new'} },
  { path: 'multitransEdit/:id', component: FinMultiTransAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/multitransList', op:'edit'} },
  { path: 'revenuemulti', component:RevenuemultiComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/revenuemultilist', op:'new'} },
  { path: 'editrevenuemulti/:id', component: RevenuemultiComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/revenuemultilist', op:'edit'} },
  { path: 'revenuemultilist', component:RevenuemultiListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/revenuemultilist',op:'list'} },
  { path: 'CashList', component: CashCodeListComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/CashList', op:'list'} },
  { path: 'CashAdd', component: CashCodeAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/CashList', op:'new'} }
 ,{ path: 'CashEdit/:id', component: CashCodeAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/CashList', op:'edit'} }
 ,{ path: 'CashTypeList', component: CashTypeListComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/CashTypeList', op:'list'} },
  { path: 'CashTypeListAdd', component: CashTypeAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/CashTypeList', op:'new'} }
 ,{ path: 'CashTypeListeEdit/:id', component: CashTypeAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/CashTypeList', op:'edit'} },
 { path: 'BankBranch', component: BankBranchListComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/BankBranch', op:'list'} },
  { path: 'BankBranchAdd', component: BankBranchAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/BankBranch', op:'new'} }
 ,{ path: 'BankBranchEdit/:id', component: BankBranchAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/BankBranch', op:'edit'} },

 { path: 'paymentTransList', component:PaymentTransListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/paymentTransList',op:'list'} },
 { path: 'paymentTransAdd', component:PaymentTransAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/paymentTransList', op:'new'} },
 { path: 'paymentTransEdit/:id', component: PaymentTransAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/paymentTransList', op:'edit'} },
 { path: 'multiPaymentTransList', component:MultiPaymentTransListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/multiPaymentTransList',op:'list'} },
 { path: 'multiPaymentTransAdd', component:MultiPaymentTransAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/multiPaymentTransList', op:'new'} },
 { path: 'multiPaymentTransEdit/:id', component: MultiPaymentTransAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/multiPaymentTransList', op:'edit'} },
 { path: 'banckOpeningBalanceList', component:BankOpeningBalanceListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/banckOpeningBalanceList',op:'list'} },
 { path: 'banckOpeningBalanceAdd', component:BankOpeningBalanceAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/banckOpeningBalanceList', op:'new'} },
 { path: 'banckOpeningBalanceEdit/:id', component: BankOpeningBalanceAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/banckOpeningBalanceList', op:'edit'} },
 { path: 'casheOpeningBalanceList', component:CasheOpeningBalanceListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/casheOpeningBalanceList',op:'list'} },
 { path: 'casheOpeningBalanceAdd', component:CasheOpeningBalanceAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/casheOpeningBalanceList', op:'new'} },

 { path: 'casheOpeningBalanceEdit/:id', component: CasheOpeningBalanceAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/casheOpeningBalanceList', op:'edit'} }
 ,{ path: 'finConfiguartion', component:FinConfigurationComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/finConfiguartion',op:'new'} },
 { path: 'outgoingcashtransferlist', component:OutgoingCashTransferListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/outgoingcashtransferlist', op:'list'} },
  { path: 'outgoingcashtransferadd', component: OutgoingCashTransferAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/outgoingcashtransferlist', op:'new'} },
  { path: 'outgoingcashtransferedit/:id', component:OutgoingCashTransferAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/outgoingcashtransferlist',op:'edit'} },
  { path: 'financialmulticahstranslist', component: FinancialMultitranscashListComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/financialmulticahstranslist', op:'list'} },
  { path: 'financialmulticahstransadd', component: FinancialMultiCashTransAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/financialmulticahstranslist', op:'new'} },
  { path: 'MainBank', component:MainBankListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/MainBank',op:'list'} },
 { path: 'MainBankAdd', component:MainBankAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/MainBank', op:'new'} },
 { path: 'MainBankEdit/:id', component: MainBankAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/fin/MainBank', op:'edit'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinRoutingModule { }
