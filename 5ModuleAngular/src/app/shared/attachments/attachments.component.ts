import { Component, Input, OnInit } from '@angular/core';
import { AttachmentsService } from 'src/app/Core/Api/Sys/attachments.service';
import { NotificationServiceService } from 'src/app/_Services/notification-service.service';
import { ViewChild } from '@angular/core';
import { LangSwitcher } from 'src/app/Core/Api/Helper/lang';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {
  @ViewChild('myInput') myInputVariable;
  @ViewChild('closebutton') closebutton;

  @Input() ID: any;
  @Input() DataArea: any;
  @Input() Folder: string='';
  @Input() SubFolder: string='';
  showAttachmentspinner:boolean=false;
  attachmentsData!:any;
  isEnglish:boolean=false;
  constructor(private _AttachmentsService:AttachmentsService,private _notification: NotificationServiceService) { 

  }

  ngOnInit(): void {
    this.isEnglish = LangSwitcher.CheckLan();
    LangSwitcher.translateData(1);
    LangSwitcher.translatefun();
  }

  getAttachments() {
    this._AttachmentsService.GetAttachments(this.ID, this.Folder).subscribe(data=>{
      this.attachmentsData=data;
    });
  }

  SaveAttachments(){
    debugger;
    var attachments: any = document.getElementById('attachments');
    if(attachments == null || attachments.files.length==0)
    {
      this. _notification.ShowMessage('الرجاء اختيار ملف اولاً',3);
      return;
    }
    this.showAttachmentspinner=true;
    $('#attachmentBTN').prop('disabled', true);
    var formData: any = new FormData();
    for (let i = 0; i < attachments.files.length; i++) {
      formData.append("files", attachments.files[i]);      
    }   
    formData.append("id", this.ID);      
    //formData.append("dataArea", this.DataArea);      
    formData.append("folder", this.Folder);      
    formData.append("subFolder", this.SubFolder);      
    this._AttachmentsService.SaveAttachments(formData).subscribe(data=>{
      debugger;
      this.showAttachmentspinner=false;
      $('#attachmentBTN').prop('disabled', false);
      this.myInputVariable.nativeElement.value = "";
      this.closebutton.nativeElement.click();  
      this. _notification.ShowMessage(data.msg,data.status);
    });
  }

  openFile(file: any){
    this._AttachmentsService.DownloadFile(this.ID, this.Folder, file);
  }
}
