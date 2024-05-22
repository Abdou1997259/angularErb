import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JournalService } from 'src/app/Core/Api/GL/journal.service';

@Component({
  selector: 'app-costcenters-lookup',
  templateUrl: './costcenters-lookup.component.html',
  styleUrls: ['./costcenters-lookup.component.css']
})
export class CostcentersLookupComponent implements OnInit {

  constructor(private  _JournalService : JournalService
    ,public dialogRef: MatDialogRef<CostcentersLookupComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }
  currentPage!:number;
  page = 1;
  items: any;
  itemsPerPage = 10;
  totalItems : any;
  KeyWord:any;
  ngOnInit(): void {
    this.getAllData();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }
  getAllData()
  {
    this._JournalService.GetCostCenterssLkp(this._JournalService.CurrentAccount,this.KeyWord).subscribe(data=>{
      this.items =  data;
    });
  };

  pageChanged(page: any){
    this.getAllData();
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer =    setTimeout(() => {
        this.getAllData();
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
