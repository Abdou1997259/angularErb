import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { DeservedlyService } from 'src/app/Core/Api/HR/deservedly.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-deservedly',
  templateUrl: './deservedly.component.html',
  styleUrls: ['./deservedly.component.css']
})
export class DeservedlyComponent implements OnInit {
  py_Deservedly!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  docNo: number = 0;

  DiscountFromList: any[] = [];
  CalctypesList: any[] = [];
  AllowancesList: any[] = [];

  paymentWayList: any[] = [];
  categoryList: any[] = [];
  searchingPayment:boolean=false;
  searchingCategory:boolean=false;
  filteredPaymentServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCategoryServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: DeservedlyService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_Deservedly = this._formBuilder.group({
      n_doc_no: [''],
      s_Deservedly_name: ['', Validators.required],
      s_Deservedly_name_eng: [''],
      n_discountFrom: [''],
      n_Calc_Type: [''],
      n_payment_type: ['', Validators.required],
      n_category: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      py_deservedly_allowance: this._formBuilder.array([])
    });
  }

  get py_deservedly_allowance() : FormArray {
    return this.py_Deservedly.get("py_deservedly_allowance") as FormArray
  }

  pushIn_py_deservedly_allowance(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      n_doc_no: '',
      n_allowance_id: '',
      s_allowance_name: '',
    });
  }

  Add_py_deservedly_allowance_Row()
  {
    this.py_deservedly_allowance.push(this.pushIn_py_deservedly_allowance(this.Add_py_deservedly_allowance_Row.length + 1));
  }

  RemoveDeservedlyAllowanceRow(i:number) {
    this.py_deservedly_allowance.removeAt(i);
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._service.GetDiscountFromList().subscribe((data) => {
      this.DiscountFromList = data;
    });

    this._service.GetCalcTypesList().subscribe((data) => {
      this.CalctypesList = data;
    });

    this._service.GetAllowances().subscribe((data) => {
      this.AllowancesList = data;
    });

    this.searchPayment('');
    this.searchCategory('');

    if(this.docNo <= 0)
    {
      this._service.GetNextDeservedly().subscribe((data) => {
        this.py_Deservedly.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_Deservedly.patchValue(data);

        if(data.py_deservedly_allowance.length > 0)
        {
          data.py_deservedly_allowance.forEach(element => {
            this.py_deservedly_allowance.push(this.pushIn_py_deservedly_allowance(this.py_deservedly_allowance.length + 1));
          });
          (this.py_Deservedly.get("py_deservedly_allowance") as FormArray)?.patchValue(data.py_deservedly_allowance);
        }

        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchPayment(value :any){
    this.searchingPayment = true;
    this._service.GetPayments(value).subscribe(res=>{
      this.paymentWayList = res;
      this.filteredPaymentServerSide.next(this.paymentWayList.filter(x => x.s_pay_name.toLowerCase().indexOf(value) > -1));
      this.searchingPayment = false;
    });
  }

  searchCategory(value :any){
    this.searchingCategory=true;
    this._service.GetCategories(value).subscribe(res=>{
      this.categoryList = res;
      this.filteredCategoryServerSide.next(this.categoryList.filter(x => x.s_name.toLowerCase().indexOf(value) > -1));
      this.searchingCategory=false;
    });
  }

  Save()
  {
    debugger
    if(this.py_Deservedly.value.py_deservedly_allowance.length > 0)
    {
      for(var i = 0; i < this.py_deservedly_allowance.length; i++)
      {
        if(this.py_Deservedly.value.py_deservedly_allowance[i].n_allowance_id == 0)
        {
          this._notificationService.ShowMessage(`من فضلك اختر البدل في السطر رقم ${i + 1}`, 3);
          return;
        }
      }
    }
    this.showspinner = true;
    this.disableButtons();

    var formData: any = new FormData();
    formData.append('n_doc_no', this.py_Deservedly.value.n_doc_no ?? 0);
    formData.append('s_Deservedly_name', this.py_Deservedly.value.s_Deservedly_name ?? '');
    formData.append('s_Deservedly_name_eng', this.py_Deservedly.value.s_Deservedly_name_eng ?? '');
    formData.append('n_discountFrom', this.py_Deservedly.value.n_discountFrom ?? 0);
    formData.append('n_Calc_Type', this.py_Deservedly.value.n_Calc_Type ?? 0);
    formData.append('n_payment_type', this.py_Deservedly.value.n_payment_type ?? 0);
    formData.append('n_category', this.py_Deservedly.value.n_category ?? 0);
    formData.append('n_DataAreaID', this.py_Deservedly.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_Deservedly.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_Deservedly.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_Deservedly.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_Deservedly.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_Deservedly.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_Deservedly.value.n_current_year ?? 0);

    for(var i = 0; i < this.py_deservedly_allowance.length; i++)
    {
      formData.append(`py_deservedly_allowance[${i}].n_serial`, this.py_Deservedly?.value.py_deservedly_allowance[i].n_serial ?? 0);
      formData.append(`py_deservedly_allowance[${i}].n_allowance_id`, this.py_Deservedly?.value.py_deservedly_allowance[i].n_allowance_id ?? 0);
    }

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/deservedlylist']);
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
          this._router.navigate(['/hr/deservedlylist']);
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
