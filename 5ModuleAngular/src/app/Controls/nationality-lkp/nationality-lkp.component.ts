import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NationalityLkpService } from 'src/app/Core/Api/LookUps/nationality-lkp.service';

@Component({
  selector: 'app-nationality-lkp',
  templateUrl: './nationality-lkp.component.html',
  styleUrls: ['./nationality-lkp.component.css']
})
export class NationalityLkpComponent implements OnInit {
  NationalitiesData: any;
  showspinner: boolean = false;

  nationalityId: any;
  nationalityName: any;

  constructor(private _service: NationalityLkpService, public dialogRef: MatDialogRef<NationalityLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.GetNationalities();
  }

  GetNationalities() {
    this.showspinner = true;
    this._service.GetNationalities().subscribe((data) => {
      this.NationalitiesData = data;
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
      this._service.GetNationalities(this.nationalityId, this.nationalityName).subscribe(data=>{
        this.NationalitiesData = data;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
