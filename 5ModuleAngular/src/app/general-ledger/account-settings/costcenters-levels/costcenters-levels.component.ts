import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CostCentersLevelsService } from 'src/app/Core/Api/GL/cost-centers-level.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-costcenters-levels',
  templateUrl: './costcenters-levels.component.html',
  styleUrls: ['./costcenters-levels.component.css'],
})
export class CostcentersLevelsComponent implements OnInit {
  rowCount: any;
  myForm!: FormGroup;
  b_data!: boolean;

  constructor(
    private fb: FormBuilder,
    private _costCentersLevels: CostCentersLevelsService,
    private _notification: NotificationServiceService,
    private _router: Router,
    private userservice: UserService
  ) {
    this.myForm = this.fb.group({
      formArrayList: this.fb.array([]),
    });
  }
  get formArrayList(): FormArray {
    return this.myForm.get('formArrayList') as FormArray;
  }

  ngOnInit(): void {
    this.showspinner=true;
    this.getLevels();
    this.showspinner=false;
  }

  newsalesdetails(line: number = 0): FormGroup {
    return this.fb.group({
      n_DataAreaID: '',
      n_level_id: line,
      n_level_width: '',
    });
  }

  OnInput(event: Event) {
    this.formArrayList.clear();
    const htmlInputElement = event.target as HTMLInputElement;
    this.rowCount = +htmlInputElement.value;
    for (var i = 0; i < this.rowCount; i++) {
      this.formArrayList.push(
        this.newsalesdetails(this.formArrayList.length + 1)
      );
    }
  }

  getLevels() {
    debugger;
    this._costCentersLevels.get().subscribe((data) => {
      if (data.length > 0) this.b_data = true;
      else this.b_data = false;

      data.forEach((item) => {
        this.formArrayList.push(
          this.fb.group({
            n_DataAreaID: [item.n_DataAreaID],
            n_level_id: [item.n_level_id],
            n_level_width: [item.n_level_width],
          })
        );
      });
      this.rowCount =
        this.formArrayList.length == 0 ? '' : this.formArrayList.length;
    });
  }

  validateForm(): boolean {
    let i = 0;
    if (this.rowCount > 0) {
      for (let c of this.formArrayList.controls) {
        if (
          (
            (this.myForm.get('formArrayList') as FormArray).at(i) as FormGroup
          ).get('n_level_width')?.value == null ||
          (
            (this.myForm.get('formArrayList') as FormArray).at(i) as FormGroup
          ).get('n_level_width')?.value == 0
        ) {
          this.showspinner = false;
          this._notification.ShowMessage(
            `من فضلك يجب ان تدخل عدد الارقام للمستوي رقم${i + 1}`,
            2
          );
          return false;
        }
        i++;
      }
    } else {
      this.showspinner = false;
      this._notification.ShowMessage(`من فضلك ادخل عدد المستويات اولآ`, 2);
      return false;
    }
    return true;
  }

  showspinner: boolean = false;
  Save() {
    debugger;
    if (!this.validateForm()) {
      return;
    }

    this.showspinner = true;
    var formData: any = new FormData();

    for (var i = 0; i < this.formArrayList.length; i++) {
      formData.append('costModelList[' + i + '].n_DataAreaID', this.myForm.value.formArrayList[i].n_DataAreaID);
      formData.append(
        'costModelList[' + i + '].n_level_id',
        this.myForm.value.formArrayList[i].n_level_id
      );
      formData.append(
        'costModelList[' + i + '].n_level_width',
        this.myForm.value.formArrayList[i].n_level_width
      );
    }

    this._costCentersLevels.post(formData).subscribe((data) => {
      this.showspinner = false;
      this._notification.ShowMessage(data.msg, data.status);
      if (data.status == 1) {
        this._router.navigate(['/']);
        this.myForm = this.fb.group({
          salesdetails: this.fb.array([]),
        });
      }
    });
  }
}
