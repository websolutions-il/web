import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments.service';
import { Router } from '@angular/router';
import { InputParams, ActionInputParams, FullActionInputParams } from '../../../../Models/ParamsModel';
import { GetJsonService } from '../../../services/get-json.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-step-six',
  templateUrl: './step-six.component.html',
  styleUrls: ['./step-six.component.css']
})
export class StepSixComponent implements OnInit {

  isSuccess: boolean;
  isError: boolean;
  errorMsg: string;

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();;
  params: any = new Array<InputParams>();
  param: InputParams;

  constructor(public commonService:CommonService, public appointmentsService: AppointmentsService, private router: Router, private jsonService: GetJsonService) { }

  ngOnInit() {

  }

  SaveAppointmentsDate() {
    this.commonService.showLoader = true;
    this.actionName = '70b58072-a212-4320-9257-14b5186af466';
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.param = new InputParams("sub_department", this.appointmentsService.selected_sub_department.UnitId);
    this.params.push(this.param); //0
    this.param = new InputParams("phone", this.appointmentsService.userDetails.Phone);
    this.params.push(this.param);//1
    this.param = new InputParams("FirstName", this.appointmentsService.userDetails.FirstName);
    this.params.push(this.param);//2
    this.param = new InputParams("date", this.appointmentsService.selected_date);
    this.params.push(this.param);//3
    this.param = new InputParams("time", this.appointmentsService.selected_time);
    this.params.push(this.param);//4
    this.param = new InputParams("Email", this.appointmentsService.userDetails.Email);
    this.params.push(this.param);//5
    this.param = new InputParams("LastName", this.appointmentsService.userDetails.LastName);
    this.params.push(this.param);//6
    this.param = new InputParams("UserName", this.appointmentsService.userDetails.UserName);
    this.params.push(this.param);//7
    this.param = new InputParams("sub_department_name", this.appointmentsService.selected_sub_department.UnitName);
    this.params.push(this.param);//8
    this.param = new InputParams("cityName", this.commonService.cityModel.name);
    this.params.push(this.param);//9
    this.param = new InputParams("cityId", this.appointmentsService.currentCityID);
    this.params.push(this.param);//10    
    this.param = new InputParams("action", "SaveAppointmentsDate");
    this.params.push(this.param);//11

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic','PayLogic.Qflow')
   // this.sendDetailsToVIPlus();
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {    
      this.commonService.showLoader = false;
      res = JSON.parse(res);
      if (res == "OK") {
        this.isSuccess = true;  
        this.sendDetailsToVIPlus(); 
      }
      else { // "ERROR" / "EXISTS"
        this.isError = true;
        this.errorMsg = res.Value;
      }
   
    }, err => {
    });
  }

  sendDetailsToVIPlus()
  {
    this.dataToSend = new Array<ActionInputParams>();
    // נשתמש באותם פרמטרים של הפנייה הקודמת. רק נחליף את שם הפונקציה    
    this.params.splice(11,1);    
    this.param = new InputParams("action", "SendDetailsToVIPlus");
    this.params.push(this.param);
   
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic','PayLogic.Qflow')
  
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      
    }, err => {
 
    });

  }


}
