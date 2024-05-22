import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class LookUpService {

  
  constructor(private _http : HttpClient) { }
 
   
  GetById(id : string) : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl+ "LookUp/GetLookup?id="+id);
  }
  
 
}
