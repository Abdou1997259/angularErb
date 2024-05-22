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
export class CustomerBalanceService {

  constructor(private _http : HttpClient,private userservice:UserService ) {
  }

  GetAllCustomerBalanceLKP(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/CustomerBalance/GetAllCustomerBalanceLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerBalance/GetByID/?id=${id}`);
  }

  GetCurrentCustomerBalance(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerBalance/GetCurrentCustomerBalance`);
  }

  GetAllCustomersTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerBalance/GetAllCustomersTypes`);
  }

  GetCostName(costNo: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetCostName/?costNo=${costNo}`);
  }

  GetCustomerName(customerId: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetCustomerName/?customerId=${ customerId }`);
  }

  GetCurrentCurrency(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerBalance/GetCurrentCurrency`);
  }

  LoadCustomers(customerType: number = 0): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerBalance/LoadCustomers/?customerType=${customerType}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerBalance/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerBalance/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._http.post(`${ApiConfig.Apiurl2}AR/CustomerBalance/Delete`, formData);
  }
}

