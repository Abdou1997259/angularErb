import { Injectable } from '@angular/core';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }

  //---------------------------------------AR--------------------------------------
  GetARSalesTotal():Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetTotalSales`);
  }
  
  GetARSalesReturnTotal() : Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetTotalReturnSales`);
  }

  GetARCountCustomers() : Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetCountCustomers`);
  }

  GetARTopSalesmen() : Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetTopSalesmen`);
  }

  GetARMonthSales() : Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetMonthSales`);
  }


  //---------------------------------------AP--------------------------------------
  GetAPTotalPurchases():Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetTotalPurchases`);
  }
  
  GetAPTotalReturnPurchases() : Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetTotalReturnPurchases`);
  }

  GetAPMonthlyPurchases() : Observable<any>{ 
    return this._http.get( `${ApiConfig.Apiurl2}DB/Dashboard/GetMonthlyPurchases`);
  }

}
