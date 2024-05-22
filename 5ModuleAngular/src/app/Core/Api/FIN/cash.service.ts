import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "src/app/_Services/user.service";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
    providedIn:"root"
})

export class CashService
{
   constructor(private _http:HttpClient,private user:UserService)
   {

   }
   Create(formdata:any):Observable<any>
   {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/Cash/Create`,formdata);
   }
   Edit(formdata:any)
   {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/Cash/Edit`, formdata);

   }
   Delete(n_cash_id:any): Observable<any>
   {
    var formData = new FormData();
    formData.append('n_cash_id', n_cash_id);
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/Cash/Delete`, formData);
   }
   GetAllCashs(pageNumber: number, pageSize: number, cashId: number = 0, cashName: string = ""): Observable<PageResult>
   {
     return this._http.get<PageResult>(`${ApiConfig.Apiurl2}Fin/Cash/GetAllCashs/?pageNumber=${pageNumber}&pageSize=${pageSize}&cashId=${cashId}&cashName=${cashName}`);
   }
   GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/Cash/GetByID/?id=${id}`);
  }
  getFiftyCashSearch(search:any): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/Cash/getFiftyCashTypeSearch/?search=${search}`);
  }
  GetAccounts(search:any): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/Cash/GetAccounts/?search=${search}`);
  }
  GetEmps(search:any): Observable<any>
  {

    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/Cash/GetEmps/?search=${search}`);
  }

}
