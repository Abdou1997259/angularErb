import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil} from 'rxjs/operators';
import { BANKS } from '../demodata';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';




@Component({
  selector: 'select-server-side',
  templateUrl: './select-server-side.component.html',
  styleUrls: ['./select-server-side.component.css']
})
export class SelectServerSideComponent implements OnInit, OnDestroy {

  /** list of banks */
  protected banks: any[] = BANKS;


  @Input() TextField:string=''
  @Input() ValueField:string=''

  @Output() onChange= new EventEmitter();
  @Input() selectForm! : FormGroup;
  @Input() disabled: boolean = false;
  @Input() controlName! : string;
  @Input() data! : any[];
  @Input() Fieldwidth!:any;

  /** control for the selected bank for server side filtering */
  public selectCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  FilteringCtrl: FormControl = new FormControl();
  @Output() OnSearch = new EventEmitter();
  @Output() onSelectionChange= new EventEmitter();
  /** indicate search operation is in progress */
  @Input() searching: boolean = false;


  /** list of banks filtered after simulating server side search */
  @Input() filteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  ngOnInit() {



    // listen for search field value changes
    this.initialServerSizeSelect();

  }

  constructor(private _customerService : CustomerService){

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



    this.onChange.next(value);
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
