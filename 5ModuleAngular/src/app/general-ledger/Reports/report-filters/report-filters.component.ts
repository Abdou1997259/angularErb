import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ReportService } from 'src/app/Core/Api/GL/report.service';
import { UserService } from 'src/app/_Services/user.service';
import { SelectServerSideComponent } from 'src/app/shared/select-server-side/select-server-side.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.css']
})
export class ReportFiltersComponent implements OnInit {

  myForm!: FormGroup;
  filtersLST: any;
  searchLST: any= [];
  // filteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredServerSide: {[key: string]: ReplaySubject<any[]>} = {};
  searching:boolean=false;
  lstDetails: any[] = [];
  details!: string;
  selectedOption: any[] = [];
  noFilters: string = "";
  repName: string = "";
  repNameEng: string = "";
  comp:any;
  year:any;
  ModuleNo:any;
  RepID:any;
  lang:any;
  isEnglish:boolean=false;

  constructor(private _router: ActivatedRoute, private _reportService: ReportService, private fb: FormBuilder, private userService: UserService) {
    this._router.params.subscribe((params) => {
      this.getReportName(params['id2']);
      this.getReportFilters(params['id2']);
    });

    this.myForm = this.fb.group({
      0: new FormControl(''),
      1: new FormControl(''),
      2: new FormControl(''),
      3: new FormControl(''),
      4: new FormControl(''),
      5: new FormControl(''),
      6: new FormControl(''),
      7: new FormControl(''),
      8: new FormControl(''),
      9: new FormControl(''),
      10: new FormControl(''),
      11: new FormControl(''),
      12: new FormControl(''),
      13: new FormControl(''),
      14: new FormControl(''),
      15: new FormControl(''),
      16: new FormControl(''),
      17: new FormControl(''),
      18: new FormControl(''),
      19: new FormControl(''),
      20: new FormControl(''),
      21: new FormControl(''),
      22: new FormControl(''),
      23: new FormControl(''),
      24: new FormControl(''),
      25: new FormControl('')
    });

  }

  get items() {
    return this.myForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.translateData();
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
  }

  getReportName(repId: string) {
    this._reportService.GetReportName(repId).subscribe((report) => {
      this.repName = report['repName'];
      this.repNameEng= report['repNameEng'];
    });
  }

  getReportFilters(rebId: string) {
    this._reportService.GetReportFilters(rebId).subscribe((data) => {
      if(data.length > 0){
        this.filtersLST = data;
      data.forEach(element => {
        if(element.stype === 'LKP' || element.stype === 'CMB'){
          this.search('', element.searchTable, element.fieldId)
        }
      });
      }
      else
      {
        if(this.isEnglish)
          this.noFilters = "No filters for this report!";
        else
          this.noFilters = "لا يوجد فلاتر لهذا التقرير....!";
      }
    });
  }


 search(event: any, sTable: string, fId: string){
   this.searching=true;
   this.filteredServerSide[fId] = new ReplaySubject<any[]>(1);
   this._reportService.GetLKPSearch(sTable).subscribe((data) => {
    this.searchLST = data;
    this.filteredServerSide[fId].next(this.searchLST.filter(x => x.value.toLowerCase().indexOf(event) > -1));
    this.searching=false;
   });
 }

 onSubmit()
 {
    this.lstDetails = [];
    var count = Object.keys(this.myForm.controls).length;

    for(var j=0; j < this.filtersLST.length; j++) {
      debugger;
      if(this.myForm.controls[j].value !== '') {
        {
          if(this.filtersLST[j].stype=='DT')
          {
            var dateValue=new DatePipe('en-US').transform(this.myForm.controls[j].value, 'yyyy/MM/dd');
            this.lstDetails.push({"id": j,"Value":dateValue,"Type":this.filtersLST[j].stype});
          }
          else
            this.lstDetails.push({"id": j,"Value":this.myForm.controls[j].value,"Type":this.filtersLST[j].stype});
        }
      }
    }

    const lstString = JSON.stringify(this.lstDetails);
    this.comp=this.userService.GetComp();
    this.year=this.userService.GetYear();
    this.ModuleNo = this._router.snapshot.paramMap.get('id1');
    this.RepID = this._router.snapshot.paramMap.get('id2');
    this.lang=this.userService.GetLanguage();

    this._router.params.subscribe((params) => {
      this._reportService.PrintReport(lstString, this.RepID, this.ModuleNo, 1, this.comp, this.year, this.lang);
    });
  }

  
  translateData()
  {
    setTimeout(() => {
      if(window.sessionStorage.getItem("lan")==="English")
      {
        debugger
        let listOfElement=document.getElementsByClassName("translatedata");
        let regex=/[\u0600-\u06FF]/
        for(let i=0;i<listOfElement.length;++i)
        {
          if( regex.test(listOfElement[i].innerHTML))
          {
          
          let enWord=listOfElement[i].getAttribute("data-en") as string ;
          let arword=listOfElement[i].innerHTML;
          let swapper=enWord;
          enWord=arword;
          arword=swapper;
          listOfElement[i].setAttribute("data-en",enWord);
          listOfElement[i].innerHTML=arword;
          }
        }
      }
    }, 0);   
  }

  translatefun()
  {
    debugger
    if(window.sessionStorage.getItem("lan")==="English")
    {
      let listOfElement=document.getElementsByClassName("translate");
      let regex=/[\u0600-\u06FF]/
      for(let i=0;i<listOfElement.length;++i)
      {
          if(listOfElement[i].nodeName=='INPUT')
          {
            let inputElement=(listOfElement[i] as HTMLInputElement);
            if( regex.test(inputElement.value))
            {
            
             let enWord=listOfElement[i].getAttribute("data-en") as string ;
             let arword=inputElement.value;
             let swapper=enWord;
             enWord=arword;
             arword=swapper;
             listOfElement[i].setAttribute("data-en",enWord);
             inputElement.value=arword;
            }

          }
          else
          {
            if( regex.test(listOfElement[i].innerHTML))
            {
            
             let enWord=listOfElement[i].getAttribute("data-en") as string ;
             let arword=listOfElement[i].innerHTML;
             let swapper=enWord;
             enWord=arword;
             arword=swapper;
             listOfElement[i].setAttribute("data-en",enWord);
             listOfElement[i].innerHTML=arword;
            }     
          }
        }
      }
  }

}
