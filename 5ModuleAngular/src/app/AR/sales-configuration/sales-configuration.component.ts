import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { SalesConfiguartionService } from 'src/app/Core/Api/AR/sales-configuration.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { AccountsPopUpComponent } from 'src/app/SC/stores/accounts-pop-up/accounts-pop-up.component';

import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-sales-configuration',
  templateUrl: './sales-configuration.component.html',
  styleUrls: ['./sales-configuration.component.css']
})
export class SalesConfigurationComponent extends BaseComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  salesConfigurationForm!: FormGroup;
  showspinner= true;
  isEnglish:boolean=false;
  DocNo!: any;
  Types:any=[];
  accounts: any[]=[];
  hidetheinput:boolean=false;
  myDatepipe!: any;
  dtOptions: DataTables.Settings = {};
  Edit: boolean=false;
  Add: Boolean=true;
  searchingSupplierTypes:boolean=false;
  DataAreaNo: any;
  isFollowCreditChecked: boolean = false;

  supplierArea:any='';
  supplierType:any='';
  supplierPurchaseMan:any='';
  supplierCommission:any='';
  accountsPrimary:any='';
  accountsSupplier:any=''


  is_b_use_Point_Of_SaleChanged: boolean = false;
  is_b_Endure_VATChanged: boolean = false;
  isAutoAddCharitySourceCostCenter: boolean = false;

  DiscountQtyPolictList: any[] = [];
  MaxQtyReactionList: any[] = [];
  RetuenSalesControlTypesList: any[] = [];
  searchingAccounts:any[]=[];
  Account:any []=[];
  PolicyStatusList: any[] = [];
  ReportsList: any[] = [];

  FractionAccountsList!: any;
  FractionAccountsSearching:boolean=false;
  FractionAccountsFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  EndureVatAccList!: any;
  EndureVatAccSearching:boolean=false;
  EndureVatAccFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  RelatedAccList!: any;
  RelatedAccSearching:boolean=false;
  RelatedAccFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  CustomerMainAccList!: any;
  CustomerMainAccSearching:boolean=false;
  CustomerMainAccFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  AccountsList!: any;
  AccountsSearching:boolean=false;
  AccountsFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  DiscReateIncreaseList!: any;
  DiscReateIncreaseSearching:boolean=false;
  DiscReateIncreaseFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  CustContractMainAccList!: any;
  CustContractMainAccSearching:boolean=false;
  CustContractMainAccFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  IncomeDueAccList!: any;
  IncomeDueAccSearching:boolean=false;
  IncomeDueAccFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  IncomeRealAccList!: any;
  IncomeRealAccSearching:boolean=false;
  IncomeRealAccFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

