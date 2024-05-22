import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnesService {

  constructor(private _http : HttpClient, private userservice:UserService ) {
  }

  GetSalesReturnsLKP(docNo: number = 0, docDate: string = "", docType: string = "", store: string = "", customer: string = "", saler: string = "", currency: string = "", description: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetSalesReturnsLKP/?docNo=${docNo}&&docDate=${docDate}&&docType=${docType}&&store=${store}&&customer=${customer}&&saler=${saler}&&currency=${currency}&&description=${description}`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetByID/?id=${id}`);
  }

  GetCurrentSalesReturn():Observable<any>
  {
    return this._http.get(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetCurrentSalesReturn`);
  }

  GetJournalTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetJournalTypes`);
  }

  GetTransSourceDropList(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetTransSourceDropList`);
  }

  GetStoreName(storeId: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetStoreName/?storeId=${ storeId }`);
  }

  GetCustomerName(customerId: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetCustomerName/?customerId=${ customerId }`);
  }

  GetSalerName(salerId: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetSalerName/?salerId=${ salerId }`);
  }

  GetItemName(itemId: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetItemName/?itemId=${itemId}`);
  }

  GetUnitName(unitId: number, itemId: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetUnitName/?unitId=${unitId}&&itemId=${itemId}`);
  }

  GetUnits(itemNo : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesReturnes/GetUnits/?itemNo="+itemNo);
  }

  GetItemPrice(itemNo: any, unitID:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesReturnes/GetItemPrice/?itemNo="+itemNo+"&unitID="+unitID);
  }

  GetItemCost(storeId: number = 0, itemId: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetItemCost/?storeId=${storeId}&&itemId=${itemId}`);
  }

  GetCostCenters(search: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetCostCenters/?search=${search}`);
  }

  GetCostName(costNo: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetCostName/?costNo=${costNo}`);
  }

  GetStoresDL(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetStoresDL/?searchVal=${searchVal}`);
  }

  GetCustomerAccDirectionDL(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetCustomerAccDirectionDL/?searchVal=${searchVal}`);
  }

  GetSavedJournals(docNo : any):Observable<any>{
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesReturnes/GetSavedJournals/?id="+docNo);
  }

  GetCurrentJournals(formdata: any):Observable<any>{
    return  this._http.post(ApiConfig.Apiurl2+"AR/SalesReturnes/GetCurrentJournals", formdata);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post(`${ApiConfig.Apiurl2}AR/SalesReturnes/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post(`${ApiConfig.Apiurl2}AR/SalesReturnes/Edit`, formData);
  }

  Delete(n_document_no: any, n_invoice_type_id: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_document_no', n_document_no);
    formData.append('n_invoice_type_id', n_invoice_type_id);
    return this._http.post(`${ApiConfig.Apiurl2}AR/SalesReturnes/Delete`, formData);
  }

  GetInvCatTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetInvCatTypes`);
  }
}

