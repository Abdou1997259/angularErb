import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './PurchaseInvoice/invoice/invoice.component';
import { InvoiceListComponent } from './PurchaseInvoice/invoice-list/invoice-list.component';
import { AuthGuardServiceService } from '../_Guard/auth-guard-service.service';
import { FormsOperationGuard } from '../_Guard/forms-operation.guard';
import { SupplierTypesComponent } from './supplier-types/supplier-types.component';
import { AddSupplierTypeComponent } from './supplier-types/add-supplier-type/add-supplier-type.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { SupplierConfigurationComponent } from './supplier-configuration/supplier-configuration.component';
import { SupplierDirectionComponent } from './supplier-direction/supplier-direction.component';
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
import { SuppliersOpeningBalanceAddComponent } from './SuppliersOpeningBalance/suppliers-opening-balance-add/suppliers-opening-balance-add.component';
import { SuppliersOpeningBalanceListComponent } from './SuppliersOpeningBalance/suppliers-opening-balance-list/suppliers-opening-balance-list.component';
import { SupplierDirectionAddComponent } from './supplier-direction/supplier-direction-add/supplier-direction-add.component';
import { SupplierListComponent } from './supplierCat/supplier-list/supplier-list.component';
import { SupplierAddComponent } from './supplierCat/supplier-add/supplier-add.component';



const routes: Routes = [

  { path: '', component:InvoiceComponent },

  { path: 'purchaseinvoice', component:InvoiceComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseinvoicelist', op:'new'} },
  { path: 'editpurchaseinvoice/:id', component: InvoiceComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseinvoicelist', op:'edit'} },
  { path: 'purchaseinvoicelist', component:InvoiceListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseinvoicelist',op:'list'} },
  { path: 'supplierTypes', component:SupplierTypesComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierTypes', op:'list'} },
  { path: 'supplierTypeEdit/:id', component: AddSupplierTypeComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierTypes', op:'edit'} },
  { path: 'addsupplierType', component:AddSupplierTypeComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierTypes',op:'new'} },
  { path: 'supplierList', component:SupplierComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierList', op:'list'} },
  { path: 'supplierEdit/:id', component: AddSupplierComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierList', op:'edit'} },
  { path: 'supplierAdd', component:AddSupplierComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierList',op:'new'} },
  { path: 'supplierConfiguartion', component:SupplierConfigurationComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierConfiguartion',op:'new'} },
  { path: 'supplierDirection', component:SupplierDirectionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierDirection',op:'list'} },
  { path: 'supplierDirectionAdd', component:SupplierDirectionAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierDirection',op:'new'} },
  { path: 'supplierDirectionEdit/:id', component:SupplierDirectionAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/supplierDirection',op:'edit'} },
  { path: 'purchaseDemand', component:AddPurchaseDemandComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseDemandList', op:'new'} },
  { path: 'editPurchaseDemand/:id', component: AddPurchaseDemandComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseDemandList', op:'edit'} },
  { path: 'purchaseDemandList', component:PurchaseDemandComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseDemandList',op:'list'} },
  { path: 'purchasereturnslist', component:PurchaseReturnsListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchasereturnslist',op:'list'} },
  { path: 'purchasereturns', component:PurchaseReturnsAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchasereturnslist', op:'new'} },
  { path: 'purchasereturns/:id', component: PurchaseReturnsAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchasereturnslist', op:'edit'} },
  { path: 'purchaseinvoicegroupslist', component:PurchaseInvoiceGroupsListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseinvoicegroupslist',op:'list'} },
  { path: 'purchaseinvoicegroup', component:PurchaseInvoiceGroupsAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseinvoicegroupslist', op:'new'} },
  { path: 'purchaseinvoicegroup/:id', component: PurchaseInvoiceGroupsAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/purchaseinvoicegroupslist', op:'edit'} },
  { path: 'suppliersbalancelist', component:SuppliersOpeningBalanceListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/suppliersbalancelist',op:'list'} },
  { path: 'suppliersbalance', component:SuppliersOpeningBalanceAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/suppliersbalancelist', op:'new'} },
  { path: 'suppliersbalance/:id', component: SuppliersOpeningBalanceAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/suppliersbalancelist', op:'edit'} },
  { path: 'recieveqtyList', component:RecieveQtyListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/recieveqtyList',op:'list'} },
  { path: 'recieveqty', component:RecieveQtyAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/suppliersbalancelist', op:'new'} },
  { path: 'recieveqty/:id', component: RecieveQtyAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/suppliersbalancelist', op:'edit'} },
  { path: 'importsorderslist', component:ImportOrderListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/importsorderslist',op:'list'} },
  { path: 'importsorders', component:ImportOrderAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/importsorderslist', op:'new'} },
  { path: 'importsorders/:id', component: ImportOrderAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/ap/importsorderslist', op:'edit'} },
  { path: 'suppliercat', component:SupplierListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : 'ap/suppliercat',op:'list'} },
  { path: 'suppliercatAdd', component:SupplierAddComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : 'ap/suppliercat', op:'new'} },
  { path: 'suppliercatEdit/:id', component: SupplierAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : 'ap/suppliercat', op:'edit'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class APRoutingModule { }
