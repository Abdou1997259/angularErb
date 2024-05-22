import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from "src/app/_model/Items/PageResult";


@Injectable({
    providedIn:'root'
})
export class BankBranch{
    constructor(private _http:HttpClient)
    {

    }
  create(formData:any):Observable<any>
  {
    return this._http.post(`${ApiConfig.Apiurl2}Fin/BankBranch/Create`,formData)

  }
  GetAllBankBranches(pageNumber: number, pageSize: number, searchString: string = ""): Observable<PageResult>
   {
     return this._http.get<PageResult>(`${ApiConfig.Apiurl2}Fin/BankBranch/GetAllBankBranchcs/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
   }
  Delete(n_bank_branch_id:any)
  {
    var formData = new FormData();
    formData.append('n_bank_branch_id', n_bank_branch_id);
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/BankBranch/Delete`, formData)

  }
  getallBanks(search:any)
  {
    return this._http.get<any[]>(`${ApiConfig.Apiurl2}Fin/BankBranch/GetAll2?search=${search}`);

  }
  Edit(formData):Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}Fin/BankBranch/Edit`,formData);

  }
  GetByID(id:number):Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Fin/BankBranch/GetByID?id=${id}`)

  }

  
}