import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { SubscribeService } from 'src/app/Core/Api/Main/subscribe.service';
import { UsersService } from 'src/app/Core/Api/Users/users.service';
import { CustomValidators } from 'src/app/_Setting/CustomValidators';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent extends BaseComponent  implements OnInit {

  dtOptions: DataTables.Settings = {};
  UserForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  DocNo : any;
  DataAreaNo : any;
  editMode:boolean=false;
  showspinner:boolean=false;
  groupType:any=[];
  searchingGroup:boolean=false;
  filteredGroupServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private fb:FormBuilder
  ,private _SubscribeService : SubscribeService
  ,public dialog: MatDialog
  ,private _activatedRoute: ActivatedRoute
  ,private _notification: NotificationServiceService
  ,private _router : Router
  ,private _route : ActivatedRoute
  ,private userservice:UserService
  ,private _UsersService:UsersService) {
    super(_route.data,userservice);

    this.myDatepipe = new DatePipe('en-US');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      processing: true
    };

    this.UserForm = this.fb.group(
      {
        s_user_name: new FormControl('', [Validators.required]),
        s_user_password:new FormControl('', [Validators.required]),
        // s_confirm_password:new FormControl('', [Validators.required]),
        n_group_id:new FormControl('', [Validators.required])
      }
      //[CustomValidators.MatchValidator('s_user_password', 's_confirm_password')]
    );


    }


     searchGroup(value :any ){
      this.searchingGroup=true; 
      this._UsersService.GetUserGroups().subscribe(res=>{
        this.groupType=res; 
        this.filteredGroupServerSide.next(  this.groupType.filter(x => x.s_group_name.toLowerCase().indexOf(value) > -1));
      });    
      this.searchingGroup=false;
     }
    
    // get passwordMatchError() {
    //   return (this.UserForm.getError('mismatch') && this.UserForm.get('s_confirm_password')?.touched);
    // }

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
 

 
     override ngOnInit(): void {
      this.searchGroup('');
       this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
       this.DataAreaNo = Number(this.userservice.GetDataAreaID());
       if(this.DocNo !=null && this.DocNo > 0 )
       {
          this.editMode=true;
          this.showspinner=true;
          // this._SubscribeService.GetCurrencyByID(this.DocNo).subscribe(data=>{      
          //   debugger;
          //   this.CurrencyForm.patchValue(data);
          //   this.showspinner=false;
          //   this.editMode=false;
          // });
       }
       this.translatefun();
       this.translateData();
     }
 
 
     save() 
     {
       this.showspinner=true;
       this.disableButtons();
       var formData: any = new FormData();
       formData.append("s_user_name", this.UserForm.value.s_user_name ?? 0);
       formData.append("s_user_password", this.UserForm.value.s_user_password);
       formData.append("n_group_id", this.UserForm.value.n_group_id);
       formData.append("n_company_id", this.userservice.GetComp());
       
       if(this.DocNo !=null && this.DocNo > 0 ){
 
         this._SubscribeService.SaveNewUser(formData).subscribe(data=>{
           this.showspinner=false;
           this.enableButtons();
           this. _notification.ShowMessage(data.msg,data.status);
           if(data.status==1){
             this._router.navigate(['/sys/userslist']);
           }
         });
       }
       else
       {
         this._SubscribeService.SaveNewUser(formData).subscribe(data=>{
         this.showspinner=false;
         this.enableButtons();
         this. _notification.ShowMessage(data.msg,data.status);
           if(data.status==1){
             this._router.navigate(['/sys/userslist']);
           }
         });
       }
 
     }
 
   disableButtons() {
     $(':button').prop('disabled', true);
     $("input[type=button]").attr("disabled", "disabled");
   }
 
   enableButtons() {
     $(':button').prop('disabled', false);
     $('input[type=button]').removeAttr("disabled");
   }

}
