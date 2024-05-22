import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QuotationService } from 'src/app/_Services/Customer/quotation.service';
import { QuotationDetailsComponent } from '../quotation-details/quotation-details.component';

@Component({
  selector: 'app-press-quotations',
  templateUrl: './press-quotations.component.html',
  styleUrls: ['./press-quotations.component.css']
})
export class PressQuotationsComponent implements OnInit {

 
  constructor( private _Quotationservice :QuotationService
    ,public dialog: MatDialog
    ,private router : Router
    ) 
  { }
 
    showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};
 
  Quotations : Array<any>=[];

  ngOnInit(): void {
    this.LoadSalesOrders();
  } 

 
  LoadSalesOrders(){
    
    this.dtOptions = { 
      pagingType: 'full_numbers', 
      pageLength: 5, 
      processing: true
    }; 

    this.Quotations=[];
     this.showspinner=true;
    this._Quotationservice.getAll().subscribe((data)=>{  
      this.Quotations=data;   
       this.showspinner=false;

  });
  }


     
  openDialog(id:number): void {
    const dialogRef = this.dialog.open(QuotationDetailsComponent, {
      width: '800px',
      height:'500px',
      data: { QuotationId: id  }
    });

    this.router.events
    .subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(res => {
       
    });
  }

}
