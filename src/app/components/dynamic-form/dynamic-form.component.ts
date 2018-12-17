import { Component,OnInit, Output, ViewChild, ViewChildren, QueryList, ViewContainerRef, EventEmitter, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { EvaDataStructure, InputParams } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service'
import { ValidationService } from '../../services/validation.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../services/question-control.service';
import { QuestionBase, DropdownQuestion, TextboxQuestion, CheckboxQuestion } from '../../../Models/question-base';
import { ReCaptchaDirective } from '../../directives/recaptha.directive';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit{

  EwaPost: EvaDataStructure = new EvaDataStructure();
  currentCityID: string;
  @Input() GroupId;
  @Input() isSecondUse;
  questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';
  @Output() getFormData = new EventEmitter();
 
  // recaptcha
  recaptchaCode:string;
  isCaptcha:boolean;
  isCaptchaNotValid:boolean;
  @ViewChild(ReCaptchaDirective) captcha: ReCaptchaDirective;
 
  constructor(private valid: ValidationService, private jsonService: GetJsonService,
    private route: ActivatedRoute, public commonService: CommonService,
    private qcs: QuestionControlService) { 
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {      
      this.currentCityID = params['city'];  
        this.getFormFildes(this.currentCityID, this.GroupId); 
    });   
  }
 
  onSubmit() { 

    let params= [];
    Object.keys(this.form.value).map(key=>{
      params.push(new InputParams("@"+key, this.form.value[key]));
    });

    if(this.isCaptcha)
    params.push(new InputParams("@recaptchaCode", this.captcha.token))
   
    this.getFormData.emit(params);
  }


  getFormFildes(CityID , GroupId){

    let data = this.EwaPost.BuildDataStructure("0e1657a1-7652-4c38-90b7-1cc0237d0afe",
      [{ Name: "@ClientId", Value: CityID },
      { Name: "@GroupId", Value: GroupId }],
      'MastApi_KeepItCity', 'GetStatusNetForms');
    this.jsonService.sendData(data).subscribe(res => {
  
      this.questions = this.buildQuestions(res);     
      this.form = this.qcs.toFormGroup(this.questions);

    }, err => {
    });
    
  }


buildQuestions(data):QuestionBase<any>[] {
// Captcha
this.isCaptcha = data[0].IsCaptcha;

//selects input
let questions :QuestionBase<any>[] = [];
let selects = data.filter(f=> f.FieldId != null);
let selectsGroups = this.groupBy(selects, "FieldId");
 selectsGroups.forEach(element => {       
   let select =  new DropdownQuestion({
        key: element[0].CustomElementId || element[0].FieldNameID,
        label:  element[0].CustomFieldLabel || element[0].FieldNameLabel,           
        options: this.getOptionsForSelectInput(element),
        required: element[0].IsRequired,
        order: element[0].Position,  
      })
      questions.push(select);
 });

// text box input
let textboxInputs = data.filter(f=> f.FieldsId != 15 && f.FieldsId != 9
                                 && f.FieldsId != 29);
textboxInputs.forEach(element => {

let textbox = new TextboxQuestion({
   
    key: element.CustomElementId || element.FieldNameID,
    label: element.CustomFieldLabel || element.FieldNameLabel ,
    value: null,
    required: element.IsRequired,
    order: element.Position,
    
    MaxLength: element.MaxLength,
    MinLength: element.MinLength,
    IsNumeric: element.IsNumeric
   
  });
  questions.push(textbox);
});

// check box input
let checkBoxInputs = data.filter(f=> f.FieldsId == 29);

checkBoxInputs.forEach(element => {
  let checkBox = new CheckboxQuestion({
    key: element.CustomElementId || element.FieldNameID,
    label: element.CustomFieldLabel || element.FieldNameLabel ,
    value: null,
    required: element.IsRequired,
    order: element.Position,
  });
  questions.push(checkBox);
});

return questions.sort((a, b) => a.order - b.order);

}



groupBy(xs, prop) {

var grouped = {};
for (var i=0; i<xs.length; i++) {
  var p = xs[i][prop];
  if (!grouped[p]) { grouped[p] = []; }
  grouped[p].push(xs[i]);
 }
return this.convertObjectToArr(grouped);
}
getOptionsForSelectInput(input){
let output = [];
input.forEach(element => {
   let item = {key: element.DataValue,  value: element.DataValue};
   output.push(item);
});
return output;
}
 
convertObjectToArr(object){
  let arr =[];
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      arr.push(object[key]);
    }
  }
  return arr;
}

// resetCaptcha(){
//   this.captcha.resetCaptcha();  
//   this.isCaptchaValid = true;
// }




  









}

