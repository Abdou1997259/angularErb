import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllowancesLkpService } from 'src/app/Core/Api/LookUps/allowances-lkp.service';

@Component({
  selector: 'app-allowances-lkp',
  templateUrl: './allowances-lkp.component.html',
  styleUrls: ['./allowances-lkp.component.css']
})
export class AllowancesLkpComponent implements OnInit {
  AllowancesData: any;
  showspinner: boolean = false;

  allowanceId: any;
  allowanceName: any;

  constructor(private _service: AllowancesLkpService, public dialogRef: MatDialogRef<AllowancesLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.GetJobs();
  }

  GetJobs() {
    this.showspinner = true;
    this._service.GetAllowances().subscribe((data) => {
      this.AllowancesData = data;
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
      this._service.GetAllowances(this.allowanceId, this.allowanceName).subscribe(data=>{
        this.AllowancesData = data;
      });
    }, 1000);
  }
  
  onCloseClick() {
    this.dialogRef.close();
  }
}
