import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class SCItemMainGroupService {

  constructor(private _httpClient: HttpClient) {  }

  getItemTreeList() {
    return this._httpClient.get<any[]>(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/GetItemsMainGroupTreeList`);
  }

  getAccountDataById(accountNo: string): Observable<any>{
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/GetItemDataById?accountNo=${accountNo}`);
  }

  GetGroupAccounts(): Observable<Array<any>>{
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/GetGroupAccounts`);
  }
  
  GetGroupIncomeAccounts(accName: string = ""): Observable<Array<any>>{
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/GetGroupIncomeAccounts/?accName=${accName}`);
  }

  getGroupType(): Observable<Array<any>>{
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/GetGroupType`);
  }

  getNewGroupID(accountNo: string): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/GetNewGroupID/?accountNo=${accountNo}`);
  }

  SaveGroup(formatDate: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/Create`, formatDate);
  }

  EditGroup(formatDate: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/Edit`, formatDate);
  }

  DeleteGroup(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/DeleteGroup`, formData);
  }

  GetNextItemGroupData(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/SCitemMainGroup/GetNextItemGroupData`);
  }

  CheckIfGroupItemHasChilds(groupNo: string): Observable<any>
  {
    return this._httpClient.get<any>(ApiConfig.Apiurl2+`SC/SCitemMainGroup/CheckIfGroupItemHasChilds/?groupNo=${groupNo}`);
  }
 }
