import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class ResumeWorkService {
  constructor(private _httpClient: HttpClient) { }

  GetAllResumeWork(pageNumber: number, pageSize, docNo: number = 0, docDate: string = "", empName: string = "", resumeWorkType: string = "", notes: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/ResumeWork/GetAllResumeWork/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&empName=${empName}&resumeWorkType=${resumeWorkType}&notes=${notes}`);
  }

  GetNextResumeWork(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/ResumeWork/GetNextResumeWork`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/ResumeWork/GetByID/?id=${id}`);
  }

  GetResumeWorkTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/ResumeWork/GetResumeWorkTypes`);
  }

  GetEmployee(empName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/ResumeWork/GetEmployee/?empName=${empName}`);
  }

  GetEmpVacations(vacationNumber: number = 0): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/ResumeWork/GetEmpVacations/?vacationNumber=${vacationNumber}`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/ResumeWork/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/ResumeWork/Edit`, formatDate);
  }

  Delete(loanNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', loanNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/ResumeWork/Delete`, formData);
  }
}
