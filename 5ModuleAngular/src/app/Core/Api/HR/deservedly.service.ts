import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class DeservedlyService {

  constructor(private _httpClient: HttpClient) { }

  GetAllDeservedly(docNo: number = 0, deservedlyNameAr: string = "", deservedlyNameEn: string = "", discountFrom: string = "", calcType: string = "", payType: string = "", category: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deservedly/GetAllDeservedly/?docNo=${docNo}&deservedlyNameAr=${deservedlyNameAr}&deservedlyNameEn=${deservedlyNameEn}&discountFrom=${discountFrom}&calcType=${calcType}&payType=${payType}&category=${category}`);
  }

  GetNextDeservedly(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Deservedly/GetNextDeservedly`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Deservedly/GetByID/?id=${id}`);
  }

  GetDiscountFromList(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deservedly/GetDiscountFromList`);
  }

  GetCalcTypesList(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deservedly/GetCalcTypesList`);
  }

  GetPayments(payName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deservedly/GetPayments/?payName=${payName}`);
  }

  GetCategories(catName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deservedly/GetCategories/?catName=${catName}`);
  }

  GetAllowances(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deservedly/GetAllowances`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Deservedly/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Deservedly/Edit`, formatDate);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Deservedly/Delete`, formData);
  }
}
