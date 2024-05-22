import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';


@Injectable({
  providedIn: 'root'
})
export class SuppliercatService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }
  Save(formdata: any):Observable<any>{
    debugger
      return  this._http.post(ApiConfig.Apiurl2+"AP/SupplierCat/Create",formdata);
    }
    GetAllSupplierCat(pageNumber: Number, pageSize: Number, typeId: number = 0, typeName: string = ''):Observable<PageResult>{
      debugger;

      return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `AP/SupplierCat/GetAllSupplierCat/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&typeId=${typeId}&&typeName=${typeName}` );


    }
    Delete(id : number):Observable<any>{
      var formData: any = new FormData();
      formData.append("n_id", id);
      return  this._http.post(ApiConfig.Apiurl2+"AP/SupplierCat/Delete",formData );
    }
    Update(formdata:any):Observable<any>
    {
      return  this._http.post<any>(ApiConfig.Apiurl2+"AP/SupplierCat/Edit",formdata);

    }
    GetByID(id)
    {
      debugger
         return this._http.get(ApiConfig.Apiurl2+"AP/SupplierCat/GetByID?id="+id );
    }
}
