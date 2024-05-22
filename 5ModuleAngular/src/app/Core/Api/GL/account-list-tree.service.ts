import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { AccountListTree } from 'src/app/_model/AccountListTree/account-list-tree';

@Injectable({
  providedIn: 'root'
})
export class AccountListTreeService {

  constructor(private _http : HttpClient, private userservice: UserService) { }


  GetMainAccounts(): Observable<Array<AccountListTree>>{
    return this._http.get<Array<AccountListTree>>( ApiConfig.Apiurl2+ "GL/AccountListTree");
  }

  GetSubAccounts(s_account_no : string) : Observable<Array<AccountListTree>>{
    return this._http.get<Array<AccountListTree>>( ApiConfig.Apiurl2+ "GL/AccountListTree/" + s_account_no);
  }

  GetAccounts(){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/GetAllAccounts`);
  }

  GetAccountsTypes(){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/GetAccountsTypes`);
  }

  GetAccountsGroups(){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/GetAccountsGroups`);
  }

  GetCostCenterStatus(){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/GetCostCenterStatus`);
  }

  GetOneAccount(s_account_no: string): Observable<any>{
    return this._http.get<any>(ApiConfig.Apiurl2+`GL/AccountListTree/GetOneAccount?s_account_no=${s_account_no}`);
  }

  CheckIfAccountHasChilds(accountNo: string): Observable<any>
  {
    return this._http.get<any>(ApiConfig.Apiurl2+`GL/AccountListTree/CheckIfAccountHasChilds/?accountNo=${accountNo}`);
  }

  SaveAccount( formdata :any):Observable<any>{
    return  this._http.post( ApiConfig.Apiurl2+"GL/AccountListTree/Create",formdata);
  }


  EditAccount( formdata :any):Observable<any>{
    return  this._http.post( ApiConfig.Apiurl2+"GL/AccountListTree/Edit",formdata);
  }

  DeleteAccount(formdata :any):Observable<any>{
    return  this._http.post( ApiConfig.Apiurl2+"GL/AccountListTree/Delete",formdata);
  }

  GetNewAccountID(s_account_no: string):Observable<any>{
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/GetNewAccountID?s_account_no=${s_account_no}`);
  }

  GetCostCentersForAccount(s_account_no: string):Observable<any> {
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/GetCostCentersForAccount?s_account_no=${s_account_no}`);
  }
  
  getCostCenterData(id: string):Observable<any> {
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/getCostCenterData?id=${id}`);
  }

  GetNextBaseAccData(): Observable<any>
  {
    return this._http.get<any>(ApiConfig.Apiurl2+`GL/AccountListTree/GetNextBaseAccData`);
  }
}
