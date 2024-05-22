import { Component, OnInit } from '@angular/core';
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

declare var $: any;

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.css']
})

export class JournalsComponent  extends BaseComponent implements OnInit {

  filteredJournalServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCurrencyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  searchingJournal:boolean=false;
  searchingCurrency:boolean=false;
  journalsType:any=[];
  currencyType:any=[];
  AccountCostType:number=0;
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
    //  currentType:any;
    //  currentCurrency:any;

     get journalDetails() : FormArray {
      return this.JournalForm.get("journalDetails") as FormArray
    }

    //  LoadTypes(){
    //   const dialogRef = this.dialog.open(JournalTypesLookupComponent, {
    //     width: '700px',
    //     height:'600px',
    //     data: {    }
    //   });
    //   dialogRef.afterClosed().subscribe(res => {
    //     this.currentType = res.data.n_journal_id;
    //     (this.JournalForm.get("n_journal_id"))?.patchValue(res.data.n_journal_id );
    //     (this.JournalForm.get("s_journal_name"))?.patchValue(res.data.n_journal_id +'-'+ res.data.s_journal_name);

    //     });
    // }

    // LoadCurrency(){
    //   const dialogRef = this.dialog.open(CurrencyLookupComponent, {
    //     width: '700px',
    //     height:'600px',
    //     data: {    }
    //   });
    //   dialogRef.afterClosed().subscribe(res => {
    //      this.currentCurrency = res.data.n_currency_id;
    //     (this.JournalForm.get("n_currency_id"))?.patchValue(res.data.n_currency_id );
    //     (this.JournalForm.get("s_currency_name"))?.patchValue(res.data.n_currency_id +'-'+ res.data.s_currency_name);

    //     });
    // }

    _currentAccountIndex:number=0;
    _currentCostCenterIndex:number=0;
    LoadAccounts(i:number){
     // $('#ItemModal').modal('toggle');
     const dialogRef = this.dialog.open(AccountsLookupComponent, {
       width: '700px',
       height:'600px',
       data: {    }
     });
     dialogRef.afterClosed().subscribe(res => {

       ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_no')?.patchValue(res.data.s_account_no);
       ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_name')?.patchValue(res.data.s_account_name);

       ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
       ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');

       this._JournalService.GetAccountCostType(res.data.s_account_no).subscribe(data=>{
        this.AccountCostType=data.n_account_allocat;
        this._JournalService.CurrentAccount=res.data.s_account_no;
        debugger;
        if(this.AccountCostType==1)
        {
          ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.disable();
          ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.disable();
        }
        else if(this.AccountCostType==2 || this.AccountCostType==3 || this.AccountCostType==4)
        {
          this._JournalService.GetCostCenter(res.data.s_account_no).subscribe(dataCost=>{
            debugger;
            ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.enable();

            ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(dataCost.s_cost_center_id);
            ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(dataCost.s_cost_center_name);

            if(this.AccountCostType==2 || this.AccountCostType==4)
            {
              ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.disable();
              ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.disable();
            }
          });
        }
        else
        {
          ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.disable();
          ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.disable();
        }

      });

         //this.calctotal();
      });

   }

