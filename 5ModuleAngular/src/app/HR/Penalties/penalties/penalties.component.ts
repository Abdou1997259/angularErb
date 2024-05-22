import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { PenaltiesService } from 'src/app/Core/Api/HR/penalties.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styleUrls: ['./penalties.component.css']
})
export class PenaltiesComponent implements OnInit {
  py_penalties!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  docNo: number = 0;

  DeductionsList: any[] = [];

  searchingDeduction: boolean = false;
  filteredDeductionServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: PenaltiesService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_penalties = this._formBuilder.group({
      n_doc_no: [''],
      s_pental_name: ['', Validators.required],
      s_pental_name_Eng: [''],
      n_deduction_id: ['', Validators.required],
      n_pen_days: [''],
      s_note: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: ['']
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.searchDeduction('');

    if(this.docNo <= 0)
    {
      this._service.GetNextPenalties().subscribe((data) => {
        this.py_penalties.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_penalties.patchValue(data);
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchDeduction(value :any){
    this.searchingDeduction = true;
    this._service.GetDeductions(value).subscribe(res=>{
      this.DeductionsList = res;
      this.filteredDeductionServerSide.next(this.DeductionsList.filter(x => x.s_deduction_name.toLowerCase().indexOf(value) > -1));
      this.searchingDeduction = false;
    });
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    formData.append('n_doc_no', this.py_penalties.value.n_doc_no ?? 0);
    formData.append('s_pental_name', this.py_penalties.value.s_pental_name ?? '');
    formData.append('s_pental_name_Eng', this.py_penalties.value.s_pental_name_Eng ?? '');
    formData.append('n_deduction_id', this.py_penalties.value.n_deduction_id ?? 0);
    formData.append('n_pen_days', this.py_penalties.value.n_pen_days ?? 0);
    formData.append('s_note', this.py_penalties.value.s_note ?? '');
    formData.append('n_DataAreaID', this.py_penalties.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_penalties.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_penalties.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_penalties.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_penalties.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_penalties.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_penalties.value.n_current_year ?? 0);

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/penaltieslist']);
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
          this._router.navigate(['/hr/penaltieslist']);
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
