import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  	message: any;
  	constructor() {}

  	success(message: string, keepAfterNavigationChange = false) {
  		this.message = { type: 'success', text: message };
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.message = { type: 'error', text: message };
    }

    getMessage() {
        return this.message;
    }
    deleteMessage() {      
        delete this.message;
    }
    
}
