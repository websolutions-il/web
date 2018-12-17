import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { InputParams, ActionInputParams, FullActionInputParams } from '../../../Models/ParamsModel';
 
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { GetJsonService } from '../../services/get-json.service'

@Component({
  selector: 'app-user-verification-asset-page',
  templateUrl: './user-verification-asset-page.component.html',
  styleUrls: ['./user-verification-asset-page.component.css']
})
export class UserVerificationAssetPageComponent implements OnInit {
   

  isValidAssetNumberMesseg: string;
  assetNumber: string="";
  currentCityID:any;
  isAssetNotValid:boolean;

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();  
  params: any = new Array<InputParams>();
  param: InputParams;
  popUpType: string = "verify";

  constructor(private valid : ValidationService,private route: ActivatedRoute,
      public commonService: CommonService,private router:Router,private jsonService: GetJsonService,
     ) {
    this.route.params.subscribe((params: Params) => {
      this.currentCityID= params['city'];
      });
   }

  ngOnInit() { 
   // $("#popup").fadeIn(200);
  }
  insertAsset() {   

    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.validAssetNumberFun()
    if (this.isValidAssetNumberMesseg != null)
    {
    this.valid.setFocusToLastAlertForAccessibility("form1",2); 
    return false;    
    }
    this.actionName = '1B0D4655-C5A0-42B1-870E-122D6785135B';
    
    this.param= new InputParams("@company_id",this.currentCityID);
    this.params.push(this.param);
    this.param= new InputParams("@PayerId","12");
    this.params.push(this.param);
    this.param= new InputParams("@AssetNumber",this.assetNumber);
    this.params.push(this.param);
    
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend,'MastApi_Pay24','AddAssetToB2M_Payer');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
       
       if(res[0].VERRIFY_ASSET == 1)
       {
        this.commonService.sideMenuCityList = null;// איפוס הרשימה כדי שהיא תטען מחדש אם הנתונים החדשים
        this.commonService.updatedIsVerifyAssetSubject(true);
        this.router.navigate([this.jsonService.getCookie("pageAfterVerifyAsset")]);          
       }
       else
       {
         this.popUpType = "assetNotMatch"
         $("#popup").fadeIn(200);
       }

    }, err => {
      //alert(err);
    });

  }

insertRequestToStutosNetForm(formId:string) {

    this.actionName = '5CEE6734-186C-4AF1-B972-AB2453E1CAE9';

    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();

    this.param = new InputParams("@ClientId", "9999");
    this.params.push(this.param);
    this.param = new InputParams("@Phone", "123");
    this.params.push(this.param);
    this.param = new InputParams('@PageName', "סתם");
    this.params.push(this.param);
    this.param = new InputParams('@GuidRequest', this.commonService.guid());
    this.params.push(this.param);
    this.param = new InputParams("@PageUid", formId); 
    this.params.push(this.param);
    this.param = new InputParams('@FirstName', this.commonService.userDetails[0].FirstName);
    this.params.push(this.param);
    this.param = new InputParams('@LastName', this.commonService.userDetails[0].LastName);
    this.params.push(this.param);   
    this.param = new InputParams('@Email', this.commonService.userDetails[0].Email);
    this.params.push(this.param);
    this.param = new InputParams('@PayerID', this.commonService.userDetails[0].UserName);
    this.params.push(this.param);
    this.param = new InputParams('@FieldsData',
   `[{"FieldNameLabel":"מקור הפניה*","FieldNameID":"ddl_RequestSource","FieldText":"אימות נכס"},
    {"FieldNameLabel":"מזהה רשות","FieldNameID":"CityId","FieldText":"` + this.currentCityID + `"},
    {"FieldNameLabel":"מספר נכס","FieldNameID":"assetNumber","FieldText":"` + this.assetNumber + `"},
    {"FieldNameLabel":"שם פרטי*","FieldNameID":"FirstName","FieldText":"` + this.commonService.userDetails[0].FirstName.replace("\"","") + `"},
    {"FieldNameLabel":"שם משפחה*","FieldNameID":"LastName","FieldText":"` + this.commonService.userDetails[0].LastName.replace("\"","") + `"},
    {"FieldNameLabel":"ת.ז.*","FieldNameID":"Tz","FieldText":"` + this.commonService.userDetails[0].UserName.replace("\"","") + `"},
    {"FieldNameLabel":"מספר משלם","FieldNameID":"PayerID","FieldText":"` + this.commonService.userDetails[0].UserName.replace("\"","") + `"},
    {"FieldNameLabel":"טלפון*","FieldNameID":"Phone","FieldText":"` + this.commonService.userDetails[0].Phone.replace("\"","") + `"},
    {"FieldNameLabel":"דוא\"ל","FieldNameID":"Email","FieldText":"` + this.commonService.userDetails[0].Email.replace("\"","") + `"},]` ); 
    this.params.push(this.param);
    this.param = new InputParams('@IsApprovedRegistration', "1");
    this.params.push(this.param);
    this.param = new InputParams('@TZ', this.commonService.userDetails[0].UserName);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend,'MastApi_KeepItCity','insertRequestToStutosNetForm')

    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.popUpType = "representative";
      $("#popup").fadeIn(200);
    }, err => {  });
  }


  closePopup()
  {
    $("#popup").fadeOut(200);   
  }

  validAssetNumberFun() { 
    this.isValidAssetNumberMesseg = this.valid.validAssetNumberFun(this.assetNumber);
  }
}
