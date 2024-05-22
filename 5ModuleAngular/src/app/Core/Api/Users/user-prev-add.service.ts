import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class UserPrevAddService {

  constructor(private _http : HttpClient, private userservice:UserService) {

  }
  GetByID(id: number): Observable<any>
  {

let data=this._http.get<any>(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetUserByID/?id=${id}`);
    return data;
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/Edit`, formData);
  }

  Delete(id: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_ID ', id);
    return this._http.post(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/Delete`, formData);
  }
  GetAllCashes(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllCashes/?search=${search}`);
  }
  GetAllVisaType(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllVisaType/?search=${search}`);
  }
  GetAllStores(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllStores/?search=${search}`);
  }
  GetAllBanks(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllBanks/?search=${search}`);
  }
  
  GetAllBranches(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllBranches/?search=${search}`);
  }
  GetAllYears(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllYears/?search=${search}`);
  }
  GetAllOrderIssue(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllOrderIssue/?search=${search}`);
  }
  GetAllCust(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllDefualtSuppliers/?search=${search}`);
  }
  GetAllSupDirection(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllSupDirection/?search=${search}`);
  }
  GetAllCostCenter(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllCostCenter/?search=${search}`);
  }
  GetAllDefualtSuppliers(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllDefualtSuppliers/?search=${search}`);
  }
  GetAllProLines(search:any): Observable<any>
  {
    
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllProLines/?search=${search}`);
  }

  GetAllStations(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllStations/?search=${search}`);
  }
  GetAllMixerWorkers(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllMixerWorkers/?search=${search}`);
  }
  GetAllCustDir(search:any): Observable<any>
  {
 
    return this._http.get(`${ApiConfig.Apiurl2}sys/UserPrevAdditional/GetAllCustDir/?search=${search}`);
  }

}
