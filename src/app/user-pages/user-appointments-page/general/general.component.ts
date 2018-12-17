import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../../Models/ParamsModel';
 
import { GetJsonService } from '../../../services/get-json.service';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();
  
  constructor(public commonService: CommonService,private jsonService: GetJsonService,
    public appointmentsService:AppointmentsService, private route: ActivatedRoute,
    private router: Router) {
    this.commonService.isLogInUserReceivedSource.first().subscribe(
      (isLogIn) => {
        this.appointmentsService.isLogInUser = isLogIn;
      }
    );

    this.route.params.subscribe((params: Params) => {    
      this.appointmentsService.currentCityID= params['city'];
     });
  
     if(this.commonService.cityModel.Id!=this.appointmentsService.currentCityID)
     this.commonService.getCityDetailFromUmbraco(this.appointmentsService.currentCityID,"otherServices" ,"זימון תורים");  
     else
     this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"זימון תורים");
    
   
    this.GetQflowId(this.appointmentsService.currentCityID);
   
    if(this.appointmentsService.activeStep == null 
      || this.appointmentsService.activeStep == 'six')
       this.appointmentsService.activeStep ="one";
// טסט
  }

  ngOnInit() {  
  }

  GetQflowId(city) {
    let data = this.EwaPost.BuildDataStructure(
      '8ec91769-5120-47c6-8acd-4cbb213fee48',
      [{Name : "@ClientId", Value : city }],
      "MastApi_KeepItCity","GetQflowId" );
      this.jsonService.sendData(data).subscribe(res => {  
      this.appointmentsService.department_list =  res.filter(d=>d.IsService == false);
      this.appointmentsService.sub_department_list =  res.filter(d=>d.IsService == true);

     }, err => {            
    });
  
  }

 
 
 
  // GetDepartmentsPerCity(city) {
  //   this.dataToSend = new Array<ActionInputParams>()
  //   this.params = new Array<InputParams>();
  //   this.actionName = '70b58072-a212-4320-9257-14b5186af466';
  //   this.params = new Array<InputParams>();
  //   this.param = new InputParams("@MgarId", city);
  //   this.params.push(this.param);
  //   this.param = new InputParams("action", "GetDepartmentsPerCity");
  //   this.params.push(this.param);
  
  //   this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
  //   this.dataToSend.push(this.singleDataObj);
  //   this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic','PayLogic.Qflow')
  //   this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
  //   try {
  //     res = JSON.parse(res);
  //   } catch (error) {   }
        
    
  //   }, err => {   
  //   });
  
  // }

 


}
