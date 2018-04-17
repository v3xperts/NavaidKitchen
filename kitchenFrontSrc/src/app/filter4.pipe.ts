
import { Pipe, Injectable } from '@angular/core';

@Pipe({
  name: 'SearchPipeRestaurant'
})

@Injectable()
export class SearchPipeRestaurant {    
  transform(items: any[], filter: string) {    
    if(!items || !filter) {
      return items;
    }
     return items.filter((item) => {return JSON.stringify(item.restaurantname).toLowerCase().indexOf(filter.toLowerCase()) !== -1; });
  }
}