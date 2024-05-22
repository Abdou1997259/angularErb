import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { __rest } from "tslib";

@Injectable({
    providedIn:'root'
})
export class bankService
{
    constructor(private _http:HttpClient)
    {

    }
  getall():Observable<any[]>
  {
    return this._http.get<any[]>(`${ApiConfig.Apiurl2}Fin/Banks/GelAll1`);

  }
   GetAll(name:string ,id:string ):Observable<any[]>
  {
    return this._http.get<any[]>(`${ApiConfig.Apiurl2}Fin/Banks/GetAll2?name=${name}&id=${id}`);

  }
}