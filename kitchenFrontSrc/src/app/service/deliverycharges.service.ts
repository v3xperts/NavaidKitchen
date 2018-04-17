import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class DeliveryChargesService {  	
  	constructor(private http: Http) { }

  	getDeliveryCharges() {
  		return this.http.get(globalVariable.url+'deliverycharges')
  			.map(
  				(response: Response) => response.json()
  			);
    }

  	addDeliveryCharges(data) {
        return this.http.post(globalVariable.url+ 'deliverycharges',data)
        .map(
            (response: Response) => response.json()
        );
    }
}
