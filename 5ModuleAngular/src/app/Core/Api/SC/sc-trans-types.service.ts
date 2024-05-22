import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from 'src/app/_Setting/ApiConfig'
import { Store } from '../../model/SC/Store';
import { EmpViewModel } from '../../model/SC/empolyee';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class SCTransTypeService {

  constructor(private _httpClient: HttpClient) {

  }

  GetTranSourceTypeHeaders(n_trans_source_id: any, searchId: any = '', searchDate: any='',searchType: any=''): Observable<any> {
    return this._httpClient.get(`${ApiConfig.Apiurl2}LKP/TransactionSourceTypeLKP/GetTranSourceTypeHeaders/?n_trans_source_id=${ n_trans_source_id }&&searchId=${ searchId }&&searchDate=${searchDate}&&searchType=${searchType}`)
  }

  GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}LKP/TransactionSourceTypeLKP/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
  }
}
