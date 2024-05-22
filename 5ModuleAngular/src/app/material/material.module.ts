import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatCell, MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const material =[
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatDialogModule,
  MatToolbarModule,
  MatIconModule,
  MatSelectModule,
  MatRippleModule,
  MatCheckboxModule,
  NgxMatSelectSearchModule,
  MatPaginatorModule
]
@NgModule({

  imports: [material],
  exports:[material]
})
export class MaterialModule { }
