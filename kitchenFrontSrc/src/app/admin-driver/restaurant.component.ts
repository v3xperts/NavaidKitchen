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
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styles: []
})
export class DriverRestaurantComponent implements OnInit {
    firstname: string = 'firstname';
    driverFilter: any = { username: '' };
    reverse: boolean = false;
	  drivers: any;
    pendingKitchens = []; 
    approveKitchens = []; 
    id:any;   
    pendingReq = [];
    approveReq = [];

  	constructor( 
      public driverService : DriverService,
       public activatedRoute: ActivatedRoute)  { }

  	ngOnInit() {
          this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            this.getDriver(this.id);
        });
  	}

    update(id){
      let index = this.drivers.kitchensallow.findIndex((item) => {return item.resId == id});
      let tempObj = this.drivers.kitchensallow[index];
      tempObj.status = true
      this.drivers.kitchensallow[index] = tempObj;
      console.log(this.drivers)
      this.driverService.updateDriver(this.drivers).subscribe(
          (users) => 
          { 
            this.getDriver(this.drivers._id);
          }
      );
    }

    public getDriver(id) {
        this.driverService.getOnedriver(id).subscribe(drivers => { 
          console.log("drivers fi", drivers)
          this.drivers = drivers.message; 
          this.pendingReq = []
          this.approveReq = []
          
          if(this.drivers.kitchensallow.length > 0){
          for (var i = 0; i < this.drivers.kitchensallow.length; i++) {
            if (!this.drivers.kitchensallow[i]['status']) {
              this.pendingReq.push(this.drivers.kitchensallow[i].resId);
            }else{
              this.approveReq.push(this.drivers.kitchensallow[i].resId);
            }
          }
          this.loadAllApproveRestaurant();
          this.loadAllPendingRestaurant();
          }
          
          console.log(this.pendingReq)
          console.log(this.drivers)


            // this.userAddModel.controls['firstname'].setValue(this.users.firstname);
        });
    }

      public loadAllPendingRestaurant() {
        console.log("this.pendingReq", this.pendingReq)
      let obj = { 'rids': this.pendingReq }
          this.pendingKitchens = [];
          if(this.pendingReq.length > 0){
          this.driverService.getSelectedRestaurant(obj).subscribe((users) => { 
              console.log("cfvcvc", users.message);
              this.pendingKitchens = users.message; 
          });
          }
    }

      public loadAllApproveRestaurant() {
          let obj1 = {'rids':this.approveReq};
          this.driverService.getSelectedRestaurant(obj1).subscribe((users) => { 
              this.approveKitchens = users.message; 
              this.loadAllPendingRestaurant();
          });
    }

   
      

    
}



