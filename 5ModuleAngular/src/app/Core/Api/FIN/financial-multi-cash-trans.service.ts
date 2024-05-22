import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FinancialMultiCahsTransService {

  constructor( private _httpClient: HttpClient, private _userService:UserService ) {
  }

  GetAllFinancialMultiCashes(docNo: number = 0, serialNo: number = 0, docDate: string = "", currencyName: string = "", description: string ="", total: number = 0): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/FinancialMultiCashTrans/GetAllFinancialMultiCashes?docNo=${docNo}&&serialNo=${serialNo}&&docDate=${docDate}&&currencyName=${currencyName}&&description=${description}&&total=${total}`);
  }

  GetAllFinancialCash(cashId: string): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/FinancialMultiCashTrans/GetAllFinancialCash?cashId=${cashId}`);
  }

  GetGlFinCashes(name: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/FinancialMultiCashTrans/GetGlFinCashes?name=${name}`);
  }

  Recieve(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}Fin/FinancialMultiCashTrans/Recieve`, formData)
  }

  Delete(n_doc_no: any, n_serial: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    formData.append('n_serial', n_serial);
    return this._httpClient.post(`${ApiConfig.Apiurl2}Fin/FinancialMultiCashTrans/Delete`, formData)
  }
}
