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
import { RevenueService } from 'src/app/Core/Api/FIN/revenue.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent extends BaseComponent implements OnInit{


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
    ,private _RevenueService : RevenueService
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
        d_doc_date:new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
        n_currency_id:new FormControl('', Validators.required),
        n_currency_coff:'',
        s_description:'',
        s_description_eng:'',
        n_total_value:new FormControl('', Validators.required),
        n_source_debit:new FormControl('', Validators.required),
        n_source_credit:new FormControl('', Validators.required),
        s_source_debit:new FormControl('', Validators.required),
        s_source_credit:new FormControl('', Validators.required),
        s_cost_center_id:'',
        s_cost_center_id2:'',
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
        n_current_year:''
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
    filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredDebitServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCreditServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    searchingCost:boolean=false;
    searchingCost2:boolean=false;
    searchingDebit:boolean=false;
    searchingCredit:boolean=false;
    isEnglish:boolean=false;

    searchCost(value :any){
      this.searchingCost=true;
      this._RevenueService.GetCostCenters(value).subscribe(res=>{
        this.CostData=res;
        this.filteredCostCenterServerSide.next(  this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
        this.searchingCost=false;
      });
    }

    searchCost2(value :any){
      this.searchingCost2=true;
      this._RevenueService.GetCostCenters(value).subscribe(res=>{
        this.Cost2Data=res;
        this.filteredCostCenter2ServerSide.next(  this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
        this.searchingCost2=false;
      });
    }

    searchDebit(value :any){
      var type=this.RevenueForm.get("n_source_debit")?.value;
      this.searchingDebit=true;
      this._RevenueService.GetDebitItems(type, value).subscribe(res=>{
        this.DebitData=res;
        this.filteredDebitServerSide.next(  this.DebitData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
        this.searchingDebit=false;
      });
    }

    searchCredit(value :any){
      var type=this.RevenueForm.get("n_source_credit")?.value;
      this.searchingCredit=true;
      this._RevenueService.GetCreditItems(type, value).subscribe(res=>{
        this.CreditData=res;
        this.filteredCreditServerSide.next(  this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf(value) > -1));
        this.searchingCredit=false;
      });
    }

    getTypes(){
      this._RevenueService.GetDebitTypes().subscribe(res=>{
        this.DebitTypes=res;
      });
      this._RevenueService.GetCreditTypes().subscribe(res=>{
        this.CreditTypes=res;
      });
    }

    getCurrencies(){
      this._RevenueService.GetCurrencies().subscribe(res=>{
        this.CurrencyData=res;
      });
    }

    getTransferTypes(){
      this._RevenueService.GetTransferTypes().subscribe(res=>{
        this.TransferData=res;
      });
    }

    getCardTypes(){
      this._RevenueService.GetCardTypes().subscribe(res=>{
        this.CardData=res;
      });
    }

    setMainCurrency(){
      this._RevenueService.GetMainCurrency().subscribe(res=>{
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

    ChangeDebitItems()
    {
      var type=this.RevenueForm.get("n_source_debit")?.value;
      this.searchingDebit=false;
      this._RevenueService.GetDebitItems(type).subscribe(res=>{
        this.DebitData=res;
        this.filteredDebitServerSide.next(  this.DebitData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
      });
      if(type==102)
        this.isBank=true;
      else
        this.isBank=false;

      if(type==103)
        this.isTransfer=true;
      else
        this.isTransfer=false;

      if(type==104)
        this.isCard=true;
      else
        this.isCard=false;
    }

    ChangeCreditItems()
    {
      var type=this.RevenueForm.get("n_source_credit")?.value;
      this.searchingCredit=false;
      this._RevenueService.GetCreditItems(type, '').subscribe(res=>{
        this.CreditData=res;
        this.filteredCreditServerSide.next(  this.CreditData.filter(x => x.s_source_name.toLowerCase().indexOf('') > -1));
      });

      if(type==102)
        this.isBank2=true;
      else
        this.isBank2=false;
    }


    override ngOnInit(): void {
      this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
      this.DataAreaNo = Number(this.userservice.GetDataAreaID());
      this.searchCost('');
      this.searchCost2('');
      this.getCurrencies();
      this.getTypes();
      this.getTransferTypes();
      this.getCardTypes();
      this.setMainCurrency();
      
      if(this.DocNo !=null && this.DocNo > 0 )
      {
        this.editMode=true;
        this.showspinner=true;
        this._RevenueService.GetByID(this.DocNo).subscribe(data=>{  

          if(data.n_source_debit==102)
            this.isBank=true;
    
          if(data.n_source_debit==103)
            this.isTransfer=true;
    
          if(data.n_source_debit==104)
            this.isCard=true;

          if(data.n_source_credit==102)
            this.isBank2=true;

          this.RevenueForm.patchValue(data);
          this.RevenueForm.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));

          this.ChangeCreditItems();
          this.ChangeDebitItems();

          if(data.d_due_date != "")
            this.RevenueForm.get("d_due_date")?.patchValue(new Date(Number(data.d_due_date.substring(0,4)), Number(data.d_due_date.substring(5,7))-1, Number(data.d_due_date.substring(8,10))));
          if(data.d_cheque_received_date !="")
            this.RevenueForm.get("d_cheque_received_date")?.patchValue(new Date(Number(data.d_cheque_received_date.substring(0,4)), Number(data.d_cheque_received_date.substring(5,7))-1, Number(data.d_cheque_received_date.substring(8,10))));
          if(data.d_credit_card_expiry_date !="")
            this.RevenueForm.get("d_credit_card_expiry_date")?.patchValue(new Date(Number(data.d_credit_card_expiry_date.substring(0,4)), Number(data.d_credit_card_expiry_date.substring(5,7))-1, Number(data.d_credit_card_expiry_date.substring(8,10))));


          if(data.n_source_debit==3)
            this.RevenueForm.controls['s_source_debit'].setValue(data.s_source_debit);
          else
            this.RevenueForm.controls['s_source_debit'].setValue(Number(data.s_source_debit));

          if(data.n_source_credit==3)
            this.RevenueForm.controls['s_source_credit'].setValue(data.s_source_credit);
          else
            this.RevenueForm.controls['s_source_credit'].setValue(Number(data.s_source_credit));


          this.CheckIsMain();
          this.showspinner=false;
          
        });
      }
     LangSwitcher.translatefun();
     
      
      this.isEnglish=LangSwitcher.CheckLan();
    }


    save() {
      this.showspinner=true;
      this.disableButtons();

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
      formData.append("n_currency_id", this.RevenueForm.value.n_currency_id ?? 0);
      formData.append("n_currency_coff", this.RevenueForm.value.n_currency_coff ?? 0);
      formData.append("s_description", this.RevenueForm.value.s_description);
      formData.append("n_total_value", this.RevenueForm.value.n_total_value ?? 0);
      formData.append("n_source_debit", this.RevenueForm.value.n_source_debit ?? 0);
      formData.append("n_source_credit", this.RevenueForm.value.n_source_credit ?? 0);
      formData.append("s_source_debit", this.RevenueForm.value.s_source_debit);
      formData.append("s_source_credit", this.RevenueForm.value.s_source_credit);
      formData.append("s_cost_center_id", this.RevenueForm.value.s_cost_center_id);
      formData.append("s_cost_center_id2", this.RevenueForm.value.s_cost_center_id2);
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

      if(this.DocNo !=null && this.DocNo > 0 ){

        this._RevenueService.SaveEdit(formData).subscribe(data=>{
          this.showspinner=false;
          this.enableButtons();
          if(this.isEnglish)
          this._notification.ShowMessage(data.Emsg,data.status)
        else
          this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){
            this._router.navigate(['/fin/revenuelist']);
          }
        });
      }
      else
      {
        this._RevenueService.Save(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
        this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){
            this._router.navigate(['/fin/revenuelist']);
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
      this._notification.ShowMessage('Please choose the debit source',3)
    else
      this. _notification.ShowMessage('اختر رقم جهة المدين من فضلك',3);
      return;
    }
    if(this.RevenueForm.get('s_source_credit')?.value=='')
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Please choose the credit source',3)
    else
      this. _notification.ShowMessage('اختر رقم جهة الدائن من فضلك',3);
      return;
    }
    if(this.RevenueForm.get('n_total_value')?.value==0 ||this.RevenueForm.get('n_total_value')?.value=='')
    {
      if(this.isEnglish)
       this._notification.ShowMessage("Please insert the sum",3)
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
      this._RevenueService.GetJournalID(this.DocNo,JournalType).subscribe(res=>{
        JournalID=res;
        this._RevenueService.GetSavedJournals(JournalID).subscribe(data=>{
          savedJournals=data;
          this._RevenueService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
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
      this._RevenueService.GetCurrentJournals(this.SetJournalData()).subscribe(current=>{
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
    formData.append("n_source_debit", this.RevenueForm.value.n_source_debit ?? 0);
    formData.append("n_source_credit", this.RevenueForm.value.n_source_credit ?? 0);
    formData.append("s_source_debit", this.RevenueForm.value.s_source_debit);
    formData.append("s_source_credit", this.RevenueForm.value.s_source_credit);

    return formData;
  }
 

}
