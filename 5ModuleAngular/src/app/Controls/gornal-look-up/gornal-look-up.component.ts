import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { ScStockInAddComponent } from 'src/app/SC/StockIn/sc-stock-in-add/sc-stock-in-add.component';

@Component({
  selector: 'app-gornal-look-up',
  templateUrl: './gornal-look-up.component.html',
  styleUrls: ['./gornal-look-up.component.css']
})
export class GornalLookUpComponent implements OnInit {

  formList!: FormGroup;
  n_docNumber!:number;
  date!: string;
  details_list!: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ScStockInAddComponent>
  ,private _stockInService:SCstockInService, private _formBuilder: FormBuilder) { 
    this.formList = this._formBuilder.group({
      formArray: this._formBuilder.array([])
    });
   }

  ngOnInit(): void {
    this.n_docNumber = this.data.n_docNumber;
    this.date = this.data.date;
    debugger;
    var sum = 0;
    for(var i = 0; i < this.data.details_list.length-1; i++) {
      if(this.data.details_list[i].n_store_id == this.data.details_list[i+1].n_store_id){
        sum += this.data.details_list[i].n_transaction_value;
      }
    }
  }

  newFormArrayRow(row: number = 0) {
    return this._formBuilder.group({
      lineNo: row,
      accountId: '',
      accountName: '',
      debit: '',
      credit: '',
      costCenterId: '',
      costCenterName: '',
      costCenter2Id: '',
      costcenter2Name: '',
      arabicDesc: '',
      englishDesc: ''
    })
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }
}
