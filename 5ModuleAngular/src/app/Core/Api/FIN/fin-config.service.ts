import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "src/app/_Setting/ApiConfig";

@Injectable({
    providedIn:'root'
})
export class FinConfiguration{

    constructor(private _http:HttpClient)
    {

    }
   Create(formdata):Observable<any>
    {
      debugger
      return  this._http.post(`${ApiConfig.Apiurl2}Fin/FinConfiguration/Save`, formdata )
    }
    GetByID(id: any):Observable<any>{
      debugger
        return  this._http.get<any>(ApiConfig.Apiurl2+`Fin/FinConfiguration/GetByID?id=${id}`);
      }
}
