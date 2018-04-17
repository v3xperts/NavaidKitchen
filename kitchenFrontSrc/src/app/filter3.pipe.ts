
import { Pipe, Injectable } from '@angular/core';

@Pipe({
  name: 'SearchPipek'
})

@Injectable()
export class SearchPipek {    
  transform(items: any[], filter: string) {    
    if(!items || !filter) {
      return items;
    }
     return items.filter((item) => {return JSON.stringify([item.restaurantname,item.ownerId.ownerfirstname,item.ownerId.ownerlastname]).toLowerCase().indexOf(filter.toLowerCase()) !== -1; });
  }
}