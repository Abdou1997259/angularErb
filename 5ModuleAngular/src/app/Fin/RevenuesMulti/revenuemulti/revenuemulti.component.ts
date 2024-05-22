import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { TransSourceTypesComponent } from 'src/app/DynamicForms/trans-source-types/trans-source-types.component';
import { TransJournalsComponent } from 'src/app/shared/trans-journals/trans-journals.component';
import { RevenueMultiService } from 'src/app/Core/Api/FIN/revenue-multi.service';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { SourceLkpComponent } from 'src/app/Controls/source-lkp/source-lkp.component';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-revenuemulti',
  templateUrl: './revenuemulti.component.html',
  styleUrls: ['./revenuemulti.component.css']
})
export class RevenuemultiComponent extends BaseComponent implements OnInit{


  dtOptions: DataTables.Settings = {};
  RevenueForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  DocNo : any;
  DataAreaNo : any;
  bExtra=false;
  bAdvance=false;
  bisMainCurrency=false;
  mainCurrency:number=0;
  editMode:boolean=false;
  showspinner:boolean=false;
  isBank:boolean=false;
  isBank2:boolean=false;
  isTransfer:boolean=false;
  isCard:boolean=false;
  isRecieved:boolean=false;
  constructor(private fb:FormBuilder
    ,private _RevenueMultiService : RevenueMultiService
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

      this.RevenueForm = this.fb.group({
        n_doc_no: '',
        n_serial: '',
        s_book_doc_no:'',
        d_doc_date:new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_currency_id:new FormControl('', Validators.required),
        n_currency_coff:'',
        s_description:'',
        s_description_eng:'',
        n_employee_id:'',
        n_salesman_id:new FormControl('', Validators.required),
        n_total_debit:'',
        n_total_credit:'',
        n_total_tax:'',
        s_cheque_no:'',
        d_due_date:'',
        s_collection_bank:'',
        d_cheque_received_date:'',
        b_Cheque_Status:'',
        b_cheque_ReceiveDone:'',
        s_cheque_Benifer:'',
        n_transferType:'',
        s_transfer_no:'',
        s_IBAN:'',
        s_SwiftCode:'',
        s_TransferToAccount:'',
        s_Country:'',
        sCity:'',
        sAddress:'',
        n_bank_commission:'',
        b_received:'',
        n_credit_card_type:'',
        s_credit_card_no:'',
        s_credit_card_no_Auth:'',
        d_credit_card_expiry_date:'',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',
        revenueDetails: this.fb.array([] , Validators.required),
      });
     }

    CurrencyData:any=[];
    CostData:any=[];
    Cost2Data:any=[];
    DebitTypes:any=[];
    CreditTypes:any=[];
    DebitData:any=[];
    CreditData:any=[];
    TransferData:any=[];
    CardData:any=[];
    SalesmanData:any=[];
    EmployeeData:any=[];
    VatCategoryData:any=[];
    filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredDebitServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCreditServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredSalesmanServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredEmployeeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    searchingCost:boolean=false;
    searchingCost2:boolean=false;
    searchingDebit:boolean=false;
    searchingCredit:boolean=false;
    searchingSalesman:boolean=false;
    searchingEmployee:boolean=false;
    isEnglish:boolean=false;
    get revenueDetails() : FormArray {
      return this.RevenueForm.get("revenueDetails") as FormArray
    }


