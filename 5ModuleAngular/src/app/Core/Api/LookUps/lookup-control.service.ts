import { Injectable, Input } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LookupControlService {

  constructor(private _httpClient: HttpClient) {
  }

  GetData(searchid:any, searchString:string='', pageNumber: number, pageSize: number, ExtraCondition:any): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}LKP/ItemLookUp/GetSearchLkP?searchid=${searchid}&keyword=${searchString}&pageNumber=${pageNumber}&pageSize=${pageSize}&extra=${ExtraCondition}`);
  }

  GetName(searchid:any, id:string=''): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}LKP/ItemLookUp/GetName?searchid=${searchid}&id=${id}`);
  }

  SetName(form: FormGroup,searchID:any, inputValue:any, inputName :any){
    var valSearch=form.get(inputValue)?.value;
    if(valSearch=='')
      $("#"+inputName).val('');
    else
    {
      this.GetName(searchID, valSearch ).subscribe(data=>{ 
        if(data =='' || data== null)
        {
          form.get(inputValue)?.patchValue('');
          $("#"+inputName).val('');
        }
        else
          $("#"+inputName).val(data.name);
        });
    }
  }
}