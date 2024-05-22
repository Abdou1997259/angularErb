import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ReplaySubject } from 'rxjs';
import { ItemsdetailsLookUpComponent } from 'src/app/Controls/itemsdetails-look-up/itemsdetails-look-up.component';
import { UnitsLookUpComponent } from 'src/app/Controls/units-look-up/units-look-up.component';
import { CustomersService } from 'src/app/Core/Api/AR/customers.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css']
})
export class CustomerAddComponent implements OnInit {
  ar_customers!: FormGroup;
  showspinner: boolean = false;
  n_customer_id: number = 0;

  timeout: any;
  custFieldsList: any;
  sourceList: any;
  itemTypesList: any;

  dropdownSettings: IDropdownSettings = {};
  selectedItems: any = [];
  branchesList: any[] = [];
  MaxQtyReactionList: any[] = [];

  creditPeriodTypesList: any;
  dealingTypesList: any;
  customerTypesDPList: any;
  customerNaturesDPList: any;
  typesDPList: any;

  isItemExist: boolean[] = [];
  isUnitExist: boolean[] = [];

  relatedAccountList: any;
  customerTypesList: any;
  costCenter1List: any;
  costCenter2List: any;
  accountTreeOrdersList: any;
  salesmenList: any;
  commissionsList: any;
  mainCustomersList: any;
  suppliersList: any;
  advermenList: any;
  areaList: any;
  priceList: any;
  taxOfficesList: any;
  GuaranteeList: any;
  AdvancedPaymentList: any;

  searchingRelatedAcc: boolean = false;
  searchingCustomerTypes: boolean = false;
  searchingCostCenter1: boolean = false;
  searchingCostCenter2: boolean = false;
  isEnglish:boolean=false;
  searchingaccountTreeOrders: boolean = false;
  searchingSalesMan: boolean = false;
  searchingCommissionTypes: boolean = false;
  searchingMainCustomer: boolean = false;
  searchingRelatedSupplier: boolean = false;
  searchingAdverMan: boolean = false;
  searchingArea: boolean = false;
  searchingPrice: boolean = false;
  searchingTaxOffice: boolean = false;
  searchingGuarantee: boolean = false;
  searchingAdvancedPayment: boolean = false;
  b_use_follow_credit_limit: any;

  filteredRelatedAccServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCustomerTypesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenter1ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccountTreeOrdersServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredSalesManServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCommissionTypesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredMainCustomerServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredRelatedSupplierServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAdverManServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAreaServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredPriceServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredTaxOfficeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredGuaranteeServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAdvancedPaymentServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: CustomersService, private _notification: NotificationServiceService, private _router: Router,
    private _activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder, private _helperService: HelperService,
    private dialog: MatDialog)
  {
    this.ar_customers = this._formBuilder.group({
      n_customer_id: new FormControl(),
      n_DataAreaID: new FormControl(),
      n_modified_customer_credit_limit:new FormControl(),
      n_customer_credit_limit:new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      n_UserUpdate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      s_customer_name: new FormControl('', Validators.required),
      s_customer_name_eng: new FormControl(),
      n_customer_type_id: new FormControl('', Validators.required),
      s_customer_type_name: new FormControl(),
      d_customer_date_add: new FormControl((new Date()).toISOString().substring(0,10), Validators.required),
      d_date_transaction: new FormControl(),
      b_cash_customer: new FormControl(),
      b_direct_cust: new FormControl(),
      b_stop_cust: new FormControl(),
      b_is_renter: new FormControl(),
      n_source: new FormControl(),
      n_maincustomer_id: new FormControl(),
      s_maincustomer_name: new FormControl(),
      n_price_list_no: new FormControl(),
      s_list_name: new FormControl(),
      n_salesman_id: new FormControl('', Validators.required),
      s_salesman_name: new FormControl(),
      s_AttachmentPerson: new FormControl(),
      n_adver_man: new FormControl(),
      s_name: new FormControl(),
      n_area_id: new FormControl(),
      s_customer_address: new FormControl('', Validators.required),
      s_CustFields: new FormControl(),
      s_account_with_customer: new FormControl(),
      s_tax_doc_no: new FormControl(),
      s_national_no: new FormControl(),
      s_cost_center_id: new FormControl(),
      s_cost_center_name: new FormControl(),
      s_cost_center_id_2: new FormControl(),
      s_cost_center_name_2: new FormControl(),
      s_branches: new FormControl(),
      n_customer_payment_period: new FormControl(),
      n_CreditPeriod_type: new FormControl(),
      s_related_account_no: new FormControl('', Validators.required),
      s_related_account_name: new FormControl(),
      n_commision_type: new FormControl(),
      s_commission_type_name: new FormControl(),
      n_related_supplier: new FormControl(),
      s_supplier_name: new FormControl(),
      s_refusal_account: new FormControl(),
      s_account_name: new FormControl(),
      n_advanced_payment_percent: new FormControl(),
      n_dealing_type: new FormControl(),
      s_CustomerSite: new FormControl(),
      s_PBox: new FormControl(),
      s_customer_phone_no: new FormControl(),
      s_zipcode: new FormControl(),
      s_customer_fax_no: new FormControl(),
      // s_edi_email: new FormControl(),
      s_tel_no: new FormControl(),
      s_customer_phone_no2: new FormControl(),
      s_mobile_no: new FormControl(),
      s_email: new FormControl(),
      s_fax: new FormControl(),
      s_ExtraNote: new FormControl(),
      s_customer_e_mail: new FormControl(),

      item_type_id: new FormControl(),
      s_item_type_name: new FormControl(),
      n_customer_credit_limit_reaction: new FormControl(),

      //المعلومات التجارية
      n_customer_nature: new FormControl(),
      s_tax_file_no: new FormControl('', Validators.required),
      n_type: new FormControl(),
      n_tax_office: new FormControl(),
      s_tax_office_name: new FormControl(),
      s_country: new FormControl(),
      s_governorate: new FormControl(),
      s_city: new FormControl(),
      s_district: new FormControl(),
      s_building_number: new FormControl(),
      s_street_name: new FormControl(),
      n_postal_zone: new FormControl(),
      s_edi_name: new FormControl(),
      s_edi_email: new FormControl(),
      n_cust_type: new FormControl(),

      // بيانات اضافية
      s_Guarantee_detained_acc: new FormControl(),
      s_Guarantee_detained_acc_name: new FormControl(),
      s_advance_payment_acc: new FormControl(),
      s_advance_payment_acc_name: new FormControl(),
      d_contract_start_date: new FormControl(),
      d_contract_end_date: new FormControl(),
      d_contract_activate_date: new FormControl(),
      s_rent_area: new FormControl(),
      s_customer_number: new FormControl(),
      s_piece_no: new FormControl(),

      ar_customers_items_prices: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.searchRelatedAcc('');
    this.searchCustomerTypesList('');
    this.searchCostCenter1('');
    this.searchCostCenter2('');
    this.searchaccountTreeOrders('');
    this.searchSalesMan('');
    this.searchCommissionTypesList('');
    this.searchMainCustomerList('');
    this.searchRelatedSupplierList('');
    this.searchAdverManList('');
    this.searchAreaList('');
    this.searchPriceList('');
    this.searchTaxOfficeList('');
    this.searchGuaranteeList('');
    this.searchAdvancedPaymentList('');
    this.n_customer_id = Number( this._activatedRoute.snapshot.paramMap.get('id') );

    this._service.GetCustomersConfigurations().subscribe((data) => {
      this.b_use_follow_credit_limit = data.b_use_follow_credit_limit;
      if(this.b_use_follow_credit_limit == true)
        {
          this.ar_customers.get("n_customer_credit_limit")?.setValidators(Validators.required);
          this.ar_customers.get("n_modified_customer_credit_limit")?.setValidators(Validators.required);
        }
    });

    this._service.GetMaxQtyReactions().subscribe((data) => {
      this.MaxQtyReactionList = data;
    });

    this.loadDropDowns();

    if(this.n_customer_id <= 0)
    {
      this._service.GetCurrentCustomer().subscribe((data) => {
        this.ar_customers.patchValue(data);
        this.ar_customers.get("d_customer_date_add")?.patchValue((new Date()).toISOString().substring(0,10));
        // this.ar_customers.get("d_customer_date_add")?.patchValue(new Date(Number(data.d_customer_date_add.substring(0,4)), Number(data.d_customer_date_add.substring(5,7))-1, Number(data.d_customer_date_add.substring(8,10))));
        this.showspinner = false;
      });
    }

    if(this.n_customer_id > 0)
    {
      this._service.GetByID(this.n_customer_id).subscribe((data) => {

        // var arr = data.s_branches.split(',');
        // for(var i = 0; i < arr.length; i++)
        //   this.selectedItems.push({n_branch_id: Number(arr[i]), s_branch_name: this.branchesList[arr[i]].s_branch_name});
        data.s_branches='';
        this.ar_customers.patchValue(data);
        this.showspinner = false;
        this.ar_customers.get('n_area_id')?.patchValue(data.n_area_id);
        this.ar_customers.get("d_customer_date_add")?.patchValue(new Date(Number(data.d_customer_date_add.substring(0,4)), Number(data.d_customer_date_add.substring(5,7))-1, Number(data.d_customer_date_add.substring(8,10))));
        this.ar_customers.get("d_contract_start_date")?.patchValue(new Date(Number(data.d_contract_start_date.substring(0,4)), Number(data.d_contract_start_date.substring(5,7))-1, Number(data.d_contract_start_date.substring(8,10))));
        this.ar_customers.get("d_contract_end_date")?.patchValue(new Date(Number(data.d_contract_end_date.substring(0,4)), Number(data.d_contract_end_date.substring(5,7))-1, Number(data.d_contract_end_date.substring(8,10))));
        this.ar_customers.get("d_contract_activate_date")?.patchValue(new Date(Number(data.d_contract_activate_date.substring(0,4)), Number(data.d_contract_activate_date.substring(5,7))-1, Number(data.d_contract_activate_date.substring(8,10))));

        data.ar_customers_items_prices.forEach(element => {
          this.ar_customers_items_prices.push(this.push_ar_customers_items_prices_Row(this.ar_customers_items_prices.length + 1));
        });
        (this.ar_customers.get('ar_customers_items_prices') as FormArray).patchValue(data.ar_customers_items_prices);
        for(var i = 0; i < this.ar_customers_items_prices.length; i++)
        {
          if(this.ar_customers.value.ar_customers_items_prices.s_item_id != null || this.ar_customers.value.ar_customers_items_prices.s_item_id != '')
          {
            this.isItemExist[i] = true;
          }
          if(this.ar_customers.value.ar_customers_items_prices.n_unit_id != null || this.ar_customers.value.ar_customers_items_prices.n_unit_id != '')
          {
            this.isUnitExist[i] = true;
          }
        }

      });
    }
  LangSwitcher.translatefun();
  LangSwitcher.translateData(1);
  this.isEnglish=LangSwitcher.CheckLan();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'n_branch_id',
      textField: 's_branch_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  loadDropDowns(): void
  {
    this._helperService.getIndustriesDPList().subscribe((data) => {
      this.custFieldsList = data;
    });
    this._helperService.getClassesDPList().subscribe((data) => {
      this.sourceList = data;
    });
    this._helperService.getBranchesDPList().subscribe((data) => {
      this.branchesList = data;
    });
    this._helperService.getCreditPeriodTypesDPList().subscribe((data) => {
      this.creditPeriodTypesList = data;
    });
    this._helperService.getDealingTypesDPList().subscribe((data) => {
      this.dealingTypesList = data;
    });
    this._helperService.getCustomerTypesDPList().subscribe((data) => {
      this.customerTypesDPList = data;
    });
    this._helperService.getCustomerNaturesDPList().subscribe((data) => {
      this.customerNaturesDPList = data;
    });
    this._helperService.getTypesDPList().subscribe((data) => {
      this.typesDPList = data;
    });
  }

  get ar_customers_items_prices(): FormArray
  {
    return this.ar_customers.get('ar_customers_items_prices') as FormArray;
  }

  push_ar_customers_items_prices_Row(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      n_customer_id: '',
      n_line_no: line,
      s_item_id: '',
      s_item_name: '',
      n_unit_id: '',
      s_unit_name: '',
      n_price: ''
    });
  }

  add_ar_customers_items_prices_Row()
  {
    this.ar_customers_items_prices.push(this.push_ar_customers_items_prices_Row(this.ar_customers_items_prices.length + 1));
  }

  remove_ar_customers_items_prices_Row(i: number)
  {
    this.ar_customers_items_prices.removeAt(i);
  }

  searchRelatedAcc(value :any){
    this.searchingRelatedAcc=true;
    this._service.GetAccountsTree(value).subscribe(res=>{
      this.relatedAccountList=res;
      this.filteredRelatedAccServerSide.next(  this.relatedAccountList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingRelatedAcc=false;
    });
  }

  searchCustomerTypesList(value :any){
    this.searchingCustomerTypes=true;
    this._helperService.getCustomerTypesLKP(value).subscribe(res=>{
      this.customerTypesList=res;
      this.filteredCustomerTypesServerSide.next(  this.customerTypesList.filter(x => x.s_customer_type_name.toLowerCase().indexOf(value) > -1));
      this.searchingCustomerTypes=false;
    });
  }

  searchCostCenter1(value :any){
    this.searchingCostCenter1=true;
    this._helperService.getCostCebterLKP(value).subscribe(res=>{
      this.costCenter1List=res;
      this.filteredCostCenter1ServerSide.next(  this.costCenter1List.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCostCenter1=false;
    });
  }

  searchCostCenter2(value :any){
    this.searchingCostCenter2=true;
    this._helperService.getCostCebterLKP(value).subscribe(res=>{
      this.costCenter2List=res;
      this.filteredCostCenter2ServerSide.next(  this.costCenter2List.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCostCenter2=false;
    });
  }

  searchaccountTreeOrders(value :any){
    this.searchingaccountTreeOrders=true;
    this._helperService.getAccountsOrdersLKP(value).subscribe(res=>{
      this.accountTreeOrdersList=res;
      this.filteredaccountTreeOrdersServerSide.next(  this.accountTreeOrdersList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingaccountTreeOrders=false;
    });
  }

  searchSalesMan(value :any){
    this.searchingSalesMan=true;
    this._helperService.getSalesmenLKP(value).subscribe(res=>{
      this.salesmenList=res;
      this.filteredSalesManServerSide.next(  this.salesmenList.filter(x => x.s_salesman_name.toLowerCase().indexOf(value) > -1));
      this.searchingSalesMan=false;
    });
  }

  searchCommissionTypesList(value :any){
    this.searchingCommissionTypes=true;
    this._helperService.getCommissionsLKP(value).subscribe(res=>{
      this.commissionsList=res;
      this.filteredCommissionTypesServerSide.next(this.commissionsList.filter(x => x.s_commission_type_name.toLowerCase().indexOf(value) > -1));
      this.searchingCommissionTypes=false;
    });
  }

  searchMainCustomerList(value :any){
    this.searchingMainCustomer=true;
    this._helperService.getMainCustomersLKP(value).subscribe(res=>{
      this.mainCustomersList=res;
      this.filteredMainCustomerServerSide.next(this.mainCustomersList.filter(x => x.s_maincustomer_name.toLowerCase().indexOf(value) > -1));
      this.searchingMainCustomer=false;
    });
  }

  searchRelatedSupplierList(value :any){
    this.searchingRelatedSupplier=true;
    this._helperService.getSuppliersLKP(value).subscribe(res=>{
      this.suppliersList=res;
      this.filteredRelatedSupplierServerSide.next(this.suppliersList.filter(x => x.s_supplier_name.toLowerCase().indexOf(value) > -1));
      this.searchingRelatedSupplier=false;
    });
  }

  searchAdverManList(value :any){
    this.searchingAdverMan=true;
    this._helperService.getAdverMenLKP(value).subscribe(res=>{
      this.advermenList=res;
      this.filteredAdverManServerSide.next(this.advermenList.filter(x => x.s_name.toLowerCase().indexOf(value) > -1));
      this.searchingAdverMan=false;
    });
  }

  searchAreaList(value :any){
    this.searchingArea=true;
    this._helperService.getAreaLKP(value).subscribe(res=>{
      debugger
      this.areaList=res;
      this.filteredAreaServerSide.next(this.areaList.filter(x => x.s_area_name.toLowerCase().indexOf(value) > -1));
      this.searchingArea=false;
    });
  }

  searchPriceList(value :any){
    this.searchingPrice=true;
    this._helperService.getPriceLKP(value).subscribe(res=>{
      this.priceList=res;
      this.filteredPriceServerSide.next(this.priceList.filter(x => x.s_list_name.toLowerCase().indexOf(value) > -1));
      this.searchingPrice=false;
    });
  }

  searchTaxOfficeList(value :any){
    this.searchingTaxOffice=true;
    this._helperService.getTaxOfficesLKP(value).subscribe(res=>{
      this.taxOfficesList=res;
      this.filteredTaxOfficeServerSide.next(this.taxOfficesList.filter(x => x.s_tax_office_name.toLowerCase().indexOf(value) > -1));
      this.searchingTaxOffice=false;
    });
  }

  searchGuaranteeList(value :any){
    this.searchingGuarantee=true;
    this._helperService.getAccountsOrdersLKP(value).subscribe(res=>{
      this.GuaranteeList=res;
      this.filteredGuaranteeServerSide.next(  this.GuaranteeList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingGuarantee=false;
    });
  }

  searchAdvancedPaymentList(value :any){
    this.searchingAdvancedPayment=true;
    this._helperService.getAccountsOrdersLKP(value).subscribe(res=>{
      this.AdvancedPaymentList=res;
      this.filteredAdvancedPaymentServerSide.next(  this.AdvancedPaymentList.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingAdvancedPayment=false;
    });
  }

    // Load Data
    serachOpen(event)
    {
      let element =document.querySelector("#" + event.target.id +"+ .search-list") as HTMLElement
      element.style.opacity="1";
      element.style.zIndex="100";
    }

    searchClose(event)
    {
      let element =document.querySelector("#" + event.target.id +"+ .search-list ") as HTMLElement
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

      (this.ar_customers.get(inputName))?.patchValue(AccountNo.innerHTML + " # " + AccountName.innerHTML);
      (this.ar_customers.get(inputNumber))?.patchValue(AccountNo.innerHTML);
      let element =document.querySelector("#serach-list-id-"+searchInputNumber) as HTMLElement
      element.style.opacity="0";
      element.style.zIndex="-1";
    }

    // searchCustomerTypesBegin(event)
    // {
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getCustomerTypesLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.customerTypesList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getCustomerTypesLKP('').subscribe((data) =>
    //       {
    //         this.customerTypesList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchMainCustomersBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getMainCustomersLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.mainCustomersList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getMainCustomersLKP('').subscribe((data) =>
    //       {
    //         this.mainCustomersList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchSalesmenBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getSalesmenLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.salesmenList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getSalesmenLKP('').subscribe((data) =>
    //       {
    //         this.salesmenList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchAdvermenBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getAdverMenLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.advermenList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getAdverMenLKP('').subscribe((data) =>
    //       {
    //         this.advermenList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchAreaBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getAreaLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.areaList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getAreaLKP('').subscribe((data) =>
    //       {
    //         this.areaList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchCostCentersBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getCostCebterLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.costCenterList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getCostCebterLKP('').subscribe((data) =>
    //       {
    //         this.costCenterList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchAccountTreeOrdersBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getAccountsOrdersLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.accountTreeOrdersList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getAccountsOrdersLKP('').subscribe((data) =>
    //       {
    //         this.accountTreeOrdersList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchPriceBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getPriceLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.priceList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getPriceLKP('').subscribe((data) =>
    //       {
    //         this.priceList = data;
    //       });
    //     }
    //   }, 1000);
    // }



    // searchSuppliersBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getSuppliersLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.suppliersList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getSuppliersLKP('').subscribe((data) =>
    //       {
    //         this.suppliersList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    // searchCommissionsBegin(event)
    // {
    //   debugger
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getCommissionsLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.commissionsList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getCommissionsLKP('').subscribe((data) =>
    //       {
    //         this.commissionsList = data;
    //       });
    //     }
    //   }, 1000);
    // }

    searchItemTypesBegin(event)
    {
      debugger
      clearTimeout(this.timeout);
      var $this = this;
      this.timeout = setTimeout(() => {
        debugger
        if(event.keyCode != 13 && event.keyCode != undefined)
        {
          this._helperService.getItemTypesLKP(event.target.value).subscribe((data) =>
          {
            this.itemTypesList = data;
          });
        }

        if(event.keyCode == 8 || event.keyCode == undefined)
        {
          this._helperService.getItemTypesLKP('').subscribe((data) =>
          {
            this.itemTypesList = data;
          });
        }
      }, 1000);
    }

    // searchTexOfficesBegin(event)
    // {
    //   clearTimeout(this.timeout);
    //   var $this = this;
    //   this.timeout = setTimeout(() => {
    //     debugger
    //     if(event.keyCode != 13 && event.keyCode != undefined)
    //     {
    //       this._helperService.getTaxOfficesLKP(event.target.value).subscribe((data) =>
    //       {
    //         this.taxOfficesList = data;
    //       });
    //     }

    //     if(event.keyCode == 8 || event.keyCode == undefined)
    //     {
    //       this._helperService.getTaxOfficesLKP('').subscribe((data) =>
    //       {
    //         this.taxOfficesList = data;
    //       });
    //     }
    //   }, 1000);
    // }
    //__________________________

    // Details LKP
    currentItemIndex: number = 0;
    loadItems(i: number) {
      this.currentItemIndex=i;

       const dialogRef = this.dialog.open(ItemsdetailsLookUpComponent, {
         width: '700px',
         height:'600px',
         data: {  }
       });

       dialogRef.afterClosed().subscribe(res => {
        this.isItemExist[i] = true;
        if(res != undefined)
          this.resetDetailsValues(i);
        ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_id')?.patchValue(res.data.s_item_id);
        ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_item_name')?.patchValue(res.data.s_item_name);
        ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(this.currentItemIndex) as FormGroup).get('n_unit_id')?.patchValue('');
        ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(this.currentItemIndex) as FormGroup).get('s_unit_name')?.patchValue('');
        // this.GetItemCost(i);
      });
    }

    onKeyItemSearch(event: any, i) {
    clearTimeout(this.timeout);
    this.resetDetailsValues(i);
    ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(i) as FormGroup).get('n_unit_id')?.patchValue('');
    ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');

    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeItemListing(event.target.value, i);
      }
      }, 1000);
    }

    private executeItemListing(value: string, i) {
      this._helperService.GetItemData(value).subscribe((data) => {
        if(data.s_item_name != '' && data.s_item_name != null){
          this.isItemExist[i] = true;
          ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue(data.s_item_name);
          // this.GetItemCost(i);
        }
        else{
          this.isItemExist[i] = false;
          ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(i) as FormGroup).get('s_item_name')?.patchValue('');
        }
      });
    }

    currentUnitIndex: number = 0;
    loadUnits(i: number) {
      this.currentUnitIndex=i;
      let itemID=  ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_item_id')?.value;

      const dialogRef = this.dialog.open(UnitsLookUpComponent, {
        width: '700px',
        height:'600px',
        data: {  'itemId': itemID  }
      });

      dialogRef.afterClosed().subscribe(res => {
        this.isUnitExist[i] = true;
        if(res != undefined)
          this.resetDetailsValues(i);
       ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(this.currentUnitIndex) as FormGroup).get('n_unit_id')?.patchValue(res.data.n_unit_id);
       ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(this.currentUnitIndex) as FormGroup).get('s_unit_name')?.patchValue(res.data.s_unit_name);
      });
    }

    onKeyUnitSearch(event: any, i) {
      clearTimeout(this.timeout);
      this.resetDetailsValues(i);
      var $this = this;
      this.timeout = setTimeout(function () {
        if (event.keyCode != 13) {
          $this.executeUnitListing(event.target.value, i);
        }
      }, 1000);
    }

    private executeUnitListing(value: number, i) {
      var itemId = ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
      this._helperService.GetUnitData(value, itemId).subscribe((data) => {
        if(data.s_unit_name != '' && data.s_unit_name != null){
          this.isUnitExist[i] = true;
          ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue(data.s_unit_name);
        }
        else{
          this.isUnitExist[i] = false;
          ((this.ar_customers.get("ar_customers_items_prices") as FormArray).at(i) as FormGroup).get('s_unit_name')?.patchValue('');
        }
      });
    }

    resetDetailsValues(i: number)
    {

    }
    //________________________________

  Save()
  {
    this.showspinner = true;
    var formData = new FormData();
    this.ar_customers.value.d_customer_date_add=new DatePipe('en-US').transform(this.ar_customers.value.d_customer_date_add, 'yyyy/MM/dd');
    this.ar_customers.value.d_contract_start_date=new DatePipe('en-US').transform(this.ar_customers.value.d_contract_start_date, 'yyyy/MM/dd');
    this.ar_customers.value.d_contract_end_date=new DatePipe('en-US').transform(this.ar_customers.value.d_contract_end_date, 'yyyy/MM/dd');
    this.ar_customers.value.d_contract_activate_date=new DatePipe('en-US').transform(this.ar_customers.value.d_contract_activate_date, 'yyyy/MM/dd');

    formData.append('n_customer_id', this.ar_customers?.value.n_customer_id ?? 0);
    formData.append('n_DataAreaID', this.ar_customers?.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.ar_customers?.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.ar_customers?.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.ar_customers?.value.n_UserUpdate ?? 0);
    formData.append('n_customer_credit_limit_reaction', this.ar_customers?.value.n_customer_credit_limit_reaction ?? 0);
    formData.append('d_UserUpdateDate', this.ar_customers?.value.d_UserUpdateDate ?? '');
    formData.append('s_customer_name', this.ar_customers?.value.s_customer_name ?? '');
    formData.append('s_customer_name_eng', this.ar_customers?.value.s_customer_name_eng ?? '');
    formData.append('n_customer_type_id', this.ar_customers?.value.n_customer_type_id ?? 0);
    formData.append('d_customer_date_add', this.ar_customers?.value.d_customer_date_add ?? '');
    formData.append('d_date_transaction', this.ar_customers?.value.d_date_transaction ?? '');
    formData.append('b_cash_customer', this.ar_customers?.value.b_cash_customer ?? false);
    formData.append('b_direct_cust', this.ar_customers?.value.b_direct_cust ?? false);
    formData.append('b_stop_cust', this.ar_customers?.value.b_stop_cust ?? false);
    formData.append('b_is_renter', this.ar_customers?.value.b_is_renter ?? false);
    formData.append('n_source', this.ar_customers?.value.n_source ?? 0);
    formData.append('n_maincustomer_id', this.ar_customers?.value.n_maincustomer_id ?? 0);
    formData.append('n_price_list_no', this.ar_customers?.value.n_price_list_no ?? 0);
    formData.append('n_salesman_id', this.ar_customers?.value.n_salesman_id ?? 0);
    formData.append('s_AttachmentPerson', this.ar_customers?.value.s_AttachmentPerson ?? '');
    formData.append('n_adver_man', this.ar_customers?.value.n_adver_man ?? 0);
    formData.append('n_area_id', this.ar_customers?.value.n_area_id ?? 0);
    formData.append('s_customer_address', this.ar_customers?.value.s_customer_address ?? '');
    formData.append('s_CustFields', this.ar_customers?.value.s_CustFields ?? 0);
    formData.append('s_account_with_customer', this.ar_customers?.value.s_account_with_customer ?? '');
    formData.append('s_tax_doc_no', this.ar_customers?.value.s_tax_doc_no ?? '');
    formData.append('s_national_no', this.ar_customers?.value.s_national_no ?? '');
    formData.append('s_cost_center_id', this.ar_customers?.value.s_cost_center_id ?? '');
    formData.append('s_cost_center_id_2', this.ar_customers?.value.s_cost_center_id_2 ?? '');
    // formData.append('s_branches', this.ar_customers?.value.s_branches ?? '');
    formData.append('n_customer_payment_period', this.ar_customers?.value.n_customer_payment_period ?? 0);
    formData.append('n_CreditPeriod_type', this.ar_customers?.value.n_CreditPeriod_type ?? 0);
    formData.append('s_related_account_no', this.ar_customers?.value.s_related_account_no ?? '');
    formData.append('n_commision_type', this.ar_customers?.value.n_commision_type ?? 0);
    formData.append('n_related_supplier', this.ar_customers?.value.n_related_supplier ?? 0);
    formData.append('s_refusal_account', this.ar_customers?.value.s_refusal_account ?? '');
    formData.append('n_advanced_payment_percent', this.ar_customers?.value.n_advanced_payment_percent ?? 0);
    formData.append('n_dealing_type', this.ar_customers?.value.n_dealing_type ?? 0);
    formData.append('s_CustomerSite', this.ar_customers?.value.s_CustomerSite ?? '');
    formData.append('s_PBox', this.ar_customers?.value.s_PBox ?? '');
    formData.append('s_customer_phone_no', this.ar_customers?.value.s_customer_phone_no ?? '');
    formData.append('s_zipcode', this.ar_customers?.value.s_zipcode ?? '');
    formData.append('s_customer_fax_no', this.ar_customers?.value.s_customer_fax_no ?? '');
    formData.append('s_tel_no', this.ar_customers?.value.s_tel_no ?? '');
    formData.append('s_customer_phone_no2', this.ar_customers?.value.s_customer_phone_no2 ?? '');
    formData.append('s_mobile_no', this.ar_customers?.value.s_mobile_no ?? '');
    formData.append('s_email', this.ar_customers?.value.s_email ?? '');
    formData.append('s_fax', this.ar_customers?.value.s_fax ?? '');
    formData.append('s_ExtraNote', this.ar_customers?.value.s_ExtraNote ?? '');
    formData.append('s_customer_e_mail', this.ar_customers?.value.s_customer_e_mail ?? '');
    formData.append('n_customer_nature', this.ar_customers?.value.n_customer_nature ?? 0);
    formData.append('s_tax_file_no', this.ar_customers?.value.s_tax_file_no ?? '');
    formData.append('n_type', this.ar_customers?.value.n_type ?? 0);
    formData.append('n_tax_office', this.ar_customers?.value.n_tax_office ?? 0);
    formData.append('s_country', this.ar_customers?.value.s_country ?? '');
    formData.append('s_governorate', this.ar_customers?.value.s_governorate ?? '');
    formData.append('s_city', this.ar_customers?.value.s_city ?? '');
    formData.append('s_district', this.ar_customers?.value.s_district ?? '');
    formData.append('s_building_number', this.ar_customers?.value.s_building_number ?? '');
    formData.append('s_street_name', this.ar_customers?.value.s_street_name ?? '');
    formData.append('n_postal_zone', this.ar_customers?.value.n_postal_zone ?? 0);
    formData.append('s_edi_name', this.ar_customers?.value.s_edi_name ?? '');
    formData.append('s_edi_email', this.ar_customers?.value.s_edi_email ?? '');
    formData.append('n_cust_type', this.ar_customers?.value.n_cust_type ?? 0);
    formData.append('s_Guarantee_detained_acc', this.ar_customers?.value.s_Guarantee_detained_acc ?? '');
    formData.append('s_advance_payment_acc', this.ar_customers?.value.s_advance_payment_acc ?? '');
    formData.append('d_contract_start_date', this.ar_customers?.value.d_contract_start_date ?? '');
    formData.append('d_contract_end_date', this.ar_customers?.value.d_contract_end_date ?? '');
    formData.append('d_contract_activate_date', this.ar_customers?.value.d_contract_activate_date ?? '');
    formData.append('s_rent_area', this.ar_customers?.value.s_rent_area ?? '');
    formData.append('s_customer_number', this.ar_customers?.value.s_customer_number ?? '');
    formData.append('s_piece_no', this.ar_customers?.value.s_piece_no ?? '');
    formData.append('n_modified_customer_credit_limit', this.ar_customers?.value.n_modified_customer_credit_limit ?? '');
    formData.append('n_customer_credit_limit', this.ar_customers?.value.n_customer_credit_limit ?? '');

    debugger
    var text: string = '';
    if(this.ar_customers.value.s_branches !== null && this.ar_customers.value.s_branches !== '') {
      this.ar_customers.value.s_branches.forEach((element) => {
        text += element.n_branch_id + ','; //s_branch_name
      });
    }
    formData.append('s_branches', text);

    if(this.ar_customers_items_prices.length > 0)
    {
      for(var i = 0; i < this.ar_customers_items_prices.length; i++)
      {
        formData.append(`ar_customers_items_prices[${i}].n_line_no`, this.ar_customers?.value.ar_customers_items_prices[i].n_line_no ?? 0);
        formData.append(`ar_customers_items_prices[${i}].s_item_id`, this.ar_customers?.value.ar_customers_items_prices[i].s_item_id ?? '');
        formData.append(`ar_customers_items_prices[${i}].n_unit_id`, this.ar_customers?.value.ar_customers_items_prices[i].n_unit_id ?? 0);
        formData.append(`ar_customers_items_prices[${i}].n_price`, this.ar_customers?.value.ar_customers_items_prices[i].n_price ?? 0);
      }
    }

    if(this.n_customer_id !=null && this.n_customer_id > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();
        if(this.isEnglish)
          this._notification.ShowMessage(data.Emsg,data.status)
        else
           this. _notification.ShowMessage(data.msg,data.status);
        if(data.status==1){
          this._router.navigate(['/ar/customersList']);
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
          this._router.navigate(['/ar/customersList']);
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

}
