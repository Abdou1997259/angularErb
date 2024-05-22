import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PriceListService } from 'src/app/Core/Api/AR/price-list.service';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { ItemsPopUpComponent } from 'src/app/SC/exporting-transactions/items-pop-up/items-pop-up.component';

@Component({
  selector: 'app-item-group',
  templateUrl: './item-group.component.html',
  styleUrls: ['./item-group.component.css']
})
export class ItemGroupComponent implements OnInit {

  constructor( private _stockOutToStock:PriceListService
    ,public dialogRef: MatDialogRef<ItemGroupComponent>
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

    this._stockOutToStock.GetItemGroups().subscribe(data=>{
      
      this.items =  data;
     
      //this.totalItems = data.totalItems;
    });
     
    };


}
