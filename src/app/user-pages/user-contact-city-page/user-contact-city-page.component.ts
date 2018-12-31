import { Component, OnInit, AfterViewInit} from '@angular/core';
 
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GetJsonService } from '../../services/get-json.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
import { FormControl } from '@angular/forms';

declare var $ :any;

@Component({
  selector: 'app-user-contact-city-page',
  templateUrl: './user-contact-city-page.component.html',
  styleUrls: ['./user-contact-city-page.component.css']
})
export class UserContactCityPageComponent implements OnInit {

   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  currentCityID:string;
  ClientId: string;
  categoryList:any=new Array();
  fullContactList :any=new Array();
  filteredContactList:any=new Array();

  cityLogo:string;
  cityName:string;

  searchContact:string;

  constructor(private jsonService: GetJsonService, private route: ActivatedRoute,private router: Router, public commonService: CommonService) {
   
    this.route.params.subscribe((params: Params) => {     
      this.currentCityID= params['city'];     
      this.getClientDetailByMgarId(this.currentCityID);  
    });
   
    if(this.commonService.cityModel.Id!=this.currentCityID)
    this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"ספר טלפונים");  
    else
    this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"ספר טלפונים");     
    
  }
  ngAfterViewInit() {

  }

  ngOnInit() {
  }
   
  getClientDetailByMgarId(city) {
    if(!city)
    this.commonService.log("mast-error-getCityDetailFromDB", this.router.url,"web");
    
    let data = this.EwaPost.getCityDetailFromDB(city);
    this.jsonService.sendData(data).subscribe(res => {    
       this.ClientId = res[0].ClientId;
       this.getContactDetails();
         }, err => {
      //alert(err);
    });
    
  }
  getContactDetails() {
    this.actionName = '481f5cbf-430f-4cf1-8f9e-1e00ee569624';
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.param = new InputParams("@ClientId",this.ClientId);
    this.params.push(this.param);
  
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity','getClientDetailByMgarId');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
        this.fullContactList= res;
       this.filteredContactList=res;
       
       res.forEach(element => {
       let temp= this.categoryList.filter(x=>x.Type== element.Type);
       if(temp.length==0)
       {
         this.categoryList.push(element);
       }
       });
     //  console.log(this.categoryList);

         }, err => {
      //alert(err);
    });
    
  }

  filterContacts(key)
  {    
    if (key != undefined) {  
       this.filteredContactList= new Array();    
       this.filteredContactList= this.fullContactList.filter(c=>c.DepartmentName.includes(key)) 
     }
  }


}
