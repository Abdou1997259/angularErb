import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockOutToStock } from 'src/app/Core/Api/SC/stockOutToStock';
import { ExportingTransactionsComponent } from '../exporting-transactions.component';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ExportingTransactionsComponent>
  ,private _stockOutToStock:StockOutToStock ){ }
  mastterDetailsData:any
  id!: number;
  details:any
  itemsPerPage = 10;
  totalItems : any;
  KeyWord:any;
  multiStore!: boolean;
  ngOnInit(): void {

    this.id=this.data.id
    this._stockOutToStock.getById(this.id).subscribe(data=>{
    debugger
      this.mastterDetailsData =  data;



      this.details=this.mastterDetailsData.vuw_StockOutToStock_DetailsLST;

    });

    this.mastterDetailsData
    this.details
  }
  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

}
