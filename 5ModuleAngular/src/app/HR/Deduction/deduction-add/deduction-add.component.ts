import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { bankService } from 'src/app/Core/Api/FIN/bank.service';
import { DeductionService } from 'src/app/Core/Api/HR/deduction.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { DeductionAllownaceComponent } from '../deduction-allownace/deduction-allownace.component';

@Component({
  selector: 'app-deduction-add',
  templateUrl: './deduction-add.component.html',
  styleUrls: ['./deduction-add.component.css']
})
export class DeductionAddComponent implements OnInit {
  //variable declaration
  DeductionFrom !:FormGroup
  showspinner=false;
  IDNo!:any;
  makeDetailsReadOnly=false;
  Edit: boolean=false;
  filteredDedutionCatServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDedutionPayServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  nclassId:boolean=false
  searchingDeductionPay:boolean=false;
  serchingCatDedutions:boolean=false;
  DedcutionData:any=[];
  DedcutionCatata:any=[];
  Add: Boolean=true;
  DataAreaNo: any;
  items:any[]=[]
  _currentAccountIndex:number=0;
  @ViewChild("showID") showID!:ElementRef;
  currenciesList!: any;
  currencyFilteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("Serverside")   selectserver!:SelectServerSideComponent;

  searchingVlues:any[]=[];
  DocNo:any;
  isEnglish:boolean=false;
  //end declartion

  constructor(private fb:FormBuilder, private router:Router, private _activatedRoute:ActivatedRoute, private dialogRef:MatDialog,
    private _SERVICE:DeductionService, private _notification: NotificationServiceService, private _getBanks:bankService,
    private _currency: CurrencyLKPService, private _lookup:GenerealLookup, private _serviceOut:SCstockInService)
  {
    this.DeductionFrom = this.fb.group({
      n_deduction_id: [''],
      s_deduction_name: ['', Validators.required],
      s_deduction_name_eng: [''],
      n_discountFrom: [1],
      n_Calc_Type: [1],
      b_use_cost_center: [''],
      n_payment_type: ['', Validators.required],
      n_category: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
      py_deduction_allowance:this.fb.array([])
    });
  }
  //end Constructor

  //Onint
  ngOnInit(): void {
    this.showspinner = true;
    this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
    this.serchPayDedutions('')
    this.serchCatDedutions('')
    this._SERVICE.AllDeductionAllowances().subscribe((res)=>{
     this.items = res;
   });

    if(this.DocNo != null && this. DocNo > 0)
    {
      this.nclassId=true
      this._SERVICE.GetByID(this.DocNo).subscribe((data)=>{
        this.DeductionFrom.patchValue(data)
        if(data.n_discountFrom = 1)
        {
          this.DedcutionData.controls["n_discountFrom"].onSelection();
        }

        data.py_deduction_allowance.forEach(data => {
          this.py_deduction_allowance.push(this.newItemssdetailsWithData(data.n_serial,data.n_allowance_id,data.s_allowance_name));
        });

        this.showspinner = false;
      });
    }
    else
      this.makeDetailsReadOnly=true


   this.isEnglish=LangSwitcher.CheckLan();
   LangSwitcher.translateData(1);
   LangSwitcher.translatefun();
}
  //end OnInit



  get py_deduction_allowance()
  {
    return this.DeductionFrom.get("py_deduction_allowance") as FormArray;
  }

  serchPayDedutions(value :any){
   debugger;
    this.searchingDeductionPay=true;
    this._SERVICE.GetEmpPayments(value).subscribe(res=>{
      debugger
      this.DedcutionData=res;
      this.filteredDedutionPayServerSide.next(  this.DedcutionData.filter(x => x.s_pay_name.toLowerCase().indexOf(value) > -1));
      this.searchingDeductionPay=false;
    });
  }

  serchCatDedutions(value :any){
    debugger;
     this.serchingCatDedutions=true;
     this._SERVICE.GetDeCCat(value).subscribe(res=>{
       debugger
       this.DedcutionCatata=res;
       this.filteredDedutionCatServerSide.next(  this.DedcutionCatata.filter(x => x.s_name.toLowerCase().indexOf(value) > -1));
       this.serchingCatDedutions=false;
     });
   }

  //function creation
  removeItems(i:number)
  {
    this.py_deduction_allowance.removeAt(i);
  }

  addItemsDetails() {
    this.py_deduction_allowance.push(this.newItemssdetails(this.py_deduction_allowance.length+1));
  }

