import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RejectedGoodsService } from 'src/app/Core/Api/AP/rejected-goods.service';
import { formatDate } from '@fullcalendar/core/formatting-api';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { Router } from '@angular/router';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-rejected-goods',
  templateUrl: './rejected-goods.component.html',
  styleUrls: ['./rejected-goods.component.css']
})
export class RejectedGoodsComponent implements OnInit {
  ap_rejected_goods_details!: FormGroup;
  showspinner: boolean = false;
  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];
  isEnglish:boolean=false
  timeout!: any;

  constructor(private _service: RejectedGoodsService, public dialogRef: MatDialogRef<RejectedGoodsComponent>
  ,@Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,
  private _notification: NotificationServiceService, private _router: Router, public dialog: MatDialog)
  {
    this.ap_rejected_goods_details = this._formBuilder.group({
      ap_rejected_goods_detailsLST: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.addNewRejectedRow();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  get ap_rejected_goods_detailsLST(): FormArray{
    return this.ap_rejected_goods_details.get('ap_rejected_goods_detailsLST') as FormArray;
  }

  newRejectedGoodsRow(line: number = 0){
    this._formBuilder.group({
      n_doc_no: '',
      nLineNo: '',
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_qty: '',
      s_notes: ''
    });
  }

  addNewRejectedRow()
  {
    this.ap_rejected_goods_detailsLST.push(this.newRejectedGoodsRow(this.ap_rejected_goods_detailsLST.length + 1));
  }

  currentItemIndex: number = 0;
  loadItems(i: number) {
    this.currentItemIndex=i;
     const dialogRef = this.dialog.open(ItemsdetailsLookUpComponent, {
       width: '700px',
       height:'600px',
       data: {  }
     });

     dialogRef.afterClosed().subscribe(res => {
      this.isItemExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
      ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
      ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
      ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue('');
    });
  }

  onKeyItemSearch(event: any, i) {
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeItemListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeItemListing(value: string, i) {
  this._service.GetItemName(value).subscribe((data) => {
    if(data.itemName != '' && data.itemName != null){
      this.isItemExist[i] = true;
      ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.itemName);
    }
    else{
      this.isItemExist[i] = false;
      ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
    }
  });
  }

  currentUnitIndex: number = 0;
  loadUnits(i: number) {
    this.currentUnitIndex=i;
    let itemID=  ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

    const dialogRef = this.dialog.open(UnitsLookUpComponent, {
      width: '700px',
      height:'600px',
      data: {  'itemId': itemID  }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.isUnitExist[i] = true;
      if(res != undefined)
        this.resetDetailsValues(i);
     ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
     ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
    });
  }

  onKeyUnitSearch(event: any, i) {
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeUnitListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeUnitListing(value: number, i) {
    debugger;
    var itemId = ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this._service.GetUnitName(value, itemId).subscribe((data) => {
      debugger
      if(data.unitName != '' && data.unitName != null){
        this.isUnitExist[i] = true;
        ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.unitName);
      }
      else{
        this.isUnitExist[i] = false;
        ((this.ap_rejected_goods_details.get("ap_rejected_goods_detailsLST") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
      }
    });
  }

  resetDetailsValues(i: number)
  {
    ((this.ap_rejected_goods_details.get('ap_rejected_goods_detailsLST') as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ap_rejected_goods_details.get('ap_rejected_goods_detailsLST') as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    ((this.ap_rejected_goods_details.get('ap_rejected_goods_detailsLST') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
  }

  Save()
  {
    this.showspinner = true;

    var formData = new FormData();
    for(var i = 0; i < this.ap_rejected_goods_detailsLST.length; i++)
    {
      formData.append(`ap_rejected_goods_details[${i}].n_doc_no`, this.ap_rejected_goods_details[i].n_doc_no ?? 0);
      formData.append(`ap_rejected_goods_details[${i}].n_DataAreaID`, this.ap_rejected_goods_details[i].n_DataAreaID ?? 0);
      formData.append(`ap_rejected_goods_details[${i}].d_UserAddDate`, this.ap_rejected_goods_details[i].d_UserAddDate ?? '');
      formData.append(`ap_rejected_goods_details[${i}].d_UserUpdateDate`, this.ap_rejected_goods_details[i].d_UserUpdateDate ?? '');
      formData.append(`ap_rejected_goods_details[${i}].nLineNo`, this.ap_rejected_goods_details[i].nLineNo ?? 0);
      formData.append(`ap_rejected_goods_details[${i}].s_item_id`, this.ap_rejected_goods_details[i].s_item_id ?? '');
      formData.append(`ap_rejected_goods_details[${i}].n_qty`, this.ap_rejected_goods_details[i].n_qty ?? 0);
      formData.append(`ap_rejected_goods_details[${i}].n_unit_id`, this.ap_rejected_goods_details[i].n_unit_id ?? 0);
      formData.append(`ap_rejected_goods_details[${i}].s_notes`, this.ap_rejected_goods_details[i].s_notes ?? '');
    }

    this.disableButtons();
    this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
        this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.dialogRef.close();
      }
    });
  }

  isNumberKey(evt)
  {
     var charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode != 46 && charCode > 31
       && (charCode < 48 || charCode > 57) || charCode == 45)
        return false
     return true;
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  removeDetailsRow(i: number)
  {
    this.ap_rejected_goods_detailsLST.removeAt(i);
  }
}
