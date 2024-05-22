import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';
import { customer } from 'src/app/_model/Cutomer/CustomerModel';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

declare var $:JQueryStatic;
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  constructor(
      private _customerService : CustomerService
     ,private activatedRoute: ActivatedRoute
     ,private _notification: NotificationServiceService
     ,private router : Router
     ) { }

     TaxesTypes:any;
     SelectedTax:any;
  CustomerForm = new FormGroup({
    n_customer_id: new FormControl(),
    s_customer_name: new FormControl(''),
    s_customer_address: new FormControl(''),
    s_customer_phone_no: new FormControl(''),
    s_AttachmentPerson: new FormControl(''),
    s_ExtraNote: new FormControl(''),
    s_activity: new FormControl('')

  });


  showspinner:boolean=false;
  Save(){

    this.showspinner=true;
    var formData: any = new FormData();


    formData.append("n_customer_id", this.CustomerForm.value.n_customer_id);
    formData.append("s_customer_name", this.CustomerForm.value.s_customer_name);
    formData.append("s_customer_address", this.CustomerForm.value.s_customer_address);
    formData.append("s_customer_phone_no", this.CustomerForm.value.s_customer_phone_no);
    formData.append("s_AttachmentPerson", this.CustomerForm.value.s_AttachmentPerson);
    formData.append("s_ExtraNote", this.CustomerForm.value.s_ExtraNote);
    formData.append("s_activity", this.CustomerForm.value.s_activity);

       this._customerService.SaveCustomer(formData).subscribe((data)=>{

        this._notification.ShowMessage(data.UserMessage,data.StatusCode);
         this.showspinner=false;
         this.router.navigate(['/customer']);

       });

  }
  currentId:any;
  SelectedTaxType:number=0;
  LoadComboTax(selecedval : number):void{
    this._customerService.GetTaxesTypes().subscribe((data)=>{
      this.TaxesTypes = data;
        //$('#n_tax_type').val(selecedval).trigger('change');
     });
  }
  ngOnInit(): void {
     //this.LoadComboTax(0);

     this.currentId= this.activatedRoute.snapshot.paramMap.get('id');

     if(this.currentId != null && this.currentId > 0 ){
      this.showspinner=true;
        this._customerService.GetById(this.currentId).subscribe((data)=>{
         console.log(data);
         //this.LoadComboTax(data.n_tax_type);

           this.CustomerForm.patchValue(data);

           this.showspinner=false;
        });
     }
     this.translateData();
     this.translatefun();

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
    }, 0);

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


}
