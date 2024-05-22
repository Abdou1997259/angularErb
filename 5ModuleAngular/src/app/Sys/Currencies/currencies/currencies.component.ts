import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/base/base.component';
import { UserService } from 'src/app/_Services/user.service';
import { CurrenciesService } from 'src/app/Core/Api/Sys/currencies.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent extends BaseComponent  implements OnInit {


  dtOptions: DataTables.Settings = {};
  CurrencyForm!: FormGroup;
  form: any;
  myDatepipe!: any;
  DocNo : any;
  DataAreaNo : any;
  bisMainCurrency=false;
  mainCurrency:number=0;
  taxStatus:boolean=false;
  totalValue:number=0;
  expensesValue:number=0;
  totalDiscount:number=0;
  isSelectedTrans:boolean=false;
  transNo:any='';
  editMode:boolean=false;
  showspinner:boolean=false;

    constructor(private fb:FormBuilder
    ,private _CurrenciesService : CurrenciesService
    ,public dialog: MatDialog
    ,private _activatedRoute: ActivatedRoute
    ,private _notification: NotificationServiceService
    ,private _router : Router
    ,private _route : ActivatedRoute
    ,private userservice:UserService) {
      super(_route.data,userservice);

      this.myDatepipe = new DatePipe('en-US');
      this.dtOptions = {

        pagingType: 'full_numbers',
        pageLength: 2,
        processing: true

      };

      this.CurrencyForm = this.fb.group({
        n_currency_id: '',
        s_currency_name:new FormControl('', Validators.required),
        s_currency_name_eng:'',
        b_local_currency:'',
        s_tafkita_number_name:'',
        s_tafkita_fraction_name: '',
        s_tafkita_description:'',
        n_currency_coff:'',
        n_DataAreaID:'',
        n_UserAdd:'',
        d_UserAddDate:'',
        n_current_branch:'',
        n_current_company:'',
        n_current_year:'',
      });
     }



     translateData()
     {
       setTimeout(() => {
         if(window.sessionStorage.getItem("lan")==="English")
       {
         debugger
         let listOfElement=document.getElementsByClassName("translatedata");
         let regex=/[\u0600-\u06FF]/
         for(let i=0;i<listOfElement.length;++i)
         {
         
             if( regex.test(listOfElement[i].innerHTML))
                {
                
                 let enWord=listOfElement[i].getAttribute("data-en") as string ;
                 let arword=listOfElement[i].innerHTML;
                 let swapper=enWord;
                 enWord=arword;
                 arword=swapper;
                 listOfElement[i].setAttribute("data-en",enWord);
                 listOfElement[i].innerHTML=arword;
                }
         }
     
       }
       }, 1000);
       
     }
     translatefun()
     {
       debugger
       if(window.sessionStorage.getItem("lan")==="English")
       {
         let listOfElement=document.getElementsByClassName("translate");
         let regex=/[\u0600-\u06FF]/
         for(let i=0;i<listOfElement.length;++i)
         {
             if(listOfElement[i].nodeName=='INPUT')
             {
               let inputElement=(listOfElement[i] as HTMLInputElement);
               if( regex.test(inputElement.value))
               {
               
                let enWord=listOfElement[i].getAttribute("data-en") as string ;
                let arword=inputElement.value;
                let swapper=enWord;
                enWord=arword;
                arword=swapper;
                listOfElement[i].setAttribute("data-en",enWord);
                inputElement.value=arword;
               }
   
             }
             else
             {
               if( regex.test(listOfElement[i].innerHTML))
               {
               
                let enWord=listOfElement[i].getAttribute("data-en") as string ;
                let arword=listOfElement[i].innerHTML;
                let swapper=enWord;
                enWord=arword;
                arword=swapper;
                listOfElement[i].setAttribute("data-en",enWord);
                listOfElement[i].innerHTML=arword;
               }
         
            
         }
     
       }
       }
     }
 

 
     override ngOnInit(): void {
       this.DocNo = this._activatedRoute.snapshot.paramMap.get('id');
       this.DataAreaNo = Number(this.userservice.GetDataAreaID());


       if(this.DocNo !=null && this.DocNo > 0 )
       {
          this.editMode=true;
          this.showspinner=true;
          this._CurrenciesService.GetCurrencyByID(this.DocNo).subscribe(data=>{      
            debugger;
            this.CurrencyForm.patchValue(data);
            this.showspinner=false;
            this.editMode=false;
          });
       }

       this.translatefun();
       this.translateData();
     }
 
 
     save() {

       this.showspinner=true;
       this.disableButtons();
 
       var formData: any = new FormData();
       this.CurrencyForm.controls['n_currency_id'].enable();

       formData.append("n_currency_id", this.CurrencyForm.value.n_currency_id ?? 0);
       formData.append("s_currency_name", this.CurrencyForm.value.s_currency_name);
       formData.append("s_currency_name_eng", this.CurrencyForm.value.s_currency_name_eng);
       formData.append("b_local_currency", this.CurrencyForm.value.b_local_currency);
       formData.append("s_tafkita_number_name", this.CurrencyForm.value.s_tafkita_number_name);
       formData.append("s_tafkita_fraction_name", this.CurrencyForm.value.s_tafkita_fraction_name);
       formData.append("s_tafkita_description", this.CurrencyForm.value.s_tafkita_description);
       formData.append("n_currency_coff", this.CurrencyForm.value.n_currency_coff ?? 0);
       formData.append("n_DataAreaID", this.CurrencyForm.value.n_DataAreaID ?? 0);
       formData.append("n_UserAdd", this.CurrencyForm.value.n_UserAdd ?? 0);
       formData.append("d_UserAddDate", this.CurrencyForm.value.d_UserAddDate);

       if(this.DocNo !=null && this.DocNo > 0 ){
 
         this._CurrenciesService.SaveEdit(formData).subscribe(data=>{
           this.showspinner=false;
           this.enableButtons();
           this. _notification.ShowMessage(data.msg,data.status);
           if(data.status==1){
             this._router.navigate(['/sys/currencylist']);
           }
         });
       }
       else
       {
         this._CurrenciesService.Save(formData).subscribe(data=>{
         this.showspinner=false;
         this.enableButtons();
         this. _notification.ShowMessage(data.msg,data.status);
           if(data.status==1){
             this._router.navigate(['/sys/currencylist']);
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
