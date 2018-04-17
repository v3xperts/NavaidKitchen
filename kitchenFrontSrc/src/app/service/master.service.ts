import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class MasterService {
  	
  	constructor(private http: Http) { }

    addCountry(data) {
        return this.http.post(globalVariable.url+'country/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    checkCountry(data) {
        return this.http.post(globalVariable.url+'countrycheck/',data)
        .map(
            (response: Response) => response.json()
        );
    }


    updateCountry(data) {
        return this.http.put(globalVariable.url+'country/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

 updateCountryOne(data) {
        return this.http.put(globalVariable.url+'country-update/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

    getAllCountry() {
          return this.http.get(globalVariable.url+'country/')
              .map(
                  (response: Response) => response.json()
              );
    }

    getOneCountry(id) {
          return this.http.get(globalVariable.url+'country/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOneCountry(id) {
          return this.http.delete(globalVariable.url+'country/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

      addCity(data) {
        return this.http.post(globalVariable.url+'city/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateCity(data) {
        return this.http.put(globalVariable.url+'city/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

      getAllCity() {
          return this.http.get(globalVariable.url+'city/')
              .map(
                  (response: Response) => response.json()
              );
    }

    getOneCity(id) {
          return this.http.get(globalVariable.url+'city/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOneCity(id) {
          return this.http.delete(globalVariable.url+'city/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

  	addLanguage(data) {
        return this.http.post(globalVariable.url+'language/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateLanguage(data) {
        return this.http.put(globalVariable.url+'language/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

  	getAllLanguage() {
  		return this.http.get(globalVariable.url+'language/')
  			.map(
  				(response: Response) => response.json()
  			);
    }

    getOneLanguage(id) {
          return this.http.get(globalVariable.url+'language/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    deleteOneLanguage(id) {
  		return this.http.delete(globalVariable.url+'language/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }

    addCuisines(data) {
        return this.http.post(globalVariable.url+'cuisines/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateCuisines(data) {
        return this.http.put(globalVariable.url+'cuisines/'+data._id,data)
        .map((response: Response) => response.json());
      }

    getAllCuisines() {
      return this.http.get(globalVariable.url+'cuisines/')
        .map(
          (response: Response) => response.json()
        );
    }

    getOneCuisines(id) {
          return this.http.get(globalVariable.url+'cuisines/'+id)
              .map(
                  (response: Response) => response.json()
              );
    }

    getOneCuisinesmultiple(data) {
          return this.http.post(globalVariable.url+'cuisines/multiple',data)
              .map(
                  (response: Response) => response.json()
              );
             }

    deleteOneCuisines(id) {
      return this.http.delete(globalVariable.url+'cuisines/'+id)
        .map(
          (response: Response) => response.json()
        );
    }
    


    getCountrylist(){
            return this.http.get(globalVariable.url+'countrylist')
              .map(
                  (response: Response) => response.json()
              );
    } 

    getcitylist(data){
            return this.http.post(globalVariable.url+'getcitylist',data)
              .map(
                  (response: Response) => response.json()
              );
        }  

    getIdByCountry(data){
      console.log(data);
       return this.http.post(globalVariable.url+'getcountryid',data)
              .map(
                  (response: Response) => response.json()
              );
    }    
}
