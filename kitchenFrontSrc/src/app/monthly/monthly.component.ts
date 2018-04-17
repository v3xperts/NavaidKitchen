import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, KitchenMenuService, KitchenItemService, WeekMonthService} from '../service/index';
import {OrderPipe} from "../order.pipe"
import * as globalVariable from "../global";
declare var toastr :any;

@Component({
	selector: 'app-weekly',
	templateUrl: './monthly.component.html'
})

export class MonthlyComponent implements OnInit {
	
	weeklyAddModel :any ;
	imageUrl : any = globalVariable.imageUrl;
  datevali : any = "";


	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService) { }

	ngOnInit() {
		this.weeklyAddModel = this.lf.group({
			name: ['',Validators.required],
			daysforweek : ['',Validators.required],	
			type: [],					
			kitchenId: [],
			startdate: ['',Validators.required],
			enddate: ['',Validators.required],
      datevali: ['',Validators.required],
		});
	}

	weeklyAdd(){
		this.weeklyAddModel.controls["kitchenId"].setValue(JSON.parse(localStorage.getItem('currentOwner'))._id);
		this.weeklyAddModel.controls["type"].setValue('monthly');		
		this.weekMonthService.add(this.weeklyAddModel.value).subscribe(data => {
			toastr.remove();
			toastr.success("Package Add Successfully");			
			this.router.navigate(['/owner/monthly-dayadd',data.message._id]);
		});
	}
datecheck(){ 
if(this.weeklyAddModel.value.startdate && this.weeklyAddModel.value.enddate) {  
    if(Date.parse(this.weeklyAddModel.value.startdate) < Date.parse(this.weeklyAddModel.value.enddate)){
         this.weeklyAddModel.controls["datevali"].setValue(true); 
         this.datevali = 'has';         
    }else{
      this.weeklyAddModel.controls["datevali"].setValue("");  
      this.datevali = '';                       
    }
   }
  }
	
}




@Component({
	selector: 'app-weekly',
	templateUrl: './monthlydayadd.component.html'
})
export class MonthlyDayAddComponent implements OnInit {
	
