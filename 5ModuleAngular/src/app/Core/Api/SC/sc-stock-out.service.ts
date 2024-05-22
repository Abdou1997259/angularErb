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
export class SCstockOutService {

  constructor(private _httpClient: HttpClient) {
  }

  GetStockOutTranactionsLKP(pageNumber: number, pageSize: number, docNo: number = 0, docDate: string = "", empName: string = "", accName: string = "", storeName: string = "", description: string = ""): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetStockOutTranactionsLKP/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&empName=${empName}&accName=${accName}&storeName=${storeName}&description=${description}`);
  }

  GetLastDocumented(): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetLastDocumented`);
  }

  GetLastDocument(): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetLastDocument`);
  }

  GetTranactionById(docNo: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetTransactionById/?docNo=${docNo}`);
  }

  GetTransSourceDropList(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetTransSourceDropList`);
  }



  GetLocalCurrencie(): Observable<any> {
    return this._httpClient.get(`${ApiConfig.Apiurl2}SC/SCstockOut/GetLocalCurrencie`);
  }

  GetEmployees(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetEmployees`);
  }

  GetRelatedAcc(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetRelatedAcc`);
  }

  GetStores(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetStores`);
  }

  GetTransferPurpose(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetTransferPurpose`);
  }

  GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOut/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
  }

  GetItemById(itemId: string): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetItemById/?itemId=${itemId}`);
  }

  GetUnitById(unitId: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetUnitById/?unitId=${unitId}`);
  }

  GetItemName(itemId: string, storeId: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetItemName/?itemId=${itemId}&&storeId=${storeId}`);
  }
  GetUnitName(unitId: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetUnitName/?unitId=${unitId}`);
  }

  CreateTransaction(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCstockOut/Create`, formData);
  }

  EditTransaction(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCstockOut/Edit`, formData);
  }

  DeleteTransaction(id: any): Observable<any> {
    var formData = new FormData();
    formData.append("n_document_no", id);
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCstockOut/Delete`, formData);
  }

  GetSavedJournals(docNo : any):Observable<any>{ 
    return  this._httpClient.get( ApiConfig.Apiurl2+ "SC/SCstockOut/GetSavedJournals/?id="+docNo);
  }
  
  GetCurrentJournals(formdata: any):Observable<any>{   
    return  this._httpClient.post(ApiConfig.Apiurl2+"SC/SCstockOut/GetCurrentJournals",formdata);
  }

  GetJournalID(docNo : any, typeNo:any):Observable<any>{ 
    return  this._httpClient.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
  }
}
