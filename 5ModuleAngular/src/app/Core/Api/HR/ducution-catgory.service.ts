import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class DucutionCatgoryService {

  constructor(private _httpClient: HttpClient) { }

  GetAllDedcutionCat(id: number = 0, name: string = "", nameEg: string = "", notes: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/DeductionCat/GetAllDedcutionCat/?id=${id}&name=${name}&nameEg=${nameEg}&notes=${notes}`);
  }



  GetByID(id: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/DeductionCat/GetByID/?id=${id}`);
  }


  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/DeductionCat/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/DeductionCat/Edit`, formData);
  }

  Delete(custodyNo: number): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_id', custodyNo);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/DeductionCat/Delete`, formData);
  }
}
