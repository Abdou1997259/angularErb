import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  constructor(private _http:HttpClient) { }

  GetByID(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/PriceList/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/PriceList/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._http.post<any>(`${ApiConfig.Apiurl2}AR/PriceList/Edit`, formData);
  }

  Delete(n_doc_no: any): Observable<any>
  {
    var formData = new FormData();
    formData.append('n_doc_no', n_doc_no);
    return this._http.post(`${ApiConfig.Apiurl2}AR/PriceList/Delete`, formData);
  }

  GetSalersLKP(pageNumber: number, pageSize: number, menuId: number = 0, menuName: string = "", startDate: string = "", endDate: string = ""): Observable<PageResult>
  {
    return this._http.get<PageResult>(`${ApiConfig.Apiurl2}AR/PriceList/GetPriceListLKP/?pageNumber=${pageNumber}&pageSize=${pageSize}&menuId=${menuId}&menuName=${menuName}&startDate=${startDate}&endDate=${endDate}`);
  }

  GetPricePerUnit(unitID:any,itemId:any): Observable<number>
  {
    return this._http.get<number>(`${ApiConfig.Apiurl2}AR/PriceList/GetPricePerUnit/?unitId=${unitID}&&itemId=${itemId}`);
  }
  getById(id:any)
  {
    return  this._http.get<any>(`${ApiConfig.Apiurl2}AR/PriceList/GetByID/?id=${id}`);
  }

  GetTypes(itemName: string = ""): Observable<Array<any>>
  {
    return  this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/PriceList/GetTypes/?itemName=${itemName}`);
  }

  GetItemGroups()
  {
    return  this._http.get<any>(`${ApiConfig.Apiurl2}AR/PriceList/GetItemGroups`);
  }

  itemWithUnits(){
    return this._http.get<any []>(`${ApiConfig.Apiurl2}AR/PriceList/ItemWithUnits`)
  }

  LoadItemsDetails(itemType: number = 0, itemGroup: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}AR/PriceList/LoadItemsDetails/?itemType=${itemType}&itemGroup=${itemGroup}`);
  }

  GetItemById(itemId: string = ''): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/PriceList/GetItemById/?itemId=${itemId}`);
  }

  GetUnitById(unitId: number = 0, itemId: string = ''): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}AR/PriceList/GetUnitById/?unitId=${unitId}&itemId=${itemId}`);
  }
}
