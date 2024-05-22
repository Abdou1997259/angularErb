import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { ScSettingsService } from 'src/app/Core/Api/SC/sc-settings.service';
import { Options } from 'src/app/Core/model/Gl/Options';
import { RelatedAcc } from 'src/app/Core/model/Gl/RelatedAcc';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-sc-general-settings',
  templateUrl: './sc-general-settings.component.html',
  styleUrls: ['./sc-general-settings.component.css']
})
export class ScGeneralSettingsComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  scSettingsForm!: FormGroup;
  relatedAcc: Array<RelatedAcc> = [];
  options: Array<Options> = [];
  onEyeList: any[] = [];
  showspinner: boolean = false;
  filteredServerSideRelatedAcc: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredServerSideOrder: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredServerSidePrice: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredServerSidePrint: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredServerSideOnEye: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searching:boolean=false;
  searchingOrder: boolean = false;
  searchingPrice: boolean = false;
  searchingPrint: boolean = false;
  searchingOnEye: boolean = false;
  isGoodCostShow: boolean = false;
  isOneStoreInGl: boolean = false;

  radioValue: boolean = false;
  b_PeriodicChecked: boolean = false;
  b_PerpetualChecked: boolean = false;

  accountRadio: boolean = false;
  b_MultiGoodsCostOnStoreChecked: boolean = false;
  b_GoodsCostOnStoreChecked: boolean = false;

  accUseRadio: boolean = false;
  b_multi_stores_in_glChecked: boolean = false;
  b_one_stores_in_glChecked: boolean = false;