// start constructor
  constructor(private fb:FormBuilder, private dialog:MatDialog, private http:HttpClient, private _SERVICE:SalesConfiguartionService,
    private _activatedRoute: ActivatedRoute, private _notification: NotificationServiceService, private userservice:UserService,
    private _router:Router, private dialogRef:MatDialog, private _lookup:GenerealLookup
  )
  {
    super(_activatedRoute.data,userservice);
    this.salesConfigurationForm = this.fb.group({
      n_DataAreaID: '',
      n_UserAdd: '',
      d_UserAddDate: '',
      n_UserUpdate: '',
      d_UserUpdateDate: '',
      n_current_branch: '',
      n_current_company: '',
      n_current_year: '',

      //--------------------------------------------------------------------------------
                //Options
      b_openNewInstance: '',
      b_use_last_item_price: '',
      b_seeBalanceInInvoice: '',
      b_LimitOnInvoice: '',
      b_salesman_with_store: '',
      b_use_customer_warranty: '',
      b_salesm_man_required: '',
      b_use_Invoice_creditLimit: '',
      b_quantity_default: '',
      b_vat_before_discount_in_salesservices: '',
      b_Monitoring_sale_price_items: '',
      b_Use_Fractions: '',
      n_FractionFrom_one: '',
      n_FractionTo_one: '',
      n_FractionResult_one: '',
      n_FractionFrom_Two: '',
      n_FractionTo_two: '',
      n_FractionResult_two: '',
      s_Fraction_Account: '',
      b_customer_discount: '',
      b_Use_Partial_price: '',
      b_use_invType_Price: '',
      b_distribute_Expenses_on_Inv_revenue: '',
      b_close_advance_payments_in_invoice: '',
      n_SalesTypeDefault: '',
      n_salesReturnType_Default: '',
      b_serch_item_type: '',
      b_showItemCostInInv: '',
      b_serch_item_Group: '',
      b_use_dateonrep: '',
      b_print_journals_after_save: '',
      n_print_re: '',
      n_ex_print_re: '',
      n_Print_option: '',
      //-----------------------------------------------------------------------
            //Additional Options
      b_use_Point_Of_Sale: '',
      b_UseServerDate: '',
      b_use_Least_sell_price_pos: '',
      b_cash_not_required_if_creditcash_in_pos: '',
      b_Show_InvoiceSerial_Desc: '',
      b_Activate_max_allowed_count: '',
      b_prevent_discount_advanced_payment: '',
      b_link_customerAcc_with_SalesManAcc: '',
      b_show_posInvoice_in_salesInvoice: '',
      b_activate_returnsales_reaons: '',
      b_prevent_edit_salesinvoice_when_paid: '',
      b_show_savemsg_in_pos_return: '',
      b_returninvoie_Paid_same_as_invoicePaid: '',
      b_activate_item_cost_center: '',
      b_Use_ServiceInvoice: '',
      b_inv_category_required: '',
      b_hide_price_in_request_order: '',
      b_Active_shift: '',
      b_use_time: '',
      b_hide_oldInvoices: '',
      b_bonus_round_min: '',
      b_discount_by_qty: '',
      b_activate_price_list: '',
      b_use_item_color: '',
      b_pos_total_journal_per_day: '',
      b_prevent_returnPos_without_SellInvoice: '',
      b_prevent_make_posreturn_invoicePayment: '',
      b_use_multi_card_pos: '',
      b_prevent_direct_sales_invoice: '',
      b_confirm_to_invoice_journal: '',
      b_show_profit_sales_invoice: '',
      n_discount_qty_policy: '',
      n_customer_display_port: '',
      s_pos_weight_pattern: '',
      n_allowed_return_period_days: '',
      n_participate_days_alert: '',
      n_max_qty_reaction: '',
      n_returnsales_reaons_control_type: '',
      b_Endure_VAT: '',
      s_Endure_VAT_Account: '',

      //-----------------------------------------------------------------------
            // Monitoring
      b_usecreditLimitForSalesMen: '',
      b_use_follow_credit_limit: '',
      b_checkCustMobileNo: '',
      n_credit_limit_reaction: '',
      b_use_cost_price_in_invoice: '',
      b_check_cost_with_price: '',
      b_watch_profit_with_cost: '',

      //------------------------------------------------------------------------
              //Accounts Tab
      b_AddCustAsTypes: '',
      b_auto_add_charity_source_cost_center: [true],
      b_use_one_acc_customer: [false],
      b_use_multi_acc_customer: [false],
      b_Gl_AutoCoding: [false],
      b_use_one_acc_CustType: [false],
      b_use_multi_acc_CustType: [false],
      s_related_account_no: '',
      s_Customers_Main_Account: '',
      b_expense_account: '',
      b_income_account: '',
      b_income_account_item_type: '',
      s_account_no: '',
      s_decrease_increase_shift_acc_no: '',
      s_CustContractMaintainance_Acc: '',
      s_income_due_account: '',
      s_income_real_account: '',
      b_Invoice_GroupJournal: '',
      b_Return_Group_journal: '',
      b_show_journal_in_trans: '',
      b_activate_JournalCost_with_Sales: '',

      //-----------------------------------------------------------------------
              //DiscountPolicy Tab
      ar_discount_policy: this.fb.array([]),
      ar_item_discount_policy: this.fb.array([]),

      //----------------------------------------------------------------------
              //Special Activities
      b_use_contract_no: '',
      b_use_invoice_retention: '',
      b_last_item_discount_drugs: '',
      b_dr_in_pos: '',
      b_useAgentPrice: '',
      b_sellprice_taxable_in_resturant: '',
      b_sellprice_taxable_in_Pos: '',
      b_get_salesinvoice_manual_fintrans: '',
      b_alarm_party: '',
      b_allow_party_price_change: '',
      b_activate_search_by_first_number: '',
      b_use_vouchers_coupons: '',
      b_use_cost_center_with_retained_warranty: '',
      n_credit_invoice_min_value: '',
      n_PriceFractionFrom_one: '',
      n_PriceFractionTo_one: '',
      n_PriceFractionResult_one: '',
      n_PriceFractionFrom_two: '',
      n_PriceFractionTo_two: '',
      n_PriceFractionResult_two: '',
      s_rest_rep1: '',
      s_rest_rep2: '',
      s_rest_rep3: '',
      s_rest_rep4: '',
      n_rest_table_time: '',
      b_auto_add_charity_category_acc: '',
      b_link_Account: '',
      b_activate_prepaid_cards_in_pos: '',

      //----------------------------------------------------------------------
      });
  }

 override ngOnInit(): void {
  this.showspinner=true;

  this._SERVICE.GetDiscountQtyPolicy().subscribe((data) => {
    this.DiscountQtyPolictList = data;
  });

  this._SERVICE.GetMaxQtyReactions().subscribe((data) => {
    this.MaxQtyReactionList = data;
  });

  this._SERVICE.GetReturnSalesTypes().subscribe((data) => {
    this.RetuenSalesControlTypesList = data;
  });

  this._SERVICE.GetPolicyStatus().subscribe((data) => {
    this.PolicyStatusList = data;
  });

  this._SERVICE.GetReportsNames().subscribe((data) => {
    this.ReportsList = data;
  });

  this.FractionAccountsSearch('');
  this.EndureVatAccSearch('');
  this.RelatedAccSearch('');
  this.CustomerMainAccSearch('');
  this.AccountsSearch('');
  this.DiscReateIncreaseSearch('');
  this.CustContractMainAccSearch('');
  this.IncomeDueAccSearch('');
  this.IncomeRealAccSearch('');

  this._SERVICE.GetByID(0).subscribe( (data) => {
    this.salesConfigurationForm.patchValue(data);

    if(data.ar_discount_policy != null || data.ar_discount_policy != undefined)
    {
      data.ar_discount_policy.forEach(element => {
        this.ar_discount_policy.push(this.newDiscountPolicyDetails(this.ar_discount_policy.length + 1));
      });
      (this.salesConfigurationForm.get("ar_discount_policy") as FormArray)?.patchValue(data.ar_discount_policy);
    }

    if(data.ar_item_discount_policy != null || data.ar_item_discount_policy != undefined)
    {
      data.ar_item_discount_policy.forEach(element => {
        this.ar_item_discount_policy.push(this.newItemDiscountPolicyDetails(this.ar_item_discount_policy.length + 1));
      });
      (this.salesConfigurationForm.get("ar_item_discount_policy") as FormArray)?.patchValue(data.ar_item_discount_policy);
    }

    this.b_auto_add_charity_source_cost_centerChanged();
    this.b_Endure_VATChanged();
    this.b_use_Point_Of_SaleChanged();
    this.b_use_follow_credit_limitChanged();
    this.showspinner=false;
  });

  this.salesConfigurationForm.get('b_use_one_acc_customer')?.valueChanges.subscribe((value) => {
    if (value) {
      this.salesConfigurationForm.get('b_use_multi_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_Gl_AutoCoding')?.setValue(false);
      this.salesConfigurationForm.get('b_use_one_acc_CustType')?.setValue(false);
      this.salesConfigurationForm.get('b_use_multi_acc_CustType')?.setValue(false);
    }
  });
  this.salesConfigurationForm.get('b_use_multi_acc_customer')?.valueChanges.subscribe((value) => {
    if (value) {
      this.salesConfigurationForm.get('b_use_one_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_Gl_AutoCoding')?.setValue(false);
      this.salesConfigurationForm.get('b_use_one_acc_CustType')?.setValue(false);
      this.salesConfigurationForm.get('b_use_multi_acc_CustType')?.setValue(false);
    }
  });
  this.salesConfigurationForm.get('b_Gl_AutoCoding')?.valueChanges.subscribe((value) => {
    if (value) {
      this.salesConfigurationForm.get('b_use_one_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_use_multi_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_use_one_acc_CustType')?.setValue(false);
      this.salesConfigurationForm.get('b_use_multi_acc_CustType')?.setValue(false);
    }
  });
  this.salesConfigurationForm.get('b_use_one_acc_CustType')?.valueChanges.subscribe((value) => {
    if (value) {
      this.salesConfigurationForm.get('b_use_one_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_use_multi_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_Gl_AutoCoding')?.setValue(false);
      this.salesConfigurationForm.get('b_use_multi_acc_CustType')?.setValue(false);
    }
  });
  this.salesConfigurationForm.get('b_use_multi_acc_CustType')?.valueChanges.subscribe((value) => {
    if (value) {
      this.salesConfigurationForm.get('b_use_one_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_use_multi_acc_customer')?.setValue(false);
      this.salesConfigurationForm.get('b_use_one_acc_CustType')?.setValue(false);
      this.salesConfigurationForm.get('b_Gl_AutoCoding')?.setValue(false);
    }
  });

  this.translateData();
  this.translatefun();
  if(window.sessionStorage["lan"]==="English")
    this.isEnglish=true;
}
// END HOOKS METHODS

