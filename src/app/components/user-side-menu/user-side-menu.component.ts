import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';

import { NgSwitch } from '@angular/common';
import { GetJsonService } from '../../services/get-json.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HamburgerMenuComponent } from '../../components/hamburger-menu/hamburger-menu.component';
import { MainTemplateComponent } from '../../main-template/main-template.component';
import { CityDropDownComponent } from '../city-drop-down/city-drop-down.component';
import { ValidationService } from '../../services/validation.service';
declare function flexSlider();

@Component({
  selector: 'app-user-side-menu',
  templateUrl: './user-side-menu.component.html',
  styleUrls: ['./user-side-menu.component.css']
})
export class UserSideMenuComponent implements AfterViewInit {


  userToken: string;
  //FilterdAssetList: any;// ללא חזרה של שמות ערים
  lastLogIn: string;
  isMobileUser: Boolean;
  isMyDocuments: boolean;


  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();


  cityIdFromURL: string;
  dropDownCityListHeight: string;
  priodeDay: string;
  isFlexSlider: boolean = false;
  isInitFlexSlider: boolean = false;;
  @ViewChild(CityDropDownComponent) cityList: CityDropDownComponent;
  popUpSubject: string;

  showToolTip2:boolean;

  selectedCityName:string;
  selectedCityId:string;
  constructor(private route: ActivatedRoute, private router: Router,
    private jsonService: GetJsonService, public commonService: CommonService,
    private humborger_men: HamburgerMenuComponent, private parent: MainTemplateComponent,
    private valid: ValidationService) {

    this.route.params.subscribe((params: Params) => {
      this.cityIdFromURL = params['city'];
    });

    if (this.commonService.getIsMobileUser()) {
      this.isMobileUser = true;
    }

    this.userToken = this.jsonService.getCookie('token');

    if (this.userToken == '') {
      this.router.navigate(['/']);
    }
    else {
      this.init();
    }
    this.getPriodeDay()

  }
  ngAfterViewInit() {
    if (this.commonService.sideMenuCityList == null)
      this.getFilterdUserCityForSliderMenu();
    else
      this.setFlexSlider();
  }

  init() {
    if (this.commonService.userDetails == null)
      this.commonService.getUserDetail();

    if (this.commonService.lastLoginDate == null)
      this.getLastUpdateLogIn();
    else
      this.setLastUpdateLogIn(this.commonService.lastLoginDate);
  }

  actionSideMenu(serviceName) {
    this.showServices();
    this.router.navigate(["user/" + this.cityIdFromURL + "/" + serviceName]);
  }

  sliderCityScript() {
    $(".dropdown_data").slideToggle();
  }

  getPriodeDay() {
    let date = new Date();
    let houre = date.getHours();

    if (houre > 5 && houre < 12)
      this.priodeDay = "בוקר טוב";
    if (houre > 11 && houre < 19)
      this.priodeDay = "צהריים טובים";
    if (houre > 18 && houre < 23)
      this.priodeDay = "ערב טוב";
    if (houre > 22 && houre < 6)
      this.priodeDay = "לילה טוב";
  }
  // onCityDropDownChange(event){
  //  this.selectedCityName = event;
  // }
  prev_insertAsset(name, id){
    this.selectedCityName = name;
    this.selectedCityId = id;
    if (this.valid.validItemInListFun(this.commonService.cityList, name, "AppName"))
    return false;
   // this.popUpSubject = "approve-regulation-add-asset";
   this.insertAsset();
  }
  insertAsset() {   
    let compId = this.selectedCityId;
    let data = this.EwaPost.BuildDataStructure('1b0d4655-c5a0-42b1-870e-122d6785135b',
      [{ Name: "@company_id", Value: compId },
      { Name: "@PayerId", Value: "327" },
      { Name: "@AssetNumber", Value: "0" }],
      'MastApi_Pay24', 'AddAssetToB2M_Payer')
    this.jsonService.sendData(data).subscribe(res => {
      if (res[0].ADD_SSO == 0) {
        return false;
      }
     // this.popUpSubject = "add-asset";
   
      let exists = this.commonService.sideMenuCityList.filter(x=>x.company_id == compId);
      if(exists.length == 0)
      this.commonService.sideMenuCityList.push(
        new AssetModel(compId, this.selectedCityName, false)
      );
      this.cityList.selectedCity = null;
      this.setFlexSlider();
    }, err => {
    });
  }

