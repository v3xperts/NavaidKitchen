import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder,FormControl,FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, KitchenMenuService, KitchenItemService, WeekMonthService, ComboService, KitchenService} from '../service/index';
import { FileUploader } from 'ng2-file-upload';
import {OrderPipe} from "../order.pipe"
import * as globalVariable from "../global";
declare var $ : any;

@Component({
	selector: 'app-weekly',
	templateUrl: './weekly.component.html'
})

export class WeeklyComponent implements OnInit {

   
	weeklyAddModel :any = FormGroup;
    weeklyAddModelFlex:any = FormGroup;
	imageUrl : any = globalVariable.imageUrl;
    datevali : any = "";
	date1 : any;
	date2 : any;
	acttype: any;
    type:any;
    datedifferror :any = false;
    typepercent : any = 'flexible';	   
    restaurantsdetail:any;

	constructor(private kitchenService: KitchenService, public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService) { }

	ngOnInit(){  
    if(localStorage.getItem('currentOwner')){
    	var detail = JSON.parse(localStorage.getItem('currentOwner'));
    	this.getOneKitchen(detail._id);
    }		
	

		/*
		let valiname:any = this.typepercent == 'fixed';
		let discountFormGroup: FormGroup = new FormGroup({});
		let controld: FormControl = new FormControl(valiname, [
		Validators.required,
		Validators.min(0)      
		]);
       discountFormGroup.addControl(valiname, controld);
		*/

			this.weeklyAddModel = this.lf.group({
			name: ['',Validators.required],
			description: [''],
			kitchenId: [''],
			startdate: ['',Validators.required],			
			enddate: ['',Validators.required],
			datevali: ['',Validators.required],
			daysvali: ['',Validators.required]			
			});

			this.weeklyAddModelFlex = this.lf.group({
			name: ['', Validators.required],
			description: ['',Validators.required],
			kitchenId: [''],
			discount: ['']			
			});	

				

	}
   
 public getOneKitchen(id){
           this.kitchenService.getOne(id).subscribe((data) => {
                this.restaurantsdetail = data.message;
                console.log("redd",  data);
                this.datePickerEnable();
           });
     }



	   public datePickerEnable(){
	   	setTimeout(()=> {
		    var mind = new Date();
            var tmind = mind.setDate(mind.getDate() + +this.restaurantsdetail.mealpackageallowdays);		
			$('#date1').datetimepicker({format:'YYYY-MM-DD', minDate: tmind});
			$('#date2').datetimepicker({format:'YYYY-MM-DD', minDate: tmind});
			$('#date1').val('');
			$('#date2').val('');
			}, 1000);
	   }


		public getTimeData(even){
		  var timeJ = even.getAttribute('id');
		  let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
		  if(eleObj.id == 'date1'){
		  	this.weeklyAddModel.controls['startdate'].setValue(eleObj.value);
		    }else{
		    this.weeklyAddModel.controls['enddate'].setValue(eleObj.value);
		    }
		    this.datecheck(); 
		 }


		public newvalue(type){
			this.acttype = type;
		}

		public settype(type){			
			this.datePickerEnable();
			this.weeklyAddModel.reset();
			this.weeklyAddModelFlex.reset();
			var timeJ = type.getAttribute('id');
			let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
			//this.weeklyAddModel.controls["type"].setValue(eleObj.value); 
			this.typepercent = eleObj.value;
			console.log(this.typepercent);
			if(this.typepercent == 'fixed'){
			this.datecheck();
			}
		}

		public datecheck(){
		if(this.weeklyAddModel.value.startdate && this.weeklyAddModel.value.enddate) {	
			if(Date.parse(this.weeklyAddModel.value.startdate) <= Date.parse(this.weeklyAddModel.value.enddate)){
			this.weeklyAddModel.controls["datevali"].setValue(true); 
			this.datevali = 'has';   
			var remainingDays = this.dateDiffInDays(this.weeklyAddModel.value.startdate, this.weeklyAddModel.value.enddate);
			if(this.typepercent == "flexible" && remainingDays > 7){  				
			this.datevali = '';        
			this.datedifferror = true; 
			}else{				
			this.datedifferror = false; 
			this.weeklyAddModel.controls["daysvali"].setValue(false);    
			}
			}else{		    
			this.weeklyAddModel.controls["datevali"].setValue("");  
			this.datevali = '';                       
 			}
            }
            }


