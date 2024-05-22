import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  constructor(private _http : HttpClient) { }

  SaveNewSubscribe(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"sys/Main/Create",formdata);
  }

  SendEmailConfirmation(email: string):Observable<any>{ 
    debugger;  
    return  this._http.get(ApiConfig.Apiurl2+"sys/Main/Confirm/?email="+email);
  }

  Login(username: string, password: string) {
    return this._http.get( ApiConfig.Apiurl2+ 'sys/Main/Login?s_user_name=' + username + '&s_user_password=' + password);
  }

  GetRequests(code: string="",name: string="", compname: string="", email: string="", phone: string="",address: string="",) {
    return this._http.get( ApiConfig.Apiurl2+ 'sys/Main/GetRequests/?Code='+code+'&&Name='+name+'&&Comp='+compname+'&&Email='+email+'&&Phone='+phone+'&&Address='+address);
  }

  SaveNewUser(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"sys/Main/SaveNewUser",formdata);
  }
}
