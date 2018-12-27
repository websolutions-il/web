import { Component, OnInit } from '@angular/core';
import { EvaDataStructure } from '../../../../Models/ParamsModel';
import { CommonService } from '../../../services/common.service';
import { GetJsonService } from '../../../services/get-json.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppointmentsService } from '../../../services/appointments.service';
import { User } from '../../../../Models/UserModel';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css']
})
export class MyAppointmentsComponent implements OnInit {
  EwaPost: EvaDataStructure = new EvaDataStructure();
  phone:string;
  itemsList: any [];
  isAppointmentsExists:boolean = true;
  step:string;

  constructor(public commonService:CommonService,private jsonService:GetJsonService,
    private route: ActivatedRoute, private router: Router,public appointmentsService:AppointmentsService,) {
      this.route.params.subscribe((params: Params) => {  
        this.appointmentsService.currentCityID = params['city'];
       this.GetQflowId(this.appointmentsService.currentCityID);
       });
       this.commonService.isLogInUserReceivedSource.first().subscribe(
        (isLogIn) => {
          this.appointmentsService.isLogInUser = isLogIn;
        }
      );
       this.appointmentsService.userDetails = new User();
       if(this.commonService.cityModel.Id != this.appointmentsService.currentCityID)
           this.commonService.getCityDetailFromUmbraco(this.appointmentsService.currentCityID,"other");
 
     this.appointmentsService.isEdit = true;
      }

  ngOnInit() {
  }
    
  GetQflowId(city) {
    let data = this.EwaPost.BuildDataStructure(
      '8ec91769-5120-47c6-8acd-4cbb213fee48',
      [{Name : "@ClientId", Value : city }],
      "MastApi_KeepItCity","GetQflowId" );
      this.jsonService.sendData(data).subscribe(res => { 
        this.appointmentsService.selected_sub_department = {UnitId : "", UnitName: ""};
        this.appointmentsService.selected_sub_department.UnitId 
          = res.filter(x=> x.IsService)[0].UnitId;   

      if(this.commonService.isLogInUser)
      {
        this.commonService.userDetailsReceivedSource.first().subscribe(ud=> {          
          this.appointmentsService.userDetails.FirstName = ud[0].FirstName;
          this.appointmentsService.userDetails.LastName = ud[0].LastName;
          this.appointmentsService.userDetails.UserName = ud[0].UserName;          
          this.getAppointments(ud[0].Phone);
        });
      }      
     }, err => {            
    });
  
  }
  getAppointments(phone){      
      let data = this.EwaPost.BuildDataStructure(
        '70b58072-a212-4320-9257-14b5186af466',
        [{Name : "phone", Value : phone },
          {Name : "sub_department", Value : this.appointmentsService.selected_sub_department.UnitId },
          {Name : "action", Value : "GetCustumerAppointments"}],
        "PayLogic","PayLogic.Qflow");
      
      this.jsonService.sendData(data).subscribe(res => {   
         let $res = JSON.parse(res)
         console.log($res)
         if($res.Name == "Record not found" || $res[0].length == 0) 
         {
           this.isAppointmentsExists = false;
           return false;
         }
           this.itemsList = $res[0];
           this.isAppointmentsExists = true;
           this.appointmentsService.userDetails.Phone = phone;
           this.appointmentsService.userDetails.FirstName = $res[1].FirstName;
           this.appointmentsService.userDetails.LastName = $res[1].LastName;
           this.appointmentsService.userDetails.Email = $res[1].EMail;
         //  this.appointmentsService.userDetails.FirstName = $res[1].FirstName;

      }, err => { });
    }
  
    deleteAppointments(appointments){
      let data = this.EwaPost.BuildDataStructure(
        '70b58072-a212-4320-9257-14b5186af466',
        [{Name : "ProcessId", Value : appointments.ProcessId},        
          {Name : "action", Value : "DeleteAppointments"}],
        "PayLogic","PayLogic.Qflow");
      
      this.jsonService.sendData(data).subscribe(res => {          
        let $res = JSON.parse(res)
        console.log($res);
        if($res =="OK"){
        const index = $res.indexOf(appointments);
        this.itemsList.splice(index);
        if(this.itemsList.length == 0)
        this.itemsList = null;
        //  this.isAppointmentsExists = false;
        }
        else
        alert("הפעולה נכשלה");
      }, err => { });
    }

    editAppointments(item){
      console.log(item);
      this.commonService.styleLoader = 
      (this.appointmentsService.isLogInUser ? "position: absolute; right: 23%;" : "right: 0px");
    this.commonService.showLoader = true;
    this.appointmentsService.editItem = item;
    this.appointmentsService.selected_sub_department.UnitName = item.ServiceName;

    let data = this.EwaPost.BuildDataStructure('70b58072-a212-4320-9257-14b5186af466',
        // במידה ויהיו יותר שירותים תחת יוניט אחד.
        // לא יהיה נכון לשלוח את הפרמטר הזה
        // אלא יהיה חייב לקבל את המזהה של השירות מתוך רשימת התורים של המשתמש
        // ואותו לשלוח. כיום הפונקציה לא מחזירה מזהה רשות
    [{Name: "unitId", Value : this.appointmentsService.selected_sub_department.UnitId},
     {Name: "action", Value : "GetAvailableDates"}],
    'PayLogic','PayLogic.Qflow')
     this.jsonService.sendData(data).subscribe(res => {
        this.commonService.showLoader = false;
        this.appointmentsService.availableDateTimes = JSON.parse(res);
        let isAvailableDates = this.appointmentsService.availableDateTimes.filter(a => a.Id != 0);   
         if(isAvailableDates.length > 0)            
           this.step = 'five';  
    }, err => {  });
    }


    
  }
