import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "src/app/_Services/user.service";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
    providedIn: 'root'
  })
  export class GenerealLookup
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }

    
   getItemsLKP(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{
    return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `LKP/ItemLookUp/GetItemsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
  }
   
  GetItemPriceList(pageNumber: Number, pageSize: Number, searchString: string = ''): Observable<PageResult>{
    return this._http.get<PageResult>( ApiConfig.Apiurl2+ `LKP/ItemLookUp/GetItemPriceList/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
  }

  getUnitsLKP(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{
    debugger;
    return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `LKP/UnitLookUp/GetUnitLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
  }
  getStoreLKP(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{
    debugger;
    return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `LKP/StoreLookUp/GetStoreLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
  }

getStores():Observable<any []>
{
  return this._http.get<any []>( ApiConfig.Apiurl2+ `LKP/StoreLookUp/getStores`)
}
getItems():Observable<any []>
{
  return this._http.get<any []>( ApiConfig.Apiurl2+ `LKP/ItemLookUp/getItems`)
}
getUnits():Observable<any []>
{
  return this._http.get<any[]>( ApiConfig.Apiurl2+ `LKP/UnitLookUp/getUnit`)
}
getAcounts():Observable<any >
{
  return this._http.get<any[]>( ApiConfig.Apiurl2+ `LKP/JournalLKP/getAcounts`)
}
getSupplierTypesLKP():Observable<any [] >
{
  return this._http.get<any []>(ApiConfig.Apiurl2+ `LKP/SuppliersTypesLKP/GetSuppliersTypes`)
}
getAcountSerach(searchName,searchID)
{
  return this._http.get<any[]>( ApiConfig.Apiurl2+ `LKP/JournalLKP/getTopFivtyAcounts?name=${searchName}&&id=${searchID}`)
}
getTypesSerach(searchName,searchID)
{
  return this._http.get<any[]>(ApiConfig.Apiurl2+ `LKP/SuppliersTypesLKP/getFiftySupplierTypeSearch?name=${searchName}&&id=${searchID}`)
}
getBranchesSearch(searchName,searchID)
{
  return this._http.get<any[]>(ApiConfig.Apiurl2+ `LKP/SuppliersTypesLKP/getFiftySupplierTypeSearch?name=${searchName}&&id=${searchID}`)
}
getStoreSearch(searchName,searchID)
{
  return this._http.get<any[]>(ApiConfig.Apiurl2+ `LKP/StoreLookUp/getStoresSearch?name=${searchName}&&id=${searchID}`)
}
getSupplierSearch(searchName,searchID)
{
 
  return this._http.get<any[]>(ApiConfig.Apiurl2+ `LKP/SuppliersLKP/getSupplierSearch?name=${searchName}&&id=${searchID}`)

}
getDirSearch(searchName,searchID)
{
  return this._http.get<any[]>(`${ ApiConfig.Apiurl2 }LKP/SearchSuppliersAccDirLKP/getDirSearch?name=${searchName}&&id=${searchID}`);

}
getSearchItems(searchName,searchID)
{
  return this._http.get<any[]>(`${ ApiConfig.Apiurl2 }LKP/ItemLookUp/getSearchItems?name=${searchName}&&id=${searchID}`);

}
getSearchUnit(searchName,searchID)
{
  return this._http.get<any[]>(`${ ApiConfig.Apiurl2 }LKP/UnitLookUp/getSearchUnit?name=${searchName}&&id=${searchID}`);

}
getSearchCustromers(searchName,searchID)
{
  return this._http.get<any[]>(`${ ApiConfig.Apiurl2 }AR/SalesReturnes/getSearchCustomers?name=${searchName}&&id=${searchID}`);

}
getSearchSalesMen(searchName,searchID)
{
  return this._http.get<any[]>(`${ ApiConfig.Apiurl2 }AR/SalesReturnes/getSearchSalesMen?name=${searchName}&&id=${searchID}`);
}
  }