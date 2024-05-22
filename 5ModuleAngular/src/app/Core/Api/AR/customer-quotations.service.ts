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
export class CustomerQuotationService {

  constructor(private _http : HttpClient,private userservice:UserService ) {
  }

  GetAllCustomerQuotationsLKP(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/GetAllCustomerQuotationsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetCurrentQuotation(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/GetCurrentQuotation`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/GetByID/?id=${id}`);
  }

  GetTransSourceDropList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/GetTransSourceDropList`);
  }

  GetCustomerDP(serachString: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/GetCustomerDP/?serachString=${serachString}`);
  }
 
  GetSalesmenDP(serachString: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/GetSalesmenDP/?serachString=${serachString}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/CustomerQuotation/Edit`, formData);
  }

  Delete(n_Quotation_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_Quotation_no', n_Quotation_no);
    return this._http.post(`${ApiConfig.Apiurl2}AR/CustomerQuotation/Delete`, formData);
  }

  GetItemName(itemNo: any): Observable<any>
  {
    return this._http.get(`${ApiConfig.Apiurl2}AR/CustomerQuotation/GetItemName/?itemNo=${itemNo}`);
  }

}
