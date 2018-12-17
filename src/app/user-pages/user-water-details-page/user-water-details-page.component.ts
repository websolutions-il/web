import { Component, OnInit, ViewChild } from '@angular/core';
 
import { CommonService } from '../../services/common.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from 'rxjs';
import { element } from 'protractor';
import { UserSideMenuComponent } from '../../components/user-side-menu/user-side-menu.component';

@Component({
  selector: 'app-user-water-details-page',
  templateUrl: './user-water-details-page.component.html',
  styleUrls: ['./user-water-details-page.component.css']
})
export class UserWaterDetailsPageComponent implements OnInit {

   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();


  cityName: string;
  cityLogo: string = "";
  companyId: string;
  payerId: string;
  clientCodeForWaterDetails: string;
  waterDetailList: any;
  counterRequestToGetWaterDetail: any = 0;

  headTableText: string[] = ["חודש", "צריכה"];

  isUmax: boolean;
  isArad: boolean;

  Address: string;
  CounterID: string;
  PayerName: string;
  CounterKod: string;
  CurrentRead: string;
  umax_PeriodsList: any;
  arad_PeriodsList: any;

  textBarList: textBar[] = new Array<textBar>();
  XspaceTextBarUmax: number = 110;
  XspaceTextBarArad: number = 15;
  heightList: any = new Array();
  consList: any = new Array();
  liensHeight: liensHeight[] = new Array<liensHeight>();
  waterDetailsPeriods: WaterDetailsPeriods[] = new Array<WaterDetailsPeriods>();
  waterDetailsPeriods12: WaterDetailsPeriods[] = new Array<WaterDetailsPeriods>();
  waterDetailsPeriods24: WaterDetailsPeriods[] = new Array<WaterDetailsPeriods>();
  svgGraph: SvgGraph[] = new Array<SvgGraph>();
  svgGraphVM: SvgGraph[] = new Array<SvgGraph>();
  avaerge24Line: number;


  constructor(public commonService: CommonService, private jsonService: GetJsonService, private router: Router, private route: ActivatedRoute) {

   
    this.route.params.subscribe((params: Params) => {
      this.companyId = params['city'];
    });

    if(this.commonService.cityModel.Id!=this.companyId)
    this.commonService.getCityDetailFromUmbraco(this.companyId,"otherServices" ,"נתוני מים");  
    else
    this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"נתוני מים");
    this.commonService.showLoader = true;

