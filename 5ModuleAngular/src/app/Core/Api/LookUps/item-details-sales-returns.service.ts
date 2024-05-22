import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/_model/Items/PageResult';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailsSalesReturnsService {

  constructor(private _httpClient: HttpClient) { }

  GetItemDetailsSalesReturn(pageNumber: number = 0, pageSize: number = 0, itemId: string = "", itemName: string = "", unitId: number = 0, unitName: string = ""): Observable<PageResult>
  {
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}AR/SalesReturnes/GetItemDetailsSalesReturn/?pageNumber=${pageNumber}&pageSize=${pageSize}&itemId=${itemId}&itemName=${itemName}&unitId=${unitId}&unitName=${unitName}`);
  }
}
