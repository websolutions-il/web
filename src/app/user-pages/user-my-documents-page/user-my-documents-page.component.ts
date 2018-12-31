import { Component, OnInit } from '@angular/core';
 
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { billModel } from '../../../Models/bill-model';
import { MyDoumentsModel } from '../../../Models/MyDocumentsModel';
import { Subscription } from 'rxjs';

declare var NativeApp: any;

@Component({
  selector: 'app-user-my-documents-page',
  templateUrl: './user-my-documents-page.component.html',
  styleUrls: ['./user-my-documents-page.component.css']
})
export class UserMyDocumentsPageComponent implements OnInit {

   

 
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();


  docModel: MyDoumentsModel;

  pdfList: any = new Array();
  isMobilUser: boolean;
 // isAppMobileUser: boolean;
  pdfToShow: string;
  iframeLink: string;

  cityName:string;
  currentCityID:string;
  verifyAssetsSubscription: Subscription;
  isVerifyAsset:boolean;
  constructor(private route: ActivatedRoute,private router: Router, public commonService: CommonService, private jsonService: GetJsonService) {
    

    this.route.params.subscribe((params: Params) => {     
      this.currentCityID= params['city'];     
              
    });
  
    this.isMobilUser = this.commonService.getIsMobileUser();    
     this.commonService.isVerifyAsset.subscribe(
      (isVerifyAsset) => {
        if (isVerifyAsset) {
          this.isVerifyAsset = true;
          this.commonService.showLoader = true;      
          if(this.commonService.cityModel.Id!=this.currentCityID)
          this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"המסמכים שלי");  
          else
          this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"המסמכים שלי");
       
          this.GetPdfFiles();
        }
        else {
          this.isVerifyAsset = false;
         // this.jsonService.createCookie("pageAfterVerifyAsset", '/user/' + this.currentCityID + '/my-documents', '');
        //  this.router.navigate(['user/' + this.currentCityID + '/verification-asset']);
        }
      })
  }
 
  GetPdfFiles() {
    this.actionName = 'c6c31eb5-e178-40fd-9758-32737f80ac4d';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@company_id",this.currentCityID);
    this.params.push(this.param);
    this.param = new InputParams("@PayerId","34");
    this.params.push(this.param);
    this.param = new InputParams("@Phone","34");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity','');

    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
    // console.log(res);
     setTimeout(() => {
      this.commonService.showLoader = false;
     }, 3000);

      if(res.length==0)
      {
        $(".refrence_table").html("<p style='padding-right: 3vw; font-size: 22px;'> אין נתונים להצגה </p>")
        $(".refrence_table").removeClass("table-striped");        
     return false;
      }
      res.forEach(element => {
        this.docModel = new MyDoumentsModel();
        //let link= "https://www.pay24.co.il/kic/mobile/SharedFiles";
        let link= "/assets/MastImages/SharedFiles";   
        this.docModel.date = element.CreateDateTime; 
        this.docModel.name = element.FileType;
        this.docModel.link = link+"/"+element.MgarId+"/"+element.PayerId+"/"+element.SharedFileName;       
        this.pdfList.push(this.docModel);
      });

    }, err => {
    //alert(err);
    });

  }

  showPdf(link) {

    if (this.isMobilUser) {    
      document.getElementById("openLinkInNewWindow").setAttribute("href",link)
      document.getElementById("openLinkInNewWindow").click();  
    }
   else{
    this.iframeLink = link;
    $(".iframe_wrap").show();
   }
  }

  closePdfDoc() {
    $(".iframe_wrap").hide();
  }

  ngOnInit() {
  
  }

}
