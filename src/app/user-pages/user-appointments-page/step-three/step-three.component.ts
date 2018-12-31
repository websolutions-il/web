import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css']
})
export class StepThreeComponent implements OnInit {
  linkToForm: string;
  continueText: string;
  topContinueText: string;
  constructor(public appointmentsService: AppointmentsService) {
   
    switch (this.appointmentsService.selected_sub_department.ServiceType) {
      case 1:
        this.continueText = "המשיכו למילוי טופס דיגיטלי";
        this.topContinueText = "האם תרצו למלא טופס דיגיטלי במקום להגיע לסניף?";
        break;
      case 2:
        this.continueText = "המשיכו לביצוע תשלום און ליין";
        this.topContinueText = "האם תרצו להמשיך לביצוע תשלום און ליין?";
        break;
      case 3: case 4:
        this.continueText = "המשך למילוי טופס חכם און ליין";
        this.topContinueText = "האם תרצו להמשך למילוי טופס חכם און ליין?";
        break;     
      default:
          this.continueText = "המשיכו למילוי טופס דיגיטלי";
          this.topContinueText = "האם תרצו למלא טופס דיגיטלי במקום להגיע לסניף?";
        break;
    }



  }

  ngOnInit() {
  }

}
