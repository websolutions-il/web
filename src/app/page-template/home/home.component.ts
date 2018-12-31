import { Component, OnInit, AfterViewInit } from '@angular/core';

import { DOCUMENT } from '@angular/common/src/dom_tokens';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{

  constructor(public commonService: CommonService) {
    this.commonService.setTitleAndDescription("home", "", "");  
  }
  ngAfterViewInit(){
     setTimeout(() => {
       $("video")[0].remove();
       $("#homeHeader").append(`<video autoplay="true" muted="muted" loop="" id="myVideo">
          <source src="assets/img/header_video.mp4" type="video/mp4"></video>`)
     }, 10);
    }
     

}
