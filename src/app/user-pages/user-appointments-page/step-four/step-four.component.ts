import { Component, OnInit, AfterViewInit, trigger } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../../Models/ParamsModel';
import { GetJsonService } from '../../../services/get-json.service';
import { CommonService } from '../../../services/common.service';
import { GetUserIpService } from '../../../services/get-user-ip.service';
import { User } from '../../../../Models/UserModel';
import { ValidationService } from '../../../services/validation.service';

declare function appointmentsUserDetails();
declare var $: any;
declare var selectedPrefix: any;

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.css']
})
export class StepFourComponent implements OnInit, AfterViewInit {

  userIP: any;
  prefixList: any = ['050','051','052', '053', '054', '055','056', '058' ,'059'];

  isValidRegulationsMesseg: boolean;
  isValidRegulations: any;
  isValidTZMesseg: string;
  isValidPhoneMesseg: string;
  isValidPrefixMesseg: string;
  isValidEmailMesseg: string;
  isValidLastNameMesseg: string;
  isValidFirstNameMesseg: string;
  isValidFirstName: boolean;
  isValidRecaptcha: boolean;

  isFirstForm: boolean = true;

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();
  stepToBack:string;
 
  constructor(private valid: ValidationService, private ipService: GetUserIpService, public appointmentsService: AppointmentsService, private jsonService: GetJsonService, public commonService: CommonService) {

    if (!this.appointmentsService.userDetails) {
      if (this.appointmentsService.isLogInUser)
       { 
         if(!this.commonService.userDetails)
         this.getUserDetail();
         else
         this.setUserDeatils(this.commonService.userDetails);
       }
      else { this.appointmentsService.userDetails = new User(); }
    }

  }

  ngOnInit() {
    this.ipService.getIpCliente().subscribe(res => {
      this.userIP = res;
    }, err => {
      //alert(err);
    });


   var interval = setInterval(()=> {  
       this.checkPrefix(interval);
     },1000);  
  }

  checkPrefix(interval){
   if($('.selectdropdown span').hasClass('active'))
   {     
    clearInterval(interval);
    this.validPrefixFun(); 
   }
  }

  ngAfterViewInit() { 
    this.stepToBack = this.appointmentsService.selected_sub_department.Link ? "three" : "tow";
   }
  
  initPrefix() {   
      if (this.appointmentsService.prefix != "")
       {
          $(".prefix_form span.desc").html(this.appointmentsService.prefix); 
       }     
  }
  getUserDetail() {
    let data =this.EwaPost.getUserDetail();
    this.jsonService.sendData(data).subscribe(res => {
     this.setUserDeatils(res);
    }, err => {
      //alert(err);
    });
  }
  setUserDeatils(ud)
  {
    this.appointmentsService.userDetails = new User();
    this.appointmentsService.userDetails.UserName = ud[0].UserName;
    this.appointmentsService.userDetails.FirstName = ud[0].FirstName;
    this.appointmentsService.userDetails.LastName = ud[0].LastName;
    this.appointmentsService.userDetails.Phone = ud[0].Phone;
    this.appointmentsService.userDetails.CompanyId = ud[0].CompanyId;
    this.appointmentsService.userDetails.Email = ud[0].Email;

    selectedPrefix = ud[0].Phone.substring(0, 3);
    this.appointmentsService.prefix = selectedPrefix;
    this.appointmentsService.rest_phone = ud[0].Phone.substring(3, 10);
  }

  showNextForm() {
    this.validTZFun();
    if (this.isValidTZMesseg != null) {
      this.valid.setFocusToLastAlertForAccessibility("tz_form", 2);
      return false;
    }
    // this.dataToSend = new Array<ActionInputParams>()
    // this.params = new Array<InputParams>();
    // this.actionName = '4b1f49ab-f8b3-434e-96ef-3c4c27dd0048';
    // this.params = new Array<InputParams>();
    // this.param = new InputParams("@payerId", this.appointmentsService.userDetails.UserName);
    // this.params.push(this.param);

    // this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    // this.dataToSend.push(this.singleDataObj);
    // this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'CheckIfUserExists')
    // this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
   
    //   if (res.length == 0) {
    //     this.appointmentsService.isRegUser = false;
    //   }
    //   else {
        this.appointmentsService.isRegUser = true;
    //  }
      $(".wrap_move").last().addClass("step-move-out");
      setTimeout(() => {
      $(".wrap_move").last().removeClass("step-move-out");
      this.isFirstForm = false;
      },300);
      
     
      setTimeout(() => {
        appointmentsUserDetails();
        this.initPrefix();
        if (!this.appointmentsService.isRegUser) { this.commonService.recaptchaScript(); }
      }, 500);
   // }, err => {
   // });
  }


