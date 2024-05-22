import { data } from 'jquery';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CalculatorLKPComponent } from 'src/app/Controls/calculator-lkp/calculator-lkp.component';
import { CreditCardTypesLkpComponent } from 'src/app/Controls/credit-card-types-lkp/credit-card-types-lkp.component';
import { CustomersLkpComponent } from 'src/app/Controls/customers-lkp/customers-lkp.component';
import { ResturantBill2Service } from 'src/app/Core/Api/AR/resturant-bill2.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { ResturantInvoice2BillComponent } from 'src/app/Controls/ResturantInvoice2Bill/resturant-invoice2-bill/resturant-invoice2-bill.component';

@Component({
  selector: 'app-ar-resturant-bill2-add',
  templateUrl: './ar-resturant-bill2-add.component.html',
  styleUrls: ['./ar-resturant-bill2-add.component.css']
})
export class ArResturantBill2AddComponent implements OnInit {
  ar_sales_invoice!: FormGroup;
  DocNo: number = 0;
  showspinner: boolean = false;
  isEnglish: boolean = false;
  isCash: boolean = false;    // 41 n_invoice_type_id
  isCredit: boolean = false;  // 42 n_invoice_type_id
  isCard: boolean = false;    // 43 n_invoice_type_id
  isCashCard: boolean = false; // 48 n_invoice_type_id
  isTaxed: boolean = false;
  shiftId: any;
  salerId: any;
  salerName: any;
  defaultCustomer: number = 0;

  itemTypesList: any[] = [];
  unitsList: any[] = [];

  selectedItemList: any[] = [];

