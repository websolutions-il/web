import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { User } from '../../../Models/UserModel';
import { InsertAssetModel } from '../../../Models/InsertAssetModel';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
 
import { GetJsonService } from '../../services/get-json.service'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { FormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { ValidationService } from '../../services/validation.service';
import { CityDropDownComponent } from '../../components/city-drop-down/city-drop-down.component';
import { GetUserIpService } from '../../services/get-user-ip.service';

declare function allowOnlyNumbers(): any;
//declare function recaptchaScript(): any;
declare var grecaptcha: any;

@Component({
  selector: 'app-registraion-log-in-page',
  templateUrl: './registraion-log-in-page.component.html',
  styleUrls: ['./registraion-log-in-page.component.css']
})
export class RegistraionLogInPageComponent implements OnInit, AfterViewInit {

   

  @ViewChild('CityDropDown') cityList: CityDropDownComponent;
  @ViewChild('CityDropDown2') cityList2: CityDropDownComponent;

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  // create user
  user: User = new User();
  TzOrPassport: string;
  // validate create user
  isValidExsistsPhone: boolean = false;
  isValidRegulations: boolean;
  isValidRegulationsMesseg: boolean = false;
  isValidFirstNameMesseg: string;
  isValidLastNameMesseg: string;
  isValidEmailMesseg: string;
  isValidPhoneMesseg: string;
  isValidTZMesseg: string;
  isValidRecaptcha: boolean;
  // log in
  isvalidPhoneLoginUserMesseg: string;
  phoneNumberNotFoundInSystemMesseg: boolean = false;
  isExpiredSms: boolean;
  expiredMesseg: string;
  isValidRegulationsForRegUser: boolean;
  isValidRegulationsForRegUserMesseg: boolean;
  smsCode: string = "";
  smsSessionGuid: string;
  userSessionGuid: string;
  payerID: string;
  phone: string;
  phoneNumberToLogIn: string = "";
  smsCodeIncorrectMesseg: boolean;
  userDetails: any;
  isVocalMesseg: boolean;
  userIP: string;

  userCompenyId:string;
  requestedCity: string;
  constructor(private route: ActivatedRoute, private valid: ValidationService,
    private coomonService: CommonService, private _location: Location,
    private router: Router, private jsonService: GetJsonService,private ipService: GetUserIpService
  ) {
    $("head").append("<link rel='stylesheet' href='/assets/css/general.css' />");

    this.route.params.subscribe((params: Params) => {
      this.requestedCity = params['city'];
    });

  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.coomonService.recaptchaScript();
    allowOnlyNumbers();
  }

  insertUserToDB() {
    if (!this.validSumaryRegFun()) {
      this.valid.setFocusToLastAlertForAccessibility("form_section_1", 2);
      return false;
    }
    this.actionName = '69d2096b-2e55-4f56-a743-a63778c914c3';
    this.user.identity_type = (this.TzOrPassport == 'tz' ? "1" : "3");
    this.user.UserName = this.user.TZ;  // (this.user.UserName == '' ?  this.user.TZ : this.user.UserName );
    ;
    if (!this.requestedCity)
      this.user.CompanyId = this.cityList.getSelectedCityId();
    else
      this.user.CompanyId = this.requestedCity;

    let arr = [];

    for (let key in this.user) {
      if (this.user.hasOwnProperty(key)) {
        arr.push(this.user[key]);
      }
    }
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();

    for (let i = 0; arr.length - 1 > i; i += 2) {
      this.param = new InputParams(arr[i + 1], arr[i]);
      this.params.push(this.param);
    }

    this.param = new InputParams("@userAgent", this.coomonService.userAgent);
    this.params.push(this.param);

    this.param = new InputParams("token", this.coomonService.guid());
    this.userSessionGuid = this.param.Value;
    this.params.push(this.param);

    let recaptchaCode = $(".g-recaptcha-response").val();
    this.param = new InputParams("@recaptchaCode", recaptchaCode.toString());
    this.params.push(this.param);

    if (!this.requestedCity)
      this.param = new InputParams("cityName", this.cityList.selectedCity);
    else
      this.param = new InputParams("cityName", this.cityList.getCityNameById(this.requestedCity));
     this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MemberShipProvide', 'MemberShipProvide.MsProvide/');

    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.isValidRecaptcha = false;
      if (res.Name == "errorRecaptcha") {
        this.isValidRecaptcha = true;
        return false;
      }
      this.isValidExsistsPhone = false;
      if (res.Name == "errorExistsUser") {
        grecaptcha.reset(); // נאפס את הקפצ'ה כי ם היא תישלח עם אותו אישור פעמיים תחזור תשובה שלילית
        this.isValidExsistsPhone = true;
        $("#cellphone_number").addClass("inputErrorToFocus");
        this.valid.setFocusToLastAlertForAccessibility("form_section_1", 2);
        return false;
      }
      this.jsonService.createCookie("token", this.userSessionGuid, 1);

      this.router.navigate(['/user/' + (this.requestedCity ? this.requestedCity : this.cityList.getSelectedCityId()) + '/services']);
    }, err => {

    });
  }


  setTzOrPassport(e) {
    this.TzOrPassport = e.target.value;
    setTimeout(() => {
      let tz = $("#TZ");
      tz.prop("placeholder", (this.TzOrPassport == 'tz' ? '* תעודת זהות' : '* דרכון'));
      tz.focus();
    }, 1);
  }

  setTzOrPassportToNull() {
    this.TzOrPassport = null;
    this.isValidTZMesseg = null;
  }

  logIn(isVocalMesseg) {
    
    this.validPhoneLoginUserFun()
    if (this.isvalidPhoneLoginUserMesseg != null) {
      this.valid.setFocusToLastAlertForAccessibility("login_form_box_1", 2);
      return false;
    }
    this.coomonService.showLoader = true;

   
   
   let data = this.EwaPost.BuildDataStructure("5c8906b5-31c0-4ee5-8d1f-5b85ec68f827",
                                   [{Name : "phone", Value :this.phoneNumberToLogIn},
                                    {Name : "isVocalMesseg", Value :isVocalMesseg}],
                                   'MemberShipProvide','MemberShipProvide.MsProvide/');
    this.jsonService.sendData(data).subscribe(res => {
      this.coomonService.showLoader = false;
      if(res == "NOT_EXISTS")
      {
        $("#FirstName").focus();
        return false;
      }
      if (res.Name == "ExceedingConnection") {
        $("#smsCodeForm").css("display", "none");
        $("#logInForm").css("display", "block");
        this.isExpiredSms = true;
        let time = res.Value.split("|");
        this.expiredMesseg = "לא ניתן להתחבר כעת, אנא נסה בעוד " + time[0] + " שעות ו " + time[1] + " דקות ";
        setTimeout(() => {
          $("#mobilenumber").addClass("inputErrorToFocus");
          this.valid.setFocusToLastAlertForAccessibility("login_form_box_1",2);
        }, 200); 
      }
      else{
        $("#logInForm").css("display", "none");
        $("#smsCodeForm").css("display", "block");
        $("#smsCodeInput").focus();
      }
    }, err => {   });
  }

  validateSmsCode() {   
    this.userSessionGuid =this.coomonService.guid();
   let data = this.EwaPost.BuildDataStructure("51faf412-bd15-42a2-b706-7d16964f7548",
                                    [{Name : "code", Value :this.smsCode},
                                     {Name : "phone", Value :this.phoneNumberToLogIn},
                                     {Name : "token", Value :this.userSessionGuid}],
                                    'MemberShipProvide','MemberShipProvide.MsProvide/');

    this.jsonService.sendData(data).subscribe(res => {
      if (res.Value == "ERROR_CODE") {
        $("#smsCodeInput").addClass("inputErrorToFocus");
        this.valid.setFocusToLastAlertForAccessibility("login_form_box_smsCode", 2);
        this.smsCodeIncorrectMesseg = true;
        return false;
      }
      else{
        this.userCompenyId = res[0].company_id;

        if (res[0].IsApprovedRegulation != 1) {
          this.ipService.getIpCliente().subscribe(res => {
            this.userIP = res;
          }, err => {     });
          $("#smsCodeForm").css("display", "none");
          $("#approvedRegulationForm").css("display", "block");
          return false;
        }      
      
        if(this.userCompenyId != "0" || this.requestedCity)
        {          
          this.jsonService.createCookie("token", this.userSessionGuid, 1);
          this.router.navigate(['/user/' + (this.userCompenyId != "0" ? this.userCompenyId : this.requestedCity )  + '/services']);
        }
        else
        {
          $("#smsCodeForm").css("display", "none");
          $("#addCityForm").css("display", "block");        
        }
      }
    }, err => {   });

  }  



  updateCity() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '3BCA5D86-B579-4831-B48A-F4BFBDEE0415';
    this.params = new Array<InputParams>();
    this.param = new InputParams("@phone", this.phoneNumberToLogIn);
    this.params.push(this.param);
    this.param = new InputParams("@CompanyId", this.cityList2.getSelectedCityId());
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'updateCity')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      if (res[0].result == 1) {
        this.jsonService.createCookie("token", this.userSessionGuid, 1);
        this.router.navigate(['/user/' + this.cityList2.getSelectedCityId() + '/services']);
      }
    }, err => { });
  }



  approvedRegulationFun() {
    this.validRegulationsForRegUserFun()
    if (this.isValidRegulationsForRegUserMesseg) {
      this.valid.setFocusToLastAlertForAccessibility("login_form_box_regulations", 2);
      return false;
    }
    let data = this.EwaPost.BuildDataStructure("115f040b-df82-466d-85af-b930dbd7d737",
    [{Name : "@phone", Value :this.phoneNumberToLogIn},
     {Name : "@RegIp", Value :this.userIP}],
    'MastApi_Pay24','updateRegulation');
     this.jsonService.sendData(data).subscribe(res => {
      if (res[0].result == 1) {
        if(this.userCompenyId != "0" || this.requestedCity)
        {          
          this.jsonService.createCookie("token", this.userSessionGuid, 1);
          this.router.navigate(['/user/' + (this.userCompenyId != "0" ? this.userCompenyId : this.requestedCity )  + '/services']);
        }
        else
        {
          $("#addCityForm").css("display", "block");  
          $("#approvedRegulationForm").css("display", "none");      
        }
      }
    }, err => {
      //alert(err);
    });
  }

  hideIncorrectCodeMesseg() {
    this.smsCodeIncorrectMesseg = false;
  }
  openPageFromFooter(pageName) {
    this.router.navigate(["content/" + pageName]);
  }

  goToLastPage() {
    this._location.back();
  }

  // validaition log in
  validPhoneLoginUserFun() {
    this.isvalidPhoneLoginUserMesseg = this.valid.validPhoneFun(this.phoneNumberToLogIn);
  }
  // validaition registration
  validFirstNameFun() {
    this.isValidFirstNameMesseg = this.valid.validNameFun(this.user.FirstName, "FirstName");
  }
  validLastNameFun() {
    this.isValidLastNameMesseg = this.valid.validNameFun(this.user.LastName, "LastName");
  }
  validEmailFun() {
    this.isValidEmailMesseg = this.valid.validEmailFun(this.user.Email);
  }
  validPhoneFun() {
    this.isValidPhoneMesseg = this.valid.validPhoneFun(this.user.Phone);
  }
  validTZFun() {
    if (this.TzOrPassport == 'tz')
      this.isValidTZMesseg = this.valid.validTZFun(this.user.TZ);
    else
      this.isValidTZMesseg = this.valid.validEmptyFiled(this.user.TZ, "passport");
  }
  validRegulationsFun() {
    this.isValidRegulationsMesseg = this.valid.validRegulationsFun(this.isValidRegulations);
  }
  validSumaryRegFun() {
    this.validRegulationsFun();
    this.validFirstNameFun();
    this.validLastNameFun();
    this.validEmailFun();
    this.validPhoneFun();
    this.validTZFun();

    if (!this.requestedCity)
      this.cityList.validCitiNameFun();


    if (this.isValidFirstNameMesseg != null || this.isValidLastNameMesseg != null ||
      this.isValidEmailMesseg != null || this.isValidPhoneMesseg != null ||
      this.isValidTZMesseg != null || this.isValidRegulationsMesseg ||
      this.cityList.isValidCityNameMesseg != null)
      return false;
    return true;
  }
  // validaition Regulations 
  validRegulationsForRegUserFun() { // לטובת משתמשים שהוספו ע"י נציג ורק צריכים לאשר תקנון
    this.isValidRegulationsForRegUserMesseg = this.valid.validRegulationsFun(this.isValidRegulationsForRegUser);
  }


}
