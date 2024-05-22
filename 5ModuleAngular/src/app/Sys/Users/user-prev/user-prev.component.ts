import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { BaseComponent } from 'src/app/base/base.component';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UserService } from 'src/app/_Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UsersService } from 'src/app/Core/Api/Users/users.service';
import { ReplaySubject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-user-prev',
  templateUrl: './user-prev.component.html',
  styleUrls: ['./user-prev.component.css']
})
export class UserPrevComponent implements OnInit {
  searchingGroup:boolean=false;
  filteredGroupServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  groupType:any=[];

  constructor(private dataSharingService:DataSharingService
    ,private _UsersService :UsersService
    ,private _router  : Router 
    ,private _route  : ActivatedRoute
    ,private    userservice:UserService
    ,public dialog: MatDialog
    ,private _notification: NotificationServiceService
    ,private fb:FormBuilder) {

      this.dtOptions = {

        pagingType: 'full_numbers', 
        pageLength: 2, 
        processing: true
  
      };

      this.UserForm = this.fb.group({
        n_group_id:0,
        prevDetails: this.fb.array([])
      });

     }

     get prevDetails() : FormArray {
      return this.UserForm.get("prevDetails") as FormArray
    }

     showspinner:boolean=false;
     dtOptions: DataTables.Settings = {};
     Forms : any;
     UserForm!: FormGroup;
     userID:any;
     
  ngOnInit(): void {
    this.showspinner=true;
    this.userID = this._route.snapshot.paramMap.get('id');
    this.loadGroups('');
    this.selectALLEvent();
    this._UsersService.GetForms(0).subscribe(res=>{
      debugger;
      this.Forms=res;
      this._UsersService.GetUserPrev(this.userID).subscribe(res=>{
        if (res != null)
        {
          var index:number=0;
          this.Forms.forEach( (data) => {
            res.forEach( (dt) => {
              if(data.n_Form_ID == dt.n_Form_Id && data.sys_FormName==dt.sys_FormName){
                debugger;
                if(dt.b_Show==true)
                  $(".b_Show:eq("+index+")").prop('checked', true);
                
                if(dt.b_Save==true)
                  $(".b_Save:eq("+index+")").prop('checked', true);
                  
                if(dt.b_Update==true)
                  $(".b_Update:eq("+index+")").prop('checked', true);
  
                if(dt.b_Delete==true)
                  $(".b_Delete:eq("+index+")").prop('checked', true);
  
                if(dt.b_DeletePermanently==true)
                  $(".b_DeletePermanently:eq("+index+")").prop('checked', true);
  
                if(dt.b_Confirm==true)
                  $(".b_Confirm:eq("+index+")").prop('checked', true);
                  
                if(dt.b_Rep_Show==true)
                  $(".b_Rep_Show:eq("+index+")").prop('checked', true);
  
              }
            });
            index++;
          });       

        }
      }); 
      this.showspinner=false;
    }); 
    LangSwitcher.translatefun();
  }

  SearchGroup(value :any ){
    debugger;
    this.searchingGroup=true; 
    this.filteredGroupServerSide.next(  this.groupType.filter(x => x.s_group_name.toLowerCase().indexOf(value) > -1));
    this.searchingGroup=false;
  }

  loadGroups(value:any){
    this._UsersService.GetMainGroups().subscribe(res=>{
      this.groupType=res; 
      this.filteredGroupServerSide.next(  this.groupType.filter(x => x.s_group_name.toLowerCase().indexOf(value) > -1));
    });
  }

