import { map } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SCTransTypeService } from 'src/app/Core/Api/SC/sc-trans-types.service';
import { ScStockInAddComponent } from 'src/app/SC/StockIn/sc-stock-in-add/sc-stock-in-add.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trans-source-types',
  templateUrl: './trans-source-types.component.html',
  styleUrls: ['./trans-source-types.component.css']
})
export class TransSourceTypesComponent implements OnInit {
  rowId: any;
  formData: any;
  formName: string = "";
  headers: any;
  values: any[] = [];
  tableData: any[] = [];
  _object: any={};
  _arr: any={};
  key: string='key';
  isChecked: boolean = false;
  checkedVal: any[] = [];
  str = "";
  testData!: any;

  constructor( public dialogRef: MatDialogRef<TransSourceTypesComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, private _scTypesSourceService: SCTransTypeService, private _formBuilder: FormBuilder, private _notification: NotificationServiceService) {
      this.formData = this._formBuilder.group({
        formName: '',
        n_doc_no:'',
        d_doc_date: '',
        s_type:new FormControl('like'),
        Search: '',
        gridHeaders: this._formBuilder.array([]),
        valueRows: this._formBuilder.array([]),
      });
     }

  ngOnInit(): void {
    this._scTypesSourceService.GetTranSourceTypeHeaders(this.data.id).subscribe((formData) => {

      this.formName = formData.data.formName;
      this.formData.patchValue({formName: formData.data['formName']});

      this.headers = formData.data.gridHeaders;
      
      formData.data.valueRows.forEach(element1 => {
        this._object={};
        var i=0;
        element1.gridCols.forEach(element2 => {
          this._object = Object.assign({[i]:element2.value }, this._object);
          i++;
        });
        this.tableData.push(this._object);
      });

      // this.tableData.shift();
      // debugger;
      //  this.testData =  new Map(formData.data.valueRows.gridCols.map((obj) => [obj.col, obj.value]));
    })

    this.addHedaers();
  }

  loadData(event: any) {
    var searchId = event.target.value;
    this.tableData = [];
    this._scTypesSourceService.GetTranSourceTypeHeaders(this.data.id, searchId).subscribe((formData) => {
      debugger
      formData.data.valueRows.forEach(element1 => {
        this._object={};
        element1.gridCols.forEach(element2 => {
          this._object = Object.assign({}, { [element2.col]:element2.value }, this._object);
        });
        this.tableData.push(this._object);
      });
      // this.tableData.shift();
    });
  }

  get gridHeaders(): FormArray {
    return this.formData.get('gridHeaders') as FormArray;
  }
  get valueRows(): FormArray {
    return this.formData.get('valueRows') as FormArray;
  }
  newHeadersRow(line: number = 0): FormGroup {
    return this._formBuilder.group({
      header: '',
    });
  }
  addHedaers() {
    this.gridHeaders.push(this.newHeadersRow(this.newHeadersRow.length + 1));
  }
  newValuesRow(line: number = 0): FormGroup {
    return this._formBuilder.group({
      col: '',
      value: ''
    });
  }

  selectItem(item:any){
    this.dialogRef.close({ data: item });
  }

  getRowId(rowNo) {
    this.rowId = rowNo;
   }

   onChecked(event) {
    if(event.target.checked){
      this.isChecked = true;
      for(var i = 1; i< this.tableData.length; i++) {
        this.checkedVal.push(i);
      }
    }else{
      this.isChecked = false;
      this.checkedVal = [];
    }
   }

   getRowNumber(event, i: number) {
    if(event.target.checked) {
      this.checkedVal.push(i);
    }else
    {
      this.checkedVal.forEach( (item, index) => {
        if(item === i) this.checkedVal.splice(index,1);
      });
    }
   }

   getRows() {
    var dataList: any[] = [];
    var typeId = this.data.id;
    dataList.push(typeId);
    for (let i = 0; i < this.checkedVal.length; i++) {
      if(this.str=="")
        this.str += "'"+this.tableData[this.checkedVal[i]][0] + "'";
      else
        this.str += ", '"+this.tableData[this.checkedVal[i]][0] + "'";
    }
    dataList.push(this.str);
    // str = this.tableData[this.checkedVal[0]].n_doc_no;
    this.selectItem(dataList);
    // if(this.checkedVal.length > 1) {
    //   this. _notification.ShowMessage("لا يمكن اختيار اكثر من حركة",2);
    // }
    // else{
    //   str = this.tableData[this.checkedVal[0]].n_doc_no;
    //   dataList.push(typeId);
    //   dataList.push(str);
    //   // str = this.tableData[this.checkedVal[0]].n_doc_no;
    //   this.selectItem(dataList);
    // }
   }

   SearchDate(){
    var type =this.formData.get("s_type")?.value;
    var searchID= this.formData.get("n_doc_no")?.value;
    var date =this.formData.value.d_doc_date=new DatePipe('en-US').transform(this.formData.value.d_doc_date, 'yyyy/MM/dd');
    var searchDate=(date ==null)?'':date;
    this.headers=[];
    this.tableData=[];
    this._scTypesSourceService.GetTranSourceTypeHeaders(this.data.id,searchID,searchDate,type).subscribe((formData) => {

      this.formName = formData.data.formName;
      this.formData.patchValue({formName: formData.data['formName']});

      this.headers = formData.data.gridHeaders;

      formData.data.valueRows.forEach(element1 => {
        this._object={};
        var i=0;
        element1.gridCols.forEach(element2 => {
          this._object = Object.assign({[i]:element2.value }, this._object);
          i++;
        });
        this.tableData.push(this._object);
      });
      
    })

    this.addHedaers();
   }

   onCloseClick() {
    this.dialogRef.close();
  }
  
}
