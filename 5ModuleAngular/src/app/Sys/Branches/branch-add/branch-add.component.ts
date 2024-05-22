import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BranchConfigService } from 'src/app/Core/Api/Sys/branch-config.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
  styleUrls: ['./branch-add.component.css']
})
export class BranchAddComponent implements OnInit {
  constructor(
    private fb:FormBuilder,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private dialog:MatDialog,
    private _SERVICE:BranchConfigService,
    private _notification: NotificationServiceService
    ) {
   
  }
  //end Constructor
  
  //Onint
  ngOnInit(): void {
    debugger
    this.IDNo=this.activatedRoute.snapshot.paramMap.get("id");
    
    this.branchForm=this.fb.group({
            n_branch_id :'',
            n_DataAreaID :'',
            n_company_id :'',
            s_branch_name :['',Validators.required],
            s_branch_name_eng :'',
            s_branch_address :'',
            s_branch_phone_no :'',
            s_branch_fax_no :'',
            s_branch_e_mail :'',
            b_Deleted :'',
            d_UserUpdateDate :'',
            n_UserUpdate :'',
            d_UserAddDate :'',
            n_UserAdd :'',
            n_CardType_id :'',
            n_cash_id :'',
            n_store_id :['',Validators.required],
            s_cost_center_id :'',
            n_customer_id :['',Validators.required],
            n_acc_dir_id :['',Validators.required],
            n_customer_serial_from :'',
            n_customer_serial_to :'',
            n_curr_replicated_id :'',
            n_saler_id :['',Validators.required],
            d_curr_sys_date :'',
            s_longitude :'',
            s_latitude :'',
            n_blk_acc_dir_id :'',
            n_discount_ratio :'',
            n_sale_type :'',
            n_supplier_acc_dir_id :['',Validators.required],
            n_cl_dir_no :'',
            n_current_year :'',
            n_current_company :'',
            n_current_branch :'',
            s_branch_ip :'',
            s_db_user_name :'',
            s_db_pass :'',
            n_profit_ratio :'',
            s_cost_center_default :'',
            n_replacement_store_id :['',Validators.required],
            b_stop :'',
            b_selective_tax_in_sellInvoice :'',
            b_selective_tax_in_purchaseInvoice :'',
            n_cards_custody_cash :'',
            n_cards_custody_diff_cash :'',
            n_def_cust_commerical_invoice :['',Validators.required],
            s_branch_commerical_name :'',
            s_branch_tax_no :'',
            s_foodics_token :[''],
            n_default_supplier_id :['',Validators.required],
            s_foodics_refernce :[''],
            n_credit_limit_value :'',
           
    })
  
    if(this.IDNo !=null && this.IDNo > 0 ){
      this.showspinner=true;
      this._SERVICE.GetByID(this.IDNo).subscribe(data=>{
        
        
        this.branchForm.patchValue(data);
       
        this.Add=false;
        this.Edit=true
        this.showspinner=false;
      });
  
  }
  this.SearchCashes('');
  this.SearchCard('');
  this.SearchStore('',1);
  this.SearchStore('',2);
  this.SearchCustomer('',2);
  this.SearchCustomer('',1);
  this.SearchCustomerACC('',1);
  this.SearchCustomerACC('',2);
  this.SearchSupplierACC('');
  this.SearchSeller('');
  this.SearchCostCenter('');
  this.SearchAllSupplier('');
  }
  
