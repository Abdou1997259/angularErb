import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ScItemTypesService } from 'src/app/Core/Api/SC/sc-item-types.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { UserService } from 'src/app/_Services/user.service';
import { BaseComponent } from 'src/app/base/base.component';
import { ApiConfig } from 'src/app/_Setting/ApiConfig';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-sc-item-types-list',
  templateUrl: './sc-item-types-list.component.html',
  styleUrls: ['./sc-item-types-list.component.css']
})
export class ScItemTypesListComponent extends BaseComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  itemData!: any;
  dtOptions: DataTables.Settings = {};
  isEnglish:boolean=false;
  rowId: any;
  showspinner: boolean = false;
  itemName!: any;
  dtTrigger: Subject<any> = new Subject<any>();

  // -------- Pagination Properties -------------------------
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalItems: any;
  searchString: any;
  lastAutoNumber!: number;
  ReportUrl:any;
  comp:any;
  year:any;
  branch:any;
  idColName:any="n_item_type";
  formID:any=204;
  lang:any;

  // selectedPage=1;
  // tableList!: any;

  constructor(private _service: ScItemTypesService, private _formBuilder: FormBuilder, private _notificationService: NotificationServiceService ,private userservice:UserService, private _route  : ActivatedRoute) {
    super(_route.data,userservice);
    this.dtOptions = {
      pageLength: 7,
      processing: true,
      searching: false,
      destroy: true,
      ordering: false
    };
  }

  override ngOnInit(): void {
    this.ReportUrl=ApiConfig.ReportUrl;
    this.lang=this.userservice.GetLanguage();
    this.comp=this.userservice.GetComp();
    this.year=this.userservice.GetYear();
    this.branch=this.userservice.GetBranch();
    this.LoadItems(this.pageNumber);
    LangSwitcher.translatefun();
    
    this.isEnglish=LangSwitcher.CheckLan();
  }

  // Search(page:number=0) {
  //   this._service.getAllItemsTypes(this.itemName).subscribe((data)=>{
  //     this.itemData=data;
  //   })
  // };
  
   getRowId(rowNo) {
    this.rowId = rowNo;
   }

   LoadItems(page: number = 0) {
    this.showspinner=true;
    this._service.GetItemsServerSide(page, this.pageSize, this.searchString).subscribe((data) => {
      this.itemData = data.modelNameLST;
      this.totalItems = data.totalItems;
      this.showspinner=false;
LangSwitcher.translateData(1);
    });
   }

   pageChanged(page: any){
    this.LoadItems(page.page);
  }

  keyupTimer:any;
  DoSearch(){
    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
        this.LoadItems(this.pageNumber);
    }, 1000);
  }

   DeleteRow() {
    this._service.delete(this.rowId).subscribe((data)=>{
      this.showspinner=false;
      this. _notificationService.ShowMessage(data.msg,data.status);
      if(data.status==1){
        this.closebutton.nativeElement.click();
        this.LoadItems(this.pageNumber);
      }
    });
   }
}
