import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UserService } from 'src/app/_Services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AccountlevelsService {

  constructor(private _httpClient: HttpClient, private userservice:UserService) {}

  get(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(
      ApiConfig.Apiurl2 + 'GL/AccountLevel/GetAccounLevels'
    );
  }

  post(formdata: any): Observable<any> {
    return this._httpClient.post(
      ApiConfig.Apiurl2 + 'GL/AccountLevel/Create',
      formdata
    );
  }
}
