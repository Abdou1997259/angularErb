import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }

  GetAllCurrencies(ID:number=0,NameAr:string='',NameEn:string='',IsMain:string=''):Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}Sys/Currency/GetAllCurrencies/?id=${ID}&NameArabic=${NameAr}&NameEnglish=${NameEn}&IsMain=${IsMain}`);
  }

  GetCurrencyByID(id : number) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2 + "Sys/Currency/GetCurrencyByID/?id="+id);
  }

  Delete(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_currency_id", id);
    return this._http.post(ApiConfig.Apiurl2+"Sys/Currency/Delete",formData );
  }

  Save(formdata: any):Observable<any>{   
    return this._http.post(ApiConfig.Apiurl2+"Sys/Currency/Create",formdata);
  }

  SaveEdit(formdata: any):Observable<any>{  
    return this._http.post(ApiConfig.Apiurl2+"Sys/Currency/Edit",formdata);
  }

}
