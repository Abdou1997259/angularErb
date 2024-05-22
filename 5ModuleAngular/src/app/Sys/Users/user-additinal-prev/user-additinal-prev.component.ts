import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { bankService } from 'src/app/Core/Api/FIN/bank.service';
import { EmpClassService } from 'src/app/Core/Api/HR/emp-class.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { UserPrevAddService } from 'src/app/Core/Api/Users/user-prev-add.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { Location } from '@angular/common';
import { UserService } from 'src/app/_Services/user.service';
import { PrevSelectComponent } from 'src/app/shared/prev-select/prev-select.component';

@Component({
  selector: 'app-user-additinal-prev',
  templateUrl: './user-additinal-prev.component.html',
  styleUrls: ['./user-additinal-prev.component.css']
})
export class UserAdditinalPrevComponent implements OnInit {

  
  userform !:FormGroup
  showspinner=false;
  IDNo!:any;
  Edit: boolean=false;
  filteredStoresServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCashesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredBanksServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCardsServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredBranchesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredYearsServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredOrderIsuServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCustDirIsuServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenterIsuServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredProdLineServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredStationServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredMixerWorksServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDefaultCustServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  nclassId:boolean=false
  searchingProdLine:boolean=false;
  searchingMixerWroks:boolean=false;
  searchingStores:boolean=false;
  searchingCashes:boolean=false;
  searchingstations:boolean=false;
  searchingDefaultCust:boolean=false;
  searchingOrderIsu:boolean=false;
  searchingBanks:boolean=false;
  searchingCards:boolean=false;
  searchingYears:boolean=false;
  searchingCustDir:boolean=false;
  searchingCostCenter:boolean=false;
  searchingBranches:boolean=false;
  BranchesData:any=[];
  CostCeneters:any=[];
  MixWorkser:any=[]
  StoresData:any=[];
  YearsData:any=[];
  CustDir:any=[];
  OrderIsu:any=[];
  CashesData:any=[];
  defaultCust:any=[]
  CardsData:any=[];
  StationsData:any=[];
  ProdLine:any=[]
  BanksData:any=[];
  searchingVlues:any[]=[];
  DocNo:any;
  isEnglish:boolean=false;

  currentYear !:any;
  currentUser !:any;
  currentCompany!:any;
  userId!:any;
  currentBranch!:any;
  compID !:any;
  branchName !:any;
  
