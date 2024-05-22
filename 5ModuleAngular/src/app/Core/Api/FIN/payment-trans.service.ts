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
export class PaymentTransService {

  constructor(private _http : HttpClient,private userservice:UserService ) {  }

  GetAllPaymentsTransLKP(docNo: number = 0, docDate: string = "", empName: string = "", salerName: string = "", description: string =""): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/PaymentTrans/GetAllPaymentsTransLKP/?docNo=${docNo}&&docDate=${docDate}&&empName=${empName}&&salerName=${salerName}&&description=${description}`);
  }

  GetCurrentPaymentTrans(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/PaymentTrans/GetCurrentPaymentTrans`);
  }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/PaymentTrans/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/PaymentTrans/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/PaymentTrans/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._http.post(`${ApiConfig.Apiurl2}Fin/PaymentTrans/Delete`, formData);
  }

  GetSavedJournals(docNo : any):Observable<any>{
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/PaymentTrans/GetSavedJournals/?id="+docNo);
  }

  GetCurrentJournals(formdata: any):Observable<any>{
    return  this._http.post(ApiConfig.Apiurl2+"Fin/PaymentTrans/GetCurrentJournals",formdata);
  }
}
