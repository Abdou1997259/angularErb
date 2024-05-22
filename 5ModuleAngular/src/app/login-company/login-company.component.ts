import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { UserService } from '../_Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSharingService } from '../_Services/General/data-sharing.service';
import { UsersPrevService } from '../_Services/Prev/users-prev.service';
import { CompanyService } from '../Core/Api/GL/company.service';
import { ApiConfig } from '../_Setting/ApiConfig';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModulesService } from '../Core/Api/System/modules.service';
import { LangSwitcher } from '../Core/Api/Helper/lang';
import { ConfigService } from '../Core/Api/Sys/config.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-login-company',
  templateUrl: './login-company.component.html',
  styleUrls: ['./login-company.component.css']
})
export class LoginCompanyComponent implements OnInit {
  branches: any;
  n_branch_id!: number;
  s_branch_name!: string;
  LoginForm!: FormGroup;
  year!: number;
  comp!: number;
  userNames:string []=[];
  @Input() ImgFlag:string='';
  @Output() ChangeLangClick = new EventEmitter();
  isEnglish:boolean=false;
  selectedBranch:any=""

  
  filteredBranchesServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchingBranches:boolean=false;
  branchesType:any=[];

  constructor(private renderer: Renderer2,private userservice : UserService
    ,private router: Router
    ,private toastr: ToastrService
    ,private dataSharingService:DataSharingService
    ,private userprevservice : UsersPrevService
    ,private _companyService: CompanyService
    ,private fb:FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _modulesService: ModulesService,
    private _configService: ConfigService
    ) 
    {
      if(ApiConfig.userType==2)
        this.router.navigate(['/main/nlogin']);

      this.renderer.addClass(document.body, 'customLogin');
      this.renderer.addClass(document.body, 'LoginFooter');


      // this._companyService.GetCompanyBranches(this.comp,this.year).subscribe((branches) => {
      //   this.branches = branches;
      // });

      this.LoginForm = this.fb.group({
        s_user_name: new FormControl('', Validators.required),
        s_user_password: new FormControl('', Validators.required),
        n_branch_id: new FormControl('', Validators.required)
      });

    }


  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'customLogin');
    this.renderer.removeClass(document.body, 'LoginFooter');
  }


  showspinner:boolean=false;

  ngOnInit(): void {
    this.comp = Number(this.activatedRoute.snapshot.paramMap.get('comp'));
    this.year = Number(this.activatedRoute.snapshot.paramMap.get('year'));
    this.searchBranches('');
    LangSwitcher.translatefun();
    this.isEnglish=LangSwitcher.CheckLan();
  }

  getUser(event:any)
  {
   this._companyService.getUsersByBranch(this.selectedBranch,this.comp,this.year).subscribe({
    next:(res:any)=>{
     this.userNames=res
    }
   })
  }

  ChangeLang()
  {
      this.ChangeLangClick.emit(1);
  }

  DoLogin(){
    this.showspinner=true;
     this.userservice.GetUserCompany(this.LoginForm.value.s_user_name,this.LoginForm.value.s_user_password, this.comp, this.year, this.LoginForm.value.n_branch_id).subscribe((data)=>{
      let _users:any=data;
      if(_users.isValid==true)
      {
        this.userservice.ChangeUserName(this.LoginForm.value.s_user_name);
        this.userservice.SaveUserData(_users.userID, this.LoginForm.value.s_user_name, _users.userType, _users.comp, _users.year, _users.branch, _users.token, _users.branchName,_users.compName, _users.s_branches, _users.s_stores, _users.s_cashes, _users.s_banks);

        this._modulesService.GetAllModules().subscribe((data) => {
          this.router.navigate(['/modules']).then(() => {
            window.location.reload();
          });
        });
      }
      else
      {
        if(this.isEnglish)
            this.toastr.warning('Error!', _users.msgEng);
         else
            this.toastr.warning('خطا!', _users.msg);
      }
      this.showspinner=false;

     });
  }

  // getSelectedValue(event) {
  //   const selectedIndex = event.target.selectedIndex;
  //   const selectedOption = event.target.options[selectedIndex];
  //   this.n_branch_id = selectedOption.value;
  //   this.s_branch_name = selectedOption.label;
  // }

  searchBranches(value :any ){
    this._configService.GetConfigFileProperties().subscribe((data) => {
      ApiConfig.setConfig(data.apiUrl, data.qrUrl, data.reportUrl);
      this.searchingBranches=true;
      this._companyService.GetCompanyBranches(this.comp,this.year).subscribe(res=>{
        this.branchesType=res;
        this.filteredBranchesServerSide.next(this.branchesType.filter(x => x.s_branch_name.toLowerCase().indexOf(value) > -1));
        this.searchingBranches=false;
      });
    });

  }



}