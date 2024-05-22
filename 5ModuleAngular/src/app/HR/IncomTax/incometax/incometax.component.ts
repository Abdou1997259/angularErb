import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { IncometaxService } from 'src/app/Core/Api/HR/incometax.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-incometax',
  templateUrl: './incometax.component.html',
  styleUrls: ['./incometax.component.css']
})
export class IncometaxComponent implements OnInit {
  py_Incom_Tax!: FormGroup;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  docNo: number = 0;

  Layers: any[] = [];

  constructor(private _service: IncometaxService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder, public dialog: MatDialog)
  {
    this.py_Incom_Tax = this._formBuilder.group({
      n_doc_no: [''],
      d_From_date: [''],
      d_To_Date: [''],
      s_Notes: [''],
      n_Annual_Tax_Discount: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      py_Incom_Tax_Details: this._formBuilder.array([])
    });
  }

  get py_Incom_Tax_Details() : FormArray {
    return this.py_Incom_Tax.get("py_Incom_Tax_Details") as FormArray
  }

  pushIn_py_Incom_Tax_Details(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_serial: line,
      s_Layer: '',
      n_Start: '',
      n_End: '',
      n_Percentage: ''
    });
  }

  // Add_py_Incom_Tax_Details_Row()
  // {
  //   this.py_Incom_Tax_Details.push(this.pushIn_py_Incom_Tax_Details(this.Add_py_Incom_Tax_Details_Row.length + 1));
  // }

  // RemoveIncomeTaxDetailsRow(i:number) {
  //   if(this.py_Incom_Tax.value.py_Incom_Tax_Details.length == 1)
  //     return;
  //   this.py_Incom_Tax_Details.removeAt(i);
  // }

  ngOnInit(): void {
    this.showspinner = true;
    this.docNo = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this._service.GetLayers().subscribe((data) => {
      this.Layers = data;
    });

    if(this.docNo <= 0)
    {
      this._service.GetNextIncomeTax().subscribe((data) => {
        this.py_Incom_Tax.patchValue(data);

        for(var i = 0; i < this.Layers.length; i++)
        {
          this.py_Incom_Tax_Details.push(this.pushIn_py_Incom_Tax_Details(this.py_Incom_Tax_Details.length + 1));
          ((this.py_Incom_Tax.get("py_Incom_Tax_Details") as FormArray).at(i) as FormGroup).get('s_Layer')?.patchValue(this.Layers[i].name_arabic);
        }
        this.showspinner = false;
      });
    }

    if(this.docNo > 0)
    {
      this._service.GetByID(this.docNo).subscribe((data) => {
        this.py_Incom_Tax.patchValue(data);
        this.py_Incom_Tax.get("d_From_date")?.patchValue(new Date(Number(data.d_From_date.substring(0,4)), Number(data.d_From_date.substring(5,7))-1, Number(data.d_From_date.substring(8,10))));
        this.py_Incom_Tax.get("d_To_Date")?.patchValue(new Date(Number(data.d_To_Date.substring(0,4)), Number(data.d_To_Date.substring(5,7))-1, Number(data.d_To_Date.substring(8,10))));

        if(data.py_Incom_Tax_Details.length > 0)
        {
          data.py_Incom_Tax_Details.forEach(element => {
            this.py_Incom_Tax_Details.push(this.pushIn_py_Incom_Tax_Details(this.py_Incom_Tax_Details.length + 1));
          });
          (this.py_Incom_Tax.get("py_Incom_Tax_Details") as FormArray)?.patchValue(data.py_Incom_Tax_Details);
        }
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
    this.py_Incom_Tax.value.d_From_date=new DatePipe('en-US').transform(this.py_Incom_Tax.value.d_From_date, 'yyyy/MM/dd');
    this.py_Incom_Tax.value.d_To_Date=new DatePipe('en-US').transform(this.py_Incom_Tax.value.d_To_Date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.py_Incom_Tax.value.n_doc_no ?? 0);
    formData.append('d_From_date', this.py_Incom_Tax.value.d_From_date ?? '');
    formData.append('d_To_Date', this.py_Incom_Tax.value.d_To_Date ?? '');
    formData.append('s_Notes', this.py_Incom_Tax.value.s_Notes ?? '');
    formData.append('n_Annual_Tax_Discount', this.py_Incom_Tax.value.n_Annual_Tax_Discount ?? 0);
    formData.append('n_DataAreaID', this.py_Incom_Tax.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_Incom_Tax.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_Incom_Tax.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_Incom_Tax.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_Incom_Tax.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_Incom_Tax.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_Incom_Tax.value.n_current_year ?? 0);

    for(var i = 0; i < this.py_Incom_Tax_Details.length; i++)
    {
      formData.append(`py_Incom_Tax_Details[${i}].n_serial`, this.py_Incom_Tax?.value.py_Incom_Tax_Details[i].n_serial ?? 0);
      formData.append(`py_Incom_Tax_Details[${i}].s_Layer`, this.py_Incom_Tax?.value.py_Incom_Tax_Details[i].s_Layer ?? '');
      formData.append(`py_Incom_Tax_Details[${i}].n_Start`, this.py_Incom_Tax?.value.py_Incom_Tax_Details[i].n_Start ?? 0);
      formData.append(`py_Incom_Tax_Details[${i}].n_End`, this.py_Incom_Tax?.value.py_Incom_Tax_Details[i].n_End ?? 0);
      formData.append(`py_Incom_Tax_Details[${i}].n_Percentage`, this.py_Incom_Tax?.value.py_Incom_Tax_Details[i].n_Percentage ?? 0);
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
          this._router.navigate(['/hr/incomtaxlist']);
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
          this._router.navigate(['/hr/incomtaxlist']);
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
