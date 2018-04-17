import { Component, OnInit } from '@angular/core';
import { KitchenService} from '../service/index';
@Component({
  selector: 'app-kitchen-driver',
  templateUrl: './kitchen-driver.component.html',
  styleUrls: ['./kitchen-driver.component.css']
})
export class KitchenDriverComponent implements OnInit {

  constructor( ) { }

  ngOnInit() {

  }

}

@Component({
  selector: 'app-kitchen-driverlist',
  templateUrl: './kitchen-driverlist.component.html',
  styleUrls: ['./kitchen-driver.component.css']
})
export class KitchenDriverListComponent implements OnInit {
  ownerinfo:any;
  drivers : any = [];

  constructor(public kitchenService: KitchenService) { 
  this.ownerinfo = JSON.parse(localStorage.getItem('currentOwner'));}
  
  ngOnInit() {
  	this.getAllDrivers();
  }

  getAllDrivers(){
  	this.kitchenService.getAllDrivers().subscribe((data) => {
  		var dlist = data.message;
  		var drivers = [];
  		dlist.forEach((d,i) => {
  			var index = dlist[i].kitchensallow.findIndex((item) => {
	  			return item.resId == this.ownerinfo._id && item.status == true;  
	  			});		
	  		if(index != -1){
             drivers.push(d);
	  		}
  		});  	
  		this.drivers = drivers;
  		console.log("driver", this.drivers);
  	});
  }

}