  backToFirstForm() {
    $(".wrap_move").last().addClass("step-move-out");
    setTimeout(() => {
    $(".wrap_move").last().removeClass("step-move-out");
    this.isFirstForm = true;
      },300);
  
   
    setTimeout(() => {
      appointmentsUserDetails();
    }, 200);
  }


  regUserOrGoNextStep() {
    if (!this.validSumaryRegFun()) {
      this.valid.setFocusToLastAlertForAccessibility("det_form", 2);
      return false;
    }
    this.appointmentsService.userDetails.Phone = this.appointmentsService.prefix + this.appointmentsService.rest_phone;
    if (!this.appointmentsService.isRegUser) { this.insertUserToDB(); }
    else { this.appointmentsService.changeStep("five"); }
  }

  insertUserToDB() {

    this.actionName = '59216607-79DB-44F3-B1D7-3E9E5B1D3E14';

    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams('@RegIp', this.userIP);
    this.params.push(this.param);
    this.param = new InputParams('@user_name', this.appointmentsService.userDetails.UserName);
    this.params.push(this.param);
    this.param = new InputParams('@password', '');
    this.params.push(this.param);
    this.param = new InputParams('@tz', this.appointmentsService.userDetails.UserName);
    this.params.push(this.param);
    this.param = new InputParams('@first_name', this.appointmentsService.userDetails.FirstName);
    this.params.push(this.param);
    this.param = new InputParams('@last_name', this.appointmentsService.userDetails.LastName);
    this.params.push(this.param);
    this.param = new InputParams('@company_id', "0");
    this.params.push(this.param);
    this.param = new InputParams('@email', this.appointmentsService.userDetails.Email);
    this.params.push(this.param);
    this.param = new InputParams('@phone', this.appointmentsService.userDetails.Phone);
    this.params.push(this.param);
    this.param = new InputParams('@bill2mail', "true");
    this.params.push(this.param);
    this.param = new InputParams('@IsApprovedRegulation', "true");
    this.params.push(this.param);

    this.param = new InputParams("@userAgent" , this.commonService.userAgent);  
    this.params.push(this.param);

    let recaptchaCode = $(".det_form .g-recaptcha-response").val();
    this.param = new InputParams("@recaptchaCode", recaptchaCode.toString());
    this.params.push(this.param);
   
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
   // console.log(this.singleDataObj)
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'insertUserToDB')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
    //  console.log(res)
      this.isValidRecaptcha = false;
      if (res.Name == "errorRecaptcha") {
        this.isValidRecaptcha = true;
        return false;
      }
      this.appointmentsService.changeStep("five");
    }, err => {
      //alert(err);
    });

  }

  validFirstNameFun() {
    this.isValidFirstNameMesseg = this.valid.validNameFun(this.appointmentsService.userDetails.FirstName, "FirstName");
  }
  validLastNameFun() {
    this.isValidLastNameMesseg = this.valid.validNameFun(this.appointmentsService.userDetails.LastName, "LastName");
  }
  validEmailFun() {
    this.isValidEmailMesseg = this.valid.validEmailFun(this.appointmentsService.userDetails.Email);
  }
  validPhoneFun() {    
    this.isValidPhoneMesseg = this.valid.validExactlySevenLetters(this.appointmentsService.rest_phone, "restPhone");
  }
  validPrefixFun(){  
   this.appointmentsService.prefix = selectedPrefix;   
   this.isValidPrefixMesseg = (selectedPrefix != "" ? null : "יש לבחור קידומת");   
  }
  validTZFun() {
    this.isValidTZMesseg = this.valid.validTZFun(this.appointmentsService.userDetails.UserName);
  }
  validRegulationsFun() {
    this.isValidRegulationsMesseg = this.valid.validRegulationsFun(this.isValidRegulations);
  }
  validSumaryRegFun() {
    if (!this.appointmentsService.isRegUser)
      this.validRegulationsFun();

    this.validFirstNameFun();
    this.validLastNameFun();
    this.validEmailFun();
    this.validPhoneFun();
    this.validTZFun();
    this.validPrefixFun();
    if (this.isValidFirstNameMesseg != null || this.isValidLastNameMesseg != null ||
      this.isValidEmailMesseg != null || this.isValidPhoneMesseg != null ||
      this.isValidTZMesseg != null || this.isValidRegulationsMesseg ||  this.isValidPrefixMesseg != null)
      return false;
    else
      return true;
  }

}
