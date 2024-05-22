import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { UserService } from 'src/app/_Services/user.service';

@Injectable({
  providedIn: 'root',
})
export class ResturantInvoice2BillService {
  constructor(private _httClient: HttpClient) {
  }

  GetQrCode(doc:any,dataArea:any)
  {
    return this._httClient.get(`${ApiConfig.QrCodeDirectory}/${doc}-${dataArea}.jpg`,{responseType:'blob'})
  }
}
