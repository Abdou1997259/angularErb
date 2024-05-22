import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, ReplaySubject, Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { CustomerService } from 'src/app/_Services/Customer/customer.service';
import { BANKS } from '../demodata';

@Component({
  selector: 'select-keep-last-change',
  templateUrl: './select-keep-last-change.component.html',
  styleUrls: ['./select-keep-last-change.component.css']
})
export class SelectKeepLastChangeComponent implements OnInit {

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
  @Input() filteredServerSide!: BehaviorSubject<any[]>

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  ngOnInit() {


    if (!this.filteredServerSide) {
      this.filteredServerSide = new BehaviorSubject<any[]>([]);
    }
  
    // listen for search field value changes
    this.initialServerSizeSelect();

  }

  constructor(private _customerService : CustomerService){

  }

  initialServerSizeSelect()
  {

    this.FilteringCtrl.valueChanges.pipe(
      debounceTime(300), // Debounce time to wait for user input
      distinctUntilChanged(), // Emit only distinct values
      filter(search => search !== '') // Filter out empty strings
    ).subscribe(search=>{
   debugger
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
