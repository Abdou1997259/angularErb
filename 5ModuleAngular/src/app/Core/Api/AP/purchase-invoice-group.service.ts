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
export class PurchaseInvoiceGroupService {

  constructor(private _httpClient : HttpClient,private userservice:UserService ) {

  }

  GetAllPurchaseInvoiceGroup(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}AP/PurchaseInvoiceGroup/GetAllPurchaseInvoiceGroup/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetCurrentPurchaseInvoiceGroup(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AP/PurchaseInvoiceGroup/GetCurrentPurchaseInvoiceGroup`);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._httpClient.post(`${ApiConfig.Apiurl2}AP/PurchaseInvoiceGroup/Delete`, formData);
  }
}
