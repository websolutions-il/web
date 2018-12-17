import { Component, OnInit } from '@angular/core';
 
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { ScriptService } from '../../script.service';
import { billModel } from '../../../Models/bill-model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-user-bills-page',
  templateUrl: './user-bills-page.component.html',
  styleUrls: ['./user-bills-page.component.css']
})
export class UserBillsPageComponent implements OnInit {
   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();


  billsListToView: Array<billModel> = new Array();
  billsListFormIt: Array<billModel> = new Array();
  billsListPay24: Array<billModel> = new Array();
  singleBill: billModel;

  imageBillData: any;
  imageList: any;

  isFormIt: boolean = true;

  cityName: string;
  currentCityID: string;
  stubList: any = new Array();

  isMobileUser: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
     public commonService: CommonService, private jsonService: GetJsonService,
     ) {

    this.route.params.subscribe((params: Params) => {
      this.currentCityID = params['city'];
    });

    this.commonService.isVerifyAsset.first().subscribe(
      (isVerifyAsset) => {
        if (isVerifyAsset) {
          this.commonService.styleLoader = "position: absolute; right: 23%;";
          this.commonService.showLoader = true;
          this.isMobileUser = this.commonService.getIsMobileUser();
         
          if(this.commonService.cityModel.Id!=this.currentCityID)
          this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"השוברים שלי");  
          else
          this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"השוברים שלי");
        
          this.GetImageBills();
        }
        else {
          this.jsonService.createCookie("pageAfterVerifyAsset", '/user/' + this.currentCityID + '/bills', '');
          this.router.navigate(['user/' + this.currentCityID + '/verification-asset']);
        }
      })

  }
  ngOnInit() {
  }


  GetImageBills() {
    this.actionName = '64d6ff87-c1c7-4b64-9ead-76079b3898bd';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@company_id", this.currentCityID);
    this.params.push(this.param);
    this.param = new InputParams("@PayerId", "324");
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.PayLogicClass');

    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      //  console.log(res);
      if (res.Name == "errorWS" || res.Name == 'errorNotFound') {
        this.GetStubsFromFormIt();
        return false;
      }
      try {
        this.stubList = JSON.parse(res.GetMastStubsResult);
      } catch (error) {
        this.GetStubsFromFormIt();
        return false;
      }

      if (this.stubList.length == 0) {
        this.GetStubsFromFormIt();
        return false;
      }

      this.billsListPay24 = new Array();
      this.stubList.forEach(element => {
        element.Stub.stub_date = this.alterFormatDtae(element.Stub.stub_date);
        if (element.Stub.stub_price == "0") { element.Stub.status_id == "3" }
        this.singleBill = new billModel(element.Stub.stub_date,
          element.Stub.stub_code, element.Stub.stub_price, element.Stub.status_id, element.link, null);
        this.billsListPay24.push(this.singleBill);

      });

      this.billsListToView = this.billsListPay24;

      this.GetStubsFromFormIt();

    });

  }


  GetStubsFromFormIt() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '5b68f0ff-c1e0-498a-a42c-2a9d795d2d90';
    this.params = new Array<InputParams>();
    this.param = new InputParams("@ClientId", this.currentCityID);
    this.params.push(this.param);
    this.param = new InputParams("@PayerId", "101");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'GetStubsFromFormIt')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {

      if (res.length == 0) // סימן שהרשות אכן קיימת בפורמיט אך לא נמצאו נתונים ללקוח
      {
        this.commonService.showLoader = false;
        if (this.billsListToView.length == 0) // אך אין נתונים גם בפאי 24
        {
          $(".articles_table").html("<p style='padding-right: 3vw; font-size: 22px;'> אין נתונים להצגה </p>")
          $(".articles_table_mobile").html("<p style='padding-right: 29vw; font-size: 22px;'> אין נתונים להצגה </p>")
        }
        return false;
      }

      else if (res[0].result == 'empty')// הרשות לא קיימת בפורמיט
      {
        if (this.billsListToView.length == 0) // אך אין נתונים גם בפאי 24
        {
          this.commonService.showLoader = false;
          $(".articles_table").html("<p style='padding-right: 3vw; font-size: 22px;'> אין נתונים להצגה </p>")
          $(".articles_table_mobile").html("<p style='padding-right: 29vw; font-size: 22px;'> אין נתונים להצגה </p>")
          return false;
        }
        else { // יש נתונים בפאי 24 .נשאיר את הרשימה שנוצרה בפונקציה הקודמת
          this.isFormIt = false;
          // console.log(this.isFormIt)
          this.commonService.showLoader = false;
          return false;
        }

      }

      // אם הגענו לכאן- בטוח יש שוברים בפורמיט
      this.billsListFormIt = new Array();

      res.forEach(element => {

        if (element.payment_amount != null)
            element.payment_amount = element.payment_amount.toFixed(2); 

        if (element.payment_amount == "0" || element.is_meshalem_ok == true) 
            element.status_id = 3 
        
         let validityDate = new Date(element.create_date);

        this.billsListPay24.forEach(pay24 => {
          if (pay24.stub_code == element.stub_code) {

            if (element.status_id != 3)
              element.status_id = pay24.status;

            const index: number = this.billsListPay24.indexOf(pay24);
            this.billsListToView.splice(index, 1);
          }
        })
        

        if (element.status_id == null)
          element.status_id = 2;

        this.singleBill = new billModel(validityDate, element.stub_code,
           element.payment_amount, element.status_id, element.HTML_Link, element.PDF_Link);

        this.billsListToView.push(this.singleBill);
      });

      this.billsListToView.sort((a: billModel, b: billModel) => {
        return b.CreateDate.getTime() - a.CreateDate.getTime();
      });
 
      this.commonService.showLoader = false;
    }, err => {
      //alert(err);

    });

  }



  downloadFormitPdf(pdf) {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = 'aec3bdda-cf8d-42a7-b43b-6b494cf8de54';
    this.params = new Array<InputParams>();
    this.param = new InputParams('pdf', pdf);
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.PayLogicClass');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      var element = document.createElement('a');
      element.setAttribute('href', "assets/PdfBills/" + res.Value + ".pdf");
      element.setAttribute('download', res.Value + ".pdf");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);        
    }, err => {
      //alert(err);
    });
  }




  alterFormatDtae(date) {
    let b = date.toString();
    let year = b.substring(2, 4);
    let monthe = b.substring(4, 6);
    let day = b.substring(6, 8);
    date = "20" + year + "-" + monthe + "-" + day;
    return new Date(date);
  }
  popUpScript(bill) {
    $('.popuppayshow').hide();
    if (bill.img_link != null) {
      let _formId = "#" + bill.stub_code;
      if (this.isMobileUser)// לצורך שינוי האי די בין טלפון למחשב רגיל
      { _formId = "#" + bill.stub_code + "mobile"; }
      $(_formId).show();

    }
    else {
      alert("לא נמצאה תמונה");
    }
  }
  closePopUp(event) {
    event.stopPropagation();
    $('.popuppayshow').hide();
  }

  goToPaymentPage(event, stub_code) {
    event.stopPropagation();
    this.router.navigate(["user/" + this.currentCityID + "/bill/" + stub_code]);
  }



}
