import {Injectable} from '@angular/core'
import { Subject } from 'rxjs'
@Injectable({
    providedIn:'root'
})
export class DataSharingSenderService{
    public data =new Subject<any>();
    constructor(){

    }
    sendDATA(data){
        this.data.next(data);
    }
    
}
