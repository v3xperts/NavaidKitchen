import { Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DriverService } from '../service/index';

import {OrderPipe} from "../order.pipe"
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
declare var $ : any;
declare var toastr : any;
declare var google : any;
toastr.options.timeOut = 60;


@Component({
  selector: 'app-admindriver',
  templateUrl: './admindriver.component.html',
  styles: []
})
export class AdmindriverComponent implements OnInit {
    order: string = 'firstname';
    firstname: string = 'firstname';
    driverFilter: any = { username: '' };
    reverse: boolean = false;
	  drivers= [];    


  	constructor( public driverService : DriverService) { }

  	ngOnInit() {
        this.loadAlldriver();
  	}


    public loadAlldriver() {
        this.driverService.getAll().subscribe(drivers => { 
          this.drivers = drivers.message;
          console.log(this.drivers);
          this.sortBy("created_at");
        });
    }

    public sortBy(data) {
        this.firstname = data;
        if (this.reverse == false) {
            this.reverse = true;
        }else{
            this.reverse = false;
        }
    }

     public deleteUser(id) {
      if(confirm("Are you sure to delete ?")) {
        var index = this.drivers.findIndex((item) => {
         return item._id == id;
        });
        if(index != -1){
         this.drivers.splice(index, 1);
        }
        this.driverService.deleteOnedriver(id).subscribe(data => {
                toastr.clear();
                toastr.warning('Driver Deleted Successfully.');              
         });
      }
    }

    public do_active(id, type){        
        var data = {"_id" : id, "isactivated" : type};      
        this.driverService.updateDriver(data).subscribe(dataupdate => {  
            this.loadAlldriver();
        });
        
    }


    
}



