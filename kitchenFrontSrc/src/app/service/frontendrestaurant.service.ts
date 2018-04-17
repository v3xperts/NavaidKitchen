import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class FrontendRestaurantService {

  constructor(private http: Http) { }

  getAllRestro(){
    return this.http.get(globalVariable.url1+'kitchen/')
    .map((response: Response) => response.json());
  }

  getAllOffers(){
    return this.http.get(globalVariable.url2+'offer/')
    .map((response: Response) => response.json());
  }

  getOneRestro(id){
    return this.http.get(globalVariable.url1+'kitchen/'+id)
    .map((response: Response) => response.json());
  }

  getWeeklyMenu(id){
    return this.http.get(globalVariable.url2+'weekly-list/'+id)
    .map((response: Response) => response.json());
  }

  getMonthlyMenu(id){
    return this.http.get(globalVariable.url2+'monthly-list/'+id)
    .map((response: Response) => response.json());
  }

  getOffersforRestro(id){
    return this.http.get(globalVariable.url2+'offer-list/'+id)
    .map((response: Response) => response.json());
  }

  getCombosforRestro(id){
    return this.http.get(globalVariable.url2+'combo-list/'+id)
    .map((response: Response) => response.json());
  }
    getActiveCombos(id) {
    return this.http.get(globalVariable.url2+'active-combos/'+id)
    .map(
      (response: Response) => response.json()
    );
    }   

    getActiveMealPackages(id){
    return this.http.get(globalVariable.url2+'active-mealpackages/'+id)
    .map((response: Response) => response.json());
    }


  updateFavourite(data){
    return this.http.post(globalVariable.url3+'favourite/' +data._id ,data)
    .map(
      (response: Response) => response.json()
      );
     }

  getFavourite(id){
    return this.http.get(globalVariable.url3+'favourite-list/'+id)
    .map((response: Response) => response.json());
  }


  updateFavouriteItem(data){
    return this.http.post(globalVariable.url3+'favouriteitem/' +data._id ,data)
    .map(
      (response: Response) => response.json()
      );
     }

  getFavouriteItem(id){
    return this.http.get(globalVariable.url3+'favouriteitem-list/'+id)
    .map((response: Response) => response.json());
  }


  reflactAllRest(data){
    return this.http.post(globalVariable.url1+'kitchenfilters/' ,data)
    .map((response: Response) => response.json());
      }

getAllRestaurant(str){
    return this.http.post(globalVariable.url1+'kitchenfiltersstr/', str)
    .map((response: Response) => response.json());
    }
getAllmenu(str){
    return this.http.post(globalVariable.url2+'itemfiltersstr/', str)
    .map((response: Response) => response.json());
    }
    
getAllitem(){
    return this.http.get(globalVariable.url2+'item/')
    .map((response: Response) => response.json());
    }    

getAllRestrob(data){
  console.log(data);
    return this.http.post(globalVariable.url1+'kitchenb/', data)
    .map((response: Response) => response.json());
  }

   }