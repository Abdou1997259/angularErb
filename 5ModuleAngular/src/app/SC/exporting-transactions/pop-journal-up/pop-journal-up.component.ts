import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { retry } from 'rxjs';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { AddExportingTransactionComponent } from '../add-exporting-transaction/add-exporting-transaction.component';

@Component({
  selector: 'app-pop-journal-up',
  templateUrl: './pop-journal-up.component.html',
  styleUrls: ['./pop-journal-up.component.css']
})
export class PopJournalUpComponent implements OnInit ,OnDestroy {

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any ,
  private _stockOutToStock:StockOutToStock,
  public dialogRef: MatDialogRef<AddExportingTransactionComponent>

  ) {  }
  get accountNo1()
  {
    return this.data.accountNo1
  }
  get accountNo2()
  {
    return this.data.accountNo2
  }
  get accountName1()
  {
    return this.data.accountName1
  }
  get accountName2()
  {
    return this.data.accountName2
  }
  get History()
  {
    return this.data.History;
  }
  get Credit()
  {
    return this.data.Credit;
  }
  get Debit()
  {
    return this.data.Debit;
  }
  get Currency()
  {
    return this.data.Currency
  }
  get descArab()
  {

    return this.data.descArab
  }
  get descEng()
  {
    return this.data.descEng
  }
   gl_Journal_Form!: FormGroup;
   Currency_Name:any
   getGLFromGroup(data:FormGroup)
   {

     debugger;
     this.gl_Journal_Form=data;
   }

  ngOnInit(): void {

  debugger;
    this.descArab
    this._stockOutToStock.getCurrency(this.Currency).subscribe((data)=>{
      debugger;
      this.Currency_Name=data.currency
    })


  }
  ngOnDestroy()
  {

    debugger;
     this.dialogRef.close({
      data:this.gl_Journal_Form
     })



  }

}
