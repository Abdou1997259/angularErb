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
export class SalesInvoiceService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }
  CurrentAccount:string='';

  GetAllInvoices(DocNo:number=0,DocDate:string='',TypeName:string='',CustomerName:string='',SalesMan:string='',Description:string='' ):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2}AR/SalesInvoice/GetAllInvoices/?docNo=${DocNo}&docDate=${DocDate}&invoiceType=${TypeName}&customerName=${CustomerName}&salesMan=${SalesMan}&description=${Description}`);
  }
  
  GetInvoiceByID(id : number, dataArea: number) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2 + "AR/SalesInvoice/GetInvoiceByID/?docNo="+id+"&dataArea="+dataArea);
  }

  Save(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"AR/SalesInvoice/Create",formdata);
  }

  SaveEdit(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"AR/SalesInvoice/Edit",formdata);
  }

  DeleteInvoice(id : number, type: number, sourceType: number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_document_no", id);
    formData.append("n_invoice_type_id", type);
    formData.append("n_trans_source_no", sourceType);
    return  this._http.post(ApiConfig.Apiurl2+"AR/SalesInvoice/Delete",formData );
  }

  ExportInvoices(DocNo:number=0,DocDate:string='',InvoiceType:string='',CustomerName:string='',SalesmanName:string='',Description:string='' ){ 
    this._http.get(`${ApiConfig.Apiurl2}AR/SalesInvoice/ExportInvoices/?docNo=${DocNo}&docDate=${DocDate}&invoiceType=${InvoiceType}&customerName=${CustomerName}&salesMan=${SalesmanName}&description=${Description}`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'SalesInvoices.xlsx', {
         type: 'text/plain;charset=windows-1252' 
      });
      $('#excelBTN').prop('disabled', false);
   });
  }
  
  GetStores(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetStores/?search="+nameSearch);
  }

  GetCostCenters(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetCostCenters/?search="+nameSearch);
  }

  GetInvoiceTypes():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetInvoiceTypes");
  }

  GetCurrencies():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetCurrencies");
  }

  GetCustomers(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetCustomers/?search="+nameSearch);
  }

  GetSalesMen(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetSalesMen/?search="+nameSearch);
  }


  GetAccDir():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetDir");
  }

  GetItemName(itemNo : string, store: any):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AR/SalesInvoice/GetItemName/?itemNo="+itemNo+"&&store="+store);
  }

  GetUnits(itemNo : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetUnits/?itemNo="+itemNo);
  }

  GetMainCurrency():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetMainCurrency");
  }

  GetTransSource():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetTransSource");
  }

  GetExpenses(nameSearch : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetExpenses/?search="+nameSearch);
  }

  GetAccounts(nameSearch : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetAccounts/?search="+nameSearch);
  }

  GetTaxStatus(customerNo : any, itemNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetTaxStatus/?customerID="+customerNo+"&itemCode="+itemNo);
  }

  GetItemPrice(itemNo: any, unitID:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetItemPrice/?itemNo="+itemNo+"&unitID="+unitID);
  }

  GetUnitName(ItemNo : any, UnitNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetUnitName/?itemNo="+ItemNo+"&unitID="+UnitNo);
  }

  GetExpenseName(ItemNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetExpenseName/?itemNo="+ItemNo);
  }

  GetAccountName(AccNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetAccountName/?accountNo="+AccNo);
  }

  GetCostName(CostNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetCostName/?costNo="+CostNo);
  }

  GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}LKP/TransactionSourceTypeLKP/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
  }

  GetSavedJournals(docNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetSavedJournals/?id="+docNo);
  }
  
  GetCurrentJournals(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"AR/SalesInvoice/GetCurrentJournals",formdata);
  }

  GetJournalID(docNo : any, typeNo:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
  }

  GetSalesMan(id:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AR/SalesInvoice/GetSalesMan/?id="+id);
  }

  GetItemBalance(storeId:any,itemId:any):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2 }AR/SalesInvoice/GetItemBalance/?storeId=${storeId}&itemId=${itemId}`);
  }
  
  GetInvOptions():Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2 }AR/SalesInvoice/GetInvOptions`);
  }

  GetCustDueDate(custID:any, invDate:any):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2 }AR/SalesInvoice/GetCustDueDate/?custID=${custID}&docDate=${invDate}`);
  }

  CheckCustCredit(custID:any, total:any):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2 }AR/SalesInvoice/CheckCustCredit/?custID=${custID}&net=${total}`);
  }

}
