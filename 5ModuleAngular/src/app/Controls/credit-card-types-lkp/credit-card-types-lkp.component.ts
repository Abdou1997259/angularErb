import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResturantBill2Service } from 'src/app/Core/Api/AR/resturant-bill2.service';

@Component({
  selector: 'app-credit-card-types-lkp',
  templateUrl: './credit-card-types-lkp.component.html',
  styleUrls: ['./credit-card-types-lkp.component.css']
})
export class CreditCardTypesLkpComponent implements OnInit {
  creditCardList: any;
  showspinner: boolean = false;
  KeyWord:any;

  constructor(private _service: ResturantBill2Service, public dialogRef: MatDialogRef<CreditCardTypesLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getCreditCardTypes();
  }

  getCreditCardTypes(page: number = 0) {
    this.showspinner = true;
    this._service.GetCreditCardTypes().subscribe((data) => {
      this.creditCardList = data;
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
      this._service.GetCreditCardTypes(this.KeyWord).subscribe(data=>{
        this.creditCardList = data;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
