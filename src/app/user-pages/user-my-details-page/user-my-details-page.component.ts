import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
 
import { ValidationService } from '../../services/validation.service';
import { EditableInputComponent } from '../../components/editable-input/editable-input.component';

declare function allowOnlyNumbers(): any;

@Component({
  selector: 'app-user-my-details-page',
  templateUrl: './user-my-details-page.component.html',
  styleUrls: ['./user-my-details-page.component.css']
})
export class UserMyDetailsPageComponent implements OnInit {
   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  userSessionGuid:string; 
  user:any;

  //validate
  isValidEmailMesseg: string;
  isValidPhoneMesseg: string;

  @ViewChild('phone') phone : EditableInputComponent;
  @ViewChild('email') email : EditableInputComponent;

  test: string = "0513"

  constructor(private _location: Location, private router: Router,
     private jsonService: GetJsonService, private commonService: CommonService,
      private valid:ValidationService) {
  
   this.commonService.userDetailsReceivedSource.first().subscribe(ud=>{
    this.user= ud[0];
   })


    allowOnlyNumbers();  
    this.commonService.setTitleAndDescription("otherServices", "", "עדכון פרטים אישיים");   
   }


  updateUserDetails(name, value) {
    
    if(name == 'phone') {
     this.isValidPhoneMesseg = this.valid.validPhoneFun(value);
     if(this.isValidPhoneMesseg)
     {
        this.phone.enableEditing();
        return false;
     }
    }   
    if(name == 'email') {
      this.isValidEmailMesseg = this.valid.validEmailFun(value);
      if(this.isValidEmailMesseg){
        this.email.enableEditing(); 
        return false;
      }
     } 

    this.actionName = '6f4f4556-1383-4d57-aa65-9b6851389f12';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@PayerId","242");
    this.params.push(this.param);
    this.param = new InputParams("@Phone", "24");
    this.params.push(this.param); 
    this.param = new InputParams("@NewPhone", (name == 'phone' ? value : null));   
    this.params.push(this.param);    
    this.param = new InputParams("@NewEmail",(name == 'email' ? value : null));   
    this.params.push(this.param); 
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24','UpdatePhoneAndMailUser')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
     if(res[0].result == 'EXISTS')
     {
       if(value != this.commonService.userDetails[0].Phone){
       this.isValidPhoneMesseg = 'phoneExistsInSystem';
       this.phone.enableEditing();
          }
       return false;
     }
     

       if(name == 'phone'){
         this.saveUserInSessionWithNewPhone(value);         
         this.commonService.userDetails[0].Phone = value;
       }
       if(name == 'email'){       
        this.commonService.userDetails[0].Email = value;
       }
       this.commonService.updatedUserDetailsSubject(this.commonService.userDetails);
 
    }, err => {
      //alert(err)
  });

  }

  saveUserInSessionWithNewPhone(newPhpne) {
    this.params = new Array<InputParams>();
    this.dataToSend = new Array<ActionInputParams>();
    this.actionName = "e1955011-644c-45a4-862d-1e7c9162d8a3";    
    this.param = new InputParams("token",this.commonService.guid()); 
    this.params.push(this.param);
    this.userSessionGuid=this.param.Value;
    this.param = new InputParams("payerID",this.commonService.userDetails[0].UserName); 
    this.params.push(this.param);
    this.param = new InputParams("phone",newPhpne);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams.ActionInputParams = this.dataToSend;
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MemberShipProvide','MemberShipProvide.MsProvide');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.jsonService.createCookie("token",this.userSessionGuid,1);  
    }, err => {
      //alert(err);
    });
  } 
  
  closePopup(){
    this.isValidPhoneMesseg = null;
    this.isValidEmailMesseg = null;
  }

  ngOnInit() {
   
  }

}
