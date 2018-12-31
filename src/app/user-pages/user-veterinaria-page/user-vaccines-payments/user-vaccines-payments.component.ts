import { Component, OnInit } from '@angular/core';
import { VeterinariaService } from '../../../services/vetrinaria.service';
import { GetJsonService } from '../../../services/get-json.service';
import { InputParams, ActionInputParams, FullActionInputParams } from '../../../../Models/ParamsModel';
@Component({
  selector: 'app-user-vaccines-payments',
  templateUrl: './user-vaccines-payments.component.html',
  styleUrls: ['./user-vaccines-payments.component.css']
})

export class UserVaccinesPaymentsComponent implements OnInit {
  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;

  iframeSrc:string = '';
  constructor(public veterinariaService:VeterinariaService,private jsonService: GetJsonService) {
    //this.getIframePay();
    
   }
  //  getIframePay()
  //  {
  //   this.dataToSend = new Array<ActionInputParams>()
  //   this.params = new Array<InputParams>();
  //   this.actionName = 'a827dbd5-6676-4352-93d6-fd797931da79';   
  //   this.param = new InputParams("chip",this.veterinariaService.chipToPay);
  //   this.params.push(this.param);

  //   this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
  //   this.dataToSend.push(this.singleDataObj);
  //   this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.Vaterinaria')
  //   this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
  //     console.log(res);
  //     this.iframeSrc = res.payment_iframe_url;
  //   }, err => {

  //   });
  //  }

  ngOnInit() {

  }

}
