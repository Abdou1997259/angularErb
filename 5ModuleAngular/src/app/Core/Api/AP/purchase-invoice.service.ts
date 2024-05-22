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
export class PurchaseInvoiceService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }
  CurrentAccount:string='';

  SaveInvoice(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"AP/PurchaseInvoice/Create",formdata);
  }

  SaveEditInvoice(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"AP/PurchaseInvoice/Edit",formdata);
  }

  GetAllInvoices(DocNo:number=0,DocDate:string='',TypeName:string='',SupplierName:string='',PurchaseManName:string='',Description:string='' ):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2}AP/PurchaseInvoice/GetAllInvoices/?docNo=${DocNo}&docDate=${DocDate}&invoiceType=${TypeName}&supplierName=${SupplierName}&purchaseManName=${PurchaseManName}&description=${Description}`);
  }

  GetInvoiceByID(id : number, dataArea: number) : Observable<any>{ 
    return this._http.get( ApiConfig.Apiurl2 + "AP/PurchaseInvoice/GetInvoiceByID/?docNo="+id+"&dataArea="+dataArea);
  }

  DeleteInvoice(id : number, type: number, sourceType: number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_purchase_invoice_no", id);
    formData.append("n_ivoice_type_id", type);
    formData.append("n_trans_source_no", sourceType);
    return  this._http.post(ApiConfig.Apiurl2+"AP/PurchaseInvoice/Delete",formData );
  }

  GetStores(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetStores/?search="+nameSearch);
  }

  GetCostCenters(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetCostCenters/?search="+nameSearch);
  }

  GetInvoiceTypes():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetInvoiceTypes");
  }

  GetCurrencies():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetCurrencies");
  }

  GetSuppliers(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetSuppliers/?search="+nameSearch);
  }

  GetEmployees(nameSearch : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetEmployees/?search="+nameSearch);
  }

  GetProjects():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetProjects");
  }

  GetAccDir():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetDir");
  }

  GetItemName(itemNo : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetItemName/?itemNo="+itemNo);
  }

  GetUnits(itemNo : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetUnits/?itemNo="+itemNo);
  }

  GetMainCurrency():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetMainCurrency");
  }

  GetTransSource():Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetTransSource");
  }

  GetExpenses(nameSearch : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetExpenses/?search="+nameSearch);
  }

  GetAccounts(nameSearch : string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetAccounts/?search="+nameSearch);
  }

  GetTaxStatus(supplierNo : any, itemNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetTaxStatus/?supplierID="+supplierNo+"&itemCode="+itemNo);
  }

  GetUnitCoff(ItemNo : any, UnitNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetUnitCoff/?itemNo="+ItemNo+"&unitID="+UnitNo);
  }

  GetUnitName(ItemNo : any, UnitNo: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetUnitName/?itemNo="+ItemNo+"&unitID="+UnitNo);
  }

  GetExpenseName(ItemNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetExpenseName/?itemNo="+ItemNo);
  }

  GetAccountName(AccNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetAccountName/?accountNo="+AccNo);
  }

  GetCostName(CostNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetCostName/?costNo="+CostNo);
  }

  GetPurchaseMan(id:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetSalesMan/?id="+id);
  }

  ExportInvoices(DocNo:number=0,DocDate:string='',InvoiceType:string='',SupplierName:string='',PurchaseManName:string='',Description:string='' ){ 
    this._http.get(`${ApiConfig.Apiurl2}AP/PurchaseInvoice/ExportInvoices/?docNo=${DocNo}&docDate=${DocDate}&invoiceType=${InvoiceType}&supplierName=${SupplierName}&purchaseManName=${PurchaseManName}&description=${Description}`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'Invoices.xlsx', {
         type: 'text/plain;charset=windows-1252' 
      });
      $('#excelBTN').prop('disabled', false);
   });
  }
  
  GetGenericViewData(id: number, viewId: number): Observable<Array<any>> {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}LKP/TransactionSourceTypeLKP/GetGenericViewData/?id=${id}&&viewId=${viewId}`);
  }

  GetJournalID(docNo : any, typeNo:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
  }

  GetSavedJournals(docNo : any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "AP/PurchaseInvoice/GetSavedJournals/?id="+docNo);
  }
  
  GetCurrentJournals(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"AP/PurchaseInvoice/GetCurrentJournals",formdata);
  }

  DownloadTemplate(){ 
    this._http.get(`${ApiConfig.Apiurl2}AP/PurchaseInvoice/GetTemplate`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'PurchaseInvoiceTemplate.xlsx', {
         type: 'text/plain;charset=windows-1252'
      });
   });
  }

  SaveExcelData(formdata: any):Observable<any>{
    return  this._http.post(ApiConfig.Apiurl2+"AP/PurchaseInvoice/SaveExcelInvoices",formdata);
  }
  
}
