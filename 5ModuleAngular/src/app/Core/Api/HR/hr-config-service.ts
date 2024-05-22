import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class HrConfigService {

  constructor(private _httpClient: HttpClient) { }

  GetCurrentDataAreaConfiguration(dataAreaId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetCurrentDataAreaConfiguration?dataAreaId=${dataAreaId}`);
  }

  GetCountries(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetCountries`);
  }

  GetEmployeesStatus(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetEmployeesStatus`);
  }

  GetEmployeeLatencyTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetEmployeeLatencyTypes`);
  }

  GetAdditionalDaysCalc(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetAdditionalDaysCalc`);
  }

  GetInsuranceCalcTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetInsuranceCalcTypes`);
  }

  GetVacationRules(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetVacationRules`);
  }

  GetDeductions(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetDeductions`);
  }

  GetDeservedly(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetDeservedly`);
  }

  GetCostCentersMaxLevel(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetCostCentersMaxLevel`);
  }

  GetAccountsTreeOrder(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetAccountsTreeOrder`);
  }

  GetGlAccountsTree(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetGlAccountsTree`);
  }

  GetGosiExpenseAccounts(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/HrConfiguration/GetGosiExpenseAccounts`);
  }

  ResetConfiguration(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/HrConfiguration/ResetConfiguration`, formData);
  }
}
