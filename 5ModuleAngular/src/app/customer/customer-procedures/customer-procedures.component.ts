import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxConfirmBoxService } from 'ngx-confirm-box';
import { CustomerProcVM } from 'src/app/_model/Cutomer/CustomerProcVM';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ProcedurePopUpComponent } from '../procedure-pop-up/procedure-pop-up.component';

@Component({
  selector: 'app-customer-procedures',
  templateUrl: './customer-procedures.component.html',
  styleUrls: ['./customer-procedures.component.css']
})
export class CustomerProceduresComponent implements OnInit {

  constructor(private _customerService : CustomerService
    ,private activatedRoute: ActivatedRoute
    ,private dataSharingService:DataSharingService
    ,private confirmBox: NgxConfirmBoxService
    ,public dialog: MatDialog
    , private _notification: NotificationServiceService
    ,private router : Router
    
    ) { }

    showspinner:boolean=false;
    currentId:any;
    customerProcedures:Array<CustomerProcVM>=[];
  ngOnInit(): void {
     this.currentId= this.activatedRoute.snapshot.paramMap.get('id');
     this.GetAllProcedures();
  }

  GetAllProcedures(){
    this.showspinner=true;
    this._customerService.GetAllCustomerProcedures(this.currentId).subscribe(data=>{
      
        this.customerProcedures= data; 
        this.showspinner=false;
        console.log(this.customerProcedures); 
    })
  }

  openDialog(id:number): void {
    const dialogRef = this.dialog.open(ProcedurePopUpComponent, {
      width: '700px',
      height:'500px',
      data: { n_customer_id: id  }
    });
    dialogRef.afterClosed().subscribe(res => {
       this.GetAllProcedures();
    });
  }


  PrintProcedures(){

    this.router.navigate(['/reports', {data: 'customers/printProcedures?id='+this.currentId }]);

  }  

}
