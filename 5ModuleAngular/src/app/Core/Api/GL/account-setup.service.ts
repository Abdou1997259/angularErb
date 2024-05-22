import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root',
})
export class AccountSetupService {

  constructor(private _httpClient: HttpClient, private userservice: UserService) {

  }

  get(): Observable<any> {
    return this._httpClient.get(
      `${ApiConfig.Apiurl2}GL/AccountSetup/Get`
    );
  }

  post(formData: any): Observable<any> {
    return this._httpClient.post(
      ApiConfig.Apiurl2 + 'GL/AccountSetup/Create',
      formData
    );
  }

  
  checkJounals(): Observable<any> {
    return this._httpClient.get(`${ApiConfig.Apiurl2}GL/AccountSetup/CheckJounals`);
  }
  
}
