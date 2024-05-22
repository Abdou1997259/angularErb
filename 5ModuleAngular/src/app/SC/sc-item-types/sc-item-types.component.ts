import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { ScItemTypesService } from 'src/app/Core/Api/SC/sc-item-types.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';

@Component({
  selector: 'app-sc-item-types',
  templateUrl: './sc-item-types.component.html',
  styleUrls: ['./sc-item-types.component.css'],
})
export class ScItemTypesComponent implements OnInit {
  typesForm!: FormGroup;
  nItemTypeId: number = 0;
  filteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searching: boolean = false;
  categories!: any;
  dropdownList!: any[];
  dropdownSettings: IDropdownSettings = {};
  showspinner: boolean = true;
  rowId: any;
  docNo: any;
  DataAreaNo: any;
  discountLST!: any;
 isEnglish:boolean=false;

  categoriesList: any[] = [];
  searchingCategories:boolean=false;
  filteredServerSideCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  relatedAccs: any[] = [];
  searchingRelatedAcc:boolean=false;
  filteredServerSideRelatedAcc: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  expensesAccs: any[] = [];
  searchingExpensesAcc:boolean=false;
  filteredServerSideExpensesAcc: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    private _service: ScItemTypesService,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationServiceService,
    private _router: Router,
    private _activRoute: ActivatedRoute,
    private _LookupControlService: LookupControlService
  ) {
    this.typesForm = this._formBuilder.group({
      n_DataAreaID: [''],
      n_UserAdd: [''],
      d_UserAddDate: [''],
      n_UserUpdate: [''],
      d_UserUpdateDate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      n_item_type:[''],
      s_item_type_name:['',Validators.required],
      s_item_type_name_eng: [''],
      n_discount_rate: [''],
      n_category_id:[''],
      b_pos: [''],
      // s_printer_name: [''],
      s_type_related_account: [''],
      s_type_Expense_account: ['',Validators.required],
      itemDiscountLST: this._formBuilder.array([])
    });
  }

  get itemDiscountLST(): FormArray {
    return this.typesForm.get('itemDiscountLST') as FormArray;
  }

  ngOnInit(): void {
    this.search('');
    this.searchCategories('');
    this.searchIncomeAccounts('');
    this.searchExpensesAccounts('');

    this.docNo = this._activRoute.snapshot.paramMap.get('id');
    if (this.docNo != null && this.docNo > 0) {
      this.showspinner = true;
      this._service.getItemTypeById(this.docNo).subscribe((data) => {
        this.typesForm.patchValue(data);
        this._LookupControlService.SetName(this.typesForm, "acc", "s_type_related_account", "relatedName");
        this._LookupControlService.SetName(this.typesForm, "acc", "s_type_Expense_account", "expensesName");

        this.nItemTypeId = data['n_item_type'];
        this.DataAreaNo = data['n_DataAreaID'];
        // this.typesForm.patchValue({s_printer_name: data["s_printer_name"]});
        data['sc_item_types_discount_lst'].forEach(element => {
          (this.typesForm.get('itemDiscountLST') as FormArray)?.push(this._formBuilder.group({
            n_DataAreaID: element.n_DataAreaID,
            n_item_type: element.n_item_type,
            n_line_no: element.n_line_no,
            n_Branch_Id: element.n_Branch_Id,
            n_discount_ratio: element.n_discount_ratio
          }));
        });

      });
    }
    else{
      this._service.getCurrentItemId().subscribe((data) => {

        this.nItemTypeId = data;
        this._service.getBranchDiscount().subscribe((data) => {
          data.forEach(element => {
            (this.typesForm.controls['itemDiscountLST'] as FormArray).push(this._formBuilder.group({
              n_DataAreaID: element.n_DataAreaID,
              n_item_type: element.n_item_type,
              n_line_no: element.n_line_no,
              n_Branch_Id: element.n_Branch_Id,
              n_discount_ratio: element.n_discount_ratio
            }));
          });
        });

      });
    }
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  search(value: any) {
    this.searching = true;
    this._service.getCategoriesLST().subscribe((res) => {
      this.categories = res;
      this.filteredServerSide.next(
        this.categories.filter(
          (x) => x.s_category_name.toLowerCase().indexOf(value) > -1
        )
      );
      this.searching = false;
    });
  }
  
  searchCategories(value: any){
    this.searchingCategories=true;
    this._service.GetClassCategories(value).subscribe(res=>{
      this.categoriesList=res;
      this.filteredServerSideCategories.next(this.categoriesList.filter(x => x.s_category_name.toLowerCase().indexOf(value) > -1));
      this.searchingCategories=false;
    })
  }

  searchIncomeAccounts(value: any){
    this.searchingRelatedAcc=true;
    this._service.GetRelatedAcc(value).subscribe(res=>{
      this.relatedAccs=res;
      this.filteredServerSideRelatedAcc.next(this.relatedAccs.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingRelatedAcc=false;
    })
  }

  searchExpensesAccounts(value: any){
    this.searchingExpensesAcc=true;
    this._service.GetExpensesAcc(value).subscribe(res=>{
      this.expensesAccs=res;
      this.filteredServerSideExpensesAcc.next(this.expensesAccs.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingExpensesAcc=false;
    })
  }

  Save() {
 if(this.typesForm.get("s_item_type_name")?.invalid)
 {
  if(this.isEnglish)
    this._notificationService.ShowMessage("Inseart item type name",3)
  else
    this._notificationService.ShowMessage("ادخل اسم النوع",3)
  
   
    return;
 }



    this.showspinner = true;
    var formData: any = new FormData();
    formData.append('n_DataAreaID', this.typesForm.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.typesForm.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.typesForm.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.typesForm.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.typesForm.value.d_UserUpdateDate ?? '');
    formData.append('n_current_branch', this.typesForm.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.typesForm.value.n_current_company ?? 0);
    formData.append('n_current_year', this.typesForm.value.n_current_year ?? 0);
    formData.append('s_item_type_name', this.typesForm.value.s_item_type_name);
    formData.append('s_item_type_name_eng', this.typesForm.value.s_item_type_name_eng);
    formData.append('n_discount_rate', Number(this.typesForm.value.n_discount_rate) ?? 0);
    formData.append('n_category_id', this.typesForm.value.n_category_id ?? 0);
    formData.append('s_type_related_account', this.typesForm.value.s_type_related_account ?? '');
    formData.append('s_type_Expense_account', this.typesForm.value.s_type_Expense_account ?? '');
    formData.append('n_item_type', this.nItemTypeId ?? 0);
    formData.append('b_pos', this.typesForm.value.b_pos);

    // var text: string = '';
    // if(this.typesForm.value.s_printer_name !== '') {
    //   this.typesForm.value.s_printer_name.forEach((element) => {
    //     text += element.s_printer_name + ',';
    //   });
    // }
    // formData.append('s_printer_name', text);

    if (this.docNo != null && this.docNo > 0) {
      this._service.edit(formData).subscribe((data) => {
        this.showspinner = false;
        if(this.isEnglish)
        this._notificationService.ShowMessage(data.Emsg,data.status)
        else 
        this._notificationService.ShowMessage(data.msg,data.status)
        
        if (data.status == 1) {
          this._router.navigate(['/sc/scitemtypeslist']);
        }
      });
    } else {
      this._service.post(formData).subscribe((data) => {
        this.showspinner = false;
        if(this.isEnglish)
        this._notificationService.ShowMessage(data.Emsg,data.status)
        else 
        this._notificationService.ShowMessage(data.msg,data.status)
        if (data.status == 1) {
          this._router.navigate(['/sc/scitemtypeslist']);
          this.typesForm = this._formBuilder.group({
            n_item_type: 0,
            s_item_type_name: ['',Validators.required],
            s_item_type_name_eng: '',
            n_discount_rate: new FormControl(''),
            n_category_id: new FormControl(''),
            s_type_related_account: new FormControl(''),
            s_type_Expense_account: new FormControl(''),
            b_pos: false,
            // s_printer_name: ''
          });
        }
      });
    }
  }

  isNumberKey(evt)
  {
     var charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode != 46 && charCode > 31
       && (charCode < 48 || charCode > 57) || charCode == 45)
        return false
     return true;
  }
}
