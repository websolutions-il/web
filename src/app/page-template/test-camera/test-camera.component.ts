import { Component, OnInit } from '@angular/core';
import { GetLoctaionService } from '../../services/get-location.service';
import { InputParams, ActionInputParams, FullActionInputParams, EvaDataStructure } from '../../../Models/ParamsModel';
import { GetJsonService } from '../../services/get-json.service';
import { Router } from '@angular/router';

declare var NativeApp: any;
@Component({
  selector: 'app-test-camera',
  templateUrl: './test-camera.component.html',
  styleUrls: ['./test-camera.component.css']
})
export class TestCameraComponent implements OnInit {
  result:string;

  actionName: string;
  FullActionInputParams: FullActionInputParams;
  dataToSend: any = new Array<ActionInputParams>();
  singleDataObj: any = new ActionInputParams();
  params: any = new Array<InputParams>();
  param: InputParams;
  EwaPost: EvaDataStructure = new EvaDataStructure();

  isValidRole: boolean;

  constructor(private router: Router,private getLoctaionSer: GetLoctaionService , private jsonService: GetJsonService) { 
    this.getUserDetail();
  }
 
  getUserDetail() {
    let data =this.EwaPost.getUserDetail();
    this.jsonService.sendData(data).subscribe(res => {    
      this.CheakRoleForVersionInfo(res[0].Email);
    }, err => {      
      //alert(err);      
    });  
  }

    CheakRoleForVersionInfo(email) {
    this.dataToSend = new Array<ActionInputParams>()
    this.params = new Array<InputParams>();
    this.actionName = 'da1d181f-70dd-4c69-9c5b-73a9c7c4cb5f';
    this.params = new Array<InputParams>();
    this.param = new InputParams("@Email", email);
    this.params.push(this.param);  
    this.singleDataObj = { ActionName: this.actionName, InputParamsCollection: this.params }
    this.dataToSend.push(this.singleDataObj);
    this.FullActionInputParams = new FullActionInputParams(this.dataToSend, 'MastApi_Pay24','CheakRoleForVersionInfo');
    this.jsonService.sendData(this.FullActionInputParams).subscribe(res => {
          if(res[0].result =="valid")
          {
             this.isValidRole = true;
          }
          else{   
            this.router.navigate(['']);
          }
    }, err => {      
      //alert(err);      
    });  
  }
 
  openGallery() {
   let a= NativeApp.openGallery();
  alert(a);
  }

  openCamera() {
  let b=  NativeApp.openCamera();
alert(b);  
}

  requestLocation() {
  
   NativeApp.requestLocation();
   setTimeout(() => {
    let location= window.location.hash;
    location= location.replace("#","");
    $("#a").html(location);
    this.getLoctaionSer.getLocation(location).subscribe(res => {
     $("#b").html(res.results[0].address_components[1].long_name);
   
 }, err => {
           //alert(err);
         });
   }, 5000);
  
     
     
    
  }

  createFile() {
    NativeApp.createFile("FileName", "Some content");
  }

  sendFile() {
    NativeApp.sendFile();
  }

  toExternalLink() {
    NativeApp.toExternalLink();
  }

  takeFingerprint() {
    NativeApp.takeFingerprint();
  }

  showPhoneInfo() {
   let x= NativeApp.showPhoneInfo();   
  }
  scanBarcode(){
  NativeApp.scanBarcode()
  }
  isAndroid(): boolean {
    return (/Android/i.test(navigator.userAgent));
  }

  isIphone(): boolean {
    return (/iPhone|iPad|iPod/i.test(navigator.userAgent));
  }
  ngOnInit() {
  }

}
