import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class BranchConfigService {

  constructor(private _http : HttpClient, private userservice:UserService) {
  }
  Save(formdata: any):Observable<any>{

    return  this._http.post(ApiConfig.Apiurl2+"sys/BranchConfig/Create",formdata);
  }
  GetAllBranchConfig(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{

    return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `sys/BranchConfig/GetAllBranches/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
  }
  Delete(id : number):Observable<any>{
    var formData: any = new FormData();
    formData.append("n_branch_id", id);
    return  this._http.post(ApiConfig.Apiurl2+"sys/BranchConfig/Delete",formData );
  }
  Update(formdata:any):Observable<any>
  {
    return  this._http.post<any>(ApiConfig.Apiurl2+"sys/BranchConfig/Edit",formdata);

  }
  GetByID(id):Observable<any>
  {

       return this._http.get<any>(ApiConfig.Apiurl2+"sys/BranchConfig/GetByID?id="+id );
  }
  SuppliersTypes(value:any)
  {
    debugger;

    return this._http.get<any>(` ${ApiConfig.Apiurl2}AP/Supplier/SuppliersTypes/?str=${value}`);
  }
  SearchCustomer(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchCustomer?str=${value}`)
  }
  SearchCustomerAcc(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchCustomerAcc?str=${value}`)
  }
  SearchStores(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchStores?str=${value}`)
  }
  SearchCashes(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchCashes?str=${value}`)
  }
  SearchCreditTypes(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchCreditTypes?str=${value}`)
  }
  SearchSeller(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchSeller?str=${value}`)
  }
  SearchCostCenter(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchCostCenter?str=${value}`)
  }
  SearchAllSupplier(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchAllSupplier?str=${value}`)
  }
  SearchSupplierACC(value:any ){
    return this._http.get<any>(`${ApiConfig.Apiurl2}sys/BranchConfig/SearchSupplierACC?str=${value}`)
  }

}
