import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class ReferralService {

  	constructor(private http: Http) { }
    
    add(data) {
        return this.http.post(globalVariable.url1+'ownerreferral/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    update(data) {      
        return this.http.put(globalVariable.url1+'ownerreferral/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(globalVariable.url1+'ownerreferral/')
  			.map(
  				(response: Response) => response.json()
  			);
    }


    getAllByRestro(id) {
      return this.http.get(globalVariable.url1+'ownerreferral-ownerlist/:id')
        .map(
          (response: Response) => response.json()
        );
    }

    getOne(id) {
          return this.http.get(globalVariable.url1+'ownerreferral/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url1+'ownerreferral/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

}
