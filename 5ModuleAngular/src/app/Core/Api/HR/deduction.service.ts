import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { PageResult } from 'src/app/_model/Items/PageResult';


@Injectable({
  providedIn: 'root'
})
export class DeductionService {

  constructor(private _httpClient: HttpClient) { }



  GetByID(id: number): Observable<any>
  {
    return this._httpClient.get<any>(`${ApiConfig.Apiurl2}HR/Deduction/GetByID/?id=${id}`);
  }

  Create(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Deduction/Create`, formData);
  }

  Edit(formData: any): Observable<any>
  {
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Deduction/Edit`, formData);
  }

  Delete(id: any): Observable<any>
  {
    var formData: any = new FormData();
    formData.append('n_deduction_id', id);
    return this._httpClient.post(`${ApiConfig.Apiurl2}HR/Deduction/Delete`, formData);
  }
  GetAllDeduction(deductionId: number = 0, deductionNameAr: string = "", deductionNameEn: string ="", discountFrom: string = "", calcType: string = ""): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deduction/GetAllDeductions/?deductionId=${deductionId}&deductionNameAr=${deductionNameAr}&deductionNameEn=${deductionNameEn}&discountFrom=${discountFrom}&calcType=${calcType}`);
  }

  GetEmpPayments(value:any): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deduction/GetEmpPayments?search=${value}`);
  }
  GetDeCCat(value:any): Observable<Array<any>>
  {
    return this._httpClient.get<Array<any>>(`${ApiConfig.Apiurl2}HR/Deduction/GetDeCCat?search=${value}`);
  }
  GetAllownces(pageNumber: number, pageSize: number, searchString: string = ""):Observable<PageResult>{
    return this._httpClient.get<PageResult>(`${ApiConfig.Apiurl2}HR/Deduction/AllAllowances/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }
  AllDeductionAllowances():Observable<any []>{
    return this._httpClient.get<any []>(`${ApiConfig.Apiurl2}HR/Deduction/AllDeductionAllowances`);
  }



}
