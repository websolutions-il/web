import { Component, OnInit } from '@angular/core';
import { EvaDataStructure } from '../../../../Models/ParamsModel';
import { CommonService } from '../../../services/common.service';
import { GetJsonService } from '../../../services/get-json.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css']
})
export class MyAppointmentsComponent implements OnInit {
  EwaPost: EvaDataStructure = new EvaDataStructure();
  phone:string;
  unitId:string;
  itemsList: any [];
  isAppointmentsExists:boolean = true;
  constructor(public commonService:CommonService,private jsonService:GetJsonService,
    private route: ActivatedRoute, private router: Router) {
      this.route.params.subscribe((params: Params) => {    
       this.GetQflowId(params['city']);
       });
   }

  ngOnInit() {
  }
    
  GetQflowId(city) {
    let data = this.EwaPost.BuildDataStructure(
      '8ec91769-5120-47c6-8acd-4cbb213fee48',
      [{Name : "@ClientId", Value : city }],
      "MastApi_KeepItCity","GetQflowId" );
      this.jsonService.sendData(data).subscribe(res => { 
      this.unitId =  res.filter(x=> x.IsService)[0].UnitId;
   
      if(this.commonService.isLogInUser)
      {
        this.commonService.userDetailsReceivedSource.first().subscribe(ud=> {
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
          {Name : "sub_department", Value : this.unitId },
          {Name : "action", Value : "GetCustumerAppointments"}],
        "PayLogic","PayLogic.Qflow");
      
      this.jsonService.sendData(data).subscribe(res => {   
         let $res = JSON.parse(res)
         if($res.Name == "Record not found" || $res.length == 0) 
         {
           this.isAppointmentsExists = false;
           return false;
         }
           this.itemsList = $res;
           this.isAppointmentsExists = true;

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
        if(res =="OK"){
        const index = $res.indexOf(appointments);
        this.itemsList.splice(index);
        if(this.itemsList.length == 0)
          this.isAppointmentsExists = false;
        }
        else
        alert("הפעולה נכשלה");
      }, err => { });
    }

  }
