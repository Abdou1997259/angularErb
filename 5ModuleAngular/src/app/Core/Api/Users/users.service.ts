import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { SysUser } from '../../model/Main/SysUser';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _http : HttpClient, private userservice:UserService) {

  }

  GetAllUsers(UserID:number=0 ,UserName:string='',GroupName:string='',EmpName:string='' ):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "sys/User/GetAllUsers/?UserID="+UserID+"&UserName="+UserName+"&GroupName="+GroupName+"&EmpName="+EmpName);
  }

  DeleteUser(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_ID", id);
    return  this._http.post(ApiConfig.Apiurl2+"sys/User/Delete",formData);
  }

  GetUserGroups() : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl2+ "sys/User/GetUserGroups/");
  }

  SaveNew(formdata: any):Observable<any>{
    return  this._http.post(ApiConfig.Apiurl2+"sys/User/Create",formdata);
  }

  SaveEdit(formdata: any):Observable<any>{ 
    return  this._http.post(ApiConfig.Apiurl2+"sys/User/Edit",formdata);
  }

  GetUserById(id : number) : Observable<SysUser>{ 
    return this._http.get<SysUser>( ApiConfig.Apiurl2+ "sys/User/GetUserByID?id="+id);
  }

  GetMainGroups() : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl2+ "sys/User/GetMainGroups/");
  }
  
  GetForms(id : number) : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl2+ "sys/User/GetGroupForms?id="+id);
  }

  GetUserPrev(id : number) : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl2+ "sys/User/GetUserPrev?id="+id);
  }

  SaveUserPrevelage(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"sys/User/SaveUserPrevelage",formdata);
  }
 

}
