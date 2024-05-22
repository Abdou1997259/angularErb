import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class PurchaseReturnsService {

  constructor(private _httpClient: HttpClient) {
  }

  GetAllPurchaseReturns(pageNumber: number, pageSize: number, docNo: number = 0, docDate: string = "", docType: string = "", supplier: string = "", saler: string = "", store: string = "", description: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetAllPurchaseReturns/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&docType=${docType}&supplier=${supplier}&saler=${saler}&store=${store}&description=${description}`);
  }

  GetCurrentPurchase(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetCurrentPurchase`);
  }

  GetByID(documentNo: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetByID/?id=${documentNo}`);
  }

  InvoicesTypes(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/InvoicesTypes`);
  }

  GetSuppliers(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetSuppliers`);
  }

  GetEmployees(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetEmployees`);
  }

  GetStoreName(storeId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetStoreName/?storeId=${ storeId }`);
  }

  GetStores(storeName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetStores/?storeName=${storeName}`);
  }
  
  GetAccDirs(accDirName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetAccDirs/?accDirName=${accDirName}`);
  }

  GetItemName(itemId: string, storeId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetItemName/?itemId=${ itemId }&&storeId=${ storeId }`);
  }

  GetUnitName(unitId: number, itemId: string): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetUnitName/?unitId=${ unitId }&&itemId=${ itemId }`);
  }

  GetTransSourceDropList(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetTransSourceDropList`);
  }

  GetSourceId(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/PurchaseReturns/GetSourceId`);
  }

  GetTaxStatus(supplierNo : any, itemNo: any):Observable<any>{
    return  this._httpClient.get( ApiConfig.Apiurl2+ "AP/PurchaseReturns/GetTaxStatus/?supplierID="+supplierNo+"&itemCode="+itemNo);
  }

  GetUnitCoff(ItemNo : any, UnitNo: any):Observable<any>{
    return  this._httpClient.get( ApiConfig.Apiurl2+ "AP/PurchaseReturns/GetUnitCoff/?itemNo="+ItemNo+"&unitID="+UnitNo);
  }

  Create(formData): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/PurchaseReturns/Create`, formData);
  }

  Edit(formData): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/PurchaseReturns/Edit`, formData);
  }

  Delete(docNo: number, invType: number): Observable<any> {
    debugger
    var formData: any = new FormData();
    formData.append("n_document_no", docNo);
    formData.append("n_ivoice_type_id", invType);
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/PurchaseReturns/Delete`, formData);
  }

  GetPurchaseMan(id:any):Observable<any>{
    return  this._httpClient.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetSalesMan/?id="+id);
  }
}
