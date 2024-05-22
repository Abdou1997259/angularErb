import { Component, OnInit } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { customer } from 'src/app/_model/Cutomer/CustomerModel';
import { user_prev } from 'src/app/_model/Prev/UserPrev';
import { users } from 'src/app/_model/Prev/users';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';
import { UsersPrevService } from 'src/app/_Services/Prev/users-prev.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-prev',
  templateUrl: './prev.component.html',
  styleUrls: ['./prev.component.css']
})
export class PrevComponent implements OnInit {

  constructor(private _userPrevService : UsersPrevService
    ,private userService:UserService
    ,private dataSharingService:DataSharingService
    ,private toastr: ToastrService
    ) { }

  users : Array<users>=[];

  menutables : Array<user_prev>=[];
  Loadusers( ):void{
    this._userPrevService.GetUsers().subscribe((data)=>{
      this.users = data;
     });
  }

  ngOnInit(): void {
    this.Loadusers();
}

CheckAll(id : number,event:any){
  var _value = event.target.checked;
  this.menutables.forEach(element => {
    if(id == 1)
       element.can_new=_value;
    if(id == 2)
       element.can_update=_value;
    if(id == 3)
       element.can_delete=_value;
    else if(id == 4)
       element.can_confirm=_value;
  });
}

disablesave:boolean=true;
 UserChange(event : any ){
 console.log();
 this.menutables= [];
 this.disablesave=true;
 if(event.target.value > 0 )
  this.LoadMenu(event.target.value);
 }

 LoadMenu(userid : number){
  this.dataSharingService.showLoader();

  this._userPrevService.GetUserPrev(userid).subscribe((data)=>{
    this.menutables=data;
    this.disablesave=false;;
    this.dataSharingService.hideLoader();
    setTimeout(() => {
      this.loadDataTableScripts();
  }, 1);

});
}
Save(){
console.log(this.menutables);

    var formData: any = new FormData();

    for (var i = 0; i < this.menutables.length; i++) {
      formData.append("lstusersPrev[" + i + "].n_menu_id", this.menutables[i].n_menu_id);
      formData.append("lstusersPrev[" + i + "].n_user_id", this.menutables[i].n_user_id);
      formData.append("lstusersPrev[" + i + "].can_new", this.menutables[i].can_new);
      formData.append("lstusersPrev[" + i + "].can_update", this.menutables[i].can_update);
      formData.append("lstusersPrev[" + i + "].can_delete", this.menutables[i].can_delete);
      formData.append("lstusersPrev[" + i + "].can_confirm", this.menutables[i].can_confirm);
  }




       this._userPrevService.SavePrev(formData).subscribe((data)=>{

        if(this.menutables[0].n_user_id.toString() == this.userService.GetUserID())
        {
          this._userPrevService.GetUserForms(this.menutables[0].n_user_id).subscribe((data)=>{
            this.userService.SaveUserForms(data);
            this._userPrevService.ChangeMenuTable(data);

          });

        }



        this.toastr.success('saved!', 'تم الحفظ بنجاح');

       });



}
loadDataTableScripts():void{

  let body = <HTMLDivElement> document.body;
  let script = document.createElement('script');


  const html =`$("#CustDataTable").DataTable();`;
  script.innerHTML = html;
  script.async = true;
  script.defer = true;
  body.appendChild(script);

}


}
