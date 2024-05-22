import { Component, OnInit, Input,Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from 'src/app/Core/Api/GL/journal.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
declare var $: any;

@Component({
  selector: 'app-trans-journals',
  templateUrl: './trans-journals.component.html',
  styleUrls: ['./trans-journals.component.css']
})

export class TransJournalsComponent  implements OnInit {

  journalsType:any=[];
  currencyType:any=[];
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_doc_no";
  formID:any=109;
  lang:any;
  n_doc_no:any;
  
  searchJournal(value :any ){
    this._JournalService.GetAllJournalsLkp().subscribe(res=>{
      this.journalsType=res;
    });
  }

  searchCurrency(value :any ){
    this._JournalService.GetCurrencyLkp().subscribe(res=>{
      this.currencyType=res;
    });
  }


  dtOptions: DataTables.Settings = {};
  JournalForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  postStatus:boolean=false;
  isEnglish:boolean=false
  constructor(public dialogRef: MatDialogRef<TransJournalsComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, private fb:FormBuilder
    ,private _JournalService : JournalService
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private userservice:UserService) {

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers',
        pageLength: 2,
        processing: true

      };

      this.JournalForm = this.fb.group({
        n_doc_no: '',
        d_doc_date: new FormControl('', Validators.required),
        n_currency_id: new FormControl('', Validators.required),
        n_journal_id: new FormControl('', Validators.required),
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
        n_total_debit1: '',
        n_total_credit1: '',
        n_difference1:'',
        currentDetails: this.fb.array([] , Validators.required),
        savedDetails: this.fb.array([] , Validators.required)
      });
     }

    get currentDetails() : FormArray {
      return this.JournalForm.get("currentDetails") as FormArray
    }

    get savedDetails() : FormArray {
      return this.JournalForm.get("savedDetails") as FormArray
    }

    _currentAccountIndex:number=0;
    _currentCostCenterIndex:number=0;

    addCurrentDetails() {
      this.currentDetails.push(this.newCurrentDetails(this.currentDetails.length+1));
    }

    newCurrentDetails(line:number=0): FormGroup {
      return this.fb.group({
        n_doc_serial:line,
        s_account_no:'',
        s_account_name:'',
        n_debit:'',
        n_credit:'',
        s_cost_center_id:'',
        s_cost_center_name:'',
        s_detailed_arabic_description:''
      })
   }

  addSavedDetails() {
    this.savedDetails.push(this.newSavedDetails(this.savedDetails.length+1));
  }

  newSavedDetails(line:number=0): FormGroup {
    return this.fb.group({
      n_doc_serial:line,
      s_account_no:'',
      s_account_name:'',
      n_debit:'',
      n_credit:'',
      s_cost_center_id:'',
      s_cost_center_name:'',
      s_detailed_arabic_description:''
    })
 }

    calcCurrentTotals(){
      debugger;
      let index:any=0;
      let totalDebit:number=0;
      let totalCredit:number=0;
      let totalDifference:number=0;
      for (let c of this.currentDetails?.controls) {
          totalDebit +=this.JournalForm.value.currentDetails[index].n_debit;
          totalCredit +=this.JournalForm.value.currentDetails[index].n_credit;
          index++;
      }
      totalDifference=totalDebit-totalCredit;
      (this.JournalForm.get("n_total_debit1"))?.patchValue(totalDebit);
      (this.JournalForm.get("n_total_credit1"))?.patchValue(totalCredit);
      (this.JournalForm.get("n_difference1"))?.patchValue(totalDifference);
    }

    calcSavedTotals(){
      debugger;
      let index:any=0;
      let totalDebit:number=0;
      let totalCredit:number=0;
      let totalDifference:number=0;
      for (let c of this.savedDetails?.controls) {
          totalDebit +=this.JournalForm.value.savedDetails[index].n_debit;
          totalCredit +=this.JournalForm.value.savedDetails[index].n_credit;
          index++;
      }
      totalDifference=totalDebit-totalCredit;
      (this.JournalForm.get("n_total_debit"))?.patchValue(totalDebit);
      (this.JournalForm.get("n_total_credit"))?.patchValue(totalCredit);
      (this.JournalForm.get("n_difference"))?.patchValue(totalDifference);

    }

    ngOnInit(): void {
      this.ReportUrl=ApiConfig.ReportUrl;
      this.lang=this.userservice.GetLanguage();
      this.comp=this.userservice.GetComp();
      this.year=this.userservice.GetYear();
      this.branch=this.userservice.GetBranch();
      this.n_doc_no=this.data.JournalID;
      
      this.searchJournal('');
      this.searchCurrency('');
      debugger
      this.JournalForm.get('n_doc_no')?.patchValue(this.data.JournalID);
      this.JournalForm.get('d_doc_date')?.patchValue(new Date(Number(this.data.date.substring(0,4)), Number(this.data.date.substring(5,7))-1, Number(this.data.date.substring(8,10))));
      this.JournalForm.get('n_journal_id')?.patchValue(this.data.JournalType);
      this.JournalForm.get('n_currency_id')?.patchValue(this.data.currency);
      this.JournalForm.get('s_arabic_description')?.patchValue(this.data.descAr);
      this.JournalForm.get('s_english_description')?.patchValue(this.data.descEn);

      this.JournalForm.get('n_doc_no')?.disable();
      this.JournalForm.get('d_doc_date')?.disable();
      this.JournalForm.get('n_journal_id')?.disable();
      this.JournalForm.get('n_currency_id')?.disable();
      this.JournalForm.get('s_arabic_description')?.disable();
      this.JournalForm.get('s_english_description')?.disable();
      if(this.data.edit)
      {
        this.data.savedJournals.journalDetails.forEach( (res) => {
          this.addSavedDetails();
        });
        (this.JournalForm.get("savedDetails") as FormArray)?.patchValue(this.data.savedJournals.journalDetails);
        this.calcSavedTotals();
        if(this.data.savedJournals.b_posted==true)
          this.postStatus=true;
      }
      this.data.currentJournals.journalDetails.forEach( (res) => {
        this.addCurrentDetails();
      });
      (this.JournalForm.get("currentDetails") as FormArray)?.patchValue(this.data.currentJournals.journalDetails);
      this.calcCurrentTotals();
      LangSwitcher.translatefun();
      this.isEnglish=LangSwitcher.CheckLan();
      LangSwitcher.translateData(2);
    }

    disableButtons() {
      debugger;
      $(':button').prop('disabled', true);
      $("input[type=button]").attr("disabled", "disabled");
    }

    enableButtons() {
      $(':button').prop('disabled', false);
      $('input[type=button]').removeAttr("disabled");
    }
    
    UnPost(){
      var docNo=this.JournalForm.get('n_doc_no')?.value;
      this._JournalService.UnPost(docNo).subscribe(data=>{
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this.postStatus=false
        }
      });
    }

    Post(){
      var docNo=this.JournalForm.get('n_doc_no')?.value;
      this._JournalService.Post(docNo).subscribe(data=>{
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this.postStatus=true;
        }
      });
    }

  }
