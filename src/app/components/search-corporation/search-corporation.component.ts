import { Component, OnInit} from '@angular/core';
import { GetJsonService } from '../../services/get-json.service'
import { ActionInputParams, InputParams, FullActionInputParams } from '../../../Models/ParamsModel'
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';


declare function setScrollBar(): any;

@Component({
  selector: 'app-search-corporation',
  templateUrl: './search-corporation.component.html',
  styleUrls: ['./search-corporation.component.css'],
})


export class SearchCorporationComponent implements OnInit{

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;

  isMainContentFocus: boolean;

  isDropDownOpen: boolean = false;
  fullCorporationList: any = new Array();
  corporationList: string[] = new Array();
  filteredCityList: any = new Array();
  filteredStates: Observable<any[]>;

  selectedCity: string;
  selecetdCityNew: string;
  isListInit:boolean;
  constructor(public commonService: CommonService, private router: Router, private jsonService: GetJsonService) {

    this.commonService.cityListSubject.first().subscribe(
      (list)=>
      {     
        this.fullCorporationList = list;
        this.filteredCityList = list;  
        setTimeout(() => {
          setScrollBar(); 
        }, 200); 
      }
    );
  }

  goToServicesPage(event) {
    this.router.navigate([event.replace(/\s/g, '') + "/services"]);
  }


  filterCityList(key) {
    this.filteredCityList = new Array();
    if (key != undefined) {
      {
        this.filteredCityList = this.fullCorporationList.filter(c => c.AppName.includes(key));
      }
    }
    if (key == '' || key == undefined) { this.filteredCityList = this.fullCorporationList; }
  }

  magnifyingGlassEvent(e) {
    if (this.isDropDownOpen)
      this.closeSearchList(e);
    else
      this.openSearchList();
  }


  openSearchList() {
    $("#content-1").css("display", "block");
    this.isDropDownOpen = true;
  }
  
  closeSearchList(event) {
    this.isDropDownOpen = false;
    event.stopPropagation()
    setTimeout(() => {
      if ($(".city-list-item").is(":focus") || $("#mCSB_1").is(":focus") ||
       $("#content-1").is(":focus") || $("#searchCorInput").is(":focus")) { }
      else {
        $("#content-1").css("display", "none");
      }
    }, 500);
  }

  ngOnInit() {
  }

}


