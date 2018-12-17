import { Component, OnInit,AfterViewInit } from '@angular/core';
 
import { GetJsonService } from '../../services/get-json.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { ValidationService } from '../../services/validation.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../../../Models/UserModel';
import { GetUserIpService } from '../../services/get-user-ip.service';
@Component({
  selector: 'app-user-summer-camp-page',
  templateUrl: './user-summer-camp-page.component.html',
  styleUrls: ['./user-summer-camp-page.component.css']
})
export class UserSummerCampPageComponent implements OnInit,AfterViewInit {
  iframeSrc: string;

   

  isPageActive:boolean = true;
 // isValidTZchild: boolean = true;
  cityLogo:string;
  currentCityID: string;

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  isIframe:boolean = false;
  isDebt:boolean;
  pasteEmail:string="";
  //validation
  isValidParentTypeMesseg: string;
  isValidTZMesseg: string;
  isValidLastNameMesseg: string;
  isValidFirstNameMesseg: string;
  isValidTZChildMesseg: string;
  isValidAddressMesseg: string;
  isValidMikoodMesseg: string;
  isValidEmailMesseg: string;
  isValidNotesMesseg: string;
  isValidPhoneMesseg: string;
  isValidPhone2Messeg: string;
  isValidRegulations: boolean;
  isValidRegulationsMesseg: boolean = false;
  isValidPasteEmailMesseg: boolean;

  summerCapmModel: SummerCapmModel = new SummerCapmModel();
  summerCapmObj : SummerCapmObj = new SummerCapmObj();
 
  isArab:boolean;
  constructor(private route: ActivatedRoute, private router:Router,
    private valid: ValidationService, public jsonService: GetJsonService,
    public commonService: CommonService, private ipService: GetUserIpService) {

    this.route.params.subscribe((params: Params) => {
       if(params["lang"]== "arab")
       this.isArab = true;
      this.currentCityID = params['city'];    
      if(this.currentCityID != "164")
         router.navigate(['']); 
    });

    if(this.commonService.cityModel.Id!=this.currentCityID)
    this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"");  
    else
    this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"");
   

  }
  ngOnInit() {
    this.ipService.getIpCliente().subscribe(res => {
      this.summerCapmModel.userIP = res;
    }, err => { }); 
  
  }
