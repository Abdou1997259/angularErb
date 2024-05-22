import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "src/app/_Services/user.service";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { PageResult } from 'src/app/_model/Items/PageResult';
@Injectable({
    providedIn: 'root'
  })
  export class itemsLookup
  {
    constructor(private _http : HttpClient,private userservice:UserService ) {

    }

    
   get(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>{
    debugger;
    return  this._http.get<PageResult>( ApiConfig.Apiurl2+ `LKP/ItemLookUp/GetItemsLKP/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}` );
  }

  }