  branchForm !:FormGroup
  showspinner=false;
  IDNo!:any;
  Edit: boolean=false;
  Add: Boolean=true;
  DataAreaNo: any;
  cashes:any=[];
  stores:any=[];
  cards:any=[];
  customers:any=[]
  customersACC:any=[]
  SupplierACC:any[]=[]
  Seller:any[]=[]
  AllSearch:any[]=[]
  CostCenter:any[]=[]
  filteredCashesServerSide: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredCardServerSide: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredStoreServerSide1: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredStoreServerSide2: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredCustomerServerSide1: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredCustomerServerSide2: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredCustomerACCServerSide1: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredCustomerACCServerSide2: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredSupplierACCServerSide: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredSellerServerSide: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredCostCenterServerSide: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredAllSupplerServerSide: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  searchingAllSupplier:boolean=false;
  searchingSeller:boolean=false;
  searchingCaches:boolean=false;
  searchingCard:boolean=false;
  searchingStore:boolean=false;
  searchingCustomer:boolean=false;
  searchingCustomerACC:boolean=false;
  searchingSupplierACC:boolean=false;
  searchingCostCenter:boolean=false;
  //end declartion 
  
  
  //function creation
  disableButtons() {
    debugger;
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }
  
  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }
  SearchCashes(value:any)
  {
    
   this.searchingCaches=true;
   this._SERVICE.SearchCashes(value).subscribe(data=>{
   
     this.cashes=data;
     
     this.filteredCashesServerSide.next(this.cashes.filter(x=>x.s_cash_name.toLowerCase().indexOf(value)>-1));
     this.searchingCaches=false
   })
  }
  SearchCard(value:any)
  {
    
   this.searchingCard=true;
   this._SERVICE.SearchCreditTypes(value).subscribe(data=>{
   
     this.cards=data;
     
     this.filteredCardServerSide.next(this.cards.filter(x=>x.s_credit_card_name.toLowerCase().indexOf(value)>-1));
     this.searchingCard=false
   })
  } 
  SearchStore(value:any,number)
  {
    if(number==1){
      this.searchingStore=true;
      this._SERVICE.SearchStores(value).subscribe(data=>{
      
        this.stores=data;
        
        this.filteredStoreServerSide1.next(this.stores.filter(x=>x.s_store_name.toLowerCase().indexOf(value)>-1));
        this.searchingStore=false
      })
    }else
    {  this.searchingStore=true;
      this._SERVICE.SearchStores(value).subscribe(data=>{
      
        this.stores=data;
        
        this.filteredStoreServerSide2.next(this.stores.filter(x=>x.s_store_name.toLowerCase().indexOf(value)>-1));
        this.searchingStore=false
      })

    }
    
  
  }
  SearchCustomer(value:any,number:any)
  {
    debugger
    if(number==1){
      this.searchingCustomer=true;
   this._SERVICE.SearchCustomer(value).subscribe(data=>{
   debugger;
     this.customers=data;
     
     this.filteredCustomerServerSide1.next(this.customers.filter(x=>x.s_customer_name.toLowerCase().indexOf(value)>-1));
     this.searchingCustomer=false
   })
    }
    else{
      this.searchingCustomer=true;
      this._SERVICE.SearchCustomer(value).subscribe(data=>{
      debugger;
        this.customers=data;
        
        this.filteredCustomerServerSide2.next(this.customers.filter(x=>x.s_customer_name.toLowerCase().indexOf(value)>-1));
        this.searchingCustomer=false
      })
    }
 
  }
  SearchCustomerACC(value:any,number)
  {
    if(number==1){
      this.searchingCustomerACC=true;
      this._SERVICE.SearchCustomerAcc(value).subscribe(data=>{
      debugger;
        this.customersACC=data;
        
        this.filteredCustomerACCServerSide1.next(this.customersACC.filter(x=>x.s_acc_dir_name.toLowerCase().indexOf(value)>-1));
        this.searchingCustomerACC=false
      })
    }
    else{
      this.searchingCustomerACC=true;
      this._SERVICE.SearchCustomerAcc(value).subscribe(data=>{
      debugger;
        this.customersACC=data;
        
        this.filteredCustomerACCServerSide2.next(this.customersACC.filter(x=>x.s_acc_dir_name.toLowerCase().indexOf(value)>-1));
        this.searchingCustomerACC=false
      })
    }
    debugger
     
  }
  SearchSupplierACC(value:any)
  {
    debugger
   this.searchingSupplierACC=true;
   this._SERVICE.SearchSupplierACC(value).subscribe(data=>{
   debugger;
     this.SupplierACC=data;
     
     this.filteredSupplierACCServerSide.next(this.SupplierACC.filter(x=>x.s_acc_dir_name.toLowerCase().indexOf(value)>-1));
     this.searchingSupplierACC=false
   })
  }
  SearchSeller(value:any)
  {
    debugger
   this.searchingSeller=true;
   this._SERVICE.SearchSeller(value).subscribe(data=>{
   debugger;
     this.Seller=data;
     
     this.filteredSellerServerSide.next(this.Seller.filter(x=>x.s_employee_name.toLowerCase().indexOf(value)>-1));
     this.searchingSeller=false
   })
  }
  SearchCostCenter(value:any)
  {
    debugger
   this.searchingCostCenter=true;
   this._SERVICE.SearchCostCenter(value).subscribe(data=>{
   debugger;
     this.CostCenter=data;
     
     this.filteredCostCenterServerSide.next(this.CostCenter.filter(x=>x.s_cost_center_name.toLowerCase().indexOf(value)>-1));
     this.searchingCostCenter=false
   })
  }
  SearchAllSupplier(value:any)
  {
    debugger
   this.searchingAllSupplier=true;
   this._SERVICE.SearchAllSupplier(value).subscribe(data=>{
   debugger;
     this.AllSearch=data;
     
     this.filteredAllSupplerServerSide.next(this.AllSearch.filter(x=>x.s_supplier_name.toLowerCase().indexOf(value)>-1));
     this.searchingAllSupplier=false
   })
  }
  save(){
    

   var formData=new FormData();
 
  Object.keys(this.branchForm.controls).forEach(key => {
    const control = this.branchForm.get(key);
    if (control) {
      formData.append(key, control.value ?? '');
    } 
  });
  
  this.showspinner = true;
  this.disableButtons();
  if(this.IDNo !=null && this.IDNo > 0 ){
     this._SERVICE.Update(formData).subscribe((data)=>{
      this.showspinner = false;
      this.enableButtons();
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1)
      {
        this.router.navigate(['/sys/branchList'])
      }
  
     })
  } 
  else
  {
    this._SERVICE.Save(formData).subscribe((data)=>{
      this.showspinner = false;
      this.enableButtons();
      this. _notification.ShowMessage(data.msg,data.status);
      if(data.status==1)
      {
        this.router.navigate(['/sys/branchList'])
      }
    });
  }
  //end function 
  
  }

}