ngAfterViewInit()
{  
   document.getElementById("pasteEmail").onpaste = function(e) {
      e.preventDefault();
    }
}
  action() {
    if (!this.validation())
      return false;
    this.insertUserToDB();
    this.insertRequestToStutosNetForm();
    this.getSummerCampLink();
  }


  insertUserToDB() {
    this.actionName = '0FD03047-A5B7-4196-B457-ABFA432834D7';

    this.summerCapmModel.user.CompanyId = this.currentCityID;
    this.summerCapmModel.user.identity_type = "1"
    this.summerCapmModel.user.UserName = this.summerCapmModel.user.TZ;

    let arr = [];
    for (let key in this.summerCapmModel.user) {
      if (this.summerCapmModel.user.hasOwnProperty(key)) {
        arr.push(this.summerCapmModel.user[key]);
      }
    }

    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();

    for (let i = 0; arr.length - 1 > i; i += 2) {
      this.param = new InputParams(arr[i + 1], arr[i]);
      this.params.push(this.param);
    }
    this.param = new InputParams("@userAgent", this.commonService.userAgent);
    this.params.push(this.param);
    this.param = new InputParams('@RegIp', this.summerCapmModel.userIP);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'insertUserToDB');

    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      console.log(res);
    }, err => { });
  }

  insertRequestToStutosNetForm() {

    this.actionName = '5CEE6734-186C-4AF1-B972-AB2453E1CAE9';

    this.summerCapmModel.user.UserName = this.summerCapmModel.user.TZ;

    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();

    this.param = new InputParams("@ClientId", this.currentCityID);
    this.params.push(this.param);
    this.param = new InputParams('@PageName', "סתם");
    this.params.push(this.param);
    this.param = new InputParams('@GuidRequest', this.commonService.guid());
    this.params.push(this.param);
    this.param = new InputParams("@PageUid", "73FC1D99-9667-49FB-A054-1E0A5409335F");
    this.params.push(this.param);
    this.param = new InputParams('@FirstName', this.summerCapmModel.user.FirstName);
    this.params.push(this.param);
    this.param = new InputParams('@LastName', this.summerCapmModel.user.LastName);
    this.params.push(this.param);   
    this.param = new InputParams('@Email', this.summerCapmModel.user.Email);
    this.params.push(this.param);
    this.param = new InputParams('@PayerID', this.summerCapmModel.user.UserName);
    this.params.push(this.param);
    this.param = new InputParams('@FieldsData',
   `[{"FieldNameLabel":"מקור הפניה*","FieldNameID":"ddl_RequestSource","FieldText":"ירושלים - רנה קאסן"},
    {"FieldNameLabel":"שם פרטי*","FieldNameID":"FirstName","FieldText":"` + this.summerCapmModel.user.FirstName.replace("\"","") + `"},
    {"FieldNameLabel":"שם משפחה*","FieldNameID":"LastName","FieldText":"` + this.summerCapmModel.user.LastName.replace("\"","") + `"},
    {"FieldNameLabel":"ת.ז.*","FieldNameID":"Tz","FieldText":"` + this.summerCapmModel.user.TZ.replace("\"","") + `"},
    {"FieldNameLabel":"מספר משלם","FieldNameID":"PayerID","FieldText":"` + this.summerCapmModel.user.TZ.replace("\"","") + `"},
    {"FieldNameLabel":"טלפון*","FieldNameID":"Phone","FieldText":"` + this.summerCapmModel.user.Phone.replace("\"","") + `"},
    {"FieldNameLabel":"דוא\"ל","FieldNameID":"Email","FieldText":"` + this.summerCapmModel.user.Email.replace("\"","") + `"},
    {"FieldNameLabel":"מספר נכס","FieldNameID":"AssetNum","FieldText":"` + "0" + `"},
    {"FieldNameLabel":"אישור תנאי שימוש ומדיניות פרטיות","FieldNameID":"IsApprovedRegulation","FieldText":"true"},
    {"FieldNameLabel":"גרסת תנאי שימוש ומדיניות פרטיות","FieldNameID":"ApprovedRegulationVersion","FieldText":"Ver 2, https://www.mast.co.il/content/%D7%AA%D7%A7%D7%A0%D7%95%D7%9F"},
    {"FieldNameLabel":"כתובת IP","FieldNameID":"IP_Address","FieldText":"` + this.summerCapmModel.userIP.replace("\"","") + `"},
    {"FieldNameLabel":"אישור הרשמה","FieldNameID":"IsApprovedRegistration","FieldText":"true"}]`
    ); 
    this.params.push(this.param);
    this.param = new InputParams('@IsApprovedRegistration', "1");
    this.params.push(this.param);
    this.param = new InputParams('@TZ', this.summerCapmModel.user.TZ);
    this.params.push(this.param);
    this.param = new InputParams('@OriginId', (this.commonService.isMobileUser ? "2": "1"));
    this.params.push(this.param);
    this.param = new InputParams('@UserAgent', this.commonService.userAgent);
    this.params.push(this.param);
    

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend,'MastApi_KeepItCity','insertRequestToStutosNetForm')

    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
    }, err => {

    });
  }

  getSummerCampLink() {
   
    this.summerCapmObj.SubscriberID = this.summerCapmModel.TZChild;
    this.summerCapmObj.primaryParams.parentID = this.summerCapmModel.user.TZ;
    this.summerCapmObj.primaryParams.email = this.summerCapmModel.user.Email;
    this.summerCapmObj.primaryParams.familyName = this.summerCapmModel.user.LastName;
    this.summerCapmObj.primaryParams.mobileNum1 = this.summerCapmModel.user.Phone;
    this.summerCapmObj.primaryParams.mobileNum2 = this.summerCapmModel.phone2;
    this.summerCapmObj.primaryParams.parentType = this.summerCapmModel.parentType;
    this.summerCapmObj.primaryParams.personalName = this.summerCapmModel.user.FirstName;   

    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '81c7c9ee-6458-4c13-aed5-55e70b1fc30e';
    this.param = new InputParams("obj", JSON.stringify(this.summerCapmObj));
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.PayLogicClass')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      if (res.ErrorCode == "0") {
        this.isIframe = true;
        this.iframeSrc = res.URL;
      }
      if (res.ErrorCode == "105") { //יש חוב
        this.isDebt = true;
        $("#popup").fadeIn(200); 
      }
      if (res.ErrorCode == "1"){ // תעודת זהות לא מאומתת
        this.isDebt = false;
        this.iframeSrc = res.URL;
        $("#popup").fadeIn(200);   
      }    
    }, err => {
    });
