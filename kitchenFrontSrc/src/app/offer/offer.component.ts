import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, KitchenMenuService, KitchenItemService, OfferService} from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr : any;
declare var $ : any;
toastr.options.timeOut = 60;

@Component({
	selector: 'app-weekly',
	templateUrl: './offer.component.html'
})

export class OfferComponent implements OnInit {
	constructor(){}
	ngOnInit(){}
}



@Component({
	selector: 'app-weekly',
	templateUrl: './offerlist.component.html'
})

export class OfferListComponent implements OnInit {
	
	offerObj :any = [];
    iid : any;

	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public offerService : OfferService, public activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.iid = this.activatedRoute.snapshot.params.restaurantid;
		this.getDetail(this.iid);
	}
		getDetail(id){
			this.offerService.getAll(id).subscribe(data => {		
				this.offerObj = data.message;
			});	
		}     

		deleteOffer(id){
			if(confirm("Are you sure to delete ?")) {
				this.offerService.deleteOne(id).subscribe(data => {
					toastr.remove();
			        toastr.warning('Offer Deleted Successfully.');
					this.getDetail(this.iid);
				});
			}
		} 

	}

@Component({
	selector: 'app-weekly',
	templateUrl: './offeradd.component.html'
})

export class OfferAddComponent implements OnInit {
	
	offerAddModel :any ;
	option: any;
	datevali : any = "";
    expdateaction : any = true;
    kitchenId:any;

	constructor(public activatedRoute: ActivatedRoute, public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public offerService : OfferService) { }
	ngOnInit() {
		this.kitchenId = this.activatedRoute.snapshot.params.restaurantid;
		this.offerAddModel = this.lf.group({
			name: ['',Validators.required],			
			type: ['',Validators.required],	
			percentorpricevalue : ['',Validators.required],				
			couponcode : ['',Validators.required],
			indate : [],
            expirydate : [],
            datevali: ['',Validators.required],
			kitchenId: [],
			special : []
		});

    this.offerAddModel.controls["kitchenId"].setValue(this.kitchenId);		
	//this.kitchenId = this.activatedRoute.snapshot.params.restaurantid;
	this.option = [{typename : "Percent"},{typename : "Price"}];
	var str  = this.alphanumeric_unique();
    this.offerAddModel.controls["couponcode"].setValue(str.toUpperCase());

   $(document).ready(function(){
		  $('#date1').datetimepicker({format:'YYYY-MM-DD'});
		  $('#date2').datetimepicker({format:'YYYY-MM-DD'});	  
		  });

   }

    alphanumeric_unique() {
    return Math.random().toString(36).split('').filter( function(value, index, self) { 
               return self.indexOf(value) === index;
            }).join('').substr(2,8);
    }

public getTimeData(even){
  var timeJ = even.getAttribute('id');
  let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
  if(eleObj.id == 'date1'){
  	this.offerAddModel.controls['indate'].setValue(eleObj.value);
  	if(eleObj.value != ""){
     this.expdateaction = false;
  	}
  	else{
  		this.expdateaction = true;
  	}
    }else{
    this.offerAddModel.controls['expirydate'].setValue(eleObj.value);
    }
   this.datecheck(); 
 }



datecheck(){ 
if(this.offerAddModel.value.indate && this.offerAddModel.value.expirydate) {  
    if(Date.parse(this.offerAddModel.value.indate) <= Date.parse(this.offerAddModel.value.expirydate)){
         this.offerAddModel.controls["datevali"].setValue(true); 
         this.datevali = 'has';         
    }else{
      this.offerAddModel.controls["datevali"].setValue("");  
      this.datevali = '';                       
    }
   }
  }




	offerAdd(){		
		this.offerService.add(this.offerAddModel.value).subscribe(data => {	
			toastr.remove();
			toastr.success('Offer Added Successfully.');
			this.router.navigate(['/admin/offer/list/', this.kitchenId]);
		});
	}

}




@Component({
	selector: 'app-weekly',
	templateUrl: './offerEdit.component.html'
})

export class OfferEditComponent implements OnInit {

	offerAddModel : any;		
	paramid : any;
	offerObj : any;
    option: any;
    datevali : any;    

	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public offerService : OfferService, public activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.paramid = params['id'];
			this.getDetail(this.paramid);            
		});
	   this.option = [{typename : "Percent"},{typename : "Price"}];
       this.offerAddModel = this.lf.group({
       	    _id : ['',Validators.required],
			name: ['',Validators.required],			
			type: ['',Validators.required],	
			percentorpricevalue : ['',Validators.required],				
			couponcode : ['',Validators.required],
			indate : ['',Validators.required],
            expirydate : ['',Validators.required],
			kitchenId: [],
			special : []			
		});

        $(document).ready(function(){
		  $('#date1').datetimepicker({format:'YYYY-MM-DD'});
		  $('#date2').datetimepicker({format:'YYYY-MM-DD'});	  
		  });

	}

   getDetail(id){
		this.offerService.getOne(id).subscribe(data => {			
			this.offerObj = data.message;
			this.offerAddModel.patchValue(this.offerObj);											 				   
		});	
	}

public getTimeData(even){
  var timeJ = even.getAttribute('id');
  let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
  if(eleObj.id == 'date1'){
  	this.offerAddModel.controls['indate'].setValue(eleObj.value);
    }else{
    this.offerAddModel.controls['expirydate'].setValue(eleObj.value);
    }
   this.datecheck(); 
 }



public datecheck(){ 
	console.log(this.offerAddModel.value);
if(this.offerAddModel.value.indate && this.offerAddModel.value.expirydate) {  
    if(Date.parse(this.offerAddModel.value.indate) < Date.parse(this.offerAddModel.value.expirydate)){
         //this.offerAddModel.controls["datevali"].setValue(true);          
         this.datevali = 'has';         
    }else{
      //this.offerAddModel.controls["datevali"].setValue("");  
      this.datevali = '';                       
    }
   }
  }

	offerEditUpdate(){		
		this.offerService.update(this.offerAddModel.value).subscribe(data => {
		    toastr.remove();
			toastr.info('Offer Update Successfully.');	
			this.router.navigate(['/admin/offer/list/',this.offerObj.kitchenId]);
		});
	}

}

