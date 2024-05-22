import { Component, OnInit } from '@angular/core';
import { UserService } from '../_Services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  subscription : any;
  username : string='';
  year:any;
 constructor(private userservice : UserService) { 
  

 } 

 ngOnInit(): void {
   this.subscription = this.userservice.currentusername.subscribe(x=>this.username = x);
   this.year=(new Date()).getFullYear();
 } 
}