	public dateDiffInDays(x, y) {
			var _MS_PER_DAY = 1000 * 60 * 60 * 24;
			var a    = new Date(x);
			var b    = new Date(y); 	  
			var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
			return Math.floor((utc2 - utc1) / _MS_PER_DAY);
			}


			public weeklyAdd(){
			console.log("weekly add", this.typepercent);			
			var data = {};
		    if(this.typepercent == 'fixed'){
				data = this.weeklyAddModel.value;
		    }else{
		    	data = this.weeklyAddModelFlex.value;
		    }

		    data["kitchenId"] = JSON.parse(localStorage.getItem('currentOwner'))._id;
			data["type"] = this.typepercent;
		    console.log("data",this.typepercent, data)

			this.weekMonthService.add(data).subscribe((item) => {
			console.log("item", item);
			this.router.navigate(['/owner/weekly-dayadd', item.message.type, item.message._id]);
			});

	}


}




@Component({
	selector: 'app-weekly',
	templateUrl: './weeklydayadd.component.html'
})

export class WeeklyDayAddComponent implements OnInit {
    file_type : any = false;
	weeklyAddModelList: FormGroup;
	weeklyObj :any ;
	menus : any;
	days : any;
	daysJson : any;
	paramid : any;
	daysJsoni : any;
	items : any;
    iid : any;
    imageUrl : any = globalVariable.imageUrl;
    type:any;
    datepipe: any;
    packageprice : any;
    totalprice : any;
    progress: any;
    public uploader:FileUploader = new FileUploader({url: globalVariable.imageUrlupload,allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG' ]});
    comboObj:any =  [];
    comboObjlist :any = [] 
  	packageType: any;
	daysName:any =  [{name:"sunday", "serial":1},
   				{name:"monday", "serial":2},
   				{name:"tuesday", "serial":3},
  				{name:"wednesday", "serial":4},
   				{name:"thursday", "serial":5},
			    {name:"friday", "serial":6},
    			{name:"saturday","serial":7}];
	restaurantDetail :any = JSON.parse(localStorage.getItem('currentOwner'));


	constructor(public lf: FormBuilder, public comboService : ComboService,  public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService, public activatedRoute: ActivatedRoute) {
        this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
		this.activatedRoute.params.subscribe((params: Params) => {		     
			this.paramid = params['id'];
			this.packageType = params['type'];
			if(params['type'] == "flexible"){
            this.datepipe = 'EEEE';            
			}
			if(params['type'] == "fixed"){
			this.datepipe = 'fullDate';
			}	
			this.getDetail(this.paramid);            
		}); 
	   this.getDetailCombo(this.iid);
      }

	ngOnInit() {

			var patternq = /^[+]?\d+(\.\d+)?$/;    
			this.weeklyAddModelList = this.lf.group({
			      image : ['', Validators.required],
			      packageprice: ['', [Validators.required,Validators.pattern(patternq)]],
			      totalprice: ['', Validators.required]			      
			});
  
  			this.weeklyAddModelList.valueChanges
			.subscribe(data => this.onValueChanged(data));
			this.onValueChanged();

	    }


			onValueChanged(data?: any) {
			if (!this.weeklyAddModelList) {return; }
			const form = this.weeklyAddModelList;
			for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);      
			if (control && control.dirty && !control.valid) {
			    const messages = this.validationMessages[field];
			    for (const key in control.errors) {
			        this.formErrors[field] += messages[key] + ' ';          
			    }
			}
			}
			}

	formErrors = {
        'packageprice': '',            
        'comboprice': ''            
    };

    validationMessages = {
        'packageprice': {
        	"required" : "Required price only Non-Negative!",
            'pattern'  : 'Required price only Non-Negative!'
        },
        'comboprice': {
        	"required" : "Required price only Non-Negative!",
            'pattern'  : 'Required price only Non-Negative!'
        }          
    };


	public getMenus(id){
		this.kitchenMenuService.getAlllist(id).subscribe(data => { 
			this.menus = data.message;
		}); 
	  }
   
   public addCombo(combo){
   	var index = this.comboObjlist.findIndex((item) => item._id == combo._id);
   	if(index == -1){
    this.comboObjlist.push(JSON.parse(JSON.stringify(combo)));
    this.calculateCombo(); 
   	}else{
    this.comboObjlist.splice(index,1);
    this.calculateCombo(); 
   	} 
   }

