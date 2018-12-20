import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Meta } from '@angular/platform-browser';
import { GetJsonService } from './get-json.service';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { EvaDataStructure } from '../../Models/ParamsModel';
import { CityModel } from '../../Models/CityModel';
import { SEO } from '../../Models/SeoDescription';
import { FormModel } from '../../Models/FormModel';

@Injectable()
export class CommonService {
///
  // BehaviorSubject immediately emits the last value to new subscribers
  // The purpose of BehaviorSubject is to provide initial value. It can be null or anything else.
  // If no valid initial value can be provided (when user id isn't known yet), it shouldn't be used.
  // ReplaySubject(1) provides a similar behaviour (emits last value on subscription)
  // but doesn't have initial value until it is set with next.
  EwaPost: EvaDataStructure = new EvaDataStructure();
  seo: SEO = new SEO();
  public userDetailsReceivedSource = new ReplaySubject<any>(1);
  public isLogInUserReceivedSource = new ReplaySubject<any>(1);
  public footerMenuSubject = new ReplaySubject<any>(1);
  public cityListSubject = new ReplaySubject<any>(1);
  public isVerifyAsset = new ReplaySubject<boolean>(1);
  public isMobileUserSubject = new ReplaySubject<boolean>(1);
  
  public currentCityName: string;
  public lastLoginDate: any;
  public userDetails: any;
  public sideMenuCityList: any;
  public isMobileUser: boolean;
  public userAgent: string;
  public isLogInUser: boolean;
  public selectedLanguage: string;
  public cityModel = new CityModel(); 
  public cityList: any;

  public formModel:FormModel= new FormModel("","");
  //loader
  showLoader:boolean;
  styleLoader:string;
  constructor(private meta: Meta, private router: Router, private jsonService: GetJsonService) { }
  updateIsMobileUserSubject(data: any) {
    this.isMobileUser = data;
    this.isMobileUserSubject.next(data);
  }

  updateIsLogInUserSubject(data: any) {
    this.isLogInUser = data;
    this.isLogInUserReceivedSource.next(data);
  }
  updatedUserDetailsSubject(data: any) {
    this.userDetails = data;
    this.userDetailsReceivedSource.next(data);
  }
  updatedIsVerifyAssetSubject(data: any) {
    this.isVerifyAsset.next(data);
  }
  updatedFooterLinksSubject(data: any) {
    this.footerMenuSubject.next(data);
  }
  updatedcityListSubject(data: any) {
    this.cityList = data;
    this.cityListSubject.next(data);
  }


  public recaptchaScript() {// טוען את הסקירפט של הריקפצ'ה בכל דף נדרש
    $("head").append("<script data-name='recaptchaScript' src='https://www.google.com/recaptcha/api.js?hl=he' type='text/javascript' async = true> </script>")
  }

  // שתי הפונקציות האלה הם לצורך רקפטצה בדפים בהם ישנם שתי רקפצות(גם של ההרשמה) לכן נדרש להבדיל ביינהם
  // כמובן שזה נצרך רק בדפים בהם יש צורך לאפס את הרקפט'צה
  public secoendRecaptchaScript() {
    setTimeout(() => {
      $("head").append("<script data-name='recaptchaScript' src='https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit&hl=he' type='text/javascript' async = true> </script>")
    }, 100);

  }

  public googleMpasScript() {
    $("head").append("<script src='https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false' type='text/javascript' async = true> </script>")
  }

  public setTitleAndDescription(type, cityName, otherInfo) {
    let mast = " | MAST";
    let title = "";
    let description = "";
    switch (type) {
      case "home":
        title = this.seo.homeTitle + mast;
        description = this.seo.homeDes;
        break;
      case "services":
        title = this.seo.servicesTitle + cityName + mast;
        description = this.seo.servicesDesPartOne + cityName + this.seo.servicesDesPartTow;
        break;
      case "forms":
        title = this.seo.formsTitle + " " +  cityName + mast;
        description = this.seo.formsDesPartOne + cityName + this.seo.formsDesPartTow;
        break;
      case "payments":
        title = this.seo.paymentsTitle + cityName + mast;
        description = this.seo.paymentsDesPartOne + " " + cityName + " " + this.seo.paymentsDesPartTow;
        break;
      case "form":
        title = otherInfo + " " + cityName + mast;
        description = otherInfo + " " + cityName + " " + this.seo.formDes;
      case "payment":
        title = otherInfo + cityName + mast;
        description = otherInfo + cityName + this.seo.paymentDes;
      case "otherServices":
        title = otherInfo + " " + cityName + " " + mast;
        description = otherInfo + " " + cityName + " " + this.seo.otherServicesDes;
        break;
      default:
        break;
    }
    document.title = title;
    this.meta.updateTag({ name: 'description', content: description });
  }
  logOut() {//for log out user
    this.sideMenuCityList = null;
    this.lastLoginDate = null;
    this.updateIsLogInUserSubject(false);
    this.updatedUserDetailsSubject(null);
    this.jsonService.createCookie("token", "", -1);
    this.router.navigate(['/']);
  }

  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();

  }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  getIsMobileUser() {
    return this.isMobileUser;
  }


  getCityDetailFromUmbraco(cityId, servicesType, otherInfo = "") {
    let data = this.EwaPost.getCityDetailFromUmbraco(cityId);
    this.jsonService.sendData(data).subscribe(res => {
      this.cityModel = new CityModel(); 
      res.forEach(element => {
        if (element.Name == 'error') {// אם התאגיד לא קיים באומברקו, חזרה לדף הבית
          this.logOut();
          return false;
        }
        this.cityModel.Id = cityId;
        if (element.Name == 'cityName') {
          this.cityModel.name = element.Value;
          this.setTitleAndDescription(servicesType,this.cityModel.name,otherInfo);
        }
        if (element.Name == 'logo') {
          this.cityModel.logo = element.Value;
        }
        if (element.Name == 'formLabale') {
          this.cityModel.formPhoneSupport = element.Value;
        }
        if (element.Name == 'isPaymentParentShow') {
          if (element.Value == "1")
            this.cityModel.isPaymentParentShow = true;
        }
        if (element.Name == 'billImgExample') {
          this.cityModel.billImgExample = element.Value;
        }
      });

    }, err => { }
    );
  }


  log(AppName, CustomMessage, ExceptionMessage) {
    let data = this.EwaPost.BuildDataStructure("88cf7c6c-8958-4d60-96b2-2ce5f065c193",
     [{Name : "@AppName", Value :AppName},
     {Name : "@CustomMessage", Value :CustomMessage },
     {Name : "@ExceptionMessage", Value :ExceptionMessage}],
     'MastApi_KeepItCity','log');   
     this.jsonService.sendData(data).subscribe(res => {},
     err => { }
  
   );
 }

  getUserDetail() {
    let data =this.EwaPost.getUserDetail();
    this.jsonService.sendData(data).subscribe(res => { 
      this.updatedUserDetailsSubject(res);    
    }, err => {  
      this.logOut();
    });  
  }


}
