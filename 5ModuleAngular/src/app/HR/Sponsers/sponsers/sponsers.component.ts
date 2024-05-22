import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SponsersService } from 'src/app/Core/Api/HR/sponsers.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-sponsers',
  templateUrl: './sponsers.component.html',
  styleUrls: ['./sponsers.component.css']
})
export class SponsersComponent implements OnInit {
  Py_Sponsers!: FormGroup;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  sponserId: number = 0;

  TypesList: any[] = [];

  constructor(private _service: SponsersService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.Py_Sponsers = this._formBuilder.group({
      n_Sponser_id: [''],
      s_Sponser_name: ['', Validators.required],
      s_Sponser_name_eng: [''],
      n_type: ['', Validators.required],
      s_tel: [''],
      s_address: [''],
      s_Computer_No: [''],
      s_FileInGawazat: [''],
      s_FileInWorkOffice: [''],
      s_FileInSocialInsur: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.sponserId = Number( this._activatedRoute.snapshot.paramMap.get('id') );

    this._service.GetTypes().subscribe((data) => {
      this.TypesList = data;
    });

    if(this.sponserId <= 0)
    {
      this._service.GetNextSponser().subscribe((data) => {
        this.Py_Sponsers.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.sponserId > 0)
    {
      this._service.GetByID(this.sponserId).subscribe((data) => {
        this.Py_Sponsers.patchValue(data);
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    formData.append('n_Sponser_id', this.Py_Sponsers.value.n_Sponser_id ?? 0);
    formData.append('s_Sponser_name', this.Py_Sponsers.value.s_Sponser_name ?? '');
    formData.append('s_Sponser_name_eng', this.Py_Sponsers.value.s_Sponser_name_eng ?? '');
    formData.append('n_type', this.Py_Sponsers.value.n_type ?? 0);
    formData.append('s_tel', this.Py_Sponsers.value.s_tel ?? '');
    formData.append('s_address', this.Py_Sponsers.value.s_address ?? '');
    formData.append('s_Computer_No', this.Py_Sponsers.value.s_Computer_No ?? '');
    formData.append('s_FileInGawazat', this.Py_Sponsers.value.s_FileInGawazat ?? '');
    formData.append('s_FileInWorkOffice', this.Py_Sponsers.value.s_FileInWorkOffice ?? '');
    formData.append('s_FileInSocialInsur', this.Py_Sponsers.value.s_FileInSocialInsur ?? '');
    formData.append('n_DataAreaID', this.Py_Sponsers.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.Py_Sponsers.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.Py_Sponsers.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.Py_Sponsers.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.Py_Sponsers.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.Py_Sponsers.value.n_current_company ?? 0);
    formData.append('n_current_year', this.Py_Sponsers.value.n_current_year ?? 0);

    if(this.sponserId !=null && this.sponserId > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/sponserslist']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/sponserslist']);
        }
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
