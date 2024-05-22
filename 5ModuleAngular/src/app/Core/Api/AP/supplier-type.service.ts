import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/_Services/user.service';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
    providedIn: 'root'
  })
  export class SupplierType
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }
    Save(formdata: any):Observable<any>{ 
      debugger  
        return  this._http.post(ApiConfig.Apiurl2+"AP/SupplierTypes/Create",formdata);
      }
      GetAllSupplierType(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{
        debugger;
    
        return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `AP/SupplierTypes/GetAllSupplierType/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );

    
      }
      Delete(id : number):Observable<any>{   
        var formData: any = new FormData(); 
        formData.append("n_supplier_type_id", id);
        return  this._http.post(ApiConfig.Apiurl2+"AP/SupplierTypes/Delete",formData );
      }
      Update(formdata:any):Observable<any>
      {
        return  this._http.post<any>(ApiConfig.Apiurl2+"AP/SupplierTypes/Edit",formdata);

      }
      GetByID(id)
      {
        debugger
           return this._http.get(ApiConfig.Apiurl2+"AP/SupplierTypes/GetByID?id="+id );
      }
    

  }