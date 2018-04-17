import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class DriverService {
  	constructor(private http: Http) { }
    

  




    /* Start New Seprate Admin driver Portation */
    
    getAll() {
      return this.http.get(globalVariable.url1+'driver/')
        .map((response: Response) => response.json());
    }

    addnewdriver(data) {
        return this.http.post(globalVariable.url1 + 'driver/',data)
        .map((response: Response) => response.json());
    }

    getAllRestaurant() {
      return this.http.get(globalVariable.url1+'kitchen')
        .map(
          (response: Response) => response.json()
        );
    }

    getSelectedRestaurant(data) {
      return this.http.post(globalVariable.url1+'owners/getrestaurantsdetail',data)
        .map(
          (response: Response) => response.json()
        );
    }

    deleteOnedriver(id) {
      return this.http.delete(globalVariable.url1+'driver/'+id)
        .map((response: Response) => response.json());
    }

    Uniqueuser(username) {
          return this.http.get(globalVariable.url1+'driver/username/'+username)
              .map((response: Response) => response.json());
            }

    Uniqueemail(email) {
      return this.http.get(globalVariable.url1+'driver/email/'+email)
      .map((response: Response) => response.json());
    }

    updateDriver(data) {
        return this.http.put(globalVariable.url1+'driver/'+data._id,data)
        .map((response: Response) => response.json());
    }  

    getOnedriver(id) {
          return this.http.get(globalVariable.url1+'driver/'+id)
              .map((response: Response) => response.json());
            }

}
