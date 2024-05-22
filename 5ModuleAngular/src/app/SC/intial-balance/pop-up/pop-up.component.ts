import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntialBalanceComponent } from '../intial-balance.component';
import { TimeGrid } from '@fullcalendar/timegrid';
import { IntialBalnceService } from 'src/app/Core/Api/SC/intialBalance';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';


@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<IntialBalanceComponent>
  ,private _initialBalanceService:IntialBalnceService ){ }
  mastterDetailsData:any
  id!: number;
  details:any
  itemsPerPage = 10;
  totalItems : any;
  KeyWord:any;
  multiStore!: boolean;
  ngOnInit(): void {
    this.id=this.data.id
    this._initialBalanceService.getById(this.id).subscribe(data=>{

   

    debugger;
      this.mastterDetailsData =  data;


      this.multiStore =this.mastterDetailsData.b_using_multi_store
      this.details=this.mastterDetailsData.intialBalanceDetails
      LangSwitcher.translatefun();

    });
  }
  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

}
