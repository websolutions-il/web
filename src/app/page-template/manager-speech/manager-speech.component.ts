import { Component, OnInit } from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FullActionInputParams, ActionInputParams, InputParams } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-manager-speech',
  templateUrl: './manager-speech.component.html',
  styleUrls: ['./manager-speech.component.css']
})
export class ManagerSpeechComponent implements OnInit {
   
  
    actionName: string;
    FullActionInputParams: FullActionInputParams;
    dataToSend: any = new Array<ActionInputParams>();
    singleDataObj: any = new ActionInputParams();;
    params: any = new Array<InputParams>();
    param: InputParams;
 
    managerSpeech:string="";
    cityLogo:string="";
    cityName:string;
    titlePage:string;
    managerImg:string="";

    constructor(private router: Router, private route: ActivatedRoute,private jsonService: GetJsonService, private meta: Meta) { 
     
    }

  getCityDetailFromUmbraco(cityId: string) {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '22ab5075-1543-4e42-a968-fe348177fb8c';
    
    this.param = new InputParams("city",cityId);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_WebAdmin','DAL.Umbraco.BLumbraco/');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
    //console.log(res);
    res.forEach(element => {
    if(element.Name=='managerSpeechFirstPar')
    {
      $("#managerSpeechFirstPar").html(element.Value);
    }
    if(element.Name=='managerSpeechSecondPar')
    {
      $("#managerSpeechSecondPar").html(element.Value);
    }
    if(element.Name=='managerSpeechAutograph')
    {
      $("#managerSpeechAutograph").html(element.Value);      
    }
    if(element.Name=='titleForManagerSpeech')
    {    
      $("#title_mobile").html(element.Value);
      $("#title_desktop").html(element.Value);
      this.titlePage=element.Value;
    }
    if(element.Name=='managerSpeechLogoCityImg')
    {
      this.cityLogo= 'assets';
      this.cityLogo+=element.Value;
    }
    if(element.Name=='managerSpeechManagerImg')
    {
      this.managerImg= 'assets';
      this.managerImg+=element.Value;
    }
    if(element.Name=='cityName')
    {
       this.cityName=element.Value;
    }
      
    });
    document.title=  'MAST | '+ this.titlePage ;
    this.meta.updateTag({ name: 'description', content:this.titlePage +' '+ this.cityName + ' עושים בקלות ובנוחות באתר מאסט! הכנסו לאתר ותוכלו ליהנות מחווית שימוש מהירה, פשוטה ויעילה יותר. כי להתקדם בדיגיטל זה מאסט! ' });
  
     
    }, err => {
      //alert(err);
    }); 

  
    
  }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let cityId = params['city'];  
        this.getCityDetailFromUmbraco(cityId);       
        
    });
  }

}
