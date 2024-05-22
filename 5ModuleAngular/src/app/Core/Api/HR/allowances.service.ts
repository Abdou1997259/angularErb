import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class AllowancesService {

  constructor(private _httpClient: HttpClient) { }

  GetAllAllowances(allowanceId: number = 0, allowanceNameAr: string = "", allowanceNameEn: string = "", catName: string =""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Allowances/GetAllAllowances/?allowanceId=${allowanceId}&allowanceNameAr=${allowanceNameAr}&allowanceNameEn=${allowanceNameEn}&catName=${catName}`);
  }

  GetNextAllowance(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Allowances/GetNextAllowance`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Allowances/GetByID/?id=${id}`);
  }

  GetAllowancesCategory(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Allowances/GetAllowancesCategory`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Allowances/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Allowances/Edit`, formData);
  }

  Delete(allowanceId: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_allowance_id', allowanceId);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Allowances/Delete`, formData);
  }
}
