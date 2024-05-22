import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';

@Component({
  selector: 'app-items-pop-up',
  templateUrl: './items-pop-up.component.html',
  styleUrls: ['./items-pop-up.component.css']
})
export class ItemsPopUpComponent implements OnInit {

  constructor( private _stockOutToStock:StockOutToStock
    ,public dialogRef: MatDialogRef<ItemsPopUpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any , 
    ) { }
  
  items: any; 
 
  totalItems : any; 
  KeyWord:any;
  ngOnInit(): void {
    this.getAllData();
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
    debugger
    console.log(item)
  }
  getAllData() {

    this._stockOutToStock.getItems().subscribe(data=>{
      
      this.items =  data;
     
      //this.totalItems = data.totalItems;
    });
     
    };


}
