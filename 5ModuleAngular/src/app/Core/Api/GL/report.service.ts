import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UserService } from 'src/app/_Services/user.service';

@Injectable({
  providedIn: 'root',
})

export class ReportService {

  constructor(private _httpClient: HttpClient, private _userservice: UserService) {
  }

  GetAllModules(): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Report/GetAllModules`);
  }

  GetModuleById(Id: number): Observable<any> {
    return this._httpClient.get(ApiConfig.Apiurl2 + `GL/Report/GetModulesById?id=${Id}`)
  }

  GetCurrentModuleReports(Id: number): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Report/GetCurrentModuleReports?id=${Id}`)
  }

  GetCurrentModuleGroup(moduleId: number, groupId: number): Observable<any> {
    return this._httpClient.get(ApiConfig.Apiurl2 + `GL/Report/GetCurrentModuleGroup?moduleId=${moduleId}&&groupId=${groupId}`)
  }

  GetReportsList(moduleId: number, groupId: number, searchVal: string): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Report/GetReportsList?moduleId=${moduleId}&&groupId=${groupId}&&userId=${this._userservice.GetUserID()}&&searchVal=${searchVal}`);
  }

  GetReportFilters(repId: string): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Report/GetReportFilters?repId=${repId}`);
  }

  GetLKPSearch(sTable: string): Observable<Array<any>> {
    return this._httpClient.get<Array<any>>(ApiConfig.Apiurl2 + `GL/Report/GetLKPSearch/?sTable=${sTable}`);
  }

  PrintReport(details: string, Id: string, module: number, exportType: number, comp:number, year:number, lang:string){
    window.open(`${ApiConfig.ReportUrl}DownloadReport?details=${details}&&ID=${Id}&&Module=${module}&&exportType=${exportType}&&comp=${comp}&&year=${year}&&lang=${lang}`,'_blank');
  }

  GetReportName(repId: string): Observable<any> {
    return this._httpClient.get(ApiConfig.Apiurl2 + `GL/Report/GetReportName?repId=${repId}`);
  }
 }
