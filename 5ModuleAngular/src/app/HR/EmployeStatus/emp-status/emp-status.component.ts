import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { EmpStatusService } from 'src/app/Core/Api/HR/emp-status.service';
import { EmpLkpService } from 'src/app/Core/Api/LookUps/emp-lkp.service';

@Component({
  selector: 'app-emp-status',
  templateUrl: './emp-status.component.html',
  styleUrls: ['./emp-status.component.css']
})
export class EmpStatusComponent implements OnInit {
  py_change_employee_status!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  is_RetroactiveCalc: boolean = false;
  docNo: number = 0;

  EmpStatusList: any[] = [];
  searchingEmpStatus:boolean=false;
  filteredEmpStatusServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  EmpStatusDP: any[] = [];

  constructor(private _service: EmpStatusService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog)
  {
    this.py_change_employee_status = this._formBuilder.group({
      n_doc_no: [''],
      d_doc_date: [(new Date()).toISOString().substring(0,10), Validators.required],
      n_employee_id: ['', Validators.required],
      n_Emp_Status: ['', Validators.required],
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
    this._service.GetEmpStatusDP().subscribe((data) => {
      this.EmpStatusDP = data;
    });
    this.searchEmpStatus('');

    if(this.docNo <= 0)
    {
      this._service.GetNextEmpStatus().subscribe((data) => {
        this.py_change_employee_status.patchValue(data);
        this.py_change_employee_status.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_change_employee_status.patchValue(data);
        this.py_change_employee_status.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchEmpStatus(value :any){
    this.searchingEmpStatus = true;
    this._service.GetEmployeesList(value).subscribe(res=>{
      this.EmpStatusList = res;
      this.filteredEmpStatusServerSide.next(this.EmpStatusList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmpStatus = false;
    });
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;
    var formData: any = new FormData();
    this.py_change_employee_status.value.d_doc_date=new DatePipe('en-US').transform(this.py_change_employee_status.value.d_doc_date, 'yyyy/MM/dd');

    formData.append('n_doc_no', this.py_change_employee_status.value.n_doc_no ?? 0);
    formData.append('d_doc_date', this.py_change_employee_status.value.d_doc_date ?? '');
    formData.append('n_employee_id', this.py_change_employee_status.value.n_employee_id ?? 0);
    formData.append('n_Emp_Status', this.py_change_employee_status.value.n_Emp_Status ?? 0);
    formData.append('s_notes', this.py_change_employee_status.value.s_notes ?? '');
    formData.append('n_DataAreaID', this.py_change_employee_status.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_change_employee_status.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_change_employee_status.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_change_employee_status.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_change_employee_status.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_change_employee_status.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_change_employee_status.value.n_current_year ?? 0);

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/emp-status-list']);
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
          this._router.navigate(['/hr/emp-status-list']);
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
