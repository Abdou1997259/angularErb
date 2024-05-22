import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class SuppliersTypesLKPService {

  constructor(private _httpClient: HttpClient) {
  }

  GetSuppliersTypesLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}LKP/SuppliersTypesLKP/GetSuppliersTypesLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetSupplierTypeName(n_supplier_type_id: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ ApiConfig.Apiurl2 }LKP/SuppliersTypesLKP/GetSupplierTypeName/?n_supplier_type_id=${ n_supplier_type_id }`);
  }
}
