import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { items } from 'src/app/_model/Items/item';
import { ItemsLkp } from 'src/app/_model/Items/ItemsLkp';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private _http : HttpClient) { }
 
  GetAll() : Observable<Array<items>>{ 
    return this._http.get<Array<items>>( ApiConfig.Apiurl+ "items/GetAll" );
  }

  GetById(id : number) : Observable<items>{ 
    return this._http.get<items>( ApiConfig.Apiurl+ "items/GetByID?id="+id);
  }

  Save(formdata: any):Observable<any>{   
    return  this._http.post( ApiConfig.Apiurl+ "items/create",formdata);
  }

  GetItemsLkp(keyword:string='', pageNumber: number, pageSize: number ) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2+ `AP/PurchaseInvoice/GetItems/?search=${keyword}&&pageNumber=${pageNumber}&&pageSize=${pageSize}`);
  }

  GetSalesItemsLkp(keyword:string='', pageNumber: number, pageSize: number, store: number ) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2+ `AR/SalesInvoice/GetItems/?search=${keyword}&&pageNumber=${pageNumber}&&pageSize=${pageSize}&&store=${store}`);
  }

  GetQuotationItems(keyword:string='', pageNumber: number, pageSize: number) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2+ `LKP/ItemLookUp/GetQuotationItems/?search=${keyword}&&pageNumber=${pageNumber}&&pageSize=${pageSize}`);
  }
}