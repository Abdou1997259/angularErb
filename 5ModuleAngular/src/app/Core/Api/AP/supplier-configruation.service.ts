import { Injectable } from '@angular/core';

import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/_Services/user.service';


@Injectable({
    providedIn: 'root'
  })
  export class SupplierConfiguartion
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }
  Save(formdata: any):Observable<any>{ 
      debugger  
        return  this._http.post(ApiConfig.Apiurl2+"AP/SupplierConfigration/Create",formdata);
   }
   GetByID(): Observable<any>
   {
    return this._http.get(ApiConfig.Apiurl2+"AP/SupplierConfigration/GetByID")
   }
    
   GetSupplierAccountByDirectory(accName: string = ""): Observable<Array<any>>
   {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AP/SupplierConfigration/GetSupplierAccountByDirectory/?accName=${accName}`);
   }
   
   GetSupplierMainAccounts(accName: string = ""): Observable<Array<any>>
   {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AP/SupplierConfigration/GetSupplierMainAccounts/?accName=${accName}`);
   }
  }