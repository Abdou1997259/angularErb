import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptServiceService {

  constructor() { }


  loadScripts():void{
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../assets/dist/js/pages/dashboard.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script); 

    script.innerHTML = '';
    script.src = '../assets/plugins/sparklines/sparkline.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script); 
 
  }



  
}
