import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-passenter-lkp',
  templateUrl: './passenter-lkp.component.html',
  styleUrls: ['./passenter-lkp.component.css']
})
export class PassenterLkpComponent implements OnInit {
  calculatedVal: any[] = [];
  finalVal: any;
  textVal: any;

  constructor(public dialogRef: MatDialogRef<PassenterLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.textVal = "";
    this.reloadComponent();
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

  reloadComponent(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
