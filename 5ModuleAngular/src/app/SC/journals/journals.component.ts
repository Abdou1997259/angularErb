import { Component, OnInit,Input, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from 'src/app/Core/Api/GL/journal.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JournalTypesLookupComponent } from 'src/app/Controls/journal-types-lookup/journal-types-lookup.component';
import { CurrencyLookupComponent } from 'src/app/Controls/currency-lookup/currency-lookup.component';
import { ReplaySubject } from 'rxjs';
import { AccountsLookupComponent } from 'src/app/Controls/accounts-lookup/accounts-lookup.component';
import { CostcentersLookupComponent } from 'src/app/Controls/costcenters-lookup/costcenters-lookup.component';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

declare var $: any;

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.css']
})

export class JournalsComponent  extends BaseComponent implements OnInit ,OnDestroy {

  filteredJournalServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCurrencyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  searchingJournal:boolean=false;
  searchingCurrency:boolean=false;
  journalsType:any=[];
  currencyType:any=[];
  AccountCostType:number=0;
  isEnglish:boolean=false;
 searchJournal(value :any ){
  this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
  this.searchingJournal=true;
  if(this.DocNo !=null && this.DocNo > 0 ){
    this._JournalService.GetAllJournalsLkp().subscribe(res=>{
      this.journalsType=res;
      this.filteredJournalServerSide.next(  this.journalsType.filter(x => x.s_journal_name.toLowerCase().indexOf(value) > -1));
    })
  }
  else{
    this._JournalService.GetJournalsLkp().subscribe(res=>{
      this.journalsType=res;
      this.filteredJournalServerSide.next(  this.journalsType.filter(x => x.s_journal_name.toLowerCase().indexOf(value) > -1));
    })
  }
  this.searchingJournal=false;
 }

 searchCurrency(value :any ){
  this.searchingCurrency=true;
  this._JournalService.GetCurrencyLkp().subscribe(res=>{
    this.currencyType=res;
    this.filteredCurrencyServerSide.next(  this.currencyType.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
    this.searchingCurrency=false;
  })
}


  dtOptions: DataTables.Settings = {};
  JournalForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  constructor(private fb:FormBuilder
    ,private _JournalService : JournalService
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

      this.JournalForm = this.fb.group({
        n_doc_no: '',
        d_doc_date: '',
        n_currency_id: '',
        n_journal_id: '',
        s_journal_name:'',
        s_currency_name:'',
        s_arabic_description:'',
        s_english_description: '',
        n_doc_trans_no: '',
        s_book_doc_no: '',
        n_document_no:'',
        n_total_debit: '',
        n_total_credit: '',
        n_difference:'',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',
        journalDetails: this.fb.array([] , Validators.required)
      });
     }

     showspinner:boolean=false;
     currentId:any;
     _currentAccountIndex:number=0;
     _currentCostCenterIndex:number=0;
     @Input() accountNo1!:number;
     @Input() accountNo2!:number;
     @Input() accountName1!:string;
     @Input() accountName2!:string;
     @Input() Credit1!:number;
     @Input() Credit2!:number;
     @Input() Debit1!:number;
     @Input() Debit2!:number;
     @Input() History!:string;
     @Input() Docmented!:string;
     @Input() Currency!:string ;
     @Input() descArab!:string;
     @Input() descEng!:string;
     @Output() eventEmitter:EventEmitter<FormGroup>=new EventEmitter<FormGroup>;

     eventEmitterFunction()
     {
      debugger
      this.eventEmitter.emit(this.JournalForm)
     }





     ngOnChanges(changes: SimpleChanges)
     {

      this.JournalForm.get("s_currency_name")?.patchValue(this.Currency);

     }
     ngOnDestroy()
     {
      debugger;
       this.eventEmitterFunction();
     }

     override ngOnInit(): void {
      this.searchJournal('');
      this.searchCurrency('');
      // this.currentType= this._activatedRoute.snapshot.paramMap.get('typeid');
      // this.currentCurrency= this._activatedRoute.snapshot.paramMap.get('currencyid');





      this.addJournalDetails();
      this.addJournalDetails();
      let curr_dt=new Date(this.History);
      let date=curr_dt.getFullYear() + "-" + (curr_dt.getMonth() + 1) + "-" + curr_dt.getDate() +"" 
       this.JournalForm.get("d_doc_date")?.patchValue(date);
       this.JournalForm.get("s_arabic_description")?.patchValue(this.descArab);
      this.JournalForm.get("s_english_description")?.patchValue(this.descEng);


       debugger;
      ((this.JournalForm.get("journalDetails") as FormArray).at(0) as FormGroup).get("s_account_no")?.patchValue(this.accountNo1);
      ((this.JournalForm.get("journalDetails") as FormArray).at(0) as FormGroup).get("s_account_name")?.patchValue(this.accountName1);
      ((this.JournalForm.get("journalDetails") as FormArray).at(0) as FormGroup).get("n_debit")?.patchValue(this.Debit1);
      ((this.JournalForm.get("journalDetails") as FormArray).at(0) as FormGroup).get("n_credit")?.patchValue(this.Credit1);
      ((this.JournalForm.get("journalDetails") as FormArray).at(1) as FormGroup).get("s_account_no")?.patchValue(this.accountNo2);
      ((this.JournalForm.get("journalDetails") as FormArray).at(1) as FormGroup).get("s_account_name")?.patchValue(this.accountName2);
      ((this.JournalForm.get("journalDetails") as FormArray).at(1) as FormGroup).get("n_debit")?.patchValue(this.Debit2);
      ((this.JournalForm.get("journalDetails") as FormArray).at(1) as FormGroup).get("n_credit")?.patchValue(this.Credit2);



      LangSwitcher.translateData(1);
      LangSwitcher.translatefun();
      
    }



     get journalDetails() : FormArray {
      return this.JournalForm.get("journalDetails") as FormArray
    }









    addJournalDetails() {
      this.journalDetails.push(this.newJournalsdetails(this.journalDetails.length+1));
    }

    newJournalsdetails(line:number=0): FormGroup {

      return this.fb.group({
        n_doc_serial:line,
        s_account_no:'',
        s_account_name:'',
        n_debit:0,
        n_credit:0,
        s_cost_center_id:'',
        s_cost_center_name:'',
        s_detailed_arabic_description:''
      })
   }

  invalidAccountNo:string='';
  invalidCostNo:string='';
  invalidAmountNo:string='';






    save() {


    }











    DocNo : any;





}
