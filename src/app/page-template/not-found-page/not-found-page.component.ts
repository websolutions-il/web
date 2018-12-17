import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent implements OnInit {
  isLoader:boolean = true;
  constructor(public commonService:CommonService) { 
    $(".lessHeightBanner").remove();
    $("footer").remove();

  }
 
  ngOnInit() {
    this.commonService.showLoader = true;
    setTimeout(() => {
      this.isLoader = false;
      this.commonService.showLoader = false;
    }, 10000);
   
  }

}
