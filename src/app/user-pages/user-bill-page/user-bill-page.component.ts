import { Component, OnInit } from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GetJsonService } from '../../services/get-json.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-user-bill-page',
  templateUrl: './user-bill-page.component.html',
  styleUrls: ['./user-bill-page.component.css']
})
export class UserBillPageComponent implements OnInit {
  currentCityName: string;
  currentCityID:string;
  stubToView:string;
  iframeSrc: string = '';
   
 
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  constructor( private jsonService:GetJsonService, public commonService: CommonService, private route: ActivatedRoute,private router: Router) {
    this.route.params.subscribe((params: Params) => {     
      this.currentCityID= params['city'];   
      if(this.currentCityID.toString() == "9999")
      {
        this.router.navigate(['']);
      }    
      this.stubToView = params['stub'];
    
      if(this.commonService.cityModel.Id!=this.currentCityID)
      this.commonService.getCityDetailFromUmbraco(this.currentCityID,"payment" ,"");  
      else
      this.commonService.setTitleAndDescription("payment", this.commonService.cityModel.name,"");
     
    
      this.getTokenForPayUser(this.stubToView);        
    });
  
  }
 

  getTokenForPayUser(stub_code)
  {
    this.actionName = 'f31aa8bb-8c90-465d-8f61-aa3562574010';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@CompanyId",this.currentCityID);
    this.params.push(this.param);
    this.param = new InputParams("@StubCode",stub_code);
    this.params.push(this.param);
    this.param = new InputParams("@PayerId","66"); // שימוש בפרמטר מאובטח 
    this.params.push(this.param);
    
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic','PayLogic.PayLogicClass');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {    
     // console.log(res);
      if(res.Name=="errorWS")
      {
      alert("WS is down");
      return false;
      }
      this.iframeSrc = this.jsonService.BASE_PAY24_URL+ "?token="+ res.Value +
      "&payOrigin="+(this.commonService.isMobileUser? "MAST_Web_Mobile":"MAST_Web");
      }, err => {
      //alert(err);
    });
  }

  ngOnInit() {   
  }

  ngAfterViewInit() {

    var windowWidth = $(window).width();
    if (windowWidth < 768) {
      $("iframe").css("min-height", "3313px");
      $("#container_iframe").css("margin-left", "31px");
    }
    else {
      $("iframe").css("min-height", "1095px");
    }
  }

}
