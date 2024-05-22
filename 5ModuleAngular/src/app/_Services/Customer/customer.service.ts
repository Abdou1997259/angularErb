import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { customer } from 'src/app/_model/Cutomer/CustomerModel';
import { CustomerProcVM } from 'src/app/_model/Cutomer/CustomerProcVM';
import { PageResult } from 'src/app/_model/Items/PageResult';
 
 import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { UserService } from '../user.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private _http : HttpClient,private _userService : UserService) { }

  GetTaxesTypes() : Observable<Array<any>>{ 
    return this._http.get<Array<any>>( ApiConfig.Apiurl+ "Customers/GetTaxesTypes");
  }

  GetAllCustomer() : Observable<Array<customer>>{ 
    return this._http.get<Array<customer>>( ApiConfig.Apiurl+ "Customers/GetCustomers" );
  }
  GetById(id : number) : Observable<customer>{ 
    return this._http.get<customer>( ApiConfig.Apiurl+ "Customers/GetCustomersByID?id="+id);
  }
  SaveCustomer(formdata: any):Observable<any>{ 
      
    return  this._http.post( ApiConfig.Apiurl+ "Customers/CreateCustomers",formdata);
  }

  

  DeleteCustomer(custid: number):Observable<any>{  
    var formData: any = new FormData();
    formData.append("id", custid);
    return  this._http.post( ApiConfig.Apiurl+ "Customers/DeletCustomer",formData);
  }


  
  GetAllCustomerProcedures(id : number) : Observable<Array<CustomerProcVM>>{  
    return this._http.get<Array<CustomerProcVM>>(  ApiConfig.Apiurl+"Customers/GetCustomersProcedures?id="+id);
  }

  SaveProcedure(formdata: any):Observable<any>{ 
    return  this._http.post( ApiConfig.Apiurl+ "Customers/CreateProcedure",formdata);
  }

  ConfirmCustomer(custid: number):Observable<any>{  
    var formData: any = new FormData();
    formData.append("id", custid);
    formData.append("user_id", this._userService.GetUserID());

 
    return  this._http.post( ApiConfig.Apiurl+ "Customers/ConfirmCustomer",formData);
  }


  GetCustomersLkp(page:number=1,pagesize:number=5,keyword:string='' ) : Observable<PageResult>{ 
    return this._http.get<PageResult>( ApiConfig.Apiurl+ "Customers/GetCustomersLkp?page="+page+'&pageSize='+ pagesize+"&KeyWord="+keyword);
  }

  

}
