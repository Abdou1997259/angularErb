import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ScGroupsLevelsService } from 'src/app/Core/Api/SC/sc-groups-levels.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-sc-groups-levels',
  templateUrl: './sc-groups-levels.component.html',
  styleUrls: ['./sc-groups-levels.component.css']
})
export class ScGroupsLevelsComponent implements OnInit {
 isEnglish:boolean=false
  myForm!: FormGroup;
  rowCount!: any;
  b_data: boolean = false;
  showspinner: boolean = false;

  constructor(private _scGroupsLevelsService: ScGroupsLevelsService, private _formBuilder: FormBuilder, private _notification: NotificationServiceService) {
    this.myForm = this._formBuilder.group({
      formList: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.getGroupsLevels();
    
    this.isEnglish=LangSwitcher.CheckLan();
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
  }

  get formList(): FormArray {
    return this.myForm.get('formList') as FormArray;
  }

  newFormRow(lineNo: number = 0): FormGroup {
    return this._formBuilder.group({
      n_level_id: lineNo,
      n_level_width: ''
    });
  }

  OnInput(event: Event) {
    debugger;
    this.formList.clear();
    const htmlInputElement = event.target as HTMLInputElement;
    this.rowCount = +htmlInputElement.value;
    for(var i = 0; i < this.rowCount; i++) {
      this.formList.push(
        this.newFormRow(this.formList.length + 1)
      );
    }
  }

  getGroupsLevels() {
    this._scGroupsLevelsService.get().subscribe((data) => {
      if(data.length > 0) { this.b_data = true; }
      else { this.b_data = false; }

      data.forEach((level) => {
        this.formList.push(this._formBuilder.group({
          n_level_id: [level.n_level_id],
          n_level_width: [level.n_level_width]
        }));
      });
      this.rowCount = this.formList.length == 0 ? '' : this.formList.length;
    });
  }

  validateForm(): boolean {
    let i = 0;
    if (this.rowCount > 0) {
      for (let c of this.formList.controls) {
        if (
          (
            (this.myForm.get('formList') as FormArray).at(
              i
            ) as FormGroup
          ).get('n_level_id')?.value == null ||
          (
            (this.myForm.get('formList') as FormArray).at(
              i
            ) as FormGroup
          ).get('n_level_width')?.value == 0
        ) {
          this.showspinner = false;
          if(this.isEnglish)
          {
            this._notification.ShowMessage(
              `Please insert number for lever ${i+1}`,
              2
            );
          }
          else
          {
            this._notification.ShowMessage(
              `من فضلك يجب ان تدخل عدد الارقام للمستوي رقم${i + 1}`,
              2
            );
          }
      
          return false;
        }
        i++;
      }
    } else {
      this.showspinner = false;
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert leveles ',2)
      else
      this._notification.ShowMessage(`من فضلك ادخل عدد المستويات اولآ`, 2);
      return false;
    }
    return true;
  }


  Save() {
    if (!this.validateForm()) {
      return;
    }

    this.showspinner = true;
    var formData: any = new FormData();
    debugger;
    for (var i = 0; i < this.myForm.value.formList.length; i++) {
      // formData.append('groupsLevelsModelList[' + i + '].n_DataAreaID', this.myForm.value.formList[i].n_DataAreaID);
      formData.append( 'groupsLevelsModelList[' + i + '].n_level_id', this.myForm.value.formList[i].n_level_id );
      formData.append( 'groupsLevelsModelList[' + i + '].n_level_width', this.myForm.value.formList[i].n_level_width );
    }

    this._scGroupsLevelsService.post(formData).subscribe((data) => {
      this.showspinner = false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status)
    else
      this._notification.ShowMessage(data.msg, data.status);
    });
  }
}
