import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as globalVariable from "../global";

@Injectable()
export class AuthService {  	
    constructor(private http: Http) { }
    
    getUser(data){
          return this.http.post(globalVariable.url+'users/login', data,{withCredentials:true})
              .map((response: Response) => {
                      let user = response.json();
                      return user;
                });
    }

    getOwner(data){
      return this.http.post(globalVariable.url1+'login', data)
        .map((response: Response) => {
            let user = response.json();
            console.log(user);
            return user;            
                });
  }

	getFrontend(data){
  		return this.http.post(globalVariable.url3 + 'customers/login', data)
  			.map((response: Response) => {
  					let user = response.json();
            return user;
  					
                });
	}

    ownerLogout() {
      localStorage.removeItem('currentOwner');
    }

  	logout() {
        localStorage.removeItem('currentUser');
    }

  	getStatus(){
  		return this.http.get(globalVariable.url+'status');
	}
  forgetPasswordAdmin(data){
      return this.http.post(globalVariable.url+'users/forget-password', data)
              .map((response: Response) => {
                      let user = response.json();
                    return user;
                });
  }
  resetAdminPassword(id,data){

      return this.http.put(globalVariable.url+'users/admin/'+id, data)
              .map((response: Response) => {
                      let user = response.json();
                    return user;
                }); 
  }
  forgetPassword(data){
      return this.http.post(globalVariable.url1+'owner/forget-password', data)
              .map((response: Response) => {
                      let user = response.json();
                    return user;
                });
  }
  resetPassword(id,data){

      return this.http.put(globalVariable.url1+'owner/'+id, data)
              .map((response: Response) => {
                      let user = response.json();
                    return user;
                }); 
  }
  forgetPasswordFrontend(data){
    return this.http.post(globalVariable.url3+'customers/forget-password', data)
            .map((response: Response) => {
                    let user = response.json();                  
                  return user;
              });
  }
  resetPasswordFrontend(id,data){
      return this.http.put(globalVariable.url3 +'customers/'+ id, data)
              .map((response: Response) => {
                      let user = response.json();
                    return user;
                }); 
  }
  customerlogout(){
    localStorage.removeItem('currentCustomer');
  }
}
