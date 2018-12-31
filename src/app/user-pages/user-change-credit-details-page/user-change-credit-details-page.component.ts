import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service'
 
import { Router, ActivatedRoute, Params } from "@angular/router";
@Component({
  selector: 'app-user-change-credit-details-page',
  templateUrl: './user-change-credit-details-page.component.html',
  styleUrls: ['./user-change-credit-details-page.component.css']
})
export class UserChangeCreditDetailsPageComponent implements OnInit {

  iframeSrc:string;
  currentCityName:string;
  currentCityID:string;
   
 
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

 
  constructor(private router: Router, private route: ActivatedRoute, private jsonService: GetJsonService, public commonService: CommonService) {
 
    this.route.params.subscribe((params: Params) => {
      this.currentCityID= params['city'];   
    });  
    this.getTokenForViewDetails();
   
    if(this.commonService.cityModel.Id!=this.currentCityID)
    this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"החלפת פרטי כרטיס אשראי");  
    else
    this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"החלפת פרטי כרטיס אשראי");
  
  }

  getTokenForViewDetails()
  {
    this.actionName = 'f31aa8bb-8c90-465d-8f61-aa3562574010';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@CompanyId",this.currentCityID);
    this.params.push(this.param);
    this.param = new InputParams("@StubCode","0");
    this.params.push(this.param);
    this.param = new InputParams("@PayerId","66");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic','PayLogic.PayLogicClass');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      if (res.Name == "errorWS") {
        alert("WS is down");
        return false;
      }
    setTimeout(() => {
      this.iframeSrc= this.jsonService.BASE_CREDIT_DETAIL_URL + '?token=' + res.Value;

    }, 1000); 
   
    }, err => {
      //alert(err);
    });
  }

  ngOnInit() {
  }

}
