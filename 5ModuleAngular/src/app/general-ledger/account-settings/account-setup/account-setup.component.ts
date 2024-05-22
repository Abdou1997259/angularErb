import { HttpClient } from '@angular/common/http';
import { RelatedAccService } from 'src/app/Core/Api/GL/related-acc.service';
import { Component, OnInit } from '@angular/core';
import { RelatedAcc } from 'src/app/Core/model/Gl/RelatedAcc';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ReplaySubject } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { AccountSetupService } from 'src/app/Core/Api/GL/account-setup.service';
import { DatePipe } from '@angular/common';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';

@Component({
  selector: 'app-account-setup',
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.css']
})
export class AccountSetupComponent implements OnInit {
  accountingFrorm!: FormGroup;
  relatedAcc: Array<RelatedAcc> = [];
  showspinner: boolean = false;
  configuration: any;

  constructor(
    private _relatedAccService: RelatedAccService,
    private _httpClient: HttpClient,
    private fb: FormBuilder,
    private _accountSetupService: AccountSetupService,
    private _notificationService: NotificationServiceService,
    private _router: Router,
    private userservice:UserService,
    private _LookupControlService:LookupControlService
  ) {
    this.accountingFrorm = this.fb.group({
      n_DataAreaID: new FormControl(0),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      d_open_period_from: new FormControl('', Validators.required),
      d_open_period_to: new FormControl('', Validators.required),
      b_use_cost_center: false,
      b_close_preiod: false,
      b_period_jour: false,
      b_reverse_jour: false,
      b_auto_search_account: false,
      b_repeat_journal_desc: false,
      b_UsePosting: false,
      s_Not_Related_Acc: new FormControl(''),
      b_use_tow_cost: false,
      b_stop_cost_center_2: false,
      b_activate_item_budget_for_cost_centers: false,
      b_Control_CostCenter_WithAcc: false,
      b_financial_years_in_one_year:false,
      b_activate_accounts_by_branch:false,
      s_currency_diff_calculation:'',
      s_profitLoss_Posted_Acc:''
    });
  }

  //******************************************************************* */
  filteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searching:boolean=false;

