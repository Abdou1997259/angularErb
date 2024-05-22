import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArShiftsService } from 'src/app/Core/Api/AR/ar-shift.service';

@Component({
  selector: 'app-cashes',
  templateUrl: './cashes.component.html',
  styleUrls: ['./cashes.component.css']
})
export class CashesComponent implements OnInit {
  cashesList: any;
  showspinner: boolean = false;

  cashId: any;
  cashName: any;

  constructor(private _service: ArShiftsService, public dialogRef: MatDialogRef<CashesComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.GetCashesList();
  }

  GetCashesList() {
    this.showspinner = true;
    this._service.GetCashes().subscribe((data) => {
      this.cashesList = data;
      this.showspinner = false;
    });
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
      this._service.GetCashes(this.cashId, this.cashName).subscribe(data=>{
        this.cashesList = data;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
