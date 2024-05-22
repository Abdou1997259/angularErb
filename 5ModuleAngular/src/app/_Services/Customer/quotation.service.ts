import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  
  constructor(private _http : HttpClient,private _userService : UserService) { }

  getAll():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl+ "PressQuotations/GetAllQuotations");
  }


  GetById(id :number ):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl+ "PressQuotations/GetByID?id="+id);
  }

  ExecuteItem(n_Quotation_serial: number , n_Quotation_no : number) :Observable<any>{  
    var formData: any = new FormData();
    formData.append("n_Quotation_serial", n_Quotation_serial);
    formData.append("n_Quotation_no", n_Quotation_no);
 
    return  this._http.post( ApiConfig.Apiurl+ "PressQuotations/ExecuteItem",formData);
  }


   

  GetStatusCombo():Observable<any>{ 
    return  this._http.get<any>( ApiConfig.Apiurl+ "PressQuotations/GetStatusCombo");
  }


  getWorkOrders(filter:any):Observable<any>{ 
    return  this._http.post<any>( ApiConfig.Apiurl+ "PressQuotations/GetWorkOrderInfo",filter);
  }


}
