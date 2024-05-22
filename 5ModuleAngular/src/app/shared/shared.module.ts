import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './select/select.component';
import { MatSelectModule } from '@angular/material/select';
import { SelectServerSideComponent } from './select-server-side/select-server-side.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { TransJournalsComponent } from './trans-journals/trans-journals.component';
import { DatePickerFormatDirective } from '../DateSetting/DatePickerShared';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { PrevSelectComponent } from './prev-select/prev-select.component';
import { SelectKeepLastChangeComponent } from './select-keep-last-change/select-keep-last-change.component';



@NgModule({
  declarations: [
    TableComponent,
    SelectComponent,
    SelectServerSideComponent,
    AttachmentsComponent,
    TransJournalsComponent,
    DatePickerFormatDirective,
    PrevSelectComponent,
    SelectKeepLastChangeComponent
  ],
  imports: [
    CommonModule, 
    MaterialModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FormsModule
  ]
  ,exports:[TableComponent,SelectComponent,SelectServerSideComponent,AttachmentsComponent,PrevSelectComponent,SelectKeepLastChangeComponent]
})
export class SharedModule { }
