import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private _http: HttpClient) { }

  GetAllEmployees(EmpNo:number=0,EmpName:string='',DateOB:string='',JobTitle:string='',Nationality:string='', MartialStatus:string='', Gender:string='' ): Observable<any>
  {
    return this._http.get<any>(`${ApiConfig.Apiurl2}HR/Employee/GetAllEmployees/?empNumber=${EmpNo}&empName=${EmpName}&DOB=${DateOB}&jobTitle=${JobTitle}&nationality=${Nationality}&martialStatus=${MartialStatus}&gender=${Gender}`);
  }

  DeleteEmployee(id : number):Observable<any>{   
    var formData: any = new FormData(); 
    formData.append("n_employee_id", id);
    return  this._http.post(ApiConfig.Apiurl2+"HR/Employee/Delete",formData );
  }

}