get ar_discount_policy() : FormArray {
  return this.salesConfigurationForm.get("ar_discount_policy") as FormArray;
}

get ar_item_discount_policy() : FormArray {
  return this.salesConfigurationForm.get("ar_item_discount_policy") as FormArray;
}

addDiscountPolicyDetails() {
  this.ar_discount_policy.push(this.newDiscountPolicyDetails(this.ar_discount_policy.length + 1));
}

addItemDiscountPolicyDetails() {
  this.ar_item_discount_policy.push(this.newItemDiscountPolicyDetails(this.ar_item_discount_policy.length + 1));
}

newDiscountPolicyDetails(line: number = 0): FormGroup {
  return this.fb.group({
    n_line_no: line,
    s_code: '',
    s_name: '',
    s_name_eng: '',
    n_status: '',
    n_sort: ''
  });
}

newItemDiscountPolicyDetails(line: number = 0): FormGroup {
  return this.fb.group({
    n_line_no: line,
    s_code: '',
    s_name: '',
    s_name_eng: '',
    n_status: '',
    n_sort: ''
  });
}

RemoveDiscountPolicyDetail(i:number) {
  this.ar_discount_policy.removeAt(i);
}

RemoveItemDiscountPolicyDetail(i:number) {
  this.ar_item_discount_policy.removeAt(i);
}
// START FUNCTIONS
disableButtons() {
  debugger;
  $(':button').prop('disabled', true);
  $("input[type=button]").attr("disabled", "disabled");
}

enableButtons() {
  $(':button').prop('disabled', false);
  $('input[type=button]').removeAttr("disabled");

}
openDialogAcc(event:any)
{
 const dialogRef=this.dialogRef.open(AccountsPopUpComponent,{
  height:'700px',
  width:'600px',
  data:{}
 })

 dialogRef.afterClosed().subscribe(res=>{
 (this.salesConfigurationForm.get("s_account_name"))?.patchValue(`${res.data.s_account_no} # ${res.data.s_account_name}` );
 (this.salesConfigurationForm.get("s_account_no"))?.patchValue(res.data.s_account_no );

//  let nameOfInput=(document.querySelector(event.target.id+"+ input") as HTMLElement).getAttribute("formControlName");
//  (this.storeForm.get(nameOfInput))?.patchValue(res.data.s_account_no);
 });
}
serachOpen(event)
{
  let element =document.querySelector("#" + event.target.id +"+ .search-list ") as HTMLElement
  element.style.opacity="1";
  element.style.zIndex="100";
}

