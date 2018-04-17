import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class IntroService {

  	constructor(private http: Http) { }
    
    add(data) {
        return this.http.post(globalVariable.url+'intro/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    update(data) {      
        return this.http.put(globalVariable.url+'intro/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(globalVariable.url+'intro/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url+'intro/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url+'intro/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

}
