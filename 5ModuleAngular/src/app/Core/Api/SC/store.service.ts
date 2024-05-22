import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from 'src/app/_Setting/ApiConfig'
import { Store } from '../../model/SC/Store';
import { EmpViewModel } from '../../model/SC/empolyee';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { formatDate } from '@fullcalendar/core/formatting-api';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private _http:HttpClient) { }
  public getLastStoreID():Observable<number>
  {
    return this._http.get<number>(ApiConfig.Apiurl2+"SC/Store/GetLastStoreID");
  }
  public editStore(formData:any):Observable<any>
  {
    return this._http.post(ApiConfig.Apiurl2+"SC/Store/EditStore",formData )
  }
 post(formdata: any):Observable<any>{

    return  this._http.post( ApiConfig.Apiurl2+ "SC/Store/Create",formdata);
  }

  public getAllEmpLKP(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>
  {
   return this._http.get<PageResult>(ApiConfig.Apiurl2+`SC/Store/GetEmpolyeesLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

 public getAllEmp():Observable<Array<EmpViewModel>>
 {
  return this._http.get<EmpViewModel[]>(ApiConfig.Apiurl2+"SC/Store/GetEmpolyees");
 }

 public GetEmployeeNameById(id: number):Observable<any>
 {
  return this._http.get<any>(ApiConfig.Apiurl2+"SC/Store/GetEmployeeNameById/?id="+id);
 }


 DeleteStore(id : number):Observable<any>{
  var formData: any = new FormData();
    formData.append("n_store_id", id);
  return  this._http.post(ApiConfig.Apiurl2+"SC/Store/DeleteStore", formData);
}


getAllStores(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{
  return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `SC/Store/GetAllStores/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
}


GetStoreById(id : number) : Observable<Store>{
  return this._http.get<Store>( ApiConfig.Apiurl2+ "SC/Store/GetStoreByID/?id="+id);
}
public getAccountsLKP(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>
{
  return this._http.get<PageResult>(ApiConfig.Apiurl2+ `SC/Store/getAccountsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`)
}

public getAccounts(): Observable<any[]>
{
  return this._http.get<any[]>(ApiConfig.Apiurl2+ `SC/Store/getAccounts`);
}

LoadStoreConfiguration(): Observable<any>
{
  return this._http.get<any>( ApiConfig.Apiurl2+ "SC/Store/LoadStoreConfiguration");
}
}
