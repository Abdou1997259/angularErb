import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuotationService } from 'src/app/_Services/Customer/quotation.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit {

 

  QuotationId! : number;
  showspinner:boolean=false;
 
  QuotationsDetails !: Array<any>;
  constructor(
    public dialogRef: MatDialogRef<QuotationDetailsComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any , 
    private userService : UserService
    ,private _QuotationService : QuotationService
    ,private notificationsevice : NotificationServiceService) 
  { 

    this.QuotationId = data.QuotationId;

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    
    this.GetQuotationDetails();
  }

  GetQuotationDetails(){
    this.showspinner=true;
    this._QuotationService.GetById(this.QuotationId).subscribe(data=>{
      this.QuotationsDetails = data;
      this.showspinner=false;
    })
  }


  ExecuteItem(QuotionLineNo : number){
    this.showspinner=true; 
    this._QuotationService.ExecuteItem(QuotionLineNo, this.QuotationId ).subscribe(data=>{ 
      this.showspinner=false;
      this.notificationsevice.ShowMessage(data.UserMessage,data.StatusCode);
    })


  }


}
