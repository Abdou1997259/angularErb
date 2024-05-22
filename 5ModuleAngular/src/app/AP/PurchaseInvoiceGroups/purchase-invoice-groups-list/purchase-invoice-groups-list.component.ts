import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PurchaseInvoiceGroupService } from 'src/app/Core/Api/AP/purchase-invoice-group.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-purchase-invoice-groups-list',
  templateUrl: './purchase-invoice-groups-list.component.html',
  styleUrls: ['./purchase-invoice-groups-list.component.css']
})
export class PurchaseInvoiceGroupsListComponent implements OnInit {
  purchaseGroupsList: any;
  purchasePagingCount: any;

  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;

  showspinner: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rowId: any;

  constructor(private _purchaseInvoiceGroupService: PurchaseInvoiceGroupService, private _notification: NotificationServiceService) { }

  ngOnInit(): void {
  }

  GetAllPurchasesList(page: number = 0) {
    this.showspinner = true;
    this._purchaseInvoiceGroupService.GetAllPurchaseInvoiceGroup(page, this.pageSize, this.searchString).subscribe((data) => {
      this.purchaseGroupsList = data.modelNameLST;
      this.purchasePagingCount = data.totalItems;
      this.showspinner = false;
    });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

  pageChanged(page: any){
    this.GetAllPurchasesList(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.GetAllPurchasesList(this.pageNumber);
    }, 1000);
  }

  DeleteRow() {
    debugger
    this._purchaseInvoiceGroupService.Delete(this.rowId).subscribe((data)=>{
      debugger;
      this.showspinner=false;
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.GetAllPurchasesList(this.pageNumber);
      }
    });
  }
}
