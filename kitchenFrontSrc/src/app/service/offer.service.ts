import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class OfferService {

  	constructor(private http: Http) { }
    
    add(data) {
        return this.http.post(globalVariable.url2+'offer/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    update(data) {      
        return this.http.put(globalVariable.url2+'offer/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll(id) {
  		return this.http.get(globalVariable.url2+'offer-list/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url2+'offer/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    redeemCoupanCode(data) {
          return this.http.post(globalVariable.url2+'offer/redeem', data)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url2+'offer/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

}
