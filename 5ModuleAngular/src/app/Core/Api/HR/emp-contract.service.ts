import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class EmpContractService {
  constructor(private _httpClient: HttpClient) { }

  GetAllEmpsContracts(pageNumber: number, pageSize: number, docNo: number = 0, contractId: number = 0, empName: string = "", contractType: string = "", startDate: string = "", endaDate: string = "", notes: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/EmpContract/GetAllEmpsContracts/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&contractId=${contractId}&empName=${empName}&contractType=${contractType}&startDate=${startDate}&endaDate=${endaDate}&notes=${notes}`);
  }

  GetNextEmpContract(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmpContract/GetNextEmpContract`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmpContract/GetByID/?id=${id}`);
  }

  GetContractTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpContract/GetContractTypes`);
  }

  GetPaymentTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpContract/GetPaymentTypes`);
  }

  GetEmployees(empName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpContract/GetEmployees/?empName=${empName}`);
  }

  GetSalaryItemCalcTypes(calcName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpContract/GetSalaryItemCalcTypes/?calcName=${calcName}`);
  }

  GetVacationRules(ruleName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpContract/GetVacationRules/?ruleName=${ruleName}`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpContract/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpContract/Edit`, formatDate);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpContract/Delete`, formData);
  }
}
