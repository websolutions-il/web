import { Component, OnInit } from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GetJsonService } from '../../services/get-json.service';
import { FullActionInputParams, ActionInputParams, InputParams } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
import { ValidationService } from '../../services/validation.service';
@Component({
  selector: 'app-user-afternoon-kids-payment',
  templateUrl: './user-afternoon-kids-payment.component.html',
  styleUrls: ['./user-afternoon-kids-payment.component.css']
})
export class UserAfternoonKidsPaymentComponent implements OnInit {
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;

  paymentName: string;
  currentCityId: string;
  iframeSrc: string = '';
   

  TZChild: string="";
  arnonaUserName: string = "";
  isValidTZMesseg: string;
  isValidUserNameMesseg: string;
  isValidSummary: boolean;
  step: string;
  //lod
  childName: string;
  fatherName: string;
  fatherTZ: string;
  motherName: string;
  motherTZ: string;
  address: string;
  instituteName :string;
 // sderot
 ID:string;
 StudentID:string;
 Address:string;
 PayerId:string;
 DateEntrance:string;
 StudentAge:string;
 School:string;
 ServiceType:string;
 guid:string;
 isAlredyPay:boolean;


  constructor(private router: Router, private jsonService: GetJsonService,
    public commonService: CommonService, private route: ActivatedRoute,
    private valid: ValidationService) {
   
    this.route.params.subscribe((params: Params) => {
      this.currentCityId = (params['child'] ? params['child'] : params['city']);
      this.getPaymentTypeName();
    });
    this.step = 'add-details';  
    if(this.currentCityId!="35") 
    this.commonService.setTitleAndDescription("otherServices","לוד", "צהרונים");
    else
    this.commonService.setTitleAndDescription("otherServices","שדרות", "חינוך");
  }

  ngOnInit() {
    $("#frameDemo").on("load", function () {
      try {
        $("#frameDemo").css("height", $('#frameDemo').contents().find(".content").height() + 300);
      }
      catch (e) {

      }      
    });       
  }
  backStep(step)
  {
    this.step = step;
  }
  getPaymentTypeName() {
    this.actionName = '28860fde-3181-4333-a66e-48900e7ff846';
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.param = new InputParams("@ComepenyId", this.currentCityId);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', '');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.paymentName = res[0].result;
    }, err => {
      //alert(err);
    });

  }

  getSderotStudentsDetails(){
    //if (!this.validationSummary())
    //return false;

  this.dataToSend = new Array<ActionInputParams>()
  this.params = new Array<InputParams>();
  this.actionName = 'B968AE86-E8E7-4758-AB48-97B27F9B0DD9';
  this.params = new Array<InputParams>();
 
  this.param = new InputParams("@TZChild", this.TZChild);
  this.params.push(this.param);
 
  this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
  this.dataToSend.push(this.singleDataObj);
  this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity', 'getSderotStudentsDetails')
  this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
   console.log(res);
   this.isAlredyPay = false;
    if (res[0].result == "NOT_EXISTS")
     {
      $("#popup").fadeIn(200);   
      this.isValidSummary = true;
     }
     else if(res[0].result == "PAY")
     {
      $("#popup").fadeIn(200);   
      this.isAlredyPay = true;
      this.isValidSummary = true;
     }
    else {
      this.step = 'confirm';
      this.ID =  res[0].ID;
      this.StudentID =  res[0].StudentID;
      this.Address = res[0].Address;
      this.PayerId =  res[0].PayerId;
      this.DateEntrance = res[0].DateEntrance;
      this.StudentAge = res[0].StudentAge;
      this.School =res[0].School;
      this.ServiceType =res[0].ServiceType;
      this.guid = res[0].Guid;
    }

  }, err => {

  });
  }

  getAfternoonChildsDetails() {

    if (!this.validationSummary())
      return false;

    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '093eae28-de36-43aa-bc2b-eae9c1b13b45';
    this.params = new Array<InputParams>();
   
    this.param = new InputParams("@TZChild", this.TZChild);
    this.params.push(this.param);
   
    this.param = new InputParams("@companyId", this.currentCityId);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'getAfternoonChildsDetails')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {

      if (res.length == 0)
       {
        $("#popup").fadeIn(200);   
        this.isValidSummary = true;
       }
      else {
        this.step = 'confirm';
        this.childName =  res[0].FirstName + " " + res[0].LastName;
        this.fatherName =  res[0].FatherName;
        this.fatherTZ = res[0].FatherId;
        this.motherName =  res[0].MotherName;
        this.motherTZ = res[0].MotherId;
        this.address = res[0].Address;
        this.instituteName =res[0].InstituteName;
      }

    }, err => {

    });

  }
  closePopup()
  {
    $("#popup").fadeOut(200);   
  }
   //sderot
  goToForm()
  {
    this.step = 'pay';
    this.iframeSrc = this.jsonService.BASE_FORM_URL + "?prm=" +
     "529ED3B1-DE9D-4834-85D3-CFFF19BB983B&genfillGuid=" + this.guid;
  }
   // lod
  goToPayment() {
   this.step = 'pay';
   if(!this.commonService.isLogInUser)
   this.iframeSrc = this.jsonService.BASE_PAY24_URL + "?ReshutMast=" +
    this.currentCityId +
    "&payOrigin="+(this.commonService.isMobileUser? "MAST_Web_Mobile":"MAST_Web")   
    +"&TZChild="+this.TZChild + 
    "&arnonaUserName="+this.arnonaUserName;
   else
   this.getTokenForUserPay();
  }

  getTokenForUserPay() {
    this.actionName = 'f31aa8bb-8c90-465d-8f61-aa3562574010';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@CompanyId", this.currentCityId);
    this.params.push(this.param);
    this.param = new InputParams("@StubCode", this.TZChild);
    this.params.push(this.param);
    this.param = new InputParams("@PayerId", "16");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.PayLogicClass')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      if (res.Name == "errorWS") {
        alert("WS is down");
        return false;
      }
      this.iframeSrc = this.jsonService.BASE_PAY24_URL + "?token=" + res.Value 
      + "&payOrigin="+(this.commonService.isMobileUser? "MAST_Web_Mobile":"MAST_Web")   
      +"&arnonaUserName="
      +this.arnonaUserName;
    }, err => {  });
  }

  validTZFun() {
    this.isValidTZMesseg = this.valid.validTZFun(this.TZChild);
  }
  validUserNameFun() {
    this.isValidUserNameMesseg = this.valid.validSevenLetters(this.arnonaUserName, "payerNumber")
  }

  validationSummary() {
    this.validTZFun();
   // this.validUserNameFun();

    if (this.isValidTZMesseg != null || this.isValidUserNameMesseg != null)
      return false;
    return true;
  }
}
