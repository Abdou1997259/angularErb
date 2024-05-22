import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { SysUser } from '../../model/Main/SysUser';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private config: any;

  constructor(private _httpClient : HttpClient, private userservice:UserService) {
  }

  GetConfigFileProperties(): Observable<any>
  {
    return this._httpClient.get<any>('assets/config.json');
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getQrUrl(): string {
    return this.config.qrUrl;
  }

  getReportUrl(): string {
    return this.config.reportUrl;
  }
}