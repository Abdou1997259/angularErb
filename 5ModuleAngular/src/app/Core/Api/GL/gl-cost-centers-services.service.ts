import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class GlCostCentersServicesService {

  constructor(private _http : HttpClient, private userservice: UserService) { }

  GetAllGlCostCenters(){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/GlCostCenters/GetAllCostCenters`);
  }

  GetCostCenterInfo(s_cost_center_id: string){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/GlCostCenters/GetCostCenterInfo?s_cost_center_id=${s_cost_center_id}`);
  }

  GetAccountsTypes(){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/AccountListTree/GetAccountsTypes`);
  }

  GetGlCostCentersClass(){
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/GlCostCenters/GetGlCostCentersClass`);
  }

  DeleteCostCenter(id: string) : Observable<any> {
    var formData = new FormData;
    formData.append('s_cost_center_id', id);
    return  this._http.post( ApiConfig.Apiurl2+"GL/GlCostCenters/Delete",formData);
  }

  SaveCostCenter( formdata :any):Observable<any>{
    return  this._http.post( ApiConfig.Apiurl2+"GL/GlCostCenters/Create",formdata);
  }

  EditCostCenter(formdata :any):Observable<any>{
    return  this._http.post( ApiConfig.Apiurl2+"GL/GlCostCenters/Edit",formdata);
  }

  GetGlCostCentersLookUp(page:number=1,pagesize:number=5,keyword:string='') : Observable<PageResult>{
    return this._http.get<PageResult>( ApiConfig.Apiurl2+ `GL/GlCostCenters/GetCostCentersLookUp?page=${page}&pageSize=${pagesize}&KeyWord=${keyword}`);
  }

  GetNewGlCostCenterID(s_cost_center_id: string) :Observable<any>{
    return this._http.get<any[]>(ApiConfig.Apiurl2+`GL/GlCostCenters/GetNewGlCostCenterID?s_cost_center_id=${s_cost_center_id}`);
  }

  GetNextBaseCostCenterData(): Observable<any>
  {
    return this._http.get<any>(ApiConfig.Apiurl2+`GL/GlCostCenters/GetNextBaseCostCenterData`);
  }

  CheckIfCostCenterHasChilds(costCenterNo: string): Observable<any>
  {
    return this._http.get<any>(ApiConfig.Apiurl2+`GL/GlCostCenters/CheckIfCostCenterHasChilds/?costCenterNo=${costCenterNo}`);
  }
}
