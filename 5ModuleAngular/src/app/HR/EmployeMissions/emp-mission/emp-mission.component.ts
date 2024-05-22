import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { EmpMissionService } from 'src/app/Core/Api/HR/emp-mission.service';

@Component({
  selector: 'app-emp-mission',
  templateUrl: './emp-mission.component.html',
  styleUrls: ['./emp-mission.component.css']
})
export class EmpMissionComponent implements OnInit {
  Py_Employee_Missions!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  docNo: number = 0;

  MissionTypesDP: any[] = [];

  EmployeesList: any[] = [];
  searchingEmployees:boolean=false;
  filteredEmployeesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  AlternativeEmpList: any[] = [];
  searchingAlternativeEmp:boolean=false;
  filteredAlternativeEmpServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: EmpMissionService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog)
  {
    this.Py_Employee_Missions = this._formBuilder.group({
      n_doc_no: [''],
      d_doc_date: [(new Date()).toISOString().substring(0,10), Validators.required],
      n_year: [''],
      n_month: [''],
      n_employee_id: [''],
      n_alternative_employee_no: [''],
      n_mission_type: [''],
      b_confirmed: [''],
      d_from_date: [''],
      d_to_date: [''],
      s_From_Hour: [''],
      s_To_hour: [''],
      s_description: [''],
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

    this._service.GetMissionTypes().subscribe((data) => {
      this.MissionTypesDP = data;
    });

    this.searchEmploye('');
    this.searchAlternativeEmploye('');

    if(this.docNo <= 0)
    {
      this._service.GetNextEmpMission().subscribe((data) => {
        this.Py_Employee_Missions.patchValue(data);
        this.Py_Employee_Missions.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.Py_Employee_Missions.patchValue(data);
        this.Py_Employee_Missions.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
        this.Py_Employee_Missions.get("d_from_date")?.patchValue(new Date(Number(data.d_from_date.substring(0,4)), Number(data.d_from_date.substring(5,7))-1, Number(data.d_from_date.substring(8,10))));
        this.Py_Employee_Missions.get("d_to_date")?.patchValue(new Date(Number(data.d_to_date.substring(0,4)), Number(data.d_to_date.substring(5,7))-1, Number(data.d_to_date.substring(8,10))));
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchEmploye(value :any){
    this.searchingEmployees = true;
    this._service.GetEmployees(value).subscribe(res=>{
      this.EmployeesList = res;
      this.filteredEmployeesServerSide.next(this.EmployeesList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingEmployees = false;
    });
  }

  searchAlternativeEmploye(value :any){
    this.searchingAlternativeEmp = true;
    this._service.GetEmployees(value).subscribe(res=>{
      this.AlternativeEmpList = res;
      this.filteredAlternativeEmpServerSide.next(this.AlternativeEmpList.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingAlternativeEmp = false;
    });
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;
    var formData: any = new FormData();
    this.Py_Employee_Missions.value.d_doc_date=new DatePipe('en-US').transform(this.Py_Employee_Missions.value.d_doc_date, 'yyyy/MM/dd');
    this.Py_Employee_Missions.value.d_from_date=new DatePipe('en-US').transform(this.Py_Employee_Missions.value.d_from_date, 'yyyy/MM/dd');
    this.Py_Employee_Missions.value.d_to_date=new DatePipe('en-US').transform(this.Py_Employee_Missions.value.d_to_date, 'yyyy/MM/dd');

    formData.append('n_doc_no', this.Py_Employee_Missions.value.n_doc_no ?? 0);
    formData.append('d_doc_date', this.Py_Employee_Missions.value.d_doc_date ?? '');
    formData.append('n_year', this.Py_Employee_Missions.value.n_year ?? 0);
    formData.append('n_month', this.Py_Employee_Missions.value.n_month ?? 0);
    formData.append('n_employee_id', this.Py_Employee_Missions.value.n_employee_id ?? 0);
    formData.append('n_alternative_employee_no', this.Py_Employee_Missions.value.n_alternative_employee_no ?? 0);
    formData.append('n_mission_type', this.Py_Employee_Missions.value.n_mission_type ?? 0);
    formData.append('b_confirmed', this.Py_Employee_Missions.value.b_confirmed ?? false);
    formData.append('d_from_date', this.Py_Employee_Missions.value.d_from_date ?? '');
    formData.append('d_to_date', this.Py_Employee_Missions.value.d_to_date ?? '');
    formData.append('s_From_Hour', this.Py_Employee_Missions.value.s_From_Hour ?? '');
    formData.append('s_To_hour', this.Py_Employee_Missions.value.s_To_hour ?? '');
    formData.append('s_description', this.Py_Employee_Missions.value.s_description ?? '');
    formData.append('n_DataAreaID', this.Py_Employee_Missions.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.Py_Employee_Missions.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.Py_Employee_Missions.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.Py_Employee_Missions.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.Py_Employee_Missions.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.Py_Employee_Missions.value.n_current_company ?? 0);
    formData.append('n_current_year', this.Py_Employee_Missions.value.n_current_year ?? 0);

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/emp-mission-list']);
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
          this._router.navigate(['/hr/emp-mission-list']);
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
