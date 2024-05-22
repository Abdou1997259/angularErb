import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class ArShiftsService {

  constructor(private _httpClient : HttpClient,private userservice:UserService ) {  }

  GetAllShifts(docNo: Number = 0, docDate: string = "", shiftType: string = "", empName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/Shift/GetAllShifts/?docNo=${docNo}&docDate=${docDate}&shiftType=${shiftType}&empName=${empName}`);
  }

  GetNextShiftDefaultData(): Observable<any>
  {
    return this._httpClient.get(`${ApiConfig.Apiurl2}AR/Shift/GetNextShiftDefaultData`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._httpClient.get(`${ApiConfig.Apiurl2}AR/Shift/GetByID/?id=${id}`);
  }

  GetShiftTypesDP(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/Shift/GetShiftTypesDP`);
  }

  GetSalers(salerId: number = 0, salerName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/Shift/GetSalers/?salerId=${salerId}&salerName=${salerName}`);
  }

  GetCashes(cashId: number = 0, cashName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}AR/Shift/GetCashes/?cashId=${cashId}&cashName=${cashName}`);
  }

  GetSalerName(salerId: number = 0): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AR/Shift/GetSalerName/?salerId=${salerId}`);
  }

  GetCashName(cashId: number = 0): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AR/Shift/GetCashName/?cashId=${cashId}`);
  }

  IsSalerHasOpenShift(salerId: number = 0): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}AR/Shift/IsSalerHasOpenShift/?salerId=${salerId}`);
  }

  Create(formdata: any):Observable<any>{
    return this._httpClient.post(ApiConfig.Apiurl2+"AR/Shift/Create", formdata);
  }

  Edit(formdata: any):Observable<any>{
    return this._httpClient.post(ApiConfig.Apiurl2+"AR/Shift/Edit", formdata);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}AR/Shift/Delete`, formData);
  }
}
