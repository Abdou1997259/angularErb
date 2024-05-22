import { Component, OnInit,Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-procedure-pop-up',
  templateUrl: './procedure-pop-up.component.html',
  styleUrls: ['./procedure-pop-up.component.css']
})
export class ProcedurePopUpComponent implements OnInit {

 

  customerId! : number;

  procedure : any={procTitle:'' , procDetails:'' };
  showspinner:boolean=false;
  constructor(
    public dialogRef: MatDialogRef<ProcedurePopUpComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any , 
    private userService : UserService
    ,private customerService:CustomerService , private notificationsevice : NotificationServiceService) 
  { 

    this.customerId = data.n_customer_id;

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }


 createProc(){  
  this.showspinner=true;
    if(this.procedure.procTitle.trim() =='')
    {
      this.notificationsevice.ShowMessage('من فضلك ادخل عنوان الاجراء',2);
      this.showspinner=false;
      return;
    }
    if(this.procedure.procDetails.trim() =='')
    {
      this.notificationsevice.ShowMessage('من فضلك ادخل تفاصيل الاجراء',2);
      this.showspinner=false;
      return;
    }
    var formData: any = new FormData(); 
    formData.append("s_proc_name", this.procedure.procTitle);
    formData.append("s_proc_details", this.procedure.procDetails); 
    formData.append("n_user_id", this.userService.GetUserID()); 
    formData.append("n_customer_id", this.customerId); 

  
    this.customerService.SaveProcedure(formData).subscribe(data=>{
 
      
      this.notificationsevice.ShowMessage(data.UserMessage,data.StatusCode);
      this.showspinner=false;
      if(data.StatusCode==1){
         this.dialogRef.close();
      }
     
      
    })
 }

}
