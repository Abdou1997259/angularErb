import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlCostCentersServicesService } from 'src/app/Core/Api/GL/gl-cost-centers-services.service';
import { AccountListTree } from 'src/app/Core/model/AccountListTree/account-list-tree';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
declare var $: any;


export let glCostCenterNumber: string;
// export let glCostCenterName: string;

@Component({
  selector: 'app-gl-cost-centers',
  templateUrl: './gl-cost-centers.component.html',
  styleUrls: ['./gl-cost-centers.component.css']
})
export class GlCostCentersComponent implements OnInit {


  accountsTypesList!: any[];
  glCostCentersClassList!: any[];
  treeData!: any[];
  glCostCenterName!: string;
  uppserCostCenterId!: any;
  showspinner :boolean=false;

  constructor(private _glCostCentersService : GlCostCentersServicesService,
    private dataSharingService:DataSharingService, private _notification : NotificationServiceService, private userservice: UserService) { }


    GlCostCenterForm = new FormGroup({
      n_DataAreaID: new FormControl(),
      d_UserAddDate: new FormControl(),
      s_cost_center_id: new FormControl(),
      n_cost_center_level: new FormControl(),
      b_stop: new FormControl(),
      s_cost_center_name: new FormControl(),
      s_cost_center_name_eng: new FormControl(),
      s_upper_cost_center: new FormControl(),
      s_upper_cost_center_name: new FormControl(),
      n_cost_center_type: new FormControl(),
      n_cost_center_class: new FormControl(),
      btn_operation: new FormControl('حفظ'),
      btn_delete: new FormControl('حذف'),
      jstreeControl: new FormControl(),
    });