  constructor(private _service: ResturantBill2Service, public dialog: MatDialog, private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService, private _router: Router, private userservice: UserService,
    private _formBuilder: FormBuilder)
  {
    this.ar_sales_invoice = this._formBuilder.group({
      n_document_no: new FormControl(''),
      d_document_date:new FormControl((new Date()).toISOString().substring(0,10)),
      s_book_no: new FormControl(''),
      n_invoice_type_id:new FormControl(''),
      n_customer_id:new FormControl('', Validators.required),
      s_customer_name:new FormControl(''),
      s_direct_customer_name:new FormControl(''),
      s_customer_tel:new FormControl(''),
      n_sales_Man_id: new FormControl(''),
      n_store_id: new FormControl(''),
      n_currency_id: new FormControl(''),
      n_currency_coff: new FormControl(''),
      s_description_arabic: new FormControl(''),
      s_description_eng: new FormControl(''),
      s_po_no: new FormControl(''),
      n_trans_source_no: new FormControl(''),
      d_due_date: new FormControl((new Date()).toISOString().substring(0,10)),
      b_use_multi_cost_center: false,
      s_cost_center_id: new FormControl(''),
      s_cost_center_id2: new FormControl(''),
      n_acc_dir_id:new FormControl(''),
      n_total_qty: new FormControl(''),
      n_no_of_items: new FormControl(''),
      n_total_value: new FormControl(''),
      n_net_value: new FormControl(''),
      n_total_discount: new FormControl(''),
      n_sales_Tax: new FormControl(''),
      n_expenses_tax: new FormControl(''),
      n_extra_expenses: new FormControl(''),
      b_has_extra_expnses: false,
      b_has_extra_discount: false,
      n_Discount_ratio: new FormControl(''),
      n_extra_discount: new FormControl(''),
      n_manual_sales_tax: new FormControl(''),
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_current_branch: new FormControl(''),
      n_current_company: new FormControl(''),
      n_current_year: new FormControl(''),
      s_expense_code: new FormControl(''),
      n_discount_tax: new FormControl(''),
      n_discount_tax_ratio: new FormControl(''),
      n_additional_tax: new FormControl(''),
      n_additional_tax_ratio: new FormControl(''),
      n_inv_cat_id: new FormControl(''),
      totalDue: new FormControl(''),
      n_Cash_Value: new FormControl(0),
      totalRemain: new FormControl(''),
      n_CreditCard_Value: new FormControl(''),
      n_Credit_Card_No: new FormControl(''),
      n_cash_id: new FormControl(''),
      s_credit_card_name: new FormControl(''),
      n_Shift_no: new FormControl(''),
      n_item_net_value_WithoutTax: new FormControl(''),
      ar_sales_invoice_details: this._formBuilder.array([]),
      expenseDetails: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    debugger
    this.shiftId = this._activatedRoute.snapshot.paramMap.get('id');
    this.salerId = this._activatedRoute.snapshot.paramMap.get('salerId');
    this.salerName = this._activatedRoute.snapshot.paramMap.get('salerName');

    this._service.GetDefaultCustomer().subscribe((data) => {
      this.ar_sales_invoice.get('n_customer_id')?.patchValue(data.n_customer_id);
      this.ar_sales_invoice.get('s_customer_name')?.patchValue(data.s_customer_name);
    });

    this._service.IsSellPriceTaxable().subscribe((data) => {
      this.isTaxed = data;
    });

    this._service.GetAllItemTypes().subscribe((data) => {
      this.itemTypesList = data;
      this.cardSelected(this.itemTypesList[0].n_item_type);
    });
  }

  get ar_sales_invoice_details() : FormArray {
    return this.ar_sales_invoice.get("ar_sales_invoice_details") as FormArray
  }

  newInvoiceDetails(line: number = 0, item:any, itemVal: any, netVal: any, taxVal: any): FormGroup {
    return this._formBuilder.group({
      nLineNo:line,
      s_item_id: item.s_item_id,
      s_item_name: item.s_item_name,
      s_item_name_eng: item.s_item_name_eng,
      n_unit_id:'',
      s_unit_name:'',
      n_qty: 1,
      n_unit_price: '',
      n_item_value: itemVal,
      nItemDiscountP:'',
      nItemDiscountV:'',
      n_item_expenses:'',
      nInvDiscountV:'',
      n_item_net_value_WithoutTax:'',
      n_item_sales_Tax: taxVal,
      n_item_net_value: netVal,
      s_cost_center_id:'',
      s_cost_center_name:'',
      s_cost_center_id2:'',
      s_cost_center_name2:'',
      n_trans_source_doc_no:'',
      n_credit_discount:'',
      n_qty_main_unit:'',
      s_notes:'',
      s_item_color:'',
      s_unit_color:'',
      s_qty_color:'',
      s_price_color:'',
      n_Bonus:'',
      n_item_discount_tax:'',
      n_item_additional_tax:'',
      n_selling_price: item.n_selling_price
    })
  }

  RemoveInvoiceDetail(i:number) {
    var itemNo=((this.ar_sales_invoice.get("ar_sales_invoice_details") as FormArray).at(i) as FormGroup).get('s_item_id')?.value;
    this.ar_sales_invoice_details.removeAt(i);
    this.calcTotal();
    this.calcNetWithoutTax();
    this.calcTotalTax();
    this.calcTotalNetWithTax();
    this.calcTotalQty();


    if(this.isCash == true)
    {
      this.paidChanged();
    }

    if(this.isCard || this.isCashCard)
    {
      this.calcCreditCardVal();
    }
  }

  cardSelected(item: any)
  {
    this._service.GetItemsDetails(item).subscribe((data) => {
      this.unitsList = data;
    });
  }

  itemSelected(item: any)
  {
    var isItemExist = false;
    var index;
    var oldQty = 0;
    debugger
    var docDate: any = new DatePipe('en-US').transform(this.ar_sales_invoice.value.d_document_date, 'yyyy/MM/dd');
    var priceList: any;

    this._service.GetItemPriceList(item.s_item_id, docDate).subscribe((data) => {
      priceList = data;
      if(priceList != null)
        item.n_selling_price = priceList.n_unit_price;

    var itemVal = this.round((item.n_selling_price * 100)/115, 2)
    var taxVal = this.round(item.n_selling_price - (item.n_selling_price * 100)/115, 2);
    var netVal = this.round(itemVal + taxVal, 2);

    for(var i = 0; i < this.ar_sales_invoice.value.ar_sales_invoice_details.length; i++)
    {
      if(this.ar_sales_invoice.value.ar_sales_invoice_details[i].s_item_id == item.s_item_id)
        {
          isItemExist = true;
          index = i;
          oldQty += Number(this.ar_sales_invoice.value.ar_sales_invoice_details[i].n_qty);
        }
    }

    if(isItemExist == false)
    {
      if(this.isTaxed == true)
      {
        this.ar_sales_invoice_details.push(
          this.newInvoiceDetails(this.ar_sales_invoice_details.length + 1, item, itemVal, netVal, taxVal)
        );
      }
      else {
        this.ar_sales_invoice_details.push(
          this.newInvoiceDetails(this.ar_sales_invoice_details.length + 1, item, item.n_selling_price, item.n_selling_price, taxVal)
        );
      }
    }
    else
    {
      if(this.isTaxed)
      {
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_qty')?.patchValue(oldQty + 1);
        var currentQty = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_qty')?.value);

        var newPrice = item.n_selling_price * currentQty;
        itemVal = this.round((newPrice * 100)/115, 2)
        taxVal = this.round(newPrice - (newPrice * 100)/115, 2);
        netVal = this.round(itemVal + taxVal, 2);

        var currentItemVal = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_value')?.value);
        var currentTax = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_sales_Tax')?.value);
        var currentNetVal = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_net_value')?.value);

        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_value')?.patchValue(this.round(currentItemVal + itemVal, 2));
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_sales_Tax')?.patchValue(this.round(currentTax + taxVal, 2));
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_net_value')?.patchValue(this.round(currentNetVal + netVal, 2));
      }
      else
      {
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_qty')?.patchValue(oldQty + 1);
        var currentQty = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_qty')?.value);
        var currentNetVal = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_net_value')?.value);
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_net_value')?.patchValue(this.round(currentQty * currentNetVal, 2));
        var newNet = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_net_value')?.value);
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(index) as FormGroup).get('n_item_sales_Tax')?.patchValue(this.round(newNet * 15/100, 2));
      }
    }
    if(this.isCard == true)
    {
      this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue(this.ar_sales_invoice.get('n_net_value')?.value);
    }

    this.calcNetWithoutTax();
    this.calcTotalTax();
    this.calcTotalNetWithTax();
    this.calcTotalQty();

    if(this.isCash == true)
    {
      this.paidChanged();
    }

    if(this.isCard || this.isCashCard)
    {
      this.calcCreditCardVal();
    }
    });
  }

  calcTotal()
  {
    var sum = 0;
    for(var i = 0; i < this.ar_sales_invoice.value.ar_sales_invoice_details.length; i++)
    {
      sum += Number(this.ar_sales_invoice.value.ar_sales_invoice_details[i].n_selling_price * this.ar_sales_invoice.value.ar_sales_invoice_details[i].n_qty);
    }
    this.ar_sales_invoice.get('n_net_value')?.patchValue(sum);
  }

  calcTotalQty()
  {
    debugger
    var sum = 0;
    for(var i = 0; i < this.ar_sales_invoice.value.ar_sales_invoice_details.length; i++)
      sum += Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_qty')?.value);

    this.ar_sales_invoice.get('n_total_qty')?.patchValue(sum);
  }

  Save()
  {
    if(this.ar_sales_invoice.value.ar_sales_invoice_details.length <= 0)
    {
      this._notification.ShowMessage('لا يمكن حفظ الفاتورة بدون اصناف', 3);
      return;
    }

    if(this.isCashCard == true || this.isCard == true)
    {
      if(this.ar_sales_invoice.get('s_credit_card_name')?.value == null || this.ar_sales_invoice.get('s_credit_card_name')?.value == '' || this.ar_sales_invoice.get('s_credit_card_name')?.value == undefined)
      {
        this._notification.ShowMessage('يجب اختيار نوع الشبكة اولآ', 3);
        return;
      }
    }

    if(this.isCash == true || this.isCashCard == true)
    {
      if(this.ar_sales_invoice.value.n_Cash_Value <= 0)
      {
        this._notification.ShowMessage('من فضلك ادخل قيمة الفاتورة', 3);
        return;
      }
    }

    if(!this.isCash && !this.isCredit && !this.isCard && !this.isCashCard)
    {
      this._notification.ShowMessage('من فضلك اختر طريقة الدفع اولآ', 3);
      return;
    }

    if(this.isCredit)
    {
      if(this.ar_sales_invoice.get('n_customer_id')?.value == '' || this.ar_sales_invoice.get('n_customer_id')?.value == null || this.ar_sales_invoice.get('n_customer_id')?.value == 0 || this.ar_sales_invoice.get('n_customer_id')?.value == undefined)
      {
        this._notification.ShowMessage('من فضلك اختر العميل اولآ', 3);
        return;
      }
    }

    if(this.isCash)
    {
      var paid = Number(this.ar_sales_invoice.get('n_Cash_Value')?.value);
      var total = Number(this.ar_sales_invoice.get('n_net_value')?.value);
      if(paid < total)
      {
        this._notification.ShowMessage('لم يتم دفع اجمالي المبلغ من فضلك ادخل المبلغ المناسب', 3);
        return;
      }
    }

    if(this.isCashCard)
    {
      var paid = Number(this.ar_sales_invoice.get('n_Cash_Value')?.value);
      var card = Number(this.ar_sales_invoice.get('n_CreditCard_Value')?.value);
      var total = Number(this.ar_sales_invoice.get('n_net_value')?.value);
      if(paid + card < total)
      {
        this._notification.ShowMessage('لم يتم دفع اجمالي المبلغ من فضلك ادخل المبلغ المناسب', 3);
        return;
      }
    }

    this.disableButtons();
    this.showspinner = true;
    var formData: any = new FormData();
    this.ar_sales_invoice.value.d_document_date=new DatePipe('en-US').transform(this.ar_sales_invoice.value.d_document_date, 'yyyy/MM/dd');
    this.ar_sales_invoice.value.d_due_date=new DatePipe('en-US').transform(this.ar_sales_invoice.value.d_due_date, 'yyyy/MM/dd');
    if(this.isCash || this.isCard || this.isCashCard)
    {
      if(this.ar_sales_invoice.get('s_direct_customer_name')?.value != '' || this.ar_sales_invoice.get('s_direct_customer_name')?.value != null || this.ar_sales_invoice.get('s_direct_customer_name')?.value != undefined)
        this.ar_sales_invoice.get('n_customer_id')?.patchValue('');
    }

    formData.append("n_document_no", this.ar_sales_invoice.value.n_document_no ?? 0);
    formData.append("n_Shift_no", this.shiftId ?? 0);
    formData.append("d_document_date", this.ar_sales_invoice.value.d_document_date ?? '');
    formData.append("s_book_no", this.ar_sales_invoice.value.s_book_no ?? '');

    formData.append("n_customer_id", this.ar_sales_invoice.value.n_customer_id ?? 0);
    formData.append("s_customer_name", this.ar_sales_invoice.value.s_customer_name ?? '');
    formData.append("s_direct_customer_name", this.ar_sales_invoice.value.s_direct_customer_name ?? '');
    formData.append("s_customer_tel", this.ar_sales_invoice.value.s_customer_tel ?? '');
    formData.append("n_sales_Man_id", this.salerId ?? 0);
    formData.append("n_store_id", this.ar_sales_invoice.value.n_store_id ?? 0);
    formData.append("n_currency_id", this.ar_sales_invoice.value.n_currency_id ?? 0);
    formData.append("n_currency_coff", this.ar_sales_invoice.value.n_currency_coff ?? 0);
    formData.append("s_description_arabic", this.ar_sales_invoice.value.s_description_arabic ?? '');
    formData.append("s_description_eng", this.ar_sales_invoice.value.s_description_eng ?? '');
    formData.append("s_po_no", this.ar_sales_invoice.value.s_po_no ?? '');
    formData.append("n_trans_source_no", this.ar_sales_invoice.value.n_trans_source_no ?? 0);
    formData.append("d_due_date", this.ar_sales_invoice.value.d_due_date ?? '');
    formData.append("b_use_multi_cost_center", this.ar_sales_invoice.value.b_use_multi_cost_center ?? false);
    formData.append("s_cost_center_id", this.ar_sales_invoice.value.s_cost_center_id ?? '');
    formData.append("s_cost_center_id2", this.ar_sales_invoice.value.s_cost_center_id2 ?? '');
    formData.append("n_acc_dir_id", this.ar_sales_invoice.value.n_acc_dir_id ?? 0);
    formData.append("n_no_of_items", this.ar_sales_invoice.value.n_no_of_items ?? 0);
    formData.append("n_total_discount", this.ar_sales_invoice.value.n_total_discount ?? 0);
    formData.append("n_expenses_tax", this.ar_sales_invoice.value.n_expenses_tax ?? 0);
    formData.append("n_extra_expenses", this.ar_sales_invoice.value.n_extra_expenses ?? 0);
    formData.append("b_has_extra_expnses", this.ar_sales_invoice.value.b_has_extra_expnses ?? false);
    formData.append("b_has_extra_discount", this.ar_sales_invoice.value.b_has_extra_discount ?? false);
    formData.append("n_Discount_ratio", this.ar_sales_invoice.value.n_Discount_ratio ?? 0);
    formData.append("n_extra_discount", this.ar_sales_invoice.value.n_extra_discount ?? 0);
    formData.append("n_manual_sales_tax", this.ar_sales_invoice.value.n_manual_sales_tax ?? 0);
    formData.append("n_DataAreaID", this.ar_sales_invoice.value.n_DataAreaID ?? 0);
    formData.append("n_UserAdd", this.ar_sales_invoice.value.n_UserAdd ?? 0);
    formData.append("d_UserAddDate", this.ar_sales_invoice.value.d_UserAddDate ?? '');
    formData.append("n_current_branch", this.ar_sales_invoice.value.n_current_branch ?? 0);
    formData.append("n_current_company", this.ar_sales_invoice.value.n_current_company ?? 0);
    formData.append("n_current_year", this.ar_sales_invoice.value.n_current_year ?? 0);
    formData.append("s_expense_code", this.ar_sales_invoice.value.s_expense_code ?? '');
    formData.append("n_discount_tax", this.ar_sales_invoice.value.n_discount_tax ?? 0);
    formData.append("n_discount_tax_ratio", this.ar_sales_invoice.value.n_discount_tax_ratio ?? 0);
    formData.append("n_additional_tax", this.ar_sales_invoice.value.n_additional_tax ?? 0);
    formData.append("n_additional_tax_ratio", this.ar_sales_invoice.value.n_additional_tax_ratio ?? 0);
    formData.append("n_inv_cat_id", this.ar_sales_invoice.value.n_inv_cat_id ?? 0);
    formData.append("n_invoice_type_id", this.ar_sales_invoice.value.n_invoice_type_id ?? 0);
    formData.append("n_total_qty", this.ar_sales_invoice.value.n_total_qty ?? 0);
    formData.append("n_total_value", this.ar_sales_invoice.value.n_net_value ?? 0);
    formData.append("n_net_value", this.ar_sales_invoice.value.n_net_value ?? 0);
    formData.append("n_sales_Tax", this.ar_sales_invoice.value.n_sales_Tax ?? 0);
    formData.append("n_CreditCard_Value", this.ar_sales_invoice.value.n_CreditCard_Value ?? 0);
    formData.append("n_cash_id", this.ar_sales_invoice.value.n_cash_id ?? 0);
    formData.append("n_Credit_Card_No", this.ar_sales_invoice.value.n_Credit_Card_No ?? 0);
    formData.append("n_Cash_Value", this.ar_sales_invoice.value.n_Cash_Value ?? 0);

    for (var i = 0; i < this.ar_sales_invoice.value.ar_sales_invoice_details.length;i++)
    {
      formData.append("ar_sales_invoice_detailsLst[" + i + "].nLineNo", this.ar_sales_invoice.value.ar_sales_invoice_details[i].nLineNo ?? 0);
      formData.append("ar_sales_invoice_detailsLst[" + i + "].s_item_id", this.ar_sales_invoice.value.ar_sales_invoice_details[i].s_item_id ?? '');
      formData.append("ar_sales_invoice_detailsLst[" + i + "].s_item_name", this.ar_sales_invoice.value.ar_sales_invoice_details[i].s_item_name ?? '');
      formData.append("ar_sales_invoice_detailsLst[" + i + "].n_qty", this.ar_sales_invoice.value.ar_sales_invoice_details[i].n_qty ?? 0);
      formData.append("ar_sales_invoice_detailsLst[" + i + "].n_item_sales_Tax", this.ar_sales_invoice.value.ar_sales_invoice_details[i].n_item_sales_Tax ?? 0);
      formData.append("ar_sales_invoice_detailsLst[" + i + "].n_item_value", this.ar_sales_invoice.value.ar_sales_invoice_details[i].n_item_value ?? 0);
      formData.append("ar_sales_invoice_detailsLst[" + i + "].n_item_net_value", this.ar_sales_invoice.value.ar_sales_invoice_details[i].n_item_net_value ?? 0);
    }

    this._service.Create(formData).subscribe((data) => {
      this.showspinner = false;
      this.enableButtons();
      if(this.isEnglish)
         this._notification.ShowMessage(data.Emsg, data.status);
      else
         this._notification.ShowMessage(data.msg, data.status);
      if(data.status == 1){
        this.LoadBill(data.extra);
        this.ClearForm();
      }
    });
  }

  LoadBill(model: any)
  {
    const dialogRef = this.dialog.open(ResturantInvoice2BillComponent, {
      width: '800px',
      height:'700px',
      data: {  data: model  }
    });
  }

  CashClicked()
  {
    if(this.CheckIfDetailsIsEmpty() == true)
    {
      this._notification.ShowMessage('من فضلك اختر الاصناف اولآ', 3);
      return;
    }
    this.isCash = true;
    this.isCredit = false;
    this.isCard = false;
    this.isCashCard = false;
    var due = Number(this.ar_sales_invoice.get('n_net_value')?.value);
    var paid = Number(this.ar_sales_invoice.get('n_net_value')?.value);

    this.ar_sales_invoice.get('totalDue')?.patchValue(due);
    this.ar_sales_invoice.get('n_invoice_type_id')?.patchValue(41);

    // this.ar_sales_invoice.get('n_customer_id')?.patchValue('');
    this.ar_sales_invoice.get('n_Credit_Card_No')?.patchValue('');
    this.ar_sales_invoice.get('s_credit_card_name')?.patchValue('');
    this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue('');
  }

  CreditClicked()
  {
    if(this.CheckIfDetailsIsEmpty() == true)
    {
      this._notification.ShowMessage('من فضلك اختر الاصناف اولآ', 3);
      return;
    }
    this.isCredit = true;
    this.isCash = false;
    this.isCard = false;
    this.isCashCard = false;
    this.ar_sales_invoice.get('n_invoice_type_id')?.patchValue(42);

    this.ar_sales_invoice.get('n_Cash_Value')?.patchValue('');
    this.ar_sales_invoice.get('n_Credit_Card_No')?.patchValue('');
    this.ar_sales_invoice.get('s_credit_card_name')?.patchValue('');
    this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue('');
  }

  CardClicked()
  {
    if(this.CheckIfDetailsIsEmpty() == true)
    {
      this._notification.ShowMessage('من فضلك اختر الاصناف اولآ', 3);
      return;
    }
    this.isCard = true;
    this.isCredit = false;
    this.isCash = false;
    this.isCashCard = false;
    this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue(this.ar_sales_invoice.get('n_net_value')?.value);
    this.ar_sales_invoice.get('n_invoice_type_id')?.patchValue(43);

    this.ar_sales_invoice.get('n_Cash_Value')?.patchValue('');
  }

  CashCashClicked()
  {
    if(this.CheckIfDetailsIsEmpty() == true)
    {
      this._notification.ShowMessage('من فضلك اختر الاصناف اولآ', 3);
      return;
    }
    this.isCashCard = true;
    this.isCard = false;
    this.isCredit = false;
    this.isCash = false;
    this.ar_sales_invoice.get('n_invoice_type_id')?.patchValue(48);
    this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue(this.ar_sales_invoice.get('n_net_value')?.value);
  }

  paidChanged()
  {
    this.ar_sales_invoice.get('totalDue')?.patchValue(this.ar_sales_invoice.get('n_net_value')?.value);
    var due = this.ar_sales_invoice.get('totalDue')?.value;
    var paid = this.ar_sales_invoice.get('n_Cash_Value')?.value;

    this.ar_sales_invoice.get('totalRemain')?.patchValue(this.round(paid - due, 2));
  }

  totalPriceChanged()
  {
    if(this.isCash == true)
    {
      var totalPrice = Number(this.ar_sales_invoice.get('n_net_value')?.value);
      this.ar_sales_invoice.get('totalDue')?.patchValue(totalPrice);
      this.ar_sales_invoice.get('n_Cash_Value')?.patchValue(totalPrice);
      this.ar_sales_invoice.get('')?.patchValue(Number(this.ar_sales_invoice.get('n_Cash_Value')?.value) - Number(this.ar_sales_invoice.get('totalDue')?.value));
    }
  }

  LoadCustomers(){
    const dialogRef = this.dialog.open(CustomersLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.ar_sales_invoice.get('n_customer_id')?.patchValue(res.data.n_customer_id);
      this.ar_sales_invoice.get('s_customer_name')?.patchValue(res.data.s_customer_name);
     });
  }

