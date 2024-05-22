import { Component, OnInit, EventEmitter, Output, HostListener, ChangeDetectorRef } from '@angular/core';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
// import { AccountListTreeService } from '../_Services/AccountListTree/account-list-tree.service';
import { TreeNode } from 'primeng/api';
// import { comboOption } from '../_model/comboOption';
import { FormControl, FormGroup } from '@angular/forms';
import { comboOption } from 'src/app/_model/comboOption';
import { AccountListTreeService } from 'src/app/Core/Api/GL/account-list-tree.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { MatDialog } from '@angular/material/dialog';
import { GlCostCentersLookupComponent } from 'src/app/Controls/gl-cost-centers-lookup/gl-cost-centers-lookup.component';
import { UserService } from 'src/app/_Services/user.service';
// import { NotificationServiceService } from '../_Services/notification-service.service';
declare var $: any;


export let accountNumber: string;

@Component({
  selector: 'app-account-list-tree',
  templateUrl: './account-list-tree.component.html',
  styleUrls: ['./account-list-tree.component.css']
})

export class AccountListTreeComponent implements OnInit {



  // treeItems: TreeNode[] = [];
  loading: boolean = false;
  dynamicCSSUrleng!: string;
  nodes?: any[];
  accountsTypes!: comboOption;
  accountsTypesList!: any[];
  accountsGroupsList?: any[];
  costCenterStatusList!: any[];
  treeData!:any[];
  s_account_name: string = '';
  n_account_balance!: number;
  s_balanceType: string = '';
  n_allocat_value!: number;
  glCostCentersList: any[] = [];
  upperAccount!: any;
  showspinner :boolean=false;

  constructor(private _accountListTreeService : AccountListTreeService,
    private dataSharingService:DataSharingService, private _notification : NotificationServiceService, public dialog: MatDialog, private userservice: UserService) { }


    AccountTypeForm = new FormGroup({
      n_DataAreaID: new FormControl(),
      d_UserAddDate: new FormControl(),
      s_account_no: new FormControl(),
      n_account_level: new FormControl(),
      s_account_name: new FormControl(),
      n_account_balance: new FormControl(),
      s_balanceType: new FormControl(),
      s_account_name_eng: new FormControl(),
      s_upper_account: new FormControl(),
      n_account_type: new FormControl(),
      n_account_group: new FormControl(),
      n_account_nature: new FormControl(),
      b_protected: new FormControl(),
      b_stop_direct_Trans: new FormControl(),
      b_showin_Balancesheet: new FormControl(),
      b_account_entry_block: new FormControl(),
      n_account_allocat: new FormControl(),
      costCenterNo: new FormControl(),
      costCenterName: new FormControl(),
      oneGlCostCenter: new FormControl(),
      s_default_cost_center_id: new FormControl(),
      // SecondGlCostCenter: new FormControl(),
      SpecificGLCostCenters: new FormControl(),
      multiGlCostCenter: new FormControl(),
      btn_operation: new FormControl('حفظ'),
      btn_delete: new FormControl('حذف حساب'),
      // txtSearch: new FormControl(),
      jstreeControl: new FormControl(),
    });

