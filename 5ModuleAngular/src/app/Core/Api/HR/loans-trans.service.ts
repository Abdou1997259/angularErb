import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class LoansTransService {
  constructor(private _httpClient: HttpClient) { }

  GetAllLoansTrans(pageNumber: number, pageSize: number, loanNo: number = 0, loanDate: string = "", transType: string = "", empName: string = "", loanVal: number = 0, description: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/LoansTrans/GetAllLoansTrans/?pageNumber=${pageNumber}&pageSize=${pageSize}&loanNo=${loanNo}&loanDate=${loanDate}&transType=${transType}&empName=${empName}&loanVal=${loanVal}&description=${description}`);
  }

  GetNextLoansTrans(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/LoansTrans/GetNextLoansTrans`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/LoansTrans/GetByID/?id=${id}`);
  }

  GetSettlementTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/LoansTrans/GetSettlementTypes`);
  }

  GetTransTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/LoansTrans/GetTransTypes`);
  }

  GetEmployee(empName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/LoansTrans/GetEmployee/?empName=${empName}`);
  }

  GetAccountsTree(s_account_name: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/LoansTrans/GetAccountsTree/?s_account_name=${s_account_name}`);
  }

  GetCostName(CostNo : any):Observable<any>{
    return  this._httpClient.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetCostName/?costNo="+CostNo);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/LoansTrans/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/LoansTrans/Edit`, formatDate);
  }

  Delete(loanNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_loan_no', loanNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/LoansTrans/Delete`, formData);
  }
}
