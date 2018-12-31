import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FullActionInputParams, ActionInputParams, InputParams } from "../../../Models/ParamsModel";
import {GetJsonService} from '../../services/get-json.service';
import { UmbracoPgae } from "../../../Models/UmbracoPageModel";
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
 
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;


  title:string="";
  content:string="";
  isArabPage:boolean;
  constructor(private jsonService: GetJsonService, public commonService: CommonService, router:Router,private route:ActivatedRoute, private meta: Meta) { 

  }

   getInternalPage(page: any) {
    //console.log(page);
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = "478fbe22-b7d9-4ad9-a9cf-5d60e42af739";
   
    this.param = new InputParams("pageName",page);
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_WebAdmin','DAL.Umbraco.BLumbraco/');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {     
     document.getElementById("content").innerHTML = res.Content;
     this.commonService.setTitleAndDescription("otherServices","",res.Title); 
     window.scrollTo(0,0);
    }, err => {
      //alert(err);
    });
  }
  

 
  ngOnInit() {
      this.route.params.subscribe((params: Params) => {
        let pageName = params['pageName'];  
        let city = params["city"];
       
        document.title= pageName;     
        if(pageName =="תקנון" && city == "164")
           this.isArabPage = true;
           else
        this.getInternalPage(pageName);     
      });

  }

}
