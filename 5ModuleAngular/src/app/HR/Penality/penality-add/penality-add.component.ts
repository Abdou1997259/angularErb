import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  selector: 'app-penality-add',
  templateUrl: './penality-add.component.html',
  styleUrls: ['./penality-add.component.css']
})
export class PenalityAddComponent implements OnInit {

   
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
    this.PenalityFrom=this.fb.group({
      n_doc_no :[''],
      s_pental_name :[''],
      s_pental_name_eng :[''],
      s_notes :[''],
      n_pen_days:[''],
      n_deduction_id:['']
      
    });
    if(this.DocNo != null && this. DocNo > 0)
    {
      this.nclassId=true
      
      this._SERVICE.GetByID(this.DocNo).subscribe((data)=>{
        debugger;
        this.PenalityFrom.patchValue(data)

        // n_Collection_rate:[''],
    
      
        // s_Return_Check_account:[''],
        // s_Return_Check_account_name:['']
    




      
      
      })

   


     
    }
    


   this.isEnglish=LangSwitcher.CheckLan();
   LangSwitcher.translateData(1);
   LangSwitcher.translatefun();
  debugger
   this.serchDedutions('')
   
}
  //end OnInit 


  //variable declaration

  PenalityFrom !:FormGroup
  showspinner=false;
  IDNo!:any;
  Edit: boolean=false;
  filteredAccServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDedutionServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  nclassId:boolean=false
  searchingDeduction:boolean=false;
  searchingEmpClassCash:boolean=false;
  DedcutionData:any=[];
  EmpClassAccData:any=[];
  Add: Boolean=true;
  DataAreaNo: any;
  @ViewChild("showID") showID!:ElementRef;
  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;

  serchDedutions(value :any){
   debugger;
    this.searchingDeduction=true;
    this._SERVICE.GetDedution(value).subscribe(res=>{
      this.DedcutionData=res;
      this.filteredDedutionServerSide.next(  this.DedcutionData.filter(x => x.s_deduction_name.toLowerCase().indexOf(value) > -1));
      this.searchingDeduction=false;
    });
  }


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
    if(this.PenalityFrom.get("s_pental_name")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert  class name',3)
    else
      this._notification.ShowMessage("منفضلك  اسم النوع",3)
      return
    }
    if(this.PenalityFrom.get("n_deduction_id")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert the valut',3)
    else
      this._notification.ShowMessage("منفضلك  اسم الخزينة",3)
      return
    }
    if(this.PenalityFrom.get("n_pen_days")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish) 
      this._notification.ShowMessage('Please insert account',3)
    else
      this._notification.ShowMessage("منفضلك  ادخل حساب",3)
      return
    }
   var formData=new FormData();


 
  formData.append("n_doc_no",this.PenalityFrom.value.n_doc_no ?? "0");
  formData.append("s_pental_name",this.PenalityFrom.value.s_pental_name );
  formData.append("s_pental_name_eng",this.PenalityFrom.value.s_pental_name_eng  );
  formData.append("n_pen_days",this.PenalityFrom.value.n_pen_days )
  formData.append("s_notes",this.PenalityFrom.value.s_notes );

  formData.append("n_deduction_id",this.PenalityFrom.value.n_deduction_id  );
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
         this.router.navigate(["hr/penality"]);
         this.PenalityFrom = this.fb.group({
          n_doc_no :[''],
          s_pental_name :[''],
          s_pental_name_eng :[''],
          s_notes :[''],
          n_pen_days:[''],
          n_deduction_id:['']
          
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
           this.router.navigate(["hr/penality"]);
           this.PenalityFrom = this.fb.group({
            n_doc_no :[''],
            s_pental_name :[''],
            s_pental_name_eng :[''],
            s_notes :[''],
            n_pen_days:[''],
            n_deduction_id:['']
            
         });
       }
 
     });
  }

 

 
}

}
