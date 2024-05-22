import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { bankService } from 'src/app/Core/Api/FIN/bank.service';
import { NationalityService } from 'src/app/Core/Api/HR/nationality.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.css']
})
export class NationalityComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _activatedRoute:ActivatedRoute,
    private dialogRef:MatDialog,
    private _SERVICE:NationalityService,
    private _notification: NotificationServiceService,
    private _getBanks:bankService, 
    private _currency: CurrencyLKPService,
    private _lookup:GenerealLookup,
    
    private _serviceOut:SCstockInService
    ) {
   
  }
  //end Constructor

  //Onint
  ngOnInit(): void {
    debugger
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.nationalityForm=this.fb.group({
      n_nationality_id :[''],
      s_nationality_name :[''],
      s_nationality_name_eng :[''],
      n_ticket_Value :[''],
      n_ticket_Value_one_way:[''],
      n_child_two_eleven_ticket_value:[''],
      n_child_less_than_two_ticket_value:[''],
      n_child_two_eleven_ticket_value_one_way:[''],
      n_child_less_than_two_ticket_value_one_way:['']
    });
    if(this.DocNo != null && this. DocNo > 0)
    {
      this.nclassId=true
      
      this._SERVICE.GetByID(this.DocNo).subscribe((data)=>{
        debugger;
        this.nationalityForm.patchValue(data)

        // n_Collection_rate:[''],
    
      
        // s_Return_Check_account:[''],
        // s_Return_Check_account_name:['']
    




      
      
      })

   


     
    }
    


   this.isEnglish=LangSwitcher.CheckLan();
   LangSwitcher.translateData(1);
   LangSwitcher.translatefun();

   
}
  //end OnInit 


  //variable declaration

  nationalityForm !:FormGroup
  showspinner=false;
  IDNo!:any;
  Edit: boolean=false;
  filteredAccServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCashServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  nclassId:boolean=false
  searchingEmpClassAcc:boolean=false;
  searchingEmpClassCash:boolean=false;
  EmpClassCashData:any=[];
  EmpClassAccData:any=[];
  Add: Boolean=true;
  DataAreaNo: any;
  @ViewChild("showID") showID!:ElementRef;
  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;

  


  searchingVlues:any[]=[];
  DocNo:any;
  isEnglish:boolean=false;
  //end declartion 


  //function creation
  disableButtons() {
    debugger;
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }
  
  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }







  save(){
    debugger
    if(this.nationalityForm.get("s_nationality_name")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert natioanlity',3)
    else
      this._notification.ShowMessage("منفضلك  اسم الجنسيات",3)
      return
    }

  
    if(this.nationalityForm.get("n_ticket_Value_one_way")?.invalid ||this.nationalityForm.get("n_ticket_Value")?.invalid )
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please ticket cost',3)
    else
      this._notification.ShowMessage("منفضلك  ادخل سعر التذكرة",3)
      return
    }
   var formData=new FormData();


 
  formData.append("n_nationality_id",this.nationalityForm.value.n_nationality_id ?? "0");
  formData.append("s_nationality_name",this.nationalityForm.value.s_nationality_name );
  formData.append("s_nationality_name_eng",this.nationalityForm.value.s_nationality_name_eng  );
  formData.append("n_ticket_Value_one_way",this.nationalityForm.value.n_ticket_Value_one_way )
  formData.append("n_ticket_Value",this.nationalityForm.value.n_ticket_Value );
  formData.append("n_child_two_eleven_ticket_value",this.nationalityForm.value.n_child_two_eleven_ticket_value  );
  formData.append("n_child_two_eleven_ticket_value_one_way",this.nationalityForm.value.n_child_two_eleven_ticket_value_one_way  );
  formData.append("n_child_less_than_two_ticket_value",this.nationalityForm.value.n_child_less_than_two_ticket_value  );
  formData.append("n_child_less_than_two_ticket_value_one_way",this.nationalityForm.value.n_child_less_than_two_ticket_value_one_way  );
  this.showspinner = true;
  this.disableButtons();
  if(this.DocNo != null && this. DocNo > 0)
  {
      this._SERVICE.Edit(formData).subscribe((data)=>{
    if(data.status=1)
    {
      if(this.isEnglish)
      this._notification.ShowMessage('Updated successfully',1)
    else
        this._notification.ShowMessage("تم  التعديل  بنجاح",1);
         this.router.navigate(["hr/nationality"]);
         this.nationalityForm = this.fb.group({
          n_nationality_id :[''],
          s_nationality_name :[''],
          s_nationality_name_eng :[''],
          n_ticket_Value :[''],
          n_ticket_Value_one_way:[''],
          n_child_two_eleven_ticket_value:[''],
          n_child_less_than_two_ticket_value:[''],
          n_child_two_eleven_ticket_value_one_way:[''],
          n_child_less_than_two_ticket_value_one_way:['']
          
       });
    }

  });
  }
  else
  {
     this._SERVICE.Create(formData).subscribe(data => {

       if(data.status=1)
       {
        if(this.isEnglish)
          this._notification.ShowMessage('Saved successfully',1)
        else
           this._notification.ShowMessage("تم  الحفظ  بنجاح",1);
           this.router.navigate(["hr/nationality"]);
           this.nationalityForm = this.fb.group({
            n_nationality_id :[''],
            s_nationality_name :[''],
            s_nationality_name_eng :[''],
            n_ticket_Value :[''],
            n_ticket_Value_one_way:[''],
            n_child_two_eleven_ticket_value:[''],
            n_child_less_than_two_ticket_value:[''],
            n_child_two_eleven_ticket_value_one_way:[''],
            n_child_less_than_two_ticket_value_one_way:['']

            
         });
       }
 
     });
  }

}
}
