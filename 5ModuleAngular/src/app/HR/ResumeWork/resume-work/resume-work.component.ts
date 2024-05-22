import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ResumeWorkService } from 'src/app/Core/Api/HR/resume-work.service';

@Component({
  selector: 'app-resume-work',
  templateUrl: './resume-work.component.html',
  styleUrls: ['./resume-work.component.css']
})
export class ResumeWorkComponent implements OnInit {
  py_Resume_Work!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  isReturnFromVacation: boolean = false;
  docNo: number = 0;

  ResumeWorktypesList: any[] = [];

  EmployeeList: any[] = [];
  searchingEmp:boolean=false;
  filteredEmpServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  VacationList: any[] = [];
  searchingVacation:boolean=false;
  filteredVacationServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: ResumeWorkService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog)
  {
    this.py_Resume_Work = this._formBuilder.group({
      n_doc_no: [''],
      d_doc_date: [(new Date()).toISOString().substring(0,10), Validators.required],
      n_employee_id: ['', Validators.required],
      n_ResumeWorkType: [''],
      d_confim_date: [''],
      d_start_date: [''],
      n_request_no: [''],
      n_expand_no: [''],
      n_delayed_days: [''],
      s_notes: [''],
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

    this._service.GetResumeWorkTypes().subscribe((data) => {
      this.ResumeWorktypesList = data;
    });
    this.searchEmp('');
    this.searchVacation('');

    if(this.docNo <= 0)
    {
      this._service.GetNextResumeWork().subscribe((data) => {
        this.py_Resume_Work.patchValue(data);
        this.py_Resume_Work.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_Resume_Work.patchValue(data);
        this.py_Resume_Work.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        this.py_Resume_Work.get("d_confim_date")?.patchValue(new Date(Number(data.d_confim_date.substring(0,4)), Number(data.d_confim_date.substring(5,7))-1, Number(data.d_confim_date.substring(8,10))));
        this.py_Resume_Work.get("d_start_date")?.patchValue(new Date(Number(data.d_start_date.substring(0,4)), Number(data.d_start_date.substring(5,7))-1, Number(data.d_start_date.substring(8,10))));

        this.TypeChanged();
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchEmp(value :any){
    this.searchingEmp = true;
    this._service.GetEmployee(value).subscribe(res=>{
      this.EmployeeList = res;
      this.filteredEmpServerSide.next(this.EmployeeList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmp = false;
    });
  }

  searchVacation(value :any){
    this.searchingVacation = true;
    this._service.GetEmpVacations(value).subscribe(res=>{
      this.VacationList = res;
      this.filteredVacationServerSide.next(this.VacationList.filter(x => x.n_doc_no.toLowerCase().indexOf(value) > -1));
      this.searchingVacation = false;
    });
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    this.py_Resume_Work.value.d_doc_date=new DatePipe('en-US').transform(this.py_Resume_Work.value.d_doc_date, 'yyyy/MM/dd');
    this.py_Resume_Work.value.d_confim_date=new DatePipe('en-US').transform(this.py_Resume_Work.value.d_confim_date, 'yyyy/MM/dd');
    this.py_Resume_Work.value.d_start_date=new DatePipe('en-US').transform(this.py_Resume_Work.value.d_start_date, 'yyyy/MM/dd');

    formData.append('n_doc_no', this.py_Resume_Work.value.n_doc_no ?? 0);
    formData.append('d_doc_date', this.py_Resume_Work.value.d_doc_date ?? '');
    formData.append('n_employee_id', this.py_Resume_Work.value.n_employee_id ?? 0);
    formData.append('n_ResumeWorkType', this.py_Resume_Work.value.n_ResumeWorkType ?? 0);
    formData.append('d_confim_date', this.py_Resume_Work.value.d_confim_date ?? '');
    formData.append('d_start_date', this.py_Resume_Work.value.d_start_date ?? '');
    formData.append('n_request_no', this.py_Resume_Work.value.n_request_no ?? 0);
    formData.append('n_expand_no', this.py_Resume_Work.value.n_expand_no ?? 0);
    formData.append('n_delayed_days', this.py_Resume_Work.value.n_delayed_days ?? 0);
    formData.append('s_notes', this.py_Resume_Work.value.s_notes ?? '');
    formData.append('n_DataAreaID', this.py_Resume_Work.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_Resume_Work.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_Resume_Work.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_Resume_Work.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_Resume_Work.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_Resume_Work.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_Resume_Work.value.n_current_year ?? 0);

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/resume-work-list']);
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
          this._router.navigate(['/hr/resume-work-list']);
        }
      });
    }
  }

  TypeChanged()
  {
    var type = Number( this.py_Resume_Work.get('n_ResumeWorkType')?.value );
    if(type == 2)
      this.isReturnFromVacation = true;
    else
    {
      this.isReturnFromVacation = false;
      this.py_Resume_Work.get('n_request_no')?.patchValue('');
      this.py_Resume_Work.get('n_expand_no')?.patchValue('');
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
