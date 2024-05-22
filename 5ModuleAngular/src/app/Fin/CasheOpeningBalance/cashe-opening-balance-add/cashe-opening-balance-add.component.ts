import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CashesLkpComponent } from 'src/app/Controls/cashes-lkp/cashes-lkp.component';
import { CashOpeningBalanceService } from 'src/app/Core/Api/FIN/cash-opening-balance.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-cashe-opening-balance-add',
  templateUrl: './cashe-opening-balance-add.component.html',
  styleUrls: ['./cashe-opening-balance-add.component.css']
})
export class CasheOpeningBalanceAddComponent implements OnInit {
  gl_cashes_opening_balance!: FormGroup;
  showspinner: boolean = false;
  n_doc_no: number = 0;
  localCurrency: number = 0;
  n_currency_id: number = 0;
  isEnglish:boolean=false;
  curencyList: any;
  banksList: any;
  timeout: any;
  isFinancialYearExist: boolean = false;

  cashTypesList!: any;
  cashTypesFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  cashTypesSearching:boolean=false;

  constructor(private _service: CashOpeningBalanceService,private _notification: NotificationServiceService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder,
    private _helperService: HelperService, private dialog: MatDialog, private _lookUp:GenerealLookup)
  {
    this.gl_cashes_opening_balance = this._formBuilder.group({
      n_doc_no: new FormControl(''),
      d_Financial_year: new FormControl(''),
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_UserUpdate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      d_doc_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      n_cash_type_id: new FormControl(''),
      s_cash_type_name: new FormControl(''),
      s_arabic_description: new FormControl(''),
      s_english_description: new FormControl(''),
      n_currency_id: new FormControl(''),
      n_currency_coff: new FormControl(''),
      n_total_debit: new FormControl(''),
      n_total_credit: new FormControl(''),

      gl_cashes_opening_balanceDetails: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_doc_no = Number( this._activatedRoute.snapshot.paramMap.get('id') );

    this._helperService.GetCurrentCurrency().subscribe((data) => {
      this.localCurrency = data.n_currency_id;
    });

    this._helperService.GetCurrencies().subscribe((data) => {
      this.curencyList = data;
    });

    this.cashTypesSearch('');

    if(this.n_doc_no <= 0)
    {
      this._service.GetCurrentFinancialYear().subscribe((data) => {
        debugger
        if(data != null)
          this.isFinancialYearExist = true;
      });

      this._service.GetCurrentCasheBalance().subscribe((data) => {
        this.gl_cashes_opening_balance.patchValue(data);
        this.gl_cashes_opening_balance.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.showspinner = false;
      });
      this.add_DetailsRow();
    }

    if(this.n_doc_no > 0)
    {
      this._service.GetByID(this.n_doc_no).subscribe((data) => {
        this.n_currency_id = data.n_currency_id;
        this.gl_cashes_opening_balance.patchValue(data);
        this.gl_cashes_opening_balance.get('d_doc_date')?.patchValue(new Date(Number(data.d_doc_date.substring(0,4)), Number(data.d_doc_date.substring(5,7))-1, Number(data.d_doc_date.substring(8,10))))
        data.gl_cashes_opening_balanceDetails.forEach(element => {
          this.gl_cashes_opening_balanceDetails.push(this.new_DetailsRow(this.gl_cashes_opening_balanceDetails.length + 1));
        });
        (this.gl_cashes_opening_balance.get('gl_cashes_opening_balanceDetails') as FormArray)?.patchValue(data.gl_cashes_opening_balanceDetails);
        this.showspinner = false;
      });
    }
    this.isEnglish=LangSwitcher.CheckLan()
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
  }

  get gl_cashes_opening_balanceDetails(): FormArray
  {
    return this.gl_cashes_opening_balance.get('gl_cashes_opening_balanceDetails') as FormArray;
  }

  new_DetailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: line,
      n_cash_id: '',
      s_cash_name: '',
      n_debit: '',
      n_credit: '',
      s_arabic_description: '',
      s_english_description: '',
      s_cost_center_id2: ''
    });
  }

  add_DetailsRow()
  {
    this.gl_cashes_opening_balanceDetails.push(this.new_DetailsRow(this.gl_cashes_opening_balanceDetails.length + 1));
  }

  remove_DetailsRow(i: number)
  {
    if(this.gl_cashes_opening_balanceDetails.length == 1)
    {
      if(this.isEnglish)
       this._notification.ShowMessage("must have a line at least",3)
      else
      this._notification.ShowMessage('يجب ان يحتوي الرصيد علي سطر واحد من التفاصيل', 3);
      return;
    }
    this.gl_cashes_opening_balanceDetails.removeAt(i);
  }

  cashTypesSearch(value: any)
  {
    this.cashTypesSearching=true;
    this._service.GetCashTypes(value).subscribe(res=> {
      this.cashTypesList=res;
      this.cashTypesFilteredServerSide.next(this.cashTypesList.filter(x => x.s_cash_type_name.toLowerCase().indexOf(value) > -1));
      this.cashTypesSearching=false;
    })
  }

  Save()
  {
    if(this.ValidateMaster() == false || this.ValidateDetails() == false)
    return;

    if(this.isFinancialYearExist == true)
    {
      this._notification.ShowMessage('هذا العام المالي موجود', 3);
      return;
    }

    this.showspinner = true;
    var formData = new FormData();
    this.gl_cashes_opening_balance.value.d_doc_date=new DatePipe('en-US').transform(this.gl_cashes_opening_balance.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.gl_cashes_opening_balance?.value.n_doc_no ?? 0);
    formData.append('d_Financial_year', this.gl_cashes_opening_balance?.value.d_Financial_year ?? '');
    formData.append('n_DataAreaID', this.gl_cashes_opening_balance?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.gl_cashes_opening_balance?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.gl_cashes_opening_balance?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.gl_cashes_opening_balance?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.gl_cashes_opening_balance?.value.d_UserUpdateDate ?? '');
    formData.append('d_doc_date', this.gl_cashes_opening_balance?.value.d_doc_date ?? '');
    formData.append('n_cash_type_id', this.gl_cashes_opening_balance?.value.n_cash_type_id ?? 0);
    formData.append('s_arabic_description', this.gl_cashes_opening_balance?.value.s_arabic_description ?? '');
    formData.append('s_english_description', this.gl_cashes_opening_balance?.value.s_english_description ?? '');
    formData.append('n_currency_id', this.gl_cashes_opening_balance?.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.gl_cashes_opening_balance?.value.n_currency_coff ?? 0);
    formData.append('n_total_debit', this.gl_cashes_opening_balance?.value.n_total_debit ?? 0);
    formData.append('n_total_credit', this.gl_cashes_opening_balance?.value.n_total_credit ?? 0);

    for(var i = 0; i < this.gl_cashes_opening_balanceDetails.length; i++)
    {
      formData.append(`gl_cashes_opening_balanceDetails[${i}].nLineNo`, this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].nLineNo ?? 0);
      formData.append(`gl_cashes_opening_balanceDetails[${i}].n_cash_id`, this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_cash_id ?? 0);
      formData.append(`gl_cashes_opening_balanceDetails[${i}].n_debit`, this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_debit ?? 0);
      formData.append(`gl_cashes_opening_balanceDetails[${i}].n_credit`, this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_credit ?? 0);
      formData.append(`gl_cashes_opening_balanceDetails[${i}].s_arabic_description`, this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].s_arabic_description ?? '');
      formData.append(`gl_cashes_opening_balanceDetails[${i}].s_english_description`, this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].s_english_description ?? '');
      formData.append(`gl_cashes_opening_balanceDetails[${i}].s_cost_center_id2`, this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].s_cost_center_id2 ?? '');
    }

    if(this.n_doc_no !=null && this.n_doc_no > 0 ){

      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
         this._notification.ShowMessage(data.Emsg,data.status)
        else
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/casheOpeningBalanceList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status)
    else
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/fin/casheOpeningBalanceList']);
        }
      });
    }
  }

  ValidateMaster(): boolean
  {
    var isVald = true;
    if(this.gl_cashes_opening_balance?.value.d_doc_date == '' || this.gl_cashes_opening_balance?.value.d_doc_date == null)
    {
      if(this.isEnglish)
       this._notification.ShowMessage('Please insert the date ',3)
      else
      this._notification.ShowMessage('من فضلك ادخل تاريخ المستند', 3);
      isVald = false;
    }
    return isVald;
  }

  ValidateDetails(): boolean
  {
    var isVald = true;
    for(var i = 0; i < this.gl_cashes_opening_balanceDetails.length; i++)
    {
      if(this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_cash_id == ''
          ||
        this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_cash_id == null
          ||
        this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_cash_id == 0)
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert vault number at line ${i+i}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل رقم الخزينة في السطر رقم ${i + 1}`, 3);
        isVald = false;
      }

      if(this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].s_cash_name == '' || this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].s_cash_name == null)
      {
        if(this.isEnglish)
         this._notification.ShowMessage(`Please insert vault name at line ${i+1}`,3)
        else
        this._notification.ShowMessage(`من فضلك ادخل اسم الخزينة في السطر رقم ${i + 1}`, 3);
        isVald = false;
      }

      if( (this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_debit == ''  ||  this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_debit == null)
          &&
          ( this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_credit == '' || this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_credit == null)
        )
      {
        if(this.isEnglish)
        this._notification.ShowMessage(`Please insert Credit and Debit value at line ${i+1}`,3)
      else
        this._notification.ShowMessage(`من فضلك ادخل قيمة الدائن او المدين في السطر رقم ${i + 1}`, 3);
        isVald = false;
      }
    }
    return isVald;
  }

  CalcTotalDebCred()
  {
    var totalDeb = 0, totalCred = 0;
    for(var i = 0; i < this.gl_cashes_opening_balanceDetails.length; i++)
    {
      totalDeb += Number(this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_debit);
      totalCred += Number(this.gl_cashes_opening_balance.value.gl_cashes_opening_balanceDetails[i].n_credit);
    }
    this.gl_cashes_opening_balance.get('n_total_debit')?.patchValue(totalDeb);
    this.gl_cashes_opening_balance.get('n_total_credit')?.patchValue(totalCred);
  }

  searchCahesBegin(event)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      if(event.keyCode != 13 && event.keyCode != undefined)
      {
        this._helperService.getCashesLKP(event.target.value).subscribe((data) =>
        {
          this.banksList = data;
        });
      }
      if(event.keyCode == 8 || event.keyCode == undefined)
      {
        this._helperService.getCashesLKP('').subscribe((data) =>
        {
          this.banksList = data;
        });
      }
    }, 1000);
  }

  serachOpen(event)
  {
    let element =document.querySelector("#" + event.target.id +"+ .search-list") as HTMLElement
    element.style.opacity="1";
    element.style.zIndex="100";
  }

  searchClose(event)
  {
    let element =document.querySelector("#" + event.target.id +"+ .search-list") as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  searchHide(searchInputNumber)
  {
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  selectItem(i,searchInputNumber,inputName,inputNumber)
  {
    let AccountNo=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdF" +i) as HTMLElement;
    let AccountName=document.querySelector("#serach-list-id-"+searchInputNumber +" #tdS" + i) as HTMLElement;

    (this.gl_cashes_opening_balance.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
    (this.gl_cashes_opening_balance.get(inputNumber))?.patchValue(AccountNo.innerHTML);
    let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
    element.style.opacity="0";
    element.style.zIndex="-1";
  }

  currencyChanged()
  {
    this.n_currency_id = Number( this.gl_cashes_opening_balance.value.n_currency_id );
    if(this.n_currency_id == this.localCurrency)
    {
      this.gl_cashes_opening_balance.get('n_currency_coff')?.patchValue(1);
    }
  }

  loadCashes(i: number) {
    const dialogRef = this.dialog.open(CashesLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
     ((this.gl_cashes_opening_balance.get("gl_cashes_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('n_cash_id')?.patchValue(res.data.n_cash_id);
     ((this.gl_cashes_opening_balance.get("gl_cashes_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cash_name')?.patchValue(res.data.s_cash_name);
   });
 }

 onKeyCashesSearch(event: any, i) {
   clearTimeout(this.timeout);
   ((this.gl_cashes_opening_balance.get("gl_cashes_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cash_name')?.patchValue('');
   var $this = this;
   this.timeout = setTimeout(function () {
     if (event.keyCode != 13) {
       $this.executeCasheListing(event.target.value, i);
     }
   }, 1000);
 }

 private executeCasheListing(value: number, i) {
   this._helperService.GetCashData(value).subscribe((data) => {
     if(data.s_cash_name != '' && data.s_cash_name != null){
       ((this.gl_cashes_opening_balance.get("gl_cashes_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cash_name')?.patchValue(data.s_cash_name);
     }
     else{
       ((this.gl_cashes_opening_balance.get("gl_cashes_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cash_name')?.patchValue('');
     }
   });
 }

 fillTable()
  {
    this.gl_cashes_opening_balanceDetails.clear();
    this._service.GetAllCashes(this.gl_cashes_opening_balance.value.n_cash_type_id ?? 0).subscribe((data) => {
      data.forEach(element => {
        this.gl_cashes_opening_balanceDetails.push(this.new_DetailsRow(this.gl_cashes_opening_balanceDetails.length + 1));
        this.gl_cashes_opening_balance.get('gl_cashes_opening_balanceDetails')?.patchValue(data);
      })
    });
 }

 disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
 }

 enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
 }

}
