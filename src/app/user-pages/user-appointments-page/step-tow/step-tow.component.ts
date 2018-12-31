import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments.service';
import { FullActionInputParams, ActionInputParams, InputParams, EvaDataStructure } from '../../../../Models/ParamsModel';
import { GetJsonService } from '../../../services/get-json.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

declare function setScrollBarForAppointmentsStep2();
declare var $: any;
@Component({
  selector: 'app-step-tow',
  templateUrl: './step-tow.component.html',
  styleUrls: ['./step-tow.component.css']
})
export class StepTowComponent implements OnInit, AfterViewInit {
 
  EwaPost: EvaDataStructure = new EvaDataStructure();

  constructor(private router: Router, private jsonService: GetJsonService,
    public appointmentsService: AppointmentsService, public commonService:CommonService) {
  }

  ngOnInit() {
    $("#scrolling_list").on("click", "li", function () {
      $("#scrolling_list li").removeClass("active");
      $(this).addClass("active");
    })
    $("#scrolling_list2").on("click", "li", function () {
      $("#scrolling_list2 li").removeClass("active");
      $(this).addClass("active");
    })


  }
  ngAfterViewInit() {
    setScrollBarForAppointmentsStep2();
    this.initIfExists();
  }

  initIfExists() {
    if (this.appointmentsService.selected_department != null) {
      $("#dep" + this.appointmentsService.selected_department.Id).click();
    }
    if (this.appointmentsService.selected_sub_department != null) {
      setTimeout(() => {
        $("#sub_dep" + this.appointmentsService.selected_sub_department.Id).click();
      }, 200);
    }
    else if(this.appointmentsService.department_list.length==1)
    {
        $('#dep'+this.appointmentsService.department_list[0].Id).click();  
    }
  }


  selectDepartment(dep) {

      $(".list2").prop("id","scrolling_list2");
      setScrollBarForAppointmentsStep2();
 
    this.appointmentsService.selected_department = dep;
    $(".column_overlay").css("z-index", "-1");
    $("#scrolling_list2 ul").css("height", "inherit");
    $("#continueBtn").addClass("disabled");
    $(".mCSB_container .column_overlay").remove();


    if ($(window).width() < 768) {
      $('html, body').animate({
        scrollTop: $("#scrolling_list2").offset().top
      }, 2000);
    }
  }
  selectSubDepartment(dep) {
    this.appointmentsService.selected_sub_department = dep;
    $("#continueBtn").removeClass("disabled");
  }

  checkAvailableDates() {
    this.commonService.styleLoader = 
      (this.appointmentsService.isLogInUser ? "position: absolute; right: 23%;" : "right: 0px");
    this.commonService.showLoader = true;

    let data = this.EwaPost.BuildDataStructure('70b58072-a212-4320-9257-14b5186af466',
    [{Name: "unitId", Value : this.appointmentsService.selected_sub_department.UnitId},
    {Name: "action", Value : "GetAvailableDates"}],
    'PayLogic','PayLogic.Qflow')
    this.jsonService.sendData(data).subscribe(res => {
      this.commonService.showLoader = false;
      this.appointmentsService.availableDateTimes = JSON.parse(res);
      let isAvailableDates = this.appointmentsService.availableDateTimes.filter(a => a.Id != 0);
    
    
      let link = this.alterLink(this.appointmentsService.selected_sub_department.Link); 
      this.appointmentsService.selected_sub_department.Link = link;

      if (isAvailableDates.length > 0 && link != null)
      {
         this.appointmentsService.changeStep('three');
         return false;
      }
      else if (isAvailableDates.length > 0)
      {
        this.appointmentsService.changeStep('four');
        return false;
      }

        else if (link != null) {
        if (this.appointmentsService.selected_sub_department.isExternalLink == false)
          this.router.navigate([link]);
        else
          window.open(link);
      }
      else
        $("#popup").fadeIn(200);

    }, err => {
      //alert(err);
    });
  }
  closePopup() {
    $("#popup").fadeOut(200);
  }
  alterLink(link){       
    if(!link.startsWith("/") && !this.appointmentsService.selected_sub_department.isExternalLink)
      link = "/" + link;
     
      // if(link.includes('payment') && this.appointmentsService.isLogInUser)
      // {
      //   try {
      //     let linkArr = link.split("/");
      //      link = "/" + this.commonService.cityModel.Id + "/payment/" + linkArr[1];      
      // } catch (error) {
          
      //   }
      // }
      return (this.appointmentsService.isLogInUser ? '/user/' : '' )+ link;
      
  }
}
