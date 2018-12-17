import { Component, OnInit } from '@angular/core';
import { GetJsonService } from '../../services/get-json.service';
import { UmbracoPgae } from "../../../Models/UmbracoPageModel";
import { CommonService } from '../../services/common.service';
import { Router,ActivatedRoute, Params } from "@angular/router";
import { ContentComponent } from '../../page-template/content/content.component';

declare var NativeApp: any;

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent implements OnInit {

  lenguage: any;// = { target: { value: 'he' } };
  defaultLang: string;
  umbracoLinkPages: any; 

  searchText:string;


  constructor(public commonService: CommonService,
     private router: Router,  private route: ActivatedRoute) {
     

    this.commonService.footerMenuSubject.first().subscribe(
      (menu) => {
        this.umbracoLinkPages = menu;
      }
    );
  }

  actionSearchEngine(){
    if(!this.searchText)
    return false;
    if(this.route.firstChild.snapshot.params['city'])
    this.router.navigate(['/'+this.route.firstChild.snapshot.params['city']+'/search-engine/'+this.searchText]);
    else
    this.router.navigate(['/search-engine/'+this.searchText]);
  }
  

  actionLink(page) {
    $("#hamborger_button").click();
    if (page.isInternal) {
      this.router.navigate(['content/' + page.name]);
    }
    else {
      if (page.newWindow) {
        document.getElementById("openLinkInNewWindow").setAttribute("href", page.content)
        document.getElementById("openLinkInNewWindow").click();
      }
      else {
        document.location.href = page.content;
      }
    }
  }


  logIn() {
    $("#hamborger_button").click();
    this.router.navigate(['/registraion-log-in-page']);
  }

  logOut() {
    $("#hamborger_button").click();
   this.commonService.logOut()
  }
  defaineLang(lang) {
    switch (lang) {
      case 'he':
        $("#he").prop("selected", "selected");
        break;
      case 'en':
        $("#en").prop("selected", "selected");
        break;
      default:
        $("#he").prop("selected", "selected");
        break;
    }
  }


  ngOnInit() {  

    
  }
  
}
