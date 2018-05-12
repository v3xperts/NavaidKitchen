import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class OrderService {

  	constructor(private http: Http) { }
    
    add(data) {
        return this.http.post(globalVariable.url4+'order/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    update(data) {      
        return this.http.put(globalVariable.url4+'order/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAllCustomerOrder(cid) {
      return this.http.get(globalVariable.url4+'customerorder/'+ cid)
          .map(
          (response: Response) => response.json()
          );
      }

      getAllRestaurantsOrder(rid) {
      return this.http.get(globalVariable.url4+'restaurantorders/'+rid)
        .map(
        (response: Response) => response.json()
        );
      }

    getOne(id) {
          return this.http.get(globalVariable.url4+'order/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url4+'order/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
       }



    cardPayment(data) {
      
      return this.http.post(globalVariable.url4+'charge/', data)
        .map(
          (response: Response) => response.json()
        );
    }




}
