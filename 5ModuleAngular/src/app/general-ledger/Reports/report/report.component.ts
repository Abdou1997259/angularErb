import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/Core/Api/GL/report.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  module: any;
  reports: any;
  isEnglish: boolean=false;
  url1 = "./assets/img/graph (1).png";
  url2 = "./assets/img/report (1).png";
  url3 = "./assets/img/transaction (1).png";
  url4 = "./assets/img/graph (1).png";


  constructor(private route: ActivatedRoute, private routerService: ReportService, private userService: UserService) {
    this.route.params.subscribe((params) => {
      this.getModule(params['id']);
      this.getModuleReports(params['id']);
    });
   }

  ngOnInit(): void {
    this.translateData();
    this.translatefun();
    if(window.sessionStorage["lan"]==="English")
    {
      this.isEnglish=true;
    }
  }

  getModule(id: number) {
    debugger;
    var comp = Number(this.userService.GetComp());
    var year = Number(this.userService.GetYear());
    this.routerService.GetModuleById(id).subscribe((data) => {
      this.module = data;
    });
  }

  getModuleReports(id: number) {
    debugger;
    this.routerService.GetCurrentModuleReports(id).subscribe((data) => {
      this.reports = data;
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
