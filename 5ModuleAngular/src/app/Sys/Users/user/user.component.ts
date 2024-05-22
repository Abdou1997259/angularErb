import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JournalTypesLookupComponent } from 'src/app/Controls/journal-types-lookup/journal-types-lookup.component';
import { CurrencyLookupComponent } from 'src/app/Controls/currency-lookup/currency-lookup.component';
import { ReplaySubject } from 'rxjs';
import { AccountsLookupComponent } from 'src/app/Controls/accounts-lookup/accounts-lookup.component';
import { CostcentersLookupComponent } from 'src/app/Controls/costcenters-lookup/costcenters-lookup.component';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { UsersService } from 'src/app/Core/Api/Users/users.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends BaseComponent implements OnInit {

  UserForm!: FormGroup;
  groupType:any=[];
  showspinner:boolean=false;
  searchingGroup:boolean=false;
  filteredGroupServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
isEnglish:boolean=false;
  constructor(private fb:FormBuilder
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private userservice:UserService
    ,private _UsersService:UsersService) {
      super(_route.data,userservice);

      this.UserForm = this.fb.group({
        n_ID:'',
        s_User_Name: new FormControl('', Validators.required),
        s_User_Name_eng: '',
        n_Is_Group: true,
        s_User_Password:'',
        n_Parent_Id:'',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:''
      }); 
     }
     override ngOnInit(): void {
      this.searchGroup('');
      this.userNo = this._activatedRoute.snapshot.paramMap.get('id');
      
      if(this.userNo !=null && this.userNo > 0 ){
        this.showspinner=true;
        this._UsersService.GetUserById(this.userNo).subscribe(data=>{
          debugger;
          this.UserForm.patchValue(data);
          //(this.UserForm.get("n_Parent_Id"))?.patchValue(data.n_Parent_Id);
          this.showspinner=false;
  
        });
  
        return;
     }
     LangSwitcher.translateData(1)
     LangSwitcher.translatefun();
     this.isEnglish=LangSwitcher.CheckLan();
  
    }
     searchGroup(value :any ){
      this.searchingGroup=true; 
      this._UsersService.GetUserGroups().subscribe(res=>{
        this.groupType=res; 
        this.filteredGroupServerSide.next(  this.groupType.filter(x => x.s_group_name.toLowerCase().indexOf(value) > -1));
      });    
      this.searchingGroup=false;
     }

     save() { 
      debugger;
      this.showspinner=true;
      this.disableButtons();
      
      var formData: any = new FormData();
        formData.append("n_ID", this.UserForm.value.n_ID ?? 0);
        formData.append("s_User_Name", this.UserForm.value.s_User_Name);
        formData.append("s_User_Name_eng", this.UserForm.value.s_User_Name_eng);
        formData.append("n_Is_Group", this.UserForm.value.n_Is_Group ?? 0);
        formData.append("s_User_Password", this.UserForm.value.s_User_Password);
        formData.append("n_Parent_Id", this.UserForm.value.n_Parent_Id ?? 0);
        formData.append("n_DataAreaID", this.UserForm.value.n_DataAreaID ?? 0);
        formData.append("n_UserAdd", this.UserForm.value.n_UserAdd ?? 0);
        formData.append("d_UserAddDate", this.UserForm.value.d_UserAddDate);
        formData.append("n_logged_user", this.userservice.GetUserID());
        formData.append("s_logged_user", this.userservice.GetUserName());
        formData.append("n_current_branch", this.userservice.GetBranch());
        formData.append("n_current_company", this.userservice.GetComp());
        formData.append("n_current_year", this.userservice.GetYear());
        formData.append("comp", this.userservice.GetComp());
        formData.append("year", this.userservice.GetYear());

        if(this.userNo !=null && this.userNo > 0 ){

          this._UsersService.SaveEdit(formData).subscribe(data=>{
            debugger;
            this.showspinner=false;
            this.enableButtons();
            if(this.isEnglish)
               this. _notification.ShowMessage(data.Emsg,data.status);
             else
                this. _notification.ShowMessage(data.msg,data.status);
             if(data.status==1){      
              this._router.navigate(['/sys/userslist']);
            }
          });
        }
        else
        {
          this._UsersService.SaveNew(formData).subscribe(data=>{
          debugger;
          this.showspinner=false;
          this.enableButtons();
          if(this.isEnglish)
               this. _notification.ShowMessage(data.Emsg,data.status);
             else
                this. _notification.ShowMessage(data.msg,data.status);
          if(data.status==1){
          
            this._router.navigate(['/sys/userslist']);
            this.UserForm = this.fb.group({
              n_ID:'',
              s_User_Name: new FormControl('', Validators.required),
              s_User_Name_eng: '',
              n_Is_Group: true,
              s_User_Password:'',
              n_Parent_Id:'',
              n_DataAreaID:'',
              n_UserAdd:'',
              d_UserAddDate:'',
              n_current_branch:'',
              n_current_company:'',
              n_current_year:''
            }); 
          }
      });
    }

    }

  userNo : any;


  setValidation(){
    debugger;
    if (this.UserForm.value.n_Is_Group==false) 
    {
      this.UserForm.controls['s_User_Name'].setValidators([Validators.required]);
      this.UserForm.controls['s_User_Password'].setValidators([Validators.required]);
      this.UserForm.controls['n_Parent_Id'].setValidators([Validators.required]);
    } 
    else 
    {
      this.UserForm.controls['s_User_Name'].clearValidators();
      this.UserForm.controls['s_User_Password'].clearValidators();
      this.UserForm.controls['n_Parent_Id'].clearValidators();
    }
    this.UserForm.controls['s_User_Name'].updateValueAndValidity();
    this.UserForm.controls['s_User_Password'].updateValueAndValidity();
    this.UserForm.controls['n_Parent_Id'].updateValueAndValidity();

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
