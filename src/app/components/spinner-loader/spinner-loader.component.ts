import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GetJsonService } from '../../services/get-json.service';

@Component({
  selector: 'app-spinner-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.css']
})
export class SpinnerLoaderComponent implements OnInit {
  @Input() show = false;
  @Input() styleLoader;
  constructor( private sanitizer: DomSanitizer) { }

  ngOnInit() { 
  }
  sanitize(style: string) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
