import { Component, OnInit } from '@angular/core';
 
import { CommonService } from '../../services/common.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from 'rxjs';
declare function arrowMyOpend();
@Component({
  selector: 'app-user-my-opend-page',
  templateUrl: './user-my-opend-page.component.html',
  styleUrls: ['./user-my-opend-page.component.css']
})
export class UserMyOpendPageComponent implements OnInit {
   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();


  opendList: any = new Array();
  lastPopUpShowId: string = "";

  cityName: string;
  currentCityID: string;
  isVerifyAsset:boolean;

  constructor(private route: ActivatedRoute, private router: Router, public commonService: CommonService, private jsonService: GetJsonService) {

    this.route.params.subscribe((params: Params) => {
      this.currentCityID = params['city'];
   
      if(this.commonService.cityModel.Id!=this.currentCityID)
      this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"הפניות שלי");  
      else
      this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"הפניות שלי");
   
  
    });


    this.commonService.isVerifyAsset.subscribe(
      (isVerifyAsset) => {
        if (isVerifyAsset) {
          this.isVerifyAsset = true;
          this.getOpend();
        }
        else {
          this.isVerifyAsset = false;

         // this.jsonService.createCookie("pageAfterVerifyAsset", '/user/' + this.currentCityID + '/my-opend', '');
         // this.router.navigate(['user/' + this.currentCityID + '/verification-asset']);
        }
      })

  }

  getOpend() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '014526f8-a8a5-433d-bf57-b15e1db71463';
    this.param = new InputParams("@CompanyId", this.currentCityID);
    this.params.push(this.param);
    this.param = new InputParams("@PayerId", "157");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity', 'GetStatusNetHistoryMethod');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      if (res.length == 0) {
        $("#refrence_table").html("<p style='padding-right: 3vw; font-size: 22px;'> אין נתונים להצגה </p>")
        $("#refrence_table").removeClass("table-striped");
      }
      this.opendList = res;
      setTimeout(() => {
        arrowMyOpend()
      }, 1000);

    }, err => {
      //alert(err);
    });
  }

  openFormsPage() {
    this.router.navigate(["user/" + this.currentCityID + "/forms"]);
  }
  ngOnInit() {

  }

}
