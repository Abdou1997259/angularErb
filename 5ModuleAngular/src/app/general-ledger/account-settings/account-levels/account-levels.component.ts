import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountlevelsService } from 'src/app/Core/Api/GL/account-levels.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-account-levels',
  templateUrl: './account-levels.component.html',
  styleUrls: ['./account-levels.component.css']
})
export class AccountLevelsComponent implements OnInit {
  rowCount: any;
  levelsForm!: FormGroup;
  b_data!: boolean;

  constructor(
    private fb: FormBuilder,
    private _accountLevelsServices: AccountlevelsService,
    private _notification: NotificationServiceService,
    private _router: Router,
    private userservice:UserService
  ) {
    this.levelsForm = this.fb.group({
      levelsdetails: this.fb.array([]),
    });
  }

  get levelsdetails(): FormArray {
    return this.levelsForm.get('levelsdetails') as FormArray;
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.getLevels();
    this.showspinner = false;
  }

  newsalesdetails(line: number = 0): FormGroup {
    return this.fb.group({
      n_DataAreaID: '',
      n_level_id: line,
      n_level_width: '',
    });
  }

  OnInput(event: Event) {
    this.levelsdetails.clear();
    const htmlInputElement = event.target as HTMLInputElement;
    this.rowCount = +htmlInputElement.value;
    for (var i = 0; i < this.rowCount; i++) {
      this.levelsdetails.push(
        this.newsalesdetails(this.levelsdetails.length + 1)
      );
    }
  }

  getLevels() {
    this._accountLevelsServices.get().subscribe((data) => {
      if (data.length > 0) this.b_data = true;
      else this.b_data = false;

      data.forEach((item) => {
        this.levelsdetails.push(
          this.fb.group({
            n_DataAreaID: [item.n_DataAreaID],
            n_level_id: [item.n_level_id],
            n_level_width: [item.n_level_width],
          })
        );
      });
      this.rowCount =
        this.levelsdetails.length == 0 ? '' : this.levelsdetails.length;
    });
  }

  validateForm(): boolean {
    let i = 0;
    if (this.rowCount > 0) {
      for (let c of this.levelsdetails.controls) {
        if (
          (
            (this.levelsForm.get('levelsdetails') as FormArray).at(
              i
            ) as FormGroup
          ).get('n_level_width')?.value == null ||
          (
            (this.levelsForm.get('levelsdetails') as FormArray).at(
              i
            ) as FormGroup
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
    if (!this.validateForm()) {
      return;
    }

    this.showspinner = true;
    var formData: any = new FormData();
    debugger;
    for (var i = 0; i < this.levelsForm.value.levelsdetails.length; i++) {
      formData.append('accountLevelModelList[' + i + '].n_DataAreaID', this.levelsForm.value.levelsdetails[i].n_DataAreaID);
      formData.append(
        'accountLevelModelList[' + i + '].n_level_id',
        this.levelsForm.value.levelsdetails[i].n_level_id
      );
      formData.append(
        'accountLevelModelList[' + i + '].n_level_width',
        this.levelsForm.value.levelsdetails[i].n_level_width
      );
      // formData.append('accountLevelModelList[' + i + '].comp', this.userservice.GetComp());
      // formData.append('accountLevelModelList[' + i + '].year', this.userservice.GetYear());
    }

    this._accountLevelsServices.post(formData).subscribe((data) => {
      this.showspinner = false;
      this._notification.ShowMessage(data.msg, data.status);
      if (data.status == 1) {
        this._router.navigate(['/']);
        this.levelsForm = this.fb.group({
          salesdetails: this.fb.array([]),
        });
      }
    });
  }
}
