import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class NationalityLkpService {

  constructor(private _httpClient: HttpClient) { }

  GetNationalities(nationalityId: number = 0, nationalityName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetNationalities/?nationalityId=${nationalityId}&nationalityName=${nationalityName}`);
  }

  GetNationalityName(nationalityId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetNationalityName/?nationalityId=${nationalityId}`);
  }
}
