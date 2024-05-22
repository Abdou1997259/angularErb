import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CostCentersLkpComponent } from 'src/app/Controls/cost-centers-lkp/cost-centers-lkp.component';
import { CustomersLkpComponent } from 'src/app/Controls/customers-lkp/customers-lkp.component';
import { CustomerBalanceService } from 'src/app/Core/Api/AR/customer-balance.service';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-customer-balance-add',
  templateUrl: './customer-balance-add.component.html',
  styleUrls: ['./customer-balance-add.component.css']
})
export class CustomerBalanceAddComponent implements OnInit {
  ar_customers_opening_balance!: FormGroup;
  n_doc_no: number = 0;

  showspinner: boolean = false;

  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  currencySearching:boolean=false;
  localCurrency!: any;
  n_currency_id: number = 0;
  currencyName!: string;

  customerTypesList!: any;
  customerTypesFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  customerTypesSearching:boolean=false;
  isEnglish:boolean=false;
  timeout!: any;
  isCustomerExist: boolean[] = [];
  currentC: number[] = [];

  constructor(private _service: CustomerBalanceService, private _notification: NotificationServiceService,
    private _activatedRoute: ActivatedRoute, private router: Router, private _formBuilder: FormBuilder,
    private _Currency: CurrencyLKPService, private dialog: MatDialog)
  {
    this.ar_customers_opening_balance = this._formBuilder.group({
      n_doc_no: new FormControl(),
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      n_UserUpdate: new FormControl(),
      d_UserUpdateDate: new FormControl(),

      d_doc_date: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      d_Financial_year: new FormControl(),
      n_currency_id: new FormControl(),
      s_currency_name: new FormControl(),
      n_currency_coff: new FormControl(),
      n_customer_type_id: new FormControl(),
      s_customer_type_name: new FormControl(),
      s_arabic_description: new FormControl(),
      s_english_description: new FormControl(),
      n_total_debit: new FormControl(),
      n_total_credit: new FormControl(),
      ar_customers_opening_balanceDetails: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.n_doc_no = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this.CurrencySearch('');
    this.CustomerTypesSearch('');

    if(this.n_doc_no <= 0)
    {
      this._service.GetCurrentCurrency().subscribe((data) => {
        this.localCurrency = data.n_currency_id;
        this.currentC[0] = data.n_currency_id;
      });

      this._service.GetCurrentCustomerBalance().subscribe((data) => {
        this.ar_customers_opening_balance.patchValue(data);
        this.ar_customers_opening_balance.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails')?.patchValue(data.ar_customers_opening_balanceDetails);

        this.showspinner = false;
      });
      this.addNewCustomerDetailsRow();
    }

    if(this.n_doc_no > 0)
    {
      this._service.GetCurrentCurrency().subscribe((data) => {
        this.localCurrency = data.n_currency_id;
      });

      this._service.GetByID(this.n_doc_no).subscribe((data) => {
        this.n_currency_id = data.n_currency_id;
        this.ar_customers_opening_balance.patchValue(data);
        this.ar_customers_opening_balance.get("d_doc_date")?.patchValue((new Date()).toISOString().substring(0,10));
        data.ar_customers_opening_balanceDetails.forEach(element => {
          this.ar_customers_opening_balanceDetails.push(this.newCustomerBalanceDetailsRow(this.ar_customers_opening_balanceDetails.length + 1));
        });
        this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails')?.patchValue(data.ar_customers_opening_balanceDetails);
        for(var i = 0; i < this.ar_customers_opening_balanceDetails.length; i++)
        {
          this.executeCustomersListing(this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_customer_id, i);
          this.currentC[i] = this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_id;
        }
        this.showspinner = false;
      });
    }
    this.translateData();
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }

  }

  get ar_customers_opening_balanceDetails(): FormArray{
    return this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray;
  }

  newCustomerBalanceDetailsRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      nLineNo: '',
      n_customer_id: '',
      s_customer_name: '',
      n_currency_id: this.localCurrency,
      s_currency_name: '',
      n_currency_coff: 1,
      n_debit: '',
      n_credit: '',
      s_arabic_description: '',
      s_english_description: '',
      s_cost_center_id: '',
      s_cost_center_name: '',
      s_cost_center_id2: '',
      s_cost_center_name2: '',
    });
  }

  addNewCustomerDetailsRow()
  {
    this.ar_customers_opening_balanceDetails.push(this.newCustomerBalanceDetailsRow(this.ar_customers_opening_balanceDetails.length + 1));
  }

  removeDetailsRow(i: number)
  {
    if(this.ar_customers_opening_balanceDetails.length == 1)
    {
      this._notification.ShowMessage("يجب ان يحتوي الاذن علي عميل واحد علي الاقل!", 3);
      return;
    }
    this.ar_customers_opening_balanceDetails.removeAt(i);
    this.CalcTotal();
  }

  CurrencySearch(value: any) {
    this.currencySearching=true;
    this._Currency.GetCurrencies().subscribe(res=> {
      this.currenciesList=res;
      this.currencyFilteredServerSide.next(this.currenciesList.filter(x => x.s_currency_name.toLowerCase().indexOf(value) > -1));
      this.currencySearching=false;
    })
  }

  currencyChanged(){
    this.n_currency_id = this.ar_customers_opening_balance.value.n_currency_id;
  }

  CustomerTypesSearch(value: any) {
    this.customerTypesSearching=true;
    this._service.GetAllCustomersTypes().subscribe(res=> {
      this.customerTypesList=res;
      this.customerTypesFilteredServerSide.next(this.customerTypesList.filter(x => x.s_customer_type_name.toLowerCase().indexOf(value) > -1));
      this.customerTypesSearching=false;
    })
  }

  // Details LKP
  loadCustomers(i: number)
  {
    const dialogRef = this.dialog.open(CustomersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isCustomerExist[i] = true;
      ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup)?.get('n_customer_id')?.patchValue(res.data.n_customer_id);
      ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup)?.get('s_customer_name')?.patchValue(res.data.s_customer_name);
    });
  }

  onKeyCustomerSearch(event: any, i)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeCustomersListing(event.target.value, i);
      }
    }, 1000);
  }

  private executeCustomersListing(value: number, i) {
    this._service.GetCustomerName(value).subscribe((data) => {
      if(data.customerName != "")
      {
        ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup)?.get('s_customer_name')?.patchValue(data.customerName);
        this.isCustomerExist[i] = true;
      }
      else{
        this.isCustomerExist[i] = false;
        ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup)?.get('s_customer_name')?.patchValue('');
      }
    });
  }

  LoadCostCenter1(i:number){
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(res => {
      debugger
      ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
     });
  }

  LoadCostCenter2(i:number){
    const dialogRef = this.dialog.open(CostCentersLkpComponent, {
      width: '700px',
      height:'600px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(res => {
      ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue(res.data.s_cost_center_id);
      ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.data.s_cost_center_name);
     });
  }

  ChangeDetailsCost1(i:number)
  {
    var costNo=((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.value;
    this._service.GetCostName(costNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
        ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
      }
      else
        ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.name);
    });
  }

  ChangeDetailsCost2(i:number)
  {
    var costNo=((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.value;
    this._service.GetCostName(costNo).subscribe(res=>{
      if(res==null)
      {
        ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_id2')?.patchValue('');
        ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue('');
      }
      else
        ((this.ar_customers_opening_balance.get("ar_customers_opening_balanceDetails") as FormArray).at(i) as FormGroup).get('s_cost_center_name2')?.patchValue(res.name);
    });
  }

  currencyDetailChange(i: number)
  {
    this.currentC[i] = ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_currency_id')?.value;
    if(this.currentC[i] == this.localCurrency)
      ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_currency_coff')?.disable();
    else
      ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_currency_coff')?.enable();
  }

  checkDebit(i: number)
  {
    ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_credit')?.patchValue(0);
  }

  checkCredit(i: number)
  {
    ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_debit')?.patchValue(0);
  }
  //___________________________________________

  // Calculations
  CalcTotal()
  {
    var totalDebit = 0;
    var totalCredit = 0;
    for(var i = 0; i < this.ar_customers_opening_balanceDetails.length; i++)
    {
      totalDebit += Number( ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_debit')?.value );
      totalCredit += Number( ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_credit')?.value );
    }

    this.ar_customers_opening_balance.get('n_total_debit')?.patchValue(totalDebit);
    this.ar_customers_opening_balance.get('n_total_credit')?.patchValue(totalCredit);
  }
  //_______________________________________

  Save(){
    if(this.ValidateMasterTable() == false || this.ValidateDetailsTable() == false)
      return;

    this.showspinner = true;
    var formData = new FormData();
    this.ar_customers_opening_balance.value.d_doc_date=new DatePipe('en-US').transform(this.ar_customers_opening_balance.value.d_doc_date, 'yyyy/MM/dd');
    formData.append('n_doc_no', this.ar_customers_opening_balance?.value.n_doc_no ?? 0);
    formData.append('n_DataAreaID', this.ar_customers_opening_balance?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ar_customers_opening_balance?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ar_customers_opening_balance?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ar_customers_opening_balance?.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.ar_customers_opening_balance?.value.d_UserUpdateDate ?? '');
    formData.append('d_doc_date', this.ar_customers_opening_balance?.value.d_doc_date ?? '');
    formData.append('d_Financial_year', this.ar_customers_opening_balance?.value.d_Financial_year ?? '');
    formData.append('n_currency_id', this.ar_customers_opening_balance?.value.n_currency_id ?? 0);
    formData.append('n_currency_coff', this.ar_customers_opening_balance?.value.n_currency_coff ?? 0);
    formData.append('n_customer_type_id', this.ar_customers_opening_balance?.value.n_customer_type_id ?? 0);
    formData.append('s_arabic_description', this.ar_customers_opening_balance?.value.s_arabic_description ?? '');
    formData.append('s_english_description', this.ar_customers_opening_balance?.value.s_english_description ?? '');
    formData.append('n_total_debit', this.ar_customers_opening_balance?.value.n_total_debit ?? 0);
    formData.append('n_total_credit', this.ar_customers_opening_balance?.value.n_total_credit ?? 0);
debugger
    for(var i = 0; i < this.ar_customers_opening_balanceDetails.length; i++)
    {
      var x = this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_coff;
      formData.append(`ar_customers_opening_balanceDetails[${ i }].n_customer_id`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_customer_id ?? 0);
      formData.append(`ar_customers_opening_balanceDetails[${ i }].n_currency_id`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_id ?? 0);
      formData.append(`ar_customers_opening_balanceDetails[${ i }].n_currency_coff`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_coff ?? 1);
      formData.append(`ar_customers_opening_balanceDetails[${ i }].n_debit`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_debit ?? 0);
      formData.append(`ar_customers_opening_balanceDetails[${ i }].n_credit`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_credit ?? 0);
      formData.append(`ar_customers_opening_balanceDetails[${ i }].s_arabic_description`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].s_arabic_description ?? '');
      formData.append(`ar_customers_opening_balanceDetails[${ i }].s_english_description`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].s_english_description ?? '');
      formData.append(`ar_customers_opening_balanceDetails[${ i }].s_cost_center_id`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].s_cost_center_id ?? '');
      formData.append(`ar_customers_opening_balanceDetails[${ i }].s_cost_center_id2`, this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].s_cost_center_id2 ?? '');
    }

    if(this.n_doc_no !=null && this.n_doc_no > 0 )
    {
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this.router.navigate(['/ar/customerBalanceList']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
      this.showspinner=false;
      this.enableButtons();
      this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this.router.navigate(['/ar/customerBalanceList']);
        }
      });
    }
  }

  ValidateMasterTable(): boolean
  {
    var isValid = true;
    if(this.ar_customers_opening_balance.get('d_doc_date')?.value == '' || this.ar_customers_opening_balance.get('d_doc_date')?.value == null)
    {
      this._notification.ShowMessage("من فضلك ادخل تاريخ المستند!", 3);
      isValid = false;
    }
    return isValid;
  }

  ValidateDetailsTable(): boolean
  {
    debugger
    var isValid = true;
    for(var i = 0; i < this.ar_customers_opening_balanceDetails.length; i++)
    {
      if(this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_customer_id == '' || this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_customer_id == null)
      {
        this._notification.ShowMessage(`من فضلك ادخل رقم العميل في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].s_customer_name == '' || this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].s_customer_name == null)
      {
        this._notification.ShowMessage(`من فضلك ادخل اسم العميل في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_id == '' || this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_id == null || this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_id <= 0)
      {
        this._notification.ShowMessage(`من فضلك اختر العملة في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if(this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_coff <= 0 || this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_coff <= 0)
      {
        this._notification.ShowMessage(`من فضلك ادخل معامل التحويل في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
      if( (
            this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_debit == ''
            ||
            this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_debit == null
            ||
            this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_debit == 0
          )
          &&
          (
            this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_credit == ''
            ||
            this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_credit == null
            ||
            this.ar_customers_opening_balance?.value.ar_customers_opening_balanceDetails[i].n_currency_coff == 0
          )
        )
      {
        this._notification.ShowMessage(`من فضلك ادخل قيمة الدائن او المدين في السطر رقم ${i+1}`, 3);
        isValid = false;
      }
    }
    return isValid;
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  loadDataAreaCustomers()
  {
    this.ar_customers_opening_balanceDetails.clear();
    var customerType = Number( this.ar_customers_opening_balance.get('n_customer_type_id')?.value );
    this._service.LoadCustomers(customerType).subscribe((data) => {
      for(var i = 0; i < data.length; i++)
      {
        this.ar_customers_opening_balanceDetails.push(this.newCustomerBalanceDetailsRow(this.ar_customers_opening_balanceDetails.length+1));
        this.executeCustomersListing(data[i].n_customer_id, i);
        ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('n_customer_id')?.patchValue(data[i].n_customer_id);
        ((this.ar_customers_opening_balance.get('ar_customers_opening_balanceDetails') as FormArray).at(i) as FormGroup).get('s_customer_name')?.patchValue(data[i].s_customer_name);
      }
    });
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
}
