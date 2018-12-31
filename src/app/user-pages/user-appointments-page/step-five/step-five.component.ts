import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { INgxMyDpOptions, IMyDateModel, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyMarkedDate, IMyMarkedDates, IMyDate, IMyDefaultMonth } from 'ngx-mydatepicker';
import { AppointmentsService } from '../../../services/appointments.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../../Models/ParamsModel';
import { GetJsonService } from '../../../services/get-json.service';
import { on } from 'cluster';
import { CommonService } from '../../../services/common.service';

declare var $: any;

@Component({
  selector: 'app-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.css']
})
export class StepFiveComponent implements OnInit, AfterViewInit {
  // actionName: string;
  // FullActionInputParams: FullActionInputParams;
  // dataToSend: any = new Array<ActionInputParams>();
  // singleDataObj: any = new ActionInputParams();;
  // params: any = new Array<InputParams>();
  // param: InputParams;
  //ewaPost: EvaDataStructure = new EvaDataStructure();

  @Input() isEdit : boolean = false;
  @Output() endEditing = new EventEmitter();
  @Output() goBack = new EventEmitter();
  onInit: boolean;
  availableDateTimes: any = new Array();
  availableDates: any = new Array<IMyDate>();
  availableTime: any = new Array();
  inInit: boolean;
  myOptions: INgxMyDpOptions = {
    closeSelectorOnDocumentClick: false,
    closeSelectorOnDateSelect: false,
    minYear: 1999,
    maxYear: 2020,
    dateFormat: 'dd.mm.yyyy',
    sunHighlight : false,
    showTodayBtn: false,
    firstDayOfWeek: 'su',  
    satHighlight : true,   
    enableDates: this.availableDates,
    disableDateRanges: [{ begin: { year: 2000, month: 11, day: 14 }, end: { year: 2023, month: 11, day: 20 } }],
    dayLabels: { su: 'א', mo: 'ב', tu: 'ג', we: 'ד', th: 'ה', fr: 'ו', sa: 'ש' },
    monthLabels: { 1: 'ינואר', 2: 'פבואר', 3: 'מרץ', 4: 'אפריל', 5: 'מאי', 6: 'יוני', 7: 'יולי', 8: 'אוגוסט', 9: 'ספטמבר', 10: 'אוקטובר', 11: 'נובמבר', 12: 'דצמבר' },
  };


  model: any = { date: { year: 2018, month: 5, day: 29 } };

  constructor(public appointmentsService: AppointmentsService,
     private jsonService: GetJsonService, public commonService:CommonService) {
    this.commonService.showLoader = true;
    this.setAvailableDates();
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    document.getElementById("openCalendar").click();

    $(".hour_list").on("click", "div", function () {
      $(".hour_list li").removeClass("active");
      $(this).closest('li').addClass("active");
    });

  }

  initIfExists() {
    setTimeout(() => {
      if (this.appointmentsService.selected_date != undefined) {
        this.inInit = true;
        let day = this.appointmentsService.selected_date.split('.')[0];
        if (day[0] == 0) { day = day.replace('0', '') }
        $(".daycell:not(.disabled) span:contains(" + day + ")").click();
      }
      if (this.appointmentsService.selected_time != undefined) {
        let time = this.appointmentsService.selected_time;
        setTimeout(() => {
          $(".hour_list label:contains(" + time + ")").click();
        }, 100);
      }
    }, 300);

    setTimeout(() => {
      this.inInit = false;
    }, 1000);
  }
  onDateChanged(event: IMyDateModel): void {
    //  console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    if (!this.inInit)
      $(".btn.submit").addClass("disabled");

    this.appointmentsService.selected_date = event.formatted;
    let selectedDay;
    this.appointmentsService.availableDateTimes.forEach(element => {
      var date = new Date(element.startTimes[0]);
      if (date.getDate() == event.date.day)
        selectedDay = element.startTimes;
    });

    this.availableTime = new Array();
    if (!this.inInit)
      setTimeout(() => {
        this.initTimeList(selectedDay);
      }, 1);
    if (this.inInit)
      this.initTimeList(selectedDay);

    $(".hour_container .hour .hour_overlay").css("display", "block");

  }
  setSelectedTime(time, e) {
    this.appointmentsService.selected_time = time;
    $(".btn.submit.disabled").removeClass("disabled");
  }
  initTimeList(selectedDay) {
    selectedDay.forEach(element => {
      var date = new Date(element);
      let h = (date.getHours().toString().length < 2 ? "0" + date.getHours().toString() : date.getHours().toString())
      let m = (date.getMinutes().toString().length < 2 ? "0" + date.getMinutes().toString() : date.getMinutes().toString())

      this.availableTime.push(h + ":" + m);

    });
  }
  setAvailableDates() {
    // טסט
    // this.actionName = '70b58072-a212-4320-9257-14b5186af466';
    // this.dataToSend = new Array<ActionInputParams>();
    // this.params = new Array<InputParams>();
    // this.param = new InputParams('',"220"); //,"612") //
    // this.params.push(this.param);
    // this.param = new InputParams("action", "GetAvailableDates");
    // this.params.push(this.param);

    // this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    // this.dataToSend.push(this.singleDataObj);
    // this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic','PayLogic.Qflow')
    //  this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
    //  this.availableDateTimes = JSON.parse(res);

    // this.appointmentsService.availableDateTimes = this.availableDateTimes;
  // טסט
     this.appointmentsService.availableDateTimes.forEach(element => {
      var date = new Date(element.startTimes[0]);

      var availableDate: IMyDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
      this.availableDates.push(availableDate);
    });

    $(".headerbtncell:first-child button").click();
    $(".headerbtncell:last-child button").click();

    setTimeout(() => {
     this.setCssDatePicker();
    }, 1);
    $(".appointment_schedule").on("click", ".headerbtncell", ()=> {  
       this.setCssDatePicker(); 
    })

    this.commonService.showLoader = false;

   

    this.initIfExists();

  //  }, err => {
  
  //  });   
  }

 

  setCssDatePicker(){
   // var a = $(".ngxmdp .disabled");
  //  a.removeClass("disabled");
    $.each($(".caltable tbody tr"), function(i, val){
      $(this).children().eq(5).find("span").css("opacity",".5")
    })
  }
  


}