	weeklyObj :any ;
	menus : any;
	days : any;
	daysJson : any;
	paramid : any;
	daysJsoni : any;
	items : any;
	weekdaysset : any;
	iid : any;
	imageUrl : any = globalVariable.imageUrl;

	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService, public activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.paramid = params['id'];
			this.getDetail(this.paramid);            
		});
		this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
	}

	getMenus(id){
		this.kitchenMenuService.getAlllist(id).subscribe(data => { 
			this.menus = data.message;
			//console.log(this.menus);			
			console.log(this.items);
		});        
	}

	getItems(id){
		this.kitchenMenuItemService.getAlllist(id).subscribe(data => {
			this.items = data.message;
		});
	}


	dateDiff(){	   
		var c = new Date("'"+ this.weeklyObj.startdate +"'"); // 1 Feb -> 30 Jan
		c.setDate(c.getDate() + (+this.weeklyObj.daysforweek -1));
		var weekedate = c.toISOString().slice(0,10);
		//console.log(this.weeklyObj.startdate, f);
		var fdate = this.weeklyObj.startdate;           
		var f = new Date('"'+ this.weeklyObj.startdate +'"');
		var s = new Date('"' + weekedate + '"');
		var datesarray	= this.getDates(f, s);			
		var daleng = datesarray.length;
		var dayset = []; 
		var dayJsonSet = [];
		for(var i=0; i<daleng; i++){
			var can = 'day'+(i+ 1);				
			dayset.push({"day" : can});
			dayJsonSet.push({"day": can, "menuids": []});
		}
		this.days = dayset;
		this.daysJson = dayJsonSet;	
	}

       getDates(start, end) {            
       	var datesArray = [];
       	var startDate = new Date(start);
       	while (startDate <= end) {
       		datesArray.push(new Date(startDate));
       		startDate.setDate(startDate.getDate() + 1);
       	}
       	return datesArray;
       }

       getDetail(id){
       	this.weekMonthService.getOne(id).subscribe(data => {
       		this.weeklyObj = data.message;
       		this.getItems(this.iid);				
       		this.getMenus(this.iid);
       		this.dateDiff(); 
       		//this.dayssetgenrator();			   
       	});	
       }

       addtoDay(datename, menuid, submenuid){        

       	const index = this.daysJson.findIndex(item => item.day === datename);			
       	const mindex = this.daysJson[index].menuids.findIndex(item => item.submenuid === submenuid);

       	if(mindex === -1){
       		this.daysJson[index].menuids.push({"mid": menuid, "submenuid" : submenuid});                
       	}else{
       		this.daysJson[index].menuids.splice(mindex, 1);				
       	}
       }

       onadd(){
       	var obj = {_id: this.paramid, dayandmenus: this.daysJson};
       	this.weekMonthService.update(obj).subscribe(data => {		
       		console.log();
       	});
       }

       daysJsonToUpdate(){
       	var obj = {_id: this.paramid, dayandmenus: this.daysJson};	
       	
       	this.weekMonthService.update(obj).subscribe(data => {	
       		toastr.remove();
       		toastr.success("Package Add Successfully");	

       		this.router.navigate(['/owner/monthly']);
       	});
       }
   }




   @Component({
   	selector: 'app-weekly',
   	templateUrl: './monthlydayEdit.component.html'
   })

   export class MonthlyDayEditComponent implements OnInit {
   	
   	weeklyObj :any ;
   	weeklyall : any;
   	menus : any;	
   	paramid : any; 
   	items : any;
   	weekdaysset : any;
   	iid : any;
   	imageUrl : any = globalVariable.imageUrl;

   	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService, public activatedRoute: ActivatedRoute) { }

   	ngOnInit() {
   		this.activatedRoute.params.subscribe((params: Params) => {
   			this.paramid = params['id'];
   			this.getDetail(this.paramid);            
   		});
   		this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
   	}

   	getMenus(id){
   		this.kitchenMenuService.getAlllist(id).subscribe(data => { 
   			this.menus = data.message;				
   		});        
   	}

   	getDetail(id){
   		this.weekMonthService.getOne(id).subscribe(data => {
   			this.getItems(this.iid);
   			this.weeklyObj = data.message.dayandmenus;
   			this.weeklyall = data.message;				
   			this.getMenus(this.iid);
   			//this.dayssetgenrator();				   
   		});	
   	}

   	
   /*    dayssetgenrator(){ 

           var weekset = this.weeklyObj.length;
           var weekd = this.weeklyall.daysforweek;
            
           var j = 1;
           var k = 1;

           var newweeks = [];

           for(var i =0; i<weekset; i++){           	  
              newweeks.push({"name": 'day'+j , "week": "week"+k}); 
              if(j == weekd){
                  j=1;
                  k = k+1;
              } else{
              	 j = j+1;
              }
           }
           this.weekdaysset = newweeks;
       }*/


       getItems(id){
       	this.kitchenMenuItemService.getAlllist(id).subscribe(data => {
       		this.items = data.message;
       	});
       }

       addtoDay(dayname, menuid, submenuid){
       	const index = this.weeklyObj.findIndex(item => item.day === dayname);			
       	const mindex = this.weeklyObj[index].menuids.findIndex(item => item.submenuid === submenuid);			
       	if(mindex === -1){
       		this.weeklyObj[index].menuids.push({"mid": menuid, "submenuid" : submenuid});                
       	}else{
       		this.weeklyObj[index].menuids.splice(mindex, 1);				
       	} 
       }

       onloadchecked(dayname, menuid, submenuid){
       	const index = this.weeklyObj.findIndex(item => item.day === dayname);
       	const mindex = this.weeklyObj[index].menuids.findIndex(item => item.submenuid === submenuid);			
       	if(mindex === -1){				
       		return false;
       	}else{				
       		return true;
       	} 
       }

       daysJsonToUpdate(){
       	var obj = {_id: this.paramid, dayandmenus: this.weeklyObj};			
       	this.weekMonthService.update(obj).subscribe(data => {
       		///console.log(data.message);
       		this.router.navigate(['/owner/monthly']);
       	});
       }
   }



   @Component({
   	selector: 'app-weekly',
   	templateUrl: './monthlylist.component.html'
   })
   export class MonthlyDayListComponent implements OnInit {
   	
   	weeklyObj :any ;
   	menus : any = [];	
   	paramid : any;
   	iid : any;
   	imageUrl : any = globalVariable.imageUrl;
   	addpackagebutton : any = false;


   	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService, public activatedRoute: ActivatedRoute) { }

   	ngOnInit() {
   		this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;			
   		this.getDetail(this.iid);
   		this.getMenus();
   	}
		/*getMenus(){
			this.kitchenMenuService.getAll().subscribe(data => { 
				this.menus = data.message;				
			});        
		}*/
		
		getDetail(id){
			this.weekMonthService.getAll(id).subscribe(data => {		
				this.weeklyObj = data.message;
				
				//this.getMenus();	

			});	
		}
		
		getMenus(){
			this.kitchenMenuService.getAlllist(this.iid).subscribe(data => { 
        this.menus  = data.message;
				if(data.message.length > 0){
					this.addpackagebutton = true;
				}			
			});        
		}
		

		deletePackage(id){
			if(confirm("Are you sure to delete ?")) {
				this.weekMonthService.deleteOne(id).subscribe(data => {
					toastr.remove();
					toastr.warning("Package Deleted Successfully");	
					this.getDetail(this.iid );
				});
			}
		} 
		
	}