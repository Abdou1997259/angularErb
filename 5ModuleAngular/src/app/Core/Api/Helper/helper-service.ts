import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Core/model/Gl/Journals';
import {ApiConfig} from 'src/app/_Setting/ApiConfig'
import { HttpClient, HttpHeaders,HttpRequest,HttpHandler,HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/_Services/user.service';
import { CostCenter } from '../../model/LookUp/CostCenter';
import { saveAs } from 'file-saver';
import { PageResult } from 'src/app/_model/Items/PageResult';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private _http : HttpClient,private userservice:UserService) {
  }

  GetCustomerData(customerId: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetCustomerData/?customerId=${customerId}`);
  }

  GetSalerData(salerId: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetSalerData/?salerId=${salerId}`);
  }

  GetItemData(itemId: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetItemData/?itemId=${itemId}`);
  }
  
  GetItemName(searchString: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetItemName/?searchString=${searchString}`);
  }
  GetUnitName(searchString: string, itemId: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetUnitName/?searchString=${searchString}&&itemId=${itemId}`);
  }

  GetBranchData(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetBranchData/?id=${id}`);
  }

  GetUnitData(unitId: number, itemId: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetUnitData/?unitId=${unitId}&&itemId=${itemId}`);
  }

  GetCashData(id: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetCashData/?id=${id}`);
  }

  GetItemCostData(storeId: number, itemId: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetItemCostData/?storeId=${storeId}&&itemId=${itemId}`);
  }

  getSuppliersData(supId: any): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/getSuppliersData/?supId=${supId}`);
  }

  GetCostData(costNo: string): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetCostData/?costNo=${costNo}`);
  }

  GetCurrentCurrency(): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetCurrentCurrency`);
  }

  GetCurrencies(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetCurrencies`);
  }

  GetAppPriority(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetAppPriority`);
  }
  
  GetStoresDP(searchString: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetStoresDP/?searchString=${searchString}`);
  }

  GetPaymentWays(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetPaymentWays`);
  }

  GetStoreData(storeId: number): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}Helper/GetStoreData/?storeId=${storeId}`);
  }

  GetDeliveryPlace(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetDeliveryPlace`);
  }

  GetCostCenters(search: string): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetCostCenters/?search=${search}`);
  }

  GetAgentsTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetAgentsTypes`);
  }

  GetTargetTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetTargetTypes`);
  }

  GetDirectTransTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetDirectTransTypes`);
  }

  GetFinancialSourcesDebit(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetFinancialSourcesDebit`);
  }

  GetBankBranches(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetBankBranches`);
  }

  GetDebitTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetDebitTypes`);
  }

  GetCreditTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetCreditTypes`);
  }

  GetTransferTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetTransferTypes`);
  }

  GetCardTypes(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetCardTypes`);
  }

  getIndustriesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getIndustriesDPList`);
  }

  getClassesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getClassesDPList`);
  }

  getBranchesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getBranchesDPList`);
  }

  getCreditPeriodTypesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCreditPeriodTypesDPList`);
  }

  getDealingTypesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getDealingTypesDPList`);
  }

  getCustomerTypesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCustomerTypesDPList`);
  }

  getCustomerNaturesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCustomerNaturesDPList`);
  }

  getTypesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getTypesDPList`);
  }

  getDirSourceDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getDirSourceDPList`);
  }

  GetDebitTypesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetDebitTypesDPList`);
  }

  GetCreditTypesDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetCreditTypesDPList`);
  }

  GetDebCredDPList(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetDebCredDPList`);
  }

  getEmployeesLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getEmployeesLKP/?searchVal=${searchVal}`);
  }

  getSupervisorLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getSupervisorLKP/?searchVal=${searchVal}`);
  }

  getManagersLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getManagersLKP/?searchVal=${searchVal}`);
  }

  getCommissionsLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCommissionsLKP/?searchVal=${searchVal}`);
  }

  getGroupsLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getGroupsLKP/?searchVal=${searchVal}`);
  }

  getAccountsOrdersLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getAccountsOrdersLKP/?searchVal=${searchVal}`);
  }

  getCustomerTypesLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCustomerTypesLKP/?searchVal=${searchVal}`);
  }

  getMainCustomersLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getMainCustomersLKP/?searchVal=${searchVal}`);
  }

  getSalesmenLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getSalesmenLKP/?searchVal=${searchVal}`);
  }

  getAdverMenLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getAdverMenLKP/?searchVal=${searchVal}`);
  }

  getAreaLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getAreaLKP/?searchVal=${searchVal}`);
  }

  getCostCebterLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCostCebterLKP/?searchVal=${searchVal}`);
  }

  getPriceLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getPriceLKP/?searchVal=${searchVal}`);
  }

  getSuppliersLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getSuppliersLKP/?searchVal=${searchVal}`);
  }

  getItemTypesLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getItemTypesLKP/?searchVal=${searchVal}`);
  }

  getTaxOfficesLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getTaxOfficesLKP/?searchVal=${searchVal}`);
  }

  getPaymentEmployeesLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getPaymentEmployeesLKP/?searchVal=${searchVal}`);
  }

  getCustomersLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCustomersLKP/?searchVal=${searchVal}`);
  }

  getBanksLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getBanksLKP/?searchVal=${searchVal}`);
  }

  getCashesLKP(searchVal: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/getCashesLKP/?searchVal=${searchVal}`);
  }

  GetDebitItems(type: number = 0, search: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetDebitItems/?type=${type}&&search=${search}`);
  }

  GetCreditItems(type: number = 0, search: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetCreditItems/?type=${type}&&search=${search}`);
  }

  loadInvoices(sourceNo: number, docNo: number = 0, docDate: string = ''): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/loadInvoices/?sourceNo=${sourceNo}&&docNo=${docNo}&&docDate=${docDate}`);
  }
  
  GetVatCategory(): Observable<Array<any>>
  {
    return this._http.get<Array<any>>(`${ApiConfig.Apiurl2}Helper/GetVatCategory`);
  }

  GetJournalID(docNo : any, typeNo:any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "GL/Journals/GetJournalID/?docNo="+docNo+"&type="+typeNo);
  }

  GetSourceName(type : any, sourceID: any, search: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Helper/GetSourceName/?type="+type+"&sourceID="+sourceID+"&search="+search);
  }
  
  GetItemDetails(itemId: string):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Helper/GetItemDetails/?itemId="+itemId);
  }

  GetRecieveItems(pageNumber: number, pageSize: number, searchString: string = '', storeId: number = 0):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ `Helper/GetRecieveItems/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&search=${searchString}&&storeId=${storeId}`);
  }

  GetGlobalItems(pageNumber: number, pageSize: number, searchString: string = ''):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ `Helper/GetGlobalItems/?pageNumber=${pageNumber}&&pageSize=${pageSize}&&searchString=${searchString}`);
  }

  GetGlobalItemName(itemId: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Helper/GetGlobalItemName/?id="+itemId);
  }

  GetGlobalUnitName(itemNo: any, unitID: any):Observable<any>{ 
    return  this._http.get( ApiConfig.Apiurl2+ "Helper/GetGlobalUnitName/?itemNo="+itemNo+"&&unitID="+unitID);
  }
}
