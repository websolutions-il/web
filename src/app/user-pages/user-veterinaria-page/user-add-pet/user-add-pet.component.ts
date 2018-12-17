import { Component, OnInit } from '@angular/core';
import { VeterinariaService } from '../../../services/vetrinaria.service';
import { GetJsonService } from '../../../services/get-json.service';
import { InputParams, ActionInputParams, FullActionInputParams } from '../../../../Models/ParamsModel';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-user-add-pet',
  templateUrl: './user-add-pet.component.html',
  styleUrls: ['./user-add-pet.component.css']
})
export class UserAddPetComponent implements OnInit {
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;

  subTz: string="";
  chip: string="";
  success: boolean= false;

  isValidTZMesseg: string;
  isValidChipMesseg: string;

  constructor(private jsonService: GetJsonService, private veterinariaService: VeterinariaService,
              private valid:ValidationService) {

  }
  ngOnInit() {
  }

  getPetsPerUser() {
    if(!this.validSumary())
    return false;

    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '5d362728-ab53-4341-b866-af02fa7c085b';
    this.param = new InputParams("subTz", this.subTz);
    this.params.push(this.param);
    this.param = new InputParams("perUserOrPet","user");
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.Vaterinaria')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
     if(res.animals){
      res.animals.forEach(element => {
        if (element.chip == this.chip) {
          this.success = true;
          this.veterinariaService.petsList.push(element);
          this.addPet(this.chip);
          this.veterinariaService.changeStep("my-pets");
        }
      });
    }
      if (this.success == false)
        $("#popup").fadeIn(200);

    }, err => {

    });
  }
  closePopup() {
    $("#popup").fadeOut(200);
  }


  addPet(chip) {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = 'a67391f8-ee1e-4bee-9b40-f5a1b95ae66b';
    this.param = new InputParams("@PayerId", "123");
    this.params.push(this.param);
    this.param = new InputParams("@Chip", chip);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity', 'addPet');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      console.log(res);
    }, err => {

    });
  }
  validSumary()
  {
    this.validChipFun();
    this.validTZFun();
    if(this.isValidChipMesseg!=null|| this.isValidTZMesseg!=null)
    return false;
    return true;
  }

  validTZFun() {   
      this.isValidTZMesseg = this.valid.validTZFun(this.subTz);    
  }
  validChipFun() {   
    this.isValidChipMesseg = this.valid.validChipFun(this.chip,"chip");    
}
}
