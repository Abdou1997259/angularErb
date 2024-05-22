import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { PurchaseInvoiceService } from 'src/app/Core/Api/AP/purchase-invoice.service';
import { ItemsLookUpComponent } from 'src/app/Controls/items-look-up/items-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { ExpensesLkpComponent } from 'src/app/Controls/expenses-lkp/expenses-lkp.component';
import { AccountsLookupComponent } from 'src/app/Controls/accounts-lookup/accounts-lookup.component';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';

declare var $: any;
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent extends BaseComponent implements OnInit{


  dtOptions: DataTables.Settings = {};
  InvoiceForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  DocNo : any;
  DataAreaNo : any;
  bExtra=false;
  bAdvance=false;
  bisMainCurrency=false;
  mainCurrency:number=0;
  taxPercentage:any=[];
  //unitCoff:any=[];
  taxStatus:boolean=false;
  totalValue:number=0;
  expensesValue:number=0;
  totalDiscount:number=0;
  isDiscounted:boolean=false;
  isMultiCost:boolean=false;
  isSelectedTrans:boolean=false;
  items:any=[];
  itemsTax:any=[];
  transNo:any='';
  editMode:boolean=false;
  showspinner:boolean=false;

  constructor(private fb:FormBuilder
    ,private _PurchaseInvoiceService : PurchaseInvoiceService
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private userservice:UserService
    ,private _LookupControlService:LookupControlService) {
      super(_route.data,userservice);

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers',
        pageLength: 2,
        processing: true

      };

      this.InvoiceForm = this.fb.group({
        n_purchase_invoice_no: '',
        d_purchase_invoice_date:new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        s_book_doc_no:'',
        n_project_id:'',
        n_ivoice_type_id:new FormControl('', Validators.required),
        n_supplier_id:new FormControl('', Validators.required),
        n_purchaseMan_id:'',
        n_store_id: new FormControl('', Validators.required),
        n_currency_id: new FormControl('', Validators.required),
        n_currency_coff:'1',
        s_description_arabic: '',
        s_description_eng:'',
        d_supplier_invoice_date: '',
        d_due_date: '',
        n_serial_inv_type:'',
        n_trans_source_no:'',
        s_account_with_supp:'',
        n_invoice_no_supp:'',
        s_cost_center_id:'',
        s_cost_center_id2:'',
        n_acc_dir_id:new FormControl('', Validators.required),
        n_total_modified_price:'',
        n_total_qty:'',
        n_no_of_items:'',       
        n_extra_expenses_Loaded:'',
        n_net_valueWithBonus:'',
        n_total_value:'',
        n_extra_expenses_UnLoaded:'',
        n_net_value:'',
        n_total_discount:'',
        n_sales_tax:'',
        n_expenses_tax:'',
        n_extra_expenses:'',
        n_total_item_discount_ratio:'',
        n_local_total_expenses:'',
        b_use_multi_cost_center:false,
        b_quantity_match:false,
        b_advanced_payment:false,
        b_has_extra_expnses:false,
        b_dist_expense_by_modify_price:false,
        b_dist_expense_by_quantity:false,
        b_has_extra_discount:false,
        b_invoice_import:false,
        n_discount_ratio:'',
        n_extra_discount:'',
        n_advanced_payment_value:'',
        n_guarantees_reserved_primary_percent:'',
        n_guarantees_reserved_primary_value:'',
        n_guarantees_reserved_final_percent:'',
        n_guarantees_reserved_final_value:'',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',
        invoiceDetails: this.fb.array([] , Validators.required),
        expenseDetails: this.fb.array([]),
        s_expense_code:'',
        opp_acc:'',
        n_discount_tax:'',
        n_discount_tax_ratio:'',
        n_additional_tax:'',
        n_additional_tax_ratio:''
      });
     }

    InvoiceData:any=[];
    StoreData:any=[];
    SupplierData:any=[];
    EmployeeData:any=[];
    CurrencyData:any=[];
    ProjectData:any=[];
    CostData:any=[];
    Cost2Data:any=[];
    AccDirData:any=[];
    TranSourceData:any=[];
    UnitsData:any=[];
    filteredSupplierServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredManServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredStoreServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    searchingSupplier:boolean=false;
    searchingMan:boolean=false;
    searchingCost:boolean=false;
    searchingCost2:boolean=false;
    searchingStore:boolean=false;
    isEnglish:boolean=false;
    get invoiceDetails() : FormArray {
      return this.InvoiceForm.get("invoiceDetails") as FormArray
    }

    get expenseDetails(): FormArray {
      return this.InvoiceForm.get("expenseDetails") as FormArray
    }
    

    searchSupplier(value :any){
      this.searchingSupplier=true;
      this._PurchaseInvoiceService.GetSuppliers(value).subscribe(res=>{
        this.SupplierData=res;
        this.filteredSupplierServerSide.next(  this.SupplierData.filter(x => x.s_supplier_name.toLowerCase().indexOf(value) > -1));
        this.searchingSupplier=false;
      });
    }

    searchMan(value :any){
      this.searchingMan=true;
      this._PurchaseInvoiceService.GetEmployees(value).subscribe(res=>{
        this.EmployeeData=res;
        this.filteredManServerSide.next(  this.EmployeeData.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
        this.searchingMan=false;
      });
    }

    searchCost(value :any){
      this.searchingCost=true;
      this._PurchaseInvoiceService.GetCostCenters(value).subscribe(res=>{
        this.CostData=res;
        this.filteredCostCenterServerSide.next(  this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
        this.searchingCost=false;
      });
    }

    searchCost2(value :any){
      this.searchingCost2=true;
      this._PurchaseInvoiceService.GetCostCenters(value).subscribe(res=>{
        this.Cost2Data=res;
        this.filteredCostCenter2ServerSide.next(  this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
        this.searchingCost2=false;
      });
    }

    searchStore(value :any){
      this.searchingStore=true;
      this._PurchaseInvoiceService.GetStores(value).subscribe(res=>{
        this.StoreData=res;
        this.filteredStoreServerSide.next(this.StoreData.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
        this.searchingStore=false;
      });
    }

    getTypes(){
      this._PurchaseInvoiceService.GetInvoiceTypes().subscribe(res=>{
        this.InvoiceData=res;
      });
    }

    getCurrencies(){
      this._PurchaseInvoiceService.GetCurrencies().subscribe(res=>{
        this.CurrencyData=res;
      });
    }

    getProjects(){
      this._PurchaseInvoiceService.GetProjects().subscribe(res=>{
        this.ProjectData=res;
      });
    }

    getAccDir(){
      this._PurchaseInvoiceService.GetAccDir().subscribe(res=>{
        this.AccDirData=res;
      });
    }

    getUnit(i :number){
      var item=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
      this._PurchaseInvoiceService.GetUnits(item).subscribe(data=>{
        this.UnitsData =  data;
      });
    }

    getSelectedUnit(item :any){
      this._PurchaseInvoiceService.GetUnits(item).subscribe(data=>{
        this.UnitsData =  data;
      });
    }

    getTransSource(){
      this._PurchaseInvoiceService.GetTransSource().subscribe(data=>{
        this.TranSourceData =  data;
      });
    }

    SetAdvanceTab(){
      if(this.InvoiceForm.get('b_advanced_payment')?.value == true)
        this.bAdvance=true;
      else
        this.bAdvance=false;
    }

    SetExtraTab(){
      if(this.InvoiceForm.get('b_has_extra_expnses')?.value == true)
      {
        this.bExtra=true;
        if(this.expenseDetails.controls.length==0)
        {
          this.addExpenseDetails();
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(0) as FormGroup).get('nCoff')?.disable();
        }
      }
      else
      {
        this.bExtra=false;  
        $("#pills-main-tab").click();
        this.expenseDetails.clear();   
        this.setExpense();
      }
    }

    setMainCurrency(){
      this._PurchaseInvoiceService.GetMainCurrency().subscribe(res=>{
        this.InvoiceForm.get('n_currency_id')?.patchValue(res);
        this.mainCurrency=res;
      });
    }

    setMainValues(){
      this._PurchaseInvoiceService.GetMainCurrency().subscribe(res=>{
        this.mainCurrency=res;
        for (let i = 0; i < this.expenseDetails.length; i++) {
          if( this.InvoiceForm.value.expenseDetails[i].n_currency_id==this.mainCurrency)
          {
            ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.disable();
          }
          this.expensesValue+=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_value')?.value;
        }
      });
    }

    _currentItemIndex:number=0;
    LoadItems(i:number){
  
      var supplierNo=this.InvoiceForm.get('n_supplier_id')?.value;
      if(supplierNo=="")
      {
        if(this.isEnglish)
          this._notification.ShowMessage('Please choose supplier at first  ',3)
        else

        this._notification.ShowMessage('اختر مورد اولا من فضلك',3);
        this.resetValues(i);
        return;
      }

       const dialogRef = this.dialog.open(ItemsLookUpComponent, {
         width: '700px',
         height:'600px',
         data: {    }
       });

       dialogRef.afterClosed().subscribe(res => {
          if(res.data.s_item_id != '' && res.data.s_item_id != null)
            this.resetUnit(i);
         ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
         ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
         this.getSelectedUnit(res.data.s_item_id);
          var itemNo=res.data.s_item_id;
          this._PurchaseInvoiceService.GetTaxStatus(supplierNo,itemNo).subscribe(res=>{
              debugger;
              var index = this.items.indexOf(i);
              if (index !== -1) 
              {
                this.items[index]=i;
                if(res.n_taxes_type== 1 && res.n_supplier_tax==1)
                {
                  this.taxPercentage[index]=res.n_VAT;
                  this.itemsTax[index]=true;
                }
                else
                {
                  this.taxPercentage[index]=0;
                  this.itemsTax[index]=false;
                }
                this.calcRows(i,0);  
              }
              else
              {
                this.items.push(i);
                if(res.n_taxes_type== 1 && res.n_supplier_tax==1)
                {
                  this.taxPercentage.push(res.n_VAT);
                  this.itemsTax.push(true);
                }
                else
                {
                  this.taxPercentage.push(0);
                  this.itemsTax.push(false);
                }     
              }
           });        
        });
    }

    LoadUnits(i:number){
      let itemID=  ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
      const dialogRef = this.dialog.open(UnitsLookUpComponent, {
        width: '700px',
        height:'600px',
        data: {'itemId': itemID}
      });
 
      dialogRef.afterClosed().subscribe(res => {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
        this.getSelectedUnit(res.data.s_item_id);
        // this._PurchaseInvoiceService.GetUnitCoff(itemID,res.data.n_unit_id).subscribe(data=>{
        //   debugger;
        //   if(this.unitCoff[i]== undefined)
        //     this.unitCoff.push(data);
        //   else
        //     this.unitCoff[i]=data;
        //   this.calcRows(i);
        // }); 
       });
    }

    LoadExpenses(i:number){
  
      this._currentItemIndex=i;
      const dialogRef = this.dialog.open(ExpensesLkpComponent, {
        width: '700px',
        height:'600px',
        data: {    }
      });
 
      dialogRef.afterClosed().subscribe(res => {
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_code')?.patchValue(res.data.s_expense_code);
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_name')?.patchValue(res.data.s_expense_name);
        this.getSelectedUnit(res.data.s_item_id);
       });
    }

    LoadAccounts(i:number){
  
      const dialogRef = this.dialog.open(AccountsLookupComponent, {
        width: '700px',
        height:'600px',
        data: {    }
      });
 
      dialogRef.afterClosed().subscribe(res => {
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('opp_acc')?.patchValue(res.data.s_account_no);
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('opp_acc_name')?.patchValue(res.data.s_account_name);
        this.getSelectedUnit(res.data.s_item_id);
       });
    }

    LoadCostCenter1(i:number){
  
      const dialogRef = this.dialog.open(CostCentersLkpComponent, {
        width: '700px',
        height:'600px',
        data: {    }
      });
 
      dialogRef.afterClosed().subscribe(res => {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
       });
    }

    LoadCostCenter2(i:number){
  
      const dialogRef = this.dialog.open(CostCentersLkpComponent, {
        width: '700px',
        height:'600px',
        data: {    }
      });
 
      dialogRef.afterClosed().subscribe(res => {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
       });
    }



    ChangeItem(i:number)
    {
      var supplierNo=this.InvoiceForm.get('n_supplier_id')?.value;
      if(supplierNo=="")
      {
        this._notification.ShowMessage('اختر مورد اولا من فضلك',3);
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
        this.resetValues(i);
        return;
      }
      var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;

      this._PurchaseInvoiceService.GetItemName(itemNo).subscribe(res=>{
        if(res==null)
        {
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
        }
        else
        {
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.name);  
          this._PurchaseInvoiceService.GetTaxStatus(supplierNo,itemNo).subscribe(res=>{
            debugger;
            var index = this.items.indexOf(i);
            if (index !== -1) 
            {
              this.items[index]=i;
              if(res.n_taxes_type== 1 && res.n_supplier_tax==1)
              {
                this.taxPercentage[index]=res.n_VAT;
                this.itemsTax[index]=true;
              }
              else
              {
                this.taxPercentage[index]=0;
                this.itemsTax[index]=false;
              }
              this.calcRows(i,0);  
            }
            else
            {
              this.items.push(i);
              if(res.n_taxes_type== 1 && res.n_supplier_tax==1)
              {
                this.taxPercentage.push(res.n_VAT);
                this.itemsTax.push(true);
              }
              else
              {
                this.taxPercentage.push(0);
                this.itemsTax.push(false);
              }     
            }
          });
        }
        this.resetUnit(i);
      });
      this.getUnit(i);
    }


    ChangeUnit(i:number)
    {
      var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
      var unitNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;

      this._PurchaseInvoiceService.GetUnitName(itemNo,unitNo).subscribe(res=>{
        if(res==null)
        {
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
        }
        else
        {
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(res.name); 
        }
      });

    }

    ChangeExpense(i:number)
    {
      var itemNo=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_code')?.value;

      this._PurchaseInvoiceService.GetExpenseName(itemNo).subscribe(res=>{
        if(res==null)
        {
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_code')?.patchValue('');
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_name')?.patchValue('');
        }
        else
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_name')?.patchValue(res.name); 
      });

    }

    ChangeAcc(i:number)
    {
      var itemNo=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('opp_acc')?.value;

      this._PurchaseInvoiceService.GetAccountName(itemNo).subscribe(res=>{
        if(res==null)
        {
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('opp_acc')?.patchValue('');
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('opp_acc_name')?.patchValue('');
        }
        else
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('opp_acc_name')?.patchValue(res.name); 
      });
    }

    ChangeDetailsCost1(i:number)
    {
      var costNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;

      this._PurchaseInvoiceService.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
        }
        else
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.name); 
      });
    }

    ChangeDetailsCost2(i:number)
    {
      var costNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;

      this._PurchaseInvoiceService.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
        }
        else
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.name); 
      });
    }

    resetUnit(i:number){
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
    }

    CheckIsMain(){
      if(this.InvoiceForm.get('n_currency_id')?.value == this.mainCurrency)
      {
        this.bisMainCurrency=false;
      }
      else
      {
        this.bisMainCurrency=true;
      }  
      this.InvoiceForm.value.n_currency_coff=1;
      this.InvoiceForm.get('n_currency_coff')?.patchValue(1);
    }

    RemoveInvoiceDetail(i:number) {
      if(this.invoiceDetails.length==1)
      {
        if(this.isEnglish)
        this._notification.ShowMessage('Invoice must contain a single item ',2);
        else
        this._notification.ShowMessage('يجب ان تحتوى الفاتورة على صنف واحد على الاقل',2);
        return;
      }
      else
      {
        var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
        this.invoiceDetails.removeAt(i);    
        var index = this.items.indexOf(itemNo);
        this.items.splice(index, 1);
        this.itemsTax.splice(i, 1);
        //this.unitCoff.splice(i, 1);
        this.setItemTotal();
        this.calcDiscountP();
      }
      this.calcRows(i,1);
    }

    RemoveExpenseDetail(i:number) {
      this.expenseDetails.removeAt(i);   
      this.setExpense(); 
    }

    changeSupplier(id:any){
      var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(0) as FormGroup).get('s_item_id')?.value;
      if(this.invoiceDetails.controls.length>0 && itemNo!="")
      {
        for (let i = 0; i < this.invoiceDetails.controls.length; i++) {
          this.calcRows(i,0);
        }
      }
      this._PurchaseInvoiceService.GetPurchaseMan(id).subscribe(res=>{
        this.InvoiceForm.get("n_purchaseMan_id")?.patchValue(res.n_employee_id); 
      });
    }

    resetValues(i:number){
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('total_Qty')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_modification_unit_price')?.patchValue('');
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_received_qty')?.patchValue('');
    }

    checkTax(i:number, TaxStatus:number){
      //Check item tax status
      var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
      var unitID=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;
      var supplierNo=this.InvoiceForm.get('n_supplier_id')?.value;
      if(itemNo=="")
      {
        if(this.isEnglish)
          this._notification.ShowMessage('Please choose an item ',3)
        else
        this._notification.ShowMessage('اختر صنف اولا من فضلك',3);
        this.resetValues(i);
        return;
      }
      if(supplierNo=="")
      {
        if(this.isEnglish)
         this._notification.ShowMessage('Please choose a supplier ',3)
        else
        this._notification.ShowMessage('اختر مورد اولا من فضلك',3);
        this.resetValues(i);
        return;
      }

      if(this.items.length==0 || !this.items.includes(itemNo)){
        this.items.push(itemNo);
        this._PurchaseInvoiceService.GetTaxStatus(supplierNo,itemNo).subscribe(res=>{
          if(res.n_taxes_type== 1 && res.n_supplier_tax==1)
          {
            this.taxPercentage.push(res.n_VAT);
            this.itemsTax.push(true);
          }
          else
          {
            this.taxPercentage.push(0);
            this.itemsTax.push(false);
          }   
          this.calcRows(i,TaxStatus);
          debugger;
        });
      }
      else{
        this.calcRows(i,TaxStatus);
      }
    }

    setEditValues(){
      this.editMode=true;
      var supplierNo=this.InvoiceForm.get('n_supplier_id')?.value;
      for (let i = 0; i < this.invoiceDetails.length; i++) {
        var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
        this._PurchaseInvoiceService.GetTaxStatus(supplierNo,itemNo).subscribe(res=>{
          debugger;
          this.items.push(i);
          if(res.n_taxes_type== 1 && res.n_supplier_id==1)
          {
            this.taxPercentage.push(res.n_VAT);
            this.itemsTax.push(true);
          }
          else
          {
            this.taxPercentage.push(0);
            this.itemsTax.push(false);
          }       
        });
      }
    }

    calcRows(i:number, TaxStatus:number){
      debugger;
      //Calculate row
      var qty=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.value ?? 0;
      var price=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value ?? 0;
      var discountV=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value ?? 0;
      var taxV=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.value ?? 0;

      var total=0, discP=0,discV=0, netNoTax=0, tax=0, net=0,expenseValue=0,expensePercentage=0, invoiceDiscountValue=0,invoiceDiscountPercentage=0
      , discountTax=0, taxDiscountV=0,taxDiscountP=0, taxAdditionV=0,taxAdditionP=0;

      //الكمية المستلمة واجمالى الكمية
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_received_qty')?.patchValue(qty);
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('total_Qty')?.patchValue(qty);


      //الاجمالى
      total=Number(qty)*Number(price);
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(total);
    

      this.setItemTotal();

      //ق المصروفات
      if(this.expensesValue>0)
      { 
        expensePercentage=Number(total/this.totalValue);
        expenseValue=Number(expensePercentage*this.expensesValue);
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue(this.round(expenseValue,5));
      }
      else
      {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.patchValue(0);
      }


      //ق خصم فاتورة
      this.totalDiscount=this.InvoiceForm.get('n_extra_discount')?.value;
      if(this.totalDiscount>0)
      {  
        invoiceDiscountPercentage=Number(total/this.totalValue);
        invoiceDiscountValue=Number(invoiceDiscountPercentage*this.totalDiscount);
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(this.round(invoiceDiscountValue,5));
        discountTax=invoiceDiscountValue*(this.taxPercentage[i]/100);
      }
      else
      {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.patchValue(0);
      }

      //الصافى بدون ضريبة
      if(total>0)
      {
        netNoTax=Number(Number(total)-Number(discountV)-Number(invoiceDiscountValue))+Number(expenseValue);
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.patchValue(this.round(netNoTax,5));
      }

      //القيمة المضافة
      if(TaxStatus==1)
      {
        tax=taxV;
      }
      else
      {
        if(this.expensesValue>0 && this.itemsTax[i]==true)
          tax= ((this.taxPercentage[i]/100)*(netNoTax-expenseValue));
        else if(this.itemsTax[i]==true && total>0) 
          tax= ((this.taxPercentage[i]/100)*(netNoTax));
        else
          tax=0;
      }
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue(this.round(tax,5));


      //ضريبة خصم
      var taxDiscount=this.InvoiceForm.get("n_discount_tax_ratio")?.value;
      var value=Number(Number(taxDiscount/100)*this.totalValue);
      taxDiscountP=Number(total/this.totalValue);
      taxDiscountV=Number(taxDiscountP*value);
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_discount_tax')?.patchValue(this.round(taxDiscountV,5));
    

      //ضريبة اضافية
      var taxAdditional=this.InvoiceForm.get("n_additional_tax_ratio")?.value;
      var value=Number(Number(taxAdditional/100)*this.totalValue);
      taxAdditionP=Number(total/this.totalValue);
      taxAdditionV=Number(taxAdditionP*value);
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_additional_tax')?.patchValue(this.round(taxAdditionV,5));


      //الصافى
      if(total>0)
      {
        net = Number((Number(tax) + Number(netNoTax) + Number(taxAdditionV))-Number(taxDiscountV));
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue(this.round(net,5));
      }

      //الكمية بالوحدة الاساسية
      // if(qty!="" && this.unitCoff[i]!= "")
      //   ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.patchValue(Number(this.unitCoff[i]*qty));

      
      this.setDetailsTotals();
    }

    calcTaxP(i:number){
      var discountP=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.value;
      var qty=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
      var price=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
      var total=qty*price;
      var discV=(discountP/100)*total;
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.patchValue(discV);
      this.calcRows(i,1);
    }

    calcTaxV(i:number){
      var discountV=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nItemDiscountV')?.value;
      var qty=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.value;
      var price=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value;
      var total=qty*price;
      var discP=(discountV/total)*100;
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nItemDiscountP')?.patchValue(discP);
      this.calcRows(i,1);
    }

    setExpense(){
      this.expensesValue=0;

      for (let i = 0; i < this.expenseDetails.controls.length; i++) {
        var value=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nExpensesValue')?.value;
        //var tax=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.value;
        var currency=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
        var coff=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.value;

        if(coff=="")
        {
          if(this.isEnglish)
            this. _notification.ShowMessage("Please insert factor for the expense at line : "+(i+1),3);
          else
            this. _notification.ShowMessage("ادخل المعامل من فضلك للمصروف فى السطر رقم: "+(i+1),3);
          continue;
        }
        
        if(((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('b_has_tax')?.value==true)
        {
          var tax=Number((value*coff)*(15/100));
          var expVal=((value*coff)-tax);
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_value')?.patchValue(expVal);
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue(tax);
          this.expensesValue+=Number(expVal);
          continue;
        }
        else
        {
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue('');
          ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_value')?.patchValue(value*coff);

          this.expensesValue+=Number(value*coff);
          continue;
        }
      }
      for(let i = 0; i < this.invoiceDetails.controls.length; i++){
        this.calcRows(i,1);
      }
    }

    setItemTotal(){
      this.totalValue=0
      for (let i = 0; i < this.invoiceDetails.controls.length; i++)
      {
        var total=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_value')?.value;
        this.totalValue+=total;
      }
    }

    setCoffDisable(i:number){
      var currency=((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
      if(this.mainCurrency==currency)
      {
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.patchValue(1);
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.disable();
      }
      else
      {
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
      }
    }

    setDisable(){
      var length=this.expenseDetails.controls.length-1;
      ((this.InvoiceForm.get("expenseDetails") as FormArray).at(length) as FormGroup).get('nCoff')?.disable();
    }

    setDiscount(){
      if(this.InvoiceForm.get('b_has_extra_discount')?.value== true)
      {
        this.isDiscounted=true;
      }
      else
      {
        this.isDiscounted=false;
        this.InvoiceForm.get('n_discount_ratio')?.patchValue(0);
        this.InvoiceForm.get('n_extra_discount')?.patchValue(0);
      }
      for (let i = 0; i < this.invoiceDetails.controls.length; i++)
      {
        this.calcRows(i,1);
      }
    }

    calcDiscountP(){
      var discountP=this.InvoiceForm.get('n_discount_ratio')?.value;
      var total=this.totalValue;
      var discountV=(discountP/100)*total;
      this.InvoiceForm.get('n_extra_discount')?.patchValue(discountV);
      if(discountV>total)
      {
        if(this.isEnglish)
          this._notification.ShowMessage(`Invoice deduction value is more than invoice net value `,2)
        else
        this. _notification.ShowMessage('قيمة خصم الفاتورة اكبر من قيمة صافى الفاتورة',2);
        return;
      }
      for (let i = 0; i < this.invoiceDetails.controls.length; i++)
      {
        this.calcRows(i,1);
      }
    }

    calcDiscountV(){
      debugger;
      var discountV=this.InvoiceForm.get('n_extra_discount')?.value;
      var total=this.totalValue;
      var discountP=(discountV/total)*100;
      this.InvoiceForm.get('n_discount_ratio')?.patchValue(discountP);
      if(discountV>total)
      {
        if(this.isEnglish)
            this._notification.ShowMessage(`Invoice deduction value is more than invoice net value `,2)
         else
           this. _notification.ShowMessage('قيمة خصم الفاتورة اكبر من قيمة صافى الفاتورة',2);
        return;
      }
      for (let i = 0; i < this.invoiceDetails.controls.length; i++)
      {
        this.calcRows(i,1);
      }
    }

    setDetailsTotals(){
      var totalQty=0,totalModified=0,totalNItem=0, totalExpLoad=0,totalExpUnLoad=0, totalBonus=0,
       totalValue=0, totalNet=0, totalDiscount=0, totalTax=0, totalExpensesTax=0, totalLocalExpense=0,
       totalTaxDiscount=0, totalAddotionTax=0;
      for (let i = 0; i < this.invoiceDetails.length; i++) {
        totalQty += Number(this.InvoiceForm.value.invoiceDetails[i].n_qty) ?? 0;
        totalModified += Number(this.InvoiceForm.value.invoiceDetails[i].n_modification_unit_price) ?? 0;    
        totalBonus += Number(this.InvoiceForm.value.invoiceDetails[i].n_Bonus) ?? 0 + Number(this.InvoiceForm.value.invoiceDetails[i].n_item_net_value) ?? 0;
        totalValue += Number(this.InvoiceForm.value.invoiceDetails[i].n_item_value) ?? 0;
        totalNet += Number(this.InvoiceForm.value.invoiceDetails[i].n_item_net_value) ?? 0;
        totalDiscount += Number(this.InvoiceForm.value.invoiceDetails[i].nItemDiscountV) ?? 0;
        totalTax += Number(this.InvoiceForm.value.invoiceDetails[i].n_item_sales_Tax) ?? 0;     
        totalTaxDiscount += Number(this.InvoiceForm.value.invoiceDetails[i].n_item_discount_tax) ?? 0;
        totalAddotionTax += Number(this.InvoiceForm.value.invoiceDetails[i].n_item_additional_tax) ?? 0;
      }
      this.InvoiceForm.get('n_total_item_discount_ratio')?.patchValue((totalDiscount/totalValue)*100);

      totalDiscount+=Number(this.InvoiceForm.get('n_extra_discount')?.value) ?? 0;

      for (let i = 0; i < this.expenseDetails.length; i++) {
        if(this.InvoiceForm.value.expenseDetails[i].n_loaded==true){
          totalExpLoad+= Number(this.InvoiceForm.value.expenseDetails[i].n_value) ?? 0;
        }
        else{
          totalExpUnLoad += Number(this.InvoiceForm.value.expenseDetails[i].n_value) ?? 0;
        }
        totalLocalExpense+= Number(this.InvoiceForm.value.expenseDetails[i].n_value) ?? 0;    
        totalExpensesTax += Number(this.InvoiceForm.value.expenseDetails[i].n_sales_tax) ?? 0;
      }

      totalNItem+= Number(this.invoiceDetails.length);

      this.InvoiceForm.get('n_total_qty')?.patchValue(totalQty);
      this.InvoiceForm.get('n_total_modified_price')?.patchValue(totalModified);
      this.InvoiceForm.get('n_no_of_items')?.patchValue(totalNItem);
      this.InvoiceForm.get('n_extra_expenses_Loaded')?.patchValue(totalExpLoad);
      this.InvoiceForm.get('n_net_valueWithBonus')?.patchValue(totalBonus);
      this.InvoiceForm.get('n_total_value')?.patchValue(totalValue);
      this.InvoiceForm.get('n_extra_expenses_UnLoaded')?.patchValue(totalExpUnLoad);
      this.InvoiceForm.get('n_net_value')?.patchValue(totalNet);
      this.InvoiceForm.get('n_total_discount')?.patchValue(totalDiscount);
      this.InvoiceForm.get('n_sales_tax')?.patchValue(totalTax);
      this.InvoiceForm.get('n_expenses_tax')?.patchValue(totalExpensesTax);
      this.InvoiceForm.get('n_extra_expenses')?.patchValue(Number(totalExpLoad+totalExpUnLoad));
      this.InvoiceForm.get('n_local_total_expenses')?.patchValue(totalLocalExpense);
      this.InvoiceForm.get('n_discount_tax')?.patchValue(totalTaxDiscount);
      this.InvoiceForm.get('n_additional_tax')?.patchValue(totalAddotionTax);
    }

    showDetailsCost(){
      debugger;
      if (this.InvoiceForm.get('b_use_multi_cost_center')?.value==true)
      {
        this.isMultiCost=true;
        this.InvoiceForm.get('s_cost_center_id')?.patchValue('');
        this.InvoiceForm.get('s_cost_center_id2')?.patchValue('');
      }
      else
      {
        this.isMultiCost=false;
        for (let i = 0; i <  this.InvoiceForm.value.invoiceDetails.length; i++) {
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
          ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
        }
      }
    }

    changeTransStatus(){
      if(this.InvoiceForm.get('n_trans_source_no')?.value !='')
      {
        this.isSelectedTrans=true;
      }
      else
      {
        this.isSelectedTrans=false;
      }
    }

    showSourcesTypes() {
      var id = this.InvoiceForm.get('n_trans_source_no')?.value;
       const dialogRef = this.dialog.open(TransSourceTypesComponent, {
         width: '700px',
         height:'600px',
         data: { id }
       });
       dialogRef.afterClosed().subscribe(res => {
        this.invoiceDetails.clear();
        this.expenseDetails.clear();
        this._PurchaseInvoiceService.GetGenericViewData(res.data[0], res.data[1]).subscribe((data) => {
          debugger;
          this.transNo=data[0].n_doc_no;
          if(this.InvoiceForm.get('n_trans_source_no')?.value==6)
            $('#btnAddDetail').prop('disabled', true);
          else
            $('#btnAddDetail').prop('disabled', false);
          data.forEach(element => {
            this.addInvoiceDetails();
          });
          this.InvoiceForm.patchValue(data[0]);
          (this.InvoiceForm.get('invoiceDetails') as FormArray)?.patchValue(data);
          for(var i = 0; i < this.InvoiceForm.value.invoiceDetails.length; i++) {
            this.items.push(data[i].s_item_id);
            this.taxPercentage.push(0);
            this.itemsTax.push(false);
            this.calcRows(i,1);
          }
        });
       });
    }

    override ngOnInit(): void {
      this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
      this.DataAreaNo = Number(this.userservice.GetDataAreaID());
      //this.searchSupplier('');
      this.searchMan('');
      // this.searchCost('');
      // this.searchCost2('');
      this.searchStore('');
      this.getTypes();
      this.getCurrencies();
      this.getProjects();
      this.getAccDir();
      this.getTransSource();

      if(this.DocNo !=null && this.DocNo > 0 )
      {
        this.editMode=true;
          this.InvoiceForm.controls['n_trans_source_no'].disable();
          this.showspinner=true;
          this._PurchaseInvoiceService.GetInvoiceByID(this.DocNo,this.DataAreaNo).subscribe(data=>{
          debugger;
          data.ap_purchase_invoice_detailsLst.forEach( (res) => {
            this.addInvoiceDetails();
          });
          (this.InvoiceForm.get("invoiceDetails") as FormArray)?.patchValue(data.ap_purchase_invoice_detailsLst);

          data.ap_expenses_purchase_invoiceLst.forEach( (res) => {
            this.addExpenseDetails();
          });
          (this.InvoiceForm.get("expenseDetails") as FormArray)?.patchValue(data.ap_expenses_purchase_invoiceLst);
          
          this.setMainValues();
          
          this.InvoiceForm.patchValue(data);
          this._LookupControlService.SetName(this.InvoiceForm, "sup", "n_supplier_id", "SupplierName");
          this._LookupControlService.SetName(this.InvoiceForm, "cost", "s_cost_center_id", "CostName");
          this._LookupControlService.SetName(this.InvoiceForm, "cost", "s_cost_center_id2", "CostName2");

          this.InvoiceForm.get("d_purchase_invoice_date")?.patchValue(new Date(Number(data.d_purchase_invoice_date.substring(0,4)), Number(data.d_purchase_invoice_date.substring(5,7))-1, Number(data.d_purchase_invoice_date.substring(8,10))));
          if(data.d_supplier_invoice_date != "")
            this.InvoiceForm.get("d_supplier_invoice_date")?.patchValue(new Date(Number(data.d_supplier_invoice_date.substring(0,4)), Number(data.d_supplier_invoice_date.substring(5,7))-1, Number(data.d_supplier_invoice_date.substring(8,10))));
          if(data.d_due_date != "")
            this.InvoiceForm.get("d_due_date")?.patchValue(new Date(Number(data.d_due_date.substring(0,4)), Number(data.d_due_date.substring(5,7))-1, Number(data.d_due_date.substring(8,10))));
          if(data.b_has_extra_expnses==true)
            this.bExtra=true;  
          if(data.b_has_extra_discount==true)
            this.isDiscounted=true;  

          this._PurchaseInvoiceService.GetMainCurrency().subscribe(res=>{
            if(res != data.n_currency_id)
              this.bisMainCurrency=true;
          });

          this.setEditValues();
          this.setItemTotal();

          this.showspinner=false;
          this.editMode=false;
        });
      }
      else
      {
        this.setMainCurrency();
        this.addInvoiceDetails();
      }
      LangSwitcher.translateData(1)
      LangSwitcher.translatefun();
      this.isEnglish=LangSwitcher.CheckLan();   
    }


    save() {
      debugger;
      if(!this.validateDetails())
      {
        this.showspinner=false;
        if(this.isEnglish)
          this. _notification.ShowMessage('Please complete data at line ' + this.invalidRow,3);
        else
          this. _notification.ShowMessage('من فضلك اكمل ادخال بيانات الاصناف فى السطر رقم ' + this.invalidRow,3);
        return;
      } 
      if(!this.validateExpenseDetails())
      {
        this.showspinner=false;
        if(this.isEnglish)
          this. _notification.ShowMessage('Please complete data at line ' + this.invalidRow,3);
        else     
          this. _notification.ShowMessage('من فضلك اكمل ادخال بيانات المصروفات فى السطر رقم ' + this.invalidExpenseRow,3);
        return;
      } 

      this.showspinner=true;
      this.disableButtons();

      var formData: any = new FormData();
      this.InvoiceForm.controls['n_purchase_invoice_no'].enable();
      this.InvoiceForm.controls['n_total_qty'].enable();
      this.InvoiceForm.controls['n_total_modified_price'].enable();
      this.InvoiceForm.controls['n_no_of_items'].enable();
      this.InvoiceForm.controls['n_extra_expenses_Loaded'].enable();
      this.InvoiceForm.controls['n_net_valueWithBonus'].enable();
      this.InvoiceForm.controls['n_total_value'].enable();
      this.InvoiceForm.controls['n_extra_expenses_UnLoaded'].enable();
      this.InvoiceForm.controls['n_net_value'].enable();
      this.InvoiceForm.controls['n_total_discount'].enable();
      this.InvoiceForm.controls['n_sales_tax'].enable();
      this.InvoiceForm.controls['n_expenses_tax'].enable();
      this.InvoiceForm.controls['n_extra_expenses'].enable();
      this.InvoiceForm.controls['n_total_item_discount_ratio'].enable();
      this.InvoiceForm.controls['n_local_total_expenses'].enable();
      this.InvoiceForm.controls['n_trans_source_no'].enable();
      this.InvoiceForm.controls['n_discount_tax'].enable();
      this.InvoiceForm.controls['n_additional_tax'].enable();

      this.InvoiceForm.value.d_purchase_invoice_date=new DatePipe('en-US').transform(this.InvoiceForm.value.d_purchase_invoice_date, 'yyyy/MM/dd');
      this.InvoiceForm.value.d_supplier_invoice_date=new DatePipe('en-US').transform(this.InvoiceForm.value.d_supplier_invoice_date, 'yyyy/MM/dd');
      this.InvoiceForm.value.d_due_date=new DatePipe('en-US').transform(this.InvoiceForm.value.d_due_date, 'yyyy/MM/dd');
      formData.append("n_purchase_invoice_no", this.InvoiceForm.value.n_purchase_invoice_no ?? 0);
      formData.append("d_purchase_invoice_date", this.InvoiceForm.value.d_purchase_invoice_date);
      formData.append("s_book_doc_no", this.InvoiceForm.value.s_book_doc_no);
      //formData.append("n_project_id", this.InvoiceForm.value.n_project_id ?? 0);
      formData.append("n_ivoice_type_id", this.InvoiceForm.value.n_ivoice_type_id ?? 0);
      formData.append("n_supplier_id", this.InvoiceForm.value.n_supplier_id ?? 0);
      formData.append("n_purchaseMan_id", this.InvoiceForm.value.n_purchaseMan_id ?? 0);
      formData.append("n_store_id", this.InvoiceForm.value.n_store_id ?? 0);
      formData.append("n_currency_id", this.InvoiceForm.value.n_currency_id ?? 0);
      formData.append("n_currency_coff", this.InvoiceForm.value.n_currency_coff ?? 0);
      formData.append("s_description_arabic", this.InvoiceForm.value.s_description_arabic);
      formData.append("s_description_eng", this.InvoiceForm.value.s_description_eng);
      formData.append("d_supplier_invoice_date", this.InvoiceForm.value.d_supplier_invoice_date);
      formData.append("d_due_date", this.InvoiceForm.value.d_due_date);
      formData.append("n_serial_inv_type", this.InvoiceForm.value.n_serial_inv_type ?? 0);
      formData.append("n_trans_source_no", this.InvoiceForm.value.n_trans_source_no ?? 0);
      formData.append("s_account_with_supp", this.InvoiceForm.value.s_account_with_supp);
      formData.append("n_invoice_no_supp", this.InvoiceForm.value.n_invoice_no_supp ?? 0);
      formData.append("s_cost_center_id", this.InvoiceForm.value.s_cost_center_id);
      formData.append("s_cost_center_id2", this.InvoiceForm.value.s_cost_center_id2);
      formData.append("n_acc_dir_id", this.InvoiceForm.value.n_acc_dir_id ?? 0);
      formData.append("n_total_modified_price", this.InvoiceForm.value.n_total_modified_price ?? 0);
      formData.append("n_total_qty", this.InvoiceForm.value.n_total_qty ?? 0);
      formData.append("n_no_of_items", this.InvoiceForm.value.n_no_of_items ?? 0);
      formData.append("n_extra_expenses_Loaded", this.InvoiceForm.value.n_extra_expenses_Loaded ?? 0);
      formData.append("n_net_valueWithBonus", this.InvoiceForm.value.n_net_valueWithBonus ?? 0);
      formData.append("n_total_value", this.InvoiceForm.value.n_total_value ?? 0);
      formData.append("n_extra_expenses_UnLoaded", this.InvoiceForm.value.n_extra_expenses_UnLoaded ?? 0);
      formData.append("n_net_value", this.InvoiceForm.value.n_net_value ?? 0);
      formData.append("n_total_discount", this.InvoiceForm.value.n_total_discount ?? 0);
      formData.append("n_sales_tax", this.InvoiceForm.value.n_sales_tax ?? 0);
      formData.append("n_expenses_tax", this.InvoiceForm.value.n_expenses_tax ?? 0);
      formData.append("n_extra_expenses", this.InvoiceForm.value.n_extra_expenses ?? 0);
      formData.append("n_total_item_discount_ratio", this.InvoiceForm.value.n_total_item_discount_ratio ?? 0);
      formData.append("n_local_total_expenses", this.InvoiceForm.value.n_local_total_expenses ?? 0);
      formData.append("b_use_multi_cost_center", this.InvoiceForm.value.b_use_multi_cost_center);
      formData.append("b_quantity_match", this.InvoiceForm.value.b_quantity_match);
      formData.append("b_advanced_payment", this.InvoiceForm.value.b_advanced_payment);
      formData.append("b_has_extra_expnses", this.InvoiceForm.value.b_has_extra_expnses);
      formData.append("b_dist_expense_by_modify_price", this.InvoiceForm.value.b_dist_expense_by_modify_price);
      formData.append("b_dist_expense_by_quantity", this.InvoiceForm.value.b_dist_expense_by_quantity);
      formData.append("b_has_extra_discount", this.InvoiceForm.value.b_has_extra_discount);
      formData.append("b_invoice_import", this.InvoiceForm.value.b_invoice_import);
      formData.append("n_discount_ratio", this.InvoiceForm.value.n_discount_ratio ?? 0);
      formData.append("n_extra_discount", this.InvoiceForm.value.n_extra_discount ?? 0);
      formData.append("n_advanced_payment_value", this.InvoiceForm.value.n_advanced_payment_value ?? 0);
      formData.append("n_guarantees_reserved_primary_percent", this.InvoiceForm.value.n_guarantees_reserved_primary_percent ?? 0);
      formData.append("n_guarantees_reserved_primary_value", this.InvoiceForm.value.n_guarantees_reserved_primary_value ?? 0);
      formData.append("n_guarantees_reserved_final_percent", this.InvoiceForm.value.n_guarantees_reserved_final_percent ?? 0);
      formData.append("n_guarantees_reserved_final_value", this.InvoiceForm.value.n_guarantees_reserved_final_value ?? 0);
      formData.append("n_discount_tax", this.InvoiceForm.value.n_discount_tax ?? 0);
      formData.append("n_discount_tax_ratio", this.InvoiceForm.value.n_discount_tax_ratio ?? 0);
      formData.append("n_additional_tax", this.InvoiceForm.value.n_additional_tax ?? 0);
      formData.append("n_additional_tax_ratio", this.InvoiceForm.value.n_additional_tax_ratio ?? 0);
      formData.append("n_DataAreaID", this.InvoiceForm.value.n_DataAreaID ?? 0);
      formData.append("n_UserAdd", this.InvoiceForm.value.n_UserAdd ?? 0);
      formData.append("d_UserAddDate", this.InvoiceForm.value.d_UserAddDate);


      formData.append("ap_purchase_invoice.ap_purchase_invoice_detailsLst", this.InvoiceForm.value.invoiceDetails);
      for (var i = 0; i < this.InvoiceForm.value.invoiceDetails.length;i++)
      {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_value')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_discount_tax')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_additional_tax')?.enable();

        formData.append("ap_purchase_invoice_detailsLst[" + i + "].nLineNo", this.InvoiceForm.value.invoiceDetails[i].nLineNo ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].s_item_id", this.InvoiceForm.value.invoiceDetails[i].s_item_id);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_unit_id", this.InvoiceForm.value.invoiceDetails[i].n_unit_id ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_store_id", this.InvoiceForm.value.n_store_id ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_qty", this.InvoiceForm.value.invoiceDetails[i].n_qty ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_received_qty", this.InvoiceForm.value.invoiceDetails[i].n_received_qty ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_unit_price", this.InvoiceForm.value.invoiceDetails[i].n_unit_price ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_value", this.InvoiceForm.value.invoiceDetails[i].n_item_value ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].nItemDiscountP", this.InvoiceForm.value.invoiceDetails[i].nItemDiscountP ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].nItemDiscountV", this.InvoiceForm.value.invoiceDetails[i].nItemDiscountV ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_expenses", this.InvoiceForm.value.invoiceDetails[i].n_item_expenses ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].nInvDiscountV", this.InvoiceForm.value.invoiceDetails[i].nInvDiscountV ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_net_value_WithoutTax", this.InvoiceForm.value.invoiceDetails[i].n_item_net_value_WithoutTax ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_sales_Tax", this.InvoiceForm.value.invoiceDetails[i].n_item_sales_Tax ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_net_value", this.InvoiceForm.value.invoiceDetails[i].n_item_net_value ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_credit_discount", this.InvoiceForm.value.invoiceDetails[i].n_credit_discount ?? 0);
        //formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_qty_main_unit", this.InvoiceForm.value.invoiceDetails[i].n_qty_main_unit);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].total_Qty", this.InvoiceForm.value.invoiceDetails[i].total_Qty);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_modification_unit_price", this.InvoiceForm.value.invoiceDetails[i].n_modification_unit_price ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].s_notes", this.InvoiceForm.value.invoiceDetails[i].s_notes);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].b_is_free", this.InvoiceForm.value.invoiceDetails[i].b_is_free);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].s_cost_center_id", this.InvoiceForm.value.invoiceDetails[i].s_cost_center_id);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].s_cost_center_id2", this.InvoiceForm.value.invoiceDetails[i].s_cost_center_id2);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_trans_source_doc_no", this.transNo);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_discount_tax", this.InvoiceForm.value.invoiceDetails[i].n_item_discount_tax ?? 0);
        formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_additional_tax", this.InvoiceForm.value.invoiceDetails[i].n_item_additional_tax ?? 0);
      }

      formData.append("ap_purchase_invoice.ap_expenses_purchase_invoiceLst", this.InvoiceForm.value.expenseDetails);
      for (var i = 0; i < this.InvoiceForm.value.expenseDetails.length;i++)
      {
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_value')?.enable();
        ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.enable();

        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].nLineNo", this.InvoiceForm.value.expenseDetails[i].nLineNo ?? 0);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].s_expense_code", this.InvoiceForm.value.expenseDetails[i].s_expense_code);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].b_has_tax", this.InvoiceForm.value.expenseDetails[i].b_has_tax);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].nExpensesValue", this.InvoiceForm.value.expenseDetails[i].nExpensesValue);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].n_currency_id", this.InvoiceForm.value.expenseDetails[i].n_currency_id ?? 0);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].nCoff", this.InvoiceForm.value.expenseDetails[i].nCoff ?? 0);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].n_sales_tax", this.InvoiceForm.value.expenseDetails[i].n_sales_tax ?? 0);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].n_value", this.InvoiceForm.value.expenseDetails[i].n_value ?? 0);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].n_loaded", this.InvoiceForm.value.expenseDetails[i].n_loaded ?? 0);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].opp_acc", this.InvoiceForm.value.expenseDetails[i].opp_acc);
        formData.append("ap_expenses_purchase_invoiceLst[" + i + "].s_descrip", this.InvoiceForm.value.expenseDetails[i].s_descrip);
      }
      if(this.DocNo !=null && this.DocNo > 0 ){

        this._PurchaseInvoiceService.SaveEditInvoice(formData).subscribe(data=>{
          this.showspinner=false;
          this.enableButtons();
          if(this.isEnglish)
          this. _notification.ShowMessage(data.Emsg,data.status);
        else
        this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){
            this._router.navigate(['/ap/purchaseinvoicelist']);
          }
        });
      }
      else
      {
        this._PurchaseInvoiceService.SaveInvoice(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this. _notification.ShowMessage(data.Emsg,data.status);
      else
      this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){
            this._router.navigate(['/ap/purchaseinvoicelist']);
          }
        });
    }

    }

    addInvoiceDetails() {
      this.invoiceDetails.push(this.newInvoiceDetails(this.invoiceDetails.length+1));
    }

    newInvoiceDetails(line:number=0): FormGroup {

      return this.fb.group({
        nLineNo:line,
        s_item_id:'',
        s_item_name:'',
        n_unit_id:'',
        s_unit_name:'',
        n_qty:'',
        n_received_qty:'',
        n_unit_price:'',
        n_item_value:'',
        nItemDiscountP:'',
        nItemDiscountV:'',
        n_item_expenses:'',
        nInvDiscountV:'',
        n_item_net_value_WithoutTax:'',
        n_item_sales_Tax:'',
        n_item_net_value:'',
        s_cost_center_id:'',
        s_cost_center_name:'',
        s_cost_center_id2:'',
        s_cost_center_name2:'',
        n_trans_source_doc_no:'',
        n_credit_discount:'',
        n_qty_main_unit:'',
        total_Qty:'',
        n_modification_unit_price:'',
        s_notes:'',
        s_item_color:'',
        s_unit_color:'',
        s_qty_color:'',
        s_price_color:'',
        n_Bonus:'',
        n_item_discount_tax:'',
        n_item_additional_tax:''
      })
   }

   
   addExpenseDetails() {
    this.expenseDetails.push(this.newExpenseDetails(this.expenseDetails.length+1));
  }

  newExpenseDetails(line:number=0): FormGroup {

    return this.fb.group({
      nLineNo:line,
      s_expense_code:'',
      s_expense_name:'',
      b_has_tax:false,
      nExpensesValue:'',
      n_currency_id:this.mainCurrency,
      nCoff:1,
      n_sales_tax:'',
      n_value:'',
      n_loaded:'',
      opp_acc:'',
      opp_acc_name:'',
      s_descrip:'',
      s_expense_color:'',
      s_value_color:'',
      s_acc_color:''
    })
 }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  
  invalidRow:string='';
  validateDetails():boolean{
    let i=0;
    let validrows : boolean=true;
    this.invalidRow='';
    for (let c of this.invoiceDetails.controls) {  
       if(((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value=='' )
       {
         ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_color')?.patchValue('bg-warning');
          validrows=false;
       }
       if(((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value<=0)
       {
         ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_unit_color')?.patchValue('bg-warning');
          validrows=false;
       }
       if(((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.value =='' || ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.value =='0' )
       {
         ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_qty_color')?.patchValue('bg-warning');
          validrows=false;
       }
       if(((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value =='' || ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value =='0')
       {
         ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_price_color')?.patchValue('bg-warning');
          validrows=false;     
       }
       if(((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value==''  || ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value<=0 || ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.value =='' || ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty')?.value =='0' ||((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value =='' || ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_price')?.value =='0')
       {
        this.invalidRow+=(i+1)+",";
       }
       i++;
    }
    this.invalidRow=this.invalidRow.slice(0, -1);
    return validrows;
  }

   
  invalidExpenseRow:string='';
  validateExpenseDetails():boolean{
    let i=0;
    let validrows : boolean=true;
    this.invalidExpenseRow='';
    for (let c of this.expenseDetails.controls) {  
       if(((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_code')?.value=='' )
       {
         ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_color')?.patchValue('bg-warning');
          validrows=false;
       }
       if(((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nExpensesValue')?.value=='' )
       {
         ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_value_color')?.patchValue('bg-warning');
          validrows=false;
       }
       if(((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('opp_acc')?.value=='' )
       {
         ((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_acc_color')?.patchValue('bg-warning');
          validrows=false;
       }
       if(((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('s_expense_code')?.value=='' ||((this.InvoiceForm.get("expenseDetails") as FormArray).at(i) as FormGroup).get('nExpensesValue')?.value=='' )
       {
        this.invalidExpenseRow+=(i+1)+",";
       }
       i++;
    }
    this.invalidExpenseRow=this.invalidExpenseRow.slice(0, -1);
    return validrows;
  }

  SetTaxes(){
    if(this.editMode==false)
    {
      for (let i = 0; i < this.invoiceDetails.length; i++)
      { 
        this.calcRows(i,1);
      }
    }
  }

  reservationFirstP(){
    var net=this.InvoiceForm.get('n_net_value')?.value;
    var perc=this.InvoiceForm.get('n_guarantees_reserved_primary_percent')?.value;
    this.InvoiceForm.get('n_guarantees_reserved_primary_value')?.patchValue(net*(perc/100));
  }

  reservationFirstV(){
    var net=this.InvoiceForm.get('n_net_value')?.value;
    var value=this.InvoiceForm.get('n_guarantees_reserved_primary_value')?.value;
    this.InvoiceForm.get('n_guarantees_reserved_primary_percent')?.patchValue((value/net)*100);
  }

  reservationLastP(){
    var net=this.InvoiceForm.get('n_net_value')?.value;
    var perc=this.InvoiceForm.get('n_guarantees_reserved_final_percent')?.value;
    this.InvoiceForm.get('n_guarantees_reserved_final_value')?.patchValue(net*(perc/100));
  }

  reservationLastV(){
    var net=this.InvoiceForm.get('n_net_value')?.value;
    var value=this.InvoiceForm.get('n_guarantees_reserved_final_value')?.value;
    this.InvoiceForm.get('n_guarantees_reserved_final_percent')?.patchValue((value/net)*100);
  }

  round (n, dp) {
    const h = +('1'.padEnd(dp + 1, '0'));
    return Math.round(n * h) / h;
  }

  JournalShow(){
    if(this.InvoiceForm.get('n_acc_dir_id')?.value==0 ||this.InvoiceForm.get('n_acc_dir_id')?.value=='')
    {
      if(this.isEnglish)
      this. _notification.ShowMessage('Please choose direction first ',3);
    else 
      this. _notification.ShowMessage('اختر توجيه اولاً من فضلك',3);
      return;
    }
    if(this.InvoiceForm.get('n_supplier_id')?.value==0 ||this.InvoiceForm.get('n_supplier_id')?.value=='')
    {
      if(this.isEnglish)
      this. _notification.ShowMessage('Please choose supplier first ',3);
    else 
   
      this. _notification.ShowMessage('اختر المورد اولاً من فضلك',3);
      return;
    }
    if(this.InvoiceForm.get('n_ivoice_type_id')?.value==0 ||this.InvoiceForm.get('n_ivoice_type_id')?.value=='')
    {
      if(this.isEnglish)
      this. _notification.ShowMessage('Please choose invoice first ',3);
    else 

      this. _notification.ShowMessage('اختر نوع الفاتورة اولاً من فضلك',3);
      return;
    }
    var JournalID=0, edit=false;
    var savedJournals, currentJournals;
    var JournalType=this.InvoiceForm.get('n_ivoice_type_id')?.value;
    var currency=this.InvoiceForm.get('n_currency_id')?.value;
    var descAr=this.InvoiceForm.get('s_description_arabic')?.value;
    var descEn=this.InvoiceForm.get('s_description_eng')?.value;
    var date=new DatePipe('en-US').transform(this.InvoiceForm.value.d_purchase_invoice_date, 'yyyy/MM/dd');
    $('#btnJournal').prop('disabled', true);

    if(this.DocNo !=null && this.DocNo > 0 ){
      edit=true;
      this._PurchaseInvoiceService.GetJournalID(this.DocNo,JournalType).subscribe(res=>{
        JournalID=res;
        this._PurchaseInvoiceService.GetSavedJournals(JournalID).subscribe(data=>{
          savedJournals=data;
          this._PurchaseInvoiceService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
            currentJournals=current;
            $('#btnJournal').prop('disabled', false);
            const dialogRef = this.dialog.open(TransJournalsComponent, {
              width: '800px',
              height:'600px',
              data: { edit,JournalID,date,JournalType,currency,descAr,descEn, savedJournals,currentJournals }
            });
          });
        });
      });
    }
    else
    {
      this._PurchaseInvoiceService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
        currentJournals=current;
        $('#btnJournal').prop('disabled', false);
        const dialogRef = this.dialog.open(TransJournalsComponent, {
          width: '800px',
          height:'600px',
          data: { edit,JournalID,date,JournalType,currency,descAr,descEn,currentJournals }
        });
      });
    }
  }

  SetJournalData(): any
  {
    var formData: any = new FormData();
    this.InvoiceForm.controls['n_total_qty'].enable();
    this.InvoiceForm.controls['n_total_modified_price'].enable();
    this.InvoiceForm.controls['n_no_of_items'].enable();
    this.InvoiceForm.controls['n_extra_expenses_Loaded'].enable();
    this.InvoiceForm.controls['n_net_valueWithBonus'].enable();
    this.InvoiceForm.controls['n_total_value'].enable();
    this.InvoiceForm.controls['n_extra_expenses_UnLoaded'].enable();
    this.InvoiceForm.controls['n_net_value'].enable();
    this.InvoiceForm.controls['n_total_discount'].enable();
    this.InvoiceForm.controls['n_sales_tax'].enable();
    this.InvoiceForm.controls['n_expenses_tax'].enable();
    this.InvoiceForm.controls['n_extra_expenses'].enable();
    this.InvoiceForm.controls['n_total_item_discount_ratio'].enable();
    this.InvoiceForm.controls['n_local_total_expenses'].enable();
    this.InvoiceForm.controls['n_discount_tax'].enable();
    this.InvoiceForm.controls['n_additional_tax'].enable();

    formData.append("n_ivoice_type_id", this.InvoiceForm.value.n_ivoice_type_id ?? 0);
    formData.append("n_supplier_id", this.InvoiceForm.value.n_supplier_id ?? 0);
    formData.append("n_purchaseMan_id", this.InvoiceForm.value.n_purchaseMan_id ?? 0);
    formData.append("n_store_id", this.InvoiceForm.value.n_store_id ?? 0);
    formData.append("n_currency_id", this.InvoiceForm.value.n_currency_id ?? 0);
    formData.append("s_description_arabic", this.InvoiceForm.value.s_description_arabic);
    formData.append("n_currency_coff", this.InvoiceForm.value.n_currency_coff ?? 0);
    formData.append("n_acc_dir_id", this.InvoiceForm.value.n_acc_dir_id ?? 0);
    formData.append("n_total_modified_price", this.InvoiceForm.value.n_total_modified_price ?? 0);
    formData.append("n_total_qty", this.InvoiceForm.value.n_total_qty ?? 0);
    formData.append("n_no_of_items", this.InvoiceForm.value.n_no_of_items ?? 0);
    formData.append("n_extra_expenses_Loaded", this.InvoiceForm.value.n_extra_expenses_Loaded ?? 0);
    formData.append("n_net_valueWithBonus", this.InvoiceForm.value.n_net_valueWithBonus ?? 0);
    formData.append("n_total_value", this.InvoiceForm.value.n_total_value ?? 0);
    formData.append("n_extra_expenses_UnLoaded", this.InvoiceForm.value.n_extra_expenses_UnLoaded ?? 0);
    formData.append("n_net_value", this.InvoiceForm.value.n_net_value ?? 0);
    formData.append("n_total_discount", this.InvoiceForm.value.n_total_discount ?? 0);
    formData.append("n_sales_tax", this.InvoiceForm.value.n_sales_tax ?? 0);
    formData.append("n_expenses_tax", this.InvoiceForm.value.n_expenses_tax ?? 0);
    formData.append("n_extra_expenses", this.InvoiceForm.value.n_extra_expenses ?? 0);
    formData.append("n_total_item_discount_ratio", this.InvoiceForm.value.n_total_item_discount_ratio ?? 0);
    formData.append("n_local_total_expenses", this.InvoiceForm.value.n_local_total_expenses ?? 0);
    formData.append("n_discount_ratio", this.InvoiceForm.value.n_discount_ratio ?? 0);
    formData.append("n_extra_discount", this.InvoiceForm.value.n_extra_discount ?? 0);
    formData.append("n_advanced_payment_value", this.InvoiceForm.value.n_advanced_payment_value ?? 0);
    formData.append("n_guarantees_reserved_primary_percent", this.InvoiceForm.value.n_guarantees_reserved_primary_percent ?? 0);
    formData.append("n_guarantees_reserved_primary_value", this.InvoiceForm.value.n_guarantees_reserved_primary_value ?? 0);
    formData.append("n_guarantees_reserved_final_percent", this.InvoiceForm.value.n_guarantees_reserved_final_percent ?? 0);
    formData.append("n_guarantees_reserved_final_value", this.InvoiceForm.value.n_guarantees_reserved_final_value ?? 0);
    formData.append("n_discount_tax", this.InvoiceForm.value.n_discount_tax ?? 0);
    formData.append("n_discount_tax_ratio", this.InvoiceForm.value.n_discount_tax_ratio ?? 0);
    formData.append("n_additional_tax", this.InvoiceForm.value.n_additional_tax ?? 0);
    formData.append("n_additional_tax_ratio", this.InvoiceForm.value.n_additional_tax_ratio ?? 0);

    formData.append("ap_purchase_invoice.ap_purchase_invoice_detailsLst", this.InvoiceForm.value.invoiceDetails);
    for (var i = 0; i < this.InvoiceForm.value.invoiceDetails.length;i++)
    {
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nCoff')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_value')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_expenses')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('nInvDiscountV')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value_WithoutTax')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_net_value')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_qty_main_unit')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_discount_tax')?.enable();
      ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_item_additional_tax')?.enable();

      formData.append("ap_purchase_invoice_detailsLst[" + i + "].nLineNo", this.InvoiceForm.value.invoiceDetails[i].nLineNo ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_unit_id", this.InvoiceForm.value.invoiceDetails[i].n_unit_id ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_store_id", this.InvoiceForm.value.n_store_id ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_qty", this.InvoiceForm.value.invoiceDetails[i].n_qty ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_received_qty", this.InvoiceForm.value.invoiceDetails[i].n_received_qty ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_unit_price", this.InvoiceForm.value.invoiceDetails[i].n_unit_price ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_value", this.InvoiceForm.value.invoiceDetails[i].n_item_value ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].nItemDiscountP", this.InvoiceForm.value.invoiceDetails[i].nItemDiscountP ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].nItemDiscountV", this.InvoiceForm.value.invoiceDetails[i].nItemDiscountV ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_expenses", this.InvoiceForm.value.invoiceDetails[i].n_item_expenses ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].nInvDiscountV", this.InvoiceForm.value.invoiceDetails[i].nInvDiscountV ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_net_value_WithoutTax", this.InvoiceForm.value.invoiceDetails[i].n_item_net_value_WithoutTax ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_sales_Tax", this.InvoiceForm.value.invoiceDetails[i].n_item_sales_Tax ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_net_value", this.InvoiceForm.value.invoiceDetails[i].n_item_net_value ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_credit_discount", this.InvoiceForm.value.invoiceDetails[i].n_credit_discount ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].total_Qty", this.InvoiceForm.value.invoiceDetails[i].total_Qty);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_modification_unit_price", this.InvoiceForm.value.invoiceDetails[i].n_modification_unit_price ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_trans_source_doc_no", this.transNo);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_discount_tax", this.InvoiceForm.value.invoiceDetails[i].n_item_discount_tax ?? 0);
      formData.append("ap_purchase_invoice_detailsLst[" + i + "].n_item_additional_tax", this.InvoiceForm.value.invoiceDetails[i].n_item_additional_tax ?? 0);
    }

    this.InvoiceForm.controls['n_total_qty'].disable();
    this.InvoiceForm.controls['n_total_modified_price'].disable();
    this.InvoiceForm.controls['n_no_of_items'].disable();
    this.InvoiceForm.controls['n_extra_expenses_Loaded'].disable();
    this.InvoiceForm.controls['n_net_valueWithBonus'].disable();
    this.InvoiceForm.controls['n_total_value'].disable();
    this.InvoiceForm.controls['n_extra_expenses_UnLoaded'].disable();
    this.InvoiceForm.controls['n_net_value'].disable();
    this.InvoiceForm.controls['n_total_discount'].disable();
    this.InvoiceForm.controls['n_sales_tax'].disable();
    this.InvoiceForm.controls['n_expenses_tax'].disable();
    this.InvoiceForm.controls['n_extra_expenses'].disable();
    this.InvoiceForm.controls['n_total_item_discount_ratio'].disable();
    this.InvoiceForm.controls['n_local_total_expenses'].disable();
    this.InvoiceForm.controls['n_discount_tax'].disable();
    this.InvoiceForm.controls['n_additional_tax'].disable();
    return formData;
  }
 

}