  save() { 
    debugger;
    this.showspinner=true;
    this.disableButtons();
    var _show : boolean[] = [], _save : boolean[] = [], _update : boolean[] = [], _delete : boolean[] = [], 
    _perdelete : boolean[] = [], _confirm : boolean[] = [], _print : boolean[] = [];
    var formData: any = new FormData();
    debugger;
    var _form=$(".n_Form_ID").map(function () { return $(this).val(); }).get();
    var _formName=$(".sys_FormName").map(function () { return $(this).val(); }).get();

    for (var i = 0; i < _form.length; i++) {
        if ($(".b_Show:eq(" + i + ")").is(":checked"))
          _show.push(true);
        else
          _show.push(false);

        if ($(".b_Save:eq(" + i + ")").is(":checked"))
          _save.push(true);
        else
          _save.push(false);

        if ($(".b_Update:eq(" + i + ")").is(":checked"))
          _update.push(true);
        else
          _update.push(false);

        if ($(".b_Delete:eq(" + i + ")").is(":checked"))
          _delete.push(true);
        else
          _delete.push(false);

        if ($(".b_DeletePermanently:eq(" + i + ")").is(":checked"))
          _perdelete.push(true);
        else
          _perdelete.push(false);

        if ($(".b_Confirm:eq(" + i + ")").is(":checked"))
          _confirm.push(true);
        else
          _confirm.push(false);

        if ($(".b_Rep_Show:eq(" + i + ")").is(":checked"))
          _print.push(true);
        else
          _print.push(false);
    }

    formData.append("comp", this.userservice.GetComp());
    formData.append("year", this.userservice.GetYear());

    for (var i=0; i<_form.length;i++) {
          formData.append("sys_User_PrevLst[" + i + "].n_User_Id", this.userID);
          formData.append("sys_User_PrevLst[" + i + "].n_Form_ID", _form[i]);
          formData.append("sys_User_PrevLst[" + i + "].Sys_FormName",_formName[i]);
          formData.append("sys_User_PrevLst[" + i + "].b_Show", _show[i]);
          formData.append("sys_User_PrevLst[" + i + "].b_Save", _save[i]);
          formData.append("sys_User_PrevLst[" + i + "].b_Update", _update[i]);
          formData.append("sys_User_PrevLst[" + i + "].b_Delete", _delete[i]);
          formData.append("sys_User_PrevLst[" + i + "].b_DeletePermanently", _perdelete[i]);
          formData.append("sys_User_PrevLst[" + i + "].b_Confirm", _confirm[i]);
          formData.append("sys_User_PrevLst[" + i + "].b_Rep_Show", _print[i]);
    }

    this._UsersService.SaveUserPrevelage(formData).subscribe(data=>{
      debugger;
      this.showspinner=false;
      this.enableButtons();
      this._notification.ShowMessage(data.msg,data.status);
      if(data.status==1){      
        this._router.navigate(['/sys/userslist']);
      }
    });

  }

  LoadForms(){
    this._UsersService.GetForms(this.UserForm.value.n_group_id).subscribe(res=>{
      this.Forms=res;
      this._UsersService.GetUserPrev(this.userID).subscribe(res=>{
        if (res != null)
        {
          var index:number=0;
          this.Forms.forEach( (data) => {
            res.forEach( (dt) => {
              if(data.n_Form_ID == dt.n_Form_Id && data.sys_FormName==dt.sys_FormName){
                debugger;
                if(dt.b_Show==true)
                  $(".b_Show:eq("+index+")").prop('checked', true);
                
                if(dt.b_Save==true)
                  $(".b_Save:eq("+index+")").prop('checked', true);
                  
                if(dt.b_Update==true)
                  $(".b_Update:eq("+index+")").prop('checked', true);
  
                if(dt.b_Delete==true)
                  $(".b_Delete:eq("+index+")").prop('checked', true);
  
                if(dt.b_DeletePermanently==true)
                  $(".b_DeletePermanently:eq("+index+")").prop('checked', true);
  
                if(dt.b_Confirm==true)
                  $(".b_Confirm:eq("+index+")").prop('checked', true);
                  
                if(dt.b_Rep_Show==true)
                  $(".b_Rep_Show:eq("+index+")").prop('checked', true);
  
              }
            });
            index++;
          });       

        }
      }); 
    });  
  }

  selectALLEvent() {
    $(document).on('change', '.selectAll', function () {
        var checked = this.checked;
        $("input[action='" + $(this).attr('action') + "']").each(function () {
            $(this).prop('checked', checked);
        });

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

}
