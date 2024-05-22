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
export class SuppliersOpeningBalanceService {

  constructor(private _httpClient : HttpClient,private userservice:UserService ) {
  }

  GetSuppliersOpeningBalanceLKP(pageNumber: number, pageSize: number, docNo: number = 0, docDate: string = "", finYear: string = "", currency: string = "", supplierType: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}AP/SuppliersOpeningBalance/GetSuppliersOpeningBalanceLKP/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&finYear=${finYear}&currency=${currency}&supplierType=${supplierType}`);
  }

  GetCurrentSuppliersOPeningBalance(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/SuppliersOpeningBalance/GetCurrentSuppliersOPeningBalance`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/SuppliersOpeningBalance/GetByID/?id=${id}`);
  }

  GetBranchSuppliers(n_supplier_type_id: number = 0): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/SuppliersOpeningBalance/GetBranchSuppliers/?n_supplier_type_id=${n_supplier_type_id}`);
  }
  
  GetSuppliersDP(searchString: string = ''): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/SuppliersOpeningBalance/GetSuppliersDP/?searchString=${searchString}`);
  }

  CheckIfCuurentYearExist(year: string): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/SuppliersOpeningBalance/CheckIfCuurentYearExist/?year=${year}`);
  }

  Create(formData): Observable<any>
  {
    return this._httpClient.post(`${ ApiConfig.Apiurl2 }AP/SuppliersOpeningBalance/Create`, formData);
  }

  Edit(formData): Observable<any>
  {
    return this._httpClient.post(`${ ApiConfig.Apiurl2 }AP/SuppliersOpeningBalance/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/SuppliersOpeningBalance/Delete`, formData);
  }
}
