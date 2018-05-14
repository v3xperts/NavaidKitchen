import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import * as globalVariable from "../global";

@Injectable()
export class TestimonialService {
  	
  	constructor(private http: Http) { }

        public getTestimonial() {
           
        return this.http.get(globalVariable.url+'testimonial/list')
        .map((response: Response) => response.json());
        }

        public addTestimonial(data) {
        return this.http.post(globalVariable.url+'testimonial/add',data)
        .map((response: Response) => response.json());
        }

        public updateTestimonial(data) {
        return this.http.put(globalVariable.url+'testimonial/'+data._id,data)
        .map((response: Response) => response.json());
        }

        public getOneTestimonial(id) {
        return this.http.get(globalVariable.url+'testimonial/'+id)
        .map((response: Response) => response.json());
        }

        public deleteTestimonial(id) {
        return this.http.delete(globalVariable.url+'testimonial/'+id)
        .map((response: Response) => response.json());
        }


    }
