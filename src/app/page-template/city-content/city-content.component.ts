import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FullActionInputParams, ActionInputParams, InputParams } from "../../../Models/ParamsModel";
import {GetJsonService} from '../../services/get-json.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-city-content',
  templateUrl: './city-content.component.html',
  styleUrls: ['./city-content.component.css']
})
export class CityContentComponent implements OnInit {

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;

  padeId:string;
  title:string="";
  content:string="";

  constructor(private jsonService: GetJsonService, public commonService: CommonService,private router:Router,private route:ActivatedRoute) { 
    this.route.params.subscribe((params: Params) => {
      this.padeId = params['id'];           
      this.getContentPage(this.padeId);
    });
  }
  getContentPage(page: any) {
    //console.log(page);
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = "6406e8b0-1695-486b-b2ec-62d3bf732193";
   
    this.param = new InputParams("pageName",page);
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_WebAdmin','DAL.Umbraco.BLumbraco/');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {  
      if(res.Value == "null")
      this.router.navigate(['']);      
     document.getElementById("content").innerHTML = res;
     this.setCss();       
    }, err => {

    });
  }
  
  setCss()
  {
    if(this.padeId =="2688")
    {
        $(".box-wrapper").addClass("margin2688");
    }

   else 
   {
      $("#content").addClass("style2846");
      $("#content img").addClass("img2846");
    }
  }

  ngOnInit() {
  }

}
