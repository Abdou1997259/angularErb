import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class ScItemTypesService {

  constructor(private _httpClient: HttpClient) {
  }

  getAllItemsTypes(itemName: string = ''): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetAllItemsTypes/?itemName=${itemName}`);
  }

  getItemTypeById(id: number): Observable<any> {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetItemTypeById/?id=${id}`);
  }

  getCurrentItemId(): Observable<any> {
    return this._httpClient.get(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetLastItemType`);
  }

  getCategoriesLST(): Observable<any> {
    return this._httpClient.get(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetCategoriesLST`);
  }

  getBranchDiscount(): Observable<any> {
    return this._httpClient.get(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetBranchDiscount`);
  }

  GetToptypesList(pageNumber: Number, pageSize: Number, itemName: string = ''): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetToptypesList/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&itemName=${itemName}`);
  }
 
  GetItemsServerSide(pageNumber: Number, pageSize: Number, searchString: string = ''): Observable<PageResult> {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetItemsServerSide/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  post(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/ScItemTypes/Create`, formData);
  }

  edit(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/ScItemTypes/Edit`, formData);
  }

  delete(id: number): Observable<any> {
    var formData: any = new FormData();
    formData.append('n_item_type', id);
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/ScItemTypes/Delete`, formData);
  }

  GetClassCategories(catName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetClassCategories/?catName=${catName}`);
  }

  GetRelatedAcc(accName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetRelatedAcc/?accName=${accName}`);
  }

  GetExpensesAcc(accName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/ScItemTypes/GetExpensesAcc/?accName=${accName}`);
  }
}
