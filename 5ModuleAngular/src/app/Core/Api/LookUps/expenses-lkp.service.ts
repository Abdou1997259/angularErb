import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class ExpensesLKPService {

  constructor(private _httpClient: HttpClient) {
  }

  GetExpensesLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}LKP/ExpensesLKP/GetExpensesLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetExpensesName(expenseCode: string): Observable<any>
  {
    return this._httpClient.get<any>(`${ ApiConfig.Apiurl2 }LKP/ExpensesLKP/GetExpensesName/?expenseCode=${ expenseCode }`);
  }
}
