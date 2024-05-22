import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { UserService } from 'src/app/_Services/user.service';
@Injectable({
  providedIn: 'root'
})
export class SalersService {

  constructor(private _http : HttpClient,private userservice:UserService ) {  }

  GetSalersLKP(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/Salesmen/GetSalersLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetCurrentSaler(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/Salesmen/GetCurrentSaler`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/Salesmen/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/Salesmen/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/Salesmen/Edit`, formData);
  }

  Delete(n_salesman_id: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_salesman_id', n_salesman_id);
    return this._http.post(`${ApiConfig.Apiurl2}AR/Salesmen/Delete`, formData);
  }
}