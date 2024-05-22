import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsService } from 'src/app/Core/Api/SC/items.service';

@Component({
  selector: 'app-stores-lookup',
  templateUrl: './stores-lookup.component.html',
  styleUrls: ['./stores-lookup.component.css']
})
export class StoresLookupComponent implements OnInit {


  constructor(private  _ItemsService : ItemsService
    ,public dialogRef: MatDialogRef<StoresLookupComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }
  currentPage!:number;
  page = 1;
  items: any;
  itemsPerPage = 10;
  totalItems : any;
  KeyWord:any;
  ngOnInit(): void {
    this.getAllData('');
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }
  getAllData(nameSearch:string='') {

    this._ItemsService.GetItemStores(nameSearch).subscribe(data=>{
      console.log(data);
      this.items =  data;
    });

    };


    pageChanged(page: any){
      this.getAllData(page.page);
    }
      keyupTimer:any;
    DoSearch(){
      clearTimeout(this.keyupTimer);
      this.keyupTimer =    setTimeout(() => {
          this.getAllData(this.KeyWord);
      }, 1000);


    }

    onCloseClick() {
      this.dialogRef.close();
    }
}
