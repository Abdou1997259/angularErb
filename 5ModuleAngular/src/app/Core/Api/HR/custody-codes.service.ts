import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class CustodyCodesService {

  constructor(private _httpClient: HttpClient) { }

  GetAllCustodyCodes(custodyNo: number = 0, custodynameAr: string = "", custodynameEn: string = "", cashVal: number = 0): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/CustodyCodes/GetAllCustodyCodes/?custodyNo=${custodyNo}&custodynameAr=${custodynameAr}&custodynameEn=${custodynameEn}&cashVal=${cashVal}`);
  }

  GetNextCustodyCode(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/CustodyCodes/GetNextCustodyCode`);
  }

  GetByID(custodyNo: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/CustodyCodes/GetByID/?id=${custodyNo}`);
  }

  GetAssets(asstName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/CustodyCodes/GetAssets/?asstName=${asstName}`);
  }

  GetAccounts(accName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/CustodyCodes/GetAccounts/?accName=${accName}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/CustodyCodes/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/CustodyCodes/Edit`, formData);
  }

  Delete(custodyNo: number): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_custody_no', custodyNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/CustodyCodes/Delete`, formData);
  }
}
