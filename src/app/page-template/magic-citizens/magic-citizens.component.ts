import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-magic-citizens',
  templateUrl: './magic-citizens.component.html',
  styleUrls: ['./magic-citizens.component.css']
})
export class MagicCitizensComponent implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit() {
    //
  }

}
