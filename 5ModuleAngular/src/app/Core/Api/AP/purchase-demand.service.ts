import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/_Services/user.service';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
    providedIn: 'root'
  })
  export class PurchaseDemand
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }
    Create(formdata: any):Observable<any>{
      debugger
        return  this._http.post(ApiConfig.Apiurl2+"AP/PurchaseDemand/Create",formdata);
      }

      Delete(id : number):Observable<any>{
        var formData: any = new FormData();
        formData.append("n_purchase_order_no", id);
        return  this._http.post(ApiConfig.Apiurl2+"AP/PurchaseDemand/Delete",formData );
      }
      Update(formdata:any):Observable<any>
      {
        return  this._http.post<any>(ApiConfig.Apiurl2+"AP/PurchaseDemand/Edit",formdata);
      }

      GetByID(id):Observable<any>
      {
        return this._http.get<any>(ApiConfig.Apiurl2+"AP/PurchaseDemand/GetByID?id="+id );
      }

      GetOrderOptions():Observable<Array<any>>
      {
        return this._http.get<Array<any>>(ApiConfig.Apiurl2+"AP/PurchaseDemand/GetOrderOptions" );
      }

      GetOrderTypes():Observable<Array<any>>
      {
        return this._http.get<Array<any>>(ApiConfig.Apiurl2+"AP/PurchaseDemand/GetOrderTypes" );
      }

      GetcurrentPurchaseOrder():Observable<any>
      {
        return this._http.get<any>(ApiConfig.Apiurl2+"AP/PurchaseDemand/GetcurrentPurchaseOrder");
      }

      GetAllPurchaseDemand(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{
        return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `AP/PurchaseDemand/GetAllPurchaseDemand/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
      }

      GetDemandTransSourceDropList():Observable<Array<any>>
      {
        return this._http.get<Array<any>>(ApiConfig.Apiurl2+"AP/PurchaseDemand/GetDemandTransSourceDropList");
      }

      GetCurrentItemBalance(itemId: string, storeId: number = 0):Observable<any>
      {
        return this._http.get<any>(ApiConfig.Apiurl2+`AP/PurchaseDemand/GetCurrentItemBalance/?itemId=${itemId}&&storeId=${storeId}`);
      }

      GetLastItemPurchase(itemId: string):Observable<any>
      {
        return this._http.get<any>(ApiConfig.Apiurl2+`AP/PurchaseDemand/GetLastItemPurchase/?itemId=${itemId}`);
      }
      
      GetItemData(itemId: string, storeId: number):Observable<any>
      {
        return this._http.get<any>(ApiConfig.Apiurl2+`AP/PurchaseDemand/GetItemData/?itemId=${itemId}&&storeId=${storeId}`);
      }
  }
