import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { DynamicFormsService } from 'src/app/_Services/dynamic-forms.service';
import { DataSharingService } from 'src/app/_Services/General/data-sharing.service';

@Component({
  selector: 'app-index-form',
  templateUrl: './index-form.component.html',
  styleUrls: ['./index-form.component.css']
})
export class IndexFormComponent implements OnInit {

  constructor(private dynamicformService : DynamicFormsService,
    private activatedRoute: ActivatedRoute,
    private dataSharingService:DataSharingService)
   { }
  cols : any=[];
  data : any=[];
  currentId : any=0;
  ngOnInit(): void {

    this.currentId= this.activatedRoute.snapshot.paramMap.get('id');
     

    this.dataSharingService.showLoader();
    this.dynamicformService.GetList(this.currentId).subscribe((data)=>{

      console.log(data);
 
      this.cols=data.GridHeaders; 
      console.log(this.cols);
      this.data=data;
     
      this.dataSharingService.hideLoader();
      setTimeout(() => {
        this.loadDataTableScripts();
    }, 1);
  });
}
  
loadDataTableScripts():void{

  let body = <HTMLDivElement> document.body;
  let script = document.createElement('script');


  const html =`$("#CustDataTable").DataTable();`;
  script.innerHTML = html; 
  script.async = true;
  script.defer = true;
  body.appendChild(script); 

}

}
