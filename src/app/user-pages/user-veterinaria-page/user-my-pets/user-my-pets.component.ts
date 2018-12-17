import { Component, OnInit, AfterViewInit } from '@angular/core';
import { VeterinariaService } from '../../../services/vetrinaria.service';
 
import { GetJsonService } from '../../../services/get-json.service';
import { InputParams, ActionInputParams, FullActionInputParams } from '../../../../Models/ParamsModel';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-user-my-pets',
  templateUrl: './user-my-pets.component.html',
  styleUrls: ['./user-my-pets.component.css']
})
export class UserMyPetsComponent implements OnInit {
     

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  constructor(private jsonService: GetJsonService, public commonService: CommonService,public veterinariaService:VeterinariaService) {
    
   }

  ngOnInit() {
  }
  openFileDialog(i)
  {
    $("#imgFile"+i).click();
  }

  goToPayment(chip)
  {
     this.veterinariaService.iframeForPay = chip;
     this.veterinariaService.changeStep("pay");
  }
  goToVaccines(pet)
  {
     this.veterinariaService.selectetPet = pet;
     this.veterinariaService.changeStep("vaccines");
  }
  uploadFile(event , imgIndex , pet) {
   
    let files = event.target.files;
    if (files.length > 0) {  
    if(files[0].type.split("/")[1] != "jpeg")
    {
      alert("ניתן להעלות רק קבצי jpg")
      return false;    
    }
    this.getBase64(files[0] , imgIndex , pet);
    }

  }

  getBase64(file , imgIndex , pet) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      var canvas= document.createElement("canvas");
      var img = document.createElement("img");
      img.src= reader.result;
      img.width=300;
      img.height=300;
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");     
     
      setTimeout(() => {
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataurl = canvas.toDataURL("image/jpg");   
      this.uplodeImg(dataurl , pet);
      //this.uplodeImg(reader.result , pet);
    }, 1000); 

    this.veterinariaService.petsList[imgIndex].photo_url = reader.result;
   
  
    };
    reader.onerror = (error) => {  };
  }

  uplodeImg(base64 , pet)
  {
      this.dataToSend = new Array<ActionInputParams>()
      this.params = new Array<InputParams>();
      this.actionName = '3b9f1141-e4c6-4f54-a5c0-37ab8243f3df';
      this.param = new InputParams("base64",base64);
      this.params.push(this.param);
      this.param = new InputParams("chip",pet.chip);
      this.params.push(this.param);

      this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
      this.dataToSend.push(this.singleDataObj);
      this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'PayLogic', 'PayLogic.Vaterinaria')
      this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
           
      }, err => {
  
      });
  }



}