  loadItems(i:number){
    this._currentAccountIndex=i;
    const dialogRef = this.dialogRef.open(DeductionAllownaceComponent, {
      width: '700px',
      height:'600px',
      data: {  }
    });
  dialogRef.afterClosed().subscribe(res => {

    ((this.DeductionFrom.get("py_deduction_allowance") as FormArray).at(this._currentAccountIndex) as FormGroup).get('n_allowance_id')?.patchValue(res.data.n_allowance_id);
    ((this.DeductionFrom.get("py_deduction_allowance") as FormArray).at(this._currentAccountIndex) as FormGroup).get('s_allowance_name')?.patchValue(res.data.s_allowance_name);




        //this.calctotal();
  });

  }

  newItemssdetails(line:number=0): FormGroup {

    return this.fb.group({
      n_serial:line,
      n_allowance_id:[''],
      s_allowance_name:[''],

    })
 }

 newItemssdetailsWithData(line_p,n_allowance_id,s_allowance_name): FormGroup {
  return this.fb.group({
    n_serial:line_p,
    n_allowance_id:[n_allowance_id],
    s_allowance_name:[s_allowance_name],
  })
  }

  getItemsNow($event,i)
  {
    this._currentAccountIndex=i;
    let arr=this.items.filter((ele)=>
    {
     return ele.s_item_id==$event.target.value
    });
    ((this.DeductionFrom.get("py_deduction_allowance") as FormArray).at(i) as FormGroup).get("s_allowance_name")?.patchValue(arr[0]?.s_allowance_name);
  }

  disableDetails(event)
  {
    console.log(event.target.value)
    if(event.target.value==1){
      this.makeDetailsReadOnly=true
      this.py_deduction_allowance.clear();
    }
    else
    {
      this.makeDetailsReadOnly=false
      this.addItemsDetails();
    }
  }

  save(){
    this.disableButtons();
    this.showspinner = true;
    var formData=new FormData();
    formData.append("n_deduction_id",this.DeductionFrom.value.n_deduction_id ?? "0");
    formData.append("s_deduction_name",this.DeductionFrom.value.s_deduction_name ?? '');
    formData.append("s_deduction_name_eng",this.DeductionFrom.value.s_deduction_name_eng ?? '');
    formData.append("n_payment_type",this.DeductionFrom.value.n_payment_type ?? 0)
    formData.append("n_category",this.DeductionFrom.value.n_category ?? 0);
    formData.append("n_discountFrom",this.DeductionFrom.value.n_discountFrom ?? 0)
    formData.append("n_Calc_Type",this.DeductionFrom.value.n_Calc_Type ?? 0);
    formData.append("b_use_cost_center",this.DeductionFrom.value.b_use_cost_center ?? false);
    formData.append('n_DataAreaID', this.DeductionFrom.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.DeductionFrom.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.DeductionFrom.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.DeductionFrom.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.DeductionFrom.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.DeductionFrom.value.n_current_company ?? 0);
    formData.append('n_current_year', this.DeductionFrom.value.n_current_year ?? 0);

    if(this.DeductionFrom.value.py_deduction_allowance.length==0)
    {
      formData.append(`py_deduction_allowance[${0}].n_serial`,"1")
      formData.append(`py_deduction_allowance[${0}].n_allowance_id`,"0")
      formData.append(`py_deduction_allowance[${0}].s_allowance_name`,"")
    }
    else
    {
      for(var i=0;i< this.DeductionFrom.value.py_deduction_allowance.length;++i){
        formData.append(`py_deduction_allowance[${i}].n_serial`, i.toString())
        formData.append(`py_deduction_allowance[${i}].n_allowance_id`,this.DeductionFrom.value.py_deduction_allowance[i].n_allowance_id)
        formData.append(`py_deduction_allowance[${i}].s_allowance_name`,this.DeductionFrom.value.py_deduction_allowance[i].s_allowance_name)
      }
    }

    if(this.DocNo != null && this. DocNo > 0)
    {
      this._SERVICE.Edit(formData).subscribe((data)=>{
      if(data.status=1)
      {
        if(this.isEnglish)
        this._notification.ShowMessage('Updated successfully',1)
      else
          this._notification.ShowMessage("تم  التعديل  بنجاح",1);
           this.router.navigate(["hr/deduction"]);
           this.DeductionFrom = this.fb.group({
            n_deduction_id :[''],
            s_deduction_name :['',Validators.required],
            s_deduction_name_eng :[''],
            n_discountFrom :[''],
            n_Calc_Type:[''],
            b_use_cost_center:[''],
            n_payment_type:['',Validators.required],
            n_category:[''],
            py_deduction_allowance:this.fb.array([])
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
            this.router.navigate(["hr/deduction"]);
            this.DeductionFrom = this.fb.group({
             n_deduction_id :[''],
             s_deduction_name :[''],
             s_deduction_name_eng :[''],
             n_discountFrom :[''],
             n_Calc_Type:[''],
             b_use_cost_center:[''],
             n_payment_type:[''],
             n_category:[''],
             py_deduction_allowance:this.fb.array([])
          });
        }
      });
    }
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }
}
