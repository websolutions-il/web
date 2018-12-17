import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Http,ResponseContentType} from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
@Injectable()
export class CustomBrowserXhr  {
  
    constructor(private http: Http){  }
 
  downloadFile(url){ 
  //  console.log(url)

    return this.http
    .get(url, {
      responseType: ResponseContentType.Blob      
    })
    .map(res => {
      return {
        filename: "bill.pdf",
        data: res.blob()
      };
    })
    .subscribe(res => {
      //  console.log('start download:',res);
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
     //   console.log('Completed file download.')
      });
  }
}