  public calculateCombo(){   	
    var qtyarray = this.comboObjlist.map(function(a) {return a.finalcomboprice}); 
	var qtysum = qtyarray.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);    
    this.weeklyAddModelList.controls['comboprice'].setValue(qtysum);
    
   }

   public getDetailCombo(id){
		this.comboService.getAll(id).subscribe(data => {		    	
			this.comboObj = data.message;
			});	
	    } 

   public onChange(event) {
    if(event.target.files.length > 0){    
    var extarray = ["jpeg","jpg","png","JPEG","JPG","PNG"];
        var files = event.target.files;
        var farr = files[0].name.split(".");
        var ext = farr[farr.length - 1];        
        if(extarray.indexOf(ext) != -1){
        this.file_type = false;
        this.weeklyAddModelList.controls['image'].setValue(files[0].name);
        }else{
        this.file_type = true;
        this.weeklyAddModelList.controls['image'].setValue("");
      	}}
        }

   public totalPrice(){
   		this.weeklyAddModelList.value.totalprice = 0;
		for(var i=0; i<this.daysJson.length; i++){    
		var qtyarray = this.daysJson[i].menuids.map(function(a) {return a.price * a.qty;}); 
		var qtysum = qtyarray.reduce((a, b) => a + b, 0);	
		var value1 = parseFloat(this.weeklyAddModelList.value.totalprice) + parseFloat(qtysum);
		var value2 = (Math.round(value1 * 100) / 100);
		this.weeklyAddModelList.controls["totalprice"].setValue(value2);
		this.weeklyAddModelList.controls["packageprice"].setValue(value2);
	 } 
    }

    public getItems(id){
    	this.kitchenMenuItemService.getAlllist(id).subscribe((data) =>{
    		this.items = data.message;
    	 });
        }
	
	public dateDiff(){			
		var f = new Date(this.weeklyObj.startdate );
		var s = new Date(this.weeklyObj.enddate);
		var datesarray	= this.getDates(f, s);			
		var daleng = datesarray.length;
		var dayset = []; 
		var dayJsonSet = [];
		for(var i=0; i<daleng; i++){
			var can = datesarray[i].toLocaleDateString();				
			dayset.push({"date" : can});
			dayJsonSet.push({"date": can, "menuids": []});
		}
		this.days = dayset;		
		this.daysJson = JSON.parse(JSON.stringify(dayJsonSet));			
		this.onadd();
	    }


	public getDates(start, end) { 
		var datesArray = [];
		var startDate = new Date(start);
		while (startDate <= end) {
		datesArray.push(new Date(startDate));
	    startDate.setDate(startDate.getDate() + 1);
		}
		return datesArray;
	    }

	public getDetail(id){
			this.weekMonthService.getOne(id).subscribe(data => {
			this.weeklyObj = data.message;			
			this.getItems(this.iid);	
			if(this.weeklyObj.type == 'flexible')
			{ 
              this.createFlexible();
			}else{
			  this.dateDiff();
			}
		    });
	     }

    public createFlexible(){
    var dayJsonSet = [];
    for(var i=0; i<this.daysName.length; i++){
    	dayJsonSet.push({"day": this.daysName[i].name, "menuids": []});
  		}
    	this.daysJson = JSON.parse(JSON.stringify(dayJsonSet));		
    }

	public addtoDay(inputdate, submenuid){        
		let index = "";
		if(inputdate.date){
		    index = this.daysJson.findIndex(item => item.date === inputdate.date);		
		}else{
		    index = this.daysJson.findIndex(item => item.day === inputdate.day);
		}	
		const mindex = this.daysJson[index].menuids.findIndex(item => item._id === submenuid._id);
        submenuid["qty"] = 1;
		if(mindex === -1){
			this.daysJson[index].menuids.push(JSON.parse(JSON.stringify(submenuid)));                
		}else{			
			this.daysJson[index].menuids.splice(mindex, 1);				
		}	
		this.totalPrice();
	   }


	public increaseitem(inputdate, submenuid){
		let index = "";
		if(inputdate.date){
		    index = this.daysJson.findIndex(item => item.date === inputdate.date);		
		}else{
		    index = this.daysJson.findIndex(item => item.day === inputdate.day);
		}			
	  const mindex = this.daysJson[index].menuids.findIndex(item => item._id === submenuid._id);
	  if(mindex != -1){	   	
	  this.daysJson[index].menuids[mindex].qty  = this.daysJson[index].menuids[mindex].qty + 1;
      this.totalPrice();
	  }
	 }


	public decreseitem(inputdate, submenuid){		
		let index = "";
		if(inputdate.date){
		    index = this.daysJson.findIndex(item => item.date === inputdate.date);		
		}else{
		    index = this.daysJson.findIndex(item => item.day === inputdate.day);
		}
	 	
	 const mindex = this.daysJson[index].menuids.findIndex(item => item._id === submenuid._id);
	 if(mindex != -1){
	 	if(this.daysJson[index].menuids[mindex].qty == 1){
         this.daysJson[index].menuids = [];
	 	}else{
	     this.daysJson[index].menuids[mindex].qty  = this.daysJson[index].menuids[mindex].qty - 1;		
	 	}
	  this.totalPrice();
	 }
	}

	public onadd(){
		var obj = {_id: this.paramid, dayandmenus: this.daysJson};
		this.weekMonthService.update(obj).subscribe(data => {		
		});
      }

	public daysJsonToUpdate(){
		
		/*
		*/
		
	    if(this.weeklyAddModelList.value.image == null){		
		var obj = {_id: this.paramid,  packageprice : this.weeklyAddModelList.value.packageprice, totalprice : this.weeklyAddModelList.value.totalprice , dayandmenus: this.daysJson, combo : this.comboObjlist, comboprice : this.weeklyAddModelList.value.comboprice};				 
		this.weekMonthService.update(obj).subscribe(data => {		
			this.router.navigate(['/owner/weekly']);
		});		
	    }else{

	    if(this.file_type == false){ 
            this.progress = 0;
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
                this.progress = progress;
            }
           this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.weeklyAddModelList.controls['image'].setValue(responsePath.filename);
                var obj = {_id: this.paramid,  image:  this.weeklyAddModelList.value.image, packageprice : this.weeklyAddModelList.value.packageprice, totalprice : this.weeklyAddModelList.value.totalprice , dayandmenus: this.daysJson, combo: this.comboObjlist,  comboprice : this.weeklyAddModelList.value.comboprice};				
                this.weekMonthService.update(obj).subscribe(data => {		
			    this.router.navigate(['/owner/weekly']);
		        });
            }}

        	}
	  	/*	}*/
		 }
}




