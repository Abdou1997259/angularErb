import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
 import {ApiConfig} from 'src/app/_Setting/ApiConfig'
@Injectable({
  providedIn: 'root'
})
export class SalesChartService {

  constructor(private _http : HttpClient) { }

  GetTopSales() : Observable<Array<any>>{ 
    return this._http.get<Array<any>>( ApiConfig.Apiurl+ "Customers/GetTopSales");
  }

  GetUserTransactions() : Observable<Array<any>>{ 
    return this._http.get<Array<any>>( ApiConfig.Apiurl+ "Customers/GetUserTransactions");
  }
}
