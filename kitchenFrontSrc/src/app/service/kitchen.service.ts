import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class KitchenService {
  	constructor(private http: Http) { }
    

    addUser(data) {
        return this.http.post(globalVariable.url1+'kitchen/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    addOwner(data) {
        return this.http.post(globalVariable.url1+'owner/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    disableKitchen(data) {
        return this.http.put(globalVariable.url1+'owners/disable-all/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateUser(data) {
        return this.http.put(globalVariable.url1+'owner/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }
    
    updateOwnerPassword(data) {
        return this.http.put(globalVariable.url1+'change-password/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateKitchen(data) {
        return this.http.put(globalVariable.url1+'kitchen/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAll() {
  		return this.http.get(globalVariable.url1+'kitchen/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOne(id) {
          return this.http.get(globalVariable.url1+'kitchen/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOne(id) {
  		return this.http.delete(globalVariable.url1+'kitchen/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

    orderMail(data) {
        return this.http.post(globalVariable.url1+'order-email',data)
        .map(
            (response: Response) => response.json()
        );
    }

    orderCancelMail(data) {
        return this.http.post(globalVariable.url1+'order-cancel-email',data)
        .map(
            (response: Response) => response.json()
        );
    }




    /* Start New Seprate Owner Portation */
    
    getAllNewOwner() {
      return this.http.get(globalVariable.url1+'owners/')
        .map((response: Response) => response.json());
    }
    addUserNewOwner(data) {
        return this.http.post(globalVariable.url1 + 'owners/add-admin/',data)
        .map((response: Response) => response.json());
    }
    addNewOwner(data) {
        return this.http.post(globalVariable.url1 + 'owners/',data)
        .map((response: Response) => response.json());
    }
    updateUserNewOwner(data) {
        return this.http.put(globalVariable.url1+'owners/'+data._id,data)
        .map((response: Response) => response.json());
    }    
    getOneNewOwner(id) {
          return this.http.get(globalVariable.url1+'owners/'+id)
              .map((response: Response) => response.json());
            }
    deleteOneNewOwner(id) {
      return this.http.delete(globalVariable.url1+'owners/'+id)
        .map((response: Response) => response.json());
    }

   /* End New Seprate Partner Portation */
    addPartner(data) {
        return this.http.post(globalVariable.url1 + 'owners/partner',data)
        .map((response: Response) => response.json());
    }
    updatePartner(id,data) {
        return this.http.put(globalVariable.url1+'owners/partner/'+id, data)
        .map((response: Response) => response.json());
    }  

    allPartner(id){      
     return this.http.get(globalVariable.url1+'owners/partner/'+id)
        .map((response: Response) => response.json());
    }

    getOnePartner(id){      
     return this.http.get(globalVariable.url1+'owners/partner-detail/'+id)
        .map((response: Response) => response.json());
    }
     
   deletePartner(id) {
      return this.http.delete(globalVariable.url1+'owners/partner/'+id)
        .map((response: Response) => response.json());
    }

   getRestaurantsDetail(data){      
     return this.http.post(globalVariable.url1+'owners/getrestaurantsdetail/', data)
        .map((response: Response) => response.json());
    }   


    getAllDrivers() {
    return this.http.get(globalVariable.url1+'driver/')
    .map((response: Response) => response.json());
    }   

    getAllKitchenheatmap() {
    return this.http.get(globalVariable.url1+'heatmaplatlng/')
    .map((response: Response) => response.json());
    } 

    getBussinessAmount() {
      return this.http.get(globalVariable.url4+'orderbussiness/')
        .map((response: Response) => response.json());
    } 

}
