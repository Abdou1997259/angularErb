import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, debounceTime, delay, filter, map, takeUntil, tap } from 'rxjs';
import { customer } from '../_model/Cutomer/CustomerModel';
import { CustomerService } from '../_Services/Customer/customer.service';
import { DataSharingService } from '../_Services/General/data-sharing.service';
import { LoaderServiceService } from '../_Services/General/loader-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxConfirmBoxService } from 'ngx-confirm-box'; 
import { MatDialog } from '@angular/material/dialog';
import { ProcedurePopUpComponent } from './procedure-pop-up/procedure-pop-up.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from '../_Services/user.service';
import { BaseComponent } from '../base/base.component';
import { TableColumn } from '../shared/table/TableColumn';
 
import { createNewUserData } from './mockdata';
import { TableBtn } from '../shared/table/TableBtn';
import { BANKS } from '../shared/demodata';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent extends BaseComponent implements OnInit {


  bgColor           ='rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading    = '';
  confirmContent    = "هل متأكد من حذف العميل ؟ ";
  confirmCustomerContent = "هل متأكد من عملية التعميد ؟ ";
  confirmCanceltext = "لا";
  confirmOkaytext   = "نعم";
  name: any;
  color: any;
 
  
  constructor(private _customerService : CustomerService
    ,private    userservice:UserService
    ,private dataSharingService:DataSharingService,private toastr: ToastrService
    ,private confirmBox: NgxConfirmBoxService
    ,public dialog: MatDialog
    , private _notification: NotificationServiceService
    ,private _router  : Router
    ,private  route: ActivatedRoute
   
    ) { 
    super( route.data,userservice);
   
  }
 



  showspinner:boolean=false;
  dtOptions: DataTables.Settings = {};
 
  customers : Array<customer>=[];

  testdata:any;
  override ngOnInit(): void {
  
    this.LoadCustomers();
  
    this.initalTempData();
 



  } 

 filteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
 searching:boolean=false;
search(value :string ){
  this.searching=true;
   
  this._customerService.GetAllCustomer().subscribe(res=>{
    this.customers=res; 
  
    console.log(this.customers.filter(x => x.s_customer_name.toLowerCase().indexOf(value) > -1));
    this.filteredServerSide.next(  this.customers.filter(x => x.s_customer_name.toLowerCase().indexOf(value) > -1));
    this.searching=false;
  }) 
}

  CustomerForm = new FormGroup({
    n_customer_id: new FormControl(),  
  });

  Save(){
    console.log(this.CustomerForm.value);
  }
  
 
 


  

  LoadCustomers(){
    
    this.dtOptions = { 
      pagingType: 'full_numbers', 
      pageLength: 5, 
      processing: true
    }; 

    this.customers=[];
    this.showspinner=true;
    this._customerService.GetAllCustomer().subscribe((data)=>{  
      this.customers=data;  
      
      this.testdata=data;


  // this.CustomerForm.patchValue({
  //     n_customer_id:8
  //   });

      this.showspinner=false;

  });
  }


 

confirmChange(showConfirm:boolean){
    if(showConfirm){
      this.showspinner=true;
      this._customerService.DeleteCustomer(this.currentcustomer.n_customer_id).subscribe((data)=>{  
      
        this.showspinner=false;
        this._notification.ShowMessage(data.UserMessage,data.StatusCode);
        
        if(data.StatusCode==1){
          setTimeout(() => {
            this.LoadCustomers();
          }, 1000);
        }
        
    });
   
    }
}
currentcustomer:any={};
  DeleteCustomer(customer:any){

    this.currentcustomer=customer;
    this.confirmBox.show();

  }


  ConfirmCustomer(customerId:number){
    this.showspinner=true;
    this._customerService.ConfirmCustomer(customerId).subscribe((data)=>{  
    
      this.showspinner=false;
      this._notification.ShowMessage(data.UserMessage,data.StatusCode);
 
       
  });
  }

   
  openDialog(id:number): void {
    const dialogRef = this.dialog.open(ProcedurePopUpComponent, {
      width: '700px',
      height:'500px',
      data: { n_customer_id: id  }
    });

    this._router.events
    .subscribe(() => {
      dialogRef.close();
    });


    dialogRef.afterClosed().subscribe(res => {
      this.color = res;
    });
  }


  OpenSalesOrder(customer:customer){
    if(!customer.b_confirm){
      this._notification.ShowMessage('من فضلك قم بتعميد العميل أولا',2);
      return;
    }
     this._router.navigate(['sales/newSalesOrder/'+customer.n_real_customer_id+'/'+ customer.s_customer_name]);
  }

  //test table

  introText = 'Button actions and payloads come here in textual form';
  columns: TableColumn[]=[];   // this will define what you pass over to the table
  buttons: TableBtn[]=[];      // this will define what you pass over to the table
  custdata: any=[];         // this is example data but you can use any object to pass to the table
  totalVolume: number = 0;  // this is an example field used to show how you can access filtered data from the table
  totalRides: number = 0;
  footer: string = '';      // in this example I'm using a dynamic footer which changes with the filtered data

  
  initalTempData(){
    // Create 100 userdata objects
    this.custdata = Array.from({length: 100}, (_, k) => createNewUserData(k + 1));
 
    this.columns = [
      { columnDef: 'date',     header: 'date',    cell: (element: any) => `${element.date.toLocaleDateString()}` },
      { columnDef: 'name',     header: 'Name',     cell: (element: any) => `${element.name}` },
      { columnDef: 'volume',   header: 'Volume',   cell: (element: any) => `${element.volume} m³` },
      { columnDef: 'rides',    header: 'Trips',    cell: (element: any) => `${element.rides}` },
      { columnDef: 'material', header: 'Material', cell: (element: any) => `${element.material}` },
    ];

    
    this.buttons = [
      { styleClass: 'btn btn-success px-2',     icon: 'note_add',    payload: (element: any) => `${element.id}`, action: 'add' },
      { styleClass: 'btn btn-primary px-2',     icon: 'build',    payload: (element: any) => `${element.id}`, action: 'edit' },
    ];

    this.custdata.forEach(user => {
      this.totalVolume = this.totalVolume + parseInt(user.volume);
      this.totalRides = this.totalRides + user.rides;
    });
    this.footer = `Total volume: ${this.totalVolume}m³ / trips: ${this.totalRides}`;
  }

  
  // Use the filtered data from the table and modify the footer accordingly
  applyFilter(filteredData: any[]) {
    this.totalVolume = 0;
    this.totalRides = 0;
    filteredData.forEach(user => {
      this.totalVolume = this.totalVolume + parseInt(user.volume);
      this.totalRides = this.totalRides + user.rides;
    });
    this.footer = `Total volume: ${this.totalVolume}m³ / trips: ${this.totalRides}`;
  }

  // Here we can get the action  from the table
  buttonClick(result: string[]) {
    this.introText = `action: ${result[0]}, payload ${result[1]}`;
    console.log(this.introText);
  }

 

}
