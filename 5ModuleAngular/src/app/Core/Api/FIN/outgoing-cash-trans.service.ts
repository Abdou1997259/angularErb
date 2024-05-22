import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class OutgoingCahsTransService {

  constructor( private _httpClient: HttpClient, private _userService:UserService ) {
  }

  GetAllOutgoingCashTrans(docNo: number = 0, serialNo: number = 0, docDate: string = "", currencyName: string = "", description: string ="", total: number = 0): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/GetAllOutgoingCashTrans/?docNo=${docNo}&&serialNo=${serialNo}&&docDate=${docDate}&&currencyName=${currencyName}&&description=${description}&&total=${total}`);
  }

  GetCurrentTransfer(): Observable<any>
  {
    return this._httpClient.get(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/GetCurrentTransfer`);
  }

  GetTransferByID(id: number): Observable<any>
  {
    return this._httpClient.get(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/GetByID?id=${id}`);
  }

  GetSalesMen(name: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/GetSalesMen?name=${name}`);
  }

  GetEmployees(name: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/GetEmployees?name=${name}`);
  }
  
  GetGlCashes(name: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/GetGlCashes?name=${name}`);
  }

  GetCurrentJournals(formdata: any):Observable<any>{   
    return  this._httpClient.post(ApiConfig.Apiurl2+"Fin/OutgoingCashTrans/GetCurrentJournals", formdata);
  }

  GetJournalID(docNo : any, typeNo:any):Observable<any>{ 
    return  this._httpClient.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
  }

  // Not implemened 
  GetSavedJournals(docNo : any):Observable<any>{ 
    return  this._httpClient.get( ApiConfig.Apiurl2+ "Fin/OutgoingCashTrans/GetSavedJournals/?id="+docNo);
  }
  //****** */

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}Fin/OutgoingCashTrans/Edit`, formData);
  }

  Delete(id : number):Observable<any>{
    var formData: any = new FormData();
    formData.append("n_doc_no", id);
    return  this._httpClient.post(ApiConfig.Apiurl2+"Fin/OutgoingCashTrans/Delete", formData);
  }
}
