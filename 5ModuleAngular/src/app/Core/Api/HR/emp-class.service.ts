import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class EmpClassService {

  constructor(private _httpClient: HttpClient) { }



  GetByID(id: number): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpClass/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpClass/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpClass/Edit`, formData);
  }

  Delete(id: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_class_Id', id);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpClass/Delete`, formData);
  }
  GetAllEmpClass(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    debugger
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/EmpClass/GetAllEmpClass/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }
  GetAccount(search:any){
    return  this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpClass/GetAccount/?search=${search}`)
  }
  GetCashes(search:any){
    return  this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpClass/GetCashes/?search=${search}`)
  }
}
