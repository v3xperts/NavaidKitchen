import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class SlidesService {

  	constructor(private http: Http) { }
    
    add(data) {
        return this.http.post(globalVariable.url+'slides/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    update(data) {      
        return this.http.put(globalVariable.url+'slides/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(globalVariable.url+'slides/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url+'slides/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url+'slides/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

}
