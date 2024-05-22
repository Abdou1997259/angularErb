import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';


@Injectable({
  providedIn: 'root'
})
export class VacationService {

  constructor(private _httpClient: HttpClient) { }



  GetByID(id: number): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Vacation/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Vacation/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Vacation/Edit`, formData);
  }

  Delete(id: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_doc_no', id);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Vacation/Delete`, formData);
  }
  GetAllVacation(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
  {
    debugger
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/Vacation/GetAllVacation/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }
  
}