searchClose(event)
{
let element =document.querySelector("#" + event.target.id +"+ .search-list ") as HTMLElement
element.style.opacity="0";
element.style.zIndex="-1";
}
searchBegin(event)
{
setTimeout(()=>{
  this._lookup.getAcountSerach(event.target.value ,event.target.value).subscribe(res=>{
  this.searchingAccounts=res;
});
},2000)
}

selectItem(i,searchInputNumber,inputName,inputNumber)
{
  let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
  let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber + " #tdS" + i) as HTMLElement;

  (this.salesConfigurationForm.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
  (this.salesConfigurationForm.get(inputNumber))?.patchValue(AccountNo.innerHTML);
  let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
  element.style.opacity="0";
  element.style.zIndex="-1";
}

searchHide(searchInputNumber)
{
  let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
element.style.opacity="0";
element.style.zIndex="-1";
}


save()
{
  this.showspinner=true;
  this.disableButtons();

var formData: any = new FormData();

      formData.append("n_DataAreaID", this.salesConfigurationForm.value.n_DataAreaID ?? 0);
      formData.append("n_UserAdd", this.salesConfigurationForm.value.n_UserAdd ?? 0);
      formData.append("d_UserAddDate", this.salesConfigurationForm.value.d_UserAddDate ?? "");
      formData.append("n_UserUpdate", this.salesConfigurationForm.value.n_UserUpdate ?? 0);
      formData.append("d_UserUpdateDate", this.salesConfigurationForm.value.d_UserUpdateDate ?? "");
      formData.append("n_current_branch", this.salesConfigurationForm.value.n_current_branch ?? 0);
      formData.append("n_current_company", this.salesConfigurationForm.value.n_current_company ?? 0);
      formData.append("n_current_year", this.salesConfigurationForm.value.n_current_year ?? 0);

      formData.append("b_openNewInstance", this.salesConfigurationForm.value.b_openNewInstance ?? false);
      formData.append("b_use_last_item_price", this.salesConfigurationForm.value.b_use_last_item_price ?? false);
      formData.append("b_seeBalanceInInvoice", this.salesConfigurationForm.value.b_seeBalanceInInvoice ?? false);
      formData.append("b_LimitOnInvoice", this.salesConfigurationForm.value.b_LimitOnInvoice ?? false);
      formData.append("b_salesman_with_store", this.salesConfigurationForm.value.b_salesman_with_store ?? false);
      formData.append("b_use_customer_warranty", this.salesConfigurationForm.value.b_use_customer_warranty ?? false);
      formData.append("b_salesm_man_required", this.salesConfigurationForm.value.b_salesm_man_required ?? false);
      formData.append("b_use_Invoice_creditLimit", this.salesConfigurationForm.value.b_use_Invoice_creditLimit ?? false);
      formData.append("b_quantity_default", this.salesConfigurationForm.value.b_quantity_default ?? false);
      formData.append("b_vat_before_discount_in_salesservices", this.salesConfigurationForm.value.b_vat_before_discount_in_salesservices ?? false);
      formData.append("b_Monitoring_sale_price_items", this.salesConfigurationForm.value.b_Monitoring_sale_price_items ?? false);
      formData.append("b_Use_Fractions", this.salesConfigurationForm.value.b_Use_Fractions ?? false);
      formData.append("n_FractionFrom_one", this.salesConfigurationForm.value.n_FractionFrom_one ?? 0);
      formData.append("n_FractionTo_one", this.salesConfigurationForm.value.n_FractionTo_one ?? 0);
      formData.append("n_FractionResult_one", this.salesConfigurationForm.value.n_FractionResult_one ?? 0);
      formData.append("n_FractionFrom_Two", this.salesConfigurationForm.value.n_FractionFrom_Two ?? 0);
      formData.append("n_FractionTo_two", this.salesConfigurationForm.value.n_FractionTo_two ?? 0);
      formData.append("n_FractionResult_two", this.salesConfigurationForm.value.n_FractionResult_two ?? 0);
      formData.append("s_Fraction_Account", this.salesConfigurationForm.value.s_Fraction_Account ?? "");
      formData.append("b_customer_discount", this.salesConfigurationForm.value.b_customer_discount ?? false);
      formData.append("b_Use_Partial_price", this.salesConfigurationForm.value.b_Use_Partial_price ?? false);
      formData.append("b_use_invType_Price", this.salesConfigurationForm.value.b_use_invType_Price ?? false);
      formData.append("b_distribute_Expenses_on_Inv_revenue", this.salesConfigurationForm.value.b_distribute_Expenses_on_Inv_revenue ?? false);
      formData.append("b_close_advance_payments_in_invoice", this.salesConfigurationForm.value.b_close_advance_payments_in_invoice ?? false);
      formData.append("n_SalesTypeDefault", this.salesConfigurationForm.value.n_SalesTypeDefault ?? 0);
      formData.append("n_salesReturnType_Default", this.salesConfigurationForm.value.n_salesReturnType_Default ?? 0);
      formData.append("b_serch_item_type", this.salesConfigurationForm.value.b_serch_item_type ?? false);
      formData.append("b_showItemCostInInv", this.salesConfigurationForm.value.b_showItemCostInInv ?? false);
      formData.append("b_serch_item_Group", this.salesConfigurationForm.value.b_serch_item_Group ?? false);
      formData.append("b_use_dateonrep", this.salesConfigurationForm.value.b_use_dateonrep ?? false);
      formData.append("b_print_journals_after_save", this.salesConfigurationForm.value.b_print_journals_after_save ?? false);
      formData.append("n_print_re", this.salesConfigurationForm.value.n_print_re ?? 0);
      formData.append("n_ex_print_re", this.salesConfigurationForm.value.n_ex_print_re ?? 0);
      formData.append("n_Print_option", this.salesConfigurationForm.value.n_Print_option ?? 0);

      //-----------------------------------------------------------------------
            //Additional Options
      formData.append("b_use_Point_Of_Sale", this.salesConfigurationForm.value.b_use_Point_Of_Sale ?? false);
      formData.append("b_UseServerDate", this.salesConfigurationForm.value.b_UseServerDate ?? false);
      formData.append("b_use_Least_sell_price_pos", this.salesConfigurationForm.value.b_use_Least_sell_price_pos ?? false);
      formData.append("b_cash_not_required_if_creditcash_in_pos", this.salesConfigurationForm.value.b_cash_not_required_if_creditcash_in_pos ?? false);
      formData.append("b_Show_InvoiceSerial_Desc", this.salesConfigurationForm.value.b_Show_InvoiceSerial_Desc ?? false);
      formData.append("b_Activate_max_allowed_count", this.salesConfigurationForm.value.b_Activate_max_allowed_count ?? false);
      formData.append("b_prevent_discount_advanced_payment", this.salesConfigurationForm.value.b_prevent_discount_advanced_payment ?? false);
      formData.append("b_link_customerAcc_with_SalesManAcc", this.salesConfigurationForm.value.b_link_customerAcc_with_SalesManAcc ?? false);
      formData.append("b_show_posInvoice_in_salesInvoice", this.salesConfigurationForm.value.b_show_posInvoice_in_salesInvoice ?? false);
      formData.append("b_activate_returnsales_reaons", this.salesConfigurationForm.value.b_activate_returnsales_reaons ?? false);
      formData.append("b_prevent_edit_salesinvoice_when_paid", this.salesConfigurationForm.value.b_prevent_edit_salesinvoice_when_paid ?? false);
      formData.append("b_show_savemsg_in_pos_return", this.salesConfigurationForm.value.b_show_savemsg_in_pos_return ?? false);
      formData.append("b_returninvoie_Paid_same_as_invoicePaid", this.salesConfigurationForm.value.b_returninvoie_Paid_same_as_invoicePaid ?? false);
      formData.append("b_activate_item_cost_center", this.salesConfigurationForm.value.b_activate_item_cost_center ?? false);
      formData.append("b_Use_ServiceInvoice", this.salesConfigurationForm.value.b_Use_ServiceInvoice ?? false);
      formData.append("b_inv_category_required", this.salesConfigurationForm.value.b_inv_category_required ?? false);
      formData.append("b_hide_price_in_request_order", this.salesConfigurationForm.value.b_hide_price_in_request_order ?? false);
      formData.append("b_Active_shift", this.salesConfigurationForm.value.b_Active_shift ?? false);
      formData.append("b_use_time", this.salesConfigurationForm.value.b_use_time ?? false);
      formData.append("b_hide_oldInvoices", this.salesConfigurationForm.value.b_hide_oldInvoices ?? false);
      formData.append("b_bonus_round_min", this.salesConfigurationForm.value.b_bonus_round_min ?? false);
      formData.append("b_discount_by_qty", this.salesConfigurationForm.value.b_discount_by_qty ?? false);
      formData.append("b_activate_price_list", this.salesConfigurationForm.value.b_activate_price_list ?? false);
      formData.append("b_use_item_color", this.salesConfigurationForm.value.b_use_item_color ?? false);
      formData.append("b_pos_total_journal_per_day", this.salesConfigurationForm.value.b_pos_total_journal_per_day ?? false);
      formData.append("b_prevent_returnPos_without_SellInvoice", this.salesConfigurationForm.value.b_prevent_returnPos_without_SellInvoice ?? false);
      formData.append("b_prevent_make_posreturn_invoicePayment", this.salesConfigurationForm.value.b_prevent_make_posreturn_invoicePayment ?? false);
      formData.append("b_use_multi_card_pos", this.salesConfigurationForm.value.b_use_multi_card_pos ?? false);
      formData.append("b_prevent_direct_sales_invoice", this.salesConfigurationForm.value.b_prevent_direct_sales_invoice ?? false);
      formData.append("b_confirm_to_invoice_journal", this.salesConfigurationForm.value.b_confirm_to_invoice_journal ?? false);
      formData.append("b_show_profit_sales_invoice", this.salesConfigurationForm.value.b_show_profit_sales_invoice ?? false);
      formData.append("n_discount_qty_policy", this.salesConfigurationForm.value.n_discount_qty_policy ?? 0);
      formData.append("n_customer_display_port", this.salesConfigurationForm.value.n_customer_display_port ?? 0);
      formData.append("s_pos_weight_pattern", this.salesConfigurationForm.value.s_pos_weight_pattern ?? "");
      formData.append("n_allowed_return_period_days", this.salesConfigurationForm.value.n_allowed_return_period_days ?? 0);
      formData.append("n_participate_days_alert", this.salesConfigurationForm.value.n_participate_days_alert ?? 0);
      formData.append("n_max_qty_reaction", this.salesConfigurationForm.value.n_max_qty_reaction ?? 0);
      formData.append("n_returnsales_reaons_control_type", this.salesConfigurationForm.value.n_returnsales_reaons_control_type ?? 0);
      formData.append("b_Endure_VAT", this.salesConfigurationForm.value.b_Endure_VAT ?? false);
      formData.append("s_Endure_VAT_Account", this.salesConfigurationForm.value.s_Endure_VAT_Account ?? "");

      //-----------------------------------------------------------------------
            // Monitoring
      formData.append("b_usecreditLimitForSalesMen", this.salesConfigurationForm.value.b_usecreditLimitForSalesMen ?? false);
      formData.append("b_use_follow_credit_limit", this.salesConfigurationForm.value.b_use_follow_credit_limit ?? false);
      formData.append("b_checkCustMobileNo", this.salesConfigurationForm.value.b_checkCustMobileNo ?? false);
      formData.append("n_credit_limit_reaction", this.salesConfigurationForm.value.n_credit_limit_reaction ?? 0);
      formData.append("b_use_cost_price_in_invoice", this.salesConfigurationForm.value.b_use_cost_price_in_invoice ?? false);
      formData.append("b_check_cost_with_price", this.salesConfigurationForm.value.b_check_cost_with_price ?? false);
      formData.append("b_watch_profit_with_cost", this.salesConfigurationForm.value.b_watch_profit_with_cost ?? false);

      //------------------------------------------------------------------------
            //Accounts Tab
      formData.append("b_AddCustAsTypes", this.salesConfigurationForm.value.b_AddCustAsTypes ?? false);
      formData.append("b_auto_add_charity_source_cost_center", this.salesConfigurationForm.value.b_auto_add_charity_source_cost_center ?? false);
      formData.append("b_use_one_acc_customer", this.salesConfigurationForm.value.b_use_one_acc_customer ?? false);
      formData.append("b_use_multi_acc_customer", this.salesConfigurationForm.value.b_use_multi_acc_customer ?? false);
      formData.append("b_Gl_AutoCoding", this.salesConfigurationForm.value.b_Gl_AutoCoding ?? false);
      formData.append("b_use_one_acc_CustType", this.salesConfigurationForm.value.b_use_one_acc_CustType ?? false);
      formData.append("b_use_multi_acc_CustType", this.salesConfigurationForm.value.b_use_multi_acc_CustType ?? false);
      formData.append("s_related_account_no", this.salesConfigurationForm.value.s_related_account_no ?? "");
      formData.append("s_Customers_Main_Account", this.salesConfigurationForm.value.s_Customers_Main_Account ?? "");
      formData.append("b_expense_account", this.salesConfigurationForm.value.b_expense_account ?? false);
      formData.append("b_income_account", this.salesConfigurationForm.value.b_income_account ?? false);
      formData.append("b_income_account_item_type", this.salesConfigurationForm.value.b_income_account_item_type ?? false);
      formData.append("s_account_no", this.salesConfigurationForm.value.s_account_no ?? "");
      formData.append("s_decrease_increase_shift_acc_no", this.salesConfigurationForm.value.s_decrease_increase_shift_acc_no ?? "");
      formData.append("s_CustContractMaintainance_Acc", this.salesConfigurationForm.value.s_CustContractMaintainance_Acc ?? "");
      formData.append("s_income_due_account", this.salesConfigurationForm.value.s_income_due_account ?? "");
      formData.append("s_income_real_account", this.salesConfigurationForm.value.s_income_real_account ?? "");
      formData.append("b_Invoice_GroupJournal", this.salesConfigurationForm.value.b_Invoice_GroupJournal ?? false);
      formData.append("b_Return_Group_journal", this.salesConfigurationForm.value.b_Return_Group_journal ?? false);
      formData.append("b_show_journal_in_trans", this.salesConfigurationForm.value.b_show_journal_in_trans ?? false);
      formData.append("b_activate_JournalCost_with_Sales", this.salesConfigurationForm.value.b_activate_JournalCost_with_Sales ?? false);

      //-----------------------------------------------------------------------
            //DiscountPolicy Tab
      if(this.salesConfigurationForm.value.ar_discount_policy != null || this.salesConfigurationForm.value.ar_discount_policy != undefined || this.salesConfigurationForm.value.ar_discount_policy.length > 0)
      {
        for(var i = 0; i < this.salesConfigurationForm.value.ar_discount_policy.length; i++)
          {
            formData.append(`ar_discount_policy[${i}].n_line_no`, this.salesConfigurationForm.value.ar_discount_policy[i].n_line_no ?? 0);
            formData.append(`ar_discount_policy[${i}].s_code`, this.salesConfigurationForm.value.ar_discount_policy[i].s_code ?? "");
            formData.append(`ar_discount_policy[${i}].s_name`, this.salesConfigurationForm.value.ar_discount_policy[i].s_name ?? "");
            formData.append(`ar_discount_policy[${i}].s_name_eng`, this.salesConfigurationForm.value.ar_discount_policy[i].s_name_eng ?? "");
            formData.append(`ar_discount_policy[${i}].n_status`, this.salesConfigurationForm.value.ar_discount_policy[i].n_status ?? 0);
            formData.append(`ar_discount_policy[${i}].n_sort`, this.salesConfigurationForm.value.ar_discount_policy[i].n_sort ?? 0);
          }
      }

      if(this.salesConfigurationForm.value.ar_item_discount_policy != null || this.salesConfigurationForm.value.ar_item_discount_policy != undefined || this.salesConfigurationForm.value.ar_item_discount_policy.length > 0)
        {
          for(var i = 0; i < this.salesConfigurationForm.value.ar_item_discount_policy.length; i++)
            {
              formData.append(`ar_item_discount_policy[${i}].n_line_no`, this.salesConfigurationForm.value.ar_item_discount_policy[i].n_line_no ?? 0);
              formData.append(`ar_item_discount_policy[${i}].s_code`, this.salesConfigurationForm.value.ar_item_discount_policy[i].s_code ?? "");
              formData.append(`ar_item_discount_policy[${i}].s_name`, this.salesConfigurationForm.value.ar_item_discount_policy[i].s_name ?? "");
              formData.append(`ar_item_discount_policy[${i}].s_name_eng`, this.salesConfigurationForm.value.ar_item_discount_policy[i].s_name_eng ?? "");
              formData.append(`ar_item_discount_policy[${i}].n_status`, this.salesConfigurationForm.value.ar_item_discount_policy[i].n_status ?? 0);
              formData.append(`ar_item_discount_policy[${i}].n_sort`, this.salesConfigurationForm.value.ar_item_discount_policy[i].n_sort ?? 0);
            }
        }

      //----------------------------------------------------------------------
            //Special Activities
      formData.append("b_use_contract_no", this.salesConfigurationForm.value.b_use_contract_no ?? false);
      formData.append("b_use_invoice_retention", this.salesConfigurationForm.value.b_use_invoice_retention ?? false);
      formData.append("b_last_item_discount_drugs", this.salesConfigurationForm.value.b_last_item_discount_drugs ?? false);
      formData.append("b_dr_in_pos", this.salesConfigurationForm.value.b_dr_in_pos ?? false);
      formData.append("b_useAgentPrice", this.salesConfigurationForm.value.b_useAgentPrice ?? false);
      formData.append("b_sellprice_taxable_in_resturant", this.salesConfigurationForm.value.b_sellprice_taxable_in_resturant ?? false);
      formData.append("b_sellprice_taxable_in_Pos", this.salesConfigurationForm.value.b_sellprice_taxable_in_Pos ?? false);
      formData.append("b_get_salesinvoice_manual_fintrans", this.salesConfigurationForm.value.b_get_salesinvoice_manual_fintrans ?? false);
      formData.append("b_alarm_party", this.salesConfigurationForm.value.b_alarm_party ?? false);
      formData.append("b_allow_party_price_change", this.salesConfigurationForm.value.b_allow_party_price_change ?? false);
      formData.append("b_activate_search_by_first_number", this.salesConfigurationForm.value.b_activate_search_by_first_number ?? false);
      formData.append("b_use_vouchers_coupons", this.salesConfigurationForm.value.b_use_vouchers_coupons ?? false);
      formData.append("b_use_cost_center_with_retained_warranty", this.salesConfigurationForm.value.b_use_cost_center_with_retained_warranty ?? false);
      formData.append("n_credit_invoice_min_value", this.salesConfigurationForm.value.n_credit_invoice_min_value ?? 0);
      formData.append("n_PriceFractionFrom_one", this.salesConfigurationForm.value.n_PriceFractionFrom_one ?? 0);
      formData.append("n_PriceFractionTo_one", this.salesConfigurationForm.value.n_PriceFractionTo_one ?? 0);
      formData.append("n_PriceFractionResult_one", this.salesConfigurationForm.value.n_PriceFractionResult_one ?? 0);
      formData.append("n_PriceFractionFrom_two", this.salesConfigurationForm.value.n_PriceFractionFrom_two ?? 0);
      formData.append("n_PriceFractionTo_two", this.salesConfigurationForm.value.n_PriceFractionTo_two ?? 0);
      formData.append("n_PriceFractionResult_two", this.salesConfigurationForm.value.n_PriceFractionResult_two ?? 0);
      formData.append("s_rest_rep1", this.salesConfigurationForm.value.s_rest_rep1 ?? "");
      formData.append("s_rest_rep2", this.salesConfigurationForm.value.s_rest_rep2 ?? "");
      formData.append("s_rest_rep3", this.salesConfigurationForm.value.s_rest_rep3 ?? "");
      formData.append("s_rest_rep4", this.salesConfigurationForm.value.s_rest_rep4 ?? "");
      formData.append("n_rest_table_time", this.salesConfigurationForm.value.n_rest_table_time ?? 0);
      formData.append("b_auto_add_charity_category_acc", this.salesConfigurationForm.value.b_auto_add_charity_category_acc ?? false);
      formData.append("b_link_Account", this.salesConfigurationForm.value.b_link_Account ?? false);
      formData.append("b_activate_prepaid_cards_in_pos", this.salesConfigurationForm.value.b_activate_prepaid_cards_in_pos ?? false);

 this._SERVICE.Create(formData).subscribe(data=>{
   this.enableButtons();
   this.showspinner=false;
   this. _notification.ShowMessage(data.msg, data.status);
    if(data.status==1){
     this._router.navigate(['/ap/salesConfiguartion']);
    }
});
}