   LoadCostCenters(i:number){
    if(((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_no')?.value=='')
    {
      this._notification.ShowMessage('اختر حساب اولا',3);
      return;
    }

     this._currentCostCenterIndex=i;
     this._JournalService.CurrentAccount=((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_account_no')?.value;

     const dialogRef = this.dialog.open(CostcentersLookupComponent, {
       width: '700px',
       height:'600px',
       data: {    }
     });

     dialogRef.afterClosed().subscribe(res => {
       ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
       ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
      });
   }


    removeJournalDetails(i:number) {
      debugger;
      if(this.journalDetails.length==2)
      {
        this._notification.ShowMessage('يجب ان يحتوى القيد على سطرين على الاقل',2);
        return;
      }
      else
      {
        this.journalDetails.removeAt(i);
        this.calcTotals();
      }
    }


    addJournalDetails() {
      this.journalDetails.push(this.newJournalsdetails(this.journalDetails.length+1));
    }

    newJournalsdetails(line:number=0): FormGroup {

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

  invalidAccountNo:string='';
  invalidCostNo:string='';
  invalidAmountNo:string='';

   validateAccountDetails():boolean{
    let i=0;
    let validrows : boolean=true;
    this.invalidAccountNo='';
    for (let c of this.journalDetails.controls) {
       if(((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_no')?.value=='')
       {
         ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_color')?.patchValue('bg-warning');
          validrows=false;
          this.invalidAccountNo+=(i+1)+" ";
       }
       i++;
    }
    return validrows;
  }

    validateCostDetails():boolean{
      let i=0;
      let validCost : boolean=true;
      this.invalidCostNo='';
      for (let c of this.journalDetails.controls) {
         if(((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value=='' &&((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.enabled==true)
         {
            validCost=false;
            this.invalidCostNo+=(i+1)+" ";
         }
         i++;
      }
      return validCost;
   }

   validateDetails():boolean{
    let i=0;
    let Amount : boolean=true;
    this.invalidAmountNo='';
    for (let c of this.journalDetails.controls) {
       if(( ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value==0 && ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value==0) || ( ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value==0 && ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value==''  ) || (((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value=='' && ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value==0))
       {
          Amount=false;
          this.invalidAmountNo+=(i+1)+" ";
       }
       i++;
    }
    return Amount;
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

    save() {
      debugger;

       if(!this.validateAccountDetails())
       {
         this.showspinner=false;
         this. _notification.ShowMessage('من فضلك اختر الحساب فى السطور رقم ' + this.invalidAccountNo,3);
         return;
       }

       if(!this.validateCostDetails())
       {
         this.showspinner=false;
         this. _notification.ShowMessage('من فضلك اختر مركز التكلفة فى السطور رقم ' + this.invalidCostNo,3);
         return;
       }

       if(!this.validateDetails())
       {
         this.showspinner=false;
         this. _notification.ShowMessage('السطور رقم ' + this.invalidAmountNo + "تحتوى على قيم فارغة فى المدين والدائن",3);
         return;
       }

       if( (this.JournalForm.get("n_difference"))?.value!=0)
       {
         this.showspinner=false;
         this. _notification.ShowMessage('القيد غير متزن',3);
         return;
       }

       if((this.JournalForm.get("n_total_debit"))?.value<=0 )
       {
        this.showspinner=false;
        this. _notification.ShowMessage('ادخل قيم مناسبة فى جهة المدين',3);
        return;
       }
       if((this.JournalForm.get("n_total_credit"))?.value<=0 )
       {
        this.showspinner=false;
        this. _notification.ShowMessage('ادخل قيم مناسبة فى جهة الدائن',3);
        return;
       }


      this.showspinner=true;
      this.disableButtons();

      var formData: any = new FormData();
        this.JournalForm.controls['n_journal_id'].enable();
        this.JournalForm.controls['n_currency_id'].enable();
        this.JournalForm.value.d_doc_date=new DatePipe('en-US').transform(this.JournalForm.value.d_doc_date, 'yyyy/MM/dd');
        formData.append("n_doc_no", this.JournalForm.value.n_doc_no ?? 0);
        formData.append("d_doc_date", this.JournalForm.value.d_doc_date);
        formData.append("n_journal_id", this.JournalForm.value.n_journal_id ?? 0);
        formData.append("n_currency_id", this.JournalForm.value.n_currency_id ?? 0);
        formData.append("s_arabic_description", this.JournalForm.value.s_arabic_description);
        formData.append("s_english_description", this.JournalForm.value.s_english_description);
        formData.append("n_doc_trans_no", this.JournalForm.value.n_doc_trans_no ?? 0);
        formData.append("s_book_doc_no", this.JournalForm.value.s_book_doc_no);
        formData.append("n_document_no", this.JournalForm.value.n_document_no ?? 0);
        formData.append("n_DataAreaID", this.JournalForm.value.n_DataAreaID ?? 0);
        formData.append("n_UserAdd", this.JournalForm.value.n_UserAdd ?? 0);
        formData.append("d_UserAddDate", this.JournalForm.value.d_UserAddDate);

        //formData.append("n_logged_user", this.userservice.GetUserID());
        // formData.append("n_current_branch", this.userservice.GetBranch());
        // formData.append("n_current_company", this.userservice.GetComp());
        // formData.append("n_current_year", this.userservice.GetYear());
        // formData.append("comp", this.userservice.GetComp());
        // formData.append("year", this.userservice.GetYear());

        formData.append("gl_journal_main.journal_detailsLst", this.JournalForm.value.journalDetails);
        for (var i = 0; i < this.JournalForm.value.journalDetails.length;i++)
        {
          ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.enable();

          formData.append("journal_detailsLst[" + i + "].n_doc_serial", this.JournalForm.value.journalDetails[i].n_doc_serial ?? 0);
          formData.append("journal_detailsLst[" + i + "].s_account_no", this.JournalForm.value.journalDetails[i].s_account_no);
          formData.append("journal_detailsLst[" + i + "].n_debit", this.JournalForm.value.journalDetails[i].n_debit ?? 0);
          formData.append("journal_detailsLst[" + i + "].n_credit", this.JournalForm.value.journalDetails[i].n_credit ?? 0);
          formData.append("journal_detailsLst[" + i + "].s_cost_center", this.JournalForm.value.journalDetails[i].s_cost_center_id);
          formData.append("journal_detailsLst[" + i + "].s_detailed_arabic_description", this.JournalForm.value.journalDetails[i].s_detailed_arabic_description);
        }
        if(this.DocNo !=null && this.DocNo > 0 ){

          this._JournalService.SaveEditJournal(formData).subscribe(data=>{
            debugger;
            this.showspinner=false;
            this.enableButtons();
            this. _notification.ShowMessage(data.msg,data.status);
            if(data.status==1){
              this._router.navigate(['/gl/journalslist']);
            }
          });
        }
        else
        {
          this._JournalService.SaveJournal(formData).subscribe(data=>{
          debugger;
          this.showspinner=false;
          this.enableButtons();
          this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){

            this._router.navigate(['/gl/journalslist']);
            this.JournalForm = this.fb.group({
              n_doc_no: 0,
              d_doc_date: new FormControl(new Date(), Validators.required),
              n_currency_id: new FormControl('', Validators.required),
              n_journal_id: new FormControl('', Validators.required),
              s_arabic_description:'',
              s_english_description: '',
              n_doc_trans_no: '',
              s_book_doc_no: '',
              n_document_no:'',
              n_total_debit: '',
              n_total_credit:'',
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
      });
    }

    }




    calcTotals(){
      debugger;
      let index:any=0;
      let totalDebit:number=0;
      let totalCredit:number=0;
      let totalDifference:number=0;
      for (let c of this.journalDetails?.controls) {
          totalDebit +=this.JournalForm.value.journalDetails[index].n_debit;
          totalCredit +=this.JournalForm.value.journalDetails[index].n_credit;
          index++;
      }
      totalDifference=totalDebit-totalCredit;
      (this.JournalForm.get("n_total_debit"))?.patchValue(totalDebit);
      (this.JournalForm.get("n_total_credit"))?.patchValue(totalCredit);
      (this.JournalForm.get("n_difference"))?.patchValue(totalDifference);

    }

    calcDedit(i : number){
    debugger;
    var abs=Math.abs(((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.value);
    ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.patchValue(abs);
    let index:any=0;
    for (let c of this.journalDetails?.controls) {
      if(i == index)
      {
        ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.patchValue(0);
        this.calcTotals();
        return;
      }
      index++;
    }
    this.calcTotals();
  }

  calcCredit(i : number){
    var abs=Math.abs(((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.value);
    ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_credit')?.patchValue(abs);

    debugger;
    let index:any=0;
    for (let c of this.journalDetails?.controls) {
      if(i == index)
      {
        ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('n_debit')?.patchValue(0);
        this.calcTotals();
        return;
      }
      index++;
    }
    this.calcTotals();

  }

  ChangeAccount(i:number)
  {
    // ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_account_no')?.patchValue('');
    // ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_account_name')?.patchValue('');

    // ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_cost_center_id')?.patchValue('');
    // ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_cost_center_name')?.patchValue('');

    var accNo=((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_no')?.value;

    this._JournalService.GetAccountName(accNo).subscribe(res=>{
      debugger;
      if(res==null)
      {
        ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_no')?.patchValue('');
        ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_name')?.patchValue('');

        ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
        ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
      }
      else
      {
        ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_name')?.patchValue(res.name);

        this._JournalService.GetAccountCostType(accNo).subscribe(data=>{
          this.AccountCostType=data.n_account_allocat;
          this._JournalService.CurrentAccount=accNo;
          if(this.AccountCostType==1)
          {
            ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.disable();
            ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.disable();
          }
          else if(this.AccountCostType==2 || this.AccountCostType==3 || this.AccountCostType==4)
          {
            this._JournalService.GetCostCenter(accNo).subscribe(dataCost=>{
              debugger;
              ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.enable();
  
              ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(dataCost.s_cost_center_id);
              ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(dataCost.s_cost_center_name);
  
              if(this.AccountCostType==2 || this.AccountCostType==4)
              {
                ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.disable();
                ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.disable();
              }
            });
          }
          else
          {
            ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.disable();
            ((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.disable();
          }
  
        });
        
      }

    });
  }

  ChangeCost(i:number)
  {
    this._currentCostCenterIndex=i;
    if(((this.JournalForm.get("journalDetails") as FormArray).at(i) as FormGroup).get('s_account_no')?.value=='')
    {
      this._notification.ShowMessage('اختر حساب اولا',3);
      ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_id')?.patchValue('');
      ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_name')?.patchValue('');
      return;
    }
    // ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_id')?.patchValue('');
    // ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_name')?.patchValue('');

    var accNo=((this.JournalForm.get("journalDetails") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_account_no')?.value;
    var costNo=((this.JournalForm.get("journalDetails") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_cost_center_id')?.value;

    this._JournalService.GetCostName(costNo, accNo).subscribe(res=>{
      debugger;
      if(res==null)
      {
        ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_id')?.patchValue('');
        ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentCostCenterIndex) as FormGroup).get('s_cost_center_name')?.patchValue('');
      }
      else
        ((this.JournalForm.get("journalDetails") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_cost_center_name')?.patchValue(res.name);

    });
  }

    DocNo : any;
    DataAreaNo : any;
    override ngOnInit(): void {
      this.searchJournal('');
      this.searchCurrency('');
      // this.currentType= this._activatedRoute.snapshot.paramMap.get('typeid');
      // this.currentCurrency= this._activatedRoute.snapshot.paramMap.get('currencyid');
      this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
      this.DataAreaNo = Number(this.userservice.GetDataAreaID());


      if(this.DocNo !=null && this.DocNo > 0 ){

        this.showspinner=true;
        this._JournalService.GetJournalById(this.DocNo,this.DataAreaNo).subscribe(data=>{
          debugger;
          this.JournalForm.patchValue(data);
          this.JournalForm.get("d_doc_date")?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))));
          this.JournalForm.controls['n_journal_id'].disable();
          this.JournalForm.controls['n_currency_id'].disable();
          //const dateSendingToServer =this.myDatepipe.transform(this.JournalForm.value.d_doc_date, 'yyyy-MM-dd');
          // this.currentType = data.n_journal_id;
          // this.currentCurrency = data.n_currency_id;
          var index:number=0;
          data.journalDetails.forEach( (data) => {
            debugger;
            this.journalDetails.push(this.newJournalsdetails(this.journalDetails.length+1));
            if(data.n_account_allocat==0 || data.n_account_allocat==1 ||data.n_account_allocat==2 || data.n_account_allocat==4)
              ((this.JournalForm.get("journalDetails") as FormArray).at(index) as FormGroup).get('s_cost_center_id')?.disable();
            index++;
          });
          (this.JournalForm.get("journalDetails") as FormArray)?.patchValue(data.journalDetails );
          this.calcTotals();
          this.showspinner=false;

        });

        return;
     }
      this.JournalForm.get("n_journal_id")?.patchValue(1);
      this._JournalService.GetMainCurrency().subscribe(res=>{
        this.JournalForm.get("n_currency_id")?.patchValue(res);
        this.JournalForm.get("n_currency_id")?.disable();
      });
      this.JournalForm.get("d_doc_date")?.patchValue(new Date());

      this.addJournalDetails();
      this.addJournalDetails();
      this.translatefun();
      this.translateData();

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
  }
