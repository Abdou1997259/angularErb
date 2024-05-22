import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class RejectedGoodsService {

  constructor(private _httpClient: HttpClient) {
  }

  GetItemName(itemId: string): Observable<any>
  {
    return this._httpClient.get(`${ApiConfig.Apiurl2}AP/RejectedGoods/GetItemName/?itemId=${itemId}`);
  }

  GetUnitName(unitId: number, itemId: string): Observable<any>
  {
    return this._httpClient.get(`${ApiConfig.Apiurl2}AP/RejectedGoods/GetUnitName/?unitId=${unitId}&&itemId=${itemId}`);
  }

  Create(formData): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/RejectedGoods/Create`, formData);
  }
}
