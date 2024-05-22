import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArShiftsService } from 'src/app/Core/Api/AR/ar-shift.service';

@Component({
  selector: 'app-salers',
  templateUrl: './salers.component.html',
  styleUrls: ['./salers.component.css']
})
export class SalersComponent implements OnInit {
  salersList: any;
  showspinner: boolean = false;

  salerId: any;
  salerName: any;

  constructor(private _service: ArShiftsService, public dialogRef: MatDialogRef<SalersComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.GetSalersList();
  }

  GetSalersList() {
    this.showspinner = true;
    this._service.GetSalers().subscribe((data) => {
      this.salersList = data;
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
      this._service.GetSalers(this.salerId, this.salerName).subscribe(data=>{
        this.salersList = data;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
