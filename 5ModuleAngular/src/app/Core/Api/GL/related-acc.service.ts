import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root',
})
export class RelatedAccService {

  constructor(private _httpClient: HttpClient, private userservice: UserService) {}

  GetrelatedAcc(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(
      ApiConfig.Apiurl2 + `GL/RelatedAcc/GetAllRelatedAcc`
    );
  }
}
