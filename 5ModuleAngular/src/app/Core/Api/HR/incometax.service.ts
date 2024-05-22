import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class IncometaxService {
  constructor(private _httpClient: HttpClient) { }

  GetAllIncomeTax(docNo: number = 0, fromDate: string = "", toDate: string = "", notes: string = "", annualDiscouint: number = 0): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/IncomeTax/GetAllIncomeTax/?docNo=${docNo}&fromDate=${fromDate}&toDate=${toDate}&notes=${notes}&annualDiscouint=${annualDiscouint}`);
  }

  GetNextIncomeTax(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/IncomeTax/GetNextIncomeTax`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/IncomeTax/GetByID/?id=${id}`);
  }

  GetLayers(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/IncomeTax/GetLayers`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/IncomeTax/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/IncomeTax/Edit`, formatDate);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/IncomeTax/Delete`, formData);
  }
}
