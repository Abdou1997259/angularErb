import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResturantInvoice2BillService } from 'src/app/Core/Api/System/resturant-invoice-bill.service';

@Component({
  selector: 'app-resturant-invoice2-bill',
  templateUrl: './resturant-invoice2-bill.component.html',
  styleUrls: ['./resturant-invoice2-bill.component.css']
})
export class ResturantInvoice2BillComponent implements OnInit {
  modelData: any;
  modelList: any[] = [];
  src: any;
  qrFile!:Blob;
  isBtnClicked: boolean = true;

  constructor(public dialogRef: MatDialogRef<ResturantInvoice2BillComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any,private _billService: ResturantInvoice2BillService) { }

  ngOnInit(): void {
    this.modelData = this.data;
    this._billService.GetQrCode(this.modelData.data.n_document_no, this.modelData.data.n_DataAreaID).subscribe({
      next:(res)=>{
        this.qrFile=res;
        var reader=new FileReader();
        reader.readAsDataURL(this.qrFile);
        reader.onloadend = (event) => {
        this.src = event.target?.result as string;
        };
      }
    });

    this.modelData.data.ar_sales_invoice_detailsLst.forEach(element => {
      this.modelList.push(element);
    });
  }

  printBill() {
    this.isBtnClicked = false;
    setTimeout(() => {
      window.print();
    }, 1000);
  }
}
