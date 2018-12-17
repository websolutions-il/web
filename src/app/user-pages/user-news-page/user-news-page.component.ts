import { Component, OnInit } from '@angular/core';
 
import { GetJsonService } from '../../services/get-json.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
@Component({
  selector: 'app-user-news-page',
  templateUrl: './user-news-page.component.html',
  styleUrls: ['./user-news-page.component.css']
})
export class UserNewsPageComponent implements OnInit {
   
  

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();


  currentCityID:string;
  cityName:string;
  cityLogo: string = "";
  cityMessagesList: any;
  personalMessagesList:any;

  constructor(private jsonService: GetJsonService, public commonService: CommonService,private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
          this.currentCityID= params['city'];
    });
    
    if(this.commonService.cityModel.Id!=this.currentCityID)
      this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"חדשות ועדכונים");  
      else
      this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"חדשות ועדכונים");
     

    this.getCityMessagesNews();
   }

  

 // bring city AND personal messeges
  getCityMessagesNews()
  {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = 'e0f8800d-2e65-4c1d-950a-6000272814ca';
    
    this.param = new InputParams("@ClientId",this.currentCityID);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity','GetCityMessagesNewsPerClient');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.cityMessagesList= res;     
    }, err => {
      //alert(err);
    });

  }

  ngOnInit() {
    
   
   
  }

}
