import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UserService } from 'src/app/_Services/user.service';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {

  constructor(private _httClient: HttpClient) {
  }

  GetAllModules(): Observable<Array<any>> {
    return this._httClient.get<Array<any>>(`${ApiConfig.Apiurl2}SYS/Modules/GetAllModules`);
  }

  GetModuleById(moduleId: Number): Observable<Array<any>> {
    return this._httClient.get<Array<any>>(`${ApiConfig.Apiurl2}SYS/Modules/GetModuleById/?moduleId=${moduleId}`);
  }
}
