import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { UserService } from 'src/app/_Services/user.service';
@Injectable({
  providedIn: 'root'
})
export class ResturantBill2Service {

  constructor(private _httpClient : HttpClient,private userservice:UserService ) {  }

  GetAllItemTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/ResturantBill2/GetAllItemTypes`);
  }

  GetItemsDetails(itemId: any): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/ResturantBill2/GetItemsDetails/?itemType=${itemId}`);
  }

  GetItemPriceList(itemId: any, docDate: string): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/ResturantBill2/GetItemPriceList/?itemId=${itemId}&docDate=${docDate}`);
  }

  GetCreditCardTypes(searchVal: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/ResturantBill2/GetCreditCardTypes/?searchVal=${searchVal}`);
  }
  
  IsSellPriceTaxable(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AR/ResturantBill2/IsSellPriceTaxable`);
  }
  
  GetDefaultCustomer(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AR/ResturantBill2/GetDefaultCustomer`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}AR/ResturantBill2/Create`, formData);
  }
}
