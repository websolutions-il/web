import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class GetLoctaionService {
    private header = new Headers({
       // 'Content-Type': 'application/json'
       'Accept-Language': 'Hebrew'
    });
    constructor(private http: Http ) {}
    
     getLocation(location) {
        let stam;
          return this.http.post('https://maps.googleapis.com/maps/api/geocode/json?latlng='+location+'&result_type=street_address&language=iw&key=AIzaSyDNcNaSopR_X8Vf7hkdIBkMHDnsT0hV_ik',stam)
              .map(res => res.json())        
          .catch(this.handleError);
       }


    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}