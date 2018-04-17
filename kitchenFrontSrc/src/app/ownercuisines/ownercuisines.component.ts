import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, KitchenMenuService, KitchenItemService, MasterService, KitchenService} from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr :any;
import * as globalVariable from "../global";

@Component({
	selector: 'app-weekly',
	templateUrl: './ownercuisineslist.component.html'
})

export class OwnerCuisinesComponent implements OnInit {

	restCusiObj : any = [];
	cuisinesObj :any = [];
	restid : any ;
	imageUrl : any = globalVariable.imageUrl2;
    
    
	constructor(public lf: FormBuilder, public masterService: MasterService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public kitchenService : KitchenService, public activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		  this.restid = JSON.parse(localStorage.getItem('currentOwner'))._id
		  this.getDetailOne();		 		  
	     }

		getDetail(){
			this.masterService.getAllCuisines().subscribe(data => {		
				this.cuisinesObj = data.message;
			});	
		} 
         
        getDetailOne(){
			this.kitchenService.getOne(this.restid).subscribe(data => {		
				this.restCusiObj = data.message.cuisines;				
				 this.getDetail();
			});	
		} 

		cuisinesAdd(id){
			   const index = this.restCusiObj.findIndex(item => item === id);			   
               if(index != -1){
               	this.restCusiObj.splice(index,1);               
               }else{             
               	this.restCusiObj.push(id);               
               }   
		     }

        cuisinesUpdate(){
        	var obj = {_id : this.restid, cuisines : this.restCusiObj};
            this.kitchenService.updateKitchen(obj).subscribe(data => {
                 
                 toastr.remove();
                 toastr.success("Cuisines Updated Successfully");
				//this.restCusiObj = data.message.cuisines;
			});       
         }
	}