  getFilterdUserCityForSliderMenu() {
    this.actionName = 'abcc7d70-8545-45b2-8f94-3215f89e9a4a';
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.param = new InputParams("@PayerId", this.userToken);
    this.params.push(this.param);
    this.param = new InputParams("@Phone", this.userToken);
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'GetCompenyListForLogedInUser')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      //this.commonService.sideMenuCityList = res;
      this.setFilterdUserCityForSliderMenu(res);
    }, err => {
    });
  }
  setFilterdUserCityForSliderMenu(list) {
    let validCity = list.filter(c => c.company_id == this.cityIdFromURL);

    if (validCity.length == 0) {
      this.commonService.logOut();
      return false;
    }

    this.commonService.updatedIsVerifyAssetSubject((validCity[0].IsMast ? true : false));
    this.commonService.updateIsLogInUserSubject(true);

    let service = this.jsonService.getCookie("pageAfterLogIn")
    if (service) {
      try {
        let id = service.split("/")[2];
        let valid = list.filter(c => c.company_id == id);
        this.jsonService.createCookie("pageAfterLogIn", "", -1);
        if (valid.length > 0)
          this.router.navigate([service])
      } catch (error) { }

    }

    this.commonService.currentCityName = validCity[0].AppName;
    this.commonService.sideMenuCityList = new Array();
    
    list.forEach(element => {
      this.commonService.sideMenuCityList.push(
        new AssetModel(element.company_id, element.AppName, element.IsMast)
      );
    });
    this.setFlexSlider();
   

  }
  getLastUpdateLogIn() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '9d3bc216-055f-424f-899d-ab045965e53b';
    this.params = new Array<InputParams>();
    this.param = new InputParams("@PayerId", "2342345565457");
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'getLastUpdateLogIn')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      this.commonService.lastLoginDate = res;
      this.setLastUpdateLogIn(res);
    }, err => {
      //alert(err);
    });

  }
  setLastUpdateLogIn(res) {
    if (res.length > 0) {
      if (res[1] == null) {
        this.lastLogIn = res[0].CreateDate;
      }
      else {
        this.lastLogIn = res[1].CreateDate;
      }
    }
  }

  // for mobile
  showPersonalArea() {
    $("#tab-1, #tab-2").removeClass("displayTab undisplayTab");
    $("#tab-1").addClass("displayTab");
    $("#tab-2").addClass("undisplayTab");   
    this.setFlexSlider()
  }
  // for mobile
  showServices() {
    $("#tab-1, #tab-2").removeClass("displayTab undisplayTab");
    $("#tab-2").addClass("displayTab");
    $("#tab-1").addClass("undisplayTab");
  }

  updateActiveCompany(asset) {
    this.actionName = '3558f6e6-e72c-488a-8b7e-d00d68393921';
    this.dataToSend = new Array<ActionInputParams>();
    this.params = new Array<InputParams>();
    this.param = new InputParams("@PayerId", "131334535");
    this.params.push(this.param);
    this.param = new InputParams("@ClientId", asset.company_id);
    this.params.push(this.param);
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'updateActiveCompany');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => { }, err => { });
    this.changeCurrentCity(asset); 
    this.showServices();   
  }

  changeCurrentCity(asset) {
    this.commonService.currentCityName = asset.AppName;
    this.commonService.updatedIsVerifyAssetSubject((asset.IsMast ? true : false));
    this.router.navigate(["/user/" + asset.company_id + "/services"]);
  }

 setFlexSlider(){   
   this.isFlexSlider = false;
   this.isInitFlexSlider = false;   
   setTimeout(() => {
     this.isFlexSlider = true;
   }, 10);
  setTimeout(() => {
    flexSlider();
  }, 100);
  setTimeout(() => {
    this.isInitFlexSlider = true;
  }, 300); 
 }


}
export class AssetModel {
  public company_id: number;
  public AppName: string;
  public IsMast: boolean;
  constructor(company_id, AppName, IsMast) {
    this.AppName = AppName;
    this.company_id = company_id;
    this.IsMast = IsMast;
  }
}
