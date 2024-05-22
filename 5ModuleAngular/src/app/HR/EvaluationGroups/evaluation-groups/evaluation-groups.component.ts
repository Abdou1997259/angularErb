import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationGroupsService } from 'src/app/Core/Api/HR/evaluation-groups.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-evaluation-groups',
  templateUrl: './evaluation-groups.component.html',
  styleUrls: ['./evaluation-groups.component.css']
})
export class EvaluationGroupsComponent implements OnInit {
  py_Evaluation_Groups!: FormGroup;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  docNo: number = 0;

  constructor(private _service: EvaluationGroupsService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_Evaluation_Groups = this._formBuilder.group({
      n_doc_no: [''],
      s_name: ['', Validators.required],
      s_name_eng: [''],
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
    this.docNo = Number( this._activatedRoute.snapshot.paramMap.get('id') );

    if(this.docNo <= 0)
    {
      this._service.GetNextEvaluation().subscribe((data) => {
        this.py_Evaluation_Groups.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_Evaluation_Groups.patchValue(data);
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;
    
    var formData: any = new FormData();
    formData.append('n_doc_no', this.py_Evaluation_Groups.value.n_doc_no ?? 0);
    formData.append('s_name', this.py_Evaluation_Groups.value.s_name ?? '');
    formData.append('s_name_eng', this.py_Evaluation_Groups.value.s_name_eng ?? '');
    formData.append('n_DataAreaID', this.py_Evaluation_Groups.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_Evaluation_Groups.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_Evaluation_Groups.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_Evaluation_Groups.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_Evaluation_Groups.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_Evaluation_Groups.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_Evaluation_Groups.value.n_current_year ?? 0);

    if(this.docNo !=null && this.docNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/evaluationgroupslist']);
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
          this._router.navigate(['/hr/evaluationgroupslist']);
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
