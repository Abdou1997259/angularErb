import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';

@Component({
  selector: 'app-customers-lookup',
  templateUrl: './customers-lookup.component.html',
  styleUrls: ['./customers-lookup.component.css']
})
export class CustomersLookupComponent implements OnInit {

  constructor(private  _customerService : CustomerService
    ,public dialogRef: MatDialogRef<CustomersLookupComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }
  currentPage!:number;
  page = 1;
  items: any;
  itemsPerPage = 10;
  totalItems : any;
  KeyWord:any;
  ngOnInit(): void {
    this.getAllData(1);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }
  getAllData(page:number=0) {

    this._customerService.GetCustomersLkp(page,this.itemsPerPage,this.KeyWord).subscribe(data=>{
      console.log(data);
      this.items =  data.modelNameLST;
      this.totalItems = data.totalItems;
    });

    };

    pageChanged(page: any){
      this.getAllData(page.page);
    }
      keyupTimer:any;
    DoSearch(){
      clearTimeout(this.keyupTimer);
      this.keyupTimer =    setTimeout(() => {
          this.getAllData(1);
      }, 3000);


    }

    onCloseClick() {
      this.dialogRef.close();
    }
}
