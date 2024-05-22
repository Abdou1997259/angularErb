import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-calculator-lkp',
  templateUrl: './calculator-lkp.component.html',
  styleUrls: ['./calculator-lkp.component.css']
})
export class CalculatorLKPComponent implements OnInit {
  calculatedVal: any[] = [];
  finalVal: any;
  textVal: any;

  constructor(public dialogRef: MatDialogRef<CalculatorLKPComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  btnClicked(event: any): void {
    const buttonValue = event.target.value;
    this.calculatedVal.push(buttonValue);
    this.textVal = this.calculatedVal.join('');
  }

  btnCalculatedClicked()
  {
    this.dialogRef.close({ data: this.textVal });
  }

  deleteLastVal()
  {
    if (this.calculatedVal.length > 0) {
      this.calculatedVal.pop();
      this.textVal = this.calculatedVal.join('');
    }
  }

  btnClose()
  {
    this.dialogRef.close();
  }
}
