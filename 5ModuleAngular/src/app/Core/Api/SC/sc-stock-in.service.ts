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
export class SCstockInService {

  constructor(private _httpClient: HttpClient) {

  }

  GetTransactionsLKP(pageNumber: number, pageSize: number, docNo: number = 0, docDate: string = "", empName: string = "", accName: string = "", storeName: string = "", description: string = ""): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetTransactionsLKP/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&empName=${empName}&accName=${accName}&storeName=${storeName}&description=${description}`);
  }

  GetLastDocumented(): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetLastDocumented`);
  }

  GetLastDocument(): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetLastDocument`);
  }

  GetTransSourceDropList(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetTransSourceDropList`);
  }


  GetLocalCurrencie(): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetLocalCurrencie`);
  }

  GetEmployees(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetEmployees`);
  }

  GetRelatedAcc(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetRelatedAcc`);
  }

  GetStores(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetStores`);
  }

  GetItemsLKP(pageNumber: number, pageSize: number, searchString: string = '', storeId: number = 0): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetItemsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}&&storeId=${storeId}`);
  }

  GetItemById(itemId: string): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetItemById/?itemId=${itemId}`);
  }
  GetUnitById(unitId: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetUnitById/?unitId=${unitId}`);
  }

  GetUnitsLKP(pageNumber: number, pageSize: number, searchString: string = '', itemId: string): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetUnitsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}&&itemId=${itemId}`);
  }

  GetStoresLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetStoresLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetRelatedAccLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetRelatedAccLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetTranactionById(docNo: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetTranactionById/?docNo=${docNo}`);
  }

  GetTransTypeList(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetTransTypeList`);
  }

  GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
  }

  GetItemName(itemId: string): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetItemName/?itemId=${itemId}`);
  }

  GetUnitName(unitId: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCstockIn/GetUnitName/?unitId=${unitId}`);
  }

  CreateTransaction(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCstockIn/CreateTransaction`, formData);
  }

  EditTransaction(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCstockIn/EditTransaction`, formData);
  }

  DeleteTransaction(id: number): Observable<any> {
    debugger;
    var formData: any = new FormData();
    formData.append("n_document_no", id);
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCstockIn/DeleteTransaction`, formData);
  }

  GetSavedJournals(docNo : any):Observable<any>{ 
    return  this._httpClient.get( ApiConfig.Apiurl2+ "SC/SCstockIn/GetSavedJournals/?id="+docNo);
  }
  
  GetCurrentJournals(formdata: any):Observable<any>{   
    return  this._httpClient.post(ApiConfig.Apiurl2+"SC/SCstockIn/GetCurrentJournals",formdata);
  }

  GetJournalID(docNo : any, typeNo:any):Observable<any>{ 
    return  this._httpClient.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
  }
}
