import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { SCItemMainGroupService } from 'src/app/Core/Api/SC/sc-item-maingroup.service';
import { RelatedAcc } from 'src/app/Core/model/Gl/RelatedAcc';
import { Options } from 'src/app/Core/model/Gl/Options';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
declare var $: any;
export let accountNo: string;

@Component({
  selector: 'app-sc-item-maingroup',
  templateUrl: './sc-item-maingroup.component.html',
  styleUrls: ['./sc-item-maingroup.component.css']
})
export class ScItemMaingroupComponent implements OnInit {
  accountListForm!: FormGroup;
  treeList!: any;
  s_GroupItem_name: string = '';

  relatedAcc: Array<RelatedAcc> = [];
  searching:boolean=false;
  filteredServerSideRelatedAcc: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  incomeAccs: any[] = [];
  searchingIncomeAcc:boolean=false;
  filteredServerSideIncomeAcc: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  options: any;
  upperGroup: any;
  selectedNode: any;
  isEnglish:boolean=false;
  btnSave: string = 'حفظ';
  isAccountSelected: boolean = false;
  isHasChildrens: boolean = false;
  isAddMode: boolean = false;
  isAddBase: boolean = true;

  constructor(private _scItemService: SCItemMainGroupService, private _notification : NotificationServiceService) {
    this.accountListForm = new FormGroup({
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      n_UserUpdate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      n_current_branch: new FormControl(),
      n_current_company: new FormControl(),
      n_current_year: new FormControl(),

      s_GroupItem_no: new FormControl('', Validators.required),
      n_Group_level: new FormControl(),
      s_GroupItem_name: new FormControl('', Validators.required),
      s_GroupItem_name_eng: new FormControl(),
      s_group_code: new FormControl(),
      s_upper_Group: new FormControl(),
      n_type: new FormControl('', Validators.required),
      s_expenses_acc: new FormControl(),
      s_income_acc: new FormControl()
    });
   }

