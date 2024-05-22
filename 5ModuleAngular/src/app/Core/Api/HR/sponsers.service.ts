import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class SponsersService {

  constructor(private _httpClient: HttpClient) { }

  GetAllSponsers(sponserId: number = 0, type: string = "", sponserNameAr: string = "", sponserNameEn: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Sponsers/GetAllSponsers/?sponserId=${sponserId}&type=${type}&sponserNameAr=${sponserNameAr}&sponserNameEn=${sponserNameEn}`);
  }

  GetNextSponser(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Sponsers/GetNextSponser`);
  }

  GetByID(sponserId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Sponsers/GetByID/?id=${sponserId}`);
  }

  GetTypes(): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Sponsers/GetTypes`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Sponsers/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Sponsers/Edit`, formData);
  }

  Delete(sponserId: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_Sponser_id', sponserId);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Sponsers/Delete`, formData);
  }
}