 search(value: any){
   this.searching=true;
   this._relatedAccService.GetrelatedAcc().subscribe(res=>{
     this.relatedAcc=res;
     this.filteredServerSide.next(this.relatedAcc.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
     this.searching=false;
   })
 }
  //************************************** */


  ngOnInit(): void {
    debugger;
    this.showspinner = true;
    this.getCurrentCompanyConfig();
    this.search('');
  }

  checkJournals(){
    this._accountSetupService.checkJounals().subscribe((data) => {
      debugger;
      if(data>0)
      {
        this._notificationService.ShowMessage("لا يمكن تعديل الفترة لوجود قيود منشئة", 2);
        $("#btnSave").attr("disabled", "disabled");
      }
    });
  }

  getCurrentCompanyConfig() {
    this._accountSetupService.get().subscribe((data) => {
      //this.accountingFrorm.patchValue(data);
      // this.accountingFrorm.controls['n_DataAreaID'].disable();
      // this.accountingFrorm.controls['n_UserAdd'].disable();
      // this.accountingFrorm.controls['d_UserAddDate'].disable();
      // this.accountingFrorm.controls['n_UserUpdate'].disable();
      // this.accountingFrorm.controls['d_UserUpdateDate'].disable();
      // this.accountingFrorm.patchValue({d_open_period_from: data["d_open_period_from"]});
      // this.accountingFrorm.patchValue({d_open_period_to: data["d_open_period_to"]});

      if(data["d_open_period_from"] != "")
        this.accountingFrorm.get("d_open_period_from")?.patchValue(new Date(Number(data["d_open_period_from"].substring(0,4)), Number(data["d_open_period_from"].substring(5,7))-1, Number(data["d_open_period_from"].substring(8,10))));
      if(data["d_open_period_to"] != "")
        this.accountingFrorm.get("d_open_period_to")?.patchValue(new Date(Number(data["d_open_period_to"].substring(0,4)), Number(data["d_open_period_to"].substring(5,7))-1, Number(data["d_open_period_to"].substring(8,10))));

      this.accountingFrorm.patchValue({n_DataAreaID: data["n_DataAreaID"]});
      this.accountingFrorm.patchValue({n_UserAdd: data["n_UserAdd"]});
      this.accountingFrorm.patchValue({d_UserAddDate: data["d_UserAddDate"]});
      this.accountingFrorm.patchValue({n_UserUpdate: data["n_UserUpdate"]});
      this.accountingFrorm.patchValue({d_UserUpdateDate: data["d_UserUpdateDate"]});
      this.accountingFrorm.patchValue({b_use_cost_center: data["b_use_cost_center"]});
      this.accountingFrorm.patchValue({b_close_preiod: data["b_close_preiod"]});
      this.accountingFrorm.patchValue({b_period_jour: data["b_period_jour"]});
      this.accountingFrorm.patchValue({b_reverse_jour: data["b_reverse_jour"]});
      this.accountingFrorm.patchValue({b_auto_search_account: data["b_auto_search_account"]});
      this.accountingFrorm.patchValue({b_repeat_journal_desc: data["b_repeat_journal_desc"]});
      this.accountingFrorm.patchValue({b_UsePosting: data["b_UsePosting"]});
      this.accountingFrorm.patchValue({s_Not_Related_Acc: data["s_Not_Related_Acc"]});
      this.accountingFrorm.patchValue({b_use_tow_cost: data["b_use_tow_cost"]});
      this.accountingFrorm.patchValue({b_stop_cost_center_2: data["b_stop_cost_center_2"]});
      this.accountingFrorm.patchValue({b_activate_item_budget_for_cost_centers: data["b_activate_item_budget_for_cost_centers"]});
      this.accountingFrorm.patchValue({b_Control_CostCenter_WithAcc: data["b_Control_CostCenter_WithAcc"]});
      this.accountingFrorm.patchValue({b_financial_years_in_one_year: data["b_financial_years_in_one_year"]});
      this.accountingFrorm.patchValue({b_activate_accounts_by_branch: data["b_activate_accounts_by_branch"]});
      this.accountingFrorm.patchValue({s_currency_diff_calculation: data["s_currency_diff_calculation"]});
      this.accountingFrorm.patchValue({s_profitLoss_Posted_Acc: data["s_profitLoss_Posted_Acc"]});
      this._LookupControlService.SetName(this.accountingFrorm, "ACC", "s_currency_diff_calculation", "diffAccName");
      this._LookupControlService.SetName(this.accountingFrorm, "ACC", "s_profitLoss_Posted_Acc", "profAccName");

      this.checkJournals();
      this.showspinner = false;
    });
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  UserChange(event: Event) {}

  Save() {
    this.showspinner = true;
    this.disableButtons();
    var formData: any = new FormData();
    this.accountingFrorm.value.d_open_period_from=new DatePipe('en-US').transform(this.accountingFrorm.value.d_open_period_from, 'yyyy/MM/dd');
    this.accountingFrorm.value.d_open_period_to=new DatePipe('en-US').transform(this.accountingFrorm.value.d_open_period_to, 'yyyy/MM/dd');

    debugger;
    formData.append('n_DataAreaID', this.accountingFrorm.value.n_DataAreaID);
    formData.append('n_UserAdd', this.accountingFrorm.value.n_UserAdd);
    formData.append('d_UserAddDate', this.accountingFrorm.value.d_UserAddDate);
    formData.append('n_UserUpdate', this.accountingFrorm.value.n_UserUpdate);
    formData.append('d_UserUpdateDate', this.accountingFrorm.value.d_UserUpdateDate);
    formData.append('d_open_period_from', this.accountingFrorm.value.d_open_period_from);
    formData.append('d_open_period_to', this.accountingFrorm.value.d_open_period_to);
    formData.append('b_use_cost_center', this.accountingFrorm.value.b_use_cost_center);
    formData.append('b_close_preiod', this.accountingFrorm.value.b_close_preiod);
    formData.append('b_period_jour', this.accountingFrorm.value.b_period_jour);
    formData.append('b_reverse_jour', this.accountingFrorm.value.b_reverse_jour);
    formData.append('b_auto_search_account', this.accountingFrorm.value.b_auto_search_account);
    formData.append('b_repeat_journal_desc', this.accountingFrorm.value.b_repeat_journal_desc);
    formData.append('b_UsePosting', this.accountingFrorm.value.b_UsePosting);
    formData.append('s_Not_Related_Acc', this.accountingFrorm.value.s_Not_Related_Acc);
    formData.append('b_use_tow_cost',this.accountingFrorm.value.b_use_tow_cost);
    formData.append('b_stop_cost_center_2', this.accountingFrorm.value.b_stop_cost_center_2);
    formData.append('b_activate_item_budget_for_cost_centers', this.accountingFrorm.value.b_activate_item_budget_for_cost_centers);
    formData.append('b_Control_CostCenter_WithAcc', this.accountingFrorm.value.b_Control_CostCenter_WithAcc);
    formData.append('b_financial_years_in_one_year', this.accountingFrorm.value.b_financial_years_in_one_year);
    formData.append('b_activate_accounts_by_branch', this.accountingFrorm.value.b_activate_accounts_by_branch);
    formData.append('s_currency_diff_calculation', this.accountingFrorm.value.s_currency_diff_calculation);
    formData.append('s_profitLoss_Posted_Acc', this.accountingFrorm.value.s_profitLoss_Posted_Acc);

    this._accountSetupService.post(formData).subscribe(data => {
      this.showspinner=false;
      this.enableButtons();
      this._notificationService.ShowMessage(data.msg, data.status);
      if (data.status == 1) {
        this._router.navigate(['/accounts-settings/accountsetup']);
      }
    });
  }
}
