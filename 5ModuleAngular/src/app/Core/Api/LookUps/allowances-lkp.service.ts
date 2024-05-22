import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class AllowancesLkpService {

  constructor(private _httpClient: HttpClient) { }

  GetAllowances(allowanceId: number = 0, allowanceName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/EmpContract/GetAllowances/?allowanceId=${allowanceId}&allowanceName=${allowanceName}`);
  }

  GetAllowanceName(allowanceId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/EmpContract/GetAllowanceName/?allowanceId=${allowanceId}`);
  }
}
