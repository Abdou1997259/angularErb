import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../Core/Api/GL/company.service';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiConfig } from '../_Setting/ApiConfig';
import { DataSharingSenderService } from '../_Services/General/data-sharing-sender';
import { ConfigService } from '../Core/Api/Sys/config.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  years: any;
  companiesLst: any;
  companyYearsLst: any;
  myForm!: FormGroup;
  // compId!: number;
  @ViewChild("headerContainer") headerContainer!:ElementRef;
  @ViewChild('Links') Links!:ElementRef;
  currentYear!: number;
  activeIndex: any;
  isSelectedYear: boolean = false;
  lang:Array<string>=["عربي",'English']
  isEnglish:boolean=false;
  constructor(private _configService: ConfigService, private _companyService: CompanyService, private _router: Router,
    private _fb: FormBuilder,private dataSender:DataSharingSenderService) {

    this.myForm = this._fb.group({
      compName: new FormControl(''),
      compId: new FormControl(),
      nYear: new FormControl()
    });
   }

  ngOnInit(): void {
    this._configService.GetConfigFileProperties().subscribe((data) => {
      ApiConfig.setConfig(data.apiUrl, data.qrUrl, data.reportUrl);
      this.search('');
    });

    if(ApiConfig.userType==2)
      this._router.navigate(['/main/nlogin']);

    this.dataSender.sendDATA(true);
  }
  translateData()
  {
    setTimeout(() => {
      if(window.sessionStorage.getItem("lan")==="English")
    {
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
    let regex=/[\u0600-\u06FF]/
    let listOfElement=document.getElementsByClassName("translate")
    if(this.isEnglish)
    {
      for(let i=0;i<listOfElement.length;++i)
      {
        if(regex.test(listOfElement[i].innerHTML))
        {
          let word= listOfElement[i].innerHTML
          let dataEn=listOfElement[i].getAttribute("data-en") as string;
          listOfElement[i].innerHTML  =dataEn ;
          listOfElement[i].setAttribute("data-en",word)
        }
      }
    }
    else
    {
      for(let i=0;i<listOfElement.length;++i)
      {
        if(!regex.test(listOfElement[i].innerHTML))
        {
          let word= listOfElement[i].innerHTML
          let dataEn=listOfElement[i].getAttribute("data-en") as string;

          listOfElement[i].innerHTML  =dataEn ;
          listOfElement[i].setAttribute("data-en",word)
        }

      }
    }




  }
  changeHeaderDirection()
  {

    if(this.isEnglish)
    {
      this.headerContainer.nativeElement.style.flexDirection='row-reverse'
      this.Links.nativeElement.style.flexDirection='row-reverse'
    }
    else
    {
      this.headerContainer.nativeElement.style.flexDirection='row'
      this.Links.nativeElement.style.flexDirection='row'
    }

  }

  // getYears(Id: number) {
  //   return this._companyService.GetCompanyYears(Id).subscribe((data) => {
  //     debugger;
  //     this.companyYearsLst = data;
  //   });
  // }

  filteredServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searching:boolean=false;

 search(value: any) {
  this.searching=true;
  // this.getYears(this.myForm.controls['compName'].value);

  // return this._companyService.GetAllCompanies().subscribe((data) => {
  //   this.companiesLst = data;
  //   this.filteredServerSide.next(this.companiesLst.filter(x => x.compName.toLowerCase().indexOf(value) > -1));
  //    this.searching=false;
  // });
  this._companyService.GetAllYears().subscribe((data) => {
    debugger;
    this.years = data;
    this.currentYear = this.years[0].nYear;
    return this._companyService.GetAllCompaniesByYear(this.years[0].nYear).subscribe((companies) => {
      this.companiesLst = companies;
    });
  });

 }


//  getSelectedValue(event) {
//   const selectedIndex = event.target.selectedIndex;
//     const selectedOption = event.target.options[selectedIndex];
//     this.compId = selectedOption.value;
//     this.year = selectedOption.label;
//  }

 navigateToLogin(compId: number) {
  debugger;
  this._router.navigate([`/logincompany/${compId}/${this.currentYear}`]);
  // this._companyService.CreateConnectionString(compId, this.currentYear).subscribe((data) => {
  //   this._router.navigate([`/logincompany/${compId}/${this.currentYear}`]);
  // });
 }

 getCompanies(year: number) {
  this.isSelectedYear = true;
  this.currentYear = year;
  this._companyService.GetAllCompaniesByYear(year).subscribe((companies) => {
    this.companiesLst = companies;
  });
 }
 getLang(l)
 {

  window.sessionStorage.setItem("lan",l);
  this.isEnglish=window.sessionStorage.getItem("lan")=="English" ? true:false
 }
}
