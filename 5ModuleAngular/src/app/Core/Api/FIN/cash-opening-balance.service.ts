import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CashOpeningBalanceService {

  constructor(private _http : HttpClient,private userservice:UserService ) {  }

  GetAllCasheBalancesLKP(pageNumber: number, pageSize: number, docNo: number = 0, financialYear: string = "", docDate: string = "", cashType: string = "", description: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/GetAllCasheBalancesLKP/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&financialYear=${financialYear}&docDate=${docDate}&cashType=${cashType}&description=${description}`);
  }

  GetCurrentCasheBalance(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/GetCurrentCasheBalance`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/GetByID/?id=${id}`);
  }

  GetAllCashes(cashId: number = 0): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/GetAllCashes/?cashId=${cashId}`);
  }

  GetCashTypes(cashName: string = ""): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/GetCashTypes/?cashName=${cashName}`);
  }

  GetCurrentFinancialYear(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/GetCurrentFinancialYear`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._http.post(`${ApiConfig.Apiurl2}Fin/CasheOpeningBalance/Delete`, formData);
  }
}
