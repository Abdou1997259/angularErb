import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from "src/app/_model/Items/PageResult";
import { saveAs } from 'file-saver';

@Injectable({
  providedIn:'root'
  })
export class IntialBalnceService
{
  constructor(private _http:HttpClient )
  {

  }
  public getAll(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>
  {
     return this._http.get<PageResult>(ApiConfig.Apiurl2+`SC/IntialBalance/getALLMainBalance/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  public getUnits(itemId:any):Observable<any [] >
  {
    return this._http.get<any []>(ApiConfig.Apiurl2+"SC/IntialBalance/getUnits?itemId="+itemId)
  }

  public GetCurrencies():Observable<any []>
  {
    return this._http.get<any []>(ApiConfig.Apiurl2+"SC/IntialBalance/GetCurrencies")
  }

  public Create(form:any):Observable<any>
  {
    return this._http.post(ApiConfig.Apiurl2+"SC/IntialBalance/Create",form)
  }

  public getStoresLKP(pageNumber: Number, pageSize: Number, searchString: string = ''): Observable<PageResult>
  {
    return this._http.get<PageResult>(ApiConfig.Apiurl2+`SC/SCstockOUTToStock/getStoresLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`)
  }

  public getStores()
  {
    
    return this._http.get(ApiConfig.Apiurl2+"SC/IntialBalance/getStores")
  }

  public getItems():Observable<any []>
  {
    return this._http.get<any []>(ApiConfig.Apiurl2+"SC/IntialBalance/getItems")
  }

  public Delete(id:number): Observable<any>
  {
    var formData: any = new FormData();
    formData.append("n_document_no", id);
    return this._http.post(ApiConfig.Apiurl2+"SC/IntialBalance/Delete", formData);
  }

  public Update(from:any):Observable<any>
  {
    return this._http.post(ApiConfig.Apiurl2+"SC/IntialBalance/Update",from);
  }

  public getById(id:number):Observable<any>
  {
    return this._http.get<any>(ApiConfig.Apiurl2+"SC/IntialBalance/getTheDetails?id="+id);
  }

  public getUnitForItems(id):Observable<any[]>
  {
    return this._http.get<any[]>(ApiConfig.Apiurl2+"SC/IntialBalance/getUnitForItems?id="+id)
  }

  public GetLocalCurrencie():Observable<any>
  {
    return this._http.get<any>(ApiConfig.Apiurl2+"SC/IntialBalance/GetLocalCurrencie")
  }

  public getInventoryItems(id:any)
  {
      return this._http.get<any[]>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getInventoryItems?storeid="+id)
  }

  DownloadTemplate(){ 
    this._http.get(`${ApiConfig.Apiurl2}SC/IntialBalance/GetTemplate`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'StoreInitialBalanceTemplate.xlsx', {
         type: 'text/plain;charset=windows-1252'
      });
   });
  }

  SaveExcelData(formdata: any):Observable<any>{
    return  this._http.post(ApiConfig.Apiurl2+"SC/IntialBalance/SaveExcelInitials",formdata);
  }
  getCoff(item:any,unit:any):Observable<number>
  {
    return this._http.get<number>(`${ApiConfig.Apiurl2}SC/IntialBalance/getCoffient?item=${item}&&unit=${unit}`);
  }

}
