import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmpPopUpComponent } from '../emp-pop-up/emp-pop-up.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from 'src/app/Core/Api/SC/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpViewModel } from 'src/app/Core/model/SC/empolyee';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { id } from '@swimlane/ngx-charts';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { AccountsPopUpComponent } from '../accounts-pop-up/accounts-pop-up.component';
import { data } from 'jquery';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { CashService } from 'src/app/Core/Api/FIN/cash.service';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css'],
})
export class AddStoreComponent implements OnInit {
  isOnEye: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialog,
    private http: HttpClient,
    private _lookup: GenerealLookup,
    private storeService: StoreService,
    private _activatedRoute: ActivatedRoute,
    private _SERIVCE: CashService,
    private _notification: NotificationServiceService,
    private _LookupControlService : LookupControlService,
    private router: Router
  ) {
    this.storeForm = this.fb.group({
      n_store_id: '',
      s_store_name: ['', Validators.required],
      n_employee_store_id: '',
      s_store_name_eng: '',
      s_related_account_no: ['', Validators.required],
      s_CostOfGoods_acc: ['', Validators.required],
      s_reservedGoodsAcc: ['', Validators.required],
      s_cost_diff_acc: ['', Validators.required],
      s_shortage_acc: ['', Validators.required],
      b_is_exceeding_credit_limit: '',
      b_on_eye_in_store: '',
      n_DataAreaID: '',
      n_UserAdd: '',
      d_UserAddDate: '',
      n_current_branch: '',
      n_current_company: '',
      n_current_year: ''
    });
  }

  showspinner = false;
  storeForm!: FormGroup;
  DocNo!: any;
  isEnglish: boolean = false;

  ngOnInit(): void {
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.storeForm.get('n_store_id')?.patchValue(this.DocNo);

    this.storeService.LoadStoreConfiguration().subscribe((data) => {
      this.isOnEye = data.b_store_on_eye;
      this.storeForm.get('b_on_eye_in_store')?.patchValue(data.b_store_on_eye);
    });

    if (this.DocNo != null && this.DocNo > 0) {
      this.showspinner = true;
      this.storeService.GetStoreById(this.DocNo).subscribe((data) => {
        this.storeForm.patchValue(data);
        this._LookupControlService.SetName(this.storeForm, "Employee", "n_employee_store_id", "employeeName");
        this._LookupControlService.SetName(this.storeForm, "acc", "s_related_account_no", "relatedAccName");
        this._LookupControlService.SetName(this.storeForm, "acc", "s_CostOfGoods_acc", "costAccName");
        this._LookupControlService.SetName(this.storeForm, "acc", "s_reservedGoodsAcc", "reservedAccName");
        this._LookupControlService.SetName(this.storeForm, "acc", "s_cost_diff_acc", "costDiffAccName");
        this._LookupControlService.SetName(this.storeForm, "acc", "s_shortage_acc", "shortageAccName");
        this.showspinner = false;
      });
    }

    this.isEnglish = LangSwitcher.CheckLan();
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
  }

  save() {

    var formData: any = new FormData();
    formData.append('n_store_id', this.storeForm.value.n_store_id ?? 0);
    formData.append('s_store_name', this.storeForm.controls['s_store_name'].getRawValue());
    formData.append('s_store_name_eng', this.storeForm.controls['s_store_name_eng'].getRawValue());
    formData.append('n_employee_store_id', this.storeForm.value.n_employee_store_id);
    formData.append('s_related_account_no', this.storeForm.value.s_related_account_no);
    formData.append('s_CostOfGoods_acc', this.storeForm.value.s_CostOfGoods_acc);
    formData.append('s_reservedGoodsAcc', this.storeForm.value.s_reservedGoodsAcc);
    formData.append('s_cost_diff_acc', this.storeForm.value.s_cost_diff_acc);
    formData.append('s_shortage_acc', this.storeForm.value.s_shortage_acc);
    formData.append('b_is_exceeding_credit_limit',this.storeForm.value.b_is_exceeding_credit_limit ?? false);
    formData.append('b_on_eye_in_store', this.storeForm.value.b_on_eye_in_store ?? false);
    formData.append('n_DataAreaID', this.storeForm.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.storeForm.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.storeForm.value.d_UserAddDate);

    this.disableButtons();

    if (this.DocNo != null && this.DocNo > 0) {
      this.storeService.editStore(formData).subscribe((data) => {
        if ((data.status = 1))
        {
          if (this.isEnglish)
            this._notification.ShowMessage(data.Emsg, 1);
          else
            this._notification.ShowMessage(data.msg, 1);
          this.router.navigate(['sc/stores']);
        }
        this.enableButtons();
      });
    } 
    else {
      this.storeService.post(formData).subscribe((data) => {
        if ((data.status = 1))
        {
          if (this.isEnglish)
            this._notification.ShowMessage(data.Emsg, 1);
          else
            this._notification.ShowMessage(data.msg, 1);
          this.router.navigate(['sc/stores']);
        }
        this.enableButtons();
      });
    }
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

}
