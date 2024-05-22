import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class VisaService {

  constructor(private _httpClient: HttpClient) { }

  GetAllVisaIssue(docNo: number = 0, docDate: string = "", sponserName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetAllVisaIssue/?docNo=${docNo}&docDate=${docDate}&sponserName=${sponserName}`);
  }

  GetNextVisaIssue(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetNextVisaIssue`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetByID/?id=${id}`);
  }

  GetSponsers(sponserName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetSponsers/?sponserName=${sponserName}`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/VisaIssue/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/VisaIssue/Edit`, formatDate);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/VisaIssue/Delete`, formData);
  }
}
