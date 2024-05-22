import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlCostCentersServicesService } from 'src/app/Core/Api/GL/gl-cost-centers-services.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';

declare var $: any;
export let glCostCenterNumber: string;

@Component({
  selector: 'app-costcenters-tree',
  templateUrl: './costcenters-tree.component.html',
  styleUrls: ['./costcenters-tree.component.css']
})
export class CostcentersTreeComponent implements OnInit {
  GlCostCenterForm!: FormGroup;

  btnSave: string = 'حفظ';
  s_costcenter_name: string = '';
  s_current_costcenter_name: string = '';

  treeData!: any[];
  costCentersTypesList: any;
  costCentersGroupsList: any;
  selectedNode: any;
  uppserCostCenterId: any;
 isEnglish:boolean=false;
  isCostCenterSelected: boolean = false;
  isHasChildrens: boolean = false;
  isAddMode: boolean = false;
  showspinner :boolean=false;
  isAddBase: boolean = true;

  constructor(private _glCostCentersService : GlCostCentersServicesService,
    private dataSharingService:DataSharingService, private _notification : NotificationServiceService, 
    private userservice: UserService, private _formBuilder: FormBuilder) 
  { 
    this.GlCostCenterForm = this._formBuilder.group({
      n_DataAreaID: new FormControl(),
      d_UserAddDate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      s_cost_center_id: new FormControl('', Validators.required),
      n_cost_center_level: new FormControl(),
      b_stop: new FormControl(),
      s_cost_center_name: new FormControl('', Validators.required),
      s_cost_center_name_eng: new FormControl(),
      s_upper_cost_center: new FormControl(),
      s_upper_cost_center_name: new FormControl(),
      n_cost_center_type: new FormControl('', Validators.required),
      n_cost_center_class: new FormControl(),
      s_prefix: new FormControl()
    });
  }

