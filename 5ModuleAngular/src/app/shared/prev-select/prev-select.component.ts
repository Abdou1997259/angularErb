import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { bankService } from 'src/app/Core/Api/FIN/bank.service';
import { EmpClassService } from 'src/app/Core/Api/HR/emp-class.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { CurrencyLKPService } from 'src/app/Core/Api/LookUps/currency-lkp.service';
import { GenerealLookup } from 'src/app/Core/Api/LookUps/lookUps.service';
import { SCstockInService } from 'src/app/Core/Api/SC/sc-stock-in.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { SelectServerSideComponent } from '../select-server-side/select-server-side.component';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';
import { BANKS } from '../demodata';

@Component({
  selector: 'prev-select',
  templateUrl: './prev-select.component.html',
  styleUrls: ['./prev-select.component.css']
})
export class PrevSelectComponent implements OnInit {

  
   /** list of banks */
   protected banks: any[] = BANKS;


   @Input() TextField:string=''
   @Input() ValueField:string=''
 
   @Output() onChange= new EventEmitter();

   @Input() selectForm! : FormGroup;
   @Input() controlName! : string;
   @Input() data! : any[];
   @Input() Fieldwidth!:any;
   @Input() FiedlHeight!:any;
   @ViewChild("options") options!:ElementRef;
   /** control for the selected bank for server side filtering */
   public selectCtrl: FormControl = new FormControl();
 
   /** control for filter for server side. */
   FilteringCtrl: FormControl = new FormControl();
   @Output() OnSearch = new EventEmitter();
   @Output() onSelectionChange= new EventEmitter();
   /** indicate search operation is in progress */
   @Input() searching: boolean = false;
   arrayofStrings:string='';
   arrayofData:any[]=[];
   selectedTexts:any[]=[]
   theOptions:any[]=[]
   selectedOptionsSubscription!:Subscription|undefined
   /** list of banks filtered after simulating server side search */
   @Input() filteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
   selectionOptions:Array<any>=[]
   /** Subject that emits when the component has been destroyed. */
   protected _onDestroy = new Subject<void>();
 
   ngOnInit() {
     // listen for search field value changes
     this.initialServerSizeSelect();
     this.filteredServerSide.subscribe(data=>{
      
      this.arrayofData=data;
      this.selectedTexts = this.theOptions.map(value => {

        const option = this.arrayofData.find(obj => obj[this.ValueField] === value);
        return option ? option[this.TextField] : '';
      });
       this.arrayofStrings = this.selectedTexts.join(', ');
     })
     this.selectedOptionsSubscription = this.selectForm.get(this.controlName)?.valueChanges.subscribe(values => {

       this.theOptions=values

    });



   }
 
   constructor(private _customerService : CustomerService,private formBuilder: FormBuilder){
     
   }
   isSelected(value: any): boolean {
    const selectedValues = this.selectForm.get(this.controlName)?.value || []; // Provide an empty array if null or undefined
    return selectedValues.includes(value);
  }

  
  DisplayArray(event:any){

    const arr =Array.from(event.value);
     this.selectedTexts = arr.map(value => {

      const option = this.arrayofData.find(obj => obj[this.ValueField] === value);
      return option ? option[this.TextField] : '';
    });
    this.arrayofStrings = this.selectedTexts.join(', ');
  }
   initialServerSizeSelect()
   {
 
     this.FilteringCtrl.valueChanges.subscribe(search=>{
 
       this.OnSearch.emit(search);
       this.onSelectionChange.emit();
     });
 //     this.FilteringCtrl.valueChanges
 // .pipe(
  
 //   filter(search => !!search),
 //   tap(() => this.searching = true),
 //   //takeUntil(this._onDestroy),
 
 
 //   debounceTime(200),
 //   map(  search => {
       
 //      this._customerService.GetAllCustomer().subscribe(res=>{
 //       this.customers=res;
 //       console.log('functon end');
 //       this.searching = false; 
   
 //     })
 //     console.log('map end');
 //     return this.customers.filter(x => x.s_customer_name.toLowerCase().indexOf(search) > -1);
     
      
 //   }),
 //   delay(500)
 //  )
 //  .subscribe( filteredBanks => {
 //    this.searching = false;
 //    this.filteredServerSide.next( filteredBanks);
 //  });
 

  
 
   }
 
   sendStoreId(value)
   {
  
     debugger
  
     this.onChange.next(value);
   }
   ngOnDestroy() {
     this._onDestroy.next();
     this._onDestroy.complete();
   }

}