    this.commonService.isVerifyAsset.first().subscribe(
     (isVerifyAsset) => {
       if (isVerifyAsset) {         
         this.GetClientCodeForWaterDetails();
       }
       else {
         this.commonService.showLoader = false;
         this.jsonService.createCookie("pageAfterVerifyAsset", '/user/' + this.companyId + '/water-details', '');
         this.router.navigate(['user/' + this.companyId + '/verification-asset']);
       }
     })   
  }

  ngAfterViewInit(){
    
  }
  
  GetClientCodeForWaterDetails() {
    this.actionName = 'fceff359-a5f9-4010-bf30-bcc409d79f6d';
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.param = new InputParams("@ClientId", this.companyId);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', 'GetClientCodeForWaterDetails')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
    if (res[0].corporation == "UMAX") {
        this.isUmax = true;
        this.clientCodeForWaterDetails = res[0].code;
        this.actionName = 'ffa220be-a6d0-419e-951d-fca0489bbb49';// umax function
      }
      else { //ARAD
        this.isArad = true;
        this.clientCodeForWaterDetails = JSON.stringify(res); 
        this.actionName = '8985a80b-0ab8-4302-b282-e5fec08def8d';// arad function
      }
      this.GetWaterDetail();
    }, err => {
      //alert(err);
    });

  }


  GetWaterDetail() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();

    this.param = new InputParams("@PayerId", "16");
    this.params.push(this.param);
    this.param = new InputParams("@ClientId", this.clientCodeForWaterDetails);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.PayLogicClass')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      if (res.length == 0 || res.Name == 'errorNotFound') {
        if (this.isArad) {
          this.getCompanyCodeByMgarId();// בדיקה האם הוא קיים ביומקס בכל אופן
          return false;
        }
        else {
          this.commonService.showLoader = false;
          $(".graph_SVG").remove();
          return false;
        }
      }

      if (this.isUmax) {
        this.Address = res[0].Address;
        this.CounterID = res[0].CounterID;
        this.CounterKod = res[0].CounterKod;
        this.PayerName = res[0].PayerName;
        this.CurrentRead = res[0].CurrentRead;
        res[0].Periods.forEach(element => {
          this.waterDetailsPeriods.push(new WaterDetailsPeriods(element.PeriodMonth, element.PeriodYear.toString().substring(2,4), element.CurrentUse));
        });
      }
      if (this.isArad) {
        this.Address = res.consumer_details.Address;
        this.CounterID = res.consumer_details.WaterId;
        this.CurrentRead = res.consumer_details.CurrentCons;
        this.PayerName = res.consumer_details.CustomerName;
        res.meter_reads.forEach(element => {
          this.waterDetailsPeriods.push(new WaterDetailsPeriods(element.Date.split("/")[0], element.Date.split("/")[1].toString().substring(2,4), element.Cons));
        });
      }
      this.setSVGDetails();
      this.commonService.showLoader = false;
    }, err => {
      //alert(err);
    });
  }

  setSVGDetails() {
   let i = 0;
   this.waterDetailsPeriods.forEach(element => {
     if(i<12)
     this.waterDetailsPeriods12.push(element);
     else
     this.waterDetailsPeriods24.push(element);
   i++;
   });
    
   if(this.isArad) {
    this.waterDetailsPeriods12.forEach(element =>{
     element.hebrowMonthe = this.translateMonthsToHebrew(element.PeriodMonth);
    });
   }

    this.waterDetailsPeriods.forEach(element => {
      this.consList.push(element.CurrentUse); // איסוף נתוני הצריכה    
      let text = element.PeriodMonth; //+ '/' + element.PeriodYear;
      this.textBarList.push(new textBar(text)); // month list for text bar        
    });

    // יצירת רשימת התקופות שמתחת לגרף.
    if (this.isUmax) {      
      this.textBarList = this.textBarList.splice(0,6); //(6, this.textBarList.length);
      let space = 93;
      this.textBarList.forEach(element => {
        element.Xspace = space;
        space += 110;
      });
    }

    if (this.isArad) {
      this.textBarList = this.textBarList.splice(0, 12);
      let space = 60;
      this.textBarList.forEach(element => {
        element.Xspace = space;
        space += 60;
      });
    }
    this.calcSVGLines();
  }

  calcSVGLines() {
    let maxCons = Math.max(...this.consList); // הבאת הצריכה הכי גבוהה
    if (maxCons < 25) // נרשה שהמספר הכי נמוך יהיה 25
      maxCons = 25;

    let linesHeight = 200 / 5;
    let oneSlice = maxCons / 5;
    // יצירת רשימה של מ"ק והגבהים שלהם
    for (let i = 1; i < 6; i++) {
      let MK = Math.floor(oneSlice * i);
      this.liensHeight.push(new liensHeight(200 - (40 * i), MK));
    }

    this.avaerge24Line = 200 - (200 * 24 / maxCons); // קו ממוצע צריכה של 24 מ"ק

    // יצירת הגרפים
    let i = 0;
    let j = 0;
    let itterationCount = (this.isUmax ? 6 : 12);
    let space = (this.isUmax ? 110 : 60);
    let firstLeft = (this.isUmax ? 80 : 45);
    let firstRight = (this.isUmax ? 95 : 60);
    let secondLeft = (this.isUmax ? 105 : 70);
    let secondRight = (this.isUmax ? 125 : 90);
    this.waterDetailsPeriods.forEach(element => {
      let height = 200 - ((200 / maxCons) * element.CurrentUse);
      this.heightList.push(height);
      let svg = new SvgGraph();
      
      if (i < itterationCount) {
        svg.color = "url(#bottom-to-top-dark-blue)";
        svg.left = firstLeft + (space * i);
        svg.right = firstRight + (space * i);
        svg.height = height;
        i++;
      }
      else {
        svg.color = "url(#bottom-to-top)" ;
        svg.left = secondLeft + (space * j);
        svg.right = secondRight + (space * j);
        svg.height = height;
        j++;
      }
      this.svgGraph.push(svg);
    });

    for (let i = 0; i < itterationCount; i++) {
      if(this.svgGraph[i])
      this.svgGraphVM.push(this.svgGraph[i]);
     if(this.svgGraph[i + itterationCount])
      this.svgGraphVM.push(this.svgGraph[i + itterationCount]);
    }
  }

  openPopup() {
    $("#popup").fadeIn(200);
    $(".content").append($("svg"));
  }
  closePopup() {
    $("#popup").fadeOut(200);
    $("svg").insertAfter(".btn_full_screen");
  }
  zoomSVG()
  {
    $(".popup").toggleClass("zoom");
  }

  ngOnInit() {
  }

  // לטובת לקוחות שהרשות שלהם רשומה באראד אבל הם הועברו ליומקס

  getCompanyCodeByMgarId() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '8dd324be-c207-4afb-ab1b-0476dc094c59';
    this.param = new InputParams("@MgarId", this.companyId);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24', '');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
 
      this.checkInUmaxAnyway(res[0].company_code);
    }, err => {
      //alert(err);
    });

  }

  checkInUmaxAnyway(compeny_code) {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = 'ffa220be-a6d0-419e-951d-fca0489bbb49';
    this.param = new InputParams("@PayerId", "16");
    this.params.push(this.param);
    this.param = new InputParams("@ClientId", compeny_code);
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.PayLogicClass')

    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      console.log(res);
      if (res.length == 0 || res.Name == 'errorNotFound') {
        $(".graph_SVG").remove();
        this.commonService.showLoader = false;
        return false;
      }
      this.Address = res[0].Address;
      this.CounterID = res[0].CounterID;
      this.CounterKod = res[0].CounterKod;
      this.PayerName = res[0].PayerName;
      this.CurrentRead = res[0].CurrentRead;

      // this.umax_PeriodsList = res[0].Periods;
      res[0].Periods.forEach(element => {
        this.waterDetailsPeriods.push(new WaterDetailsPeriods(element.PeriodMonth, element.PeriodYear, element.CurrentUse));
      });
      this.isUmax = true;
      this.isArad = false;
      this.setSVGDetails();
      this.commonService.showLoader = false;
    }, err => {
      //alert(err);
    });

  }
  private translateMonthsToHebrew(input: string) {
    let output = "";
    switch (input) {
      case "01":
        output = "ינואר";
        break;
      case "02":
        output = "פברואר";
        break;
      case "03":
        output = "מרץ";
        break;
      case "04":
        output = "אפריל";
        break;
      case "05":
        output = "מאי";
        break;
      case "06":
        output = "יוני";
        break;
      case "07":
        output = "יולי";
        break;
      case "08":
        output = "אוגוסט";
        break;
      case "09":
        output = "ספטמבר";
        break;
      case "10":
        output = "אוקטובר";
        break;
      case "11":
        output = "נובמבר";
        break;
      case "12":
        output = "דצמבר";
        break;
    }
    return output;
  }


}
export class liensHeight {
  constructor(height, MK) {
    this.height = height;
    this.MK = MK;
  }
  public height: number;
  public MK: number;
}
export class WaterDetailsPeriods {
  constructor(PeriodMonth, PeriodYear, CurrentUse) {
    this.PeriodYear = PeriodYear;
    this.PeriodMonth = PeriodMonth;
    this.CurrentUse = CurrentUse;
  }
  public PeriodYear: string;
  public PeriodMonth: string;
  public CurrentUse: number;
  public hebrowMonthe: string;
}

export class textBar {
  constructor(text) {
    this.text = text;
  }
  public text: string;
  public Xspace: number;
}

export class SvgGraph {
  // constructor(height)
  // {
  //   this.height = height;
  // }
  height: number;
  left: number;
  right: number;
  color: string;
}