import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpLkpService } from 'src/app/Core/Api/LookUps/emp-lkp.service';

@Component({
  selector: 'app-employee-lkp',
  templateUrl: './employee-lkp.component.html',
  styleUrls: ['./employee-lkp.component.css']
})
export class EmployeeLkpComponent implements OnInit {
  EmployeeData: any;
  showspinner: boolean = false;

  empId: any;
  empName: any;

  constructor(private _service: EmpLkpService, public dialogRef: MatDialogRef<EmployeeLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.GetJobs();
  }

  GetJobs() {
    this.showspinner = true;
    this._service.GetAllEmployee().subscribe((data) => {
      this.EmployeeData = data;
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
      this._service.GetAllEmployee(this.empId, this.empName).subscribe(data=>{
        this.EmployeeData = data;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
