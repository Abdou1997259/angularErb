import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormsService {

  constructor(private _http : HttpClient) { }
 
   
  GetById(id : number) : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl+ "DynamicForm/GetForm?id="+id);
  }

  GetFormData(id : number,key : number) : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl+ "DynamicForm/GetFormData?id="+id+"&key="+key);
  }


  GetList(id : number) : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl+ "DynamicForm/GetList?id="+id);
  }


  Save(data: any):Observable<any>{  
    return  this._http.post( ApiConfig.Apiurl+ "DynamicForm/Create",data);
  }
  
}
