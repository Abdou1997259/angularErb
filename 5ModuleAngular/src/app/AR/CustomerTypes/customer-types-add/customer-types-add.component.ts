import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerTypesService } from 'src/app/Core/Api/AR/customer-types.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-customer-types-add',
  templateUrl: './customer-types-add.component.html',
  styleUrls: ['./customer-types-add.component.css']
})
export class CustomerTypesAddComponent implements OnInit {
  ar_customers_types!: FormGroup;
  showspinner: boolean = false;
  n_customer_type_id: number = 0;
  isEnglish:boolean=false
  constructor(private _service: CustomerTypesService,
    private _notification: NotificationServiceService, private _activatedRoute: ActivatedRoute, private _router: Router,
    private _forBuilder: FormBuilder)
  {
    this.ar_customers_types = this._forBuilder.group({
      n_customer_type_id: new FormControl(''),
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      s_customer_type_name: new FormControl('', Validators.required),
      s_customer_type_name_eng: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_customer_type_id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    if(this.n_customer_type_id <= 0)
    {
      this._service.GetCurrentType().subscribe((data) => {
        this.ar_customers_types.patchValue(data);

        this.showspinner = false;
      });
    }

    if(this.n_customer_type_id > 0)
    {
      this._service.GetByID(this.n_customer_type_id).subscribe((data) => {
        this.ar_customers_types.patchValue(data);

        this.showspinner = false;
      });
    }
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  Save()
  {
    if(this.formValidate() == false)
      return;

    this.showspinner = true;
    var formData = new FormData();

    formData.append('n_customer_type_id', this.ar_customers_types?.value.n_customer_type_id ?? 0);
    formData.append('n_DataAreaID', this.ar_customers_types?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ar_customers_types?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ar_customers_types?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ar_customers_types?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ar_customers_types?.value.d_UserUpdateDate ?? '');
    formData.append('s_customer_type_name', this.ar_customers_types?.value.s_customer_type_name ?? '');
    formData.append('s_customer_type_name_eng', this.ar_customers_types?.value.s_customer_type_name_eng ?? '');

    if(this.n_customer_type_id !=null && this.n_customer_type_id > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        
        if(this.isEnglish)
       this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customerTypesList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status)
     else
     this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customerTypesList']);
        }
      });
    }
  }

  formValidate(): boolean
  {
    var isValid = true;
    if(this.ar_customers_types.value.s_customer_type_name == null || this.ar_customers_types.value.s_customer_type_name == '')
    {
     
      if(this.isEnglish)
        this._notification.ShowMessage('Please type name' ,3)
      else
        this._notification.ShowMessage('من فضلك ادخل اسم النوع', 3);
      isValid = false;
    }
    return isValid;
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
