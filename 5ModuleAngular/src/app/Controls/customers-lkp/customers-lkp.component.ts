import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomersLKPService } from 'src/app/Core/Api/LookUps/customers-lkp.service';

@Component({
  selector: 'app-customers-lkp',
  templateUrl: './customers-lkp.component.html',
  styleUrls: ['./customers-lkp.component.css']
})
export class CustomersLkpComponent implements OnInit {
  customersList!: any;
  pagingCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _customersService: CustomersLKPService, public dialogRef: MatDialogRef<CustomersLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getCustomersLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getCustomersLKP(page: number = 0) {
    this.showspinner = true;
    this._customersService.GetCustomersLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger;
      this.customersList = data.modelNameLST;
      this.pagingCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getCustomersLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getCustomersLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
