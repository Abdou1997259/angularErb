import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { bankService } from 'src/app/Core/Api/FIN/bank.service';
import { PenlityService } from 'src/app/Core/Api/HR/penlity.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';

@Component({
  selector: 'app-vacation-add',
  templateUrl: './vacation-add.component.html',
  styleUrls: ['./vacation-add.component.css']
})
export class VacationAddComponent implements OnInit {

   
  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _activatedRoute:ActivatedRoute,
    private dialogRef:MatDialog,
    private _SERVICE:PenlityService,
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
    this.VacationForm=this.fb.group({
      n_doc_no :[''],
      filteredVacationServerSide :[''],

      d_doc_date:[(new Date()).toISOString().substring(0,10),Validators.required],
      d_vacation_end_date :[''],
      d_vacation_start_date:[''],
      n_DataAreaID:[''], 
      n_alternative_employee_no :[''],
      n_from_month :[''],
      n_from_year :[''],
      n_to_month :[''],
      n_to_year:[''],
      d_vacation_due_date:[''], 
      n_vacation_period :[''],
      b_not_discount_from_salary :[''],
      b_not_discount_emp_insurance :[''],
      b_confirm :[''],
      n_visa_count_of_months:[''],
      n_visa_count_of_days:[''], 
      d_higri_visa_expire_date :[''],
      d_visa_expired_date :[''],
      s_Notes :[''],
      n_Allowed_period :[''],
      n_Rule_Balance:[''],
      n_prev_vacations:[''], 
      n_Balance_After_Vacation :[''],
      n_full_salary :[''],
      n_basic_salary :[''],
      n_work_days                     :[],
      n_month_due                     :[],
      n_other_due                     :[],
      n_vacation_additional_days_count:[],
      n_vacation_additional_Hours_coun:[],
      n_additional_due                :[],
      n_discount_value                :[],
      n_vacation_salary               :[],
      n_vacation_total_value          :[],
      n_vacation_paid_days            :[],
      n_vacation_Unpaid_days          :[],
      n_vacation_Requested_total_days :[],
      n_vacation_endservice_no        :[],
      d_calc_vacation_to_date         :[]

    });
    this.VacationForm=this.fb.group({
      n_doc_no :[''],
      n_employee_id :[''],
      d_doc_date :[''],
      d_vacation_end_date :[''],
      d_vacation_start_date:[''],
      n_DataAreaID:[''], 
      n_alternative_employee_no :[''],
      n_from_month :[''],
      n_from_year :[''],
      n_to_month :[''],
      n_to_year:[''],
      d_vacation_due_date:[''], 
      n_vacation_period :[''],
      b_not_discount_from_salary :[''],
      b_not_discount_emp_insurance :[''],
      b_confirm :[''],
      n_visa_count_of_months:[''],
      n_visa_count_of_days:[''], 
      d_higri_visa_expire_date :[''],
      d_visa_expired_date :[''],
      s_Notes :[''],
      n_Allowed_period :[''],
      n_Rule_Balance:[''],
      n_prev_vacations:[''], 
      n_Balance_After_Vacation :[''],
      n_full_salary :[''],
      n_basic_salary :[''],
      n_work_days                     :[],
      n_month_due                     :[],
      n_other_due                     :[],
      n_vacation_additional_days_count:[],
      n_vacation_additional_Hours_coun:[],
      n_additional_due                :[],
      n_discount_value                :[],
      n_vacation_salary               :[],
      n_vacation_total_value          :[],
      n_vacation_paid_days            :[],
      n_vacation_Unpaid_days          :[],
      n_vacation_Requested_total_days :[],
      n_vacation_endservice_no        :[],
      d_calc_vacation_to_date         :[]

    });
    if(this.DocNo != null && this. DocNo > 0)
    {
      this.nclassId=true
      
      this._SERVICE.GetByID(this.DocNo).subscribe((data)=>{
        debugger;
        this.VacationForm.patchValue(data)

        // n_Collection_rate:[''],
    
      
        // s_Return_Check_account:[''],
        // s_Return_Check_account_name:['']
    




      
      
      })

   


     
    }
    


   this.isEnglish=LangSwitcher.CheckLan();
   LangSwitcher.translateData(1);
   LangSwitcher.translatefun();
 