  LoadCreditCardTypes(){
    const dialogRef = this.dialog.open(CreditCardTypesLkpComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      debugger
      this.ar_sales_invoice.get('n_Credit_Card_No')?.patchValue(res.data.n_credit_card_no);
      this.ar_sales_invoice.get('s_credit_card_name')?.patchValue(res.data.s_credit_card_name);
     });
  }

  clcShow(i: number, item: any)
  {
    const dialogRef = this.dialog.open(CalculatorLKPComponent, {
      width: '400px',
      height:'350px',
      data: {    }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(i == -1)
      {
        if(this.isCash == true)
        {
          this.ar_sales_invoice.get('n_Cash_Value')?.patchValue(res.data);
          this.paidChanged();
        }
        if(this.isCashCard == true)
          this.ar_sales_invoice.get('n_Cash_Value')?.patchValue(res.data);

        if(this.isCashCard == true)
          this.calcCreditCardVal();
      }
      else {
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_qty')?.patchValue(res.data);

        this.calcTotal();
        this.calcItemNetTax(i, Number(res.data), item);
        this.calcNetWithoutTax();
        this.calcTotalTax();
        this.calcTotalNetWithTax();
        this.calcTotalQty();
        if(this.isCard || this.isCashCard)
        {
          this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue(this.ar_sales_invoice.get('n_net_value')?.value);
        }

        if(this.isCash == true)
        {
          this.paidChanged();
        }
      }
     });
  }

  calcItemNetTax(i: number, qty: number, item: any)
  {
    if(this.isTaxed)
    {
      var newPrice = Number(item.get('n_selling_price').value) * qty;
      var itemVal = this.round((newPrice * 100)/115, 2)
      var taxVal = this.round(newPrice - (newPrice * 100)/115, 2);
      var netVal = this.round(itemVal + taxVal, 2);

        var currentItemVal = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value);
        var currentTax = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.value);
        var currentNetVal = Number(((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_net_value')?.value);

        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(this.round(currentItemVal + itemVal, 2));
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue(this.round(currentTax + taxVal, 2));
        ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue(this.round(currentNetVal + netVal, 2));
    }
    else{
      var currentVal = ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value;
      var currentTaxVal = ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.value;

      ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.patchValue(this.round((qty * item.get('n_selling_price').value) + currentVal, 2));
      ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.patchValue(this.round(15/100 + currentTaxVal, 2));

      var val = ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value;
      var tax = ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.value;
      ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_net_value')?.patchValue(val + tax);
    }
  }

  round (n, dp) {
    const h = +('1'.padEnd(dp + 1, '0'));
    return Math.round(n * h) / h;
  }

  calcNetWithoutTax()
  {
    var sum = 0;
    for(var i = 0; i < this.ar_sales_invoice.value.ar_sales_invoice_details.length; i++)
      sum += ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_value')?.value;

    this.ar_sales_invoice.get('n_item_net_value_WithoutTax')?.patchValue(this.round(sum, 2));
  }

  calcTotalTax()
  {
    var sum = 0;
    for(var i = 0; i < this.ar_sales_invoice.value.ar_sales_invoice_details.length; i++)
      sum += ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_sales_Tax')?.value;

    this.ar_sales_invoice.get('n_sales_Tax')?.patchValue(this.round(sum, 2));
  }

  calcTotalNetWithTax()
  {
    var sum = 0;
    for(var i = 0; i < this.ar_sales_invoice.value.ar_sales_invoice_details.length; i++)
      sum += ((this.ar_sales_invoice.get('ar_sales_invoice_details') as FormArray).at(i) as FormGroup).get('n_item_net_value')?.value;
    this.ar_sales_invoice.get('n_net_value')?.patchValue(this.round(sum, 2));
  }

  calcCreditCardVal()
  {
    var cashVal = Number(this.ar_sales_invoice.get('n_Cash_Value')?.value);
    var netVal = Number(this.ar_sales_invoice.get('n_net_value')?.value);

    if(cashVal == netVal)
      this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue(0);

    if(cashVal <= netVal)
      this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue(this.round(netVal - cashVal, 2));

    if(cashVal >= netVal)
      this.ar_sales_invoice.get('n_CreditCard_Value')?.patchValue(0);
  }

  CheckIfDetailsIsEmpty(): boolean
  {
    var isEmpty = false;
    if(this.ar_sales_invoice.value.ar_sales_invoice_details.length <= 0)
      isEmpty = true;

    return isEmpty;
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }

  ClearForm()
  {
    this.ar_sales_invoice = this._formBuilder.group({
      n_document_no: new FormControl(''),
      d_document_date:new FormControl((new Date()).toISOString().substring(0,10)),
      s_book_no: new FormControl(''),
      n_invoice_type_id:new FormControl(''),
      n_customer_id:new FormControl(''),
      s_customer_name:new FormControl(''),
      s_direct_customer_name:new FormControl(''),
      s_customer_tel:new FormControl(''),
      n_sales_Man_id: new FormControl(''),
      n_store_id: new FormControl(''),
      n_currency_id: new FormControl(''),
      n_currency_coff: new FormControl(''),
      s_description_arabic: new FormControl(''),
      s_description_eng: new FormControl(''),
      s_po_no: new FormControl(''),
      n_trans_source_no: new FormControl(''),
      d_due_date: new FormControl((new Date()).toISOString().substring(0,10)),
      b_use_multi_cost_center: false,
      s_cost_center_id: new FormControl(''),
      s_cost_center_id2: new FormControl(''),
      n_acc_dir_id:new FormControl(''),
      n_total_qty: new FormControl(''),
      n_no_of_items: new FormControl(''),
      n_total_value: new FormControl(''),
      n_net_value: new FormControl(''),
      n_total_discount: new FormControl(''),
      n_sales_Tax: new FormControl(''),
      n_expenses_tax: new FormControl(''),
      n_extra_expenses: new FormControl(''),
      b_has_extra_expnses: false,
      b_has_extra_discount: false,
      n_Discount_ratio: new FormControl(''),
      n_extra_discount: new FormControl(''),
      n_manual_sales_tax: new FormControl(''),
      n_DataAreaID: new FormControl(''),
      n_UserAdd: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      n_current_branch: new FormControl(''),
      n_current_company: new FormControl(''),
      n_current_year: new FormControl(''),
      s_expense_code: new FormControl(''),
      n_discount_tax: new FormControl(''),
      n_discount_tax_ratio: new FormControl(''),
      n_additional_tax: new FormControl(''),
      n_additional_tax_ratio: new FormControl(''),
      n_inv_cat_id: new FormControl(''),
      totalDue: new FormControl(''),
      n_Cash_Value: new FormControl(0),
      totalRemain: new FormControl(''),
      n_CreditCard_Value: new FormControl(''),
      n_Credit_Card_No: new FormControl(''),
      n_cash_id: new FormControl(''),
      s_credit_card_name: new FormControl(''),
      n_Shift_no: new FormControl(''),
      n_item_net_value_WithoutTax: new FormControl(''),
      ar_sales_invoice_details: this._formBuilder.array([]),
      expenseDetails: this._formBuilder.array([])
    });

    this.isCash = false;
    this.isCredit = false;
    this.isCard = false;
    this.isCashCard = false;
  }
}
