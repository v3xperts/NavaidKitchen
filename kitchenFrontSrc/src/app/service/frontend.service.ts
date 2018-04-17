import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class FrontendService {
  constructor(private http: Http) { }

// Admin customer
   getAll() {
    return this.http.get(globalVariable.url3+'customers/')
    .map(
      (response: Response) => response.json()
      );
      }

   deleteOnecustomer(id) {
      return this.http.delete(globalVariable.url3+'customers/'+id)
        .map((response: Response) => response.json());
    }


// ld
  addCustomer(data) {
    return this.http.post(globalVariable.url3+'customers/signup/',data)
    .map(
      (response: Response) => response.json()
      );
  }

  updateFrontend(data) {
    return this.http.put(globalVariable.url3+'customers/' +data._id ,data)
    .map(
      (response: Response) => response.json()
      );
  }

  getOneCust(id) {
    return this.http.get(globalVariable.url3+'customers/'+id)
    .map(
      (response: Response) => response.json()
      );
     }

   getMultipleCust(data) {
    return this.http.post(globalVariable.url3+'customers/multiple', data)
    .map(
      (response: Response) => response.json()
      );
  }

  updateCustomerPassword(data) {
    return this.http.put(globalVariable.url3+'customers/change-password/'+data._id,data)
    .map(
      (response: Response) => response.json()
      );
  }

  updateReferralPoint(data) {
    return this.http.put(globalVariable.url3+'customers/referralpoint/'+data._id,data)
    .map(
      (response: Response) => response.json()
      );
  } 

  updateCustAddress(id, data){
    return this.http.post(globalVariable.url3+'customer-address/'+id,data)
    .map(
      (response: Response) => response.json()
      );
  }

   removeCustAddress(data){
    return this.http.put(globalVariable.url3+'customer-address/'+data._id,data)
    .map(
      (response: Response) => response.json()
      );
    }

   sendContactQuery(data){
     return this.http.post(globalVariable.url3+'contactus/',data)
    .map(
      (response: Response) => response.json()
      );
   }

   getCityLatLng(city){
     return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+city+"&sensor=false").map((response: Response) => response.json());
   }

   getCountryName(){
      return this.http.get("http://freegeoip.net/json/").map((response: Response) => response.json());
     
   }

}