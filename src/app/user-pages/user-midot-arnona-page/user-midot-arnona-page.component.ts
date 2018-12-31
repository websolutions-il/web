import { Component, OnInit } from '@angular/core';
 
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { arnonaModel } from '../../../Models/arnona-model';

@Component({
  selector: 'app-user-midot-arnona-page',
  templateUrl: './user-midot-arnona-page.component.html',
  styleUrls: ['./user-midot-arnona-page.component.css']
})
export class UserMidotArnonaPageComponent implements OnInit {
   

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  companyId:string;
  cityName:string;

  assetList: any = new Array();
  arnonaImageList:any= new Array();
  arnonaItam:arnonaModel;
  isMobilUser: boolean;
  iframeLink:string;

  constructor(private router: Router, private route: ActivatedRoute, public commonService: CommonService, private jsonService: GetJsonService) {
   
    this.route.params.subscribe((params: Params) => {
      this.companyId= params['city'];   
    });
   
    if(this.commonService.cityModel.Id!=this.companyId)
    this.commonService.getCityDetailFromUmbraco(this.companyId,"otherServices" ,"מידות ארנונה");  
    else
    this.commonService.setTitleAndDescription("otherServices", this.commonService.cityModel.name,"מידות ארנונה");
   
  
   
    this.isMobilUser = this.commonService.getIsMobileUser();    
   
    this.getUserAssets();  
  }

  getUserAssets() {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = '6cd2108b-b84d-4b79-b1f9-34eb88dc486e';
    this.params = new Array<InputParams>();
    this.param = new InputParams("@PayerId","127");
    this.params.push(this.param);

    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24','GetAssetsByPayerId')
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
      res.forEach(element => {
        if(element.company_id== this.companyId)
        {
          this.assetList.push(element.AssetNumber);
        }             
      });
      this.getArnonaImages();
    }, err => {
      //alert(err);
    });
  }
 
  getArnonaImages() {
     this.assetList.forEach(element => {
     let url= 'assets/arnona_images/'+this.companyId+"/"+element+".pdf";
     if(this.checkIfFileExists())     
     {
      this.arnonaItam= new arnonaModel();
      this.arnonaItam.imageSrc= url;    
      this.arnonaItam.assetNumber=element;
      this.arnonaImageList.push(this.arnonaItam);
     }
    });
    //console.log(this.arnonaImageList);
    if(this.arnonaImageList==0)
    {
      $(".refrence_table").html("<p style='padding-right: 3vw; font-size: 22px;'> אין נתונים להצגה </p>")
      $(".refrence_table").removeClass("table-striped");        
   return false;
    }  
  }

   // צריך תיקון
  checkIfFileExists()
  {
    return true;   
  }

  showPdf(link)
  { // link= 'assets/Responsive_V12.pdf' //for test
    if (this.isMobilUser) {
      document.getElementById("openLinkInNewWindow").setAttribute("href",link)
      document.getElementById("openLinkInNewWindow").click();
      
    //  window.open(link);
    }
   else{
    this.iframeLink = link;
    $(".iframe_wrap").show();
   }
  }

  closePdfDoc()
  {
   $(".iframe_wrap").hide();
  }

  ngOnInit() {
  }

}
