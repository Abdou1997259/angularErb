import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { UserService } from 'src/app/_Services/user.service';


@Injectable({
  providedIn: 'root'
})
export class StocktackingService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }

  GetAll(docNo:number=0, date:string='', store:string='', description:string=''):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2}SC/StockTacking/GetAll/?docNo=${docNo}&date=${date}&store=${store}&description=${description}`);
  }

  GetByID(docNo:number=0):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2}SC/StockTacking/GetData/?docNo=${docNo}`);
  }

  Delete(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_document_no", id);
    return  this._http.post(ApiConfig.Apiurl2+"SC/StockTacking/Delete",formData );
  }

  Save(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"SC/StockTacking/Create",formdata);
  }

  SaveEdit(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"SC/StockTacking/Edit",formdata);
  }

  GetMainCurrency():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/StockTacking/GetMainCurrency");
  }

  GetCurrencies():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/GetCurrencies");
  }

  GetStores(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/GetStores/?search="+nameSearch);
  }

  GetCostCenters(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/GetCostCenters/?search="+nameSearch);
  }

  GetUnits(itemNo : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/StockTacking/GetUnits/?itemNo="+itemNo);
  }

  GetItemName(itemNo : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/GetItemName/?itemNo="+itemNo);
  }

  GetUnitName(ItemNo : any, UnitNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/StockTacking/GetUnitName/?itemNo="+ItemNo+"&unitID="+UnitNo);
  }

  GetCostName(CostNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/StockTacking/GetCostName/?costNo="+CostNo);
  }

  GetGroups(name : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/StockTacking/GetGroups/?name="+name);
  }
  
  GetItemTypes(name : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/StockTacking/GetItemTypes/?name="+name);
  }

  LoadItems(id : any, date:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/StockTacking/LoadItems/?storeID="+id+"&dateTo="+date);
  }

  CheckIsPosted(id : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/CheckIsPosted/?docNo="+id);
  }

  Post(id : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/Post/?docNo="+id);
  }

  UnPost(id : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/UnPost/?docNo="+id);
  }

  GetItemLastCost(id : string, date: any, store: any):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"SC/StockTacking/GetItemLastCost/?itemNo="+id+"&docDate="+date+"&storeNo="+store);
  }
}
