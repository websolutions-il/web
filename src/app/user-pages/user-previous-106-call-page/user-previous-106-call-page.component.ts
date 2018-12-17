import { Component, OnInit } from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GetJsonService } from '../../services/get-json.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';

declare function arrowDownPreviosCall106(): any;

@Component({
  selector: 'app-user-previous-106-call-page',
  templateUrl: './user-previous-106-call-page.component.html',
  styleUrls: ['./user-previous-106-call-page.component.css']
})
export class UserPrevious106CallPageComponent implements OnInit {
   
  
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  reportsList:any= new Array();
  cityName:string;
  currentCityID:string;
  ClientId:string;
  constructor(private jsonService: GetJsonService, private router: Router, private route: ActivatedRoute, public commonService: CommonService) { 
    this.route.params.subscribe((params: Params) => {     
      this.currentCityID= params['city'];   
      this.getClientDetailByMgarId(this.currentCityID);  
    });
 


   
  }

getClientDetailByMgarId(city) {
  if(!city)
  this.commonService.log("mast-error-getCityDetailFromDB", this.router.url,"web");
  
  let data = this.EwaPost.getCityDetailFromDB(city);
  this.jsonService.sendData(data).subscribe(res => {    
       this.ClientId= res[0].ClientId;
       this.cityName= res[0].AppName;
        this.commonService.setTitleAndDescription("otherServices", this.cityName,"פניות קודמות למוקד 106");
       this.getHazardReports();     
         }, err => {
      //alert(err);
    });
    
  }

  getHazardReports()
  {
    this.actionName = 'ade6c693-9bf7-4e72-8291-35e3ee252459';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
  
    this.param = new InputParams("@PayerId","25");
    this.params.push(this.param);
    this.param = new InputParams("@ClientId",this.ClientId);
    this.params.push(this.param);
   
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity','InsertNewHazardReport');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      if(res.length==0)
      {
        $(".refrence_table").html("<p style='padding-right: 3vw; font-size: 22px;'> אין נתונים להצגה </p>")
        $(".refrence_table").removeClass("table-striped");     
      }
      this.reportsList= res;
    setTimeout(() => {
      arrowDownPreviosCall106();
    }, 1000);
     
    }, err => {
      //alert(err);
    });
  }
  
  addNewCall()
  {
    this.router.navigate(["user/"+this.currentCityID+"/call-106"]);
  }

ngOnInit() {
  
}

}
