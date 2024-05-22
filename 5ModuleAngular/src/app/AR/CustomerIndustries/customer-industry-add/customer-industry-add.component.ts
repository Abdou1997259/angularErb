import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerIndustriesService } from 'src/app/Core/Api/AR/customer-industries.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-customer-industry-add',
  templateUrl: './customer-industry-add.component.html',
  styleUrls: ['./customer-industry-add.component.css']
})
export class CustomerIndustryAddComponent implements OnInit {
  ar_customers_Industries!: FormGroup;
  showspinner: boolean = false;
  n_Id: number = 0;
  isEnglish:boolean=false;
  constructor(private _service: CustomerIndustriesService,
     private _notification: NotificationServiceService, private _activatedRoute: ActivatedRoute, private _router: Router,
     private _forBuilder: FormBuilder)
  {
    this.ar_customers_Industries = this._forBuilder.group({
      n_Id: new FormControl(''),
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      s_name: new FormControl('', Validators.required),
      s_name_eng: new FormControl(''),
      s_notes: new FormControl('')
    });
  }


  ngOnInit(): void {
    this.showspinner = true;
    this.n_Id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    if(this.n_Id <= 0)
    {
      this._service.GetCurrentIndustry().subscribe((data) => {
        this.ar_customers_Industries.patchValue(data);

        this.showspinner = false;
      });
    }

    if(this.n_Id > 0)
    {
      this._service.GetByID(this.n_Id).subscribe((data) => {
        this.ar_customers_Industries.patchValue(data);

        this.showspinner = false;
      });
    }
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    
    this.isEnglish=LangSwitcher.CheckLan()

  }

  Save()
  {
    if(this.formValidate() == false)
      return
    this.showspinner = true;
    var formData = new FormData();

    formData.append('n_Id', this.ar_customers_Industries?.value.n_Id ?? 0);
    formData.append('n_DataAreaID', this.ar_customers_Industries?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ar_customers_Industries?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ar_customers_Industries?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ar_customers_Industries?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ar_customers_Industries?.value.d_UserUpdateDate ?? '');
    formData.append('s_name', this.ar_customers_Industries?.value.s_name ?? '');
    formData.append('s_name_eng', this.ar_customers_Industries?.value.s_name_eng ?? '');
    formData.append('s_notes', this.ar_customers_Industries?.value.s_notes ?? '');

    if(this.n_Id !=null && this.n_Id > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
      else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customerIndustryList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
      this. _notification.ShowMessage(data.Emsg,data.status);
    else
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customerIndustryList']);
        }
      });
    }
  }

  formValidate(): boolean
  {
    var isValid = true;
    if(this.ar_customers_Industries.value.s_name == null || this.ar_customers_Industries.value.s_name == '')
    {
    
      if(this.isEnglish)
         this._notification.ShowMessage('Please insert activity name', 3);
      else
         this._notification.ShowMessage('من فضلك ادخل اسم النشاط', 3);
      
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
