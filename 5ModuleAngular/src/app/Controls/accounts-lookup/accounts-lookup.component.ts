import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JournalService } from 'src/app/Core/Api/GL/journal.service';

@Component({
  selector: 'app-accounts-lookup',
  templateUrl: './accounts-lookup.component.html',
  styleUrls: ['./accounts-lookup.component.css']
})
export class AccountsLookupComponent implements OnInit {

  constructor(private  _JournalService : JournalService
    ,public dialogRef: MatDialogRef<AccountsLookupComponent>
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

    this._JournalService.GetAccountsLkp(page,this.itemsPerPage,this.KeyWord).subscribe(data=>{
      console.log(data);
      this.items =  data;
      //this.totalItems = data.totalItems;
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
      }, 1000);


    }

    onCloseClick() {
      this.dialogRef.close();
    }
}
