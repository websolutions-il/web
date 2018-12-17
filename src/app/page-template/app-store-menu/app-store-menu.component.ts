import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GetJsonService } from '../../services/get-json.service';

@Component({
  selector: 'app-app-store-menu',
  templateUrl: './app-store-menu.component.html',
  styleUrls: ['./app-store-menu.component.css']
})
export class AppStoreMenuComponent implements OnInit {

  constructor(public commonService: CommonService, private router: Router, private jsonService: GetJsonService, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }
  actionAppStoreMenu(link)
  {
    switch (link) {
      case 'iphone':
        window.open("https://itunes.apple.com/us/app/mast/id1353905834?ls=1&mt=8");
        break;
        case 'android':
        window.open("https://play.google.com/store/apps/details?id=com.mgar.mast.mastapp");
        break;
        case 'stay':       
         this.router.navigate([this.jsonService.getCookie("pageAfterAppStoreMenu")])
        break;
      default:
        break;
    }
    this.jsonService.createCookie("AppStoreMenu", link, 1);
  }
}
