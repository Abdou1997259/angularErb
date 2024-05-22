import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SalersService } from 'src/app/Core/Api/AR/salers.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-salesmen-add',
  templateUrl: './salesmen-add.component.html',
  styleUrls: ['./salesmen-add.component.css']
})
export class SalesmenAddComponent implements OnInit {
  ar_salesmen!: FormGroup;
  showspinner: boolean = false;
  n_salesman_id: number = 0;

  employeesList: any;
  supervisorsList: any;
  managersList: any;
  commissionsList: any;
  groupsList: any;
  accountsList: any;
  agentsList: any;
  targetsList: any;
  isEnglish:boolean=false;
  timeout: any;

  constructor(private _service: SalersService, private _notification: NotificationServiceService, private _router: Router,
    private _activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder, private _helperService: HelperService,
    private dialog: MatDialog)
    {
      this.ar_salesmen = this._formBuilder.group({
        n_employee_id: new FormControl(),
        s_employee_name: new FormControl(),
        n_DataAreaID: new FormControl(),
        n_UserAdd: new FormControl(),
        d_UserAddDate: new FormControl(),
        n_UserUpdate: new FormControl(),
        d_UserUpdateDate: new FormControl(),

        n_salesman_id: new FormControl('',Validators.required),
        s_salesman_name: new FormControl('', Validators.required),
        s_salesman_name_eng: new FormControl(''),
        n_agent_type_id: new FormControl(),
        n_commission_type_id: new FormControl(),
        s_commission_type_name: new FormControl(),
        n_supervisior_id: new FormControl(),
        s_supervisior_name: new FormControl(),
        n_basic_salaray: new FormControl(),
        n_precent_value: new FormControl(),
        n_transportation: new FormControl(),
        n_max_discount: new FormControl(),
        n_group_id: new FormControl(),
        s_group_name: new FormControl(),
        n_target_type: new FormControl(),
        n_collection_percent: new FormControl(),
        n_sales_percent: new FormControl(),
        s_notes: new FormControl(),
        s_related_account: new FormControl(),
        s_related_account_name: new FormControl(),
        s_tel_no: new FormControl(),
        s_e_mail: new FormControl(),
        s_fax_no: new FormControl(),
        n_first_container_price: new FormControl(),
        n_second_container_price: new FormControl(),
        n_more_container_price: new FormControl(),
        b_left_work: new FormControl(),
        b_supervisor: new FormControl(),
        b_Allow_Comm: new FormControl(),
        d_start_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        d_leaving_date: new FormControl(),
        s_tel: new FormControl(),
        s_manager_id: new FormControl(),
        s_manager_name: new FormControl(),
      });
    }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_salesman_id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    this._helperService.GetAgentsTypes().subscribe((data) => {
      this.agentsList = data;
    });

    this._helperService.GetTargetTypes().subscribe((data) => {
      this.targetsList = data;
    });