@Component({
	selector: 'app-weekly',
	templateUrl: './weeklydayEdit.component.html'
})

export class WeeklyDayEditComponent implements OnInit {
	weeklyObject1 : any;
    file_type : any = false;
	weeklyAddModelList: FormGroup;
	daysJson :any;
	weeklyObj: any;
	menus : any;	
	paramid : any; 
    items : any;
    iid : any;
    imageUrl : any = globalVariable.imageUrl;
    datepipe: any;
    packageprice : any;
    totalprice : any;
    comboObjlistcount : any = [];
    comboObjlist : any = [];
    comboObj : any = [];
    progress : any = 0;
    public uploader:FileUploader = new FileUploader({url: globalVariable.imageUrlupload, allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg', 'image/JPEG', 'image/PNG',  'image/JPG' ]});
    packageimage : any;
    packageType: any;
    daysName:any =  [{name:"sunday", "serial":1},
   				{name:"monday", "serial":2},
   				{name:"tuesday", "serial":3},
  				{name:"wednesday", "serial":4},
   				{name:"thursday", "serial":5},
			    {name:"friday", "serial":6},
    			{name:"saturday","serial":7}];
	restaurantDetail :any = JSON.parse(localStorage.getItem('currentOwner'));
	constructor(public lf: FormBuilder, public comboService : ComboService, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService, public activatedRoute: ActivatedRoute) {
    
	this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
	this.getDetailCombo(this.iid);
	this.activatedRoute.params.subscribe((params: Params) => {
		this.paramid = params['id'];
		this.packageType = params['type'];
		if(params['type'] == "flexible"){
            this.datepipe = 'EEEE';
			}
			if(params['type'] == "fixed"){
			this.datepipe = 'fullDate';
			}	
		this.getDetail(this.paramid);
	    });

	 }

	formErrors = {
        'packageprice': '',            
        'comboprice': ''            
    };

    validationMessages = {
        'packageprice': {
        	"required" : "Required price only Non-Negative!",
            'pattern'  : 'Required price only Non-Negative!',
            'min'  : 'Required price only Non-Negative!'
        },
        'comboprice': {
        	"required" : "Required price only Non-Negative!",
            'pattern'  : 'Required price only Non-Negative!',
            'min'  : 'Required price only Non-Negative!'
        }          
    };

	ngOnInit() {
     var patternq = /^[+]?\d+(\.\d+)?$/;
	 this.weeklyAddModelList = this.lf.group({
       	      image : [],
       	      packageprice: ['',[Validators.required, Validators.pattern(patternq)]],
       	      discount: [''],
       	      totalprice: [''],
       	      comboprice: [''],
       	      imagee : ['']
   		  });

	 this.weeklyAddModelList.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged();
	    }

	     onValueChanged(data?: any) {
        if (!this.weeklyAddModelList) {return;  }
        const form = this.weeklyAddModelList;

        for (const field in this.formErrors) {

            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);      
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';          
                }
            }
        }
    }
    
   getDetailCombo(id){
		this.comboService.getAll(id).subscribe(data => {
			this.comboObj = data.message;
		});	
	    } 

    addCombo(combo){
   	var index = this.comboObjlist.findIndex((item) => item._id == combo._id);
   	if(index == -1){
    this.comboObjlist.push(JSON.parse(JSON.stringify(combo)));
    this.calculateCombo(); 
   	}else{
    this.comboObjlist.splice(index,1);
    this.calculateCombo(); 
   	} 
    }

   calculateCombo(){   	
    var qtyarray = this.comboObjlist.map(function(a) {return a.finalcomboprice}); 
	var qtysum = qtyarray.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    
    this.weeklyAddModelList.controls['comboprice'].setValue(qtysum);
   }

	public getMenus(id){
		this.kitchenMenuService.getAlllist(id).subscribe(data => { 
			this.menus = data.message;				
		});
	   }


  public totalPrice()
         {
			this.weeklyAddModelList.value.totalprice = 0;
			for(var i=0; i<this.daysJson.length; i++){			
			var qtyarray = this.daysJson[i].menuids.map(function(a) {return a.price * a.qty;}); 
			var qtysum = qtyarray.reduce((a, b) => a + b, 0);
			var value1 = parseFloat(this.weeklyAddModelList.value.totalprice) + parseFloat(qtysum);
			var value2 = (Math.round(value1 * 100) / 100);
			this.weeklyAddModelList.controls["totalprice"].setValue(value2);
			this.weeklyAddModelList.controls["packageprice"].setValue(value2);
			}
         }


  public getDetail(id){
		this.weekMonthService.getOne(id).subscribe(data => {
			this.getItems(this.iid);
			this.weeklyObject1 = data.message;
			this.daysJson = data.message.dayandmenus;
			this.comboObjlist  = data.message.combo;
			this.comboObjlistcount  = data.message.combo.map(function(a) {return a._id});
			this.packageimage = data.message.image;	
			this.weeklyAddModelList.patchValue(data.message);
		});	
	}


    getItems(id){
    	this.kitchenMenuItemService.getAlllist(id).subscribe(data => {
    		this.items = data.message;
    	});
       }

       public onChange(event) {         
   		if(event.target.files.length > 0){    
    	var extarray = ["jpeg","jpg","png","JPEG","JPG","PNG"];
        var files = event.target.files;
        var farr = files[0].name.split(".");
        var ext = farr[farr.length - 1];        
        if(extarray.indexOf(ext) != -1){
        this.file_type = false;
        this.weeklyAddModelList.controls['imagee'].setValue(files[0].name);
        }else{
        this.file_type = true;
        this.weeklyAddModelList.controls['imagee'].setValue(this.weeklyObject1.image);
		}
		}
		}

	addtoDay(inputdate, submenuid){        
		let index = "";
		if(inputdate.date){
		    index = this.daysJson.findIndex(item => item.date === inputdate.date);		
		}else{
		    index = this.daysJson.findIndex(item => item.day === inputdate.day);
		}			
		const mindex = this.daysJson[index].menuids.findIndex(item => item._id === submenuid._id);
        submenuid["qty"] = 1;
		if(mindex === -1){
			this.daysJson[index].menuids.push(submenuid);                
		}else{			
			this.daysJson[index].menuids.splice(mindex, 1);				
		}	
		if(this.packageType == 'fixed'){
		this.totalPrice();
		}
	}


	increaseitem(inputdate, submenuid){
		let index = "";
		if(inputdate.date){
		    index = this.daysJson.findIndex(item => item.date === inputdate.date);		
		}else{
		    index = this.daysJson.findIndex(item => item.day === inputdate.day);
		}
	  const mindex = this.daysJson[index].menuids.findIndex(item => item._id === submenuid._id);
	  if(mindex != -1){	   	
	  this.daysJson[index].menuids[mindex].qty  = this.daysJson[index].menuids[mindex].qty + 1;
	  } 
	  if(this.packageType == 'fixed'){
		this.totalPrice();
		}
	}


	decreseitem(inputdate, submenuid){
		let index = "";
		if(inputdate.date){
		    index = this.daysJson.findIndex(item => item.date === inputdate.date);		
		}else{
		    index = this.daysJson.findIndex(item => item.day === inputdate.day);
		}
	 const mindex = this.daysJson[index].menuids.findIndex(item => item._id === submenuid._id);
	 if(mindex != -1){
	 	if(this.daysJson[index].menuids[mindex].qty == 1){
         this.daysJson[index].menuids = [];
	 	}else{
	     this.daysJson[index].menuids[mindex].qty  = this.daysJson[index].menuids[mindex].qty - 1;		
	 	}
 	  if(this.packageType == 'fixed'){
		this.totalPrice();
		} 
	 }
	}

	onloadchecked(inputdate, submenuid){
		let index = "";
		if(inputdate.date){
		    index = this.daysJson.findIndex(item => item.date === inputdate.date);		
		}else{
		    index = this.daysJson.findIndex(item => item.day === inputdate.day);
		}
		const mindex = this.daysJson[index].menuids.findIndex(item => item._id === submenuid);			
		if(mindex === -1){				
			return false;
		}else{				
			return true;
		} 
	  }
	



