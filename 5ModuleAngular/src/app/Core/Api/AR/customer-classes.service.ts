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
export class CustomerClassesService {

  constructor(private _http : HttpClient,private userservice:UserService ) {
  }

  GetAllCustomerClassesLKP(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/CustomerClasses/GetAllCustomerClassesLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetCurrentClass(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerClasses/GetCurrentClass`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerClasses/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerClasses/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerClasses/Edit`, formData);
  }

  Delete(n_Id: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_Id', n_Id);
    return this._http.post(`${ApiConfig.Apiurl2}AR/CustomerClasses/Delete`, formData);
  }
}