    if(this.n_salesman_id <= 0)
    {
      this._service.GetCurrentSaler().subscribe((data) =>
      {
        this.ar_salesmen.patchValue(data);
        this.ar_salesmen.get("d_start_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
    }

    if(this.n_salesman_id > 0)
    {
      this._service.GetByID(this.n_salesman_id).subscribe((data) => {
        this.ar_salesmen.patchValue(data);
        this.ar_salesmen.get("d_start_date")?.patchValue(new Date(Number(data.d_start_date.substring(0,4)), Number(data.d_start_date.substring(5,7))-1, Number(data.d_start_date.substring(8,10))));
        this.ar_salesmen.get("d_leaving_date")?.patchValue(new Date(Number(data.d_leaving_date.substring(0,4)), Number(data.d_leaving_date.substring(5,7))-1, Number(data.d_leaving_date.substring(8,10))));
        this.showspinner = false;
      });
    }
     LangSwitcher.translateData(1);
     LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();

  }

  // Load Data
  serachOpen(event)
  {
    let element =document.querySelector("#" + event.target.id +"+ .search-list") as HTMLElement
    element.style.opacity="1";
    element.style.zIndex="100";
  }

  searchClose(event)
  {
    let element =document.querySelector("#" + event.target.id +"+ .search-list ") as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  searchHide(searchInputNumber)
  {
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  searchEmployeesBegin(event)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      debugger
      if(event.keyCode != 13 && event.keyCode != undefined)
      {
        this._helperService.getEmployeesLKP(event.target.value).subscribe((data) =>
        {
          this.employeesList = data;
        });
      }

      if(event.keyCode == 8 || event.keyCode == undefined)
      {
        this._helperService.getEmployeesLKP('').subscribe((data) =>
        {
          this.employeesList = data;
        });
      }
    }, 1000);
  }

  searchSupervisorBegin(event)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      debugger
      if(event.keyCode != 13 && event.keyCode != undefined)
      {
        this._helperService.getSupervisorLKP(event.target.value).subscribe((data) =>
        {
          this.supervisorsList = data;
        });
      }

      if(event.keyCode == 8 || event.keyCode == undefined)
      {
        this._helperService.getSupervisorLKP('').subscribe((data) =>
        {
          this.supervisorsList = data;
        });
      }
    }, 1000);
  }

  searchManagersBegin(event)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      debugger
      if(event.keyCode != 13 && event.keyCode != undefined)
      {
        this._helperService.getManagersLKP(event.target.value).subscribe((data) =>
        {
          this.managersList = data;
        });
      }

      if(event.keyCode == 8 || event.keyCode == undefined)
      {
        this._helperService.getManagersLKP('').subscribe((data) =>
        {
          this.managersList = data;
        });
      }
    }, 1000);
  }

  searchCommissionsBegin(event)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      debugger
      if(event.keyCode != 13 && event.keyCode != undefined)
      {
        this._helperService.getCommissionsLKP(event.target.value).subscribe((data) =>
        {
          this.commissionsList = data;
        });
      }

      if(event.keyCode == 8 || event.keyCode == undefined)
      {
        this._helperService.getCommissionsLKP('').subscribe((data) =>
        {
          this.commissionsList = data;
        });
      }
    }, 1000);
  }

  searchGroupsBegin(event)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      debugger
      if(event.keyCode != 13 && event.keyCode != undefined)
      {
        this._helperService.getGroupsLKP(event.target.value).subscribe((data) =>
        {
          this.groupsList = data;
        });
      }

      if(event.keyCode == 8 || event.keyCode == undefined)
      {
        this._helperService.getGroupsLKP('').subscribe((data) =>
        {
          this.groupsList = data;
        });
      }
    }, 1000);
  }

  searchAccountsOrdersBegin(event)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      debugger
      if(event.keyCode != 13 && event.keyCode != undefined)
      {
        this._helperService.getAccountsOrdersLKP(event.target.value).subscribe((data) =>
        {
          this.accountsList = data;
        });
      }

      if(event.keyCode == 8 || event.keyCode == undefined)
      {
        this._helperService.getAccountsOrdersLKP('').subscribe((data) =>
        {
          this.accountsList = data;
        });
      }
    }, 1000);
  }

  selectItem(i,searchInputNumber,inputName,inputNumber)
  {
    debugger
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdS" + i) as HTMLElement;

    (this.ar_salesmen.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.ar_salesmen.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }
  //__________________________

  Save()
  {
    if(this.ValidateForm() == false)
      return;

    this.showspinner = true;
    var formData = new FormData();
    this.ar_salesmen.value.d_start_date=new DatePipe('en-US').transform(this.ar_salesmen.value.d_start_date, 'yyyy/MM/dd');
    this.ar_salesmen.value.d_leaving_date=new DatePipe('en-US').transform(this.ar_salesmen.value.d_leaving_date, 'yyyy/MM/dd');

    formData.append('n_salesman_id', this.ar_salesmen?.value.n_salesman_id ?? 0);
    formData.append('n_DataAreaID', this.ar_salesmen?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ar_salesmen?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ar_salesmen?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ar_salesmen?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ar_salesmen?.value.d_UserUpdateDate ?? '');
    formData.append('s_salesman_name', this.ar_salesmen?.value.s_salesman_name ?? '');
    formData.append('s_salesman_name_eng', this.ar_salesmen?.value.s_salesman_name_eng ?? '');
    formData.append('n_employee_id', this.ar_salesmen?.value.n_employee_id ?? 0);
    formData.append('n_agent_type_id', this.ar_salesmen?.value.n_agent_type_id ?? 0);
    formData.append('n_commission_type_id', this.ar_salesmen?.value.n_commission_type_id ?? 0);
    formData.append('n_supervisior_id', this.ar_salesmen?.value.n_supervisior_id ?? 0);
    formData.append('n_basic_salaray', this.ar_salesmen?.value.n_basic_salaray ?? 0);
    formData.append('n_precent_value', this.ar_salesmen?.value.n_precent_value ?? 0);
    formData.append('n_transportation', this.ar_salesmen?.value.n_transportation ?? 0);
    formData.append('n_max_discount', this.ar_salesmen?.value.n_max_discount ?? 0);
    formData.append('n_group_id', this.ar_salesmen?.value.n_group_id ?? 0);
    formData.append('n_target_type', this.ar_salesmen?.value.n_target_type ?? 0);
    formData.append('n_collection_percent', this.ar_salesmen?.value.n_collection_percent ?? 0);
    formData.append('n_sales_percent', this.ar_salesmen?.value.n_sales_percent ?? 0);
    formData.append('s_notes', this.ar_salesmen?.value.s_notes ?? '');
    formData.append('s_related_account', this.ar_salesmen?.value.s_related_account ?? '');
    formData.append('s_tel_no', this.ar_salesmen?.value.s_tel_no ?? '');
    formData.append('s_e_mail', this.ar_salesmen?.value.s_e_mail ?? '');
    formData.append('s_fax_no', this.ar_salesmen?.value.s_fax_no ?? '');
    formData.append('n_first_container_price', this.ar_salesmen?.value.n_first_container_price ?? 0);
    formData.append('n_second_container_price', this.ar_salesmen?.value.n_second_container_price ?? 0);
    formData.append('n_more_container_price', this.ar_salesmen?.value.n_more_container_price ?? 0);
    formData.append('b_left_work', this.ar_salesmen?.value.b_left_work ?? false);
    formData.append('b_supervisor', this.ar_salesmen?.value.b_supervisor ?? false);
    formData.append('b_Allow_Comm', this.ar_salesmen?.value.b_Allow_Comm ?? false );
    formData.append('d_start_date', this.ar_salesmen?.value.d_start_date ?? '' );
    formData.append('d_leaving_date', this.ar_salesmen?.value.d_leaving_date ?? '' );
    formData.append('s_tel', this.ar_salesmen?.value.s_tel ?? '' );
    formData.append('s_manager_id', this.ar_salesmen?.value.s_manager_id ?? '' );

    if(this.n_salesman_id !=null && this.n_salesman_id > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
     this. _notification.ShowMessage(data.Emsg,data.status);
    else 
    this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/salesmenList']);
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
          this._router.navigate(['/ar/salesmenList']);
        }
      });
    }
  }

  ValidateForm(): boolean
  {
    var isValid = true;
    if(this.ar_salesmen?.value.s_salesman_name == null || this.ar_salesmen?.value.s_salesman_name == '')
    {
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert supplier name',2)
      else
      this._notification.ShowMessage('من فضلك ادخل اسم المورد', 2);
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
