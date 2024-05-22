import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { ItemsLookUpComponent } from 'src/app/Controls/items-look-up/items-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { ExpensesLkpComponent } from 'src/app/Controls/expenses-lkp/expenses-lkp.component';
import { AccountsLookupComponent } from 'src/app/Controls/accounts-lookup/accounts-lookup.component';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { RequestOrderService } from 'src/app/Core/Api/AR/request-order.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

declare var $: any;
@Component({
  selector: 'app-request-order',
  templateUrl: './request-order.component.html',
  styleUrls: ['./request-order.component.css']
})
export class RequestOrderComponent extends BaseComponent  implements OnInit {

  dtOptions: DataTables.Settings = {};
  InvoiceForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  DocNo : any;
  DataAreaNo : any;
  bisMainCurrency=false;
  mainCurrency:number=0;
  taxStatus:boolean=false;
  totalValue:number=0;
  expensesValue:number=0;
  totalDiscount:number=0;
  isSelectedTrans:boolean=false;
  transNo:any='';
  editMode:boolean=false;
  showspinner:boolean=false;

    constructor(private fb:FormBuilder
    ,private _RequestOrderService : RequestOrderService
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private userservice:UserService) {
      super(_route.data,userservice);

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers',
        pageLength: 2,
        processing: true

      };

