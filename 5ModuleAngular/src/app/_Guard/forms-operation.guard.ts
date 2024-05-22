import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationServiceService } from '../_Services/notification-service.service';
import { UsersPrevService } from '../_Services/Prev/users-prev.service';
import { UserService } from '../_Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class FormsOperationGuard implements CanActivate {

  constructor(private _userservice : UserService,private router: Router
    
    ,private userprevservice : UsersPrevService
    ,private notification : NotificationServiceService
    ) { }
    
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
       
      const isAuth :boolean=  this._userservice.IsHasPrev(route.data['formname'],route.data['op']);
      if(!isAuth){
        this.notification.ShowMessage('لا يوجد صلاحية', 2);
        if(route.data['op']==='list ')
         this.router.navigateByUrl("/home");  
       }
       return isAuth;
  } 

 
  
}
