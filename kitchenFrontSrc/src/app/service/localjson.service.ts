import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';


///Service class to call REST API
@Injectable()
export class LocalJsonService {
    constructor(private http: Http) {
    }

      getCurrencyJson = (): Observable<Response> => {        
        return this.http.get('../assets/json/currency.json').map(
        	res =>  res.json()            
           );
    }


}