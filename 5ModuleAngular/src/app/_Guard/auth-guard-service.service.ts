import { Injectable } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UsersPrevService } from '../_Services/Prev/users-prev.service';
import { UserService } from '../_Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService {
 
  constructor(private _userservice : UserService,private router: Router
    ,private userprevservice : UsersPrevService
    
    ) { }
    retrievedForms:any=null;
    menu:any;
    isAuth:boolean=false;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
    if (this._userservice.GetUserID() =='' 
    || this._userservice.GetUserID() =='0' 
    || this._userservice.GetUserID() == null) {  
      this.router.navigateByUrl("/login");  
     } 
     
     return true;
     this.isAuth=  this.IsHasPrev(state.url);
     if(!this.isAuth){
      this.router.navigateByUrl("/home");  
     }
     return this.isAuth;
  }


  IsHasPrev(url : string){
    this.retrievedForms= localStorage.getItem('alluserforms'); 
    this.menu=JSON.parse(this.retrievedForms);
    
    if(url ==='/home') return true;
        
    //   for (let i = 0; i < this.menu.length; i++) {
       
    //     for(let k=0; k < this.menu[i].lstforms.length; k++){
         
    //      if(this.menu[i].lstforms[k].s_url ===url ){
    //        return true;
    //       }
    //     }
        
    //  }

    for (let i = 0; i < this.menu.length; i++)
    {   
       if(this.menu[i].s_url ===url )
       {
         return true;
        }      
    }
    return false;
  }
}
