import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  constructor(private _httpClient: HttpClient) {

  }

  GetAllYears(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + "GL/Company/GetAllYears");
  }

  GetAllCompanies(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + "GL/Company/GetAllCompanies");
  }

  GetCompanyYears(Id: number): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Company/GetCompanyYears?Id=${Id}`);
  }

  CreateConnectionString(compId: number, year: number) {
    return this._httpClient.get(ApiConfig.Apiurl2 + `GL/Company/CreateConnectionString`);
  }

  GetCompanyBranches(comp:any, year:any): Observable<any> {
    return this._httpClient.get(ApiConfig.Apiurl2 + `GL/Company/GetCompanyBranches/?comp=${comp}&year=${year}`);
  }

  GetCompanyBranchesByUser(comp:any, year:any,user:any): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Company/GetCompanyBranchesByUser/?comp=${comp}&year=${year}&user=${user}`);
  }

  GetAllCompaniesByYear(year: number): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Company/GettAllCompaniesByYear?year=${year}`);
  }

  getUsersByBranch(branchId:any,comp:any,year:any)
  {
    debugger
    return this._httpClient.get(`${ApiConfig.Apiurl2}GL/Company/GetAllUsersByBranch?branchId=${branchId}&comp=${comp}&year=${year}`)
  }
}
