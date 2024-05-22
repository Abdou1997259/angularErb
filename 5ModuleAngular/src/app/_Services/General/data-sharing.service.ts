import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  constructor() { }


  
  isLoaderShown = new BehaviorSubject<boolean>(false);
  iconState = new BehaviorSubject<boolean>(false);
  
  public showLoader() {
    this.isLoaderShown.next(true);
  }

  public hideLoader() {
    this.isLoaderShown.next(false);
  }
  public sendIconState(Iconstate)
  {
     this.iconState.next(Iconstate) ;
  }

}
