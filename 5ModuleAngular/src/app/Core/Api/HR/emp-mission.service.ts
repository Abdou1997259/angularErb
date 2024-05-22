import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class EmpMissionService {

  constructor(private _httpClient: HttpClient) { }

  GetAllEmpMissions(pageNumber: number, pageSize: number, docNo: number = 0, docDate: string = "", nYear: number = 0 , nMonth: number = 0, empName: string = "", missionName: string = "", alternativeEmp: string = "", desc: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/EmployeeMission/GetAllEmpMissions/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&nYear=${nYear}&nMonth=${nMonth}&empName=${empName}&missionName=${missionName}&alternativeEmp=${alternativeEmp}&desc=${desc}`);
  }

  GetNextEmpMission(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmployeeMission/GetNextEmpMission`);
  }

  GetByID(docNo: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmployeeMission/GetByID/?id=${docNo}`);
  }

  GetEmployees(empName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmployeeMission/GetEmployees/?empName=${empName}`);
  }

  GetMissionTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmployeeMission/GetMissionTypes`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmployeeMission/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmployeeMission/Edit`, formData);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmployeeMission/Delete`, formData);
  }
}