      this.InvoiceForm = this.fb.group({
        n_document_no: '',
        d_doc_date:new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_customer_id:new FormControl('', Validators.required),
        n_sales_man_id:'',
        n_employee_id:'',
        n_store_id: new FormControl('', Validators.required),
        n_currency_id: new FormControl('', Validators.required),
        n_currency_coff:'',
        s_description_arabic: '',
        s_description_eng:'',
        n_trans_source_no:'',
        s_car:'',
        n_transport_value:'',
        n_transport_type:'',
        n_customer_load_value:'',
        b_confirm:'',
        b_direct:'',
        s_trans_doc_no:'',
        n_total_qty:'',      
        n_total_value:'',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',
        invoiceDetails: this.fb.array([] , Validators.required)
      });
     }


     InvoiceData:any=[];
     StoreData:any=[];
     CustomerData:any=[];
     SalesmanData:any=[];
     CurrencyData:any=[];
     ProjectData:any=[];
     CostData:any=[];
     Cost2Data:any=[];
     AccDirData:any=[];
     TranSourceData:any=[];
     UnitsData:any=[];
     EmployeeData:any=[];
     TransportData:any=[];
     filteredCustomerServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
     filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
     filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
     filteredSalesmanServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
     filteredStoreServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
     filteredEmployeeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
     searchingCustomer:boolean=false;
     searchingSalesman:boolean=false;
     searchingEmployee:boolean=false;
     searchingCost:boolean=false;
     searchingCost2:boolean=false;
     searchingStore:boolean=false;
    isEnglish:boolean=false;
     get invoiceDetails() : FormArray {
       return this.InvoiceForm.get("invoiceDetails") as FormArray
     }
     override ngOnInit(): void {
      this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
      this.DataAreaNo = Number(this.userservice.GetDataAreaID());
      this.searchCustomer('');
      this.searchSalesman('');
      this.searchCost('');
      this.searchCost2('');
      this.searchStore('');
      this.getCurrencies();
      this.getTransSource();
      this.searchEmployee('');
      this.getTransportTypes();

      if(this.DocNo !=null && this.DocNo > 0 )
      {
          this.editMode=true;
          this.InvoiceForm.controls['s_trans_doc_no'].disable();
          this.InvoiceForm.controls['n_trans_source_no'].disable();
          this.InvoiceForm.controls['b_direct'].disable();
          this.showspinner=true;
          this._RequestOrderService.GetRequestByID(this.DocNo,this.DataAreaNo).subscribe(data=>{
          var i=0;
          data.ar_request_order_detailsLst.forEach( (res) => {
           debugger;
            this.addInvoiceDetails();
            if(data.ar_request_order_detailsLst[i].d_ExpectedDate!=null)
            {
             data.ar_request_order_detailsLst[i].d_ExpectedDate=new Date(Number(data.ar_request_order_detailsLst[i].d_ExpectedDate.substring(0,4)), Number(data.ar_request_order_detailsLst[i].d_ExpectedDate.substring(5,7))-1, Number(data.ar_request_order_detailsLst[i].d_ExpectedDate.substring(8,10)));
            }
           i++;
          });
          (this.InvoiceForm.get("invoiceDetails") as FormArray)?.patchValue(data.ar_request_order_detailsLst);
          
          this.InvoiceForm.patchValue(data);
          this.InvoiceForm.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
          this._RequestOrderService.GetMainCurrency().subscribe(res=>{
            if(res != data.n_currency_id)
              this.bisMainCurrency=true;
          });

          this.setTotals();
          this.DirectRequest();
          this.showspinner=false;
          this.editMode=false;
        });
      }
      else
      {
        this.setMainCurrency();
        this.addInvoiceDetails();
      }
      LangSwitcher.translateData(1);
      LangSwitcher.translatefun();
      this.isEnglish=LangSwitcher.CheckLan();
    }
    
     searchCustomer(value :any){
       this.searchingCustomer=true;
       this._RequestOrderService.GetCustomers(value).subscribe(res=>{
         this.CustomerData=res;
         this.filteredCustomerServerSide.next(  this.CustomerData.filter(x => x.s_customer_name.toLowerCase().indexOf(value) > -1));
         this.searchingCustomer=false;
       });
     }
 
     searchSalesman(value :any){
       this.searchingSalesman=true;
       this._RequestOrderService.GetSalesMen(value).subscribe(res=>{
         this.SalesmanData=res;
         this.filteredSalesmanServerSide.next(  this.SalesmanData.filter(x => x.s_salesman_name.toLowerCase().indexOf(value) > -1));
         this.searchingSalesman=false;
       });
     }
    
 
     searchCost(value :any){
       this.searchingCost=true;
       this._RequestOrderService.GetCostCenters(value).subscribe(res=>{
         this.CostData=res;
         this.filteredCostCenterServerSide.next(  this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
         this.searchingCost=false;
       });
     }
 
     searchCost2(value :any){
       this.searchingCost2=true;
       this._RequestOrderService.GetCostCenters(value).subscribe(res=>{
         this.Cost2Data=res;
         this.filteredCostCenter2ServerSide.next(  this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
         this.searchingCost2=false;
       });
     }

     searchEmployee(value :any){
      this.searchingEmployee=true;
      this._RequestOrderService.GetEmployees(value).subscribe(res=>{
        this.EmployeeData=res;
        this.filteredEmployeeServerSide.next(  this.EmployeeData.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
        this.searchingEmployee=false;
      });
    }
 
     searchStore(value :any){
       this.searchingStore=true;
       this._RequestOrderService.GetStores(value).subscribe(res=>{
         this.StoreData=res;
         this.filteredStoreServerSide.next(this.StoreData.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
         this.searchingStore=false;
       });
     }
 
     getCurrencies(){
       this._RequestOrderService.GetCurrencies().subscribe(res=>{
         this.CurrencyData=res;
       });
     }

     getTransportTypes(){
      this._RequestOrderService.GetTransportTypes().subscribe(res=>{
        this.TransportData=res;
      });
    }
 
     getUnit(i :number){
       var item=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
       this._RequestOrderService.GetUnits(item).subscribe(data=>{
         this.UnitsData =  data;
       });
     }
 
     getSelectedUnit(item :any){
       this._RequestOrderService.GetUnits(item).subscribe(data=>{
         this.UnitsData =  data;
       });
     }
 
     getTransSource(){
       this._RequestOrderService.GetTransSource().subscribe(data=>{
         this.TranSourceData =  data;
       });
     }
 
 
     setMainCurrency(){
       this._RequestOrderService.GetMainCurrency().subscribe(res=>{
         this.InvoiceForm.get('n_currency_id')?.patchValue(res);
         this.mainCurrency=res;
       });
     }
 
 
     _currentItemIndex:number=0;
     LoadItems(i:number){
   
       if(this.InvoiceForm.get('b_direct')?.value==false)
       {
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
        });
     }
 
     LoadUnits(i:number){
      if(this.InvoiceForm.get('b_direct')?.value==false)
      {
        return;
      }
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
       var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
 
       this._RequestOrderService.GetItemName(itemNo).subscribe(res=>{
         if(res==null)
         {
           ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.patchValue('');
           ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
         }
         else
         {
           ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(res.name);
         }
         this.resetUnit(i);
       });
       this.getUnit(i);
     }
 
 
     ChangeUnit(i:number)
     {
       var itemNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
       var unitNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.value;
 
       this._RequestOrderService.GetUnitName(itemNo,unitNo).subscribe(res=>{
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
 

 
     ChangeDetailsCost1(i:number)
     {
       var costNo=((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;
 
       this._RequestOrderService.GetCostName(costNo).subscribe(res=>{
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
 
       this._RequestOrderService.GetCostName(costNo).subscribe(res=>{
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
       if(this.InvoiceForm.get('n_currency_id')?.value ==this.mainCurrency)
       {
         this.bisMainCurrency=false;
         this.InvoiceForm.get('n_currency_coff')?.patchValue('');
       }
       else
         this.bisMainCurrency=true;
 
     }
 
     RemoveInvoiceDetail(i:number) {
       if(this.invoiceDetails.length==1)
       {
         this._notification.ShowMessage('يجب ان يحتوى الأذن على صنف واحد على الاقل',2);
         return;
       }
       this.invoiceDetails.removeAt(i);
     }

     setTotals(){
       var totalQty=0, total=0;
       for (let i = 0; i < this.invoiceDetails.length; i++) {
         totalQty += Number(this.InvoiceForm.value.invoiceDetails[i].n_qty) ?? 0;
         total += ((Number(this.InvoiceForm.value.invoiceDetails[i].n_qty) ?? 0) * (Number(this.InvoiceForm.value.invoiceDetails[i].n_unit_price) ?? 0));
       }
       this.InvoiceForm.get('n_total_qty')?.patchValue(totalQty);
       this.InvoiceForm.get('n_total_value')?.patchValue(total);
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
         this._RequestOrderService.GetGenericViewData(res.data[0], res.data[1]).subscribe((data) => {
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
           this.InvoiceForm.get('s_trans_doc_no')?.patchValue(data[0].n_doc_no);
           (this.InvoiceForm.get('invoiceDetails') as FormArray)?.patchValue(data);
           this.changeCustomer();
           this.setTotals();
         });
        });
     }
 

 
 
     save() {
       debugger;
       if(!this.validateDetails())
       {
         this.showspinner=false;
        if(this.isEnglish)
        this. _notification.ShowMessage('Please insert complete data in line ' + this.invalidRow,3);
        else
        this. _notification.ShowMessage('من فضلك اكمل ادخال بيانات الاصناف فى السطر رقم ' + this.invalidRow,3);
         return;
       } 
 
       this.showspinner=true;
       this.disableButtons();
 
       var formData: any = new FormData();
       this.InvoiceForm.controls['n_document_no'].enable();
       this.InvoiceForm.controls['n_trans_source_no'].enable();
       this.InvoiceForm.controls['s_trans_doc_no'].enable();
       this.InvoiceForm.controls['b_direct'].enable();

       this.InvoiceForm.value.d_doc_date=new DatePipe('en-US').transform(this.InvoiceForm.value.d_doc_date, 'yyyy/MM/dd');
       formData.append("n_document_no", this.InvoiceForm.value.n_document_no ?? 0);
       formData.append("d_doc_date", this.InvoiceForm.value.d_doc_date);
       formData.append("n_customer_id", this.InvoiceForm.value.n_customer_id ?? 0);
       formData.append("n_sales_man_id", this.InvoiceForm.value.n_sales_man_id ?? 0);
       formData.append("n_store_id", this.InvoiceForm.value.n_store_id ?? 0);
       formData.append("n_currency_id", this.InvoiceForm.value.n_currency_id ?? 0);
       formData.append("n_currency_coff", this.InvoiceForm.value.n_currency_coff ?? 0);
       formData.append("s_description_arabic", this.InvoiceForm.value.s_description_arabic);
       formData.append("s_description_eng", this.InvoiceForm.value.s_description_eng);
       formData.append("n_trans_source_no", this.InvoiceForm.value.n_trans_source_no ?? 0);
       formData.append("s_cost_center_id", this.InvoiceForm.value.s_cost_center_id);
       formData.append("s_cost_center_id2", this.InvoiceForm.value.s_cost_center_id2);
       formData.append("b_confirm", this.InvoiceForm.value.b_confirm);
       formData.append("s_car", this.InvoiceForm.value.s_car);
       formData.append("n_transport_value", this.InvoiceForm.value.n_transport_value ?? 0);
       formData.append("n_transport_type", this.InvoiceForm.value.n_transport_type ?? 0);
       formData.append("n_customer_load_value", this.InvoiceForm.value.n_customer_load_value ?? 0);
       formData.append("n_employee_id", this.InvoiceForm.value.n_employee_id ?? 0);
       formData.append("b_direct", this.InvoiceForm.value.b_direct);
       formData.append("s_trans_doc_no", this.InvoiceForm.value.s_trans_doc_no);
       formData.append("n_DataAreaID", this.InvoiceForm.value.n_DataAreaID ?? 0);
       formData.append("n_UserAdd", this.InvoiceForm.value.n_UserAdd ?? 0);
       formData.append("d_UserAddDate", this.InvoiceForm.value.d_UserAddDate);
 
 
       formData.append("ar_request_order.ar_request_order_detailsLst", this.InvoiceForm.value.invoiceDetails);
       for (var i = 0; i < this.InvoiceForm.value.invoiceDetails.length;i++)
       {
          if(this.InvoiceForm.get("b_direct")?.value==false)
          {
            ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.enable();
            ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.enable();  
          }

          this.InvoiceForm.value.invoiceDetails[i].d_ExpectedDate=new DatePipe('en-US').transform(this.InvoiceForm.value.invoiceDetails[i].d_ExpectedDate, 'yyyy/MM/dd');
          formData.append("ar_request_order_detailsLst[" + i + "].d_ExpectedDate", this.InvoiceForm.value.invoiceDetails[i].d_ExpectedDate ?? 0);
          formData.append("ar_request_order_detailsLst[" + i + "].nLineNo", this.InvoiceForm.value.invoiceDetails[i].nLineNo ?? 0);
          formData.append("ar_request_order_detailsLst[" + i + "].s_item_id", this.InvoiceForm.value.invoiceDetails[i].s_item_id);
          formData.append("ar_request_order_detailsLst[" + i + "].n_unit_id", this.InvoiceForm.value.invoiceDetails[i].n_unit_id ?? 0);
          formData.append("ar_request_order_detailsLst[" + i + "].n_store_id", this.InvoiceForm.value.n_store_id ?? 0);
          formData.append("ar_request_order_detailsLst[" + i + "].n_qty", this.InvoiceForm.value.invoiceDetails[i].n_qty ?? 0);
          formData.append("ar_request_order_detailsLst[" + i + "].n_unit_price", this.InvoiceForm.value.invoiceDetails[i].n_unit_price ?? 0);
          formData.append("ar_request_order_detailsLst[" + i + "].s_notes", this.InvoiceForm.value.invoiceDetails[i].s_notes);
          formData.append("ar_request_order_detailsLst[" + i + "].s_cost_center_id", this.InvoiceForm.value.invoiceDetails[i].s_cost_center_id);
          formData.append("ar_request_order_detailsLst[" + i + "].s_cost_center_id2", this.InvoiceForm.value.invoiceDetails[i].s_cost_center_id2);
          formData.append("ar_request_order_detailsLst[" + i + "].n_trans_source_doc_no", this.transNo ?? 0);
          formData.append("ar_request_order_detailsLst[" + i + "].n_Bonus", this.InvoiceForm.value.invoiceDetails[i].n_Bonus ?? 0);

          if(this.InvoiceForm.get("b_direct")?.value==false)
          {
            ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.disable();
            ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.disable();  
          }
       }
 
       if(this.DocNo !=null && this.DocNo > 0 ){
 
         this._RequestOrderService.SaveEdit(formData).subscribe(data=>{
           this.showspinner=false;
           this.enableButtons();
           if(this.isEnglish)
           this. _notification.ShowMessage(data.Emsg,data.status);
          else 
          this. _notification.ShowMessage(data.msg,data.status);
           if(data.status==1){
             this._router.navigate(['/ar/requestorderlist']);
           }
         });
       }
       else
       {
         this._RequestOrderService.Save(formData).subscribe(data=>{
         this.showspinner=false;
         this.enableButtons();
         if(this.isEnglish)
         this. _notification.ShowMessage(data.Emsg,data.status);
        else 
        this. _notification.ShowMessage(data.msg,data.status);
           if(data.status==1){
             this._router.navigate(['/ar/requestorderlist']);
           }
         });
     }
 
     }
 
     addInvoiceDetails() {
      var i=this.invoiceDetails.length;
       this.invoiceDetails.push(this.newInvoiceDetails(this.invoiceDetails.length+1));
       if(this.InvoiceForm.get("b_direct")?.value==false)
       {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.disable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.disable();
       }
       if(this.InvoiceForm.get("b_direct")?.value==true)
       {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.enable();
       }
     }
 
     newInvoiceDetails(line:number=0): FormGroup {
 
       return this.fb.group({
         nLineNo:line,
         s_item_id:'',
         s_item_name:'',
         n_unit_id:'',
         s_unit_name:'',
         n_qty:'',
         n_unit_price:'',
         s_cost_center_id:'',
         s_cost_center_name:'',
         s_cost_center_id2:'',
         s_cost_center_name2:'',
         n_trans_source_doc_no:'',
         s_notes:'',
         s_item_color:'',
         s_unit_color:'',
         s_qty_color:'',
         s_price_color:'',
         n_Bonus:'',
         d_ExpectedDate:new FormControl((new Date()).toISOString().substring(0,10))
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

   DirectRequest()
   {
    if(this.InvoiceForm.get("b_direct")?.value==true)
    {
      this.InvoiceForm.get("n_trans_source_no")?.patchValue(0);
      this.InvoiceForm.get("n_trans_source_no")?.disable();
      this.isSelectedTrans=false;
      this.InvoiceForm.get("s_trans_doc_no")?.patchValue(''); 
      this.InvoiceForm.get("s_trans_doc_no")?.disable();
      for (let i = 0; i < this.InvoiceForm.value.invoiceDetails.length; i++) {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.enable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.enable();
      }
    }
    else if (this.DocNo ==null)
    {
      this.InvoiceForm.get("n_trans_source_no")?.enable();
      this.InvoiceForm.get("s_trans_doc_no")?.enable();
      for (let i = 0; i < this.InvoiceForm.value.invoiceDetails.length; i++) {
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('s_item_id')?.disable();
        ((this.InvoiceForm.get("invoiceDetails") as FormArray).at(i) as FormGroup).get('n_unit_id')?.disable();
      }
    }

   }
   
   changeCustomer(){
    this._RequestOrderService.GetSalesMan(this.InvoiceForm.get("n_customer_id")?.value).subscribe(res=>{
      this.InvoiceForm.get("n_sales_man_id")?.patchValue(res.n_salesman_id); 
    });
   }

}
