import { AfterContentChecked, AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../_Services/user.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})

export class BaseComponent implements OnInit, AfterViewChecked {
  formname: string = '';
  cannew: boolean = false;
  canedit: boolean = false;
  candelete: boolean = false;
  canconfirm: boolean = false;
  canshow: boolean = false;

  constructor(private data: Observable<any>, private _userservice: UserService) {
    this.data.subscribe( data => {
      this.formname = data['formname'];
      this.cannew = this._userservice.IsHasPrev(this.formname, 'new');
      this.canedit = this._userservice.IsHasPrev(this.formname, 'edit');
      this.candelete = this._userservice.IsHasPrev(this.formname, 'delete');
      this.canconfirm = this._userservice.IsHasPrev(this.formname, 'confirm');
      this.canshow = this._userservice.IsHasPrev(this.formname, 'list');
    });
  }

  ngAfterViewChecked(): void {
  }

  ngOnInit(): void {
  }
}
