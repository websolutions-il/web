import { Component, OnInit } from '@angular/core';
 
import { AppointmentsService } from '../../../services/appointments.service';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent implements OnInit {

   

 
  constructor(public commonService:CommonService, public appointmentsService:AppointmentsService) {    
  
  }
 
  ngOnInit() {
  }

}
