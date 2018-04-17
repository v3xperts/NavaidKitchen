import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class WeekMonthService {

  	constructor(private http: Http) { }
    
    add(data) {
        return this.http.post(globalVariable.url2+'weekmonth/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    update(data) {      
        return this.http.put(globalVariable.url2+'weekmonth/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll(id) {
  		return this.http.get(globalVariable.url2+'weekmonth-list/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url2+'weekmonth/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url2+'weekmonth/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

}
