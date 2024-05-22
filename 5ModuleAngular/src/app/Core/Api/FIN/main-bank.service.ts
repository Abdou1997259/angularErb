import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';
@Injectable({
  providedIn: 'root'
})
export class MainBankService {

  constructor(private _http:HttpClient,private user:UserService)
  {

  }
  Create(formdata:any):Observable<any>
  {
   return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/MainBank/Create`,formdata);
  }
  Edit(formdata:any)
  {
   return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/MainBank/Edit`, formdata);

  }
  Delete(n_bank_id:any): Observable<any>
  {
   var formData = new FormData();
   formData.append('n_bank_id', n_bank_id);
   return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/MainBank/Delete`, formData);
  }
  GetAllCashs(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}Fin/MainBank/GetAllBanks/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }
  GetByID(id: number): Observable<any>
 {
   return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/MainBank/GetByID/?id=${id}`);
 }
}
