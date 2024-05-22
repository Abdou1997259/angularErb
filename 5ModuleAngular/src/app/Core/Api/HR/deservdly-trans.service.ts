import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class DeservdlyTransService {
  constructor(private _httpClient: HttpClient) { }

  GetAllDeservdlyTrans(pageNumber: number, pageSize: number, docNo: number = 0, docDate: string = "", transYear: number = 0, transMonth: number = 0, notes: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetAllDeservdlyTrans/?pageNumber=${pageNumber}&pageSize=${pageSize}&docNo=${docNo}&docDate=${docDate}&transYear=${transYear}&transMonth=${transMonth}&notes=${notes}`);
  }

  GetNextDeservdlyTrans(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetNextDeservdlyTrans`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetByID/?id=${id}`);
  }

  GetJobCodes(codeName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetJobCodes/?codeName=${codeName}`);
  }

  GetKUPs(jobName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetKUPs/?jobName=${jobName}`);
  }

  GetSources(sourceName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/GetSources/?sourceName=${sourceName}`);
  }

  GetCostName(CostNo : any):Observable<any>{
    return  this._httpClient.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetCostName/?costNo="+CostNo);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/Edit`, formatDate);
  }

  Delete(docNo: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', docNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/DeservdlyTrans/Delete`, formData);
  }
}
