import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { CustodyCodesService } from 'src/app/Core/Api/HR/custody-codes.service';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';

@Component({
  selector: 'app-custody-codes',
  templateUrl: './custody-codes.component.html',
  styleUrls: ['./custody-codes.component.css']
})
export class CustodyCodesComponent implements OnInit {
  py_Custody_codes!: FormGroup;
  showspinner: boolean = false;
  isEnglish:boolean=false;
  custodyNo: number = 0;

  AssetsData: any[] = [];
  AccountsData: any[] = [];
  searchingAsset:boolean=false;
  searchingAccount:boolean=false;
  filteredAssetServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAccountServerSide: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private _service: CustodyCodesService, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationServiceService, private _formBuilder: FormBuilder)
  {
    this.py_Custody_codes = this._formBuilder.group({
      n_custody_no: [''],
      s_custody_name: ['', Validators.required],
      s_custody_name_eng: [''],
      n_Asset_no: [''],
      n_value: [''],
      s_Account_No: [''],
      n_DataAreaID: [''],
      d_UserAddDate: [''],
      d_UserUpdateDate: [''],
      n_UserAdd: [''],
      n_UserUpdate: [''],
      n_current_branch: [''],
      n_current_company: [''],
      n_current_year: [''],
    });
  }

  ngOnInit(): void {
    this.showspinner = true;
    this.custodyNo = Number( this._activatedRoute.snapshot.paramMap.get('id') );

    this.searchAsset('');
    this.searchAccount('');

    if(this.custodyNo <= 0)
    {
      this._service.GetNextCustodyCode().subscribe((data) => {
        this.py_Custody_codes.patchValue(data);
        this.showspinner = false;
      });
    }

    if(this.custodyNo > 0)
    {
      this._service.GetByID(this.custodyNo).subscribe((data) => {
        this.py_Custody_codes.patchValue(data);
        this.showspinner = false;
      });
    }

    LangSwitcher.translatefun();
    this.isEnglish = LangSwitcher.CheckLan();
  }

  searchAsset(value :any){
    this.searchingAsset=true;
    this._service.GetAssets(value).subscribe(res=>{
      this.AssetsData = res;
      this.filteredAssetServerSide.next(this.AssetsData.filter(x => x.s_Asset_Name_Arabic.toLowerCase().indexOf(value) > -1));
      this.searchingAsset=false;
    });
  }

  searchAccount(value :any){
    this.searchingAccount=true;
    this._service.GetAccounts(value).subscribe(res=>{
      this.AccountsData = res;
      this.filteredAccountServerSide.next(this.AccountsData.filter(x => x.s_account_name.toLowerCase().indexOf(value) > -1));
      this.searchingAccount=false;
    });
  }

  Save()
  {
    this.disableButtons();
    this.showspinner = true;

    var formData: any = new FormData();
    formData.append('n_custody_no', this.py_Custody_codes.value.n_custody_no ?? 0);
    formData.append('s_custody_name', this.py_Custody_codes.value.s_custody_name ?? '');
    formData.append('s_custody_name_eng', this.py_Custody_codes.value.s_custody_name_eng ?? '');
    formData.append('n_Asset_no', this.py_Custody_codes.value.n_Asset_no ?? 0);
    formData.append('n_value', this.py_Custody_codes.value.n_value ?? 0);
    formData.append('s_Account_No', this.py_Custody_codes.value.s_Account_No ?? '');
    formData.append('n_DataAreaID', this.py_Custody_codes.value.n_DataAreaID ?? 0);
    formData.append('d_UserAddDate', this.py_Custody_codes.value.d_UserAddDate ?? '');
    formData.append('d_UserUpdateDate', this.py_Custody_codes.value.d_UserUpdateDate ?? '');
    formData.append('n_UserUpdate', this.py_Custody_codes.value.n_UserUpdate ?? 0);
    formData.append('n_current_branch', this.py_Custody_codes.value.n_current_branch ?? 0);
    formData.append('n_current_company', this.py_Custody_codes.value.n_current_company ?? 0);
    formData.append('n_current_year', this.py_Custody_codes.value.n_current_year ?? 0);

    if(this.custodyNo !=null && this.custodyNo > 0 ){
      this._service.Edit(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/custodycodeslist']);
        }
      });
    }
    else
    {
      this._service.Create(formData).subscribe(data=>{
        this.showspinner=false;
        this.enableButtons();

        if(this.isEnglish)
          this._notificationService.ShowMessage(data.Emsg,data.status)
        else
          this. _notificationService.ShowMessage(data.msg,data.status);

        if(data.status==1){
          this._router.navigate(['/hr/custodycodeslist']);
        }
      });
    }
  }

  disableButtons() {
    $(':button').prop('disabled', true);
    $("input[type=button]").attr("disabled", "disabled");
  }

  enableButtons() {
    $(':button').prop('disabled', false);
    $('input[type=button]').removeAttr("disabled");
  }
}
