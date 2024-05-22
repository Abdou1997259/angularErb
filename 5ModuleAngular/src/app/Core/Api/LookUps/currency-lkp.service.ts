import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class CurrencyLKPService {

  constructor(private _httpClient: HttpClient) {
  }

  GetCurrencies(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}LKP/CurrencyLKP/GetCurrencies`);
  }

  GetCurrenciesLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}LKP/CurrencyLKP/GetCurrenciesLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetCurrencyName(n_currency_id: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ ApiConfig.Apiurl2 }LKP/CurrencyLKP/GetCurrencyName/?n_currency_id=${ n_currency_id }`);
  }
}