isEnglish:boolean=false;
  constructor(private _scService: ScSettingsService, private fb: FormBuilder, private _notificationService: NotificationServiceService,) {
    this.scSettingsForm = this.fb.group({
      n_DataAreaID: new FormControl(''),
      d_UserAddDate: new FormControl(''),
      d_UserUpdateDate: new FormControl(''),
      n_current_branch: new FormControl(''),
      n_current_company: new FormControl(''),
      n_current_year: new FormControl(''),
      n_lower_limit_trans_allow: new FormControl('0'),
      n_safe_allow: new FormControl('0'),
      b_on_eye: new FormControl(''),
      b_store_on_eye: new FormControl(''),
      n_maximum_limit_trans_allow: new FormControl('0'),
      n_reorder_limit_trans_allow: new FormControl('0'),
      b_items_control_msg: new FormControl(''),
      b_store_limit_watch: new FormControl(''),
      b_use_character_in_items: new FormControl(''),
      n_InTransPriceType: new FormControl('0'),
      b_use_cost_by_currentDate: new FormControl(''),
      b_allow_repeat_itemName: new FormControl(''),
      b_activate_TransSource: new FormControl(''),
      b_disable_manual_cost: new FormControl(''),
      b_not_control_item_collections: new FormControl(''),
      b_itemCode_by_group: new FormControl(''),
      b_use_sizes: new FormControl(''),
      b_show_import_order_no: new FormControl(''),
      b_activate_itemBarcode_as_itemCode: new FormControl(''),
      b_activate_stock_trans_sellprice: new FormControl(''),
      b_use_item_serial: new FormControl(''),
      b_use_barcode_stock_transfere_out: new FormControl(''),
      b_prevent_Stocktransfere_without_TransSource: new FormControl(''),
      n_print_re: new FormControl('0'),
      b_Periodic: new FormControl(''),
      b_Perpetual: new FormControl(''),
      b_link_with_gl: new FormControl(''),
      b_show_journal_in_trans: new FormControl(''),
      b_CreateStockJournal: new FormControl(''),
      b_Group_journal: new FormControl(''),
      b_MultiGoodsCostOnStore: new FormControl(''),
      b_GoodsCostOnStore: new FormControl(''),
      b_useGoodsInRoad: new FormControl(''),
      b_activate_cost_center_stock_diff_cost: new FormControl(''),
      s_GoodsInRoad_Account: new FormControl(''),
      s_trans_out_related_acc: new FormControl(''),
      s_trans_in_related_acc: new FormControl(''),
      b_multi_stores_in_gl: new FormControl(''),
      b_one_stores_in_gl: new FormControl(''),
      s_gifts_account: new FormControl(''),
      b_control_gift_account: new FormControl(''),
      b_control_scrape_account: new FormControl(''),
      s_scrape_account: new FormControl(''),
      s_settlement_account: new FormControl(''),
      s_Items_Collect_Separate_Acc: new FormControl(''),
      s_stock_clearance_acc: new FormControl(''),
      s_GoodsCost_Account: new FormControl(''),
      s_related_account_no: new FormControl(''),
      s_cost_diff_acc: new FormControl(''),
      n_on_eye_re: new FormControl('')
    });
   }

  ngOnInit(): void {
    this.search('');
    this.orderOptions('');
    this.priceOptions('');
    this.printOptions('');
    this.OnEyeOptions('');

    this._scService.getCurrentCompanyConfig().subscribe((data) => {
      this.scSettingsForm.patchValue(data);
    });

    this.scSettingsForm.get('b_Periodic')?.valueChanges.subscribe((value) => {
      if (value) {
        this.scSettingsForm.get('b_Perpetual')?.setValue(false);
      }
    });

    this.scSettingsForm.get('b_Perpetual')?.valueChanges.subscribe((value) => {
      if (value) {
        this.scSettingsForm.get('b_Periodic')?.setValue(false);
      }
    });

    this.scSettingsForm.get('b_MultiGoodsCostOnStore')?.valueChanges.subscribe((value) => {
      if (value) {
        this.scSettingsForm.get('b_GoodsCostOnStore')?.setValue(false);
        this.isGoodCostShow = false;
      }
    });

    this.scSettingsForm.get('b_GoodsCostOnStore')?.valueChanges.subscribe((value) => {
      if (value) {
        this.scSettingsForm.get('b_MultiGoodsCostOnStore')?.setValue(false);
        this.isGoodCostShow = true;
      }
    });

    this.scSettingsForm.get('b_multi_stores_in_gl')?.valueChanges.subscribe((value) => {
      if (value) {
        this.scSettingsForm.get('b_one_stores_in_gl')?.setValue(false);
        this.isOneStoreInGl = false;
      }
    });

    this.scSettingsForm.get('b_one_stores_in_gl')?.valueChanges.subscribe((value) => {
      if (value) {
        this.scSettingsForm.get('b_multi_stores_in_gl')?.setValue(false);
        this.isOneStoreInGl = true;
      }
    });

    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

 search(value: any){
   this.searching=true;
   this._scService.getScAccounts().subscribe(res=>{
     this.relatedAcc=res;
     this.filteredServerSideRelatedAcc.next(this.relatedAcc.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
     this.searching=false;
   })
 }

 orderOptions(value: any){
  this.searchingOrder=true;
  this._scService.getOrderOptions().subscribe(res=>{
    this.options=res;
    this.filteredServerSideOrder.next(this.options.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
    this.searchingOrder=false;
  })
}

priceOptions(value: any){
  this.searchingPrice=true;
  this._scService.getPriceOptions().subscribe(res=>{
    this.options=res;
    this.filteredServerSidePrice.next(this.options.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
    this.searchingPrice=false;
  })
}

printOptions(value: any){
  this.searchingPrint=true;
  this._scService.getPrintOptions().subscribe(res=>{
    this.options=res;
    this.filteredServerSidePrint.next(this.options.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
    this.searchingPrint=false;
  })
}

  OnEyeOptions(value: any){
  this.searchingOnEye=true;
  this._scService.GetOnEyeOptions().subscribe(res=>{
    this.onEyeList=res;
    this.filteredServerSideOnEye.next(this.onEyeList.filter(x => x.name_arabic.toLowerCase().indexOf(value) > -1));
    this.searchingOnEye=false;
  })
}

 Save() {
  this.showspinner = true;
  var formData: any = new FormData();

  formData.append('n_DataAreaID', this.scSettingsForm.value.n_DataAreaID ?? 0);
  formData.append('d_UserAddDate', this.scSettingsForm.value.d_UserAddDate ?? '');
  formData.append('d_UserUpdateDate', this.scSettingsForm.value.d_UserUpdateDate ?? '');
  formData.append('n_lower_limit_trans_allow', this.scSettingsForm.value.n_lower_limit_trans_allow ?? 0);
  formData.append('n_safe_allow', this.scSettingsForm.value.n_safe_allow ?? 0);
  formData.append('b_on_eye', this.scSettingsForm.value.b_on_eye ?? false);
  formData.append('b_store_on_eye', this.scSettingsForm.value.b_store_on_eye ?? false);
  formData.append('n_maximum_limit_trans_allow', this.scSettingsForm.value.n_maximum_limit_trans_allow ?? 0);
  formData.append('n_reorder_limit_trans_allow', this.scSettingsForm.value.n_reorder_limit_trans_allow ?? 0);
  formData.append('b_items_control_msg', this.scSettingsForm.value.b_items_control_msg ?? false);
  formData.append('b_store_limit_watch', this.scSettingsForm.value.b_store_limit_watch ?? false);
  formData.append('b_use_character_in_items', this.scSettingsForm.value.b_use_character_in_items ?? false);
  formData.append('n_InTransPriceType', this.scSettingsForm.value.n_InTransPriceType ?? 0);
  formData.append('b_use_cost_by_currentDate', this.scSettingsForm.value.b_use_cost_by_currentDate ?? false);
  formData.append('b_allow_repeat_itemName', this.scSettingsForm.value.b_allow_repeat_itemName ?? false);
  formData.append('b_activate_TransSource', this.scSettingsForm.value.b_activate_TransSource ?? false);
  formData.append('b_disable_manual_cost', this.scSettingsForm.value.b_disable_manual_cost ?? false);
  formData.append('b_not_control_item_collections', this.scSettingsForm.value.b_not_control_item_collections ?? false);
  formData.append('b_itemCode_by_group', this.scSettingsForm.value.b_itemCode_by_group ?? false);
  formData.append('b_use_sizes', this.scSettingsForm.value.b_use_sizes ?? false);
  formData.append('b_show_import_order_no', this.scSettingsForm.value.b_show_import_order_no ?? false);
  formData.append('b_activate_itemBarcode_as_itemCode', this.scSettingsForm.value.b_activate_itemBarcode_as_itemCode ?? false);
  formData.append('b_activate_stock_trans_sellprice', this.scSettingsForm.value.b_activate_stock_trans_sellprice ?? false);
  formData.append('b_use_item_serial', this.scSettingsForm.value.b_use_item_serial ?? false);
  formData.append('b_use_barcode_stock_transfere_out', this.scSettingsForm.value.b_use_barcode_stock_transfere_out ?? false);
  formData.append('b_prevent_Stocktransfere_without_TransSource', this.scSettingsForm.value.b_prevent_Stocktransfere_without_TransSource ?? false);
  formData.append('n_print_re', this.scSettingsForm.value.n_print_re ?? 0);
  formData.append('s_related_account_no', this.scSettingsForm.value.s_related_account_no ?? '');
  formData.append('s_cost_diff_acc', this.scSettingsForm.value.s_cost_diff_acc ?? '');
  formData.append('n_current_branch', this.scSettingsForm.value.n_current_branch ?? 0);
  formData.append('n_current_company', this.scSettingsForm.value.n_current_company ?? 0);
  formData.append('n_current_year', this.scSettingsForm.value.n_current_year ?? 0);
  formData.append('b_Periodic', this.scSettingsForm.value.b_Periodic ?? false);
  formData.append('b_Perpetual', this.scSettingsForm.value.b_Perpetual ?? false);
  formData.append('b_MultiGoodsCostOnStore', this.scSettingsForm.value.b_MultiGoodsCostOnStore ?? false);
  formData.append('b_GoodsCostOnStore', this.scSettingsForm.value.b_GoodsCostOnStore ?? false);
  formData.append('b_multi_stores_in_gl', this.scSettingsForm.value.b_multi_stores_in_gl ?? false);
  formData.append('b_one_stores_in_gl', this.scSettingsForm.value.b_one_stores_in_gl ?? false);
  formData.append('b_link_with_gl', this.scSettingsForm.value.b_link_with_gl ?? false);
  formData.append('b_show_journal_in_trans', this.scSettingsForm.value.b_show_journal_in_trans ?? false);
  formData.append('b_CreateStockJournal', this.scSettingsForm.value.b_CreateStockJournal ?? false);
  formData.append('b_Group_journal', this.scSettingsForm.value.b_Group_journal ?? false);
  formData.append('b_useGoodsInRoad', this.scSettingsForm.value.b_useGoodsInRoad ?? false);
  formData.append('b_activate_cost_center_stock_diff_cost', this.scSettingsForm.value.b_activate_cost_center_stock_diff_cost ?? false);
  formData.append('b_print_journals_after_save', this.scSettingsForm.value.b_print_journals_after_save ?? false);
  formData.append('s_GoodsInRoad_Account', this.scSettingsForm.value.s_GoodsInRoad_Account ?? '');
  formData.append('s_trans_out_related_acc', this.scSettingsForm.value.s_trans_out_related_acc ?? '');
  formData.append('s_trans_in_related_acc', this.scSettingsForm.value.s_trans_in_related_acc ?? '');
  formData.append('s_gifts_account', this.scSettingsForm.value.s_gifts_account ?? '');
  formData.append('b_control_gift_account', this.scSettingsForm.value.b_control_gift_account ?? false);
  formData.append('b_control_scrape_account', this.scSettingsForm.value.b_control_scrape_account ?? false);
  formData.append('s_scrape_account', this.scSettingsForm.value.s_scrape_account ?? '');
  formData.append('s_settlement_account', this.scSettingsForm.value.s_settlement_account ?? '');
  formData.append('s_Items_Collect_Separate_Acc', this.scSettingsForm.value.s_Items_Collect_Separate_Acc ?? '');
  formData.append('s_stock_clearance_acc', this.scSettingsForm.value.s_stock_clearance_acc ?? '');
  formData.append('s_GoodsCost_Account', this.scSettingsForm.value.s_GoodsCost_Account ?? '');
  formData.append('n_on_eye_re', this.scSettingsForm.value.n_on_eye_re ?? 0);

  this._scService.post(formData).subscribe(data => {
    this.showspinner = false;
    if(this.isEnglish)
    this._notificationService.ShowMessage(data.Emsg, data.status);
     else
     this._notificationService.ShowMessage(data.msg, data.status);
    // if (data.status == 1) {
    //   this._router.navigate(['/accounts-settings/accountsetup']);
    // }
  });
}

OnEyeChanged()
{
  var value = Number(this.scSettingsForm.get('n_on_eye_re')?.value);
}

ApplyAll()
{
  var value = Number(this.scSettingsForm.get('n_on_eye_re')?.value);
  this._scService.ApplyAll(value).subscribe((data) => {
    if(this.isEnglish)
      this._notificationService.ShowMessage(data.Emsg, data.status);
    else
      this._notificationService.ShowMessage(data.msg, data.status);
    if(data.status==1){
      this.closebutton.nativeElement.click();
    }
  });
}
}
