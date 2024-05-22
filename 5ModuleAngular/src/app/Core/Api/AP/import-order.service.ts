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
export class ImportOrderService {

  constructor(private _httpClient : HttpClient,private userservice:UserService ) {
  }

  GetImportsOrdersLKP(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetImportsOrdersLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GeyCurrentImportOrder(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GeyCurrentImportOrder`);
  }

  GetEmployees(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetEmployees`);
  }

  GetDirections(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetDirections`);
  }

  GetTransSourceDropList(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetTransSourceDropList`);
  }

  GetItemName(itemId: string, storeId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetItemName/?itemId=${itemId}&&storeId=${storeId}`);
  }

  GetUnitName(unitId: number, itemId: string): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetUnitName/?unitId=${unitId}&&itemId=${itemId}`);
  }

  GetPeriorityTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetPeriorityTypes`);
  }

  GetLength(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetLength`);
  }

  GetPaymentsTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetPaymentsTypes`);
  }

  GetStoreName(storeId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetStoreName/?storeId=${ storeId }`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetByID/?id=${id}`);
  }

  GetBranchSuppliers(n_supplier_type_id: number = 0): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/GetBranchSuppliers/?n_supplier_type_id=${n_supplier_type_id}`);
  }

  CheckIfCuurentYearExist(year: string): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/ImportOrder/CheckIfCuurentYearExist/?year=${year}`);
  }

  Create(formData): Observable<any>
  {
    return this._httpClient.post(`${ ApiConfig.Apiurl2 }AP/ImportOrder/Create`, formData);
  }

  Edit(formData): Observable<any>
  {
    return this._httpClient.post(`${ ApiConfig.Apiurl2 }AP/ImportOrder/Edit`, formData);
  }

  Delete(n_import_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_import_no', n_import_no);
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/ImportOrder/Delete`, formData);
  }
}
