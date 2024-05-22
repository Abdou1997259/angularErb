import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class VacationRulesService {

  constructor(private _httpClient: HttpClient) { }

  GetAllVacationRules(pageNumber: number, pageSize: number, ruleNo: number = 0, ruleDescAr: string = "", ruleDescEn: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/VacationRules/GetAllVacationRules/?pageNumber=${pageNumber}&pageSize=${pageSize}&ruleNo=${ruleNo}&ruleDescAr=${ruleDescAr}&ruleDescEn=${ruleDescEn}`);
  }

  GetNextVacationRule(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/VacationRules/GetNextVacationRule`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/VacationRules/GetByID/?id=${id}`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/VacationRules/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/VacationRules/Edit`, formatDate);
  }

  Delete(loanNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_rule_no', loanNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/VacationRules/Delete`, formData);
  }
}
