import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class RecieveQtyService {

  constructor(private _httpClient: HttpClient) {
  }

  GetRecieveQtyLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetRecieveQtyLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetCurrentRecieveQty(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetCurrentRecieveQty`);
  }

  GetTransSourceDropList(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetTransSourceDropList`);
  }

  GetQualityEng(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetQualityEng`);
  }

  GetStoreName(storeId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetStoreName/?storeId=${ storeId }`);
  }

  GetItemName(itemId: string, storeId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetItemName/?itemId=${itemId}&&storeId=${storeId}`);
  }

  GetUnitName(unitId: number, itemId: string): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetUnitName/?unitId=${unitId}&&itemId=${itemId}`);
  }

  GetLength(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetLength`);
  }

  GetByID(n_doc_no: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/RecieveQty/GetByID/?n_doc_no=${n_doc_no}`);
  }

  Create(formData): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/RecieveQty/Create`, formData);
  }

  Edit(formData): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/RecieveQty/Edit`, formData);
  }

  Delete(docNo: number): Observable<any> {
    var formData: any = new FormData();
    formData.append("n_doc_no", docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/RecieveQty/Delete`, formData);
  }
}
