import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class CustomerTypesService {

  constructor(private _http : HttpClient,private userservice:UserService ) {
  }

  GetAllCustomerTypesLKP(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/CustomerTypes/GetAllCustomerTypesLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetCurrentType(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerTypes/GetCurrentType`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerTypes/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerTypes/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerTypes/Edit`, formData);
  }

  Delete(n_customer_type_id: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_customer_type_id', n_customer_type_id);
    return this._http.post(`${ApiConfig.Apiurl2}AR/CustomerTypes/Delete`, formData);
  }
}