  ngOnInit(): void {
    this.DrawItemsTreeList();
    this.searchGroupType();
    this.searchAccounts('');
    this.searchIncomeAccounts('');

    $('#jstree').on("select_node.jstree", function (e, data) {
      accountNo = data.node.id;
      var event = new CustomEvent('GetAccountInfo');
      window.dispatchEvent(event);
    });
    $(document).ready(() => {
      $(".search-input").keyup(function () {
        var searchString = $("#search-input").val();
        $('#jstree').jstree('search', searchString);
      });
    });

    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  DrawItemsTreeList() {
    this._scItemService.getItemTreeList().subscribe((data) => {
      this.treeList = data;
      $('#jstree').jstree({
        "core": {
            "multiple": false,
            "themes": {
                "variant": "large",
                "stripes": true
            },
            'check_callback' : true,
            "data": this.treeList!
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
                    var event = new CustomEvent('AddNewItem');
                    window.dispatchEvent(event);
                  }
              }
          }
        },
      });
    });
  }

  searchAccounts(value: any){
    this.searching=true;
    this._scItemService.GetGroupAccounts().subscribe(res=>{
      this.relatedAcc=res;
      this.filteredServerSideRelatedAcc.next(this.relatedAcc.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searching=false;
    })
  }

  searchIncomeAccounts(value: any){
    this.searchingIncomeAcc=true;
    this._scItemService.GetGroupIncomeAccounts(value).subscribe(res=>{
      this.incomeAccs=res;
      this.filteredServerSideIncomeAcc.next(this.incomeAccs.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingIncomeAcc=false;
    })
  }

  searchGroupType(){
    this._scItemService.getGroupType().subscribe((data) => {
      this.options = data;
    });
  }

  GetAllAccounts(){
    this._scItemService.getItemTreeList().subscribe((data)=>{
      this.AddAccount();
      this.treeList = data;
      $('#jstree').jstree().settings.core.data = data;
    });
  }

  @HostListener('window:GetAccountInfo', ['$event.detail'])
  GetAccountInfo(){
    this.btnSave = 'تعديل';
    this.isAccountSelected = true;
    this.isAddMode = false;
    this.isAddBase = false;

    this._scItemService.CheckIfGroupItemHasChilds(accountNo).subscribe((data) => {
      this.isHasChildrens = data;
    });

    this._scItemService.getAccountDataById(accountNo).subscribe((data)=>{
      this.accountListForm.patchValue(data);
      this.s_GroupItem_name = this.accountListForm.value.s_GroupItem_name;
      this.selectedNode = data['s_GroupItem_no'];

      if(data["s_upper_Group"] == null){
        this.accountListForm.controls['s_upper_Group'].reset();
      }
      else{
        var parentNode = this.treeList.find(x => x.id == data["s_upper_Group"].trim());
        this.upperGroup = parentNode.id;
        this.accountListForm.patchValue({s_upper_Group: parentNode.text});
      }

      this.accountListForm.patchValue({n_type: data["n_type"]});
      this.accountListForm.patchValue({n_DataAreaID: data["n_DataAreaID"]});
      this.accountListForm.patchValue({n_UserAdd: data["n_UserAdd"]});
      this.accountListForm.patchValue({d_UserAddDate: data["d_UserAddDate"]});
      this.accountListForm.patchValue({n_UserUpdate: data["n_UserUpdate"]});
      this.accountListForm.patchValue({d_UserUpdateDate: data["d_UserUpdateDate"]});
      this.accountListForm.patchValue({n_current_branch: data["n_current_branch"]});
      this.accountListForm.patchValue({n_current_company: data["n_current_company"]});
      this.accountListForm.patchValue({n_current_year: data["n_current_year"]});
      this.accountListForm.patchValue({s_expenses_acc: data["s_expenses_acc"]});
      this.accountListForm.patchValue({s_income_acc: data["s_income_acc"]});
    });
  }

  AddAccount(){
    this.s_GroupItem_name = '';

    this.accountListForm = new FormGroup({
      n_DataAreaID: new FormControl(),
      n_UserAdd: new FormControl(),
      d_UserAddDate: new FormControl(),
      n_UserUpdate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      n_current_branch: new FormControl(),
      n_current_company: new FormControl(),
      n_current_year: new FormControl(),
      s_GroupItem_no: new FormControl('', Validators.required),
      s_GroupItem_name: new FormControl('', Validators.required),
      s_GroupItem_name_eng: new FormControl(),
      s_upper_Group: new FormControl(),
      n_Group_level: new FormControl(),
      n_type: new FormControl('', Validators.required),
      d_curr_sys_date: new FormControl(),
      n_curr_closed_id: new FormControl(),
      s_curr_user_id: new FormControl(),
      d_date_transaction: new FormControl(),
      b_Protected: new FormControl(),
      s_related_account_no: new FormControl(),
      s_expenses_acc: new FormControl(),
      s_income_acc: new FormControl(),
      s_group_code: new FormControl()
    });
  }

  @HostListener('window:AddNewItem', ['$event.detail'])
  AddNewItem(){
    var groupNumber = this.accountListForm.get('s_GroupItem_no')?.value;
    var groupType = Number( this.accountListForm.get('n_type')?.value );
    var groupName = this.accountListForm.get('s_GroupItem_name')?.value;

    if((groupType == 2 || groupType == 0 || groupType == null || groupType == undefined) && groupName != '')
      {
        this._notification.ShowMessage("لا يمكن الاضافة علي مجموعة فرعية, من فضلك اختر مجموعة رئيسية...!", 3);
        return;
      }

    if(groupNumber == null || groupNumber == '') {
      this.isAddBase = true;
      this.isAddMode = true;
      this._scItemService.GetNextItemGroupData().subscribe((data) => {
        this.accountListForm = new FormGroup({
          n_DataAreaID: new FormControl(),
          n_UserAdd: new FormControl(),
          d_UserAddDate: new FormControl(),
          n_UserUpdate: new FormControl(),
          d_UserUpdateDate: new FormControl(),
          n_current_branch: new FormControl(),
          n_current_company: new FormControl(),
          n_current_year: new FormControl(),

          s_GroupItem_no: new FormControl('', Validators.required),
          n_Group_level: new FormControl(),
          s_GroupItem_name: new FormControl('', Validators.required),
          s_GroupItem_name_eng: new FormControl(),
          s_group_code: new FormControl(),
          s_upper_Group: new FormControl(),
          n_type: new FormControl('', Validators.required),
          s_expenses_acc: new FormControl(),
          s_income_acc: new FormControl()
        });

        this.accountListForm.patchValue({s_GroupItem_no: data["s_GroupItem_no"]});
        this.accountListForm.patchValue({n_Group_level: data["n_Group_level"]});
      });
    }
    else{
    this.btnSave = 'حفظ';
    this.isHasChildrens = false;
    this.isAddMode = true;
    this.isAddBase = false;
    this._scItemService.getNewGroupID(accountNo).subscribe((data) => {
      if(data.s_GroupItem_no == null){
        this._notification.ShowMessage("هذا المستوي غير موجود..!",3);
        this.isHasChildrens = true;
        return;
      }
      else{
          this.accountListForm = new FormGroup({
            n_DataAreaID: new FormControl(),
            n_UserAdd: new FormControl(),
            d_UserAddDate: new FormControl(),
            n_UserUpdate: new FormControl(),
            d_UserUpdateDate: new FormControl(),
            n_current_branch: new FormControl(),
            n_current_company: new FormControl(),
            n_current_year: new FormControl(),

            s_GroupItem_no: new FormControl('', Validators.required),
            n_Group_level: new FormControl(),
            s_GroupItem_name: new FormControl('', Validators.required),
            s_GroupItem_name_eng: new FormControl(),
            s_group_code: new FormControl(),
            s_upper_Group: new FormControl(),
            n_type: new FormControl('', Validators.required),
            s_expenses_acc: new FormControl(),
            s_income_acc: new FormControl()
          });

          this.accountListForm.patchValue({n_DataAreaID: data["n_DataAreaID"]});
          this.accountListForm.patchValue({n_UserAdd: data["n_UserAdd"]});
          this.accountListForm.patchValue({d_UserAddDate: data["d_UserAddDate"]});
          this.accountListForm.patchValue({n_UserUpdate: data["n_UserUpdate"]});
          this.accountListForm.patchValue({d_UserUpdateDate: data["d_UserUpdateDate"]});
          this.accountListForm.patchValue({n_current_branch: data["n_current_branch"]});
          this.accountListForm.patchValue({n_current_company: data["n_current_company"]});
          this.accountListForm.patchValue({n_current_year: data["n_current_year"]});

          this.accountListForm.patchValue({s_GroupItem_no: data["s_GroupItem_no"]});
          this.accountListForm.patchValue({n_Group_level: data["n_Group_level"]});
          this.accountListForm.patchValue({s_GroupItem_name: data["s_GroupItem_name"]});
          this.accountListForm.patchValue({s_GroupItem_name_eng: data["s_GroupItem_name_eng"]});
          this.accountListForm.patchValue({s_group_code: data["s_group_code"]});
          var parentNode = this.treeList.find(x => x.id == data["s_upper_Group"].trim());
          this.upperGroup = parentNode.id;
          this.accountListForm.patchValue({s_upper_Group: parentNode.text});

          // this.accountListForm.patchValue({n_type: data["n_type"]});
          // this.accountListForm.patchValue({s_expenses_acc: data["s_expenses_acc"]});
        }
      });
    }
  }

  Save() {
    var formData = new FormData();
    formData.append('n_DataAreaID', this.accountListForm.value.n_DataAreaID ?? 0);
    formData.append('n_UserAdd', this.accountListForm.value.n_UserAdd ?? 0);
    formData.append('d_UserAddDate', this.accountListForm.value.d_UserAddDate ?? '');
    formData.append('n_UserUpdate', this.accountListForm.value.n_UserUpdate ?? 0);
    formData.append('d_UserUpdateDate', this.accountListForm.value.d_UserUpdateDate ?? '');
    formData.append('n_current_branch', this.accountListForm.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.accountListForm.value.n_current_company ?? 0);
    formData.append('n_current_year', this.accountListForm.value.n_current_year ?? 0);

    formData.append('s_GroupItem_no', this.accountListForm.value.s_GroupItem_no ?? '');
    formData.append('n_Group_level', this.accountListForm.value.n_Group_level ?? 0);
    formData.append('s_GroupItem_name', this.accountListForm.value.s_GroupItem_name ?? '');
    formData.append('s_GroupItem_name_eng', this.accountListForm.value.s_GroupItem_name_eng ?? '');
    if(this.accountListForm.value.s_group_code == '' || this.accountListForm.value.s_group_code == null || this.accountListForm.value.s_group_code == undefined)
      formData.append('s_group_code', this.accountListForm.value.s_GroupItem_no ?? '');
    else
      formData.append('s_group_code', this.accountListForm.value.s_group_code ?? '');
    formData.append('s_upper_Group', this.upperGroup ?? '');
    formData.append('n_type', this.accountListForm.value.n_type ?? 0);
    formData.append('s_expenses_acc', this.accountListForm.value.s_expenses_acc ?? '');
    formData.append('s_income_acc', this.accountListForm.value.s_income_acc ?? '');

    if(this.btnSave == 'حفظ'){
      var oldNode = this.treeList.filter(x => x.text == this.accountListForm.value.s_GroupItem_name);
      if(oldNode.length > 0){
        this._notification.ShowMessage('إسم المجموعة مستخدم من قبل', 3);
        return;
      }
      else{
        this._scItemService.SaveGroup(formData).subscribe((data)=>{
          this._notification.ShowMessage(data.msg, data.status);
          this.GetAllAccounts();

          if(data.status == 1)
          {
            if(this.isAddBase)
              $('#jstree').jstree().create_node(null ,  { "id" : this.accountListForm.value.s_GroupItem_no, "text" : `${this.accountListForm.value.s_GroupItem_name} - ${this.accountListForm.value.s_GroupItem_no}` }, "last");
            else
              $('#jstree').jstree().create_node(this.upperGroup ,  { "id" : this.accountListForm.value.s_GroupItem_no, "text" : `${this.accountListForm.value.s_GroupItem_name} - ${this.accountListForm.value.s_GroupItem_no}` }, "last");

              this.isAddMode = false;
            this.isAccountSelected = false;
          }
        });
      }
    }
    else{
      this._scItemService.EditGroup(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllAccounts();

        if(data.status == 1)
        {
          $('#jstree').jstree().rename_node(this.selectedNode , `${this.accountListForm.value.s_GroupItem_name} - ${this.accountListForm.value.s_GroupItem_no}`);
          this.isAddMode = false;
          this.isAccountSelected = false;
        }
      });
    }
  }

  AppendFormData(){

    var formData: any = new FormData();
      formData.append("n_DataAreaID", this.accountListForm.controls['n_DataAreaID'].getRawValue()?? '');
      formData.append("n_UserAdd", this.accountListForm.controls['n_UserAdd'].getRawValue() ?? '');
      formData.append("d_UserAddDate", this.accountListForm.controls['d_UserAddDate'].getRawValue() ?? '');
      formData.append("n_UserUpdate", this.accountListForm.controls['n_UserUpdate'].getRawValue() ?? '');
      formData.append("d_UserUpdateDate", this.accountListForm.controls['d_UserUpdateDate'].getRawValue() ?? '');

      formData.append("s_GroupItem_no", this.accountListForm.controls['s_GroupItem_no'].getRawValue());
      formData.append("n_Group_level", this.accountListForm.controls['n_Group_level'].getRawValue());

      // formData.append("s_upper_Group", this.accountListForm.value["s_upper_Group"]);
      if(this.accountListForm.controls['n_DataAreaID'].getRawValue() == null || this.accountListForm.controls['n_DataAreaID'].getRawValue() == "")
      {
        formData.append("s_upper_Group", this.upperGroup);
      }
      else{
        formData.append("s_upper_Group", this.upperGroup);
      }

      formData.append("s_GroupItem_name", this.accountListForm.value["s_GroupItem_name"]);
      formData.append("s_GroupItem_name_eng", this.accountListForm.value["s_GroupItem_name_eng"]);
      formData.append("s_group_code", this.accountListForm.value["s_group_code"]);
      formData.append("n_type", this.accountListForm.value["n_type"]);
      formData.append("s_expenses_acc", this.accountListForm.value["s_expenses_acc"]);
      formData.append("s_income_acc", this.accountListForm.value["s_income_acc"]);

      return formData;
  }

  DeleteGroup() {
    var formData = this.AppendFormData();
    var children = this.treeList.filter(x => x.parent == this.accountListForm.value.s_GroupItem_no);
    debugger;
    if(children.length > 0){
      if(this.isEnglish)
      this._notification.ShowMessage("You can't remove main group contans other groups",3);
        else
      this._notification.ShowMessage('لا يمكن حذف جروب رئيسي يحتوي علي مسوتيات اخري',3);

    }
    else {
      this._scItemService.DeleteGroup(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllAccounts();
        if(data.status == 1)
          $('#jstree').jstree().delete_node(this.accountListForm.value.s_GroupItem_no);
      });
    }
  }

  onInputEvent()
  {
    var groupNo = this.accountListForm.get('s_GroupItem_no')?.value;
    this.btnSave = 'تعديل';
    this.isAccountSelected = true;
    this.isAddMode = false;
    this.isAddBase = false;

    this._scItemService.CheckIfGroupItemHasChilds(groupNo).subscribe((data) => {
      this.isHasChildrens = data;
    });

    this._scItemService.getAccountDataById(groupNo).subscribe((data)=>{
      if(data != null)
      {
        this.accountListForm.patchValue(data);
        this.s_GroupItem_name = this.accountListForm.value.s_GroupItem_name;
        this.selectedNode = data['s_GroupItem_no'];

        if(data["s_upper_Group"] == null){
          this.accountListForm.controls['s_upper_Group'].reset();
        }
        else{
          var parentNode = this.treeList.find(x => x.id == data["s_upper_Group"].trim());
          this.upperGroup = parentNode.id;
          this.accountListForm.patchValue({s_upper_Group: parentNode.text});
        }

        this.accountListForm.patchValue({n_type: data["n_type"]});
        this.accountListForm.patchValue({n_DataAreaID: data["n_DataAreaID"]});
        this.accountListForm.patchValue({n_UserAdd: data["n_UserAdd"]});
        this.accountListForm.patchValue({d_UserAddDate: data["d_UserAddDate"]});
        this.accountListForm.patchValue({n_UserUpdate: data["n_UserUpdate"]});
        this.accountListForm.patchValue({d_UserUpdateDate: data["d_UserUpdateDate"]});
        this.accountListForm.patchValue({n_current_branch: data["n_current_branch"]});
        this.accountListForm.patchValue({n_current_company: data["n_current_company"]});
        this.accountListForm.patchValue({n_current_year: data["n_current_year"]});
        this.accountListForm.patchValue({s_expenses_acc: data["s_expenses_acc"]});
        this.accountListForm.patchValue({s_income_acc: data["s_income_acc"]});
      }
      else{
        this.btnSave = 'حفظ';
        this.isAddBase = true;
        this.accountListForm = new FormGroup({
          n_DataAreaID: new FormControl(),
          n_UserAdd: new FormControl(),
          d_UserAddDate: new FormControl(),
          n_UserUpdate: new FormControl(),
          d_UserUpdateDate: new FormControl(),
          n_current_branch: new FormControl(),
          n_current_company: new FormControl(),
          n_current_year: new FormControl(),

          s_GroupItem_no: new FormControl(groupNo, Validators.required),
          n_Group_level: new FormControl(1),
          s_GroupItem_name: new FormControl('', Validators.required),
          s_GroupItem_name_eng: new FormControl(),
          s_group_code: new FormControl(),
          s_upper_Group: new FormControl(),
          n_type: new FormControl('', Validators.required),
          s_expenses_acc: new FormControl(),
          s_income_acc: new FormControl()
        });
      }
    });
  }
}
