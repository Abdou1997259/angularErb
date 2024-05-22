import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class MultiPaymentTransService {

  constructor(private _http : HttpClient,private userservice:UserService ) {  }

  GetAllMultiPaymentsLKP(docNo: number = 0, docDate: string = "", empName: string = "", salerName: string = "", description: string =""): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/MultiPaymentTrans/GetAllMultiPaymentsLKP/?docNo=${docNo}&&docDate=${docDate}&&empName=${empName}&&salerName=${salerName}&&description=${description}`);
  }

  GetCurrentPaymentTrans(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/MultiPaymentTrans/GetCurrentPaymentTrans`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/MultiPaymentTrans/GetByID/?id=${id}`);
  }

  GetSourceName(type: number = 0, sourceID: number = 0, search: string = ''): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/MultiPaymentTrans/GetSourceName/?type=${type}&&sourceID=${sourceID}&&search=${search}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/MultiPaymentTrans/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/MultiPaymentTrans/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._http.post(`${ApiConfig.Apiurl2}Fin/MultiPaymentTrans/Delete`, formData);
  }

  GetSavedJournals(docNo : any):Observable<any>{
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/MultiPaymentTrans/GetSavedJournals/?id="+docNo);
  }

  GetCurrentJournals(formdata: any):Observable<any>{
    return  this._http.post(ApiConfig.Apiurl2+"Fin/MultiPaymentTrans/GetCurrentJournals",formdata);
  }
}
