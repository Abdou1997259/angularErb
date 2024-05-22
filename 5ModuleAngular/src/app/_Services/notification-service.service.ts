import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LangSwitcher } from '../Core/Api/Helper/lang';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  constructor(private toastr: ToastrService) { }


  ShowMessage(msg:string , status:number){
    
    if(status==1){
      this.toastr.success('saved!',msg);
    }
    if(status==2){
      this.toastr.error('ERROR!',msg);
    }
    if(status==3){
      this.toastr.warning('Warning!',msg);
    }
    
  }
}
