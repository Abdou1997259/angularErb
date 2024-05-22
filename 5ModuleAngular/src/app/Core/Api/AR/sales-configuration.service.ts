import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SalesConfiguartionService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }


  Create(formdata: any):Observable<any>{
    return  this._http.post<any>(ApiConfig.Apiurl2+"AR/SalesConfiguration/Create",formdata);
  }

  GetByID(id: any): Observable<any>{
    return this._http.get<any>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetByID?id=${id}`);
  }

  GetDiscountQtyPolicy():Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetDiscountQtyPolicy`);
  }

  GetMaxQtyReactions():Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetMaxQtyReactions`);
  }

  GetReturnSalesTypes():Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetReturnSalesTypes`);
  }

  GetPolicyStatus():Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetPolicyStatus`);
  }

  GetReportsNames():Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetReportsNames`);
  }

  GetEndureVatAccList(accName: string = ""):Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetEndureVatAccList/?accName=${accName}`);
  }

  GetCustomersMainAccounts(accName: string = ""):Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetCustomersMainAccounts/?accName=${accName}`);
  }

  ApplyAll(value: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesConfiguration/ApplyAll/?value=${value}`);
  }
}
