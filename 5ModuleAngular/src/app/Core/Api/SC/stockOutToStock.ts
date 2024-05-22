import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from "src/app/_model/Items/PageResult";




@Injectable({
    providedIn:'root'
    })
export class StockOutToStock {
    constructor(private _http:HttpClient )
    {

    }

    public GetAllTransactionsLKP(pageNumber: Number, pageSize: Number, searchString: string = ''): Observable<PageResult>
    {
        return this._http.get<PageResult>(ApiConfig.Apiurl2+`SC/SCstockOUTToStock/GetAllTransactionsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`)
    }

    public getAll()
    {


        return this._http.get(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getAll")


    }
    public  GetCurrencies():Observable<any []>
    {
        return this._http.get<any []>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/GetCurrencies")
    }
    public getStores(isFilterd?:any)
    {
        debugger;
      return this._http.get(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getStores?isFilterd="+isFilterd)
    }
    public getUnits():Observable<any [] >
    {
        return this._http.get<any []>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getUnits")
    }
    public getItems():Observable<any [] >
    {
        return this._http.get<any[]>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getItems")
    }
    public getInventoryItems(id:any)
    {
        return this._http.get<any[]>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getInventoryItems?storeid="+id)
    }
      public getById(id:number):Observable<any>
    {

        return this._http.get<any>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getTheDetails?id="+id);
    }
    public Delete(id:any): Observable<any>
    {
      var formData: any = new FormData();
      formData.append("n_document_no", id);
        return this._http.post(ApiConfig.Apiurl2+`SC/SCstockOUTToStock/Delete`, formData);
    }
    public getFromTo(id:any)
    {
        return this._http.get(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getTofromAccount?StoreID="+id)
    }
    public getCurrency(id:any ): Observable<any>
    {

        return this._http.get(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getCurrencyName?id="+id )
    }
    public  Create(form:any):Observable<any>
    {
       return this._http.post(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/Create",form)
    }
    public CreateJournal(form:any):Observable<any>
    {

        return this._http.post(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/CreateJournal",form)
    }
    public Update(from:any):Observable<any>
    {
      return this._http.post(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/Update",from);
    }
    public GetTransSourceDropList(): Observable<Array<any>> {
        return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOUTToStock/GetTransSourceDropList`);
    }
    public GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
        return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCstockOUTToStock/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
    }
    public getIncomingQty( StoreID)
    {
        debugger

        return this._http.get<Array<any>>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getIncomingQty?id="+StoreID);
    }
    public getTransDetails(id)
    {
        return this._http.get<Array<any>>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getTransDetails?id="+id);
    }
    public importing(form:any,header):Observable<any>
    {
        debugger;
        return this._http.post(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/importing",form,{headers:header})

    }
    public GetLocalCurrencie():Observable<any>
    {

      return this._http.get<any>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/GetLocalCurrencie")
    }

  public getUnitForItems(id):Observable<any[]>
  {
    return this._http.get<any[]>(ApiConfig.Apiurl2+"SC/SCstockOUTToStock/getUnitForItems?id="+id)
  }
  GetCoff(unit:any,item:any){
    return this._http.get<number>(`${ApiConfig.Apiurl2 }SC/SCstockOUTToStock/GetCoff?unit=${unit}&&item=${item}`)
  }

}
