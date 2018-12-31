import { Component, OnInit } from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GetJsonService } from '../../services/get-json.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
import { FormModel } from '../../../Models/FormModel';

@Component({
  selector: 'app-user-forms-page',
  templateUrl: './user-forms-page.component.html',
  styleUrls: ['./user-forms-page.component.css']
})
export class UserFormsPageComponent implements OnInit {
  formsList: any;
  
  cityName:string;
  cityLogo: string = "";
  cityParams: any;
  clientId: string;
  currentCityID: any;
  cityChildrenList:any= new Array();
  formID:string;
   
 
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  constructor(public commonService:CommonService,private router: Router, private route: ActivatedRoute, private jsonService: GetJsonService) { 
   
    this.route.params.subscribe((params: Params) => {
    
      this.currentCityID= params['city'];
     
      if(this.commonService.cityModel.Id!=this.currentCityID)
      this.commonService.getCityDetailFromUmbraco(this.currentCityID,"forms" ,"");  
      else
      this.commonService.setTitleAndDescription("forms", this.commonService.cityModel.name,"");
     

      this.getFormsList(this.currentCityID);          
      });
     }
  
  getFormsList(clientID: string){
    
    this.actionName = '48850c76-8385-4732-b7c1-354a08ebb867';
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.param = new InputParams("@clientID",clientID);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity','GetFormsPerClientID');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
        this.formsList= res;
    }, err => {
      //alert(err);
    });
  } 

  goToformPage(form)
  { 

    if(form.GroupId!=2) 
    {
      this.commonService.formModel = new FormModel(form.PageUid,form.FormTitle);
      this.router.navigate([(this.commonService.isLogInUser ? "/user/" : '/')+this.currentCityID +"/form/"+ form.PageUid]);
    }
    if(form.GroupId==2)
    window.open("https://pay24.co.il/ArnonaGeneral/index?p="+form.PageUid); 
  }

  ngOnInit() {
  }

}
