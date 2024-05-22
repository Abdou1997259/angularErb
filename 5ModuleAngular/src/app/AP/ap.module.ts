import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APRoutingModule } from './ap-routing.module';
import { InvoiceComponent } from './PurchaseInvoice/invoice/invoice.component';
import { InvoiceListComponent } from './PurchaseInvoice/invoice-list/invoice-list.component';
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
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { DatePickerFormatDirective } from '../DateSetting/DatePickerAP';
import { SupplierTypesComponent } from './supplier-types/supplier-types.component';
import { AddSupplierTypeComponent } from './supplier-types/add-supplier-type/add-supplier-type.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { PurchaseManComponent } from './supplier/add-supplier/popUps/purchase-man/purchase-man.component';
import { TypesComponent } from './supplier/add-supplier/popUps/types/types.component';
import { AreaComponent } from './supplier/add-supplier/popUps/area/area.component';
import { CommissionComponent } from './supplier/add-supplier/popUps/commission/commission.component';
import { BranchComponent } from './supplier/add-supplier/popUps/branch/branch.component';
import { AccountsComponent  } from './supplier/add-supplier/popUps/accounts/accounts.component';
import { SupplierConfigurationComponent } from './supplier-configuration/supplier-configuration.component';
import { AccountsPrimaryComponent } from './supplier-configuration/popUps/accounts-primary/accounts-primary.component';
import { AccountSupplierComponent } from './supplier-configuration/popUps/account-supplier/account-supplier.component';
import { SupplierDirectionComponent } from './supplier-direction/supplier-direction.component';
import { AccountDirectionComponent } from './supplier-direction/account-direction/account-direction.component';
import { PurchaseDemandComponent } from './purchase-demand/purchase-demand.component';
import { AddPurchaseDemandComponent } from './purchase-demand/add-purchase-demand/add-purchase-demand.component';
import { ImportOrderAddComponent } from './ImportOrder/import-order-add/import-order-add.component';
import { ImportOrderListComponent } from './ImportOrder/import-order-list/import-order-list.component';
import { PurchaseInvoiceGroupsAddComponent } from './PurchaseInvoiceGroups/purchase-invoice-groups-add/purchase-invoice-groups-add.component';
import { PurchaseInvoiceGroupsListComponent } from './PurchaseInvoiceGroups/purchase-invoice-groups-list/purchase-invoice-groups-list.component';
import { PurchaseReturnsAddComponent } from './PurchaseReturns/purchase-returns-add/purchase-returns-add.component';
import { PurchaseReturnsListComponent } from './PurchaseReturns/purchase-returns-list/purchase-returns-list.component';
import { RecieveQtyAddComponent } from './RecieveQty/recieve-qty-add/recieve-qty-add.component';
import { RecieveQtyListComponent } from './RecieveQty/recieve-qty-list/recieve-qty-list.component';
import { RejectedGoodsComponent } from './RecieveQty/rejected-goods/rejected-goods.component';
import { SuppliersOpeningBalanceAddComponent } from './SuppliersOpeningBalance/suppliers-opening-balance-add/suppliers-opening-balance-add.component';
import { SuppliersOpeningBalanceListComponent } from './SuppliersOpeningBalance/suppliers-opening-balance-list/suppliers-opening-balance-list.component';
import { SupplierDirectionAddComponent } from './supplier-direction/supplier-direction-add/supplier-direction-add.component';
import { LookUpComponent } from '../Controls/look-up-ap/look-up-ap.component';
import { SupplierListComponent } from './supplierCat/supplier-list/supplier-list.component';
import { SupplierAddComponent } from './supplierCat/supplier-add/supplier-add.component';
import { ItemsDemandComponent } from '../Controls/items-demand/items-demand.component';

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceListComponent,
    DatePickerFormatDirective,
    SupplierTypesComponent,
    AddSupplierTypeComponent,
    SupplierComponent,
    AddSupplierComponent,
    PurchaseManComponent,
    TypesComponent,
    AreaComponent,
    CommissionComponent,
    AccountsComponent,
    BranchComponent,
    SupplierConfigurationComponent,
    AccountsPrimaryComponent,
    AccountSupplierComponent,
    SupplierDirectionComponent,
    AccountDirectionComponent,
    PurchaseDemandComponent,
    AddPurchaseDemandComponent,
    PurchaseReturnsListComponent,
    PurchaseReturnsAddComponent,
    PurchaseInvoiceGroupsListComponent,
    PurchaseInvoiceGroupsAddComponent,
    SuppliersOpeningBalanceListComponent,
    SuppliersOpeningBalanceAddComponent,
    RecieveQtyListComponent,
    RecieveQtyAddComponent,
    ImportOrderListComponent,
    ImportOrderAddComponent,
    RejectedGoodsComponent,
    SupplierDirectionAddComponent,
    LookUpComponent,
    SupplierListComponent,
    SupplierAddComponent,
    ItemsDemandComponent
  ],
  imports: [
    CommonModule,
    APRoutingModule,
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
export class APModule { }
