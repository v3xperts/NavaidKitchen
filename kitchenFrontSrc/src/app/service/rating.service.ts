import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";


@Injectable()
export class RatingService {
  	constructor(private http: Http) { }
    add(data) {
        return this.http.post(globalVariable.url4+'rating/',data)
        .map(
        (response: Response) => response.json()
        );
    }

    update(data) {      
        return this.http.put(globalVariable.url4+'rating/'+data._id,data)
        .map(
        (response: Response) => response.json()
        );
    }
    getAll(id) {
        return this.http.get(globalVariable.url4+'rating/'+id)
        .map(
        (response: Response) => response.json()
        );
        }

    getOne(id) {
        return this.http.get(globalVariable.url4+'rating/'+id)
        .map(
        (response: Response) => response.json()
        );
    }

    deleteOne(id) {
        return this.http.delete(globalVariable.url4+'rating/'+id)
        .map(
        (response: Response) => response.json()
        );
    }

     checkRestroRating(data) {
        return this.http.post(globalVariable.url4+'rating/checkrating', data)
        .map(
        (response: Response) => response.json()
        );
    } 

    getAllRestroRating() {
        return this.http.get(globalVariable.url4+'rating/restroavg')
        .map(
        (response: Response) => response.json()
        );
    }

    getICPRating(id) {
        return this.http.get(globalVariable.url4+'rating/restaurant-rating/'+id)
        .map((response: Response) => response.json());
    }

    getReviewRating(id) {
        return this.http.get(globalVariable.url4+'rating/restaurant-rating-review/'+id)
        .map((response: Response) => response.json());
    }

    getCustomerRating(id) {
        return this.http.get(globalVariable.url4+'rating/customer-rating/'+id)
        .map((response: Response) => response.json());
    }

    getOrderRating(id) {
        return this.http.get(globalVariable.url4+'rating/orderrating/'+id)
        .map((response: Response) => response.json());
    }

}
