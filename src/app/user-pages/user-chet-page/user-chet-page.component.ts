import { Component } from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GetJsonService } from '../../services/get-json.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-chet-page',
  templateUrl: './user-chet-page.component.html',
  styleUrls: ['./user-chet-page.component.css']
})

export class UserChetPageComponent {
  cityName: string;
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  currentCityName: string;
  currentCityId: string;
  iframeSrc: string = '';
   
  subscriptionUserDetails: Subscription;

  constructor(private router: Router, private jsonService: GetJsonService, public commonService: CommonService, private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      this.currentCityId = params['city'];
    });

    this.commonService.isLogInUserReceivedSource.first().subscribe(
      (isLogIn) => {   
        if (isLogIn) {
          this.commonService.userDetailsReceivedSource.subscribe((userDetails) => {           
            this.getChetLink();
          })
        }
        else
          this.getChetLink();
      }
    );

    if(this.commonService.cityModel.Id!=this.currentCityId)
      this.commonService.getCityDetailFromUmbraco(this.currentCityId,"otherServices" ,"צא'ט עם נציג");  
      else
      this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"צא'ט עם נציג");
     
  }


  getChetLink() {
    this.actionName = 'edf35f08-b632-4d3f-a86a-58e9ad9751b3';
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.param = new InputParams("@CompanyId", this.currentCityId);
    this.params.push(this.param);

    this.param = new InputParams("@ServiceType", "9");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity', 'getChetLink');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.iframeSrc = res[0].Link
       + (this.commonService.userDetails ?
        "&PrivateName=" + this.commonService.userDetails[0].FirstName +
        "&FamilyName=" + this.commonService.userDetails[0].LastName +
        "&Email=" + this.commonService.userDetails[0].Email +
        "&Phone=" + this.commonService.userDetails[0].Phone +
        "&reference=" + this.commonService.userDetails[0].UserName //+
         : '');
    }, err => {
    });

  } 

}
