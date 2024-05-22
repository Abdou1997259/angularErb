import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/_Services/user.service';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
    providedIn: 'root'
  })
  export class Supplier
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }
    Save(formdata: any):Observable<any>{

        return  this._http.post(ApiConfig.Apiurl2+"AP/Supplier/Create",formdata);
      }
      GetAllSupplierType(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{

        return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `AP/Supplier/GetAllSupplier/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
      }
      Delete(id : number):Observable<any>{
        var formData: any = new FormData();
        formData.append("n_supplier_id", id);
        return  this._http.post(ApiConfig.Apiurl2+"AP/Supplier/Delete",formData );
      }
      Update(formdata:any):Observable<any>
      {
        return  this._http.post<any>(ApiConfig.Apiurl2+"AP/Supplier/Edit",formdata);

      }
      GetByID(id):Observable<any>
      {

           return this._http.get<any>(ApiConfig.Apiurl2+"AP/Supplier/GetByID?id="+id );
      }

      GetSupplierClasses()
      {

           return this._http.get(ApiConfig.Apiurl2+"AP/Supplier/GetSupplierClasses");
      }

      GetClassification(str: string = "")
      {

           return this._http.get(ApiConfig.Apiurl2+"AP/Supplier/GetClassification/?str=" + str);
      }
      getSupplierTypes():Observable<any[]>
      {
         return this._http.get<any []>(ApiConfig.Apiurl2+"AP/Supplier/getSupplierTypes")
      }
      getPurchaseMan()
      {
        return this._http.get(ApiConfig.Apiurl2+"AP/Supplier/getPurchaseMan" );
      }
     
      getSerachPurchase()
      {
        return this._http.get(ApiConfig.Apiurl2+"AP/Supplier/getPurchaseMan" );
      }
      getPurchaseManLKP():Observable<any[]>
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getPurchaseManLKP" );
      }
      getareaLKP():Observable<any[]>
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getAreaLKP" );
      }
      getCommissionLKP():Observable<any[]>
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getCommissionLKP" );
      }
      getBranchesL():Observable<any[]>
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getBranchesL" );
      }
      getBranchesSerach(name,id):Observable<any[]>
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getSearchBranches?name="+name+ "&&id="+id );
      }
      getAreaSerach(name,id):Observable<any[]>
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getAreaSearch?name="+name+ "&&id="+id );
      }
      getPurchaseSearch(name,id)
      {
       return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getSerachPurchase?name="+name+ "&&id="+id );
      }
      getCommissionSearch(name,id)
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/getCommissionSearch?name="+name+ "&&id="+id );
      }
      PurchaseEmp(value)
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/PurchaseEmp?str="+value );
      }
      SearchCommission(value)
      {
        return this._http.get<any [] >(ApiConfig.Apiurl2+"AP/Supplier/SearchCommission/?str="+value );
      }
      SuppliersTypes(value:any)
      {
        debugger;
    
        return this._http.get<any>(` ${ApiConfig.Apiurl2}AP/Supplier/SuppliersTypes/?str=${value}`);
      }
      SearchArea(value)
      {
        return this._http.get<any>(ApiConfig.Apiurl2+"AP/Supplier/SearchArea/?str="+value );
      }
      SearchBranch(value)
      {
        return this._http.get<any >(ApiConfig.Apiurl2+"AP/Supplier/SearchBranch/?str="+value );
      }


  }
