import { Component, OnInit } from '@angular/core';
 
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { dynamicLinkModel } from '../../../Models/dynamicLinkModel';
@Component({
  selector: 'app-user-payments-page',
  templateUrl: './user-payments-page.component.html',
  styleUrls: ['./user-payments-page.component.css']
})
export class UserPaymentsPageComponent implements OnInit {
   

  cityLogo: string = "";
  cityChildrenList: any = new Array();
  cityName: string;
  currentCityId: string;


  dynamicLink: any = new dynamicLinkModel();
  dynamicLinks: any = new Array;
  isPaymentParentShow: boolean;

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();


  constructor(private jsonService: GetJsonService, private router: Router, private route: ActivatedRoute, public commonService: CommonService) {

    this.route.params.subscribe((params: Params) => {

      this.currentCityId = params['city'];
    
      if(this.commonService.cityModel.Id!=this.currentCityId)
      this.commonService.getCityDetailFromUmbraco(this.currentCityId,"payments" ,"");  
      else
      this.commonService.setTitleAndDescription("payments", this.commonService.cityModel.name,"");
     
     
      this.getCityChildren();
    });

  }

  goToPaymentPage(childId) {
    this.router.navigate(["user/" + this.currentCityId + "/payment/" + childId]);
  }

  getCityChildren() {
    this.actionName = 'e1e1812c-f46c-4b1f-a63b-46e5fd7db50a';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@MgarID", this.currentCityId);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'GetClientChildren')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.cityChildrenList = res;
    }, err => {
      //alert(err);
    });

  }



  ngOnInit() {

  }
}