   this.searchVacation('');
   
}
  //end OnInit 


  //variable declaration

  VacationForm !:FormGroup
  showspinner=false;
  IDNo!:any;
  Edit: boolean=false;
  filteredAccServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredVacationServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  nclassId:boolean=false
  searchingVacation:boolean=false;
  searchingEmpClassCash:boolean=false;
VacationData:any=[];
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





  searchVacation(value :any){
    debugger;
     this.searchingVacation=true;
     this._SERVICE.GetDedution(value).subscribe(res=>{
       this.VacationData=res;
       this.filteredVacationServerSide.next(  this.VacationData.filter(x => x.s_employee_name.toLowerCase().indexOf(value) > -1));
       this.searchingVacation=false;
     });
   }
 

  save(){
    debugger
    if(this.VacationForm.get("n_employee_id")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert  class name',3)
    else
      this._notification.ShowMessage("منفضلك  اسم النوع",3)
      return
    }
    if(this.VacationForm.get("n_deduction_id")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert the valut',3)
    else
      this._notification.ShowMessage("منفضلك  اسم الخزينة",3)
      return
    }
    if(this.VacationForm.get("n_pen_days")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert account',3)
    else
      this._notification.ShowMessage("منفضلك  ادخل حساب",3)
      return
    }
   var formData=new FormData();


   this.VacationForm.value.d_doc_date=new DatePipe('en-US').transform(this.VacationForm.value.d_doc_date, 'yyyy/MM/dd');
  formData.append("n_doc_no",this.VacationForm.value.n_doc_no ?? "0");
  formData.append("n_employee_id",this.VacationForm.value.n_employee_id );
  formData.append("d_doc_date",this.VacationForm.value.d_doc_date  );
  formData.append("n_expand_vacation_no",this.VacationForm.value.n_expand_vacation_no )
  formData.append("d_vacation_start_date",this.VacationForm.value.d_vacation_start_date );
  formData.append("d_vacation_end_date",this.VacationForm.value.d_vacation_end_date  );
  formData.append("n_from_month",this.VacationForm.value.n_from_month  );
  formData.append("n_from_year",this.VacationForm.value.n_from_year );
  formData.append("n_alternative_employee_no",this.VacationForm.value.n_alternative_employee_no )
  formData.append("n_to_month",this.VacationForm.value.n_to_month );
  formData.append("n_to_year",this.VacationForm.value.n_to_year  );
  formData.append("d_vacation_due_date",this.VacationForm.value.d_vacation_due_date  );
  formData.append("n_vacation_period",this.VacationForm.value.n_vacation_period );
  formData.append("b_not_discount_from_salary",this.VacationForm.value.b_not_discount_from_salary )
  formData.append("b_not_discount_emp_insurance",this.VacationForm.value.b_not_discount_emp_insurance );
  formData.append("b_confirm",this.VacationForm.value.b_confirm  );
  formData.append("n_visa_count_of_months",this.VacationForm.value.n_visa_count_of_months  );
  formData.append("n_visa_count_of_days",this.VacationForm.value.n_visa_count_of_days );
  formData.append("d_higri_visa_expire_date",this.VacationForm.value.d_higri_visa_expire_date  );
  formData.append("d_visa_expired_date",this.VacationForm.value.d_visa_expired_date );
  formData.append("s_Notes",this.VacationForm.value.s_Notes )
  formData.append("n_Allowed_period",this.VacationForm.value.n_Allowed_period );
  formData.append("n_Rule_Balance",this.VacationForm.value.n_Rule_Balance  );
  formData.append("n_prev_vacations",this.VacationForm.value.n_prev_vacations  );
  formData.append("n_Balance_After_Vacation",this.VacationForm.value.n_Balance_After_Vacation );


  formData.append("n_basic_salary",this.VacationForm.value.n_basic_salary  );
  formData.append("n_full_salary",this.VacationForm.value.n_full_salary );
  formData.append("n_work_days",this.VacationForm.value.n_work_days  );


  formData.append("d_visa_expired_date",this.VacationForm.value.d_visa_expired_date );
  formData.append("n_month_due",this.VacationForm.value.n_month_due )
  formData.append("n_other_due",this.VacationForm.value.n_other_due );
  formData.append("n_vacation_additional_days_count",this.VacationForm.value.n_vacation_additional_days_count  );
  formData.append("n_vacation_additional_days_count",this.VacationForm.value.n_vacation_additional_days_count  );
  formData.append("n_additional_due",this.VacationForm.value.n_additional_due );




  formData.append("n_discount_value",this.VacationForm.value.n_discount_value );
  formData.append("n_vacation_salary",this.VacationForm.value.n_vacation_salary )
  formData.append("n_vacation_total_value",this.VacationForm.value.n_vacation_total_value );
  formData.append("n_vacation_paid_days",this.VacationForm.value.n_vacation_paid_days  );
  formData.append("n_vacation_Unpaid_days",this.VacationForm.value.n_vacation_Unpaid_days  );
  formData.append("n_vacation_Requested_total_days",this.VacationForm.value.n_vacation_Requested_total_days );



  formData.append("n_vacation_endservice_no",this.VacationForm.value.n_vacation_endservice_no )
  formData.append("d_calc_vacation_to_date",this.VacationForm.value.d_calc_vacation_to_date );
  

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
         this.router.navigate(["hr/vacation"]);
         this.VacationForm = this.fb.group({
          
            n_doc_no :[''],
            n_employee_id :[''],
            d_doc_date:[(new Date()).toISOString().substring(0,10),Validators.required],
            d_vacation_end_date :[''],
            d_vacation_start_date:[''],
            n_DataAreaID:[''], 
            n_alternative_employee_no :[''],
            n_from_month :[''],
            n_from_year :[''],
            n_to_month :[''],
            n_to_year:[''],
            d_vacation_due_date:[''], 
            n_vacation_period :[''],
            b_not_discount_from_salary :[''],
            b_not_discount_emp_insurance :[''],
            b_confirm :[''],
            n_visa_count_of_months:[''],
            n_visa_count_of_days:[''], 
            d_higri_visa_expire_date :[''],
            d_visa_expired_date :[''],
            s_Notes :[''],
            n_Allowed_period :[''],
            n_Rule_Balance:[''],
            n_prev_vacations:[''], 
            n_Balance_After_Vacation :[''],
            n_full_salary :[''],
            n_basic_salary :[''],
            n_work_days                     :[],
            n_month_due                     :[],
            n_other_due                     :[],
            n_vacation_additional_days_count:[],
            n_vacation_additional_Hours_coun:[],
            n_additional_due                :[],
            n_discount_value                :[],
            n_vacation_salary               :[],
            n_vacation_total_value          :[],
            n_vacation_paid_days            :[],
            n_vacation_Unpaid_days          :[],
            n_vacation_Requested_total_days :[],
            n_vacation_endservice_no        :[],
            d_calc_vacation_to_date         :[]
      
          
          
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
           this.router.navigate(["hr/vacation"]);
           this.VacationForm = this.fb.group({
            n_doc_no :[''],
            n_employee_id :[''],
            d_doc_date:[(new Date()).toISOString().substring(0,10),Validators.required],
            d_vacation_end_date :[''],
            d_vacation_start_date:[''],
            n_DataAreaID:[''], 
            n_alternative_employee_no :[''],
            n_from_month :[''],
            n_from_year :[''],
            n_to_month :[''],
            n_to_year:[''],
            d_vacation_due_date:[''], 
            n_vacation_period :[''],
            b_not_discount_from_salary :[''],
            b_not_discount_emp_insurance :[''],
            b_confirm :[''],
            n_visa_count_of_months:[''],
            n_visa_count_of_days:[''], 
            d_higri_visa_expire_date :[''],
            d_visa_expired_date :[''],
            s_Notes :[''],
            n_Allowed_period :[''],
            n_Rule_Balance:[''],
            n_prev_vacations:[''], 
            n_Balance_After_Vacation :[''],
            n_full_salary :[''],
            n_basic_salary :[''],
            n_work_days                     :[],
            n_month_due                     :[],
            n_other_due                     :[],
            n_vacation_additional_days_count:[],
            n_vacation_additional_Hours_coun:[],
            n_additional_due                :[],
            n_discount_value                :[],
            n_vacation_salary               :[],
            n_vacation_total_value          :[],
            n_vacation_paid_days            :[],
            n_vacation_Unpaid_days          :[],
            n_vacation_Requested_total_days :[],
            n_vacation_endservice_no        :[],
            d_calc_vacation_to_date         :[]
      
          });
       }
 
     });
  }

 

 
}

}
