import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { DeserveCategoryService } from 'src/app/Core/Api/HR/deserve-category.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-deserve-cat-add',
  templateUrl: './deserve-cat-add.component.html',
  styleUrls: ['./deserve-cat-add.component.css']
})
export class DeserveCatAddComponent implements OnInit {

  deserve_cat_form!: FormGroup;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  id: number = 0;

  AssetsData: any[] = [];
  AccountsData: any[] = [];
  searchingAsset:boolean=false;
  searchingAccount:boolean=false;
  filteredAssetServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAccountServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: DeserveCategoryService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.deserve_cat_form = this._formBuilder.group({
      n_id: [''],
      s_name: ['', Validators.required],
      s_name_eng: [''],
      s_notes: [''],
      n_value: [''],
      s_Account_No: [''],
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
    this.id = Number( this._activatedRoute.snapshot.paramMap.get('id') );


   

    if(this.id > 0)
    {
      this._service.GetByID(this.id).subscribe((data) => {
        this.deserve_cat_form.patchValue(data);
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }




  Save()
  {
    debugger
    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    formData.append('n_id', this.deserve_cat_form.value.n_id ?? 0);
    formData.append('s_name', this.deserve_cat_form.value.s_name ?? '');
    formData.append('s_name_eng', this.deserve_cat_form.value.s_name_eng ?? '');
    formData.append('s_notes', this.deserve_cat_form.value.s_notes ?? '');
  
    formData.append('n_DataAreaID', this.deserve_cat_form.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.deserve_cat_form.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.deserve_cat_form.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.deserve_cat_form.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.deserve_cat_form.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.deserve_cat_form.value.n_current_company ?? 0);
    formData.append('n_current_year', this.deserve_cat_form.value.n_current_year ?? 0);

    if(this.id !=null && this.id > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/deservecat']);
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
          this._router.navigate(['/hr/deservecat']);
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
