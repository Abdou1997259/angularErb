import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/Core/Api/GL/report.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent implements OnInit {

  reportsLst: any;
  url = "./assets/img/pdf.png";
  moduleName!: string;
  groupName!: string;
  ModuleNo : any;
  isEnglish:boolean=false;

  constructor(private router: ActivatedRoute, private _reportService: ReportService, private userService: UserService) {
    this.router.params.subscribe((params) => {
      this.getModuleName(params['id1']);
      this.getGroupName(params['id1'], params['id2']);
      this.getReportList(params['id1'], params['id2'], '');
    });
   }

  ngOnInit(): void {
    this.ModuleNo = this.router.snapshot.paramMap.get('id1');
    this.translateData();
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
  }

  getModuleName(moduleId: number) {
    this._reportService.GetModuleById(moduleId).subscribe((data) => {
      this.moduleName = data['moduleName'];
    });
  }

  getGroupName(moduleId: number, groupId: number) {
    this._reportService.GetCurrentModuleGroup(moduleId, groupId).subscribe((data) => {
      this.groupName = data['rep_Group_Name'];
    });
  }

  getReportList(moduleId: number, groupId: number, searchVal: string) {
    this._reportService.GetReportsList(moduleId, groupId, searchVal).subscribe((data) => {
      this.reportsLst = data;
    });
  }

  getFilteredReport(filter: string){
    this.router.params.subscribe((params) => {
      this.getReportList(params['id1'], params['id2'], filter);
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
