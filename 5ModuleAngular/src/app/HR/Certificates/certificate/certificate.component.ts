import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CertificateService } from 'src/app/Core/Api/HR/certificate.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  py_cerificates!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  certificateId: number = 0;

  constructor(private _service: CertificateService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_cerificates = this._formBuilder.group({
      n_certificate_id: [''],
      s_certificate_name: ['', Validators.required],
      s_certificate_name_eng: [''],
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
    this.certificateId = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    if(this.certificateId <= 0)
    {
      this._service.GetNextCertificate().subscribe((data) => {
        this.py_cerificates.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.certificateId > 0)
    {
      this._service.GetByID(this.certificateId).subscribe((data) => {
        this.py_cerificates.patchValue(data);
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
    formData.append('n_certificate_id', this.py_cerificates.value.n_certificate_id ?? 0);
    formData.append('s_certificate_name', this.py_cerificates.value.s_certificate_name ?? '');
    formData.append('s_certificate_name_eng', this.py_cerificates.value.s_certificate_name_eng ?? '');
    formData.append('n_DataAreaID', this.py_cerificates.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_cerificates.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_cerificates.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_cerificates.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_cerificates.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_cerificates.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_cerificates.value.n_current_year ?? 0);

    if(this.certificateId !=null && this.certificateId > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/certificateslist']);
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
          this._router.navigate(['/hr/certificateslist']);
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
