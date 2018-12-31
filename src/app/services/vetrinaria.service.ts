import { Injectable, Inject } from '@angular/core';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { GetJsonService } from './get-json.service';

declare function setScrollBar(): any;
@Injectable()
export class VeterinariaService {

    public currentCityID:string;
    public activeStep:string;
    public petsList:any = new Array();
    public iframeForPay:string;
    public selectetPet:any;
 
  constructor(private router: Router,public commonService: CommonService,
    private jsonService: GetJsonService) { }


  changeStep(step)
  {
    if(!this.commonService.isLogInUser){
      this.jsonService.createCookie("pageAfterLogIn","/user"+this.router.url,"");
      this.router.navigate(['registraion-log-in-page/'+ this.currentCityID]);
    }
      
     if(this.activeStep == step)
         return false;
         
    $(".wrap_move").addClass("step-move-out");
    setTimeout(() => {
      $(".wrap_move").removeClass("step-move-out");
      this.activeStep = step;
      setTimeout(() => {        
         setScrollBar();
      }, 10);
    },300);
     
  }


}
