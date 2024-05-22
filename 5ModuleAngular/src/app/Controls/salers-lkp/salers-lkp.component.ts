import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalersLKPService } from 'src/app/Core/Api/LookUps/salers-lkp.service';

@Component({
  selector: 'app-salers-lkp',
  templateUrl: './salers-lkp.component.html',
  styleUrls: ['./salers-lkp.component.css']
})
export class SalersLkpComponent implements OnInit {
  salersList!: any;
  pagingCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  searchString: any;
  showspinner: boolean = false;
  rowId: any;

  constructor(private _salersService: SalersLKPService, public dialogRef: MatDialogRef<SalersLkpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getSalersLKP(this.pageNumber);
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getSalersLKP(page: number = 0) {
    this.showspinner = true;
    this._salersService.GetSalersLKP(page, this.pageSize, this.searchString).subscribe((data) => {
      debugger;
      this.salersList = data.modelNameLST;
      this.pagingCount = data.totalItems;
      this.showspinner = false;
    })
  }

  pageChanged(page: any){
    this.getSalersLKP(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.getSalersLKP(this.pageNumber);
    }, 1000);
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onCloseClick() {
    this.dialogRef.close();
  }
}