  ngOnInit(): void {
    this.GetAccountsTypes();
    this.GetGlCostCentersClass();


    $(document).ready(() => {
      this.showspinner=true;
      this.GlCostCenterForm.controls['btn_delete'].disable();
      this._glCostCentersService.GetAllGlCostCenters().subscribe((data)=>{
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
        glCostCenterNumber = data.node.id;

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


  GetAllCostCenters(){
    this._glCostCentersService.GetAllGlCostCenters().subscribe((data)=>{
      this.AddAccount();
      $('#jstree').jstree().settings.core.data = data;
      // $("#jstree").jstree(true).refresh(true, true);
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
    }, 0);
    
  }
  translatefun()
  {
    debugger
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

  @HostListener('window:GetAccountInfo', ['$event.detail'])
  GetAccountInfo(){
    this._glCostCentersService.GetCostCenterInfo(glCostCenterNumber).subscribe((data)=>{
      this.GlCostCenterForm.controls['n_DataAreaID'].disable();
      this.GlCostCenterForm.controls['d_UserAddDate'].disable();
      this.GlCostCenterForm.controls['s_cost_center_id'].disable();
      this.GlCostCenterForm.controls['n_cost_center_level'].disable();
      this.GlCostCenterForm.controls['s_upper_cost_center'].disable();
      this.GlCostCenterForm.controls['s_upper_cost_center_name'].disable();
      this.GlCostCenterForm.controls['btn_delete'].enable();
      this.GlCostCenterForm.controls['btn_operation'].setValue('تعديل');

      this.GlCostCenterForm.patchValue({n_DataAreaID: data["n_DataAreaID"]});
      this.GlCostCenterForm.patchValue({d_UserAddDate: data["d_UserAddDate"]});
      this.GlCostCenterForm.patchValue({s_cost_center_id: data["s_cost_center_id"]});
      this.GlCostCenterForm.patchValue({n_cost_center_level: data["n_cost_center_level"]});
      this.GlCostCenterForm.patchValue({b_stop: data["b_stop"]});
      this.GlCostCenterForm.patchValue({s_cost_center_name: data["s_cost_center_name"]});
      this.GlCostCenterForm.patchValue({s_cost_center_name_eng: data["s_cost_center_name_eng"]});

      debugger;
      if(data["s_upper_cost_center"] == null){
        this.GlCostCenterForm.controls['s_upper_cost_center'].reset();
      }
      else{
        debugger;
        var parentNode = this.treeData.find(x => x.id == data["s_upper_cost_center"].trim());
        this.uppserCostCenterId = parentNode.id;
        this.GlCostCenterForm.patchValue({s_upper_cost_center: parentNode.text});
      }
      // this.GlCostCenterForm.patchValue({s_upper_cost_center: data["s_upper_cost_center"]});
      console.log(this.treeData.find(x => x.id == glCostCenterNumber).parent);
      if(this.treeData.find(x => x.id == glCostCenterNumber).parent != "#"){
        this.glCostCenterName = this.treeData.find(x => x.id == this.treeData.find(x => x.id == glCostCenterNumber).parent).text;
      }
      else{
        this.glCostCenterName = null!;
      }
      this.GlCostCenterForm.patchValue({s_upper_cost_center_name: this.glCostCenterName});
      this.GlCostCenterForm.patchValue({n_cost_center_type: data["n_cost_center_type"]});
      this.GlCostCenterForm.patchValue({n_cost_center_class: data["n_cost_center_class"]});
    });
  }

  GetAccountsTypes() : any {
    this._glCostCentersService.GetAccountsTypes().subscribe((data)=>{
      this.accountsTypesList=data;
    });
  }

  GetGlCostCentersClass(){
    this._glCostCentersService.GetGlCostCentersClass().subscribe((data)=>{
      this.glCostCentersClassList=data;
    });
  }


  AddAccount(){
    debugger;
    this.GlCostCenterForm.controls['s_cost_center_id'].enable();
    this.GlCostCenterForm.controls['n_cost_center_level'].enable();
    this.GlCostCenterForm.controls['s_upper_cost_center'].enable();
    this.GlCostCenterForm.controls['s_upper_cost_center_name'].enable();
    this.GlCostCenterForm.controls['btn_delete'].disable();


    this.GlCostCenterForm = new FormGroup({
      n_DataAreaID: new FormControl(),
      d_UserAddDate: new FormControl(),
      s_cost_center_id: new FormControl(),
      n_cost_center_level: new FormControl(),
      b_stop: new FormControl(),
      s_cost_center_name: new FormControl(),
      s_cost_center_name_eng: new FormControl(),
      s_upper_cost_center: new FormControl(),
      s_upper_cost_center_name: new FormControl(),
      n_cost_center_type: new FormControl(),
      n_cost_center_class: new FormControl(),
      btn_operation: new FormControl('حفظ'),
      btn_delete: new FormControl('حذف'),
      jstreeControl: new FormControl(),
    });
  }


  AppendFormData(){
    var formData: any = new FormData();
      formData.append("n_DataAreaID", this.GlCostCenterForm.controls['n_DataAreaID'].getRawValue());
      formData.append("d_UserAddDate", this.GlCostCenterForm.controls['d_UserAddDate'].getRawValue());
      formData.append("s_cost_center_id", this.GlCostCenterForm.controls['s_cost_center_id'].getRawValue());
      formData.append("n_cost_center_level", this.GlCostCenterForm.controls['n_cost_center_level'].getRawValue());
      if(this.GlCostCenterForm.controls['b_stop'].getRawValue() != null){
        formData.append("b_stop", this.GlCostCenterForm.value["b_stop"]);
      }
      formData.append("s_cost_center_name", this.GlCostCenterForm.value["s_cost_center_name"]);
      if(this.GlCostCenterForm.controls['s_cost_center_name_eng'].getRawValue() != null){
        formData.append("s_cost_center_name_eng", this.GlCostCenterForm.value["s_cost_center_name_eng"]);
      }
      // var parentNode = this.treeData.find(x => x.text == this.GlCostCenterForm.controls['s_upper_cost_center'].getRawValue());
      debugger;
      if(this.GlCostCenterForm.controls['n_DataAreaID'].getRawValue() == null || this.GlCostCenterForm.controls['n_DataAreaID'].getRawValue() == "")
      {
        formData.append("s_upper_cost_center", this.uppserCostCenterId);
      }
      else{
        formData.append("s_upper_cost_center", this.uppserCostCenterId);
      }
      // formData.append("s_upper_cost_center", this.GlCostCenterForm.controls['s_upper_cost_center'].getRawValue());
      if(this.GlCostCenterForm.controls['n_cost_center_type'].getRawValue() != null){
        formData.append("n_cost_center_type", this.GlCostCenterForm.controls['n_cost_center_type'].getRawValue());
      }
      if(this.GlCostCenterForm.controls['n_cost_center_class'].getRawValue() != null){
        formData.append("n_cost_center_class", this.GlCostCenterForm.controls['n_cost_center_class'].getRawValue());
      }


      return formData;

  }

  DeleteCostCenter(){
    var formData = this.AppendFormData();
    this._glCostCentersService.DeleteCostCenter(formData).subscribe((data)=>{
      this._notification.ShowMessage(data.msg,data.status);
      this.GetAllCostCenters();
      $('#jstree').jstree().delete_node(this.GlCostCenterForm.controls['s_cost_center_id'].getRawValue());
    });
  }


  Save(){

    if(this.GlCostCenterForm.controls['s_cost_center_id'].enabled){
      console.log("Save");

      var oldNode = this.treeData.filter(x => x.text == this.GlCostCenterForm.controls['s_cost_center_name'].getRawValue());
      if(oldNode.length > 0){
        // console.log("oldNode");
        // console.log(oldNode);
        this._notification.ShowMessage('إسم مركز التكلفة مستخدم من قبل',3);
      }
      else{
        var formData = this.AppendFormData();
        this.showspinner=true;
        this._glCostCentersService.SaveCostCenter(formData).subscribe((data)=>{
          this._notification.ShowMessage(data.msg,data.status);
          this.GetAllCostCenters();
          this.showspinner=false;
        });
      }
      $('#jstree').jstree().create_node(this.uppserCostCenterId ,  { "id" : this.GlCostCenterForm.controls['s_cost_center_id'].getRawValue(), "text" : this.GlCostCenterForm.value["s_cost_center_name"] }, "last");
    }
    else{
      console.log("Update");
      var formData = this.AppendFormData();
      this.showspinner=true;
      this._glCostCentersService.EditCostCenter(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllCostCenters();
        this.showspinner=false;
      });

    }



  }


  @HostListener('window:AddNewItem', ['$event.detail'])
  AddNewItem(){
    this._glCostCentersService.GetNewGlCostCenterID(glCostCenterNumber).subscribe((data)=>{
      console.log("newCostCenters");
      console.log(data);
      if(data.s_cost_center_id == null){
        this._notification.ShowMessage("فرعي لا يمكنك الإضافة",3);
      }
      else{
        debugger;
        this.GlCostCenterForm.controls['s_cost_center_id'].disable();
        this.GlCostCenterForm.controls['n_cost_center_level'].disable();
        this.GlCostCenterForm.controls['s_upper_cost_center'].disable();

        this.GlCostCenterForm.controls['n_cost_center_type'].enable();
        // this.GlCostCenterForm.controls['n_account_group'].enable();
        // this.GlCostCenterForm.controls['n_account_open_balance_nature'].enable();
        this.GlCostCenterForm.controls['btn_delete'].disable();


        this.GlCostCenterForm = new FormGroup({
          n_DataAreaID: new FormControl(''),
          d_UserAddDate: new FormControl(''),
          s_cost_center_id: new FormControl(),
          n_cost_center_level: new FormControl(),
          b_stop: new FormControl(),
          s_cost_center_name: new FormControl(),
          s_cost_center_name_eng: new FormControl(),
          s_upper_cost_center: new FormControl(),
          s_upper_cost_center_name: new FormControl(),
          n_cost_center_type: new FormControl(),
          n_cost_center_class: new FormControl(),
          btn_operation: new FormControl('حفظ'),
          btn_delete: new FormControl('حذف'),
          jstreeControl: new FormControl(),
        });

        this.GlCostCenterForm.patchValue({s_cost_center_id: data["s_cost_center_id"]});
        this.GlCostCenterForm.patchValue({n_cost_center_level: data["n_cost_center_level"]});
        var parentNode = this.treeData.find(x => x.id == data["s_upper_cost_center"].trim());
        this.uppserCostCenterId = parentNode.id;
        this.GlCostCenterForm.patchValue({s_upper_cost_center: parentNode.text});
        // this.GlCostCenterForm.patchValue({s_upper_cost_center: data["s_upper_cost_center"]});
        // this.GlCostCenterForm.patchValue({n_account_group: data["n_account_group"]});
        // this.GlCostCenterForm.patchValue({n_account_open_balance_nature: data["n_account_open_balance_nature"]});
      }
    });
  }

}
