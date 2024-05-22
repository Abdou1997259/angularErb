import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from 'src/app/Core/model/LookUp/PageResult';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class RevenueMultiService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }
  CurrentAccount:string='';

  Save(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"Fin/RevenueMulti/Create",formdata);
  }

  SaveEdit(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"Fin/RevenueMulti/Edit",formdata);
  }

  GetAll(DocNo:number=0,DocSerial:number=0, DocDate:string='',CurrencyName:string='',Description:string='',Total:string=''):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2}Fin/RevenueMulti/GetAllRevenues/?docNo=${DocNo}&serialNo=${DocSerial}&docDate=${DocDate}&currencyName=${CurrencyName}&description=${Description}&total=${Total}`);
  }

  GetByID(id : number, dataArea: number) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2 + "Fin/RevenueMulti/GetDataByID/?docNo="+id+"&dataArea="+dataArea);
  }

  Delete(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_doc_no", id);
    return  this._http.post(ApiConfig.Apiurl2+"Fin/RevenueMulti/Delete",formData );
  }

  GetCostCenters(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"Fin/RevenueMulti/GetCostCenters/?search="+nameSearch);
  }

  GetCurrencies():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"Fin/RevenueMulti/GetCurrencies");
  }

  GetMainCurrency():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetMainCurrency");
  }

  GetDebitTypes():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetDebitTypes");
  }

  GetCreditTypes():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetCreditTypes");
  }

  GetDebitItems(type:number=0, search :string=''):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetDebitItems/?type="+type+"&search="+search);
  }

  GetCreditItems(type:number=0, search :string=''):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetCreditItems/?type="+type+"&search="+search);
  }

  GetEmployees(search :string=''):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetEmployees/?search="+search);
  }

  GetSalesMen(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"Fin/RevenueMulti/GetSalesMen/?search="+nameSearch);
  }


  ExportRevenues(DocNo:number=0,DocSerial:number=0, DocDate:string='',CurrencyName:string='',Description:string='',Total:string=''){ 
    this._http.get(`${ApiConfig.Apiurl2}Fin/RevenueMulti/ExportRevenue/?docNo=${DocNo}&serialNo=${DocSerial}&docDate=${DocDate}&currencyName=${CurrencyName}&description=${Description}&total=${Total}`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'Revenues Multi.xlsx', {
         type: 'text/plain;charset=windows-1252' 
      });
      $('#excelBTN').prop('disabled', false);
   });
  }


  GetJournalID(docNo : any, typeNo:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
  }

  GetSavedJournals(docNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetSavedJournals/?id="+docNo);
  }
  
  GetCurrentJournals(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"Fin/RevenueMulti/GetCurrentJournals",formdata);
  }

  GetTransferTypes():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"Fin/RevenueMulti/GetTransferTypes");
  }

  GetCardTypes():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"Fin/RevenueMulti/GetCardTypes");
  }

  GetVatCategory():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"Fin/RevenueMulti/GetVatCategory");
  }

  GetCostName(CostNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetCostName/?costNo="+CostNo);
  }

  GetSourceName(type : any, sourceID: any, search: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Fin/RevenueMulti/GetSourceName/?type="+type+"&sourceID="+sourceID+"&search="+search);
  }
}
