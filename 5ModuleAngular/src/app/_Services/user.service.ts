import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable  , BehaviorSubject} from 'rxjs';
import { ApiConfig } from '../_Setting/ApiConfig';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public options = { headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json') };

  constructor(private http: HttpClient )
  { }

  public currentusername = new BehaviorSubject('');

   ChangeUserName(username : string){
    this.currentusername.next(username);
   }


  SaveUserData(userid:any, username:any, usertype: any, comp:any, year:any, branch:any, token:any, branchName: any, compName: any, s_branches: any, s_stores: any, s_cashes: any, s_banks: any) {
    localStorage.setItem("userid", userid);
    localStorage.setItem("username", username);
    localStorage.setItem("userType", usertype);
    localStorage.setItem("comp", comp);
    localStorage.setItem("year", year);
    localStorage.setItem("branch", branch);
    localStorage.setItem("access_token", token);
    localStorage.setItem("s_branches", s_branches);
    localStorage.setItem("s_stores", s_stores);
    localStorage.setItem("s_cashes", s_cashes);
    localStorage.setItem("s_banks", s_banks);
    var CompId = comp.toString().length > 1 ? "0" + comp.toString() : "00" + comp.toString();
    var dataArea = year.toString().substring(2) + CompId + (branch.toString().length > 1 ? branch.toString() : "0" + branch.toString());
    localStorage.setItem("DataAreaID", dataArea);
    localStorage.setItem("branchName", branchName);
    localStorage.setItem("compName", compName);
    localStorage.setItem("Lang", (window.sessionStorage.getItem("lan")=="English") ? "English" : "");
  }

  SaveCurrentModule(moduleId: any) {
    localStorage.setItem("moduleId", moduleId);
  }

  SaveUserForms(forms:any ) {
    localStorage.setItem("userforms", JSON.stringify(forms));
  }

  SaveAllUserForms(forms:any, allForms ) {
    localStorage.setItem("userforms", JSON.stringify(forms));
    localStorage.setItem("alluserforms", JSON.stringify(allForms));
  }

  GetDataAreaID() {
    return localStorage.getItem("DataAreaID") == null ? '0' : localStorage.getItem("DataAreaID");
  }

  GetBranchName() {
    return localStorage.getItem("branchName") == null ? '0' : localStorage.getItem("branchName");
  }

  GetCompName() {
    return localStorage.getItem("compName") == null ? '0' : localStorage.getItem("compName");
  }

  GetUserID() {
    return localStorage.getItem("userid") == null ? '0' : localStorage.getItem("userid");
  }

  GetCurrentModule() {
    return localStorage.getItem("moduleId") == null ? '0' : localStorage.getItem("moduleId");
  }

  GetUserTypeID() {
    return localStorage.getItem("userType") == null ? 0 : localStorage.getItem("userType");
  }

  GetComp() {
    return localStorage.getItem("comp") == null ? '0' : localStorage.getItem("comp");
  }

  GetYear() {
    return localStorage.getItem("year") == null ? '0' : localStorage.getItem("year");
  }

  GetBranch() {
    return localStorage.getItem("branch") == null ? '0' : localStorage.getItem("branch");
  }

  GetToken() {
    return localStorage.getItem("access_token") == null ? '0' : localStorage.getItem("access_token");
  }

  GetLanguage() {
    return localStorage.getItem("Lang") == null ? '' : localStorage.getItem("Lang");
  }

  GetModuleForms() {
    return localStorage.getItem("userforms") == null ? '' : localStorage.getItem("userforms");
  }


  LogOut() {
    // localStorage.setItem("userid", '0');
    // localStorage.setItem("username", '');
    // localStorage.setItem("userType", '0');
    // localStorage.setItem("userforms", '');
    localStorage.clear();
  }

  GetUserType(){
    return this.http.get( ApiConfig.Apiurl2+ 'sys/Main/GetUserType');
  }

  GetUserName():any {
    return localStorage.getItem("username") == null ? '' : localStorage.getItem("username");
  }

  GetBalance() {
    return localStorage.getItem("balance") == null ? '' : localStorage.getItem("balance");
  }

  GetUser(username: string, password: string) {
    return this.http.get( ApiConfig.Apiurl2+ 'Auth/Login/?username=' + username + '&password=' + password);
  }

  GetUserShift(password: string): Observable<any> {
    return this.http.get( `${ApiConfig.Apiurl2}Auth/GetUserShift/?password=${password}`);
  }

  GetUserCompany(username: string, password: string, comp: number, year: number, branch: number) {
    return this.http.get( ApiConfig.Apiurl2+ 'Auth/LoginCompany/?username=' + username + '&password=' + password + '&comp=' + comp + "&year=" + year + "&branch=" + branch);
  }

  LogoutAPI(){
    return this.http.get( ApiConfig.Apiurl2+ 'sys/Main/Logout');
  }


  menu:any;
  retrievedForms:any=null;
  IsHasPrev(formname : string , op :string) : boolean{
    this.retrievedForms= localStorage.getItem('alluserforms');
    this.menu=JSON.parse(this.retrievedForms);
    //   for (let i = 0; i < this.menu.length; i++) {

    //     for(let k=0; k < this.menu[i].formsDetails.length; k++)
    //     {

    //      if(this.menu[i].formsDetails[k].s_url ===formname )
    //      {
    //       if(op==='list' && (this.menu[i].formsDetails[k].b_Save || this.menu[i].formsDetails[k].b_Update || this.menu[i].formsDetails[k].b_Delete|| this.menu[i].formsDetails[k].b_Confirm || this.menu[i].formsDetails[k].b_Show))
    //        {
    //         return  true;
    //        }


    //        if(op==='new' && this.menu[i].formsDetails[k].b_Save  )
    //        {
    //         return  true;
    //        }
    //        if(op==='edit' && this.menu[i].formsDetails[k].b_Update  )
    //        {
    //          return  true;
    //        }
    //        if(op==='delete' && this.menu[i].formsDetails[k].b_Delete  )
    //        {
    //          return  true;
    //        }
    //        if(op==='confirm' && this.menu[i].formsDetails[k].b_Confirm  )
    //        {
    //          return  true;
    //        }
    //       }
    //     }
    //  }
    for (let i = 0; i < this.menu.length; i++) {

       if(this.menu[i].s_url ===formname )
       {
          if(op==='list' && (this.menu[i].b_Save || this.menu[i].b_Update || this.menu[i].b_Delete|| this.menu[i].b_Confirm || this.menu[i].b_Show))
          {
            return  true;
          }

          if(op==='new' && this.menu[i].b_Save  )
          {
            return  true;
          }
          if(op==='edit' && this.menu[i].b_Update  )
          {
            return  true;
          }
          if(op==='delete' && this.menu[i].b_Delete  )
          {
            return  true;
          }
          if(op==='confirm' && this.menu[i].b_Confirm  )
          {
            return  true;
          }
        }
   }
    return false;
  }
  UpdateBranch( comp:any,year:any,branch:any):Observable<any>{
    return  this.http.get(ApiConfig.Apiurl2+`Auth/UpdateArea?comp=${comp}&year=${year}&branch=${branch}`);
  }

}
