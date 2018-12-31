import { Component,AfterViewInit, Input, ViewChild } from '@angular/core';
import { QuestionBase } from '../../../Models/question-base';
import { ReactiveFormsModule, FormGroup,FormControl, Validators, AbstractControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';


 
@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements AfterViewInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  validationMesseg:string;
 

   ngAfterViewInit(){
   
   }
  get isValid() {  
  
   if(this.form.controls[this.question.key].touched)
    {       
      //console.log(this.form.controls[this.question.key])
      return this.form.controls[this.question.key].valid;    
    } 

    else
    return true;
  }

 
  
}
