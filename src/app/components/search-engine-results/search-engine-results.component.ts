import { Component, OnInit } from '@angular/core';
import { GetJsonService } from '../../services/get-json.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-search-engine-results',
  templateUrl: './search-engine-results.component.html',
  styleUrls: ['./search-engine-results.component.css']
})
export class SearchEngineResultsComponent {
  itemsList : any = [];
  isLoad:boolean;
  isNextPage:boolean = false;
  isPrevPage:boolean = false;
  start: number = 1;
  num:number = 10;
  query:string;
  currentCityID:string;

  constructor(private jsonService : GetJsonService,public commonService: CommonService,
    private route: ActivatedRoute, private router: Router) {

      this.route.params.subscribe((params: Params) => {
         this.isLoad = false;
         
         this.query = params['query'];
         this.currentCityID = params['city'];         
         this.serachItems();
      });
     }


  serachItems(){
    this.commonService.showLoader = true;
    var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyBD3yhuFDsAFXpRCVN1i7UwrTMqRUqaIZM&cx=014923635898135725043:z8my_e3bur4"
              +"&start="+this.start+"&num="+this.num +"&q="+(this.currentCityID ? "site:www.mast.co.il/"+ this.currentCityID + " " : '') +this.query  
             // + "&linkSite=https://www.mast.co.il/12" //+ (this.currentCityID ? this.currentCityID+ "/" : '') ;   
    this.jsonService.get(url).subscribe(res => {
      this.itemsList = res.items;
      this.isLoad = true;

      if(res.queries.nextPage)
      {
        if(res.queries.nextPage[0].startIndex<92)
          this.isNextPage = true;
          else
          this.isNextPage = false;
      }
      else
      this.isNextPage = false;
        

        this.isPrevPage = (res.queries.previousPage);

      this.commonService.showLoader = false;
    console.log(res);
   }, err => {   });
  }
  openLink(link:string){
    console.log(link)
    let subLink = link.split("https://www.mast.co.il")[1];
    this.router.navigate([(this.commonService.isLogInUser ? '/user/' : '' ) + subLink]);
  }
  nextPage(){
    window.scroll(0,0);
    this.start += 10;
    this.serachItems();
  }
  prevPage(){
    window.scroll(0,0);
    this.start -= 10;
    this.serachItems();
  }

}
