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
export class JournalService {

  constructor(private _http : HttpClient,private userservice:UserService ) {

  }
  CurrentAccount:string='';


  GetAllJournals(DocNo:number=0,DocDate:string='',JournalName:string='',AccountName:string='',Description:string='' ):Observable<any>{ 
    return  this._http.get( `${ApiConfig.Apiurl2}GL/Journals/GetAllJournals/?docNo=${DocNo}&docDate=${DocDate}&journalName=${JournalName}&accountName=${AccountName}&description=${Description}`);
  }

  GetJournalById(id : number, dataArea: number) : Observable<Journal>{ 
    return this._http.get<Journal>( ApiConfig.Apiurl2 + "GL/Journals/GetJournalByID/?id="+id+"&dataArea="+dataArea);
  }

  GetJournalDetailsById(id : number) : Observable<Journal>{ 
    return this._http.get<Journal>( ApiConfig.Apiurl2+ "GL/Journals/GetJournalDetailsByID/?id="+id);
  }

  GetJournalsLkp(page:number=1,pagesize:number=5,keyword:string='' ) : Observable<PageResult>{ 
    return this._http.get<PageResult>( ApiConfig.Apiurl2+ "GL/Journals/GetJournalTypes/");
  }

  GetAllJournalsLkp(page:number=1,pagesize:number=5,keyword:string='' ) : Observable<PageResult>{ 
    return this._http.get<PageResult>( ApiConfig.Apiurl2+ "GL/Journals/GetAllJournalTypes/");
  }

  GetCurrencyLkp(page:number=1,pagesize:number=5,keyword:string='' ) : Observable<PageResult>{ 
    return this._http.get<PageResult>( ApiConfig.Apiurl2+ "GL/Journals/GetCurrencies/");
  }

  GetCostCenterssLkp(accountNo:string='',keyword:string='' ) : Observable<PageResult>{ 
    return this._http.get<PageResult>( ApiConfig.Apiurl2 + "GL/Journals/GetCostCenters/?accountNo="+accountNo+"&nameSearch=" + keyword);
  }

  GetCostCenter(accountNo:string='') : Observable<CostCenter>{ 
    return this._http.get<CostCenter>( ApiConfig.Apiurl2 + "GL/Journals/GetCostCenter/?accountNo="+accountNo);
  }

  GetAccountsLkp(page:number=1,pagesize:number=5,keyword:string='' ) : Observable<PageResult>{ 
    return this._http.get<PageResult>( ApiConfig.Apiurl2+ "GL/Journals/GetAccounts/?nameSearch="+keyword);
  }
  
  SaveJournal(formdata: any):Observable<any>{   
    return  this._http.post(ApiConfig.Apiurl2+"GL/Journals/Create",formdata);
  }

  SaveEditJournal(formdata: any):Observable<any>{  
    return  this._http.post(ApiConfig.Apiurl2+"GL/Journals/Edit",formdata);
  }

  DeleteJournal(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_doc_no", id);
    return  this._http.post(ApiConfig.Apiurl2+"GL/Journals/Delete",formData );
  }

  GetAccountCostType(id : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"GL/Journals/GetAccountCostCenters/?accountNo="+id);
  }

  GetAccountName(id : string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"GL/Journals/GetAccountName/?accountNo="+id);
  }

  GetCostName(cost : string, account: string):Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"GL/Journals/GetCostCenterName/?costNo="+cost+"&accountNo="+account);
  }

  GetMainCurrency():Observable<any>{   
    return  this._http.get(ApiConfig.Apiurl2+"GL/Journals/GetMainCurrency");
  }

  ExportJournals(DocNo:number=0,DocDate:string='',JournalName:string='',AccountName:string='',Description:string='' ){ 
    //return  this._http.get( `${ApiConfig.Apiurl2}GL/Journals/ExportJournals/?docNo=${DocNo}&docDate=${DocDate}&journalName=${JournalName}&accountName=${AccountName}&description=${Description}`);
    this._http.get(`${ApiConfig.Apiurl2}GL/Journals/ExportJournals/?docNo=${DocNo}&docDate=${DocDate}&journalName=${JournalName}&accountName=${AccountName}&description=${Description}`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'Journals.xlsx', {
         type: 'text/plain;charset=windows-1252' // --> or whatever you need here
      });
      $('#excelBTN').prop('disabled', false);
   });
  }

  DownloadTemplate(){ 
    this._http.get(`${ApiConfig.Apiurl2}GL/Journals/GetTemplate`, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'JournalsTemplate.xlsx', {
         type: 'text/plain;charset=windows-1252'
      });
   });
  }

  SaveExcelData(formdata: any):Observable<any>{
    return  this._http.post(ApiConfig.Apiurl2+"GL/Journals/SaveExcelJournals",formdata);
  }

  Post(docNo:any):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_doc_no", docNo);
    return  this._http.post(ApiConfig.Apiurl2+"GL/Journals/Post", formData);
  }

  UnPost(docNo:any):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_doc_no", docNo);
    return  this._http.post(ApiConfig.Apiurl2+"GL/Journals/UnPost",formData);
  }

}
