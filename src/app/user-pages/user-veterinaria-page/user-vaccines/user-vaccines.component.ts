import { Component, OnInit } from '@angular/core';
import { VeterinariaService } from '../../../services/vetrinaria.service';

@Component({
  selector: 'app-user-vaccines',
  templateUrl: './user-vaccines.component.html',
  styleUrls: ['./user-vaccines.component.css']
})
export class UserVaccinesComponent implements OnInit {

  constructor(public veterinariaService:VeterinariaService) {    
  }

  ngOnInit() {
  }
  goToPayment(url)
  {
     this.veterinariaService.iframeForPay = url;
     this.veterinariaService.changeStep("pay");
  }
 setFullVaccineList()
 {
   $(".wrap_message-show , .vaccinations_table").hide();
   this.veterinariaService.selectetPet = null;
   setTimeout(() => {
    $(".wrap_message-show").slideDown(700)
    $(".vaccinations_table").fadeIn(900)
   }, 10);
  
 }

}
