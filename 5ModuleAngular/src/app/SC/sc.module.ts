import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataTablesModule } from 'angular-datatables';
import { NgxConfirmBoxModule,NgxConfirmBoxService } from 'ngx-confirm-box';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ApiInterceptorService } from '../Core/Api/Interceptor/api-interceptor.service';
import {HTTP_INTERCEPTORS } from '@angular/common/http';
import { SCRoutingModule } from './sc-routing.module';
import { ScGeneralSettingsComponent } from './sc-general-settings/sc-general-settings.component';
import { ScItemMaingroupComponent } from './sc-item-maingroup/sc-item-maingroup.component';
import { ScGroupsLevelsComponent } from './sc-groups-levels/sc-groups-levels.component';
import { ScItemTypesComponent } from './sc-item-types/sc-item-types.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ScItemTypesListComponent } from './sc-item-types-list/sc-item-types-list.component';
import { StoresComponent } from './stores/stores.component';
import { AddStoreComponent } from './stores/add-store/add-store.component';
import { AddUnitComponent } from './units/add-unit/add-unit.component';
import { UnitsComponent } from './units/units.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreService } from '../Core/Api/SC/store.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ScStockInListComponent } from './StockIn/sc-stock-in-list/sc-stock-in-list.component';
import { ScStockInAddComponent } from './StockIn/sc-stock-in-add/sc-stock-in-add.component';
import { IntialBalanceComponent } from './intial-balance/intial-balance.component';
import { IntialBalnceService } from '../Core/Api/SC/intialBalance';
import { AddIntialBalanceComponent } from './intial-balance/add-intial-balance/add-intial-balance.component';
import { PopUpComponent } from './intial-balance/pop-up/pop-up.component';
import { StoresPopUpComponent as StoresPopUpComponent2 } from './incoming-qty-recieve/stores-pop-up/stores-pop-up.component';
import { ExportingTransactionsComponent } from './exporting-transactions/exporting-transactions.component';
import { StockOutToStock } from '../Core/Api/SC/stockOutToStock';
import { AddExportingTransactionComponent } from './exporting-transactions/add-exporting-transaction/add-exporting-transaction.component';
import { PopJournalUpComponent } from './exporting-transactions/pop-journal-up/pop-journal-up.component';
import { JournalsComponent } from './journals/journals.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemsComponent } from './items/items.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ScStockOutListComponent } from './StockOut/sc-stock-out-list/sc-stock-out-list.component';
import { ScStockOutAddComponent } from './StockOut/sc-stock-out-add/sc-stock-out-add.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {AgGridModule} from "ag-grid-angular";

import { IncomingQtyRecieveComponent } from './incoming-qty-recieve/incoming-qty-recieve.component';
import { AccountsPopUpComponent } from './stores/accounts-pop-up/accounts-pop-up.component';
import { ImportingTransactionsComponent } from './importing-transactions/importing-transactions.component';
import { AddImportingTransactionComponent } from './importing-transactions/add-importing-transaction/add-importing-transaction.component';
import { ImportingPopJournalUpComponent } from './importing-transactions/importing-pop-journal-up/importing-pop-journal-up.component';
import { DatePickerFormatDirective } from '../DateSetting/DatePickerSC';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { StocktakingListComponent } from './StockTacking/stocktaking-list/stocktaking-list.component';
import { StocktakingComponent } from './StockTacking/stocktaking/stocktaking.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LookUpComponent } from '../Controls/look-up-sc/look-up-sc.component';

@NgModule({
  declarations: [
    ScGeneralSettingsComponent,
    ScItemMaingroupComponent,
    ScGroupsLevelsComponent,
    ScItemTypesComponent,
    ScItemTypesListComponent,
    StoresComponent,
    AddStoreComponent,
    UnitsComponent,
    AddUnitComponent,
    ScStockInListComponent,
    ScStockInAddComponent,
    IntialBalanceComponent,
    AddIntialBalanceComponent,
    PopUpComponent,
    StoresPopUpComponent2,
    ExportingTransactionsComponent,
    AddExportingTransactionComponent,
    PopJournalUpComponent,
    JournalsComponent,
    ItemsListComponent,
    ItemsComponent,
    ScStockOutListComponent,
    ScStockOutAddComponent,
    IncomingQtyRecieveComponent,
    AccountsPopUpComponent,
    ImportingTransactionsComponent,
    AddImportingTransactionComponent,
    ImportingPopJournalUpComponent,
    DatePickerFormatDirective,
    StocktakingListComponent,
    StocktakingComponent,
    LookUpComponent
  ],
  imports: [
    CommonModule,
    SCRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressBarModule,
    DataTablesModule,
    MaterialModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    AgGridModule,
    DropDownsModule,
    PaginationModule,
    MatProgressSpinnerModule
  ],
  providers:[{provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorService,multi: true}]
})
export class SCModule { }
