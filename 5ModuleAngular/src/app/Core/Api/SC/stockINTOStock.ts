import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from "src/app/_model/Items/PageResult";



@Injectable({
    providedIn:'root'
})

export class StockIntoStock
{

    constructor(private _http:HttpClient)
    {

    }

    public Create(form:any):Observable<any>
    {
        return this._http.post(ApiConfig.Apiurl2+"SC/SCstockINTOStock/Create",form)
    }
    public Update(from:any):Observable<any>
    {
      return this._http.post(ApiConfig.Apiurl2+"SC/SCstockINTOStock/Update",from);
    }
    public Delete(id:any)
    {
      var formData: any = new FormData();
      formData.append("n_document_no", id);
      return this._http.post(ApiConfig.Apiurl2+`SC/SCstockINTOStock/Delete`, formData);
    }
    public GetAllImportsLKP(pageNumber: Number, pageSize: Number, searchString: string = ''): Observable<PageResult>
    {
        return this._http.get<PageResult>(ApiConfig.Apiurl2+`SC/SCstockINTOStock/GetAllImportsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`)
    }
    public getAll()
    {
        return this._http.get(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getAll")
    }

    public GetCurrency(id:any ): Observable<any>
    {

        return this._http.get(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getCurrencyName?id="+id )
    }
    getStores()
    {
      return this._http.get(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getStores")
    }
    public getUnits():Observable<any [] >
    {
        return this._http.get<any []>(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getUnits")
    }
    public getItems():Observable<any [] >
    {
        return this._http.get<any[]>(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getItems")
    }
    public GetTransSourceDropList(): Observable<Array<any>> {
        return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockINTOStock/GetTransSourceDropList`);
    }
    public GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
        return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockINTOStock/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
    }
    public GetLocalCurrencie():Observable<number>
    {

      return this._http.get<number>(ApiConfig.Apiurl2+"SC/SCstockINTOStock/GetLocalCurrencie")
    }
    public  GetCurrencies():Observable<any []>
    {
        return this._http.get<any []>(ApiConfig.Apiurl2+"SC/SCstockINTOStock/GetCurrencies")
    }
    public getFromTo(id:any)
    {
        return this._http.get(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getTofromAccount?StoreID="+id)
    }
    public getById(id:number):Observable<any>
    {

        return this._http.get<any>(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getTheDetails?id="+id);
    }
    public getCurrency(id:any ): Observable<any>
    {

        return this._http.get(ApiConfig.Apiurl2+"SC/SCstockINTOStock/getCurrencyName?id="+id )
    }

    GetSavedJournals(docNo : any):Observable<any>{
      return  this._http.get( ApiConfig.Apiurl2+ "SC/SCstockINTOStock/GetSavedJournals/?id="+docNo);
    }

    GetCurrentJournals(formdata: any):Observable<any>{
      return  this._http.post(ApiConfig.Apiurl2+"SC/SCstockINTOStock/GetCurrentJournals",formdata);
    }

    GetJournalID(docNo : any, typeNo:any):Observable<any>{
      return  this._http.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
    }
}