  ngOnInit(): void {
    // ********************************************************************************
    this.GetAccountsTypes();
    this.GetAccountsGroups();
    this.GetCostCenterStatus();



    $(document).ready(() => {
      this.showspinner=true;
    this.AccountTypeForm.controls['btn_delete'].disable();
      this._accountListTreeService.GetAccounts().subscribe((data)=>{
        this.treeData = data;
        // console.log(this.treeData);
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
                    "action": function (node) {
                      console.log("node");
                      console.log(node);
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
  }

  @HostListener('window:GetAccountInfo', ['$event.detail'])
  GetAccountInfo(){
    this._accountListTreeService.GetOneAccount(accountNumber).subscribe((data)=>{
      this.n_account_balance = Math.abs(data["balance"]);
      this.s_balanceType = data["balanceType"];
      // console.log("teeest");
      // console.log(data);
      this.AccountTypeForm.controls['n_DataAreaID'].disable();
      this.AccountTypeForm.controls['d_UserAddDate'].disable();
      this.AccountTypeForm.controls['s_account_no'].disable();
      this.AccountTypeForm.controls['n_account_level'].disable();
      this.AccountTypeForm.controls['s_upper_account'].disable();
      // this.AccountTypeForm.controls['n_account_type'].disable();
      this.AccountTypeForm.controls['n_account_group'].disable();
      // this.AccountTypeForm.controls['n_account_nature'].disable();
      this.AccountTypeForm.controls['btn_delete'].enable();
      this.AccountTypeForm.controls['btn_operation'].setValue('تعديل');
      this.glCostCentersList = [];
      this.n_allocat_value = 0;


      this.AccountTypeForm.patchValue({n_DataAreaID: data["n_DataAreaID"]});
      this.AccountTypeForm.patchValue({d_UserAddDate: data["d_UserAddDate"]});
      this.AccountTypeForm.patchValue({s_account_no: data["s_account_no"]});
      this.AccountTypeForm.patchValue({n_account_level: data["n_account_level"]});

      this.s_account_name = data["s_account_name"];
      this.AccountTypeForm.patchValue({s_account_name: data["s_account_name"]});
      this.AccountTypeForm.patchValue({s_account_name_eng: data["s_account_name_eng"]});
      debugger;
      if(data["s_upper_account"] == null){
        this.AccountTypeForm.controls['s_upper_account'].reset();
      }
      else{
        debugger;
        var parentNode = this.treeData.find(x => x.id == data["s_upper_account"].trim());
        this.upperAccount = parentNode.id;
        this.AccountTypeForm.patchValue({s_upper_account: parentNode.text});
        // this.AccountTypeForm.patchValue({s_upper_account: data["s_upper_account"]});
      }
      this.AccountTypeForm.patchValue({n_account_type: data["n_account_type"]});
      this.AccountTypeForm.patchValue({n_account_group: data["n_account_group"]});
      this.AccountTypeForm.patchValue({n_account_nature: data["n_account_nature"]});
      this.AccountTypeForm.patchValue({b_protected: data["b_protected"]});
      this.AccountTypeForm.patchValue({b_stop_direct_Trans: data["b_stop_direct_Trans"]});
      this.AccountTypeForm.patchValue({b_showin_Balancesheet: data["b_showin_Balancesheet"]});
      this.AccountTypeForm.patchValue({b_account_entry_block: data["b_account_entry_block"]});
      this.AccountTypeForm.patchValue({n_account_allocat: data["n_account_allocat"]});

      // 2 => مركز تكلفة محدد
      if(this.AccountTypeForm.controls['n_account_allocat'].getRawValue() == 2){
        this.n_allocat_value = 2;
        this.AccountTypeForm.patchValue({s_default_cost_center_id: data["s_default_cost_center_id"]});
        this.AccountTypeForm.patchValue({oneGlCostCenter: data["oneGlCostCenter"]});
      }
      // 3 => مراكز تكلفة متعددة
      if(this.AccountTypeForm.controls['n_account_allocat'].getRawValue() == 3){
        this.n_allocat_value = 3;
        this.AccountTypeForm.patchValue({s_default_cost_center_id: data["s_default_cost_center_id"]});
        this.AccountTypeForm.patchValue({multiGlCostCenter: data["multiGlCostCenter"]});
      }
      // 4 => مراكز تكلفة محددة
      if(this.AccountTypeForm.controls['n_account_allocat'].getRawValue() == 4){
        this._accountListTreeService.GetCostCentersForAccount(accountNumber).subscribe((data)=>{
          // console.log("glCostCenterForAccount");
          // console.log(data);
          for(var i = 0; i < data.length; i++){
            this.glCostCentersList.push({costCenterNo: data[i].s_cost_center_id, costCenterName: data[i].s_cost_center_name});
          }
        });
      }

    });
  }



  GetAllAccounts(){
    this._accountListTreeService.GetAccounts().subscribe((data)=>{
      this.AddAccount();
      $('#jstree').jstree().settings.core.data = data;
      // $("#jstree").jstree(true).refresh(true, true);
    });
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
      // console.log(this.costCenterStatusList);
    });
  }

  Save(){

    if(this.AccountTypeForm.controls['s_account_no'].enabled){
      console.log("Save");

      var oldNode = this.treeData.filter(x => x.text == this.AccountTypeForm.controls['s_account_name'].getRawValue());
      if(oldNode.length > 0){
        console.log("oldNode");
        console.log(oldNode);
        this._notification.ShowMessage('إسم الحساب مستخدم من قبل',3);
      }
      else{
        var formData = this.AppendFormData();
        this._accountListTreeService.SaveAccount(formData).subscribe((data)=>{
          this._notification.ShowMessage(data.msg,data.status);
          this.GetAllAccounts();
        });
      }
      $('#jstree').jstree().create_node(this.upperAccount ,  { "id" : this.AccountTypeForm.controls['s_account_no'].getRawValue(), "text" : this.AccountTypeForm.value["s_account_name"] }, "last");
    }
    else{
      console.log("Update");
      var formData = this.AppendFormData();
      // console.log(this.AccountTypeForm.controls['n_account_type'].getRawValue());

      this._accountListTreeService.EditAccount(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllAccounts();
      });
      $('#jstree').jstree().rename(this.upperAccount ,  { "id" : this.AccountTypeForm.controls['s_account_no'].getRawValue(), "text" : this.AccountTypeForm.value["s_account_name"] }, "last");
    }



  }

  AppendFormData(){

    var formData: any = new FormData();
      debugger;
      formData.append("n_DataAreaID", this.AccountTypeForm.controls['n_DataAreaID'].getRawValue());
      formData.append("d_UserAddDate", this.AccountTypeForm.controls['d_UserAddDate'].getRawValue());
      formData.append("s_account_no", this.AccountTypeForm.controls['s_account_no'].getRawValue());
      formData.append("n_account_level", this.AccountTypeForm.controls['n_account_level'].getRawValue());
      formData.append("s_account_name", this.AccountTypeForm.value["s_account_name"]);
      formData.append("s_account_name_eng", this.AccountTypeForm.value["s_account_name_eng"]);
      // var parentNode = this.treeData.find(x => x.text == this.AccountTypeForm.controls['s_upper_account'].getRawValue());
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

      debugger

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


  AddAccount() {
    this.AccountTypeForm.controls['s_account_no'].enable();
    this.AccountTypeForm.controls['n_account_type'].enable();
    this.AccountTypeForm.controls['n_account_group'].enable();
    this.AccountTypeForm.controls['n_account_nature'].enable();
    this.AccountTypeForm.controls['btn_delete'].disable();
    this.glCostCentersList = [];
    this.n_allocat_value=0;
    this.s_account_name = '';
    this.s_balanceType = '';


    this.AccountTypeForm = new FormGroup({
      n_DataAreaID: new FormControl(),
      d_UserAddDate: new FormControl(),
      s_account_no: new FormControl(),
      n_account_level: new FormControl(),
      s_account_name: new FormControl(),
      n_account_balance: new FormControl(),
      s_balanceType: new FormControl(),
      s_account_name_eng: new FormControl(),
      s_upper_account: new FormControl(),
      n_account_type: new FormControl(),
      n_account_group: new FormControl(),
      n_account_nature: new FormControl(),
      b_protected: new FormControl(),
      b_stop_direct_Trans: new FormControl(),
      b_showin_Balancesheet: new FormControl(),
      b_account_entry_block: new FormControl(),
      n_account_allocat: new FormControl(),
      costCenterNo: new FormControl(),
      costCenterName: new FormControl(),
      oneGlCostCenter: new FormControl(),
      s_default_cost_center_id: new FormControl(),
      // SecondGlCostCenter: new FormControl(),
      SpecificGLCostCenters: new FormControl(),
      multiGlCostCenter: new FormControl(),
      btn_operation: new FormControl('حفظ'),
      btn_delete: new FormControl('حذف حساب'),
      jstreeControl: new FormControl(),
    });




  }

  DeleteAccount() {
    var formData = this.AppendFormData();
    var children = this.treeData.filter(x => x.parent == this.AccountTypeForm.controls['s_account_no'].getRawValue());

    debugger;
    if(children.length > 0){
      this._notification.ShowMessage('لا يمكن حذف الحساب',3);
    }else{
      this._accountListTreeService.DeleteAccount(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllAccounts();
        $('#jstree').jstree().delete_node(this.AccountTypeForm.controls['s_account_no'].getRawValue());
      });
    }
  }

  @HostListener('window:AddNewItem', ['$event.detail'])
  AddNewItem(){
    this._accountListTreeService.GetNewAccountID(accountNumber).subscribe((data)=>{
      if(data.s_account_no == null){
        this._notification.ShowMessage(" لا يمكنك الإضافة",3);
      }
      else{
        this.AccountTypeForm.controls['s_account_no'].disable();
        this.AccountTypeForm.controls['n_account_level'].disable();
        this.AccountTypeForm.controls['s_upper_account'].disable();

        this.AccountTypeForm.controls['n_account_type'].enable();
        this.AccountTypeForm.controls['n_account_group'].enable();
        this.AccountTypeForm.controls['n_account_nature'].enable();
        this.AccountTypeForm.controls['btn_delete'].disable();


        this.AccountTypeForm = new FormGroup({
          n_DataAreaID: new FormControl(''),
          d_UserAddDate: new FormControl(''),
          s_account_no: new FormControl(),
          n_account_level: new FormControl(),
          s_account_name: new FormControl(),
          n_account_balance: new FormControl(),
          s_balanceType: new FormControl(),
          s_account_name_eng: new FormControl(),
          s_upper_account: new FormControl(),
          n_account_type: new FormControl(),
          n_account_group: new FormControl(),
          n_account_nature: new FormControl(),
          b_protected: new FormControl(),
          b_stop_direct_Trans: new FormControl(),
          b_showin_Balancesheet: new FormControl(),
          b_account_entry_block: new FormControl(),
          n_account_allocat: new FormControl(),
          costCenterNo: new FormControl(),
          costCenterName: new FormControl(),
          oneGlCostCenter: new FormControl(),
          s_default_cost_center_id: new FormControl(),
          // SecondGlCostCenter: new FormControl(),
          SpecificGLCostCenters: new FormControl(),
          multiGlCostCenter: new FormControl(),
          btn_operation: new FormControl('حفظ'),
          btn_delete: new FormControl('حذف'),
          jstreeControl: new FormControl(),
        });

        this.AccountTypeForm.patchValue({s_account_no: data["s_account_no"]});
        this.AccountTypeForm.patchValue({n_account_level: data["n_account_level"]});

        var parentNode = this.treeData.find(x => x.id == data["s_upper_account"].trim());
        this.upperAccount = parentNode.id;
        this.AccountTypeForm.patchValue({s_upper_account: parentNode.text});

        // this.AccountTypeForm.patchValue({s_upper_account: data["s_upper_account"]});
        this.AccountTypeForm.patchValue({n_account_group: data["n_account_group"]});
        this.AccountTypeForm.patchValue({n_account_nature: data["n_account_nature"]});
      }
    });
  }


  SetAccountAllocatValue(){
    this.n_allocat_value = 0;
    this.glCostCentersList = [];
    this.n_allocat_value = this.AccountTypeForm.value["n_account_allocat"];
  }


  currentGlCostCenterID!: string;
  LoadCostCenters(){
    const dialogRef = this.dialog.open(GlCostCentersLookupComponent, {
      width: '700px',
      height:'600px',
      data: {    }
    });
    dialogRef.afterClosed().subscribe(res => {
      debugger

       this.currentGlCostCenterID = res.data.s_cost_center_id;
       this.AccountTypeForm.patchValue({s_default_cost_center_id: res.data.s_cost_center_id});
       this.AccountTypeForm.patchValue({oneGlCostCenter: res.data.s_cost_center_name});
       this.AccountTypeForm.patchValue({SpecificGLCostCenters: res.data.s_cost_center_name});
       this.AccountTypeForm.patchValue({multiGlCostCenter: res.data.s_cost_center_name});

      // (this.salesForm.get("n_customer_id"))?.patchValue(res.data.n_customer_id );
      // (this.salesForm.get("s_customer_name"))?.patchValue(res.data.n_customer_id +'-'+ res.data.s_customer_name);

    });
  }

  // get salesdetails() : FormArray {
  //   return this.salesForm.get("salesdetails") as FormArray
  // }

  checkGlCostCentersList: any;
  addCostCenter() {

    this.checkGlCostCentersList = this.glCostCentersList.find(x => x.costCenterNo == this.currentGlCostCenterID);
    if(this.checkGlCostCentersList == null){
      this.glCostCentersList.push({costCenterNo: this.currentGlCostCenterID, costCenterName:this.AccountTypeForm.controls['SpecificGLCostCenters'].getRawValue()});
      this.AccountTypeForm.patchValue({costCenterNo: this.currentGlCostCenterID});
      this.AccountTypeForm.patchValue({costCenterName: this.AccountTypeForm.controls['SpecificGLCostCenters'].getRawValue()});
      this.AccountTypeForm.controls['SpecificGLCostCenters'].reset();
    }

   }


   removesalesdetails(i:number) {
    // myArray.splice(index, 1);
    // this.glCostCentersList = this.glCostCentersList.filter(obj => obj !== this.checkGlCostCentersList);
    this.glCostCentersList.splice(i, 1);
  }

}
