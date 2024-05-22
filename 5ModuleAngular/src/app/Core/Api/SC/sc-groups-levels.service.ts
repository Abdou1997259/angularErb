import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class ScGroupsLevelsService {

  constructor(private _httpClient: HttpClient) {

  }

  get(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}SC/SCgroupsLevel/GetAllGroupsLevels`);
  }

  post(formData: any): Observable<any> {
    return this._httpClient.post(`${ApiConfig.Apiurl2}SC/SCgroupsLevel/Create`, formData);
  }
}
