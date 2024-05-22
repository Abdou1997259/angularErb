import { ScStockOutListComponent } from './StockOut/sc-stock-out-list/sc-stock-out-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScGeneralSettingsComponent } from './sc-general-settings/sc-general-settings.component';
import { ScItemMaingroupComponent } from './sc-item-maingroup/sc-item-maingroup.component';
import { ScGroupsLevelsComponent } from './sc-groups-levels/sc-groups-levels.component';
import { ScItemTypesComponent } from './sc-item-types/sc-item-types.component';
import { ScItemTypesListComponent } from './sc-item-types-list/sc-item-types-list.component';
import { AuthGuardServiceService } from '../_Guard/auth-guard-service.service';
import { FormsOperationGuard } from '../_Guard/forms-operation.guard';
import { AddStoreComponent } from './stores/add-store/add-store.component';
import { StoresComponent } from './stores/stores.component';
import { UnitsComponent } from './units/units.component';
import { AddUnitComponent } from './units/add-unit/add-unit.component';
import { ScStockInListComponent } from './StockIn/sc-stock-in-list/sc-stock-in-list.component';
import { ScStockInAddComponent } from './StockIn/sc-stock-in-add/sc-stock-in-add.component';
import { AddExportingTransactionComponent } from './exporting-transactions/add-exporting-transaction/add-exporting-transaction.component';
import { ExportingTransactionsComponent } from './exporting-transactions/exporting-transactions.component';
import { AddIntialBalanceComponent } from './intial-balance/add-intial-balance/add-intial-balance.component';
import { IntialBalanceComponent } from './intial-balance/intial-balance.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemsComponent } from './items/items.component';
import { ScStockOutAddComponent } from './StockOut/sc-stock-out-add/sc-stock-out-add.component';
import { IncomingQtyRecieveComponent } from './incoming-qty-recieve/incoming-qty-recieve.component';
import { AddImportingTransactionComponent } from './importing-transactions/add-importing-transaction/add-importing-transaction.component';
import { ImportingTransactionsComponent } from './importing-transactions/importing-transactions.component';
import { StocktakingListComponent } from './StockTacking/stocktaking-list/stocktaking-list.component';
import { StocktakingComponent } from './StockTacking/stocktaking/stocktaking.component';

const routes: Routes = [
  { path: '', component:ScGeneralSettingsComponent },
  { path: 'scsettings', component:ScGeneralSettingsComponent },
  { path: 'scitemmaingroup', component:ScItemMaingroupComponent },
  { path: 'scgroupslevels', component:ScGroupsLevelsComponent },
  { path: 'scitemtypeslist', component:ScItemTypesListComponent,data : {formname : '/sc/scitemtypeslist',op:'list'} }, // canActivate:[AuthGuardServiceService,FormsOperationGuard]
  { path: 'scitemtypes', component:ScItemTypesComponent,data : {formname : '/sc/scitemtypeslist',op:'new'} }, // canActivate:[AuthGuardServiceService,FormsOperationGuard]
  { path: 'scedititemtype/:id', component:ScItemTypesComponent,data : {formname : '/sc/scitemtypeslist',op:'edit'} }, // canActivate:[AuthGuardServiceService,FormsOperationGuard]

  { path: 'store', component:AddStoreComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/stores', op:'new'} },
  { path: 'editstore/:id', component: AddStoreComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/stores', op:'edit'} },
  { path: 'stores', component:StoresComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/stores',op:'list'} },

  { path:'units',component:UnitsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/units',op:'list'}},
  { path :'editunit/:id',component:AddUnitComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/units",op:'edit'}},
  { path:'unit',component:AddUnitComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/units",op:'new'}},

  { path:'stockinlst',component:ScStockInListComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/stockinlst",op:'list'} },
  { path:'scaddstocktransaction',component:ScStockInAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/stockinlst",op:'new'} },
  { path:'sceditstocktransaction/:id',component:ScStockInAddComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/stockinlst",op:'edit'} },

  { path:'stockoutlst',component:ScStockOutListComponent,data:{formname:"/sc/stockoutlst",op:'list'} },
  { path:'scaddstockouttransaction',component:ScStockOutAddComponent,data:{formname:"/sc/stockoutlst",op:'new'} },
  { path:'sceditstockouttransaction/:id',component:ScStockOutAddComponent,data:{formname:"/sc/stockoutlst",op:'edit'} },

  {path:"intialBalance",component:AddIntialBalanceComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/intialBalances",op:'new'}},
  {path:"intialBalances",component:IntialBalanceComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/intialBalances",op:'list'}},
  {path:"intialBalanceEdit/:id",component:AddIntialBalanceComponent ,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/intialBalances",op:'edit'}},

  {path:"exportingTransactions",component:ExportingTransactionsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/exportingTransactions",op:'list'}},
  {path:"exportingTransaction",component: AddExportingTransactionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/exportingTransactions",op:'new'}},
  {path:"exportingTransactionEdit/:id",component: AddExportingTransactionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/exportingTransactions",op:'edit'}},

  { path: 'items', component:ItemsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/itemslist', op:'new'} },
  { path: 'edititem/:id', component: ItemsComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/itemslist', op:'edit'} },
  { path: 'itemslist', component:ItemsListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/itemslist',op:'list'} },

  {path:"importingTransactions",component:ImportingTransactionsComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/importingTransactions",op:'list'}},
  {path:"importingTransaction",component: AddImportingTransactionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/importingTransactions",op:'new'}},
  {path:"importingTransactionEdit/:id",component: AddImportingTransactionComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/importingTransactions",op:'edit'}},

  {path:"incomingQtys",component:IncomingQtyRecieveComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data:{formname:"/sc/incomingQtys",op:'list'}},

  { path: 'stocktaking', component:StocktakingComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/stocktakinglist', op:'new'} },
  { path: 'editstocktaking/:id', component: StocktakingComponent, canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/stocktakinglist', op:'edit'} },
  { path: 'stocktakinglist', component:StocktakingListComponent,canActivate:[AuthGuardServiceService,FormsOperationGuard],data : {formname : '/sc/stocktakinglist',op:'list'} },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SCRoutingModule { }
