import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayToHash } from '@fullcalendar/core/util/object';
import { BehaviorSubject, Observable } from 'rxjs';
import { user_prev } from 'src/app/_model/Prev/UserPrev';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class UsersPrevService {

  constructor(private _http : HttpClient , private userservice : UserService) {

  }
  headers:any;
  public currentmenutables =  new BehaviorSubject(Observable<any>);

  ChangeMenuTable(menutables : any){
    this.currentmenutables.next(menutables);
   }


  GetUsers() : Observable<Array<any>>{
    return this._http.get<Array<any>>( ApiConfig.Apiurl+ "Account/GetUsers");
  }

  GetUserPrev(userid  : number) : Observable<Array<user_prev>>{
    return this._http.get<Array<user_prev>>( ApiConfig.Apiurl+ "Account/GetUserPrev?userid="+userid);
  }

  GetUserForms(moduleId:number) : Observable<Array<user_prev>>{
    return this._http.get<Array<user_prev>>( ApiConfig.Apiurl2+ "Auth/GetUserForms?moduleId="+moduleId);
  }

  GetAllUserForms() : Observable<Array<user_prev>>{
    return this._http.get<Array<user_prev>>( ApiConfig.Apiurl2+ "Auth/GetAllUserForms");
  }

  GetSubsUserForms(id:number, comp:number, year: number) : Observable<Array<user_prev>>{
    //return this._http.get<Array<user_prev>>( ApiConfig.Apiurl+ "Account/GetUserForms?userid="+ id);
    return this._http.get<Array<user_prev>>( ApiConfig.Apiurl2+ `sys/Main/GetUserForms?UserID=${id}&comp=${comp}&year=${year}`);
  }


  SavePrev(formdata: any):Observable<any>{
    return  this._http.post( ApiConfig.Apiurl+ "Account/SavePrev",formdata);
  }
 
  
}
