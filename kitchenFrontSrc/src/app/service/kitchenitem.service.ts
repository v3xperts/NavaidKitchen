import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class KitchenItemService {
  	constructor(private http: Http) { }

    addUser(data) {
        return this.http.post(globalVariable.url2+'item/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateMenu(data) {
        return this.http.put(globalVariable.url2+'item/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }
    
  	getAll() {
  		return this.http.get(globalVariable.url2+'item/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getAlllist(id) {
      return this.http.get(globalVariable.url2+'item-list/'+id)
        .map(
          (response: Response) => response.json()
        );
    }

    getOne(id) {
          return this.http.get(globalVariable.url2+'item/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url2+'item/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getActiveItems(id) {
      return this.http.get(globalVariable.url2+'active-items/'+id)
        .map(
          (response: Response) => response.json()
        );
    }
}
