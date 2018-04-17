import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class UsersService {
    constructor(private http: Http) { }

    getAdmin(id) {
      return this.http.get(globalVariable.url+'users/admin/'+id)
              .map((response: Response) => response.json());
              }
     
     getComplexity() {
      return this.http.get(globalVariable.url+'users/complexity')
              .map((response: Response) => response.json());
              } 
     
     postComplexity(data) {
        return this.http.post(globalVariable.url+'users/complexity',data)
        .map(
            (response: Response) => response.json()
        );
    }

     updateComplexity(data) {
        return this.http.put(globalVariable.url+'users/complexity/'+data._id, data)
        .map(
            (response: Response) => response.json()
        );
       }

    updateAdminSetting(data) {
        return this.http.put(globalVariable.url+'users/admin/'+data._id,data)
        .map(
            (response: Response) => response.json()
        );
    }

    addUser(data) {
        return this.http.post(globalVariable.url1+'owner/',data)
        .map(
            (response: Response) => response.json()
        );
    }

    updateAdmin(data) {
        return this.http.put(globalVariable.url+'users/admin/'+data._id,data)
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

  	getAll(){
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
  		return this.http.delete(globalVariable.url1+'owners/'+id)
  			.map(
  				(response: Response) => response.json()
  			);
    }
}
