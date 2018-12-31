import { Component, OnInit, enableProdMode } from '@angular/core';
import { CommonService } from './services/common.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { GetJsonService } from './services/get-json.service';
import { Router } from '@angular/router';

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'
  ]
})
export class AppComponent {
  constructor(private router: Router, private jsonService: GetJsonService,
     private deviceService: Ng2DeviceService, public commonService: CommonService) {
     let lang = localStorage.getItem("language")
      this.commonService.selectedLanguage = (lang ? lang :'he');

    if(this.jsonService.getCookie("token"))
      this.commonService.updateIsLogInUserSubject(true);
    else
      this.commonService.updateIsLogInUserSubject(false);
   
    this.commonService.isMobileUser = this.deviceService.isMobile();  // ישן. צריך להחליף את כל מי שעובד עם זה לעבוד עם השורה הבאה ואז למחוק את זאת

    this.commonService.updateIsMobileUserSubject(this.deviceService.isMobile());
    this.commonService.userAgent = this.deviceService.userAgent;//getDeviceInfo().userAgent;

    // מעבר לדף בחירה אם הלקוח מעוניין לעבור לאפליקצייה
    if (this.commonService.isMobileUser) { 
      // let isAppStoreMenuAlredyVisit = this.jsonService.getCookie("AppStoreMenu");
      // if (isAppStoreMenuAlredyVisit == "") {
      //   this.jsonService.createCookie("pageAfterAppStoreMenu", location.pathname, 1);
      //   this.router.navigate(["app-store-menu"]);
      // }
      // else {   
        // setTimeout(() => {
        //   this.upFastInAppPopUp();
        // }, 1000);    
     // }
    }


  }
  upFastInAppPopUp() {
    $(".foot1").delay(5000).queue(function (next) {
      $(this).addClass("appDownload");
      next();
      $('.closeApp').click(function () {
        $(".foot1").removeClass("appDownload");
      });
    });
  }
}
