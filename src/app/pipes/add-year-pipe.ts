import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'AddYear'
})

@Injectable()
export class AddYearPipe implements PipeTransform {
 transform(a: string) {
     if(a){
  var b =a.split("/");
  var c= b[2]+"-"+b[1]+"-"+b[0];
  var d = new Date(c)
  var e =new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()-1).toLocaleDateString();
  var f= e.split("/");
  if(f[0].length == 1) f[0] = "0"+ f[0];
  return f[1]+ "/"+ f[0]+"/"+ f[2];  
     }
     else{
         return "";
     } 
}
}