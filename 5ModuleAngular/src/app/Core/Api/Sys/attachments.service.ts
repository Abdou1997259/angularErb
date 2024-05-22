import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})

export class AttachmentsService {

  constructor(private _http : HttpClient, private userservice:UserService) {
  }
  
  SaveAttachments(formdata: any):Observable<any>{
    return this._http.post(ApiConfig.Apiurl2+"sys/Attachments/SaveAttachments",formdata);
  }

  GetAttachments(docNo: any, folder: any):Observable<any>{
    return this._http.get<any>(ApiConfig.Apiurl2+`sys/Attachments/GetAttachments/?docNo=${docNo}&&folder=${folder}`);
  }

  DownloadFile(docNo, folder, fileName){ 
    $('.downloadBtn').prop('disabled', true);
    this._http.get(`${ApiConfig.Apiurl2}sys/Attachments/DownloadFile/?docNo=${docNo}&&_Folder=${folder}&&fileName=${fileName}`, { responseType: 'blob' }).subscribe(blob => {
      debugger;
      saveAs(blob, fileName, {
         type: blob.type
      });
      $('.downloadBtn').prop('disabled', false);
   });
  }

}