  Add: Boolean=true;
  DataAreaNo: any;
  @ViewChildren(PrevSelectComponent) components!: QueryList<PrevSelectComponent>;
  @ViewChild("showID") showID!:ElementRef;
  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _activatedRoute:ActivatedRoute,
    private dialogRef:MatDialog,
    private _SERVICE:UserPrevAddService,
    private _notification: NotificationServiceService,
    private _getBanks:bankService, 
    private _currency: CurrencyLKPService,
    private _lookup:GenerealLookup,
    private location: Location,
    private userservice : UserService,
    private _serviceOut:SCstockInService
    )
    {
      this.userform=this.fb.group({
        n_default_store:[''],
        s_credit_cards:[],
        s_branches:[],
        s_cashes :[''],
        n_ID:[''],
        n_default_cash:[],
        s_banks :[''],
        n_default_bank_id:[''],
        s_stores:[''],
        s_closed_years:[''],
        n_orderIssued_no:[''],
        n_cust_acc_dire:[''],
        s_default_cost_center:[''],
        n_sales_invoice_types:[],
        n_sellprice_type:[],
        s_prod_lines:[],
        b_edit_in_reports:[],
        s_branches_workflow:[],
        n_stationId:[],
        s_mixer_workers:[],
        n_mixerWorker:[],
        n_default_customer_id:[]
      });
    }

    ngAfterViewInit(): void {
      this.components.forEach(component => {
        component.ngOnInit(); // Manually call ngOnInit for each component
      });
    }

  ngOnInit(): void {
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.currentYear = this.userservice.GetYear();
    this.currentUser = this.userservice.GetUserName();
    this.currentCompany = this.userservice.GetCompName();
    this.userId=this.userservice.GetUserID();
    this.currentBranch = this.userservice.GetBranch();
    this.compID = this.userservice.GetComp();
    this.branchName = this.userservice.GetBranchName();

      this._SERVICE.GetByID(this.DocNo).subscribe((data)=>{
        debugger;
        console.log(data)

        data.s_cashes=data.s_cashes?.slice(1, -1)?.split(',').map(value=>Number(value));
 

        data.s_banks=data.s_banks?.slice(1, -1)?.split(',').map(value=>Number(value));
        data.s_branches=data.s_branches?.slice(1, -1)?.split(',').map(value=>Number(value));
        data.s_credit_cards=data.s_credit_cards?.slice(1, -1)?.split(',').map(value=>Number(value));
        data.s_stores=data.s_stores?.slice(1, -1)?.split(',').map(value=>Number(value));
        data.s_closed_years=data.s_closed_years?.slice(1, -1)?.split(',').map(value=>Number(value));
        data.s_prod_lines=data.s_prod_lines?.slice(1, -1)?.split(',').map(value=>Number(value));
        data.s_mixer_workers=data.s_mixer_workers?.slice(1, -1)?.split(',').map(value=>Number(value));
        data.s_branches_workflow=data.s_branches_workflow?.slice(1, -1)?.split(',').map(value=>Number(value));
        this.userform.patchValue(data);   
      })
    this.isEnglish=LangSwitcher.CheckLan();
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.searchStores('');
    this.searchCashes('');
    this.searchBanks('');
    this.searchBranches('');
    this.searchCards('');
    this.searchYears('');
    this.searchOrderIsu('');
    this.searchCustDir('');
    this.searchProdLine('');
    this.searchStations('');
    this.searchDefaultCust('');
  }



  
  searchStores(value :any){
    this.searchingStores=true;
    this._SERVICE.GetAllStores( value).subscribe(res=>{
      this.StoresData=res;
      this.filteredStoresServerSide.next(  this.StoresData.filter(x => x.s_store_name.toLowerCase().indexOf(value) > -1));
      this.searchingStores=false;
    });
  }

  searchYears(value :any){
   
    this.searchingYears=true;
    this._SERVICE.GetAllYears( value).subscribe(res=>{
      this.YearsData=res;
      this.filteredYearsServerSide.next(  this.YearsData.filter(x => x.s_year_name.toLowerCase().indexOf(value) > -1));
      this.searchingYears=false;
    });
  }
  searchMixerWroks(value :any){
   
    this.searchingMixerWroks=true;
    this._SERVICE.GetAllMixerWorkers( value).subscribe(res=>{
      this.YearsData=res;
      this.filteredMixerWorksServerSide.next(  this.YearsData.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
      this.searchingMixerWroks=false;
    });
  }

  searchStations(value :any){
   
    this.searchingstations=true;
    this._SERVICE.GetAllStations( value).subscribe(res=>{
      this.StationsData=res;
      this.filteredStationServerSide.next(  this.StationsData.filter(x => x.s_StationName.toLowerCase().indexOf(value) > -1));
      this.searchingstations=false;
    });
  }

  searchDefaultCust(value :any){
   
    this.searchingDefaultCust=true;
    this._SERVICE.GetAllDefualtSuppliers( value).subscribe(res=>{
      this.defaultCust=res;
      this.filteredDefaultCustServerSide.next(  this.defaultCust.filter(x => x.s_customer_name.toLowerCase().indexOf(value) > -1));
      this.searchingDefaultCust=false;
    });
  }

  searchProdLine(value :any){  
    this.searchingProdLine=true;
    this._SERVICE.GetAllProLines( value).subscribe(res=>{
      debugger
      this.ProdLine=res;
      this.filteredProdLineServerSide.next(  this.ProdLine.filter(x => x.s_Name.toLowerCase().indexOf(value) > -1));
      this.searchingProdLine=false;
    });
  }

  searchCashes(value :any){
    this.searchingCashes=true;
    this._SERVICE.GetAllCashes( value).subscribe(res=>{
      this.CashesData=res;
      this.filteredCashesServerSide.next(  this.CashesData.filter(x => x.s_cash_name.toLowerCase().indexOf(value) > -1));
      this.searchingCashes=false;
    });
  }

  searchOrderIsu(value :any){
    this.searchingOrderIsu=true;
    this._SERVICE.GetAllOrderIssue( value).subscribe(res=>{
      this.OrderIsu=res;
      this.filteredOrderIsuServerSide.next(  this.OrderIsu.filter(x => x.s_orderIssued_name.toLowerCase().indexOf(value) > -1));
      this.searchingOrderIsu=false;
    });
  }

  searchCostCeneter(value :any){
    this.searchingCostCenter=true;
    this._SERVICE.GetAllCostCenter( value).subscribe(res=>{
      this.CostCeneters=res;
      this.filteredCostCenterIsuServerSide.next(  this.CostCeneters.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCostCenter=false;
    });
  }

  searchCustDir(value :any){ 
    this.searchingCustDir=true;
    this._SERVICE.GetAllCustDir( value).subscribe(res=>{
      this.CustDir=res;
      this.filteredCustDirIsuServerSide.next(  this.CustDir.filter(x => x.s_acc_dir_name.toLowerCase().indexOf(value) > -1));
      this.searchingCustDir=false;
    });
  }

  searchBanks(value :any){
    this.searchingBanks=true;
    this._SERVICE.GetAllBanks( value).subscribe(res=>{
      this.BanksData=res;
      this.filteredBanksServerSide.next(  this.BanksData.filter(x => x.s_bank_name.toLowerCase().indexOf(value) > -1));
      this.searchingBanks=false;
    });
  }

  searchBranches(value :any){ 
    this.searchingBranches=true;
    this._SERVICE.GetAllBranches( value).subscribe(res=>{
      this.BranchesData=res;
      this.filteredBranchesServerSide.next(  this.BranchesData.filter(x => x.s_branch_name.toLowerCase().indexOf(value) > -1));
      this.searchingBranches=false;
    });
  }

  searchCards(value :any){
    this.searchingBranches=true;
    this._SERVICE.GetAllVisaType( value).subscribe(res=>{
      this.CardsData=res;
      this.filteredCardsServerSide.next(  this.CardsData.filter(x => x.s_credit_card_name.toLowerCase().indexOf(value) > -1));
      this.searchingCards=false;
    });
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


  save(){
    debugger;
    if(this.userform.get("s_cashes")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert  class name',3)
    else
      this._notification.ShowMessage("منفضلك  اسم النوع",3)
      return
    }
    if(this.userform.get("s_stores")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert the valut',3)
    else
      this._notification.ShowMessage("منفضلك  اسم الخزينة",3)
      return
    }
    if(this.userform.get("n_default_bank_id")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert account',3)
    else
      this._notification.ShowMessage("منفضلك  ادخل حساب",3)
      return
    }
    var formData=new FormData();


    formData.append("n_ID",this.userform.value.n_ID?? 0);
    formData.append("n_default_store",this.userform.value.n_default_store?? 0);
    formData.append("n_orderIssued_no",this.userform.value.n_orderIssued_no?? 0);
    formData.append("n_cust_acc_dire",this.userform.value.n_cust_acc_dire?? 0);
    formData.append("s_default_cost_center",this.userform.value.s_default_cost_center?? 0);
    formData.append("n_sales_invoice_types",this.userform.value.n_sales_invoice_types?? 0);
    formData.append("n_mixerWorker",this.userform.value.n_mixerWorker?? 0);
    formData.append("n_default_customer_id",this.userform.value.n_default_customer_id?? 0);
    formData.append("b_edit_in_reports",this.userform.value.b_edit_in_reports?? false);
    formData.append("n_sellprice_type",this.userform.value.n_sellprice_type?? 0);
    formData.append("n_stationId",this.userform.value.n_stationId?? 0);
    formData.append("n_default_bank_id",this.userform.value.n_default_bank_id ?? 0 )
    formData.append("n_default_cash",this.userform.value.n_default_cash ?? 0);

    if(this.userform.value?.s_credit_cards !=undefined || this.userform.value?.s_credit_cards!=null)
    {
      const cardsKeys=Object.keys(this.userform.value.s_credit_cards)
      let arr=","+cardsKeys.map(key => this.userform.value.s_credit_cards[key]).join(',')+",";
      formData.append("s_credit_cards",   arr ?? "0");
    }

    if(this.userform.value?.s_branches_workflow !=undefined || this.userform.value?.s_branches_workflow!=null)
    {
      const workflowKeys=Object.keys(this.userform.value?.s_branches_workflow)
      let arrworkflow=","+workflowKeys.map(key => this.userform.value.s_branches_workflow[key]).join(',')+",";
      formData.append("s_branches_workflow",   arrworkflow ?? "0");
    }

    if(this.userform.value?.s_prod_lines !=undefined || this.userform.value?.s_prod_lines!=null)
    {
      const ProdLineKeys=Object.keys(this.userform.value.s_prod_lines)
      let arrProdLine=","+ProdLineKeys.map(key => this.userform.value.s_prod_lines[key]).join(',')+",";
      formData.append("s_prod_lines",   arrProdLine ?? "0");
    }

    if(this.userform.value?.s_mixer_workers !=undefined || this.userform.value?.s_mixer_workers!=null)
    {     
      const MixWokerKeys=Object.keys(this.userform.value?.s_mixer_workers)
      let arrMixWoker=","+MixWokerKeys.map(key => this.userform.value.s_mixer_workers[key]).join(',')+",";
      formData.append("s_mixer_workers",   arrMixWoker ?? "0"); 
    }
    
    var arrcashes="";
    if(this.userform.value?.s_cashes !=undefined || this.userform.value?.s_cashes!=null)
    { 
      const cashesKeys=Object.keys(this.userform.value?.s_cashes)
      arrcashes=","+cashesKeys.map(key => this.userform.value.s_cashes[key]).join(',')+",";
      formData.append("s_cashes",arrcashes);    
    }

    var arrbranches="";
    if(this.userform.value?.s_branches !=undefined || this.userform.value?.s_branches!=null)
    {            
      const branchsKeys=Object.keys(this.userform.value.s_branches)
      arrbranches=","+branchsKeys.map(key => this.userform.value.s_branches[key]).join(',')+",";
      formData.append("s_branches",arrbranches);      
    }

    let arrbanks="";
    if(this.userform.value?.s_banks !=undefined || this.userform.value?.s_banks!=null)
    {                     
      const banksKeys=Object.keys(this.userform.value.s_banks)
      arrbanks=","+banksKeys.map(key => this.userform.value.s_banks[key]).join(',')+",";
      formData.append("s_banks",arrbanks );         
    }

    var arrstores="";
    if(this.userform.value?.s_stores !=undefined || this.userform.value?.s_stores!=null)
    {
      const storesKeys=Object.keys(this.userform.value?.s_stores)
      arrstores=","+storesKeys.map(key => this.userform.value.s_stores[key]).join(',')+",";
      formData.append("s_stores",arrstores  );                   
    }

    if(this.userform.value?.s_closed_years !=undefined || this.userform.value?.s_closed_years!=null)
    {         
      const YearsKeys=Object.keys(this.userform.value?.s_closed_years)
      let arrYears=","+YearsKeys.map(key => this.userform.value.s_closed_years[key]).join(',')+",";
      formData.append("s_closed_years",arrYears  );               
    }
  
    this.showspinner = true;
    this.disableButtons();
    
   this._SERVICE.Edit(formData).subscribe((data)=>{
    if(data.status=1)
    {
      if(this.isEnglish)
        this._notification.ShowMessage('Updated successfully',1)
      else
        this._notification.ShowMessage("تم  التعديل  بنجاح",1);

      this.userservice.UpdateBranch(this.compID, this.currentYear, this.currentBranch).subscribe(_users=>{
        this.userservice.SaveUserData(this.userId , this.currentUser, _users.userType, this.compID, this.currentYear, this.currentBranch, _users.token, this.branchName, this.currentCompany, _users.s_branches, _users.s_stores, _users.s_cashes, _users.s_banks );
        window.location.reload();
        this.userform = this.fb.group({
            n_default_store:[''],
            s_cashes :[''],
            n_ID:[''],
            s_credit_cards:[],
            n_default_cash:[],
            s_banks :[''],
            n_default_bank_id:[''],
            s_stores:[''],
            s_closed_years:[""],
            n_orderIssued_no:[''],
            n_cust_acc_dire:[''],
            s_default_cost_center:[''],
            n_sales_invoice_types:[''],
            n_sellprice_type:[],
            s_prod_lines:[],
            b_edit_in_reports:[],
            s_branches_workflow:[],
            n_stationId:[],
            s_mixer_workers:[],
            n_mixerWorker:[],
            n_default_customer_id:[]
         });  
      });
      
    }

  });
  
}

}
