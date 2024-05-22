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
  export class SupplierPop
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }


      GetTypesLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/Supplier/getSupplierTypes/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
       }


      GetPurchaseMenLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/Supplier/getPurchaseMan/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
      }
      
      getAreaLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/Supplier/getArea/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
      }
      getCommissionLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/Supplier/getCommission/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
      }
      getAccountsLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/Supplier/getAcountsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
      }
      getBranchesLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/Supplier/getBranchesLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
      }
      getAccountsSupplier(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/SupplierConfigration/GetAccounts/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
      }
      getAccountsPrimary(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult> {
        return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/SupplierConfigration/GetPrimaryAccounts/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
      }
   
  }