import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class EmpPaymentsService {

  constructor(private _httpClient: HttpClient) { }

  GetAllPayments(docNo: number = 0, payNameAr: string = "", payNameEn: string = "", notes: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpPayments/GetAllPayments/?docNo=${docNo}&payNameAr=${payNameAr}&payNameEn=${payNameEn}&notes=${notes}`);
  }

  GetCurrentPayment(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmpPayments/GetCurrentPayment`);
  }

  GetByID(docNo: number): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpPayments/GetByID/?id=${docNo}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpPayments/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpPayments/Edit`, formData);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/EmpPayments/Delete`, formData);
  }
}
