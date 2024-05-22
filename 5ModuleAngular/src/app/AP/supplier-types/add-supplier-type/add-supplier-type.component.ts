import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { SupplierType } from 'src/app/Core/Api/AP/supplier-type.service';
import { CashService } from 'src/app/Core/Api/FIN/cash.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-add-supplier-type',
  templateUrl: './add-supplier-type.component.html',
  styleUrls: ['./add-supplier-type.component.css']
})
export class AddSupplierTypeComponent implements OnInit {
 //START CONCTRUCTOR
  constructor(
    private fb:FormBuilder
   ,private dialogRef:MatDialog
   ,private http:HttpClient,
    private _SERVICE:SupplierType,
    private _activatedRoute: ActivatedRoute,
    private _notification: NotificationServiceService,
    private cachService:CashService,

   private _router:Router
  ) {

    // FORM DEFIFNITION
    this.typesForm = this.fb.group({
      n_supplier_type_id: '',
      n_DataAreaID: '',
      s_supplier_type_name: ['', Validators.required],
      s_supplier_type_name_eng: '',
      n_digit_no:'',
      s_Suppliers_s_Sub_Account:'',
      n_UserAdd: '',
      d_UserAddDate: '',
      n_UserUpdate: '',
      d_UserUpdateDate: ''
    });
    // END FORM DEFIFNTION
   }

  // END constructor

  // START VARIABLES DECLARTIONS
  showspinner= false;
  
 typesForm!: FormGroup ;
  DocNo!: any;
  accounts: any[]=[];
  isEnglish:boolean=false;
  searchingAccounts:boolean=true
  Edit: boolean=false;
  Add: Boolean=true;
  Accounts:any=[];
  @ViewChild("inputshow") inputshow!:ElementRef;
  filteredaccounts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  DataAreaNo: any;
   // END VARIABLES DECLARTIONS


  //  START HOOKS METHODS
  ngOnInit(): void {
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.typesForm.get("n_supplier_type_id")?.patchValue(this.DocNo);
    //EXCUTE IN UPDATING MODE
   if(this.DocNo !=null && this.DocNo > 0 ){
    this.showspinner=true;
    this._SERVICE.GetByID(this.DocNo).subscribe(data=>{
      debugger
      // this.inputshow.nativeElement.style.display="block";
      this.typesForm.patchValue(data);
      // this.storeForm.patchValue({ s_employee_name: data["s_employee_name"]});
      this.Add=false;
      this.Edit=true;
      this.showspinner=false;
    });
 }



LangSwitcher.translateData(1);
LangSwitcher.translatefun();
this.isEnglish=LangSwitcher.CheckLan();
this.searchAccounts('');
}

  // END HOOKS METHODS


  // START FUNCTIONS
  disableButtons() {
    debugger;
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }
  
  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }
  searchAccounts(value :any){

    this.searchingAccounts=true;
    this.cachService.GetAccounts(value).subscribe(res=>{
      this.Accounts=res;
      this.filteredaccounts.next( this.Accounts.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingAccounts=false;
    });
  
  
    
  }
  save()
  {
  if(this.typesForm.get("s_supplier_type_name")?.invalid)
    {
      this.showspinner=false;
      if(this.isEnglish)
        this._notification.ShowMessage('Please insert type name',3)
      else{
        this._notification.ShowMessage("منفضلك  اسم النوع",3)
        return
      }
    }
  
  var formData: any = new FormData();
  formData.append("n_supplier_type_id",this.typesForm.value.n_supplier_type_id ?? 0);
  formData.append("s_supplier_type_name",this.typesForm.value.s_supplier_type_name)
  formData.append("s_supplier_type_name_eng",this.typesForm.value.s_supplier_type_name_eng)
  formData.append("s_Suppliers_s_Sub_Account",this.typesForm.value.s_Suppliers_s_Sub_Account)
  formData.append("n_UserAdd",this.typesForm.value.n_UserAdd ?? 0)
  formData.append("d_UserAddDate",this.typesForm.value.d_UserAddDate ?? '')
  formData.append("n_UserUpdate",this.typesForm.value.n_UserUpdate ?? 0)
  formData.append("d_UserUpdateDate",this.typesForm.value.d_UserUpdateDate ?? '')
  


  
  this.showspinner=true;
  this.disableButtons();
  if(this.DocNo != null && this. DocNo > 0)
  {
    this._SERVICE.Update(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status);
      else
  
      this._notification.ShowMessage(data.msg,data.status);
      if(data.status==1){


        this._router.navigate(['/ap/supplierTypes']);
        this.typesForm = this.fb.group({
          n_supplier_type_id: '',
          n_DataAreaID: '',
          s_supplier_type_name: ['',Validators.required],
          s_supplier_type_name_eng: '',
          n_digit_no:'',
          s_Suppliers_s_Sub_Account:'',
      
        });
      }


  });

  }
  else
  {
    this._SERVICE.Save(formData).subscribe(data=>{

      this.enableButtons();
      this.showspinner=false;
      if(this.isEnglish)
      this._notification.ShowMessage(data.Emsg,data.status);
      else
  
      this._notification.ShowMessage(data.msg,data.status);
       if(data.status==1){


         this._router.navigate(['/ap/supplierTypes']);
         this.typesForm = this.fb.group({
          n_supplier_type_id: '',
          n_DataAreaID: '',
          s_supplier_type_name: ['',Validators.required],
          s_supplier_type_name_eng: '',
          n_digit_no:'',
          s_Suppliers_s_Sub_Account:''
         });
       }



   });

  }


   }

  // END FUNCTIONS
}
