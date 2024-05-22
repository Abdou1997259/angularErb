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
export class ItemsService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }

  GetItemById(id : number) : Observable<any>{ 
    return this._http.get<any>( ApiConfig.Apiurl2+ "SC/Items/GetItemById/?id="+id);
  }

  getAllItems(ItemNo:string='',ItemName:string='',GroupName:string='',MGroupName:string=''):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetAllItems/?itemID="+ItemNo+"&itemName="+ItemName+"&groupName="+GroupName+"&mGroupName="+MGroupName);
  }

  DeleteItem(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_Id", id);
    return  this._http.post(ApiConfig.Apiurl2+"SC/Items/Delete",formData );
  }

  SaveItem(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"SC/Items/Create",formdata);
  }

  SaveEditItem(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"SC/Items/Edit",formdata);
  }

  GetItemCategories():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemCategories");
  }

  GetMainGroups():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetMainGroups");
  }

  GetGroups(id:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetGroups/?id="+id);
  }

  GetItemTypes():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemTypes");
  }

  GetItemConfig():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemConfig");
  }

  GetItemRelatedSupplier():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemRelatedSupplier");
  }

  GetItemMark():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemMark");
  }

  GetItemOnEye():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemOnEye");
  }

  GetItemDefaultUnit():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemDefaultUnit");
  }

  GetItemUnitMeasure(KeyWord:any, pageNumber: number, pageSize: number):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ `SC/Items/GetItemUnitMeasure/?search=${KeyWord}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  GetItemUnits(KeyWord:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ `SC/Items/GetItemUnits/?search=${KeyWord}`);
  }

  GetItemProductionCompany():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemProductionCompany");
  }

  GetTaxTypes():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetTaxTypes");
  }

  GetItemStores(KeyWord:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemStores?search="+KeyWord);
  }

  GetItemNames(KeyWord:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemNames?search="+KeyWord);
  }

  CheckItemCodeType():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/CheckItemCodeType");
  }

  GetItemCode(KeyWord:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemCode?group="+KeyWord);
  }

  GetUnitName(UnitNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetUnitName/?unitID="+UnitNo);
  }

  LoadScConfiguration(): Observable<any>
  {
    return  this._http.get<any>( ApiConfig.Apiurl2+ "SC/Items/LoadScConfiguration");
  }
  
  GetItemLastPrice(item : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemLastPrice/?id="+item);
  }

  GetItemLastCost(item : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "SC/Items/GetItemLastCost/?id="+item);
  }
}
