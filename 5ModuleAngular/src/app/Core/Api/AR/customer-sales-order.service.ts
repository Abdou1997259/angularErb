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
export class CustomerSalesOrderService {

  constructor(private _http : HttpClient,private userservice:UserService ) {
  }

  GetCustomerSalesOrderLKP(pageNumber: number, pageSize: number, orderId: number = 0, orderDate: string = "", customer: string = "", store: string = "", description: string = "", total: number = 0, net: number = 0, confirm: string = ""): Observable<PageResult>
  {
    debugger
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/GetCustomerSalesOrderLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&orderId=${orderId}&orderDate=${orderDate}&customer=${customer}&store=${store}&description=${description}&total=${total}&net=${net}&confirm=${confirm}`);
  }

  GetCurrentOrder(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/GetCurrentOrder`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/GetByID/?id=${id}`);
  }

  GetTransSourceDropList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/GetTransSourceDropList`);
  }

  GetStoresDP(searchString: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/GetStoresDP/?searchString=${searchString}`);
  }

  GetCustomersDP(searchString: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/GetCustomersDP/?searchString=${searchString}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/Delete`, formData);
  }

  GetItemsLKP(keyword:string='', pageNumber: number, pageSize: number ) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2+ `AR/CustomerSalesOrder/GetItemsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${keyword}`);
  }

  GetItemName(id: any): Observable<any>
  {
    return this._http.get(`${ApiConfig.Apiurl2}AR/CustomerSalesOrder/GetItemName/?id=${id}`);
  }
}
