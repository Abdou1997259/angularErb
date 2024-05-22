import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { UserService } from 'src/app/_Services/user.service';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private _http : HttpClient,private userservice:UserService ) {  }

  GetCustomersLKP(pageNumber: number, pageSize: number, customerId: number = 0, customerName: string = "", customerType: string = "", supplierName: string = "", area: string = "", taxNumber: string = "", address: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/Customers/GetCustomersLKP/?pageNumber=${pageNumber}&pageSize=${pageSize}&customerId=${customerId}&customerName=${customerName}&customerType=${customerType}&supplierName=${supplierName}&area=${area}&taxNumber=${taxNumber}&address=${address}`);
  }

  GetCurrentCustomer(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/Customers/GetCurrentCustomer`);
  }

  GetCustomersConfigurations(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/Customers/GetCustomersConfigurations`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/Customers/GetByID/?id=${id}`);
  }

  GetAccountsTree(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/Customers/GetAccountsTree/?searchVal=${searchVal}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/Customers/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/Customers/Edit`, formData);
  }

  GetMaxQtyReactions():Observable<Array<any>>{
    return  this._http.get<Array<any>>(ApiConfig.Apiurl2+`AR/SalesConfiguration/GetMaxQtyReactions`);
  }

  Delete(n_customer_id: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_customer_id', n_customer_id);
    return this._http.post(`${ApiConfig.Apiurl2}AR/Customers/Delete`, formData);
  }
}
