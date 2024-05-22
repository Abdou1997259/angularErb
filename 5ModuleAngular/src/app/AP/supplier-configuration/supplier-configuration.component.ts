import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierConfiguartion } from 'src/app/Core/Api/AP/supplier-configruation.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { AccountSupplierComponent } from './popUps/account-supplier/account-supplier.component';
import { AccountsPrimaryComponent } from './popUps/accounts-primary/accounts-primary.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-supplier-configuration',
  templateUrl: './supplier-configuration.component.html',
  styleUrls: ['./supplier-configuration.component.css']
})
export class SupplierConfigurationComponent extends BaseComponent implements OnInit {

  accDirList: any;
  accDirNameSearching:boolean=false;
  accDirNameFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  
  accMainList: any;
  accMainNameSearching:boolean=false;
  accMainNameFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    private fb:FormBuilder
   ,private dialog:MatDialog
   ,private http:HttpClient,
    private _SERVICE:SupplierConfiguartion,
    private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService,
    private userservice:UserService,


   private _router:Router
  ) {

    super(_activatedRoute.data,userservice);


    // FORM DEFIFNITION
    this.supplierConfigurationForm = this.fb.group({

    n_DataAreaID: '',
    b_using_disscount_ratio : [''],
    n_ex_print_re:'',
    b_LastPurchasePricePerSupp :'',
    n_default_Invoice_type:'',
    n_Print_option  :'',
    b_use_follow_credit_limit :'',
    n_credit_limit_reaction :'',
    n_store_Pos :'',
    b_AddSuppAsTypes :'',
    b_Control_CashBox_Balance :'',
    b_link_Account :'',
    b_use_cost_centers :'',
    b_use_one_acc_supplier :'',
    s_related_account_no :'',
    b_use_multi_acc_supplier :'',
    b_Gl_AutoCoding :'',
    s_Suppliers_s_Main_Account :'',
    b_use_one_acc_supplierType :'',
    b_use_multi_acc_supplierType :[''],
    b_show_journal_in_trans :'',
    b_Group_journal_Purchase :'',
    b_Group_journal_Return :'',
    d_curr_sys_date :'',
    n_curr_replicated_id :'',
    n_curr_closed_id :'',
    s_curr_user_id :'',
    b_ex_print_re :'',
    b_StockOutTransEachPurchase :'',
    b_partial_receiving :'',
    b_Bonus :'',
    b_group_invoice_by_supplier :'',
    d_UserAddDate :'',
    d_UserUpdateDate :'',
    b_Disable_Over_PO_Qty :'',
    b_Disable_Direct_Pur_INV:'',
    b_Pur_Inv_Trans_Source_Dlv_Order :'',
    b_use_auto_CurrCoff_by_PaymentPurchNo :'',
    b_prevent_change_purchaseInv_Date :'',
    b_direct_delivery_order :'',
    b_item_sales_tax_per_item :'',
    b_purchasePrice_greater_ImportOrder :'',
    b_disable_edit_in_purchase :'',
    n_current_year :'',
    n_current_company :'',
    n_current_branch :'',
    n_consume_monthly_period :'',
    b_PreventSave_IfPurchasePrice_AboveOrEqual_lowestSellingPrice :'',
    b_show_sell_min_price_purchaseInvoice :'',
    b_update_purchaseprice_after_discount :'',
    b_activate_cost_centers_budget_with_items_on_purchase_invoice :'',
    b_redistribute_manual_purchase_expenses :'',
    b_relative_tax_discount :'',
    b_activate_search_by_first_number :'',
    b_expense_account_by_item :'',
    b_print_purch_journal_after_save :'',
    b_show_costcenter_in_store_purchaseInvoice :'',

    ap_Quotation_Comparison_config: this.fb.array([])
    });
    // END FORM DEFIFNTION


   }

  // END constructor

  // START VARIABLES DECLARTIONS
  showspinner= false;

  supplierConfigurationForm!: FormGroup ;
  DocNo!: any;
  Types:any=[];
  accounts: any[]=[];
  myDatepipe!: any;
  dtOptions: DataTables.Settings = {};
  Edit: boolean=false;
  Add: Boolean=true;
  searchingSupplierTypes:boolean=false;
  DataAreaNo: any;

  supplierArea:any='';
  supplierType:any='';
  supplierPurchaseMan:any='';
  supplierCommission:any='';
  Account:any []=[];
  accountsPrimary:any='';
  accountsSupplier:any=''
  isEnglish:boolean=false;
   // END VARIABLES DECLARTIONS


  //  START HOOKS METHODS
   override ngOnInit(): void {
    this.showspinner=true;
    this.accDirNameSearch('');
    this.accMainNameSearch('');

    this._SERVICE.GetByID().subscribe((data)=>{
      debugger;
      this.supplierConfigurationForm.patchValue({ n_DataAreaID: data["n_DataAreaID"]});
      this.supplierConfigurationForm.patchValue({ b_using_disscount_ratio: data["b_using_disscount_ratio"]});
      this.supplierConfigurationForm.patchValue({ n_ex_print_re : data["n_ex_print_re"]});
      this.supplierConfigurationForm.patchValue({ b_LastPurchasePricePerSupp: data["b_LastPurchasePricePerSupp"]});
      this.supplierConfigurationForm.patchValue({ n_default_Invoice_type: data["n_default_Invoice_type"]});
      this.supplierConfigurationForm.patchValue({ n_Print_option: data["n_Print_option"]});
      this.supplierConfigurationForm.patchValue({ b_Disable_Direct_Pur_INV: data["b_Disable_Direct_Pur_INV"]});
      this.supplierConfigurationForm.patchValue({ b_use_follow_credit_limit: data["b_use_follow_credit_limit"]});
      this.supplierConfigurationForm.patchValue({ n_credit_limit_reaction: data["n_credit_limit_reaction"]});
      this.supplierConfigurationForm.patchValue({ b_AddSuppAsTypes : data["b_AddSuppAsTypes"]});
      this.supplierConfigurationForm.patchValue({ b_Control_CashBox_Balance: data["b_Control_CashBox_Balance"]});
      this.supplierConfigurationForm.patchValue({ b_link_Account: data["b_link_Account"]});
      this.supplierConfigurationForm.patchValue({ b_use_cost_centers: data["b_use_cost_centers"]});
      this.supplierConfigurationForm.patchValue({ b_use_one_acc_supplier: data["b_use_one_acc_supplier"]});
      this.supplierConfigurationForm.patchValue({ b_disable_edit_in_purchase: data["b_disable_edit_in_purchase"]});
      this.supplierConfigurationForm.patchValue({ b_purchasePrice_greater_ImportOrder : data["b_purchasePrice_greater_ImportOrder"]});
      this.supplierConfigurationForm.patchValue({ b_item_sales_tax_per_item: data["b_item_sales_tax_per_item"]});
      this.supplierConfigurationForm.patchValue({ b_direct_delivery_order: data["b_direct_delivery_order"]});
      this.supplierConfigurationForm.patchValue({ b_prevent_change_purchaseInv_Date: data["b_prevent_change_purchaseInv_Date"]});
      this.supplierConfigurationForm.patchValue({ b_use_auto_CurrCoff_by_PaymentPurchNo: data["b_use_auto_CurrCoff_by_PaymentPurchNo"]});
      this.supplierConfigurationForm.patchValue({ b_Pur_Inv_Trans_Source_Dlv_Order: data["b_Pur_Inv_Trans_Source_Dlv_Order"]});//////////
      this.supplierConfigurationForm.patchValue({ b_Disable_Direct_Pur_INV : data["b_Disable_Direct_Pur_INV"]});///////////////////
      this.supplierConfigurationForm.patchValue({ b_Disable_Over_PO_Qty: data["b_Disable_Over_PO_Qty"]});//////12
      this.supplierConfigurationForm.patchValue({ b_group_invoice_by_supplier: data["b_group_invoice_by_supplier"]});//////13
      this.supplierConfigurationForm.patchValue({ b_Bonus: data["b_Bonus"]});/////14
      this.supplierConfigurationForm.patchValue({ b_partial_receiving: data["b_partial_receiving"]});///15
      this.supplierConfigurationForm.patchValue({ b_StockOutTransEachPurchase: data["b_StockOutTransEachPurchase"]});///16
      this.supplierConfigurationForm.patchValue({ b_ex_print_re : data["b_ex_print_re"]});///17
      this.supplierConfigurationForm.patchValue({ b_Group_journal_Return: data["b_Group_journal_Return"]});;//18
      this.supplierConfigurationForm.patchValue({ b_Group_journal_Purchase: data["b_Group_journal_Purchase"]})///19
      this.supplierConfigurationForm.patchValue({ b_show_journal_in_trans: data["b_show_journal_in_trans"]});///20
      this.supplierConfigurationForm.patchValue({ s_related_account_no: data["s_related_account_no"]});
      this.supplierConfigurationForm.patchValue({ b_use_multi_acc_supplierType: data["b_use_multi_acc_supplierType"]});/////21
      this.supplierConfigurationForm.patchValue({ b_use_one_acc_supplierType : data["b_use_one_acc_supplierType"]});///////////22
      this.supplierConfigurationForm.patchValue({ b_use_multi_acc_supplier: data["b_use_multi_acc_supplier"]});///////23
      this.supplierConfigurationForm.patchValue({ s_Suppliers_s_Main_Account: data["s_Suppliers_s_Main_Account"]})//////24
      this.supplierConfigurationForm.patchValue({ b_Gl_AutoCoding: data["b_Gl_AutoCoding"]});///25
      this.supplierConfigurationForm.patchValue({ b_activate_search_by_first_number: data["b_activate_search_by_first_number"]});;
      this.supplierConfigurationForm.patchValue({ b_expense_account_by_item: data["b_expense_account_by_item"]})
      this.supplierConfigurationForm.patchValue({ b_print_purch_journal_after_save: data["b_print_purch_journal_after_save"]});
      this.supplierConfigurationForm.patchValue({ b_show_costcenter_in_store_purchaseInvoice: data["b_show_costcenter_in_store_purchaseInvoice"]});
      this.supplierConfigurationForm.patchValue({ n_consume_monthly_period: data["n_consume_monthly_period"]});
      this.supplierConfigurationForm.patchValue({ b_PreventSave_IfPurchasePrice_AboveOrEqual_lowestSellingPrice: data["b_PreventSave_IfPurchasePrice_AboveOrEqual_lowestSellingPrice"]});
      this.supplierConfigurationForm.patchValue({ b_show_sell_min_price_purchaseInvoice : data["b_show_sell_min_price_purchaseInvoice"]});
      this.supplierConfigurationForm.patchValue({ b_update_purchaseprice_after_discount: data["b_update_purchaseprice_after_discount"]});;
      this.supplierConfigurationForm.patchValue({ b_activate_cost_centers_budget_with_items_on_purchase_invoice: data["b_activate_cost_centers_budget_with_items_on_purchase_invoice"]})
      this.supplierConfigurationForm.patchValue({ b_redistribute_manual_purchase_expenses: data["b_redistribute_manual_purchase_expenses"]});
      this.supplierConfigurationForm.patchValue({ b_relative_tax_discount: data["b_relative_tax_discount"]});

      if(data.ap_Quotation_Comparison_config != null)
      {
        data.ap_Quotation_Comparison_config.forEach((data) => {
          this.ap_Quotation_Comparison_config.push(this.insertNewDetailsRow(this.ap_Quotation_Comparison_config.length + 1));
        });
        (this.supplierConfigurationForm.get("ap_Quotation_Comparison_config") as FormArray)?.patchValue(data.ap_Quotation_Comparison_config);  
      }

      this.showspinner=false;
    });
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
 }

 accDirNameSearch(value: any) {
  this.accDirNameSearching=true;
  this._SERVICE.GetSupplierAccountByDirectory(value).subscribe(res=> {
    this.accDirList=res;
    this.accDirNameFilteredServerSide.next(this.accDirList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
    this.accDirNameSearching=false;
  })
}
 
accMainNameSearch(value: any) {
  this.accMainNameSearching=true;
  this._SERVICE.GetSupplierMainAccounts(value).subscribe(res=> {
    this.accMainList=res;
    this.accMainNameFilteredServerSide.next(this.accMainList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
    this.accMainNameSearching=false;
  })
}

 get ap_Quotation_Comparison_config(): FormArray
 {
   return this.supplierConfigurationForm.get('ap_Quotation_Comparison_config') as FormArray;
 }

 addNewDetailsRow() {
  this.ap_Quotation_Comparison_config.push(this.insertNewDetailsRow(this.ap_Quotation_Comparison_config.length + 1));
}

removeDetailsRow(row: number)
  {
    this.ap_Quotation_Comparison_config.removeAt(row);
  }

  insertNewDetailsRow(line: number = 0): FormGroup
  {
    return this.fb.group({
      n_LineNo: line,
      s_field_title: '',
      n_order: '',
      n_percent: ['', Validators.pattern('[0-9]*')]
    });
  }

  // END HOOKS METHODS


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

  loadAccountsSupplier() {
    const dialogRef = this.dialog.open(AccountSupplierComponent, {
      width: '700px',
      height:'600px',
      data:{}
    });
  dialogRef.afterClosed().subscribe(res => {
            this.supplierConfigurationForm?.get('s_related_account_no')?.patchValue(res.data.s_account_no);
            this.accountsSupplier=res.data.s_account_name
     });
        //this.calctotal();
  }

  loadAccountPrimary(){

    debugger;


    const dialogRef = this.dialog.open(AccountsPrimaryComponent, {
      width: '700px',
      height:'600px',
      data:{}
    });
  dialogRef.afterClosed().subscribe(res => {

            this.supplierConfigurationForm?.get('s_Suppliers_s_Main_Account')?.patchValue(res.data.s_account_no);
            this.accountsPrimary=res.data.s_account_name


     });


        //this.calctotal();


  }






   save()
   {

  var formData: any = new FormData();
  formData.append("b_using_disscount_ratio",this.supplierConfigurationForm.value.b_using_disscount_ratio ?? false );
  formData.append("n_credit_limit_reaction",this.supplierConfigurationForm.value.n_credit_limit_reaction ?? 0 );
  formData.append("b_Disable_Direct_Pur_INV",this.supplierConfigurationForm.value.b_Disable_Direct_Pur_INV ?? false );
  formData.append("n_Print_option",this.supplierConfigurationForm.value.n_Print_option ?? 0 );
  formData.append("n_default_Invoice_type",this.supplierConfigurationForm.value.n_default_Invoice_type ?? 0 );
  formData.append("b_LastPurchasePricePerSupp",this.supplierConfigurationForm.value.b_LastPurchasePricePerSupp ?? false );
  formData.append("b_PreventSave_IfPurchasePrice_AboveOrEqual_lowestSellingPrice",this.supplierConfigurationForm.value.b_PreventSave_IfPurchasePrice_AboveOrEqual_lowestSellingPrice ?? false);
  formData.append("b_show_sell_min_price_purchaseInvoice",this.supplierConfigurationForm.value.b_show_sell_min_price_purchaseInvoice ?? false);
  formData.append("b_update_purchaseprice_after_discount",this.supplierConfigurationForm.value.b_update_purchaseprice_after_discount ?? false);//
  formData.append("b_activate_cost_centers_budget_with_items_on_purchase_invoice",this.supplierConfigurationForm.value.b_activate_cost_centers_budget_with_items_on_purchase_invoice ?? false);///
  formData.append("b_redistribute_manual_purchase_expenses",this.supplierConfigurationForm.value.b_redistribute_manual_purchase_expenses ?? false);///
  formData.append("b_relative_tax_discount",this.supplierConfigurationForm.value.b_relative_tax_discount ?? false);/////
  formData.append("b_activate_search_by_first_number",this.supplierConfigurationForm.value.b_activate_search_by_first_number ?? false);//////
  formData.append("b_expense_account_by_item",this.supplierConfigurationForm.value.b_expense_account_by_item ?? false);
  formData.append("b_print_purch_journal_after_save",this.supplierConfigurationForm.value.b_print_purch_journal_after_save??false);
  formData.append("b_show_costcenter_in_store_purchaseInvoice",this.supplierConfigurationForm.value.b_show_costcenter_in_store_purchaseInvoice ?? false);//
  formData.append("b_AddSuppAsTypes",this.supplierConfigurationForm.value.b_AddSuppAsTypes ?? false);
  formData.append("d_UserAddDate",this.supplierConfigurationForm.value.d_UserAddDate ?? "");
  formData.append("b_group_invoice_by_supplier",this.supplierConfigurationForm.value.b_group_invoice_by_supplier ?? false);//
  formData.append("b_Bonus",this.supplierConfigurationForm.value.b_Bonus ?? false);///
  formData.append("b_partial_receiving",this.supplierConfigurationForm.value.b_partial_receiving ?? false);///
  formData.append("b_StockOutTransEachPurchase",this.supplierConfigurationForm.value.b_StockOutTransEachPurchase ?? false);/////
  formData.append("b_ex_print_re",this.supplierConfigurationForm.value.b_ex_print_re ?? false);//////
  formData.append("s_curr_user_id",this.supplierConfigurationForm.value.s_curr_user_id ?? "");
  formData.append("n_curr_closed_id",this.supplierConfigurationForm.value.n_curr_closed_id ?? 0);///////////////
  formData.append("n_curr_closed_id",this.supplierConfigurationForm.value.n_curr_closed_id ?? 0);///////////////////////
  formData.append("n_curr_replicated_id",this.supplierConfigurationForm.value.n_curr_replicated_id ?? 0);
  formData.append("d_curr_sys_date",this.supplierConfigurationForm.value.d_curr_sys_date ?? "");////////
  formData.append("b_Group_journal_Return",this.supplierConfigurationForm.value.b_Group_journal_Return ?? false);////////
  formData.append("b_Group_journal_Purchase",this.supplierConfigurationForm.value.b_Group_journal_Purchase ?? false);//////////////////
  formData.append("b_show_journal_in_trans",this.supplierConfigurationForm.value.b_show_journal_in_trans ?? false);///////////////
  formData.append("b_use_multi_acc_supplierType",this.supplierConfigurationForm.value.b_use_multi_acc_supplierType ?? false);
  formData.append("b_use_multi_acc_supplier",this.supplierConfigurationForm.value.b_use_multi_acc_supplier ?? false);
  formData.append("b_use_one_acc_supplierType",this.supplierConfigurationForm.value.b_use_one_acc_supplierType ?? false);////////////////////
  formData.append("s_Suppliers_s_Main_Account",this.supplierConfigurationForm.value.s_Suppliers_s_Main_Account ?? "");////////////
  formData.append("b_Gl_AutoCoding",this.supplierConfigurationForm.value.b_Gl_AutoCoding ?? false);///////////////////////
  formData.append("s_related_account_no",this.supplierConfigurationForm.value.s_related_account_no ?? "");////////
  formData.append("b_use_one_acc_supplier",this.supplierConfigurationForm.value.b_use_one_acc_supplier ?? false);/////////////
  formData.append("b_use_cost_centers",this.supplierConfigurationForm.value.b_use_cost_centers ?? false);
  formData.append("b_link_Account",this.supplierConfigurationForm.value.b_link_Account ?? false);/////
  formData.append("b_Control_CashBox_Balance",this.supplierConfigurationForm.value.b_Control_CashBox_Balance ?? false);/////////////
  formData.append("d_UserUpdateDate",this.supplierConfigurationForm.value.d_UserUpdateDate ?? "");////////////////
  formData.append("n_consume_monthly_period",this.supplierConfigurationForm.value.n_consume_monthly_period ?? 0);///////
  formData.append("b_Disable_Over_PO_Qty",this.supplierConfigurationForm.value.b_Disable_Over_PO_Qty ?? false)
  formData.append("b_disable_edit_in_purchase",this.supplierConfigurationForm.value.b_disable_edit_in_purchase ?? false);
  formData.append("b_purchasePrice_greater_ImportOrder",this.supplierConfigurationForm.value.b_purchasePrice_greater_ImportOrder ?? false);////////////////////
  formData.append("b_item_sales_tax_per_item",this.supplierConfigurationForm.value.b_item_sales_tax_per_item ?? false);
  formData.append("b_direct_delivery_order",this.supplierConfigurationForm.value.b_direct_delivery_order ?? false);/////
  formData.append("b_prevent_change_purchaseInv_Date",this.supplierConfigurationForm.value.b_prevent_change_purchaseInv_Date ?? false);
  formData.append("b_use_auto_CurrCoff_by_PaymentPurchNo",this.supplierConfigurationForm.value.b_use_auto_CurrCoff_by_PaymentPurchNo ?? false);
  formData.append("b_Pur_Inv_Trans_Source_Dlv_Order",this.supplierConfigurationForm.value.b_Pur_Inv_Trans_Source_Dlv_Order ?? false);
  formData.append("b_Disable_Direct_Pur_INV",this.supplierConfigurationForm.value.b_Disable_Direct_Pur_INV ?? false );
  formData.append("b_use_follow_credit_limit",this.supplierConfigurationForm.value.b_use_follow_credit_limit ?? false );

  if(this.ap_Quotation_Comparison_config.length > 0)
    {
      for(var i = 0; i < this.supplierConfigurationForm.value.ap_Quotation_Comparison_config.length; i++) {
        formData.append('ap_Quotation_Comparison_config[' + i + '].nLineNo', this.supplierConfigurationForm?.value.ap_Quotation_Comparison_config[i].nLineNo ?? 0);
        formData.append('ap_Quotation_Comparison_config[' + i + '].s_field_title', this.supplierConfigurationForm?.value.ap_Quotation_Comparison_config[i].s_field_title ?? '');
        formData.append('ap_Quotation_Comparison_config[' + i + '].n_order', this.supplierConfigurationForm?.value.ap_Quotation_Comparison_config[i].n_order ?? 0);
        formData.append('ap_Quotation_Comparison_config[' + i + '].n_percent', this.supplierConfigurationForm?.value.ap_Quotation_Comparison_config[i].n_percent ?? 0);
      }
    }

  this.showspinner=true;
  this.disableButtons();

    this._SERVICE.Save(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish) 
        this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
       if(data.status==1){

        this._router.navigate(['/ap/supplierConfiguartion']);



       }



   });




   }
   
   allowNumbersOnly(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);
    const isNumeric = /^[\d.]*$/.test(inputChar);
  
    if (!isNumeric) {
      event.preventDefault();
    }
  }
}
