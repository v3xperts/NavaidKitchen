
import { Pipe, Injectable } from '@angular/core';

@Pipe({
  name: 'SearchPipe'
})

@Injectable()
export class SearchPipe {    
  transform(items: any[], filter: string) {    
    if(!items || !filter) {
      return items;
    }
     return items.filter((item) => {return JSON.stringify(item).toLowerCase().indexOf(filter.toLowerCase()) !== -1; });
  }
}