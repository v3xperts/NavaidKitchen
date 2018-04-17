import { Component, OnInit } from '@angular/core';
import { AlertService } from '../service/index';
declare var $ : any;

		@Component({
			moduleId: module.id,
			selector: 'alert',
			templateUrl: 'alert.component.html'
		})

		export class AlertComponent {
		message: any;
		constructor(public alertService: AlertService) { }
		ngOnInit() {
		this.message = this.alertService.getMessage();       
		if (typeof this.message != 'undefined') {
		setTimeout(()=>{   
		delete this.message;
		}, 3000);             
		}
		}
		public deleteMessage(){
		this.alertService.deleteMessage();
		}
		}
