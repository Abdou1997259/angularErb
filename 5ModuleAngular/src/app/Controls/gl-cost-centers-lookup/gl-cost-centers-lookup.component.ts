import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlCostCentersServicesService } from 'src/app/Core/Api/GL/gl-cost-centers-services.service';

@Component({
  selector: 'app-gl-cost-centers-lookup',
  templateUrl: './gl-cost-centers-lookup.component.html',
  styleUrls: ['./gl-cost-centers-lookup.component.css']
})
export class GlCostCentersLookupComponent implements OnInit {

  constructor(private  _glCostCentersService : GlCostCentersServicesService
    ,public dialogRef: MatDialogRef<GlCostCentersLookupComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any ,
    ) { }

  currentPage!:number;
  page = 1;
  items: any;
  itemsPerPage = 10;
  totalItems : any;
  KeyWord:any;
  lastAutoNumber!:number;

  ngOnInit(): void {
    this.getAllData(1);
  }


  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getAllData(page:number=0) {
    this._glCostCentersService.GetGlCostCentersLookUp(page,this.itemsPerPage,this.KeyWord).subscribe(data =>{
      debugger;
      console.log(data);
      this.items =  data.modelNameLST; // Old code => data.costCentersData
      this.totalItems = data.totalItems;
    });

  }

  pageChanged(page: any){
    console.log(page.page);
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
