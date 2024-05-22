import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FinConfiguration } from 'src/app/Core/Api/FIN/fin-config.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { AccountsPopUpComponent } from 'src/app/SC/stores/accounts-pop-up/accounts-pop-up.component';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';


@Component({
  selector: 'app-fin-configuration',
  templateUrl: './fin-configuration.component.html',
  styleUrls: ['./fin-configuration.component.css']
})
export class FinConfigurationComponent extends BaseComponent implements OnInit  {

  constructor(
    private fb:FormBuilder
   ,private dialog:MatDialog
   ,private http:HttpClient,
    private _SERVICE:FinConfiguration,
    private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService,
    private userservice:UserService,
    private _router:Router,
    private dialogRef:MatDialog,
    private _lookup:GenerealLookup
  ) {

    super(_activatedRoute.data,userservice);
    this.finConfigurationForm = this.fb.group({
      n_print_re :[''],
       b_link_Account :[''],
       b_car_revenue :[''],
       b_control_bank_balance :[''],
       b_use_job_order_press :[''],
       b_repeat_row :[''],
       b_preview_journals :[''],
       b_print_journals_after_save :[''],
       b_create_group_Payment_journals :[''],
       b_create_group_Revenue_journals :[''],
       b_create_group_Multi_Payment_journals :[''],
       b_create_group_Multi_Revenue_journals :[''],
       b_create_group_MultiDocument_journals :[''],
       b_one_cash_in_gl :[''],
     s_one_cash_account :[''],
     s_one_cash_account_name:[''],
       b_Multi_cash_account :[''],
     s_Main_cash_Account :[''],
       b_one_cash_acc_by_type :[''],
       b_Multi_cash_acc_by_type :[''],
       b_auto_add_cash_acc :[''],
    s_main_auto_add_cash_acc :[''],
       b_one_Bank_in_gl :[''],
    s_one_Bank_account :[''],
    s_one_Bank_account_name:[''],
       b_Multi_Bank_account :[''],
       b_one_Bank_acc_by_type :[''],
       b_Multi_Bank_acc_by_type :[''],
       b_auto_add_Bank_acc :[''],
       b_Control_CashBox_Balance :[''],
    s_main_auto_add_Bank_acc :[''],
    s_main_auto_add_Bank_acc_name:[''],
    s_cash_discount_account :[''],
    s_cash_discount_account_name:[''],
    s_bank_fee_account :[''],
    s_bank_fee_account_name:[''],
    b_display_costcenter_credit_side :[''],
    b_Edit_Trans_After_Print_Cheque :[''],
    s_passports_expense :[''],
    d_curr_sys_date :[''],
       b_follow_up_cheque_trans :[''],
       b_cancel_sum_journals :[''],

       s_main_auto_add_cash_acc_name:[''],

       b_use_trans_source_in_payment :[''],
       b_show_production_no_in_multi_trans :[''],
       b_show_cheque_in_customer_module :[''],
       b_allow_repeat_book_no :[''],
       b_allow_to_payvalue_greaterthan_invoicepayment :[''],
       b_distribute_revenueValue_to_invoices :[''],
       b_paidinvoices_onbranch :[''],
       b_stop_book_no_serial_auto :[''],
     s_service_item_acc_for_custody :[''],
     s_service_item_acc_for_custody_name:[''],
       b_abbreviated_cheque_followup :[''],
      n_payment_transsource_action :[''],
       b_show_bank_balance_over_comp :[''],
       b_request_no_optional_in_custody_expenses :[''],
       b_distribute_cost_center_on_vat_clearance :[''],
       b_required_invoice_in_order_payment :[''],
       b_activate_middle_acc_in_cash_transfere :[''],
       b_confirm_financial_trans_make_journal :[''],
       b_distribute_PaymentValue_to_invoices :[''],
       s_account_name :[''],
       s_account_no :[''],







      });

  }
// END constructor

  // START VARIABLES DECLARTIONS
  showspinner= false;

