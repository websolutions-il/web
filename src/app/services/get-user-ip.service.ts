import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class GetUserIpService {
    private header = new Headers({
       // 'Content-Type': 'application/json'
       'Accept-Language': 'Hebrew'
    });
    constructor(private http: Http ) {}
    
    getIpCliente(): Observable<string> {
        return this.http.get('https://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK') // ...using post request '
        .map((res:Response) => {
                                let ipVar = res.text();
                                let num = ipVar.indexOf(":");
                                let num2 = ipVar.indexOf("\"});");
                                ipVar = ipVar.slice(num+2,num2);                             
                                return ipVar}); 
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }


    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}