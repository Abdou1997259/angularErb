import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PriceListService } from 'src/app/Core/Api/AR/price-list.service';

@Component({
  selector: 'app-items-type',
  templateUrl: './items-type.component.html',
  styleUrls: ['./items-type.component.css']
})
export class ItemsTypeComponent implements OnInit {


  constructor( private _stockOutToStock:PriceListService
    ,public dialogRef: MatDialogRef<ItemsTypeComponent>
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

    this._stockOutToStock.GetTypes().subscribe(data=>{
      
      this.items =  data;
     
      //this.totalItems = data.totalItems;
    });
     
    };



}
