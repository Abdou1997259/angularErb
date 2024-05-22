import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "src/app/_Setting/ApiConfig";

@Injectable({
    providedIn:"root"
})
export class GeneralSC{
    constructor(private _HTTP:HttpClient)
    {


    }
    public GetLastCost(item:string ,date:string ,store:number):Observable<number>
    {
        return this._HTTP.get<number>(ApiConfig.Apiurl2+`SC/GeneralSc/GetLastCost?item=${item}&&date=${date}&&storeID=${store}`)
    }
    public GetItemLastCostByDate(item:string ,date:string):Observable<number>
    {
        return this._HTTP.get<number>(ApiConfig.Apiurl2+`SC/GeneralSc/GetItemLastCostByDate?item=${item}&&date=${date}`)
    }
    public YearExisted(year:string)
    {
        return this._HTTP.get<boolean>(ApiConfig.Apiurl2+`SC/GeneralSc/YearExisted?year=${year}`);
    }

}
