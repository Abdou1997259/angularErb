import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { JobLkpComponent } from 'src/app/Controls/job-lkp/job-lkp.component';
import { NationalityLkpComponent } from 'src/app/Controls/nationality-lkp/nationality-lkp.component';
import { VisaService } from 'src/app/Core/Api/HR/visa.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { JobLkpService } from 'src/app/Core/Api/LookUps/job-lkp.service';
import { NationalityLkpService } from 'src/app/Core/Api/LookUps/nationality-lkp.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: ['./visa.component.css']
})
export class VisaComponent implements OnInit {
  py_Visa_Issue!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  docNo: number = 0;

  JobList: any[] = [];
  NationalityList: any[] = [];

  SponsersList: any[] = [];
  searchingSponser:boolean=false;
  filteredSponserServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: VisaService, private _jobService: JobLkpService, private _nationalityService: NationalityLkpService,
    private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog)
  {
    this.py_Visa_Issue = this._formBuilder.group({
      n_doc_no: [''],
      d_doc_date: [(new Date()).toISOString().substring(0,10), Validators.required],
      s_Export_no: [''],
      n_Sponser_id: [''],
      s_pay_ref: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      py_Visa_Issue_Details: this._formBuilder.array([])
    });
  }

  get py_Visa_Issue_Details() : FormArray {
    return this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray
  }

  pushIn_py_Visa_Issue_Details(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      n_count: '',
      n_job_id: '',
      s_job_name: '',
      n_nationality_id: '',
      s_nationality_name: '',
      s_Location: '',
      s_Recruitment_office: '',
      n_remain: '',
    });
  }

  Add_py_Visa_Issue_Details_Row()
  {
    this.py_Visa_Issue_Details.push(this.pushIn_py_Visa_Issue_Details(this.Add_py_Visa_Issue_Details_Row.length + 1));
  }

  RemoveVisaIssueDetailsRow(i:number) {
    if(this.py_Visa_Issue.value.py_Visa_Issue_Details.length == 1)
      return;
    this.py_Visa_Issue_Details.removeAt(i);
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this.searchSponser('');

    if(this.docNo <= 0)
    {
      this._service.GetNextVisaIssue().subscribe((data) => {
        this.py_Visa_Issue.patchValue(data);
        this.py_Visa_Issue.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.Add_py_Visa_Issue_Details_Row();
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_Visa_Issue.patchValue(data);
        this.py_Visa_Issue.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));

        if(data.py_Visa_Issue_Details.length > 0)
        {
          data.py_Visa_Issue_Details.forEach(element => {
            this.py_Visa_Issue_Details.push(this.pushIn_py_Visa_Issue_Details(this.py_Visa_Issue_Details.length + 1));
          });
          (this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray)?.patchValue(data.py_Visa_Issue_Details);
        }

        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchSponser(value :any){
    this.searchingSponser = true;
    this._service.GetSponsers(value).subscribe(res=>{
      this.SponsersList = res;
      this.filteredSponserServerSide.next(this.SponsersList.filter(x => x.s_Sponser_name.toLowerCase().indexOf(value) > -1));
      this.searchingSponser = false;
    });
  }

  Save()
  {
    if(this.ValidateDetails() == false)
      return;

    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    this.py_Visa_Issue.value.d_doc_date=new DatePipe('en-US').transform(this.py_Visa_Issue.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.py_Visa_Issue.value.n_doc_no ?? 0);
    formData.append('d_doc_date', this.py_Visa_Issue.value.d_doc_date ?? '');
    formData.append('s_Export_no', this.py_Visa_Issue.value.s_Export_no ?? '');
    formData.append('n_Sponser_id', this.py_Visa_Issue.value.n_Sponser_id ?? 0);
    formData.append('s_pay_ref', this.py_Visa_Issue.value.s_pay_ref ?? '');
    formData.append('n_DataAreaID', this.py_Visa_Issue.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_Visa_Issue.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_Visa_Issue.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_Visa_Issue.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_Visa_Issue.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_Visa_Issue.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_Visa_Issue.value.n_current_year ?? 0);

    for(var i = 0; i < this.py_Visa_Issue_Details.length; i++)
    {
      formData.append(`py_Visa_Issue_Details[${i}].n_serial`, this.py_Visa_Issue?.value.py_Visa_Issue_Details[i].n_serial ?? 0);
      formData.append(`py_Visa_Issue_Details[${i}].n_count`, this.py_Visa_Issue?.value.py_Visa_Issue_Details[i].n_count ?? 0);
      formData.append(`py_Visa_Issue_Details[${i}].n_job_id`, this.py_Visa_Issue?.value.py_Visa_Issue_Details[i].n_job_id ?? 0);
      formData.append(`py_Visa_Issue_Details[${i}].n_nationality_id`, this.py_Visa_Issue?.value.py_Visa_Issue_Details[i].n_nationality_id ?? 0);
      formData.append(`py_Visa_Issue_Details[${i}].s_Location`, this.py_Visa_Issue?.value.py_Visa_Issue_Details[i].s_Location ?? '');
      formData.append(`py_Visa_Issue_Details[${i}].s_Recruitment_office`, this.py_Visa_Issue?.value.py_Visa_Issue_Details[i].s_Recruitment_office ?? '');
      formData.append(`py_Visa_Issue_Details[${i}].n_remain`, this.py_Visa_Issue?.value.py_Visa_Issue_Details[i].n_remain ?? 0);
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
          this._router.navigate(['/hr/visalist']);
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
          this._router.navigate(['/hr/visalist']);
        }
      });
    }
  }

  LoadJobsLKP(i:number){
    const dialogRef = this.dialog.open(JobLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('n_job_id')?.patchValue(res.data.n_job_id);
      ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('s_job_name')?.patchValue(res.data.s_job_name);
     });
  }

  ChangeJob(i:number){
    var jobId = ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('n_job_id')?.value;
    this._jobService.GetJobName(jobId).subscribe((res) => {
      if(res==null)
      {
        ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('n_job_id')?.patchValue('');
        ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('s_job_name')?.patchValue('');
      }
      else
      {
        ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('s_job_name')?.patchValue(res.s_job_name);
      }
    });
  }

  LoadNationalitiesLKP(i:number){
    const dialogRef = this.dialog.open(NationalityLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('n_nationality_id')?.patchValue(res.data.n_nationality_id);
      ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('s_nationality_name')?.patchValue(res.data.s_nationality_name);
     });
  }

  ChangeNationality(i:number){
    var nationalityId = ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('n_nationality_id')?.value;
    this._nationalityService.GetNationalityName(nationalityId).subscribe((res) => {
      if(res==null)
      {
        ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('n_nationality_id')?.patchValue('');
        ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('s_nationality_name')?.patchValue('');
      }
      else
      {
        ((this.py_Visa_Issue.get("py_Visa_Issue_Details") as FormArray).at(i) as FormGroup).get('s_nationality_name')?.patchValue(res.s_nationality_name);
      }
    });
  }

  ValidateDetails(): boolean
  {
    var isValid = true;
    for(var i = 0; i < this.py_Visa_Issue.value.py_Visa_Issue_Details.length; i++)
    {
      if(this.py_Visa_Issue.value.py_Visa_Issue_Details[i].n_count <= 0 || this.py_Visa_Issue.value.py_Visa_Issue_Details[i].n_count == "")
      {
        this._notificationService.ShowMessage(`من فضلك ادخل قيمة العدد في السطر رقم ${i+1}`, 3);
        isValid = false;
      }

      if(this.py_Visa_Issue.value.py_Visa_Issue_Details[i].n_job_id <= 0 || this.py_Visa_Issue.value.py_Visa_Issue_Details[i].n_job_id == "")
      {
        this._notificationService.ShowMessage(`من فضلك اختر الوظيفة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }

      if(this.py_Visa_Issue.value.py_Visa_Issue_Details[i].n_nationality_id <= 0 || this.py_Visa_Issue.value.py_Visa_Issue_Details[i].n_nationality_id == "")
      {
        this._notificationService.ShowMessage(`من فضلك اختر الجنسية في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
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
