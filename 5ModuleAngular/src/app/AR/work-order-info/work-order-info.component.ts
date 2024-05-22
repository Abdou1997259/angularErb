import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomersLookupComponent } from 'src/app/Controls/customers-lookup/customers-lookup.component';
import { comboOption } from 'src/app/_model/comboOption';
import { QuotationService } from 'src/app/_Services/Customer/quotation.service';

@Component({
  selector: 'app-work-order-info',
  templateUrl: './work-order-info.component.html',
  styleUrls: ['./work-order-info.component.css']
})
export class WorkOrderInfoComponent implements OnInit {

 
  filter :any={FromDate:'',ToDate:'',n_customter_id:0,s_customer_name:'',n_status:0}

 
  OrderStatus :Array<comboOption>= [ ];

  constructor( private _Quotationservice :QuotationService
    ,public dialog: MatDialog
    ,private router : Router
    ) 
  { }
 
 
    showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};
 
  WorkOrders : Array<any>=[];

  ngOnInit(): void {
    this.LoadStatus();
    var formData: any = new FormData();
    this.LoadSalesOrders(formData);
  }

  LoadStatus(){
    this._Quotationservice.GetStatusCombo().subscribe(data=>{
      this.OrderStatus=data;
    });
  }

 
  LoadSalesOrders(filter:any){
    
    this.dtOptions = { 
      pagingType: 'full_numbers', 
      pageLength: 15, 
      processing: true
    }; 

    this.WorkOrders=[];
     this.showspinner=true;
     
    this._Quotationservice.getWorkOrders(filter).subscribe((data)=>{  
      this.WorkOrders=data;   
       this.showspinner=false;

  });
  }
   
  LoadCustomers(){
  
    const dialogRef = this.dialog.open(CustomersLookupComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });
    dialogRef.afterClosed().subscribe(res => {
  
       this.filter.n_customer_id = res.data.n_customer_id;
       this.filter.s_customer_name=res.data.n_customer_id +'-'+ res.data.s_customer_name;
       
      });
  }
  

  search(){
    var formData: any = new FormData();
  
    formData.append("s_from_date", this.filter.FromDate);
    formData.append("s_to_date", this.filter.ToDate);
    formData.append("n_customer_id", this.filter.n_customer_id);
    formData.append("n_status", this.filter.n_status);
    
    this.LoadSalesOrders(formData);


  }

  ClearSearch(){
    this.filter={};
    var formData: any = new FormData();
  
  
    this.LoadSalesOrders(formData);
  }
  // openDialog(id:number): void {
  //   const dialogRef = this.dialog.open(QuotationDetailsComponent, {
  //     width: '800px',
  //     height:'500px',
  //     data: { QuotationId: id  }
  //   });

  //   this.router.events
  //   .subscribe(() => {
  //     dialogRef.close();
  //   });

  //   dialogRef.afterClosed().subscribe(res => {
       
  //   });
  // }

  

}
