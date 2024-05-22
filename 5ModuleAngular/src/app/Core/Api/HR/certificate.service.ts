import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private _httpClient: HttpClient) { }

  GetAllCertificates(certificateId: number = 0, certificateNameAr: string = "", certificateNameEn: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Certificates/GetAllCertificates/?certificateId=${certificateId}&certificateNameAr=${certificateNameAr}&certificateNameEn=${certificateNameEn}`);
  }

  GetNextCertificate(): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Certificates/GetNextCertificate`);
  }

  GetByID(id: any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Certificates/GetByID/?id=${id}`);
  }

  Create(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Certificates/Create`, formatDate);
  }

  Edit(formatDate: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Certificates/Edit`, formatDate);
  }

  Delete(certificateId: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_certificate_id', certificateId);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Certificates/Delete`, formData);
  }
}