daysJsonToUpdate(){
		/*if(confirm("Have You Checked Package price?")) {*/
		
	    if(this.weeklyAddModelList.value.imagee == ''){		
		var obj = {_id: this.paramid,  packageprice : this.weeklyAddModelList.value.packageprice, totalprice : this.weeklyAddModelList.value.totalprice, discount: this.weeklyAddModelList.value.discount, dayandmenus: this.daysJson, combo : this.comboObjlist, comboprice : this.weeklyAddModelList.value.comboprice};				 
		
		this.weekMonthService.update(obj).subscribe(data => {		
			this.router.navigate(['/owner/weekly']);
		 });		
	    }else{
	    	 if(this.file_type == false){
            this.progress = 0;
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
                this.progress = progress;
            }
           this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.weeklyAddModelList.controls['image'].setValue(responsePath.filename);
                var obj = {_id: this.paramid,  image:  this.weeklyAddModelList.value.image, packageprice : this.weeklyAddModelList.value.packageprice, discount: this.weeklyAddModelList.value.discount,totalprice : this.weeklyAddModelList.value.totalprice , dayandmenus: this.daysJson, combo: this.comboObjlist,  comboprice : this.weeklyAddModelList.value.comboprice};				
                
                this.weekMonthService.update(obj).subscribe(data => {		
			    this.router.navigate(['/owner/weekly']);
		        });
            }
            }
	    /*}*/
	  }
	 }
}



