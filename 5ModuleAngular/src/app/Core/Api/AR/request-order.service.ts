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
export class RequestOrderService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }
  CurrentAccount:string='';

  GetAllRequests(DocNo:number=0,DocDate:string='',TypeName:string='',CustomerName:string='',SalesMan:string='', EmployeeName:string='',Description:string='' ):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2}AR/RequestOrder/GetAllRequests/?docNo=${DocNo}&docDate=${DocDate}&invoiceType=${TypeName}&customerName=${CustomerName}&salesMan=${SalesMan}&employeeName=${EmployeeName}&description=${Description}`);
  }
  
  GetRequestByID(id : number, dataArea: number) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2 + "AR/RequestOrder/GetRequestByID/?docNo="+id+"&dataArea="+dataArea);
  }

  Save(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"AR/RequestOrder/Create",formdata);
  }

  SaveEdit(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"AR/RequestOrder/Edit",formdata);
  }

  DeleteRequest(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_document_no", id);
    return  this._http.post(ApiConfig.Apiurl2+"AR/RequestOrder/Delete",formData );
  }

  ExportRequests(DocNo:number=0,DocDate:string='',InvoiceType:string='',CustomerName:string='',SalesmanName:string='',EmployeeName:string='',Description:string='' ){ 
    this._http.get(`${ApiConfig.Apiurl2}AR/RequestOrder/ExportInvoices/?docNo=${DocNo}&docDate=${DocDate}&invoiceType=${InvoiceType}&customerName=${CustomerName}&salesMan=${SalesmanName}&employeeName=${EmployeeName}&description=${Description}`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'RequestOrders.xlsx', {
         type: 'text/plain;charset=windows-1252' 
      });
      $('#excelBTN').prop('disabled', false);
   });
  }
  
  GetStores(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/RequestOrder/GetStores/?search="+nameSearch);
  }

  GetCostCenters(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/RequestOrder/GetCostCenters/?search="+nameSearch);
  }

  GetCurrencies():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/RequestOrder/GetCurrencies");
  }

  GetCustomers(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/RequestOrder/GetCustomers/?search="+nameSearch);
  }

  GetSalesMen(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/RequestOrder/GetSalesMen/?search="+nameSearch);
  }

  GetItemName(itemNo : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/RequestOrder/GetItemName/?itemNo="+itemNo);
  }

  GetUnits(itemNo : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetUnits/?itemNo="+itemNo);
  }

  GetMainCurrency():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetMainCurrency");
  }

  GetTransSource():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetTransSource");
  }

  GetTaxStatus(customerNo : any, itemNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetTaxStatus/?customerID="+customerNo+"&itemCode="+itemNo);
  }

  GetUnitName(ItemNo : any, UnitNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetUnitName/?itemNo="+ItemNo+"&unitID="+UnitNo);
  }

  GetAccountName(AccNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetAccountName/?accountNo="+AccNo);
  }

  GetCostName(CostNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetCostName/?costNo="+CostNo);
  }

  GetEmployees(EmpNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetEmployees/?search="+EmpNo);
  }

  GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}LKP/TransactionSourceTypeLKP/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
  }

  GetTransportTypes():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetTransportTypes");
  }

  GetSalesMan(id:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/RequestOrder/GetSalesMan/?id="+id);
  }
  
}