  ngOnInit(): void {
    this.GetAccountsTypes();
    this.GetGlCostCentersClass();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
    $(document).ready(() => {
      this.showspinner=true;
      this._glCostCentersService.GetAllGlCostCenters().subscribe((data)=>{
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
      this.treeData = data;
      $('#jstree').jstree().settings.core.data = data;
    });
  }

  @HostListener('window:GetAccountInfo', ['$event.detail'])
  GetAccountInfo(){
    this.btnSave = 'تعديل';
    this.isCostCenterSelected = true;
    this.isAddMode = false;

    this._glCostCentersService.CheckIfCostCenterHasChilds(glCostCenterNumber).subscribe((data) => {
      this.isHasChildrens = data;
    });

    this._glCostCentersService.GetCostCenterInfo(glCostCenterNumber).subscribe((data)=>{
      this.GlCostCenterForm.patchValue(data);
      this.s_current_costcenter_name = this.GlCostCenterForm.value.s_cost_center_name;
      this.selectedNode = data['s_cost_center_id'];

      if(data["s_upper_cost_center"] == null){
        this.GlCostCenterForm.controls['s_upper_cost_center'].reset();
      }
      else{
        var parentNode = this.treeData.find(x => x.id == data["s_upper_cost_center"].trim());
        this.uppserCostCenterId = parentNode.id;
        this.GlCostCenterForm.patchValue({s_upper_cost_center: parentNode.text});
      }

      if(this.treeData.find(x => x.id == glCostCenterNumber).parent != "#"){
        this.s_costcenter_name = this.treeData.find(x => x.id == this.treeData.find(x => x.id == glCostCenterNumber).parent).text;
      }
      else{
        this.s_costcenter_name = null!;
      }
      this.GlCostCenterForm.patchValue({s_upper_cost_center_name: this.s_costcenter_name});
    });
  }

  AddAccount(){
    this.GlCostCenterForm = this._formBuilder.group({
      n_DataAreaID: new FormControl(),
      d_UserAddDate: new FormControl(),
      d_UserUpdateDate: new FormControl(),
      s_cost_center_id: new FormControl('', Validators.required),
      n_cost_center_level: new FormControl(),
      b_stop: new FormControl(),
      s_cost_center_name: new FormControl('', Validators.required),
      s_cost_center_name_eng: new FormControl(),
      s_upper_cost_center: new FormControl(),
      s_upper_cost_center_name: new FormControl(),
      n_cost_center_type: new FormControl('', Validators.required),
      n_cost_center_class: new FormControl(),
      s_prefix: new FormControl()
    });
  }

  @HostListener('window:AddNewItem', ['$event.detail'])
  AddNewItem(){
    var costCenterNumber = this.GlCostCenterForm.get('s_cost_center_id')?.value;
    var costCenterType = Number( this.GlCostCenterForm.get('n_cost_center_type')?.value );
    var costCenterName = this.GlCostCenterForm.get('s_cost_center_name')?.value;

    if((costCenterType == 2 || costCenterType == 0 || costCenterType == null || costCenterType == undefined) && costCenterName != '')
    {
      this._notification.ShowMessage("لا يمكن الاضافة علي مركز فرعي, من فضلك اختر مركز رئيسي...!", 3);
      return;
    }

    if(costCenterNumber == null || costCenterNumber == '') {
      this.isAddBase = true;
      this.isAddMode = true;
      this.uppserCostCenterId = null;
      this._glCostCentersService.GetNextBaseCostCenterData().subscribe((data) => {
        this.GlCostCenterForm = this._formBuilder.group({
          n_DataAreaID: new FormControl(),
          d_UserAddDate: new FormControl(),
          d_UserUpdateDate: new FormControl(),
          s_cost_center_id: new FormControl('', Validators.required),
          n_cost_center_level: new FormControl(),
          b_stop: new FormControl(),
          s_cost_center_name: new FormControl('', Validators.required),
          s_cost_center_name_eng: new FormControl(),
          s_upper_cost_center: new FormControl(),
          s_upper_cost_center_name: new FormControl(),
          n_cost_center_type: new FormControl('', Validators.required),
          n_cost_center_class: new FormControl(),
          s_prefix: new FormControl()
        });
        this.GlCostCenterForm.patchValue({s_cost_center_id: data["s_cost_center_id"]});
        this.GlCostCenterForm.patchValue({n_cost_center_level: data["n_cost_center_level"]});
      });
    }
    else
    {
      this.btnSave = 'حفظ';
      this.isHasChildrens = false;
      this.isAddMode = true;
      this.isAddBase = false;

      this._glCostCentersService.GetNewGlCostCenterID(glCostCenterNumber).subscribe((data)=>{
      if(data.s_cost_center_id == null){
        this._notification.ShowMessage("هذا المستوي غير موجود", 3);
        this.isHasChildrens = true;
        return;
      }
      else
      {
          this.GlCostCenterForm = this._formBuilder.group({
            n_DataAreaID: new FormControl(),
            d_UserAddDate: new FormControl(),
            d_UserUpdateDate: new FormControl(),
            s_cost_center_id: new FormControl('', Validators.required),
            n_cost_center_level: new FormControl(),
            b_stop: new FormControl(),
            s_cost_center_name: new FormControl('', Validators.required),
            s_cost_center_name_eng: new FormControl(),
            s_upper_cost_center: new FormControl(),
            s_upper_cost_center_name: new FormControl(),
            n_cost_center_type: new FormControl('', Validators.required),
            n_cost_center_class: new FormControl(),
            s_prefix: new FormControl()
          });
          this.GlCostCenterForm.patchValue({s_cost_center_id: data["s_cost_center_id"]});
          this.GlCostCenterForm.patchValue({n_cost_center_level: data["n_cost_center_level"]});
          var parentNode = this.treeData.find(x => x.id == data["s_upper_cost_center"].trim());
          this.uppserCostCenterId = parentNode.id;
          this.GlCostCenterForm.patchValue({s_upper_cost_center: parentNode.text});
        }
      });
    }
  }

  GetAccountsTypes() : any {
    this._glCostCentersService.GetAccountsTypes().subscribe((data)=>{
      this.costCentersTypesList=data;
    });
  }

  GetGlCostCentersClass() {
    this._glCostCentersService.GetGlCostCentersClass().subscribe((data)=>{
      this.costCentersGroupsList=data;
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

  Save()
  {
    var formData = new FormData();
    formData.append('n_DataAreaID', this.GlCostCenterForm.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.GlCostCenterForm.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.GlCostCenterForm.value.d_UserUpdateDate ?? '');
    formData.append('s_cost_center_id', this.GlCostCenterForm.value.s_cost_center_id ?? '');
    formData.append('n_cost_center_level', this.GlCostCenterForm.value.n_cost_center_level ?? 0);
    formData.append('s_cost_center_name', this.GlCostCenterForm.value.s_cost_center_name ?? '');
    formData.append('s_cost_center_name_eng', this.GlCostCenterForm.value.s_cost_center_name_eng ?? '');
    formData.append('s_upper_cost_center', this.uppserCostCenterId ?? '');
    formData.append('s_upper_cost_center_name', this.GlCostCenterForm.value.s_upper_cost_center_name ?? '');
    formData.append('n_cost_center_type', this.GlCostCenterForm.value.n_cost_center_type ?? 0);
    formData.append('n_cost_center_class', this.GlCostCenterForm.value.n_cost_center_class ?? 0);
    formData.append('s_prefix', this.GlCostCenterForm.value.s_prefix ?? '');
    formData.append('b_stop', this.GlCostCenterForm.value.b_stop ?? '');

    if(this.btnSave == 'حفظ')
    {
      var oldNode = this.treeData.filter(x => x.text == this.GlCostCenterForm.value.s_cost_center_name);
      if(oldNode.length > 0)
      {
        this._notification.ShowMessage('اسم الحساب هذا مستخدم من قبل...', 3);
        return;
      }
      else{
        this._glCostCentersService.SaveCostCenter(formData).subscribe((data)=>{
          this._notification.ShowMessage(data.msg, data.status);
          this.GetAllCostCenters();
  
          if(data.status == 1)
          {
            if(this.isAddBase)
              $('#jstree').jstree().create_node(null ,  { "id" : this.GlCostCenterForm.value.s_cost_center_id, "text" : `${this.GlCostCenterForm.value.s_cost_center_name} - ${this.GlCostCenterForm.value.s_cost_center_id}` }, "last");
            else
              $('#jstree').jstree().create_node(this.uppserCostCenterId ,  { "id" : this.GlCostCenterForm.value.s_cost_center_id, "text" : `${this.GlCostCenterForm.value.s_cost_center_name} - ${this.GlCostCenterForm.value.s_cost_center_id}` }, "last");
            
              this.isAddMode = false;
            this.isCostCenterSelected = false;
          }
        });
      }
    }
    else{
      this.showspinner=true;
      this._glCostCentersService.EditCostCenter(formData).subscribe((data)=>{
        this._notification.ShowMessage(data.msg, data.status);
        this.GetAllCostCenters();

        if(data.status == 1)
        {
          if(this.isAddBase)
            $('#jstree').jstree().rename_node(null , `${this.GlCostCenterForm.value.s_cost_center_name} - ${this.GlCostCenterForm.value.s_cost_center_id}`);
          else
            $('#jstree').jstree().rename_node(this.selectedNode , `${this.GlCostCenterForm.value.s_cost_center_name} - ${this.GlCostCenterForm.value.s_cost_center_id}`);
          this.isAddMode = false;
          this.isCostCenterSelected = false;
        }
        this.showspinner=false;
      });
    }
  }

  DeleteCostCenter()
  {
    var id = this.GlCostCenterForm.value.s_cost_center_id;
    var children = this.treeData.filter(x => x.parent == this.GlCostCenterForm.value.s_cost_center_id);

    if(children.length > 0){
      this._notification.ShowMessage('لا يمكن حذف مركز رئيسي يحتوي علي مسوتيات اخري',3);
    }else{
      this._glCostCentersService.DeleteCostCenter(id).subscribe((data)=>{
        this._notification.ShowMessage(data.msg,data.status);
        this.GetAllCostCenters();
        
        if(data.status == 1)
          $('#jstree').jstree().delete_node(this.GlCostCenterForm.value.s_cost_center_id);
      });
    }
  }

  onInputEvent()
  {
    var costCenterId = this.GlCostCenterForm.get('s_cost_center_id')?.value;
    this.btnSave = 'تعديل';
    this.isCostCenterSelected = true;
    this.isAddMode = false;
    this.isAddBase = false;

    this._glCostCentersService.CheckIfCostCenterHasChilds(costCenterId).subscribe((data) => {
      this.isHasChildrens = data;
    });

    this._glCostCentersService.GetCostCenterInfo(costCenterId).subscribe((data)=>{
      if(data != null)
      {
        this.GlCostCenterForm.patchValue(data);
        this.s_current_costcenter_name = this.GlCostCenterForm.value.s_cost_center_name;
        this.selectedNode = data['s_cost_center_id'];
  
        if(data["s_upper_cost_center"] == null){
          this.GlCostCenterForm.controls['s_upper_cost_center'].reset();
        }
        else{
          var parentNode = this.treeData.find(x => x.id == data["s_upper_cost_center"].trim());
          this.uppserCostCenterId = parentNode.id;
          this.GlCostCenterForm.patchValue({s_upper_cost_center: parentNode.text});
        }
  
        if(this.treeData.find(x => x.id == glCostCenterNumber).parent != "#"){
          this.s_costcenter_name = this.treeData.find(x => x.id == this.treeData.find(x => x.id == glCostCenterNumber).parent).text;
        }
        else{
          this.s_costcenter_name = null!;
        }
        this.GlCostCenterForm.patchValue({s_upper_cost_center_name: this.s_costcenter_name});
      }
      else
      {
        this.btnSave = 'حفظ';
        this.isAddBase = true;
        this.GlCostCenterForm = new FormGroup({
          n_DataAreaID: new FormControl(),
          d_UserAddDate: new FormControl(),
          d_UserUpdateDate: new FormControl(),
          s_cost_center_id: new FormControl('', Validators.required),
          n_cost_center_level: new FormControl(),
          b_stop: new FormControl(),
          s_cost_center_name: new FormControl('', Validators.required),
          s_cost_center_name_eng: new FormControl(),
          s_upper_cost_center: new FormControl(),
          s_upper_cost_center_name: new FormControl(),
          n_cost_center_type: new FormControl('', Validators.required),
          n_cost_center_class: new FormControl(),
          s_prefix: new FormControl()
        });
      }
    });
  }
}
