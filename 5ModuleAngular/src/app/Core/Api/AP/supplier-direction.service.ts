import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "src/app/_Services/user.service";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from 'src/app/_model/Items/PageResult';
@Injectable({
    providedIn: 'root'
  })
  export class SupplierDirection
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }
  Save(formdata: any):Observable<any>{ 
      debugger  
        return  this._http.post(ApiConfig.Apiurl2+"AP/SupplierDirection/CreateNew",formdata);
   }
   GetByID(id):Observable<any[]>
   {
    return this._http.get<Array<any>>(ApiConfig.Apiurl2+"AP/SupplierDirection/GetDirByID?id="+id)
   }
   GetALL():Observable<any[]>
   {
    return this._http.get<Array<any>>(ApiConfig.Apiurl2+"AP/SupplierDirection/GetAll")
   }
   Delete(docNo: number): Observable<any>
   {
    debugger
    var formData: any = new FormData();
    formData.append("n_acc_dir_no", docNo);
   
     return this._http.post<any>(ApiConfig.Apiurl2+"AP/SupplierDirection/Delete" , formData)
   }
   GetAllDirType(pageNumber: number, pageSize: number, searchString: string = ''): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AP/SupplierDirection/GetAllDirType/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }
  Update(formdata:any):Observable<any>
  {
    return  this._http.post<any>(ApiConfig.Apiurl2+"AP/SupplierDirection/EditNew",formdata);

  }

  }