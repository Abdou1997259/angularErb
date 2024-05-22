import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { GlCostCentersLookupComponent } from 'src/app/Controls/gl-cost-centers-lookup/gl-cost-centers-lookup.component';
import { AccountListTreeService } from 'src/app/Core/Api/GL/account-list-tree.service';
import { HelperService } from 'src/app/Core/Api/Helper/helper-service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
declare var $: any;
export let accountNumber: string;

@Component({
  selector: 'app-accounts-tree',
  templateUrl: './accounts-tree.component.html',
  styleUrls: ['./accounts-tree.component.css']
})
export class AccountsTreeComponent implements OnInit {
  AccountTypeForm!: FormGroup;

  isAddBase: boolean = true;
  treeData!: any[];
  accountsTypesList!: any[];
  accountsGroupsList!: any[];
  costCenterStatusList!: any[];
  glCostCentersList: any[] = [];

  s_account_name: string = '';
  n_account_balance!: number;
  s_balanceType: string = '';
  n_allocat_value!: number;
  upperAccount!: any;
  timeout!: any;
  selectedNode: any;
  isEnglish:boolean=false;
  CostData:any=[];
  Cost2Data:any=[];
  searchingCost:boolean=false;
  searchingCost2:boolean=false;
  filteredCostCenterServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCostCenter2ServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  btnSave: string = 'حفظ';
  isAccountSelected: boolean = false;
  isHasChildrens: boolean = false;
  isAddMode: boolean = false;
  showspinner :boolean=false;

