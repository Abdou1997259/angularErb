import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class PenaltiesService {

  constructor(private _httpClient: HttpClient) { }

  GetAllPenalties(docNo: number = 0, penaltiesNameAr: string = "", penaltiesNameEn: string = "", notes: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Penalties/GetAllPenalties/?docNo=${docNo}&penaltiesNameAr=${penaltiesNameAr}&penaltiesNameEn=${penaltiesNameEn}&notes=${notes}`);
  }

  GetNextPenalties(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Penalties/GetNextPenalties`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Penalties/GetByID/?id=${id}`);
  }

  GetDeductions(deductionName: any = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Penalties/GetDeductions/?deductionName=${deductionName}`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Penalties/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Penalties/Edit`, formatDate);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Penalties/Delete`, formData);
  }
}
