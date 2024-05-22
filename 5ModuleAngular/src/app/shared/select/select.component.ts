import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BANKS, Bank } from '../demodata';
import { MatSelect } from '@angular/material/select';

 

@Component({
  selector: 'app-select',
  templateUrl: './Select.component.html',
  styleUrls: ['./Select.component.css']
})
export class SelectComponent implements OnInit, AfterViewInit, OnDestroy,OnChanges {

  /** list of banks */
  @Input() data: any[] =[]
  @Input() TextField:string=''
  @Input() ValueField:string=''
  @Input() selectForm! : FormGroup;
  @Input() controlName! : string;
  @Input() ComboId!:number
  
  /** control for the selected bank */
  @Input() selectCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public FilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public dataSource: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect') singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor() { }
  
  ngOnInit() {
    // set initial selection
 
    // this.selectCtrl.setValue(this.data[1]);
    if(this.ComboId > 0){
        
    }
    else
    { 
      this.dataSource.next(this.data.slice());
    }
   

    // listen for search field value changes
    this.FilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterData();
      });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.data){
      if(changes['data']){

        this.dataSource.next(this.data.slice());

        console.log(this.data);
        // listen for search field value changes
         this.FilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
           .subscribe(() => {
             this.filterData();
           });

          }
    }
  }


  ngAfterViewInit() {
   
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */


  protected filterData() {
    if (!this.data) {
      return;
    }
    // get the search keyword
    let search = this.FilterCtrl.value;
    if (!search) {
      this.dataSource.next(this.data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.dataSource.next(
      this.data.filter(x => x[this.TextField].toLowerCase().indexOf(search) > -1)
    );
  }

}
