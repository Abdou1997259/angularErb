import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  constructor(private _http : HttpClient,private _userService : UserService) { }

  getAllSalesOrders():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl+ "SalesInvoice/GetAllSalesOrders");
  }


  GetSalesById(id :number ):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl+ "SalesInvoice/GetByID?id="+id);
  }
  SaveSalesOrder(formdata: any):Observable<any>{ 
      
    return  this._http.post( ApiConfig.Apiurl+ "SalesInvoice/CreateSalesOrder",formdata);
  }
 

  
}
