import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Supplier } from 'src/app/Core/Api/AP/supplier.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { PurchaseManComponent } from './popUps/purchase-man/purchase-man.component';
import { TypesComponent } from './popUps/types/types.component';
import { AreaComponent } from './popUps/area/area.component';
import { CommissionComponent } from './popUps/commission/commission.component';

import { BranchComponent } from './popUps/branch/branch.component';
import { AccountsComponent } from './popUps/accounts/accounts.component';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CashService } from 'src/app/Core/Api/FIN/cash.service';
import { PrevComponent } from 'src/app/Admin/prev/prev.component';
import { PrevSelectComponent } from 'src/app/shared/prev-select/prev-select.component';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent extends BaseComponent implements OnInit {


  constructor(
    private fb:FormBuilder
   ,private dialog:MatDialog
   ,private http:HttpClient,
    private _SERVICE:Supplier,
    private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService,
    private userservice:UserService,
    private _lookUp:GenerealLookup,
    private _cash:CashService,

   private _router:Router
  ) {

    super(_activatedRoute.data,userservice);


   


   }

  // END constructor

  // START VARIABLES DECLARTIONS
  //Icons


 ///////////
  showspinner= false;
  classification: any;
  searchingAccounts:boolean=false
  classificationSearching: boolean = false;
  purchaseSearching: boolean = false;
  commessionSearching: boolean = false;
  filteredClassificationServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredTypesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCurrencyServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredBranchServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAreaServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredPurchaseServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCommssionServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccounts1: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccounts2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccounts3: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccounts4: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredaccounts5: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  supplierForm!: FormGroup ;
  DocNo!: any;
  Types:any=[];
  commessions:any=[]
  Accounts: any[]=[];
  PurchaseEmp:any=[]
  areas:any[] =[];
  accounts: any[]=[];
  myDatepipe!: any;
  searchingTypes:any[] =[];
  serachingBranches:any[]=[];
  dtOptions: DataTables.Settings = {};
  Edit: boolean=false;
  @ViewChild("inputshow")inputshow!:ElementRef
  checkForeEmptyTypes:string='';
  checkForeEmptyPRMEN:string='';
  checkForeEmptyArea:string='';
  checkForeEmptyComm:string='';
  checkForeEmptyBranches:string='';
  checkForeEmptyAcc1:string='';
  checkForeEmptyAcc2:string='';
  checkForeEmptyAcc3:string='';
  checkForeEmptyAcc4:string='';
  checkForeEmptyAcc5:string='';
  Add: Boolean=true;
  searchingSupplierTypes:boolean=false;
  searchingArea:boolean=false
  searchingBranch:boolean=false;
  branch:any=[]
  area:any=[]
  DataAreaNo: any;
  @Input("area") areaInput!:HTMLElement;
  supplierArea:any='';
  supplierType:any='';
  supplierPurchaseMan:any='';
  supplierCommission:any='';
  Account:any []=[];
  branchType:any='';
  Acounts:any [] =[]
  Branches:any []=[];
  serachingAREA:any[]=[];
  units:any [] =[];
  Commissions:any[]=[];
  isEnglish:boolean=false;
  serachingPR:any[]=[];
  serachingCM:any[]=[];
  searchingVlues:any[]=[];
  supplierPurchaseManLKP:any[]=[]
  ShowId:boolean=false
  @ViewChild(PrevSelectComponent) prevComponent!:PrevSelectComponent;
   // END VARIABLES DECLARTIONS


  //  START HOOKS METHODS
   override ngOnInit(): void {
  
 // FORM DEFIFNITION
 this.supplierForm = this.fb.group({
  n_supplier_type_id: ['',Validators.required],
  s_supplier_type_name:[''],
  s_related_account_name:'',
  s_agreement_discount_acc_name:[''],
  s_advanced_payment_acc_name:[''],
  s_guarantees_reserved_primary_acc_name:[''],
  s_guarantees_reserved_final_acc_name:[''],
  n_DataAreaID: '',
  n_supplier_id : [''],
  n_current_branch:[''],
  s_branch_name:[''],
  s_supplier_name : ['',Validators.required],
  s_supplier_name_eng:'',
  s_supplier_address  :'',
   s_supplier_phone_no :[''],
   s_supplier_fax_no :'',
   s_supplier_web_page :"",
   n_supplier_credit_limit :['',Validators.required],
   n_supplier_payment_period :'',
   n_open_balance :'',
   d_open_balance_date :'',
   n_open_balance_currency_id :'',
   n_open_balance_nature :'',
   n_current_balance :'',
   d_current_balance_date :'',
   n_current_balance_currency_id :'',
   n_current_balance_nature :'',
   s_related_account_no :['',[Validators.required]],
   n_supplier_credit_limit_reaction :'',
   d_curr_sys_date :'',
   n_curr_replicated_id :'',
   n_curr_closed_id :'',
   s_curr_user_id :'',
   s_account_with_supp :'',
   s_sort_key :'',
   d_date_transaction :'',
   n_currency_coff :'',
   n_serial :'',
   n_Protected :'',
   s_AttachmentPerson :'',
   n_Trans_Debit :'',
   n_Trans_Credit :'',
   SuppBalance :'',
   s_zipcode :'',
   s_pobox :'',
   n_area_id :['',Validators.required],

   s_PersonTel :'',
   n_TaxPlaceId :'',
   s_TaxCardNo :'',
   s_TaxFileNo :'',
   n_useSalesTax :'',
   n_UserAdd :'',
   d_UserAddDate :'',
   n_UserUpdate :'',
   d_UserUpdateDate :'',
   b_Deleted :'',
   n_purchaseMan_id :[''],
   s_purchaseMan_name:[''],
   n_credit_limit_reaction :'',
   n_supplier_class :'',
   n_taxes_type :'',
   sVatNo :'',
   n_cheque_type :'',
   s_beneficiary_name :'',
   d_supplier_date_add :'',
   s_IBAN :'',
   s_SwiftCode :'',
   s_TransferToAccount :'',
   s_Country :'',
   s_City :'',
   s_Address :'',
   n_bank_commission :'',
   n_current_year :'',
   n_current_company :'',

   s_agreement_discount_acc :[''],
   s_branches :'',
   s_hid :'',
   b_is_direct :'',
   b_stop :'',
   n_selective_tax_type :'',
   n_dealing_type :'',
   s_advanced_payment_acc :[''],
   s_guarantees_reserved_primary_acc :[''],
   s_guarantees_reserved_final_acc :[''],
   s_file_no :'',
   s_tax_office :'',
   n_commision_type :[''],
   s_commision_name:'',
   n_type :'',
   n_supplier_category :'',
   s_segl_no :'',
   s_sader :'',

  });
  // END FORM DEFIFNTION


    this.isEnglish=LangSwitcher.CheckLan();
    this.searchSupplierTypes('');
    this.searchBranch('');
    this.searchArea('');
    this.searchPurchaseEmp('');
    this.searchCommission('');
    this.searchAccounts('',1)
    this.searchAccounts('',2)
    this.searchAccounts('',3)
    this.searchAccounts('',4)
    this.searchAccounts('',5)
    this.searchClassification('');


    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
   
    this.supplierForm.get("n_supplier_id")?.patchValue(this.DocNo);

 


//EXCUTE IN UPDATING MODE
   if(this.DocNo !=null && this.DocNo > 0 ){
   
    this.showspinner=true;
      this._SERVICE.GetByID(this.DocNo).subscribe(data=>{
        this.ShowId=true;
        let s=data["s_AttachmentPerson"]
        data.s_branches=data.s_branches?.slice(1, -1)?.split(',').map(value=>Number(value));
        this.supplierForm.patchValue(data);
        let t=this.supplierForm.value.n_area_id;

      
        this.Add=false;
        this.Edit=true;
        this.showspinner=false;
        this.prevComponent.ngOnInit();
      
      });

    }

    LangSwitcher.translateData(1)
    LangSwitcher.translatefun();
  
  }

  // END HOOKS METHODS


  // START FUNCTIONS
  disableButtons() {

    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }


  searchClassification(value:any)
  {
    debugger
   this.classificationSearching=true;
   this._SERVICE.GetClassification().subscribe(data=>{
    debugger
     this.classification=data;
     this.filteredClassificationServerSide.next(this.classification.filter(x=>x.s_name.toLowerCase().indexOf(value)>-1));
     this.classificationSearching=false
   })
  }
  searchSupplierTypes(value:any)
  {
    
   this.searchingSupplierTypes=true;
   this._SERVICE.SuppliersTypes(value).subscribe(data=>{
   
     this.Types=data;
     
     this.filteredTypesServerSide.next(this.Types.filter(x=>x.s_supplier_type_name.toLowerCase().indexOf(value)>-1));
     this.searchingSupplierTypes=false
   })
  }
  searchBranch(value:any)
  {
    
   this.searchingBranch=true;
   this._SERVICE.SearchBranch(value).subscribe(data=>{
    
     this.branch=data;
     this.filteredBranchServerSide.next(this.branch.filter(x=>x.s_branch_name.toLowerCase().indexOf(value)>-1));
     this.searchingBranch=false
   })
  }
  searchArea(value:any)
  {
    
   this.searchingArea=true;
   this._SERVICE.SearchArea(value).subscribe(data=>{
       this.areas=data;
     this.filteredAreaServerSide.next(this.areas.filter(x=>x.s_area_name.toLowerCase().indexOf(value)>-1));
     this.searchingArea=false
   })
  }
  searchPurchaseEmp(value:any)
  {
    
   this.purchaseSearching=true;
   this._SERVICE.PurchaseEmp(value).subscribe(data=>{

     this.PurchaseEmp=data;
     this.filteredPurchaseServerSide.next(this.PurchaseEmp.filter(x=>x.s_employee_name.toLowerCase().indexOf(value)>-1));
     this.searchingBranch=false
   })
  }
  searchCommission(value:any)
  {
    
   this.commessionSearching=true;
   this._SERVICE.SearchCommission(value).subscribe(data=>{

     this.commessions=data;
     this.filteredCommssionServerSide.next(this.commessions.filter(x=>x.s_commission_type_name.toLowerCase().indexOf(value)>-1));
     this.commessionSearching=false
   })
  }
  searchAccounts(value :any,type){

    this.searchingAccounts=true;
    if(type ==1)
      {
        this._cash.GetAccounts(value).subscribe(res=>{
          this.Accounts=res;
          this.filteredaccounts1.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
          this.searchingAccounts=false;
        });
      }
      else if(type==2)
        this._cash.GetAccounts(value).subscribe(res=>{
          this.Accounts=res;
          this.filteredaccounts2.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
          this.searchingAccounts=false;
        });
    else if(type==3){
      this._cash.GetAccounts(value).subscribe(res=>{
        this.Accounts=res;
        this.filteredaccounts3.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
        this.searchingAccounts=false;
      });
    }
    else if(type==4){
      this._cash.GetAccounts(value).subscribe(res=>{
        this.Accounts=res;
        this.filteredaccounts4.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
        this.searchingAccounts=false;
      });
    }
    else if(type==5){
      this._cash.GetAccounts(value).subscribe(res=>{
        this.Accounts=res;
        this.filteredaccounts5.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
        this.searchingAccounts=false;
      });
    }
  
  
    
  }
  


















  




//end seraching functions

   save()
   {
  if(this.supplierForm.get("s_supplier_name")?.invalid  )
  {
    this.showspinner=false;
    if(this.isEnglish)
        this._notification.ShowMessage('Please supplier name',3)
    else
        this._notification.ShowMessage("منفضلك  اسم المورد",3)
    return
  }

  if(this.supplierForm.get("s_related_account_no")?.invalid)
  {
    this.showspinner=false;
    if(this.isEnglish)
    this._notification.ShowMessage("Please insert an account",3)
    else
    this._notification.ShowMessage("منفضلك  ادخل الحساب ",3)
    return
  }


  var formData: any = new FormData();
  formData.append("n_supplier_id",this.supplierForm.value.n_supplier_id ?? 0);
  formData.append("n_supplier_type_id",this.supplierForm.value.n_supplier_type_id ??  0);
  
  formData.append("n_DataAreaID",this.supplierForm.value.n_DataAreaID ??  0);
  formData.append("n_UserAdd",this.supplierForm.value.n_UserAdd ??  0);
  formData.append("d_UserAddDate",this.supplierForm.value.d_UserAddDate ??  '');
  formData.append("n_UserUpdate",this.supplierForm.value.n_UserUpdate ??  0);
  formData.append("d_UserUpdateDate",this.supplierForm.value.d_UserUpdateDate ??  '');

  formData.append("s_supplier_name",this.supplierForm.value.s_supplier_name) ?? '';
  formData.append("s_supplier_name_eng",this.supplierForm.value.s_supplier_name_eng);
  formData.append("n_type",Number(this.supplierForm.value.n_type));
  formData.append("s_pobox",this.supplierForm.value.s_pobox);
  formData.append("s_supplier_fax_no",this.supplierForm.value.s_supplier_fax_no);
  formData.append("b_stop",this.supplierForm.value.b_stop ?? false);
  formData.append("s_zipcode",this.supplierForm.value.s_zipcode);
  formData.append("s_AttachmentPerson",this.supplierForm.value.s_AttachmentPerson);
  formData.append("n_taxes_type",this.supplierForm.value.n_taxes_type?? 0);
  formData.append("s_PersonTel",this.supplierForm.value.s_PersonTel);
  formData.append("s_supplier_phone_no",this.supplierForm.value.s_supplier_phone_no);
  formData.append("sVatNo",this.supplierForm.value.sVatNo);//
  formData.append("n_purchaseMan_id",this.supplierForm.value.n_purchaseMan_id);//////
  formData.append("s_file_no",this.supplierForm.value.s_file_no);
  formData.append("s_tax_office",this.supplierForm.value.s_tax_office);///////////////
  formData.append("n_selective_tax_type",this.supplierForm.value.n_selective_tax_type ?? 0);
  formData.append("s_account_with_supp",this.supplierForm.value.s_account_with_supp);////////
  formData.append("n_area_id",this.supplierForm.value.n_area_id);////////
  formData.append("s_supplier_address",this.supplierForm.value.s_supplier_address);//////////////////
  formData.append("n_supplier_payment_period",this.supplierForm.value.n_supplier_payment_period ?? 0);///////////////
  formData.append("s_supplier_web_page",this.supplierForm.value.s_supplier_web_page);
  formData.append("n_supplier_class",this.supplierForm.value.n_supplier_class);////////////////////
  formData.append("n_commision_type",this.supplierForm.value.n_commision_type);////////////
  formData.append("s_related_account_no",this.supplierForm.value.s_related_account_no);///////////////////////
  formData.append("s_agreement_discount_acc",this.supplierForm.value.s_agreement_discount_acc);/////////
  formData.append("s_advanced_payment_acc",this.supplierForm.value.s_advanced_payment_acc);/////////////
  formData.append("s_guarantees_reserved_primary_acc",this.supplierForm.value.s_guarantees_reserved_primary_acc);
  formData.append("s_guarantees_reserved_final_acc",this.supplierForm.value.s_guarantees_reserved_final_acc);/////
  formData.append("s_beneficiary_name",this.supplierForm.value.s_beneficiary_name);/////////////
  formData.append("n_cheque_type",this.supplierForm.value.n_cheque_type);////////////////

  formData.append("s_IBAN",this.supplierForm.value.s_IBAN);///////
  formData.append("s_SwiftCode",this.supplierForm.value.s_SwiftCode);
  formData.append("s_TransferToAccount",this.supplierForm.value.s_TransferToAccount);////////////////////
  formData.append("s_Country",this.supplierForm.value.s_Country);
  formData.append("s_City",this.supplierForm.value.s_City);/////
  formData.append("s_Address",this.supplierForm.value.s_Address);
  formData.append("n_current_branch",this.supplierForm.value.n_current_branch?? 0);

  formData.append("b_is_direct",this.supplierForm.value.b_is_direct ?? false );
  formData.append("n_supplier_category", this.supplierForm.value.n_supplier_category ?? 0 );
  formData.append("n_supplier_credit_limit", this.supplierForm.value.n_supplier_credit_limit ?? 0 );
  formData.append("n_credit_limit_reaction", this.supplierForm.value.n_credit_limit_reaction ?? 0 );
  formData.append("n_dealing_type", this.supplierForm.value.n_dealing_type ?? 0 );
  
  if(this.supplierForm.value?.s_branches !=undefined || this.supplierForm.value?.s_branches!=null)
    {
          
         
         const branchsKeys=Object.keys(this.supplierForm.value.s_branches)
         let arrbranches=","+branchsKeys.map(key => this.supplierForm.value.s_branches[key]).join(',')+",";
         formData.append("s_branches",arrbranches);
         
   }
  this.showspinner=true;
  this.disableButtons();
  if(this.DocNo != null && this. DocNo > 0)
  {
    this._SERVICE.Update(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage(data.Emsg,data.status)
      else
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1){


        this._router.navigate(['/ap/supplierList']);
       
      }


  });

  }
  else
  {
    this._SERVICE.Save(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
          this._notification.ShowMessage(data.Emsg,data.status)
       else
          this. _notification.ShowMessage(data.msg,data.status);
       if(data.status==1){


         this._router.navigate(['/ap/supplierList']);
         
       }



   });

  }


   }

  // END FUNCTIONS
}
