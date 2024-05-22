import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class JobLkpService {

  constructor(private _httpClient: HttpClient) { }

  GetJobs(jobId: number = 0, jobName: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetJobs/?jobId=${jobId}&jobName=${jobName}`);
  }

  GetJobName(jobId: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/VisaIssue/GetJobName/?jobId=${jobId}`);
  }
}
