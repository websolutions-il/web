import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputParams, ActionInputParams, FullActionInputParams } from '../../../Models/ParamsModel';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { GetJsonService } from '../../services/get-json.service';

@Component({
  selector: 'app-city-drop-down',
  templateUrl: './city-drop-down.component.html',
  styleUrls: ['./city-drop-down.component.css']
})
export class CityDropDownComponent implements OnInit {
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();  
  params: any = new Array<InputParams>();
  param: InputParams;
  
  //page:string;
  fullCorporationList: any = new Array();
  filteredStates: Observable<any[]>;
  stateCtrl: FormControl;
  isCheakBoxstayRegCorporation: boolean;
  stayRegCorporationText:string;

  isValidCityNameMesseg:string;
  selectedCity:string
  @Output() getSelectedCity = new EventEmitter();
  @Input() page : string;
  constructor(private valid :ValidationService, public commonService: CommonService,
    private router:Router,private jsonService: GetJsonService) {

    this.stateCtrl = new FormControl();     
   
    if(!this.commonService.cityList)  
       this.LoadCorporationListSearch();   
       else
       this.defineAutoComp(this.commonService.cityList);
 
   }

  ngOnInit() {
  }
 
 onChevronClicked() {
      $("#searchInput").focus();
  }


  LoadCorporationListSearch() {
    this.params = new Array<InputParams>();
    this.dataToSend = new Array<ActionInputParams>();
    this.actionName = "1a6868d3-d749-4ce9-91be-e0dff058e39b";
    this.fullCorporationList = new Array();
  
    this.singleDataObj = { ActionName: this.actionName }//, InputParamsCollection: this.params}
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend,'MastApi_KeepItCity','GetCorporation')
     this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
     this.commonService.updatedcityListSubject(res);    
     this.defineAutoComp(res);
    }, err => {
      //alert(err);
    });    
  }

  defineAutoComp(list){
    this.fullCorporationList=list;
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .startWith(null)
      .map(state => state ? this.filterStates(state) : list.slice());
  }
  filterStates(name: string) {
    return this.fullCorporationList.filter(state =>
      state.AppName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  setRegCorporationTextFun(event: any) { 
    this.getSelectedCity.emit(event);
    this.selectedCity = event;
    let AppId = 0;
    try {
      AppId = this.fullCorporationList.filter(c => c.AppName == event)[0].AppId;
    } catch (error) { }
    if (AppId == 1000) {
      this.stayRegCorporationText = "stayRegToWaterCor";  //"הישאר רשום לרשות המים";
      this.isCheakBoxstayRegCorporation = true;
    }
    else {
      this.stayRegCorporationText = "stayRegToLocalCor";//  "הישאר רשום לרשות המקומית";
      this.isCheakBoxstayRegCorporation = true;
    }
    if(AppId == 0)
    {
      this.isCheakBoxstayRegCorporation = false;
      this.stayRegCorporationText = "";
    }
  }

  getSelectedCityId()
  {    
    return this.fullCorporationList.filter(c => c.AppName == this.selectedCity)[0].MgarId;
  }
  getCityNameById(id)
  {    
    return this.fullCorporationList.filter(c => c.MgarId == id)[0].AppName;
  }
  validCitiNameFun() {
    if(this.page != 'manag')
    setTimeout(() => {
      this.isValidCityNameMesseg = this.valid.validCitiNameFun(this.fullCorporationList , this.selectedCity);
     }, 100);
  }

}
