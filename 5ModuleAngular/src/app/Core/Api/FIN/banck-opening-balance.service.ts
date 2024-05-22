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
export class BanckOpeningBalanceService {

  constructor(private _http : HttpClient,private userservice:UserService ) {  }

  GetAllBankBalancesLKP(pageNumber: number, pageSize: number, docNo: number = 0, financialYear: string = "", docDate: string = "", mainBank: string = "", description: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/GetAllBankBalancesLKP/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&financialYear=${financialYear}&docDate=${docDate}&mainBank=${mainBank}&description=${description}`);
  }

  GetCurrentBankBalance(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/GetCurrentBankBalance`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/GetByID/?id=${id}`);
  }

  GetAllBankBranches(bankId: number = 0): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/GetAllBankBranches/?bankId=${bankId}`);
  }

  GetAllMainBanks(bankName: string = ""): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/GetAllMainBanks/?bankName=${bankName}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._http.post(`${ApiConfig.Apiurl2}Fin/BanckOpeningBalance/Delete`, formData);
  }
}