//337358378
  }
  continueWithoutTZ()
  {
    $("#popup").fadeOut(200);  
    this.isIframe = true;
  }
  closePopup()
  {
    $("#popup").fadeOut(200);   
  }
  validation() {
    this.isValidParentTypeMesseg = this.valid.validEmptyFiled(this.summerCapmModel.parentType, "general");
    this.isValidTZMesseg = this.valid.validTZFun(this.summerCapmModel.user.TZ);
    this.isValidLastNameMesseg = this.valid.validEmptyFiled(this.summerCapmModel.user.LastName, "general");
    this.isValidFirstNameMesseg = this.valid.validEmptyFiled(this.summerCapmModel.user.FirstName, "general");
    this.isValidTZChildMesseg = this.valid.validTZFun(this.summerCapmModel.TZChild);   
    this.isValidEmailMesseg = this.valid.validEmailFun(this.summerCapmModel.user.Email);
  //  this.isValidHomePhoneMesseg = this.valid.validEmptyFiled(this.summerCapmModel.homePhone, "general");
    this.isValidPhoneMesseg = this.valid.validPhoneFun(this.summerCapmModel.user.Phone);
    this.isValidPhone2Messeg = this.valid.validEmptyFiled(this.summerCapmModel.phone2, "general");
    this.isValidRegulationsMesseg = this.valid.validRegulationsFun(this.isValidRegulations);
    this.isValidPasteEmailMesseg = this.valid.validCompare(this.summerCapmModel.user.Email, this.pasteEmail);

    if (this.isValidParentTypeMesseg != null || this.isValidTZMesseg != null ||
      this.isValidLastNameMesseg != null || this.isValidFirstNameMesseg != null ||
      this.isValidTZChildMesseg != null || this.isValidAddressMesseg != null ||
      this.isValidMikoodMesseg != null || this.isValidEmailMesseg != null ||
      this.isValidEmailMesseg != null || // this.isValidHomePhoneMesseg != null ||
      this.isValidPhoneMesseg != null || this.isValidPhone2Messeg != null ||
      this.isValidRegulationsMesseg || this.isValidPasteEmailMesseg)
      return false;
    return true;
  }

 
  validRegulationsFun() {
    this.isValidRegulationsMesseg = this.valid.validRegulationsFun(this.isValidRegulations);
  }
  validTZFun() {
    this.isValidTZMesseg = this.valid.validTZFun(this.summerCapmModel.TZChild);
  }


}

 class SummerCapmModel {
  user: User = new User();
  userIP: string = "";
  parentType: string = "";
  TZChild: string = ""; 
  notes: string = "";
  homePhone: string = "";
  phone2: string = "";
}
 class SummerCapmObj{
  SystemCode:string = "32501";
  ProcCode_ValidationSuccess:string = "201";
  ProcCode_ValidationFailed:string ="202";
  SubscriberID:string ="";
  primaryParams: primaryParams = new primaryParams();

}
class primaryParams {
  parentType:string;
  parentID : string;
  familyName:string;
  personalName:string;
  address:string;
  cityCode :string ="30007";
  zipCode:string ="0";
  email:string;
 // homePhoneNum:string;
  mobileNum1:string;
  mobileNum2:string;
}