  constructor(private _accountListTreeService : AccountListTreeService,
    private dataSharingService:DataSharingService, private _notification : NotificationServiceService,
    public dialog: MatDialog, private userservice: UserService, private _formBuilder: FormBuilder, private _helperService: HelperService)
  {
    this.AccountTypeForm = this._formBuilder.group({
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      n_UserUpdate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      s_account_no: new FormControl('', Validators.required),
      n_account_level: new FormControl(),
      s_account_name: new FormControl('', Validators.required),
      n_account_balance: new FormControl(),
      s_balanceType: new FormControl(),
      s_account_name_eng: new FormControl(),
      s_upper_account: new FormControl(),
      n_account_type: new FormControl('', Validators.required),
      n_account_group: new FormControl(),
      n_account_nature: new FormControl(),
      b_protected: new FormControl(),
      b_stop_direct_Trans: new FormControl(),
      b_showin_Balancesheet: new FormControl(),
      b_account_entry_block: new FormControl(),
      n_account_allocat: new FormControl(),
      s_default_cost_center_id: new FormControl(),
      s_default_cost_center_id2: new FormControl(),
      n_current_branch: new FormControl(),
      n_current_company: new FormControl(),
      n_current_year: new FormControl(),

      gl_CostCenterForAccount: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.GetAccountsTypes();
    this.GetAccountsGroups();
    this.GetCostCenterStatus();
    this.searchCost('');
    this.searchCost2('');

    if(window.sessionStorage["lan"]==="English")
      this.isEnglish=true;

    $(document).ready(() => {
      this.showspinner=true;
      this._accountListTreeService.GetAccounts().subscribe((data)=>{
        debugger
        this.treeData = data;
        $('#jstree').jstree({
          "core": {
              "multiple": false,
              "themes": {
                  "variant": "large",
                  "stripes": true
              },
              'check_callback' : true,
              "data": this.treeData!
            },
          "checkbox": {
              "keep_selected_style": false
          },
          "search" : {
            "case_sensitive": false,
            "show_only_matches": true
          },
          types: {
            "default" : {
            }
          },
          "plugins": ["wholerow", "contextmenu", "themes","types","search"],
          "contextmenu": {
            items: {
                Run: {
                    "label": "إضافة عنصر",
                    "action": function () {
                      var event = new CustomEvent('AddNewItem');
                      window.dispatchEvent(event);
                    }
                }
            }
          },
        });
      });

      $('#jstree').on("select_node.jstree", function (e, data) {
        accountNumber = data.node.id;
        var event = new CustomEvent('GetAccountInfo');
        window.dispatchEvent(event);
      });

      $(document).ready(() => {
        $(".search-input").keyup(function () {
          var searchString = $("#search-input").val();
          $('#jstree').jstree('search', searchString);
        });
      });
      this.showspinner=false;
    });

    this.translatefun();
    this.translateData();
  }

  get gl_CostCenterForAccount(): FormArray
  {
    return this.AccountTypeForm.get('gl_CostCenterForAccount') as FormArray;
  }

  insert_NewCostCenterRow(line: number = 0): FormGroup
  {
    return this._formBuilder.group({
      s_account_no: '',
      n_DataAreaID: '',
      n_line_no: line,
      s_cost_center_id: '',
      s_cost_center_name: ''
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
    }, 1000);

  }
  translatefun()
  {
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
  add_CostCenterRow()
  {
    this.gl_CostCenterForAccount.push(this.insert_NewCostCenterRow(this.gl_CostCenterForAccount.length + 1));
  }

  remove_CostCenterRow(i: number)
  {
    this.gl_CostCenterForAccount.removeAt(i);
  }

  GetAccountsTypes() : any {
    this._accountListTreeService.GetAccountsTypes().subscribe((data)=>{
      this.accountsTypesList=data;
    });
  }

  GetAccountsGroups() : any {
    this._accountListTreeService.GetAccountsGroups().subscribe((data)=>{
      this.accountsGroupsList=data;
    });
  }

  GetCostCenterStatus() : any {
    this._accountListTreeService.GetCostCenterStatus().subscribe((data)=>{
      this.costCenterStatusList=data;
    });
  }

  searchCost(value :any){
    this.searchingCost=true;
    this._helperService.getCostCebterLKP(value).subscribe(res=>{
      this.CostData=res;
      this.filteredCostCenterServerSide.next(  this.CostData.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost=false;
    });
  }

  searchCost2(value :any){
    this.searchingCost2=true;
    this._helperService.getCostCebterLKP(value).subscribe(res=>{
      this.Cost2Data=res;
      this.filteredCostCenter2ServerSide.next(  this.Cost2Data.filter(x => x.s_cost_center_name.toLowerCase().indexOf(value) > -1));
      this.searchingCost2=false;
    });
  }

  @HostListener('window:GetAccountInfo', ['$event.detail'])
  GetAccountInfo()
  {
    this.btnSave = 'تعديل';
    this.isAccountSelected = true;
    this.isAddMode = false;
    this.isAddBase = false;

    if(this.gl_CostCenterForAccount !== null)
    {
      if(this.gl_CostCenterForAccount.controls.length > 0)
        {
          this.gl_CostCenterForAccount.clear();
        }
    }

    this._accountListTreeService.CheckIfAccountHasChilds(accountNumber).subscribe((data) => {
      this.isHasChildrens = data;
    });

    this._accountListTreeService.GetOneAccount(accountNumber).subscribe((data)=>{
      this.AccountTypeForm.patchValue(data);
      this.s_account_name = this.AccountTypeForm.value.s_account_name;
      this.n_account_balance = Math.abs(data["balance"]);
      this.s_balanceType = data["balanceType"];
      this.n_allocat_value = data['n_account_allocat'];
      this.selectedNode = data['s_account_no'];

      if(data["s_upper_account"] == null){
        this.AccountTypeForm.controls['s_upper_account'].reset();
      }
      else{
        var parentNode = this.treeData.find(x => x.id == data["s_upper_account"].trim());
        this.upperAccount = parentNode.id;
        this.AccountTypeForm.patchValue({s_upper_account: parentNode.text});
      }
      if(data.gl_CostCenterForAccount.length > 0)
      {
        // this.gl_CostCenterForAccount.clear();
        data.gl_CostCenterForAccount.forEach(element => {
          this.gl_CostCenterForAccount.push(this.insert_NewCostCenterRow(this.gl_CostCenterForAccount.length + 1));
        });
        this.AccountTypeForm.get('gl_CostCenterForAccount')?.patchValue(data.gl_CostCenterForAccount);
      }
    });
  }

  @HostListener('window:AddNewItem', ['$event.detail'])
  AddNewItem() {
    var accountNumber = this.AccountTypeForm.get('s_account_no')?.value;
    var accountType = Number( this.AccountTypeForm.get('n_account_type')?.value );
    var accountName = this.AccountTypeForm.get('s_account_name')?.value;

    if((accountType == 2 || accountType == 0 || accountType == null || accountType == undefined) && accountName != '')
      {
        this._notification.ShowMessage("لا يمكن الاضافة علي حساب فرعي, من فضلك اختر حساب رئيسي...!", 3);
        return;
      }

    if(accountNumber == null || accountNumber == '') {
      this.isAddBase = true;
      this.isAddMode = true;

      this._accountListTreeService.GetNextBaseAccData().subscribe((data) => {
        this.AccountTypeForm = new FormGroup({
          n_DataAreaID: new FormControl(),
          n_UserAdd: new FormControl(),
          d_UserAddDate: new FormControl(),
          n_UserUpdate: new FormControl(),
          d_UserUpdateDate: new FormControl(),
          s_account_no: new FormControl('', Validators.required),
          n_account_level: new FormControl(),
          s_account_name: new FormControl('', Validators.required),
          n_account_balance: new FormControl(),
          s_balanceType: new FormControl(),
          s_account_name_eng: new FormControl(),
          s_upper_account: new FormControl(),
          n_account_type: new FormControl('', Validators.required),
          n_account_group: new FormControl(),
          n_account_nature: new FormControl(),
          b_protected: new FormControl(),
          b_stop_direct_Trans: new FormControl(),
          b_showin_Balancesheet: new FormControl(),
          b_account_entry_block: new FormControl(),
          n_account_allocat: new FormControl(),
          s_default_cost_center_id: new FormControl(),
          s_default_cost_center_id2: new FormControl(),
          gl_CostCenterForAccount: this._formBuilder.array([])
        });
        this.AccountTypeForm.patchValue({s_account_no: data["s_account_no"]});
        this.AccountTypeForm.patchValue({n_account_level: data["n_account_level"]});
      });
    }
    else
    {
      this.btnSave = 'حفظ';
      this.n_allocat_value = 0;
      this.isHasChildrens = false;
      this.isAddMode = true;
      this.isAddBase = false;
  
      this._accountListTreeService.GetNewAccountID(accountNumber).subscribe((data)=>{
        if(data.s_account_no == null){
          this._notification.ShowMessage("هذا المستوي غير موجود", 3);
          this.isHasChildrens = true;
          return;
        }
        else{
          this.AccountTypeForm = new FormGroup({
            n_DataAreaID: new FormControl(),
            n_UserAdd: new FormControl(),
            d_UserAddDate: new FormControl(),
            n_UserUpdate: new FormControl(),
            d_UserUpdateDate: new FormControl(),
            s_account_no: new FormControl('', Validators.required),
            n_account_level: new FormControl(),
            s_account_name: new FormControl('', Validators.required),
            n_account_balance: new FormControl(),
            s_balanceType: new FormControl(),
            s_account_name_eng: new FormControl(),
            s_upper_account: new FormControl(),
            n_account_type: new FormControl('', Validators.required),
            n_account_group: new FormControl(),
            n_account_nature: new FormControl(),
            b_protected: new FormControl(),
            b_stop_direct_Trans: new FormControl(),
            b_showin_Balancesheet: new FormControl(),
            b_account_entry_block: new FormControl(),
            n_account_allocat: new FormControl(),
            s_default_cost_center_id: new FormControl(),
            s_default_cost_center_id2: new FormControl(),
  
            gl_CostCenterForAccount: this._formBuilder.array([])
          });
  
          this.AccountTypeForm.patchValue({s_account_no: data["s_account_no"]});
          this.AccountTypeForm.patchValue({n_account_level: data["n_account_level"]});
          this.AccountTypeForm.patchValue({n_account_group: data["n_account_group"]});
          this.AccountTypeForm.patchValue({n_account_nature: data["n_account_nature"]});
          var parentNode = this.treeData.find(x => x.id == data["s_upper_account"].trim());
          this.upperAccount = parentNode.id;
          this.AccountTypeForm.patchValue({s_upper_account: parentNode.text});
        }
      });
    }
  }

  GetAllAccounts(){
    this._accountListTreeService.GetAccounts().subscribe((data)=>{
      this.AddAccount();
      this.treeData = data;
      $('#jstree').jstree().settings.core.data = data;
    });
  }

  AddAccount() {
    this.glCostCentersList = [];
    this.n_allocat_value=0;
    this.s_account_name = '';
    this.s_balanceType = '';


    this.AccountTypeForm = new FormGroup({
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      n_UserUpdate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      s_account_no: new FormControl('', Validators.required),
      n_account_level: new FormControl(),
      s_account_name: new FormControl('', Validators.required),
      n_account_balance: new FormControl(),
      s_balanceType: new FormControl(),
      s_account_name_eng: new FormControl(),
      s_upper_account: new FormControl(),
      n_account_type: new FormControl('', Validators.required),
      n_account_group: new FormControl(),
      n_account_nature: new FormControl(),
      b_protected: new FormControl(),
      b_stop_direct_Trans: new FormControl(),
      b_showin_Balancesheet: new FormControl(),
      b_account_entry_block: new FormControl(),
      n_account_allocat: new FormControl(),
      s_default_cost_center_id: new FormControl(),
      s_default_cost_center_id2: new FormControl(),

      gl_CostCenterForAccount: this._formBuilder.array([])
    });
  }

  SetAccountAllocatValue(){
    this.n_allocat_value = 0;
    this.AccountTypeForm.get('s_default_cost_center_id')?.patchValue('');
    this.AccountTypeForm.get('s_default_cost_center_id2')?.patchValue('');
    if(this.gl_CostCenterForAccount !== null)
      this.gl_CostCenterForAccount.clear();
    this.n_allocat_value = Number(this.AccountTypeForm.get('n_account_allocat')?.value);
  }

  LoadCostCenters(i: number){
    const dialogRef = this.dialog.open(GlCostCentersLookupComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });
    dialogRef.afterClosed().subscribe(res => {
      ((this.AccountTypeForm.get("gl_CostCenterForAccount") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue(res.data.s_cost_center_id);
      ((this.AccountTypeForm.get("gl_CostCenterForAccount") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(res.data.s_cost_center_name);
    });
  }

  onkeySearchCostCenter(event: any, i: number)
  {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeListingCostCenter(event.target.value, i);
      }
    }, 1000);
  }

  executeListingCostCenter(value: any, i: number)
  {
    this._accountListTreeService.getCostCenterData(value).subscribe((data) => {
      if(data.s_cost_center_name != '' && data.s_cost_center_name != null){
        ((this.AccountTypeForm.get("gl_CostCenterForAccount") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue(data.s_cost_center_name);
      }
      else{
        ((this.AccountTypeForm.get("gl_CostCenterForAccount") as FormArray).at(i) as FormGroup).get('s_cost_center_id')?.patchValue('');
        ((this.AccountTypeForm.get("gl_CostCenterForAccount") as FormArray).at(i) as FormGroup).get('s_cost_center_name')?.patchValue('');
      }
    });
  }

  Save()
  {
    var formData = new FormData();
    formData.append('n_DataAreaID', this.AccountTypeForm.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.AccountTypeForm.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.AccountTypeForm.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.AccountTypeForm.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.AccountTypeForm.value.d_UserUpdateDate ?? '');
    formData.append('s_account_no', this.AccountTypeForm.value.s_account_no ?? '');
    formData.append('n_account_level', this.AccountTypeForm.value.n_account_level ?? 0);
    formData.append('s_account_name', this.AccountTypeForm.value.s_account_name ?? '');
    formData.append('s_account_name_eng', this.AccountTypeForm.value.s_account_name_eng ?? '');
    formData.append('n_account_balance', this.AccountTypeForm.value.n_account_balance ?? 0);
    formData.append('s_balanceType', this.AccountTypeForm.value.s_balanceType ?? '');
    formData.append('s_upper_account', this.upperAccount ?? '');
    formData.append('n_account_nature', this.AccountTypeForm.value.n_account_nature ?? 0);
    formData.append('n_account_type', this.AccountTypeForm.value.n_account_type ?? 0);
    formData.append('n_account_group', this.AccountTypeForm.value.n_account_group ?? 0);
    formData.append('b_protected', this.AccountTypeForm.value.b_protected ?? false);
    formData.append('b_stop_direct_Trans', this.AccountTypeForm.value.b_stop_direct_Trans ?? false);
    formData.append('b_showin_Balancesheet', this.AccountTypeForm.value.b_showin_Balancesheet ?? false);
    formData.append('b_account_entry_block', this.AccountTypeForm.value.b_account_entry_block ?? false);
    formData.append('n_account_allocat', this.AccountTypeForm.value.n_account_allocat ?? 0);
    formData.append('s_default_cost_center_id', this.AccountTypeForm.value.s_default_cost_center_id ?? '');
    formData.append('s_default_cost_center_id2', this.AccountTypeForm.value.s_default_cost_center_id2 ?? '');
    formData.append('n_current_branch', this.AccountTypeForm.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.AccountTypeForm.value.n_current_company ?? 0);
    formData.append('n_current_year', this.AccountTypeForm.value.n_current_year ?? 0);

    if(this.gl_CostCenterForAccount !== null)
    {
      for(var i = 0; i < this.gl_CostCenterForAccount.length; i++)
      {
        formData.append(`gl_CostCenterForAccount[${ i }].n_line_no`, this.AccountTypeForm.value.gl_CostCenterForAccount[i].n_line_no);
        formData.append(`gl_CostCenterForAccount[${ i }].s_cost_center_id`, this.AccountTypeForm.value.gl_CostCenterForAccount[i].s_cost_center_id);
        formData.append(`gl_CostCenterForAccount[${ i }].s_cost_center_name`, this.AccountTypeForm.value.gl_CostCenterForAccount[i].s_cost_center_name);
      }
    }

    if(this.btnSave == 'حفظ')
    {
      var oldNode = this.treeData.filter(x => x.text == this.AccountTypeForm.value.s_account_name);
      if(oldNode.length > 0)
      {
        this._notification.ShowMessage('اسم الحساب هذا مستخدم من قبل...', 3);
        return;
      }
      else{
        this.showspinner=true;
        this._accountListTreeService.SaveAccount(formData).subscribe((data)=>{
          this._notification.ShowMessage(data.msg,data.status);
          this.GetAllAccounts();

          if(data.status == 1)
          {
            if(this.isAddBase)
              $('#jstree').jstree().create_node(null ,  { "id" : this.AccountTypeForm.value.s_account_no, "text" : `${this.AccountTypeForm.value.s_account_name} - ${this.AccountTypeForm.value.s_account_no}` }, "last");
            else
              $('#jstree').jstree().create_node(this.upperAccount ,  { "id" : this.AccountTypeForm.value.s_account_no, "text" : `${this.AccountTypeForm.value.s_account_name} - ${this.AccountTypeForm.value.s_account_no}` }, "last");
            this.isAddMode = false;
            this.isAccountSelected = false;
          }
          this.showspinner=false;
        });
      }
    }
    else{
      this.showspinner=true;
      this._accountListTreeService.EditAccount(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllAccounts();

        if(data.status == 1)
        {
          $('#jstree').jstree().rename_node(this.selectedNode , `${this.AccountTypeForm.value.s_account_name} - ${this.AccountTypeForm.value.s_account_no}`);
          this.isAddMode = false;
          this.isAccountSelected = false;
        }
        this.showspinner=false;
      });
    }
  }

  AppendFormData(){
    var formData: any = new FormData();
      formData.append("n_DataAreaID", this.AccountTypeForm.controls['n_DataAreaID'].getRawValue());
      formData.append("d_UserAddDate", this.AccountTypeForm.controls['d_UserAddDate'].getRawValue());
      formData.append("s_account_no", this.AccountTypeForm.controls['s_account_no'].getRawValue());
      formData.append("n_account_level", this.AccountTypeForm.controls['n_account_level'].getRawValue());
      formData.append("s_account_name", this.AccountTypeForm.value["s_account_name"]);
      formData.append("s_account_name_eng", this.AccountTypeForm.value["s_account_name_eng"]);
      formData.append("s_account_name_eng", this.AccountTypeForm.value["s_account_name_eng"]);

      if(this.AccountTypeForm.controls['n_DataAreaID'].getRawValue() == null || this.AccountTypeForm.controls['n_DataAreaID'].getRawValue() == "")
      {
        formData.append("s_upper_account", this.upperAccount);
      }else{
        formData.append("s_upper_account", this.upperAccount);
      }
      if(this.AccountTypeForm.controls['n_account_type'].getRawValue() != null){
        formData.append("n_account_type", this.AccountTypeForm.controls['n_account_type'].getRawValue());
      }
      if(this.AccountTypeForm.controls['n_account_group'].getRawValue() != null){
        formData.append("n_account_group", this.AccountTypeForm.controls['n_account_group'].getRawValue());
      }
      if(this.AccountTypeForm.controls['n_account_nature'].getRawValue() != null){
        formData.append("n_account_nature", this.AccountTypeForm.controls['n_account_nature'].getRawValue());
      }
      if(this.AccountTypeForm.value["b_protected"] != null){
        formData.append("b_protected", this.AccountTypeForm.value["b_protected"]);
      }
      if(this.AccountTypeForm.value["b_stop_direct_Trans"] != null){
        formData.append("b_stop_direct_Trans", this.AccountTypeForm.value["b_stop_direct_Trans"]);
      }
      if(this.AccountTypeForm.value["b_showin_Balancesheet"] != null){
        formData.append("b_showin_Balancesheet", this.AccountTypeForm.value["b_showin_Balancesheet"]);
      }
      if(this.AccountTypeForm.value["b_account_entry_block"] != null){
        formData.append("b_account_entry_block", this.AccountTypeForm.value["b_account_entry_block"]);
      }
      if(this.AccountTypeForm.value["n_account_allocat"] != null){
        formData.append("n_account_allocat", this.AccountTypeForm.value["n_account_allocat"]);
      }

      if(this.AccountTypeForm.value["n_account_allocat"] == 2){
        formData.append("s_default_cost_center_id", this.AccountTypeForm.value["s_default_cost_center_id"]);
        // formData.append("s_default_cost_center_id", this.AccountTypeForm.controls['oneGlCostCenter'].getRawValue());
        // formData.append("s_default_cost_center_id2", this.AccountTypeForm.controls['SecondGlCostCenter'].getRawValue());
      }
      if(this.AccountTypeForm.value["n_account_allocat"] == 3){
        formData.append("s_default_cost_center_id", this.AccountTypeForm.controls['s_default_cost_center_id'].getRawValue());
      }
      if(this.AccountTypeForm.value["n_account_allocat"] == 4){
        for(var i = 0; i < this.glCostCentersList.length; i++){
          formData.append("glCostCentersList[" + i + "].costCenterNo", this.glCostCentersList[i].costCenterNo);
          formData.append("glCostCentersList[" + i + "].costCenterName", this.glCostCentersList[i].costCenterName);
        }
        // formData.append("glCostCentersList", this.glCostCentersList.values);
      }
      return formData;
  }

  DeleteAccount() {
    var formData = this.AppendFormData();
    var children = this.treeData.filter(x => x.parent == this.AccountTypeForm.value.s_account_no);

    if(children.length > 0){
      this._notification.ShowMessage('لا يمكن حذف حساب رئيسي يحتوي علي مسوتيات اخري',3);
    }else{
      this._accountListTreeService.DeleteAccount(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllAccounts();
        if(data.status == 1)
          $('#jstree').jstree().delete_node(this.AccountTypeForm.value.s_account_no);
      });
    }
  }

  onInputEvent()
  {
    var accountNo = this.AccountTypeForm.get('s_account_no')?.value;
    this.btnSave = 'تعديل';
    this.isAccountSelected = true;
    this.isAddMode = false;
    this.isAddBase = false;

    if(this.gl_CostCenterForAccount !== null)
    {
      if(this.gl_CostCenterForAccount.controls.length > 0)
        {
          this.gl_CostCenterForAccount.clear();
        }
    }

    this._accountListTreeService.CheckIfAccountHasChilds(accountNo).subscribe((data) => {
      this.isHasChildrens = data;
    });

    this._accountListTreeService.GetOneAccount(accountNo).subscribe((data)=>{
      if(data != null)
      {
        this.AccountTypeForm.patchValue(data);
        this.s_account_name = this.AccountTypeForm.value.s_account_name;
        this.n_account_balance = Math.abs(data["balance"]);
        this.s_balanceType = data["balanceType"];
        this.n_allocat_value = data['n_account_allocat'];
        this.selectedNode = data['s_account_no'];
  
        if(data["s_upper_account"] == null){
          this.AccountTypeForm.controls['s_upper_account'].reset();
        }
        else{
          var parentNode = this.treeData.find(x => x.id == data["s_upper_account"].trim());
          this.upperAccount = parentNode.id;
          this.AccountTypeForm.patchValue({s_upper_account: parentNode.text});
        }
        if(data.gl_CostCenterForAccount.length > 0)
        {
          // this.gl_CostCenterForAccount.clear();
          data.gl_CostCenterForAccount.forEach(element => {
            this.gl_CostCenterForAccount.push(this.insert_NewCostCenterRow(this.gl_CostCenterForAccount.length + 1));
          });
          this.AccountTypeForm.get('gl_CostCenterForAccount')?.patchValue(data.gl_CostCenterForAccount);
        }
      }
      else
      {
        this.btnSave = 'حفظ';
        this.isAddBase = true;
        this.AccountTypeForm = new FormGroup({
          n_DataAreaID: new FormControl(),
          n_UserAdd: new FormControl(),
          d_UserAddDate: new FormControl(),
          n_UserUpdate: new FormControl(),
          d_UserUpdateDate: new FormControl(),
          s_account_no: new FormControl('', Validators.required),
          n_account_level: new FormControl(),
          s_account_name: new FormControl('', Validators.required),
          n_account_balance: new FormControl(),
          s_balanceType: new FormControl(),
          s_account_name_eng: new FormControl(),
          s_upper_account: new FormControl(),
          n_account_type: new FormControl('', Validators.required),
          n_account_group: new FormControl(),
          n_account_nature: new FormControl(),
          b_protected: new FormControl(),
          b_stop_direct_Trans: new FormControl(),
          b_showin_Balancesheet: new FormControl(),
          b_account_entry_block: new FormControl(),
          n_account_allocat: new FormControl(),
          s_default_cost_center_id: new FormControl(),
          s_default_cost_center_id2: new FormControl(),
    
          gl_CostCenterForAccount: this._formBuilder.array([])
        });
      }
    });
  }
}
