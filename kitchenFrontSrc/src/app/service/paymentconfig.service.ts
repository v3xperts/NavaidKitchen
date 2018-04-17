import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class PaymentConfigService {  	
  	constructor(private http: Http) { }

  	getKey() {
  		return this.http.get(globalVariable.url4+'stripeconfig/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

  	addKey(data) {
        return this.http.post(globalVariable.url4+ 'stripeconfig/',data)
        .map(
            (response: Response) => response.json()
        );
    }
}
