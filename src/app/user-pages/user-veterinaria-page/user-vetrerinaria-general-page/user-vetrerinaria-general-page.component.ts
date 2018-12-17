import { Component, OnInit, AfterViewInit } from '@angular/core';
import { VeterinariaService } from '../../../services/vetrinaria.service';
 
import { GetJsonService } from '../../../services/get-json.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../../Models/ParamsModel';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare function setScrollBar(): any;

@Component({
  selector: 'app-user-vetrerinaria-general-page',
  templateUrl: './user-vetrerinaria-general-page.component.html',
  styleUrls: ['./user-vetrerinaria-general-page.component.css']
})
export class UserVetrerinariaGeneralPageComponent implements OnInit, AfterViewInit {
   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;

  EwaPost: EvaDataStructure = new EvaDataStructure();

  isError: boolean;
  currentCityID: string;
  cityName: string;

  constructor(private route: ActivatedRoute, private router: Router,
    private jsonService: GetJsonService, public commonService: CommonService,
    public veterinariaService: VeterinariaService) {
    
    this.route.params.subscribe((params: Params) => {
      this.currentCityID = params['city'];
      this.veterinariaService.currentCityID = this.currentCityID;
      this.veterinariaService.activeStep = params['step'];
    });
    this.veterinariaService.petsList = new Array();
   
    if(this.commonService.cityModel.Id!=this.currentCityID)
    this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices" ,"וטרינריה");  
    else
    this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"וטרינריה");
 


    this.commonService.isLogInUserReceivedSource.first().subscribe(
      (isLogIn) => {
        if (isLogIn) {
          this.commonService.showLoader = true;          
            this.getPetsPerUser();
            this.getSubPetsUser(); 
        }
      }
    );
    this.veterinariaService.activeStep = this.veterinariaService.activeStep;// "my-pets";

  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    setScrollBar();
  }

  getSubPetsUser() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '789a9b16-1488-428e-82b1-f968c794ee5f';
    this.param = new InputParams("@PayerId", "123");
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_KeepItCity', 'getSubPetsUser');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      let chips: string[] = new Array();
      res.forEach(element => {
        chips.push(element.ChipId)
      });
      this.getPetsPerPet(JSON.stringify(chips));
    }, err => { });
  }

  getPetsPerUser() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '5d362728-ab53-4341-b866-af02fa7c085b';
    this.param = new InputParams("@PayerId", "123");
    this.params.push(this.param);
    this.param = new InputParams("perUserOrPet", "user");
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.Vaterinaria')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      console.log(res)
      if (res.Value == "error" || res.result == false) {
        return false;
      }
      res.animals.forEach(element => {
        this.veterinariaService.petsList.push(element);
      });


    }, err => {

    });
  }

  getPetsPerPet(chips) {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '5d362728-ab53-4341-b866-af02fa7c085b';
    this.param = new InputParams("chip", chips);
    this.params.push(this.param);
    this.param = new InputParams("perUserOrPet", "pets");
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.Vaterinaria')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.commonService.showLoader = false;
  
      if (res.Name == "error") {
        return false;
      }

      res.forEach(element => {
        this.veterinariaService.petsList.push(JSON.parse(element).animal);
      });
    }, err => {

    });
  }


}
