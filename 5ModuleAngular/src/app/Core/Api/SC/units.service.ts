import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "src/app/_Services/user.service";
import { ApiConfig } from "src/app/_Setting/ApiConfig";
import { UNIT } from "../../model/SC/units";
import { Observable } from "rxjs/internal/Observable";
import { PageResult } from "src/app/_model/Items/PageResult";






@Injectable({
providedIn:'root'
})
export class UnitsService
{
    constructor(private _http:HttpClient,private user:UserService)
    {

    }
    public getAllUnits():Observable<Array <UNIT>>
    {
       return this._http.get<Array <UNIT>>(ApiConfig.Apiurl2+"SC/Units/getUnits")
    }
    public GetAllUnitsLKP(pageNumber: Number, pageSize: Number, searchString: string = ''):Observable<PageResult>
    {
       return this._http.get<PageResult>(ApiConfig.Apiurl2+`SC/Units/GetAllUnits/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`)
    }

    public createUnit(formData:any):Observable<any>
    {
        return  this._http.post( ApiConfig.Apiurl2+ "SC/Units/createUnit",formData);


    }
    public EditUnit(formData:any):Observable<any>
    {
        return this._http.post(ApiConfig.Apiurl2+"SC/Units/editUnit",formData )
    }
    public DelteUnit( id:number):Observable<any>
    {
      var formData: any = new FormData();
      formData.append("n_unit_id", id);
      return this._http.post(ApiConfig.Apiurl2+"SC/Units/delteUnit", formData)
    }
    public getUnitByID(id:number):Observable<UNIT>
    {
        return this._http.get<UNIT>(ApiConfig.Apiurl2+"SC/Units/getUnitByID?id="+id)
    }
    public getLastUnitID():Observable<number>
    {
    return this._http.get<number>(ApiConfig.Apiurl2+"SC/Units/getTheLastID");
    }

}
