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

@Component({
  selector: 'app-manager-log-in',
  templateUrl: './manager-log-in.component.html',
  styleUrls: ['./manager-log-in.component.css']
})
export class ManagerLogInComponent implements OnInit {
  @ViewChild('CityDropDown2') cityList2: CityDropDownComponent;
   

  EwaPost: EvaDataStructure = new EvaDataStructure();
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
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
  phoneNumberManager:string;
  constructor(private route: ActivatedRoute, private valid: ValidationService,
    private coomonService: CommonService, private _location: Location,
    private router: Router, private jsonService: GetJsonService,private ipService: GetUserIpService
  ) { }

  ngOnInit() {
  }


  logIn(isVocalMesseg) {
    
    this.validPhoneLoginUserFun()
    if (this.isvalidPhoneLoginUserMesseg != null) {
      this.valid.setFocusToLastAlertForAccessibility("login_form_box_1", 2);
      return false;
    }
    $("#logInForm").css("display", "none");
    $("#smsCodeForm").css("display", "block");
    $("#smsCodeInput").focus();
   
   let data = this.EwaPost.BuildDataStructure("4f08544d-e850-45ca-a96b-f96307f2b1ef",
                                   [{Name : "user_phone", Value :this.phoneNumberToLogIn},
                                    {Name : "manager_phone", Value :this.phoneNumberManager}],
                                   'MemberShipProvide','MemberShipProvide.MsProvide/');
    this.jsonService.sendData(data).subscribe(res => {
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
      
        if(this.userCompenyId != "0")
        {          
          this.jsonService.createCookie("token", this.userSessionGuid, 1);
          this.router.navigate(['/user/' +  this.userCompenyId  + '/services']);
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
        if(this.userCompenyId != "0")
        {          
          this.jsonService.createCookie("token", this.userSessionGuid, 1);
          this.router.navigate(['/user/' +  this.userCompenyId + '/services']);
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


  validPhoneLoginUserFun() {
    this.isvalidPhoneLoginUserMesseg = this.valid.validPhoneFun(this.phoneNumberToLogIn);
  }
  validRegulationsForRegUserFun() { // לטובת משתמשים שהוספו ע"י נציג ורק צריכים לאשר תקנון
  this.isValidRegulationsForRegUserMesseg = this.valid.validRegulationsFun(this.isValidRegulationsForRegUser);
}


}
