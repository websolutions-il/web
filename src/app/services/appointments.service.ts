import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Meta } from '@angular/platform-browser';
import { GetJsonService } from './get-json.service';
import { Router } from '@angular/router';
import { User } from '../../Models/UserModel';


@Injectable()
export class AppointmentsService {

  //general
   public isLogInUser:boolean;
   public activeStep:string;
  // step one
   public cityName:string;
   public cityLogo:string;
   public currentCityID:any;
  // step tow
  public selected_department:any;
  public selected_sub_department:any;
  public department_list:any;
  public sub_department_list:any;
  //step four
  public userDetails:User; 
  public prefix:any="";
  public rest_phone:any= "";
  public isRegUser:boolean;
  //step five
  public availableDateTimes:any;
  public selected_date:any;
  public selected_time:any;

 
  constructor() { }

  changeStep(step)
  {
    $(".wrap_move").addClass("step-move-out");
    setTimeout(() => {
      $(".wrap_move").removeClass("step-move-out");
      this.activeStep = step;
    },300);
     
  }


}