  finConfigurationForm!: FormGroup ;
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
  isEnglish:boolean=false;
  supplierArea:any='';
  supplierType:any='';
  supplierPurchaseMan:any='';
  supplierCommission:any='';
  Account:any []=[];
  accountsPrimary:any='';
  accountsSupplier:any=''
  searchingAccounts:any[]=[];
 
 override ngOnInit(): void {
  this.showspinner=true;
  this._SERVICE.GetByID(window.localStorage["DataAreaID"] as number).subscribe(data=>{
    
    let testnumber=data["s_main_auto_add_cash_acc"]
    let testname=data["s_main_auto_add_cash_acc_name"];
    this.finConfigurationForm.patchValue({
      n_DataAreaID: data["n_DataAreaID"],
      n_print_re   : data["n_print_re"],
      b_link_Account :data["b_link_Account"],
      s_main_auto_add_cash_acc_name:data['s_main_auto_add_cash_acc_name']==null ? '':data["s_main_auto_add_cash_acc_name"] +'#'+data["s_main_auto_add_cash_acc"],
      s_one_cash_account_name:data['s_one_cash_account_name']==null ? '':data["s_one_cash_account_name"] +" # " +data["s_one_cash_account"],
      s_main_auto_add_Bank_acc_name:data['s_main_auto_add_Bank_acc_name']==null ? '':data["s_main_auto_add_Bank_acc_name"] +'#'+data["s_main_auto_add_Bank_acc"],
      s_one_Bank_account_name:data['s_one_Bank_account_name']==null ? '':data["s_one_Bank_account_name"] +'#'+data["s_one_Bank_account"],
      s_bank_fee_account_name:data['s_bank_fee_account_name']==null ? '':data["s_bank_fee_account_name"] +'#'+data["s_bank_fee_account"],
      s_cash_discount_account_name:data['s_cash_discount_account_name']==null ? '':data["s_cash_discount_account_name"] +'#'+data["s_cash_discount_account"],
      s_passports_expense_name:data['s_passports_expense_name']==null ? '':data["s_passports_expense_name"] +'#'+data["s_passports_expense"],
      s_service_item_acc_for_custody_name:data['s_service_item_acc_for_custody_name']==null ? '':data["s_service_item_acc_for_custody_name"] +"#"+data["s_service_item_acc_for_custody"],
      b_car_revenue  :data["b_car_revenue "],
      b_control_bank_balance   :data["b_control_bank_balance"],
      b_use_job_order_press  :data["b_use_job_order_press"],
      b_repeat_row    :data["b_repeat_row"],////
      b_preview_journals   :data["b_preview_journals"],
      b_print_journals_after_save   :data["b_print_journals_after_save"],
      b_create_group_Payment_journals   :data["b_create_group_Payment_journals"],/////
      b_create_group_Revenue_journals   :data["b_create_group_Revenue_journals"],
      b_create_group_Multi_Payment_journals   :data["b_create_group_Multi_Payment_journals"],/////
      b_create_group_Multi_Revenue_journals   :data["b_create_group_Multi_Revenue_journals"],/////
      b_create_group_MultiDocument_journals   :data["b_create_group_MultiDocument_journals "],////
      d_curr_sys_date  :data["d_curr_sys_date"],
      n_curr_replicated_id  :data["n_curr_replicated_id"],
      n_curr_closed_id  :data["n_curr_closed_id"],
      s_curr_user_id  :data["s_curr_user_idw"],
      b_one_cash_in_gl   :data["b_one_cash_in_gl"],///////
      s_one_cash_account   :data["s_one_cash_account"],
      b_Multi_cash_account   :data["b_Multi_cash_account"],
      s_Main_cash_Account   :data["s_Main_cash_Account"],////
      b_one_cash_acc_by_type   :data["b_one_cash_acc_by_type"],
      b_Multi_cash_acc_by_type   :data["b_Multi_cash_acc_by_type"],//////
      b_auto_add_cash_acc    :data["b_auto_add_cash_acc"],/////
      s_main_auto_add_cash_acc   :data["s_main_auto_add_cash_acc"],////
      b_one_Bank_in_gl   :data["b_one_Bank_in_gl"],////
      s_one_Bank_account   :data["s_one_Bank_account"],
      b_Multi_Bank_account   :data["b_Multi_Bank_account"],
      b_one_Bank_acc_by_type   :data["b_one_Bank_acc_by_type"],/////////////
      b_Multi_Bank_acc_by_type   :data["b_Multi_Bank_acc_by_type"],
      b_auto_add_Bank_acc   :data["b_auto_add_Bank_acc "],/////////////
      b_Control_CashBox_Balance   :data["b_Control_CashBox_Balance"],/////
      s_main_auto_add_Bank_acc   :data["s_main_auto_add_Bank_acc"],////
      s_cash_discount_account   :data["s_cash_discount_account"],
      s_bank_fee_account   :data["s_bank_fee_account"],//////
      b_display_costcenter_credit_side  :data["b_display_costcenter_credit_side"],
      b_Edit_Trans_After_Print_Cheque   :data["b_Edit_Trans_After_Print_Cheque"],
      s_passports_expense   :data["s_passports_expense"],//////
     ////////
     b_follow_up_cheque_trans   :data["b_follow_up_cheque_trans "],
     b_link_with_clinic  :data["b_link_with_clinic"],/////
     b_use_trans_source_in_payment   :data["b_use_trans_source_in_payment"],
     b_show_cheque_in_customer_module   :data["b_show_cheque_in_customer_module"],///
     b_allow_repeat_book_no   :data["b_allow_repeat_book_no"],////
     b_allow_to_payvalue_greaterthan_invoicepayment   :data["b_allow_to_payvalue_greaterthan_invoicepayment"],
     b_distribute_revenueValue_to_invoices   :data["b_distribute_revenueValue_to_invoices"],///
     b_paidinvoices_onbranch   :data["b_paidinvoices_onbranch"],///
     b_stop_book_no_serial_auto   :data["b_stop_book_no_serial_auto"],///
     s_service_item_acc_for_custody   :data["s_service_item_acc_for_custody"],////
     b_abbreviated_cheque_followup   :data["b_abbreviated_cheque_followup"],///
     n_payment_transsource_action   :data["n_payment_transsource_action"],////
     b_show_bank_balance_over_comp   :data["b_show_bank_balance_over_comp"],////
     b_request_no_optional_in_custody_expenses   :data["b_request_no_optional_in_custody_expenses"],///
     b_distribute_cost_center_on_vat_clearance   :data["b_distribute_cost_center_on_vat_clearance"],///
     b_required_invoice_in_order_payment   :data["b_required_invoice_in_order_payment"],///
     b_activate_middle_acc_in_cash_transfere   :data["b_activate_middle_acc_in_cash_transfere"],
     b_confirm_financial_trans_make_journal   :data["b_confirm_financial_trans_make_journal"],
     b_distribute_PaymentValue_to_invoices   :data["b_distribute_PaymentValue_to_invoices"]



  });
  this.showspinner=false;
  });
  
  LangSwitcher.translateData(1);
  LangSwitcher.translatefun()
  this.isEnglish= LangSwitcher.CheckLan();
}

disableButtons() {
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

 (this.finConfigurationForm.get("s_main_auto_add_cash_acc_name"))?.patchValue(`${res.data.s_account_no} # ${res.data.s_account_name}` );
 (this.finConfigurationForm.get("s_main_auto_add_cash_acc"))?.patchValue(res.data.s_account_no );

//  let nameOfInput=(document.querySelector(event.target.id+"+ input") as HTMLElement).getAttribute("formControlName");
//  (this.storeForm.get(nameOfInput))?.patchValue(res.data.s_account_no);



 })

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
})

},2000)
}
selectItem(i,searchInputNumber,inputName,inputNumber)
{
  debugger
  let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
  let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber + " #tdS" + i) as HTMLElement;

  (this.finConfigurationForm.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
  (this.finConfigurationForm.get(inputNumber))?.patchValue(AccountNo.innerHTML);
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



  debugger

var formData: any = new FormData();



formData.append("n_DataAreaID",this.finConfigurationForm.value.n_DataAreaID  ?? 0 );
formData.append("n_print_re",this.finConfigurationForm.value.n_print_re   ?? false );
formData.append("b_link_Account",this.finConfigurationForm.value.b_link_Account   ?? false );
formData.append("b_car_revenue",this.finConfigurationForm.value.b_car_revenue  ?? false );//
formData.append("b_use_job_order_press ",this.finConfigurationForm.value.b_use_job_order_press    ?? false );//
formData.append("b_repeat_row",this.finConfigurationForm.value.b_repeat_row   ?? false );
formData.append("b_preview_journals",this.finConfigurationForm.value.b_preview_journals   ?? false);////
formData.append("b_print_journals_after_save ",this.finConfigurationForm.value.b_print_journals_after_save  ?? false );/////
formData.append("b_create_group_Payment_journals",this.finConfigurationForm.value.b_create_group_Payment_journals  ?? false );//
formData.append("b_create_group_Revenue_journals",this.finConfigurationForm.value.b_create_group_Revenue_journals  );///
formData.append("b_create_group_Multi_Payment_journals",this.finConfigurationForm.value.b_create_group_Multi_Payment_journals  ?? false);///????????????
formData.append("b_create_group_Multi_Revenue_journals",this.finConfigurationForm.value.b_create_group_Multi_Revenue_journals ?? 0);/////
formData.append("b_create_group_MultiDocument_journals ",this.finConfigurationForm.value.b_create_group_MultiDocument_journals  );//////
formData.append("b_one_cash_in_gl ",this.finConfigurationForm.value.b_one_cash_in_gl??false   );
formData.append("s_one_cash_account",this.finConfigurationForm.value.s_one_cash_account );
formData.append("b_Multi_cash_account ",this.finConfigurationForm.value.b_Multi_cash_account  ??false);//
formData.append("s_Main_cash_Account",this.finConfigurationForm.value.s_Main_cash_Account  ?? false );
formData.append("b_one_cash_acc_by_type",this.finConfigurationForm.value.b_one_cash_acc_by_type  ?? false );
formData.append("b_Multi_cash_acc_by_type",this.finConfigurationForm.value.b_Multi_cash_acc_by_type  ?? false );//
formData.append("b_auto_add_cash_acc",this.finConfigurationForm.value.b_auto_add_cash_acc  ?? false);///
formData.append("s_main_auto_add_cash_acc",this.finConfigurationForm.value.s_main_auto_add_cash_acc  ?? false );///
formData.append("b_one_Bank_in_gl",this.finConfigurationForm.value.b_one_Bank_in_gl  ?? false);/////
formData.append("b_Multi_Bank_account",this.finConfigurationForm.value.b_Multi_Bank_account  ?? false );//////
formData.append("b_one_Bank_acc_by_type",this.finConfigurationForm.value.b_one_Bank_acc_by_type ?? false);
formData.append("b_Multi_Bank_acc_by_type ",this.finConfigurationForm.value.b_Multi_Bank_acc_by_type  ?? false );///////////////
formData.append("b_auto_add_Bank_acc ",this.finConfigurationForm.value.b_auto_add_Bank_acc  ?? false);///////////////////////
formData.append("b_Control_CashBox_Balance  ",this.finConfigurationForm.value.b_Control_CashBox_Balance ??false  );
formData.append("s_main_auto_add_Bank_acc",this.finConfigurationForm.value.s_main_auto_add_Bank_acc);////////
formData.append("s_cash_discount_account ",this.finConfigurationForm.value.s_cash_discount_account  );////////
formData.append("s_bank_fee_account",this.finConfigurationForm.value.s_bank_fee_account  );//////////////////
formData.append("b_display_costcenter_credit_side",this.finConfigurationForm.value.b_display_costcenter_credit_side   ?? false);///////////////
formData.append("b_Edit_Trans_After_Print_Cheque",this.finConfigurationForm.value.b_Edit_Trans_After_Print_Cheque  ??false );
formData.append("s_passports_expense",this.finConfigurationForm.value.s_passports_expense  );////////////////////
formData.append("d_curr_sys_date",this.finConfigurationForm.value.d_curr_sys_date  );////////////
formData.append("b_follow_up_cheque_trans",this.finConfigurationForm.value.b_follow_up_cheque_trans   ?? false);///////////////////////
formData.append("b_cancel_sum_journals",this.finConfigurationForm.value.b_cancel_sum_journals  ??false);////////
formData.append("b_use_trans_source_in_payment ",this.finConfigurationForm.value.b_use_trans_source_in_payment  ??false );/////////////
formData.append("b_show_production_no_in_multi_trans",this.finConfigurationForm.value.b_show_production_no_in_multi_trans  ??false );
formData.append("b_show_cheque_in_customer_module",this.finConfigurationForm.value.b_show_cheque_in_customer_module  ??false);/////
formData.append("b_allow_repeat_book_no ",this.finConfigurationForm.value.b_allow_repeat_book_no  ??false );/////////////
formData.append("b_allow_to_payvalue_greaterthan_invoicepayment",this.finConfigurationForm.value.b_allow_to_payvalue_greaterthan_invoicepayment ??false );////////////////
formData.append("b_distribute_revenueValue_to_invoices",this.finConfigurationForm.value.b_distribute_revenueValue_to_invoices  ?? false );///////
formData.append("b_paidinvoices_onbranch",this.finConfigurationForm.value.b_paidinvoices_onbranch ?? false )
formData.append("b_stop_book_no_serial_auto",this.finConfigurationForm.value.b_stop_book_no_serial_auto  ?? false );
formData.append("s_service_item_acc_for_custody",this.finConfigurationForm.value.s_service_item_acc_for_custody   );////////////////////
formData.append("b_abbreviated_cheque_followup",this.finConfigurationForm.value.b_abbreviated_cheque_followup  ?? false);
formData.append("n_payment_transsource_action",this.finConfigurationForm.value.n_payment_transsource_action  ??0);/////
formData.append("b_show_bank_balance_over_comp",this.finConfigurationForm.value.b_show_bank_balance_over_comp  ??false);
formData.append("b_request_no_optional_in_custody_expenses",this.finConfigurationForm.value.b_request_no_optional_in_custody_expenses ??false );
formData.append("b_distribute_cost_center_on_vat_clearance",this.finConfigurationForm.value.b_distribute_cost_center_on_vat_clearance  ??false );
formData.append("b_required_invoice_in_order_payment",this.finConfigurationForm.value.b_required_invoice_in_order_payment   ?? false );
formData.append("b_activate_middle_acc_in_cash_transfere",this.finConfigurationForm.value.b_activate_middle_acc_in_cash_transfere    ?? false );
formData.append("b_confirm_financial_trans_make_journal",this.finConfigurationForm.value.b_confirm_financial_trans_make_journal    ?? false );
formData.append("b_distribute_PaymentValue_to_invoices ",this.finConfigurationForm.value.b_distribute_PaymentValue_to_invoices    ?? false );
formData.append("s_Customers_Main_Account",this.finConfigurationForm.value.s_Customers_Main_Account   ?? 0 );



this.showspinner=true;
this.disableButtons();



 this._SERVICE.Create(formData).subscribe(data=>{
debugger
   this.enableButtons();
   this.showspinner=false;
   if(this.isEnglish)
   this._notification.ShowMessage(data.Emsg,data.status)
  else
   this. _notification.ShowMessage(data.msg,data.status);
    if(data.status==1){

     this._router.navigate(['/ap/salesConfiguartion']);



    }



});




}


}