    searchCost(value :any){
      this.searchingCost=true;
      this._RevenueMultiService.GetCostCenters(value).subscribe(res=>{
        this.CostData=res;
        this.filteredCostCenterServerSide.next(  this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
        this.searchingCost=false;
      });
    }

    searchCost2(value :any){
      this.searchingCost2=true;
      this._RevenueMultiService.GetCostCenters(value).subscribe(res=>{
        this.Cost2Data=res;
        this.filteredCostCenter2ServerSide.next(  this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
        this.searchingCost2=false;
      });
    }

    searchDebit(value :any){
      var type=this.RevenueForm.get("n_source_debit")?.value;
      this.searchingDebit=true;
      this._RevenueMultiService.GetDebitItems(type, value).subscribe(res=>{
        this.DebitData=res;
        this.filteredDebitServerSide.next(  this.DebitData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
        this.searchingDebit=false;
      });
    }

    searchCredit(value :any){
      var type=this.RevenueForm.get("n_source_credit")?.value;
      this.searchingCredit=true;
      this._RevenueMultiService.GetCreditItems(type, value).subscribe(res=>{
        this.CreditData=res;
        this.filteredCreditServerSide.next(  this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
        this.searchingCredit=false;
      });
    }

    searchSalesman(value :any){
      this.searchingSalesman=true;
      this._RevenueMultiService.GetSalesMen(value).subscribe(res=>{
        this.SalesmanData=res;
        this.filteredSalesmanServerSide.next(  this.SalesmanData.filter(x => x.s_salesman_name.toLowerCase().indexOf(value) > -1));
        this.searchingSalesman=false;
      });
    }

    searchEmployee(value :any){
      this.searchingEmployee=true;
      this._RevenueMultiService.GetEmployees(value).subscribe(res=>{
        this.EmployeeData=res;
        this.filteredEmployeeServerSide.next(  this.EmployeeData.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
        this.searchingEmployee=false;
      });
    }

    getTypes(){
      this._RevenueMultiService.GetDebitTypes().subscribe(res=>{
        this.DebitTypes=res;
      });
      this._RevenueMultiService.GetCreditTypes().subscribe(res=>{
        this.CreditTypes=res;
      });
    }

    getCurrencies(){
      this._RevenueMultiService.GetCurrencies().subscribe(res=>{
        this.CurrencyData=res;
      });
    }

    getTransferTypes(){
      this._RevenueMultiService.GetTransferTypes().subscribe(res=>{
        this.TransferData=res;
      });
    }

    getCardTypes(){
      this._RevenueMultiService.GetCardTypes().subscribe(res=>{
        this.CardData=res;
      });
    }

    getVatCategories(){
      this._RevenueMultiService.GetVatCategory().subscribe(res=>{
        this.VatCategoryData=res;
      });
    }

    setMainCurrency(){
      this._RevenueMultiService.GetMainCurrency().subscribe(res=>{
        this.RevenueForm.get('n_currency_id')?.patchValue(res);
        this.mainCurrency=res;
      });
    }

    CheckIsMain(){
      if(this.RevenueForm.get('n_currency_id')?.value ==this.mainCurrency)
      {
        this.bisMainCurrency=false;
        this.RevenueForm.get('n_currency_coff')?.patchValue('');
      }
      else
        this.bisMainCurrency=true;
    }

    ChangeDebitItems(i:number)
    {
      var type=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value;
      var sourceType=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;

      this.searchingDebit=false;
      this._RevenueMultiService.GetDebitItems(type).subscribe(res=>{
        this.DebitData=res;
        this.filteredDebitServerSide.next(  this.DebitData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
      });
      if(sourceType==102)
        this.isBank=true;
      else
        this.isBank=false;

      if(sourceType==103)
        this.isTransfer=true;
      else
        this.isTransfer=false;

      if(sourceType==104)
        this.isCard=true;
      else
        this.isCard=false;

      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue('');
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue('');
    }

    ChangeCreditItems(i:number)
    {
      var type=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value;
      var sourceType=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;

      this.searchingCredit=false;
      this._RevenueMultiService.GetCreditItems(type, '').subscribe(res=>{
        this.CreditData=res;
        this.filteredCreditServerSide.next(  this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
      });

      if(sourceType==102)
        this.isBank2=true;
      else
        this.isBank2=false;

      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue('');
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue('');
    }


    LoadCostCenter1(i:number){

      const dialogRef = this.dialog.open(CostCentersLkpComponent, {
        width: '700px',
        height:'600px',
        data: {    }
      });

      dialogRef.afterClosed().subscribe(res => {
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
       });
    }

    LoadCostCenter2(i:number){

      const dialogRef = this.dialog.open(CostCentersLkpComponent, {
        width: '700px',
        height:'600px',
        data: {    }
      });

      dialogRef.afterClosed().subscribe(res => {
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
       });
    }

    ChangeDetailsCost1(i:number)
    {
      var costNo=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;

      this._RevenueMultiService.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
        }
        else
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.name);
      });
    }

    ChangeDetailsCost2(i:number)
    {
      var costNo=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;

      this._RevenueMultiService.GetCostName(costNo).subscribe(res=>{
        if(res==null)
        {
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
        }
        else
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.name);
      });
    }

    RemoveRevenueDetail(i:number) {
      this.revenueDetails.removeAt(i);
    }

    ChangeType(i:number){
      var type=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value;
      if(type=='1')
      {
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.enable();
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.disable();
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.patchValue('');
      }
      else if(type=='2')
      {
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.enable();
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.disable();
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.patchValue('');
      }
    }

    CheckIsTaxed(i){
      var debit=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value;
      var credit=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value;

      var isTaxed=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_tax_type')?.value;
      if(isTaxed=='1')
      {
        var value=(debit!='')?debit:credit;
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('b_has_tax')?.patchValue(true);
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue(value*.15);

      }
      else
      {
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('b_has_tax')?.patchValue(false);
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.patchValue('');
      }
      this.SetTotals(i);
    }

    TotalTaxed(i:number){
      this.SetTotals(i);
      this.CheckIsTaxed(i);
    }

    SetTotals(i:number){
      var debit=0, credit=0, tax=0;
      for (var i = 0; i < this.RevenueForm.value.revenueDetails.length;i++)
      {
        debit+=Number(((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value);
        credit+=Number(((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value);
        tax+=Number(((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.value);
      }
      this.RevenueForm.get('n_total_debit')?.patchValue(debit);
      this.RevenueForm.get('n_total_credit')?.patchValue(credit);
      this.RevenueForm.get('n_total_tax')?.patchValue(tax);
    }

    override ngOnInit(): void {
      this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
      this.DataAreaNo = Number(this.userservice.GetDataAreaID());
      this.searchCost('');
      this.searchCost2('');
      this.searchEmployee('');
      this.searchSalesman('');
      this.getCurrencies();
      this.getTypes();
      this.getTransferTypes();
      this.getCardTypes();
      this.getVatCategories();
      this.setMainCurrency();

      if(this.DocNo !=null && this.DocNo > 0 )
      {
        this.editMode=true;
          this.showspinner=true;
          this._RevenueMultiService.GetByID(this.DocNo,this.DataAreaNo).subscribe(data=>{
          this.RevenueForm.patchValue(data);
          this.RevenueForm.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
          if(data.d_due_date != "")
            this.RevenueForm.get("d_due_date")?.patchValue(new Date(Number(data.d_due_date.substring(0,4)), Number(data.d_due_date.substring(5,7))-1, Number(data.d_due_date.substring(8,10))));
          if(data.d_cheque_received_date !="")
            this.RevenueForm.get("d_cheque_received_date")?.patchValue(new Date(Number(data.d_cheque_received_date.substring(0,4)), Number(data.d_cheque_received_date.substring(5,7))-1, Number(data.d_cheque_received_date.substring(8,10))));
          if(data.d_credit_card_expiry_date !="")
            this.RevenueForm.get("d_credit_card_expiry_date")?.patchValue(new Date(Number(data.d_credit_card_expiry_date.substring(0,4)), Number(data.d_credit_card_expiry_date.substring(5,7))-1, Number(data.d_credit_card_expiry_date.substring(8,10))));


          data.fin_revenue_trans_detailsLst.forEach( (res) => {
            this.addRevenueDetails();
          });
          (this.RevenueForm.get("revenueDetails") as FormArray)?.patchValue(data.fin_revenue_trans_detailsLst);

          for (let i = 0; i < data.fin_revenue_trans_detailsLst.length; i++) {
            this.SetTotals(i);
            this.ChangeType(i);
            this.ChangeSource(i);
            if(data.fin_revenue_trans_detailsLst[i].n_source_id==102 && data.fin_revenue_trans_detailsLst[i].n_type==1)
              this.isBank=true;

            if(data.fin_revenue_trans_detailsLst[i].n_source_id==103)
              this.isTransfer=true;

            if(data.fin_revenue_trans_detailsLst[i].n_source_id==104)
              this.isCard=true;

            if(data.fin_revenue_trans_detailsLst[i].n_source_id==102 && data.fin_revenue_trans_detailsLst[i].n_type==2)
              this.isBank2=true;

          }

          this.CheckIsMain();
          this.showspinner=false;
        });
      }
      else
      {
        this.addRevenueDetails();
        this.addRevenueDetails();
      }
    this.isEnglish=LangSwitcher.CheckLan();
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    }

    invalidRow:string='';
    validateDetails():boolean{
      let i=0;
      let validrows : boolean=true;
      this.invalidRow='';
      for (let c of this.revenueDetails.controls) {
         if(((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value == '' )
         {
           ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_type')?.patchValue('bg-warning');
            validrows=false;
         }
         if(((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_source_id')?.value == '' )
         {
           ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_color')?.patchValue('bg-warning');
            validrows=false;
         }
         if(((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no')?.value == '' )
         {
           ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no_color')?.patchValue('bg-warning');
            validrows=false;
         }
         if((((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value =='' ||((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value =='0' )&& ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value == 1)
         {
           ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_debit_color')?.patchValue('bg-warning');
            validrows=false;
         }
         if((((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value ==''||((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value =='0') && ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value == 2)
         {
           ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_credit_color')?.patchValue('bg-warning');
            validrows=false;
         }
         if(((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value==''  || ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_source_id')?.value=='' || ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no')?.value =='')
         {
          this.invalidRow+=(i+1)+",";
         }
         i++;
      }
      this.invalidRow=this.invalidRow.slice(0, -1);
      return validrows;
    }


    save() {
      if(!this.validateDetails())
      {
        this.showspinner=false;
        if(this.isEnglish)
         this._notification.ShowMessage(`Please complete data at line ${this.invalidRow}`,3)
        else
        this._notification.ShowMessage('من فضلك اكمل ادخال بيانات الاصناف فى السطر رقم ' + this.invalidRow,3);
        return;
      }
      if(this.RevenueForm.value.n_total_debit != this.RevenueForm.value.n_total_credit )
      {
        if(this.isEnglish)
         this._notification.ShowMessage('the net debit must equal to net credit',3)
        else
        this._notification.ShowMessage('يجب ان يكون اجمالى المدين يساوى اجمالى الدائن',3);
        return;
      }
      this.showspinner=true;
      this.disableButtons();
      debugger;
      var formData: any = new FormData();
      this.RevenueForm.controls['n_doc_no'].enable();
      this.RevenueForm.value.d_doc_date=new DatePipe('en-US').transform(this.RevenueForm.value.d_doc_date, 'yyyy/MM/dd');
      if(this.RevenueForm.value.d_due_date != '')
        this.RevenueForm.value.d_due_date=new DatePipe('en-US').transform(this.RevenueForm.value.d_due_date, 'yyyy/MM/dd');
      if(this.RevenueForm.value.d_cheque_received_date != '')
        this.RevenueForm.value.d_cheque_received_date=new DatePipe('en-US').transform(this.RevenueForm.value.d_cheque_received_date, 'yyyy/MM/dd');
      if(this.RevenueForm.value.d_credit_card_expiry_date != '')
        this.RevenueForm.value.d_credit_card_expiry_date=new DatePipe('en-US').transform(this.RevenueForm.value.d_credit_card_expiry_date, 'yyyy/MM/dd');


      formData.append("n_doc_no", this.RevenueForm.value.n_doc_no ?? 0);
      formData.append("d_doc_date", this.RevenueForm.value.d_doc_date);
      formData.append("n_serial", this.RevenueForm.value.n_serial ?? 0);
      formData.append("n_salesman_id", this.RevenueForm.value.n_salesman_id ?? 0);
      formData.append("n_employee_id", this.RevenueForm.value.n_employee_id ?? 0);
      formData.append("s_book_doc_no", this.RevenueForm.value.s_book_doc_no);
      formData.append("n_currency_id", this.RevenueForm.value.n_currency_id ?? 0);
      formData.append("n_currency_coff", this.RevenueForm.value.n_currency_coff ?? 0);
      formData.append("s_description", this.RevenueForm.value.s_description);
      formData.append("s_description_eng", this.RevenueForm.value.s_description);
      formData.append("n_DataAreaID", this.RevenueForm.value.n_DataAreaID ?? 0);
      formData.append("n_UserAdd", this.RevenueForm.value.n_UserAdd ?? 0);
      formData.append("d_UserAddDate", this.RevenueForm.value.d_UserAddDate);

      formData.append("d_due_date", this.RevenueForm.value.d_due_date);
      formData.append("s_cheque_no", this.RevenueForm.value.s_cheque_no);
      formData.append("s_collection_bank", this.RevenueForm.value.s_collection_bank);
      formData.append("d_cheque_received_date", this.RevenueForm.value.d_cheque_received_date);
      formData.append("b_Cheque_Status", this.RevenueForm.value.b_Cheque_Status);
      formData.append("b_cheque_ReceiveDone", this.RevenueForm.value.b_cheque_ReceiveDone);
      formData.append("s_cheque_Benifer", this.RevenueForm.value.s_cheque_Benifer);
      formData.append("s_transfer_no", this.RevenueForm.value.s_transfer_no);
      formData.append("n_transferType", this.RevenueForm.value.n_transferType ?? 0);
      formData.append("s_IBAN", this.RevenueForm.value.s_IBAN);
      formData.append("s_SwiftCode", this.RevenueForm.value.s_SwiftCode);
      formData.append("s_TransferToAccount", this.RevenueForm.value.s_TransferToAccount);
      formData.append("s_Country", this.RevenueForm.value.s_Country);
      formData.append("sCity", this.RevenueForm.value.sCity);
      formData.append("sAddress", this.RevenueForm.value.sAddress);
      formData.append("n_bank_commission", this.RevenueForm.value.n_bank_commission ?? 0);
      formData.append("b_received", this.RevenueForm.value.b_received);
      formData.append("n_credit_card_type", this.RevenueForm.value.n_credit_card_type ?? 0);
      formData.append("s_credit_card_no", this.RevenueForm.value.s_credit_card_no);
      formData.append("s_credit_card_no_Auth", this.RevenueForm.value.s_credit_card_no_Auth);
      formData.append("d_credit_card_expiry_date", this.RevenueForm.value.d_credit_card_expiry_date);


      formData.append("fin_revenue_trans.fin_revenue_trans_detailsLst", this.RevenueForm.value.revenueDetails);
      for (var i = 0; i < this.RevenueForm.value.revenueDetails.length;i++)
      {
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.enable();
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('b_has_tax')?.enable();
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.enable();
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.enable();

        formData.append("fin_revenue_trans_detailsLst[" + i + "].nLineNo", this.RevenueForm.value.revenueDetails[i].nLineNo ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].n_source_id", this.RevenueForm.value.revenueDetails[i].n_source_id ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].s_source_no", this.RevenueForm.value.revenueDetails[i].s_source_no);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].n_debit", this.RevenueForm.value.revenueDetails[i].n_debit ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].n_credit", this.RevenueForm.value.revenueDetails[i].n_credit ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].n_tax_type", this.RevenueForm.value.revenueDetails[i].n_tax_type ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].b_has_tax", this.RevenueForm.value.revenueDetails[i].b_has_tax);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].n_sales_tax", this.RevenueForm.value.revenueDetails[i].n_sales_tax ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].n_tax_category", this.RevenueForm.value.revenueDetails[i].n_tax_category ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].n_discount", this.RevenueForm.value.revenueDetails[i].n_discount ?? 0);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].s_description", this.RevenueForm.value.revenueDetails[i].s_description);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].s_description_eng", this.RevenueForm.value.revenueDetails[i].s_description_eng);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].s_cost_center_id", this.RevenueForm.value.revenueDetails[i].s_cost_center_id);
        formData.append("fin_revenue_trans_detailsLst[" + i + "].s_cost_center_id2", this.RevenueForm.value.revenueDetails[i].s_cost_center_id2);

        if(this.RevenueForm.value.revenueDetails[i].n_debit=='' || this.RevenueForm.value.revenueDetails[i].n_debit==0)
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.disable();
        else
          ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.disable();

        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('b_has_tax')?.disable();
      }

      if(this.DocNo !=null && this.DocNo > 0 ){

        this._RevenueMultiService.SaveEdit(formData).subscribe(data=>{
          this.showspinner=false;
          this.enableButtons();
          if(this.isEnglish)
           this._notification.ShowMessage(data.Emsg,data.status)
          else
          this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){
            this._router.navigate(['/fin/revenuemultilist']);
          }
        });
      }
      else
      {
        this._RevenueMultiService.Save(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
         this._notification.ShowMessage(data.Emsg,data.status)
        else
        this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){
            this._router.navigate(['/fin/revenuemultilist']);
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


  JournalShow(){
    if(this.RevenueForm.get('s_source_debit')?.value=='')
    {
      if(this.isEnglish)
       this._notification.ShowMessage('Please choose the debit source ',3)
      else
      this. _notification.ShowMessage('اختر رقم جهة المدين من فضلك',3);
      return;
    }
    if(this.RevenueForm.get('s_source_credit')?.value=='')
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Please choose the credit source ',3)
    else
      this. _notification.ShowMessage('اختر رقم جهة الدائن من فضلك',3);
      return;
    }
    if(this.RevenueForm.get('n_total_value')?.value==0 ||this.RevenueForm.get('n_total_value')?.value=='')
    {
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert sum' ,3)
      else
      this. _notification.ShowMessage('ادخل مبلغ من فضلك',3);
      return;
    }
    var JournalID=0, edit=false;
    var savedJournals, currentJournals;
    var JournalType=51;
    var currency=this.RevenueForm.get('n_currency_id')?.value;
    var descAr=this.RevenueForm.get('s_description')?.value;
    var descEn='';
    var date=new DatePipe('en-US').transform(this.RevenueForm.value.d_doc_date, 'yyyy/MM/dd');
    $('#btnJournal').prop('disabled', true);

    if(this.DocNo !=null && this.DocNo > 0 ){
      edit=true;
      this._RevenueMultiService.GetJournalID(this.DocNo,JournalType).subscribe(res=>{
        JournalID=res;
        this._RevenueMultiService.GetSavedJournals(JournalID).subscribe(data=>{
          savedJournals=data;
          this._RevenueMultiService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
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
      this._RevenueMultiService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
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
    this.RevenueForm.controls['n_doc_no'].enable();
    this.RevenueForm.value.d_doc_date=new DatePipe('en-US').transform(this.RevenueForm.value.d_doc_date, 'yyyy/MM/dd');
    formData.append("n_doc_no", this.RevenueForm.value.n_doc_no ?? 0);
    formData.append("d_doc_date", this.RevenueForm.value.d_doc_date);
    formData.append("n_serial", this.RevenueForm.value.n_serial ?? 0);
    formData.append("n_currency_id", this.RevenueForm.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.RevenueForm.value.n_currency_coff ?? 0);
    formData.append("s_description", this.RevenueForm.value.s_description);
    formData.append("n_total_value", this.RevenueForm.value.n_total_value ?? 0);

    formData.append("fin_revenue_trans.fin_revenue_trans_detailsLst", this.RevenueForm.value.revenueDetails);
    for (var i = 0; i < this.RevenueForm.value.revenueDetails.length;i++)
    {
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_sales_tax')?.enable();
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('b_has_tax')?.enable();
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.enable();
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.enable();


      formData.append("fin_revenue_trans_detailsLst[" + i + "].nLineNo", this.RevenueForm.value.revenueDetails[i].nLineNo ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].n_source_id", this.RevenueForm.value.revenueDetails[i].n_source_id ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].s_source_no", this.RevenueForm.value.revenueDetails[i].s_source_no);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].n_debit", this.RevenueForm.value.revenueDetails[i].n_debit ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].n_credit", this.RevenueForm.value.revenueDetails[i].n_credit ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].n_tax_type", this.RevenueForm.value.revenueDetails[i].n_tax_type ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].b_has_tax", this.RevenueForm.value.revenueDetails[i].b_has_tax);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].n_sales_tax", this.RevenueForm.value.revenueDetails[i].n_sales_tax ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].n_tax_category", this.RevenueForm.value.revenueDetails[i].n_tax_category ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].n_discount", this.RevenueForm.value.revenueDetails[i].n_discount ?? 0);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].s_description", this.RevenueForm.value.revenueDetails[i].s_description);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].s_description_eng", this.RevenueForm.value.revenueDetails[i].s_description_eng);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].s_cost_center_id", this.RevenueForm.value.revenueDetails[i].s_cost_center_id);
      formData.append("fin_revenue_trans_detailsLst[" + i + "].s_cost_center_id2", this.RevenueForm.value.revenueDetails[i].s_cost_center_id2);

      if(this.RevenueForm.value.revenueDetails[i].n_debit=='' || this.RevenueForm.value.revenueDetails[i].n_debit==0)
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.disable();
      else
        ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.disable();

      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('b_has_tax')?.disable();
    }

    return formData;
  }


  addRevenueDetails() {
    this.revenueDetails.push(this.newRevenueDetails(this.revenueDetails.length+1));
  }

  newRevenueDetails(line:number=0): FormGroup {

    return this.fb.group({
      nLineNo:line,
      n_type:'',
      n_source_id:'',
      s_source_no:'',
      s_source_name:'',
      n_debit:new FormControl({value:"", disabled: true}),
      n_credit:new FormControl({value:"", disabled: true}),
      n_tax_type:'',
      b_has_tax: new FormControl({value:false, disabled: true}),
      n_sales_tax:'',
      n_tax_category:'',
      n_discount:'',
      s_description:'',
      s_description_eng:'',
      s_cost_center_id:'',
      s_cost_center_name:'',
      s_cost_center_id2:'',
      s_cost_center_name2:'',
      s_type:'',
      s_source_color:'',
      s_source_no_color:'',
      s_debit_color:'',
      s_credit_color:''
    })
 }

 LoadSources(i:number){
  var type=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value;
  var source=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;
  const dialogRef = this.dialog.open(SourceLkpComponent, {
    width: '700px',
    height:'600px',
    data: { type, source }
  });

  dialogRef.afterClosed().subscribe(res => {
    ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue(res.data.n_source_id);
    ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue(res.data.s_source_name);
   });
 }

 ChangeSource(i:number){
  var type=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_type')?.value;
  var source=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('n_source_id')?.value;
  var item=((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no')?.value;

  this._RevenueMultiService.GetSourceName(type,source,item).subscribe(res=>{
    if(res==null)
    {
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_no')?.patchValue('');
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue('');
    }
    else
    {
      ((this.RevenueForm.get("revenueDetails") as FormArray).at(i) as FormGroup).get('s_source_name')?.patchValue(res.name);
    }
  });

 }


}
