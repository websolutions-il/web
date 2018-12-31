import { Component, OnInit } from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GetJsonService } from '../../services/get-json.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { User } from '../../../Models/UserModel';
import { GetUserIpService } from '../../services/get-user-ip.service';
import { ValidationService } from '../../services/validation.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-user-bill-in-mail',
  templateUrl: './user-bill-in-mail.component.html',
  styleUrls: ['./user-bill-in-mail.component.css']
})
export class UserBillInMailComponent implements OnInit {

  currentCityID: any;
  user: User = new User();
  assetNumber: string = "";
  userIP: string;

   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  isValidEmailMesseg: string;
  isValidUserNameMesseg: string;
  isResultMesseg: boolean;
  resultMesseg: string;
  isReqUserName: boolean;
  showB2mTbl:boolean = true;
  showAddB2m:boolean;
  constructor(private valid: ValidationService, private ipService: GetUserIpService,
    private router: Router, private route: ActivatedRoute,
    private jsonService: GetJsonService, private commonService: CommonService) {
    this.route.params.subscribe((params: Params) => {
      this.currentCityID = params['city'];
    });
    this.validCityInB2M();
    if (!this.commonService.userDetails)
      this.getUserDetail();
    else
      this.setUserDetails(this.commonService.userDetails);

    this.getUserAssets();
  }


  ngOnInit() {
  }

  checkRegisterCompeny(list){
    let exists = list.filter(c=> c.company_id == this.currentCityID);
    this.showAddB2m = !(exists.length > 0);
    this.showB2mTbl = (list.length > 0);
  }

  validCityInB2M() {
    let data = this.EwaPost.BuildDataStructure('8dd324be-c207-4afb-ab1b-0476dc094c59',
     [{Name : "@MgarId" , Value : this.currentCityID}],
     'MastApi_Pay24', 'validCityInB2M');
    this.jsonService.sendData(data).subscribe(res => {
      if (res.length == 0)
        this.router.navigate(['']);
      if (res[0].IsB2M != true)
        this.router.navigate(['']);
    }, err => {  });
  }
  getUserDetail() {
    let data = this.EwaPost.getUserDetail();
    this.jsonService.sendData(data).subscribe(res => {
      this.setUserDetails(res);
    }, err => { });
  }
  setUserDetails(res) {
    this.user.Email = res[0].Email;
    this.user.FirstName = res[0].FirstName;
    this.user.LastName = res[0].LastName;
    this.user.TZ = res[0].UserName;
    this.user.UserName = res[0].UserName;
  }
  getUserAssets() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '6cd2108b-b84d-4b79-b1f9-34eb88dc486e';
    this.params = new Array<InputParams>();
    this.param = new InputParams("@PayerId", "17");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'GetAssetsByPayerId')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      // console.log(res);
      let asset = res.filter(c => c.company_id == this.currentCityID);
      this.assetNumber = asset[0].AssetNumber;

    }, err => {
      //alert(err);
    });
  }

  insertUserToB2M() {
      this.commonService.showLoader = true;
    this.validEmailFun();
    this.validUserNameFun();
    if (this.isValidEmailMesseg != null || this.isValidUserNameMesseg != null) {
      this.commonService.showLoader = false;
      this.valid.setFocusToLastAlertForAccessibility("form1", 2);
      return false;
    }

    this.actionName = 'a833a981-566b-46ad-9b83-d4932f3f6ad7';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams('@company_id', this.currentCityID);
    this.params.push(this.param);

    this.param = new InputParams('@email', this.user.Email);
    this.params.push(this.param);

    this.param = new InputParams('@user_name', this.user.UserName);
    this.params.push(this.param);

    this.param = new InputParams('@last_name', this.user.LastName);
    this.params.push(this.param);

    this.param = new InputParams('@first_name', this.user.FirstName);
    this.params.push(this.param);

    this.param = new InputParams('@phone', this.user.Phone);
    this.params.push(this.param);

    this.param = new InputParams('@assetNumber', this.assetNumber);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.PayLogicClass')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.commonService.showLoader = false;
      if (res.Name == "errorWS") {
        alert("WS is down");
        return false;
      }
      if (res.Value == "success") {        
        $(".alertSign").show();
        setTimeout(() => {
          $(".alertSign").hide();
          this.router.navigate(["user/" + this.currentCityID + '/services']);
        }, 3000);
      }
      if (res.Value == "existsUser") {
        $(".email_address").addClass("inputErrorToFocus");
        this.isResultMesseg = true;
        this.resultMesseg = "מספר זה כבר קיים במערכת"
        this.valid.setFocusToLastAlertForAccessibility("form1", 2);
      }
      if (res.Value == "reg-fail") {

        if (!this.isReqUserName) {
          this.user.UserName = "";
          this.isReqUserName = true;
        }
        else {
          $(".payerNumber").addClass("inputErrorToFocus");
          this.isResultMesseg = true;
          this.resultMesseg = "ההרשמה נכשלה. עמכם הסליחה."
          this.valid.setFocusToLastAlertForAccessibility("form1", 2);
        }
      }
      // console.log(res);

    }, err => {
      //alert(err);
    });
  }


  validEmailFun() {
    this.isValidEmailMesseg = this.valid.validEmailFun(this.user.Email);
  }
  validUserNameFun() {
    this.isResultMesseg = false;
    this.isValidUserNameMesseg = this.valid.validEmptyFiled(this.user.UserName, "payerNumber");
  }



}
