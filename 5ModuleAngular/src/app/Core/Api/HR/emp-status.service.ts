import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class EmpStatusService {

  constructor(private _httpClient: HttpClient) { }

  GetAllEmpStatus(pageNumber: number, pageSize: number, docNo: number = 0, docDate: string = "", empName: string = "", empStatus: string = "", notes: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/EmpStatus/GetAllEmpStatus/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&empName=${empName}&empStatus=${empStatus}&notes=${notes}`);
  }

  GetNextEmpStatus(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmpStatus/GetNextEmpStatus`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmpStatus/GetByID/?id=${id}`);
  }

  GetEmpStatusDP(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpStatus/GetEmpStatusDP`);
  }

  GetEmployeesList(empName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpStatus/GetEmployeesList/?empName=${empName}`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpStatus/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpStatus/Edit`, formatDate);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpStatus/Delete`, formData);
  }
}
