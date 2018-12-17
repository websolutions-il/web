import { Component, OnInit, Output, ViewChild, ViewChildren, QueryList, ViewContainerRef, EventEmitter  } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service'
import { ValidationService } from '../../services/validation.service';
import { EditableInputComponent } from '../editable-input/editable-input.component';

@Component({
  selector: 'app-b2m-table',
  templateUrl: './b2m-table.component.html',
  styleUrls: ['./b2m-table.component.css']
})
export class B2mTableComponent implements OnInit {

  b2mList: any;
  EwaPost: EvaDataStructure = new EvaDataStructure();
  editableInputComponent : EditableInputComponent;
  showPopUp:boolean;
  invalidMailMesseg:string;
  showDeleteMesseg:boolean;
  @Output() getItems = new EventEmitter(); 
  
  @ViewChildren('edList') components:QueryList<EditableInputComponent>;
  currentEditingIndex:number;
  currentEditingB2M: any;
  currentEditingNewMail:string;
  currentEditingAction:string;

  constructor(private valid: ValidationService, private jsonService: GetJsonService,
     public commonService: CommonService) {
    this.getB2MCompenys();
  }
  ngOnInit() {
  }
  getB2MCompenys() { 
    let data = this.EwaPost.BuildDataStructure("2d59aeb6-3915-4e2a-95a4-f8050f34c0a1",
    [{Name : "@PayerId", Value :'12'}],
    'MastApi_Pay24','getB2MCompenys');
    this.jsonService.sendData(data).subscribe(res => {
      this.getItems.emit(res);
      this.b2mList = res;
    }, err => {
    });
  }
  prevUpdate(newMail, b2m, index, action){
    
    this.currentEditingAction = action;
    this.currentEditingB2M = b2m;
    this.currentEditingIndex = index;
    this.currentEditingNewMail = newMail;
    if(action == 'DELETE'){
      this.showDeleteMesseg = true;           
    }
    if(action == 'UPDATE'){
      this.invalidMailMesseg = this.valid.validEmailFun(newMail);
      if(this.invalidMailMesseg)
        return false; 
      else
        this.updateEmailB2M();
     }
    
  }

  updateEmailB2M(){
    let data = this.EwaPost.BuildDataStructure("ec282811-be24-4944-a8f3-bb92a057e385",
    [ {Name : "@Action", Value : this.currentEditingAction},
      {Name : "@PayerId", Value :'12'},
      {Name : "@CompenyId", Value :this.currentEditingB2M.company_id},
      {Name : "@NewMail", Value :this.currentEditingNewMail}],
    'MastApi_Pay24','UpdateB2mUserMail');
    this.jsonService.sendData(data).subscribe(res => {       
     
      if(this.currentEditingAction == 'DELETE')               
       {
          this.showDeleteMesseg = false;
          this.b2mList.splice(this.currentEditingIndex, 1);
          this.getItems.emit(this.b2mList);
       }
    }, err => {
    });
  }

  closePopup(){
    if(this.currentEditingAction == "UPDATE"){
    this.components.toArray()[this.currentEditingIndex].enableEditing();
    this.invalidMailMesseg = null;
    }
    else
    this.showDeleteMesseg = false;
  }
}
