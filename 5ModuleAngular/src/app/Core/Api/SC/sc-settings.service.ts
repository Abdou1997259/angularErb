import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class ScSettingsService {

  constructor(private _httpClient: HttpClient) { }

  getScAccounts(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/GetAllScAccounts`);
  }

  getCurrentCompanyConfig(): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/GetCurrentCompanyConfig`);
  }

  getOrderOptions(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/GetOrderOptions`);
  }

  getPriceOptions(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/GetPriceOptions`);
  }

  getPrintOptions(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/GetPrintOptions`);
  }

  GetOnEyeOptions(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/GetOnEyeOptions`);
  }

  ApplyAll(value: number): Observable<any>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/ApplyAll/?value=${value}`);
  }

  post(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCgeneralSettings/Create`, formData);
  }
}
