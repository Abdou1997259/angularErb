import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseInvoiceService } from 'src/app/Core/Api/AP/purchase-invoice.service';
@Component({
  selector: 'app-cost-centers-lkp',
  templateUrl: './cost-centers-lkp.component.html',
  styleUrls: ['./cost-centers-lkp.component.css']
})
export class CostCentersLkpComponent implements OnInit {

  constructor(private  _PurchaseInvoiceService : PurchaseInvoiceService
    ,public dialogRef: MatDialogRef<CostCentersLkpComponent>
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
    this._PurchaseInvoiceService.GetCostCenters('').subscribe(data=>{
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
      this._PurchaseInvoiceService.GetCostCenters(this.KeyWord).subscribe(data=>{
        this.items =  data;
      });
    }, 1000);
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}

