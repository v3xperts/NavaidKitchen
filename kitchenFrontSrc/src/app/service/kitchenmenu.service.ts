import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class KitchenMenuService {
  	constructor(private http: Http) { }

    addUser(data) {
        return this.http.post(globalVariable.url2+'menu/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateMenu(data) {
        return this.http.put(globalVariable.url2+'menu/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }
    
  	getAll() {
  		return this.http.get(globalVariable.url2+'menu/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url2+'menu/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    getAlllist(id) {
      return this.http.get(globalVariable.url2+'menu-list/'+id)
        .map(
          (response: Response) => response.json()
        );
    }

    deleteOne(data) {
  		return this.http.delete(globalVariable.url2+'menu/'+data.id+'/'+data.kitchenId)
  			.map(
  				(response: Response) => response.json()
  			);
    }



}