translateData()
  {
    setTimeout(() => {
      if(window.sessionStorage.getItem("lan")==="English")
    {
      debugger
      let listOfElement=document.getElementsByClassName("translatedata");
      let regex=/[\u0600-\u06FF]/
      for(let i=0;i<listOfElement.length;++i)
      {

          if( regex.test(listOfElement[i].innerHTML))
             {

              let enWord=listOfElement[i].getAttribute("data-en") as string ;
              let arword=listOfElement[i].innerHTML;
              let swapper=enWord;
              enWord=arword;
              arword=swapper;
              listOfElement[i].setAttribute("data-en",enWord);
              listOfElement[i].innerHTML=arword;
             }
      }

    }
    }, 0);

  }
  translatefun()
  {
    debugger
    if(window.sessionStorage.getItem("lan")==="English")
    {
      let listOfElement=document.getElementsByClassName("translate");
      let regex=/[\u0600-\u06FF]/
      for(let i=0;i<listOfElement.length;++i)
      {
          if(listOfElement[i].nodeName=='INPUT')
          {
            let inputElement=(listOfElement[i] as HTMLInputElement);
            if( regex.test(inputElement.value))
            {

             let enWord=listOfElement[i].getAttribute("data-en") as string ;
             let arword=inputElement.value;
             let swapper=enWord;
             enWord=arword;
             arword=swapper;
             listOfElement[i].setAttribute("data-en",enWord);
             inputElement.value=arword;
            }

          }
          else
          {
            if( regex.test(listOfElement[i].innerHTML))
            {

             let enWord=listOfElement[i].getAttribute("data-en") as string ;
             let arword=listOfElement[i].innerHTML;
             let swapper=enWord;
             enWord=arword;
             arword=swapper;
             listOfElement[i].setAttribute("data-en",enWord);
             listOfElement[i].innerHTML=arword;
            }


      }

    }
    }
  }

  b_use_Point_Of_SaleChanged()
  {
    var is_Checked = this.salesConfigurationForm.get('b_use_Point_Of_Sale')?.value;
    if(is_Checked == true)
      this.is_b_use_Point_Of_SaleChanged = true;
    else
    this.is_b_use_Point_Of_SaleChanged = false;
  }

  b_Endure_VATChanged()
  {
    var is_Checked = this.salesConfigurationForm.get('b_Endure_VAT')?.value;
    if(is_Checked == true)
      this.is_b_Endure_VATChanged = true;
    else
      this.is_b_Endure_VATChanged = false;
  }

  b_auto_add_charity_source_cost_centerChanged()
  {
    var is_Checked = this.salesConfigurationForm.get('b_auto_add_charity_source_cost_center')?.value;
    if(is_Checked == true)
      this.isAutoAddCharitySourceCostCenter = true;
    else
      this.isAutoAddCharitySourceCostCenter = false;
  }

  FractionAccountsSearch(value: any) {
    this.FractionAccountsSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.FractionAccountsList=res;
      this.FractionAccountsFilteredServerSide.next(this.FractionAccountsList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.FractionAccountsSearching=false;
    })
  }

  EndureVatAccSearch(value: any) {
    this.EndureVatAccSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.EndureVatAccList=res;
      this.EndureVatAccFilteredServerSide.next(this.EndureVatAccList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.EndureVatAccSearching=false;
    })
  }

  RelatedAccSearch(value: any) {
    this.RelatedAccSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.RelatedAccList=res;
      this.RelatedAccFilteredServerSide.next(this.RelatedAccList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.RelatedAccSearching=false;
    })
  }

  CustomerMainAccSearch(value: any) {
    this.CustomerMainAccSearching=true;
    this._SERVICE.GetCustomersMainAccounts(value).subscribe(res=> {
      this.CustomerMainAccList=res;
      this.CustomerMainAccFilteredServerSide.next(this.CustomerMainAccList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.CustomerMainAccSearching=false;
    })
  }

  AccountsSearch(value: any) {
    this.AccountsSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.AccountsList=res;
      this.AccountsFilteredServerSide.next(this.AccountsList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.AccountsSearching=false;
    })
  }

  DiscReateIncreaseSearch(value: any) {
    this.DiscReateIncreaseSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.DiscReateIncreaseList=res;
      this.DiscReateIncreaseFilteredServerSide.next(this.DiscReateIncreaseList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.DiscReateIncreaseSearching=false;
    })
  }

  CustContractMainAccSearch(value: any) {
    this.CustContractMainAccSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.CustContractMainAccList=res;
      this.CustContractMainAccFilteredServerSide.next(this.CustContractMainAccList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.CustContractMainAccSearching=false;
    })
  }

  IncomeDueAccSearch(value: any) {
    this.IncomeDueAccSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.IncomeDueAccList=res;
      this.IncomeDueAccFilteredServerSide.next(this.IncomeDueAccList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.IncomeDueAccSearching=false;
    })
  }

  IncomeRealAccSearch(value: any) {
    this.IncomeRealAccSearching=true;
    this._SERVICE.GetEndureVatAccList(value).subscribe(res=> {
      this.IncomeRealAccList=res;
      this.IncomeRealAccFilteredServerSide.next(this.IncomeRealAccList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.IncomeRealAccSearching=false;
    })
  }

  b_use_follow_credit_limitChanged()
  {
    var isChecked = this.salesConfigurationForm.get('b_use_follow_credit_limit')?.value;
    if(isChecked == true)
      this.isFollowCreditChecked = true;
    else
      this.isFollowCreditChecked = false;
  }

  ApplyAll()
  {
    var value = Number(this.salesConfigurationForm.get('n_credit_limit_reaction')?.value);
    this._SERVICE.ApplyAll(value).subscribe((data) => {
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status);
      else
        this._notification.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
      }
    });
  }
//  END FUNCTIONS
}
