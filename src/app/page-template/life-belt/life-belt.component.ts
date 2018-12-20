import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { EvaDataStructure } from '../../../Models/ParamsModel';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GetUserIpService } from '../../services/get-user-ip.service';
import { GetJsonService } from '../../services/get-json.service';
declare var $:any;

@Component({
  selector: 'app-life-belt',
  templateUrl: './life-belt.component.html',
  styleUrls: ['./life-belt.component.css']
})
export class LifeBeltComponent implements OnInit {

  EwaPost: EvaDataStructure = new EvaDataStructure();
  currentCityID:string;
  userIP:string;
  popUpSubject:string;
  requestId:number;

  constructor(public commonService: CommonService,private ipService:GetUserIpService,
    private route: ActivatedRoute, private router: Router, private jsonService:GetJsonService) {
      this.route.params.subscribe((params: Params) => {     
        this.currentCityID= params['city'];     
      });
      if(this.commonService.cityModel.Id!=this.currentCityID) 
         this.commonService.getCityDetailFromUmbraco(this.currentCityID,"otherServices");

     }

  ngOnInit() {
    this.ipService.getIpCliente().subscribe(res => {
      this.userIP= res;
      }, err => {  });
      $(".pageTitle").text("גלגל הצלה");
    
  }

 // formType = 947
  insertRequestToStutosNetForm() {
    let data = this.EwaPost.BuildDataStructure(
      '5CEE6734-186C-4AF1-B972-AB2453E1CAE9',
      [
        {Name : "@ClientId", Value : this.currentCityID},
        {Name : "@PageName", Value : "סתם"},
        {Name : "@GuidRequest", Value : this.commonService.guid()},
        {Name : "@PageUid", Value : "63e53692-1e03-4dec-8895-14e15761538c"},
        {Name : "@FirstName", Value : this.commonService.userDetails[0].FirstName},
        {Name : "@LastName", Value : this.commonService.userDetails[0].LastName},
        {Name : "@Email", Value : this.commonService.userDetails[0].Email},
        {Name : "@PayerID", Value : this.commonService.userDetails[0].UserName},
        {Name : "@FieldsData", Value :
        `[{"FieldNameLabel":"מקור הפניה*","FieldNameID":"ddl_RequestSource","FieldText":" -אימות נכס"` +this.commonService.cityModel.name+`},
        {"FieldNameLabel":"שם פרטי*","FieldNameID":"FirstName","FieldText":"` + this.commonService.userDetails[0].FirstName.replace("\"","") + `"},
        {"FieldNameLabel":"שם משפחה*","FieldNameID":"LastName","FieldText":"` + this.commonService.userDetails[0].LastName.replace("\"","") + `"},
        {"FieldNameLabel":"ת.ז.*","FieldNameID":"Tz","FieldText":"` + this.commonService.userDetails[0].UserName.replace("\"","") + `"},
        {"FieldNameLabel":"מספר משלם","FieldNameID":"PayerID","FieldText":"` + this.commonService.userDetails[0].UserName.replace("\"","") + `"},
        {"FieldNameLabel":"טלפון*","FieldNameID":"Phone","FieldText":"` + this.commonService.userDetails[0].Phone.replace("\"","") + `"},
        {"FieldNameLabel":"דוא\"ל","FieldNameID":"Email","FieldText":"` + this.commonService.userDetails[0].Email.replace("\"","") + `"},
        {"FieldNameLabel":"מספר נכס","FieldNameID":"AssetNum","FieldText":"` + "0" + `"},
        {"FieldNameLabel":"אישור תנאי שימוש ומדיניות פרטיות","FieldNameID":"IsApprovedRegulation","FieldText":"true"},
        {"FieldNameLabel":"גרסת תנאי שימוש ומדיניות פרטיות","FieldNameID":"ApprovedRegulationVersion","FieldText":"Ver 2, https://www.mast.co.il/content/%D7%AA%D7%A7%D7%A0%D7%95%D7%9F"},
        {"FieldNameLabel":"כתובת IP","FieldNameID":"IP_Address","FieldText":"` + this.userIP + `"},
        {"FieldNameLabel":"אישור הרשמה","FieldNameID":"IsApprovedRegistration","FieldText":"true"}]`
        },
        {Name : "@IsApprovedRegistration", Value : "1"},
        {Name : "@TZ", Value : this.commonService.userDetails[0].UserName}],
      'MastApi_KeepItCity', 'insertRequestToStutosNetForm');
    this.jsonService.sendData(data).subscribe(res => {
        if(res[0].Column1)
          {
          this.popUpSubject = "successFormRequest"
          this.requestId = res[0].Column1;
          }
          else
          alert("אירעה שגיאה")
    }, err => {

    });
  }

}
