import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class EvaluationGroupsService {

  constructor(private _httpClient: HttpClient) { }

  GetAllEvaluationGroups(docNo: number = 0, evalNameAr: string = "", evalNameEn: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EvaluationGroups/GetAllEvaluationGroups/?docNo=${docNo}&evalNameAr=${evalNameAr}&evalNameEn=${evalNameEn}`);
  }

  GetNextEvaluation(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EvaluationGroups/GetNextEvaluation`);
  }

  GetByID(docNo: number): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EvaluationGroups/GetByID/?id=${docNo}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EvaluationGroups/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EvaluationGroups/Edit`, formData);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EvaluationGroups/Delete`, formData);
  }
}
