import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobLkpService } from 'src/app/Core/Api/LookUps/job-lkp.service';

@Component({
  selector: 'app-job-lkp',
  templateUrl: './job-lkp.component.html',
  styleUrls: ['./job-lkp.component.css']
})
export class JobLkpComponent implements OnInit {
  JobData: any;
  showspinner: boolean = false;

  jobId: any;
  jobName: any;

  constructor(private _service: JobLkpService, public dialogRef: MatDialogRef<JobLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.GetJobs();
  }

  GetJobs() {
    this.showspinner = true;
    this._service.GetJobs().subscribe((data) => {
      this.JobData = data;
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
      this._service.GetJobs(this.jobId, this.jobName).subscribe(data=>{
        this.JobData = data;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
