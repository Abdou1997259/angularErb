import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { DucutionCatgoryService } from 'src/app/Core/Api/HR/ducution-catgory.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-dedcution-category-add',
  templateUrl: './dedcution-category-add.component.html',
  styleUrls: ['./dedcution-category-add.component.css']
})
export class DedcutionCategoryAddComponent implements OnInit {

  deduction_cat_form!: FormGroup;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  id: number = 0;

  AssetsData: any[] = [];
  AccountsData: any[] = [];
  searchingAsset:boolean=false;
  searchingAccount:boolean=false;
  filteredAssetServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAccountServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: DucutionCatgoryService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.deduction_cat_form = this._formBuilder.group({
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
        this.deduction_cat_form.patchValue(data);
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
    formData.append('n_id', this.deduction_cat_form.value.n_id ?? 0);
    formData.append('s_name', this.deduction_cat_form.value.s_name ?? '');
    formData.append('s_name_eng', this.deduction_cat_form.value.s_name_eng ?? '');
    formData.append('s_notes', this.deduction_cat_form.value.s_notes ?? '');
  
    formData.append('n_DataAreaID', this.deduction_cat_form.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.deduction_cat_form.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.deduction_cat_form.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.deduction_cat_form.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.deduction_cat_form.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.deduction_cat_form.value.n_current_company ?? 0);
    formData.append('n_current_year', this.deduction_cat_form.value.n_current_year ?? 0);

    if(this.id !=null && this.id > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/deductioncat']);
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
          this._router.navigate(['/hr/deductioncat']);
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
