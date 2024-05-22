import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from 'src/app/Core/Api/SC/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpViewModel } from 'src/app/Core/model/SC/empolyee';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UnitsService } from 'src/app/Core/Api/SC/units.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { matSelectAnimations } from '@angular/material/select';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.css'],
})
export class AddUnitComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private unitService: UnitsService,
    private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService,
    private router: Router
  ) {
    this.UnitForm = this.fb.group({
      n_unit_id: [''],
      s_unit_name: ['', Validators.required],
      s_unit_name_eng: '',
      n_DataAreaID:'',
      n_UserAdd:'',
      d_UserAddDate:'',
      n_current_branch:'',
      n_current_company:'',
      n_current_year:''
    });
  }


  UnitForm!: FormGroup;
  unitID!: any;
  showspinner: boolean = false;
  isEnglish: boolean = false;

  @ViewChild('showInputid') showInputid!: ElementRef;

  ngOnInit(): void {
    this.unitID = this._activatedRoute.snapshot.paramMap.get('id');

    if (this.unitID != null && this.unitID > 0) {
      this.showspinner = true;
      this.unitService.getUnitByID(this.unitID).subscribe((data) => {
        debugger;
        this.UnitForm.patchValue(data);
        this.showspinner = false;
      });
    }

    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  save() {
    this.showspinner=true;
    this.disableButtons();
    var formData: any = new FormData();
    formData.append('n_unit_id', this.UnitForm.value.n_unit_id ?? 0);
    formData.append('s_unit_name', this.UnitForm.value.s_unit_name);
    formData.append('s_unit_name_eng', this.UnitForm.value.s_unit_name_eng);
    formData.append("n_DataAreaID", this.UnitForm.value.n_DataAreaID ?? 0);
    formData.append("n_UserAdd", this.UnitForm.value.n_UserAdd ?? 0);
    formData.append("d_UserAddDate", this.UnitForm.value.d_UserAddDate);

    if(this.unitID !=null && this.unitID > 0 )
    {
      this.unitService.EditUnit(formData).subscribe((data) => {
        this.showspinner=false;
        this.enableButtons();
        if ((data.status = 1)) {
          let comingMsg = this.isEnglish ? data.Emsg : data.msg;
          this._notification.ShowMessage(comingMsg, 1);
          this.router.navigate(['sc/units']);
          this.UnitForm = this.fb.group({
            n_unit_id: [''],
            s_unit_name: ['', Validators.required],
            s_unit_name_eng: '',
          });
        }
      });
    }
    else
    {
      this.unitService.createUnit(formData).subscribe((data) => {
        this.showspinner=false;
        this.enableButtons();
        if ((data.status = 1)) {
          let comingMsg = this.isEnglish ? data.Emsg : data.msg;
          this._notification.ShowMessage(comingMsg, 1);
          this.router.navigate(['sc/units']);
          this.UnitForm = this.fb.group({
            n_unit_id: [''],
            s_unit_name: ['', Validators.required],
            s_unit_name_eng: '',
          });
        }
      });
    }

  }

  
  disableButtons() {
    debugger;
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

}
