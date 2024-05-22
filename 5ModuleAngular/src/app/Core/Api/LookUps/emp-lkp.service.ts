import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class EmpLkpService {

  constructor(private _httpClient: HttpClient) { }

  GetAllEmployee(empId: number = 0, empName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetAllEmployee/?empId=${empId}&empName=${empName}`);
  }

  GetEmployeName(empId: number = 0): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetEmployeName/?empId=${empId}`);
  }
}
