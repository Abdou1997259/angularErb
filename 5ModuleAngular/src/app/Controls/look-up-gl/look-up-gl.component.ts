import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LookUpService } from 'src/app/_Services/Controls/look-up.service';
import { LookupControlService } from 'src/app/Core/Api/LookUps/lookup-control.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

declare var $: any;
@Component({
  selector: 'look-up-gl',
  templateUrl: './look-up-gl.component.html',
  styleUrls: ['./look-up-gl.component.css']
})
export class LookUpComponent implements OnInit {

  constructor(private _LookUpService : LookUpService,private _LookupControlService:LookupControlService) { }

  @Input() SearchID = '';
  @Input() inputName ='';
  @Input() nameCol ='';
  @Input() form!: FormGroup;
  DataTarget :string=''
  @Input() colSize='';
  @Input() colSizeName='';
  @Input() tblName :string='';
  @Input() mylookupID: string='';
  @Input() TitleAr: string='';
  @Input() TitleEn: string='';
  @Input() ExtraCondition: string='';
  data : any;  
  searchString:any='';
  SelectedValue:any=''; 
  SelectedName:any=''; 
  keyupTimer:any;
  isEnglish:any;

  totalCount!: any;
  currentPage!: number;
  pageNumber: number = 1;
  pageSize: number = 10;

  @Output() onValueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {  
    this.DataTarget= this.SearchID;
    LangSwitcher.translateData(1)
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  GetLookup(){  
    this.searchString="";
    this._LookupControlService.GetData(this.SearchID, '', this.pageNumber, this.pageSize, this.ExtraCondition).subscribe(data=>{ 
     this.data=data.modelNameLST; 
     this.totalCount = data.totalItems;
     this.currentPage=1;
    });
  }

  DoSearch(){  
    this.keyupTimer = setTimeout(() => {
      this._LookupControlService.GetData(this.SearchID, this.searchString, this.pageNumber, this.pageSize, this.ExtraCondition).subscribe(data=>{
        this.data=data.modelNameLST; 
        this.totalCount = data.totalItems;
        this.currentPage=1;
       });
    }, 1000);
  }

  pageChanged(page: any){
    this._LookupControlService.GetData(this.SearchID, this.searchString, page.page, this.pageSize, this.ExtraCondition).subscribe(data=>{ 
      this.data=data.modelNameLST; 
      this.totalCount = data.totalItems;
     });
  }

  GetItemName(){
    var valSearch=this.form.get(this.inputName)?.value;
    if(valSearch=='')
      this.SelectedName=''; 
    else
    {
      this._LookupControlService.GetName(this.SearchID, valSearch).subscribe(data=>{ 
        if(data =='' || data== null)
        {
          this.form.get(this.inputName)?.patchValue('');
          this.SelectedName='';
        }
        else
          this.SelectedName=data.name;
        });
    }
    this.InputChange(valSearch);
  }

  InputChange(value:any): void {
    this.onValueChange.emit([value]);
  }

  SelectRow(value:any, name:any){ 
     this.SelectedValue=value;
     this.SelectedName=name;
     this.form.get(this.inputName)?.patchValue(value);
  }

  loadDataTableScripts(id:string):void{
 
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');let html =`$("#tblID").DataTable({
      "bDestroy": true, 
      "paging": true,
      "lengthChange": false,
      "searching": true,
      "ordering": true,
      "info": true,
      "autoWidth": true,
    });`;
    html=html.replace('tblID',id);
    script.innerHTML = html; 
    script.async = true;
    script.defer = true;
    body.appendChild(script);   
  }
  

}
