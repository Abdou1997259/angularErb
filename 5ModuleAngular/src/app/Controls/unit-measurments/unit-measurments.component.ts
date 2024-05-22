import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsService } from 'src/app/Core/Api/SC/items.service';

@Component({
  selector: 'app-unit-measurments',
  templateUrl: './unit-measurments.component.html',
  styleUrls: ['./unit-measurments.component.css']
})
export class UnitMeasurmentsComponent implements OnInit {

  constructor(private  _ItemsService : ItemsService
    ,public dialogRef: MatDialogRef<UnitMeasurmentsComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }
  currentPage!:number;
  items: any;
  totalCount : any;
  pageNumber: number = 1;
  pageSize: number = 10;
  KeyWord: string ="";
  ngOnInit(): void {
    this.getAllData('');
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getAllData(nameSearch:string='') {
    this._ItemsService.GetItemUnitMeasure(nameSearch, this.pageNumber, this.pageSize).subscribe(data=>{
      this.items =  data.modelNameLST;
      this.totalCount = data.totalItems;
      this.currentPage=1;
    });
  }

  pageChanged(page: any){
    this._ItemsService.GetItemUnitMeasure(this.KeyWord, page.page, this.pageSize).subscribe(data=>{
      this.items =  data.modelNameLST;
      this.totalCount = data.totalItems;
    });
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
