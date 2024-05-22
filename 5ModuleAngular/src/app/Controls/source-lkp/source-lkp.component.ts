import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RevenueMultiService } from 'src/app/Core/Api/FIN/revenue-multi.service';

@Component({
  selector: 'app-source-lkp',
  templateUrl: './source-lkp.component.html',
  styleUrls: ['./source-lkp.component.css']
})
export class SourceLkpComponent implements OnInit {

  constructor(private  _RevenueMultiService : RevenueMultiService
    ,public dialogRef: MatDialogRef<SourceLkpComponent>
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
    if(this.data.type==1)
    {
      this._RevenueMultiService.GetDebitItems(this.data.source).subscribe(data=>{
        this.items =  data;
      });
    }
    else{
      this._RevenueMultiService.GetCreditItems(this.data.source).subscribe(data=>{
        this.items =  data;
      });
    }

  };

  pageChanged(page: any){
    this.getAllData();
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer =    setTimeout(() => {
      if(this.data.type==1)
      {
        this._RevenueMultiService.GetDebitItems(this.data.source,this.KeyWord).subscribe(data=>{
          this.items =  data;
        });
      }
      else{
        this._RevenueMultiService.GetCreditItems(this.data.source,this.KeyWord).subscribe(data=>{
          this.items =  data;
        });
      }
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}

