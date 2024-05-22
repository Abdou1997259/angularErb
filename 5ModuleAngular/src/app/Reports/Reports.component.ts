import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiConfig } from '../_Setting/ApiConfig';

@Component({
  selector: 'app-Reports',
  templateUrl: './Reports.component.html',
  styleUrls: ['./Reports.component.css']
})
export class ReportsComponent implements OnInit {


  @Input() url!: string ;
  urlSafe!: SafeResourceUrl;
  
  constructor(public sanitizer: DomSanitizer ,private  route: ActivatedRoute) { }

  ngOnInit() {
    var _url = this.route.snapshot.paramMap.get('data');
  if(_url !=null)
  {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(ApiConfig.Apiurl+_url?.toString());
  }
  else
  {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url); 

   }
  }

}