@Component({
	selector: 'app-weekly',
	templateUrl: './weeklylist.component.html'
})

export class WeeklyDayListComponent implements OnInit {
	
	weeklyObj :any = [];
	menus : any = [];	
	paramid : any; 
    iid : any;
    imageUrl : any = globalVariable.imageUrl;
    addpackagebutton : any = false;
    items: any = [];
    restaurantDetail :any = JSON.parse(localStorage.getItem('currentOwner'));
	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public weekMonthService : WeekMonthService, public activatedRoute: ActivatedRoute) { }

	ngOnInit() {
	   this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
	    this.getItems(this.iid);
		this.getDetail(this.iid);
		this.getMenus();
	}
		
		/*getMenus(){
			this.kitchenMenuService.getAll().subscribe(data => { 
				this.menus = data.message;				
			});        
		}*/

		

		getMenus(){
		this.kitchenMenuService.getAlllist(this.iid).subscribe(data => {
		    this.menus  = data.message; 						
		});        
	   }

		getDetail(id){
			this.weekMonthService.getAll(id).subscribe(data => {		
				this.weeklyObj = data.message;

				//this.getMenus();	

			});	
		}

		getItems(id){
		this.kitchenMenuItemService.getAlllist(id).subscribe(data => {
			this.items = data.message;
		});
	}


    
     deletePackage(id){
     	     if(confirm("Are you sure to delete ?")) {
             this.weekMonthService.deleteOne(id).subscribe(data => {
             	this.getDetail(this.iid);
             });
         }
     } 

	
	}