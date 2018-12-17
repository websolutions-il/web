import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
 transform(items: any[], field: string, value: string): any[] {
   if (!items) return [];
   if(value == 'all') 
   {    
    return items;
   }
   return items.filter(it => it[field] == value);
 }
}