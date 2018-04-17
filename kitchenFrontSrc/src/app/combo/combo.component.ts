import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, KitchenMenuService, KitchenItemService, ComboService} from '../service/index';
import { FileUploader } from 'ng2-file-upload';
import {OrderPipe} from "../order.pipe"
import * as globalVariable from "../global";
declare var toastr : any;
toastr.options.timeOut = 60;


@Component({
	selector: 'app-weekly',
	templateUrl: './comboadd.component.html'
})
export class ComboComponent implements OnInit {
	file_type : any = false;
	comboAddModel :any ;
	option: any;
	totalvalue : any;
	menus : any;
	items : any;
	checker : any= [];
	totalpricei : any = 0;
    iid : any;
    imageUrl : any = globalVariable.imageUrl;
    acttype : any;
    public uploader:FileUploader = new FileUploader({url: globalVariable.imageUrlupload , allowedMimeType: ['image/JPEG','image/PNG','image/JPG','image/jpeg', 'image/png',  'image/jpg' ]});
    progress : any = 0;
    restaurantDetail :any;
    
	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router, public comboService : ComboService) { }

	ngOnInit() {
		var patternq = /^[+]?\d+(\.\d+)?$/;
		this.comboAddModel = this.lf.group({
			name: ['',Validators.required],//['',Validators.required],			
			description: ['',[Validators.required,Validators.maxLength(150), Validators.minLength(0)]],	//['',Validators.required],					
			finalcomboprice: ['',[Validators.required,  Validators.min(0),  Validators.pattern(patternq)]],//['',Validators.required],					
			kitchenId: [],
			totalprice : [],
			menuId : [],
			image : []
		});

		this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;	
		this.restaurantDetail = JSON.parse(localStorage.getItem('currentOwner'));
		this.getMenus(this.iid);
		this.getItems(this.iid);
		this.checker = [];

 this.comboAddModel.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged();
	}
    

     onValueChanged(data?: any) {
        if (!this.comboAddModel) {return;  }
        const form = this.comboAddModel;

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
        'finalcomboprice': ''
    };

    validationMessages = {
    		'finalcomboprice': {
        	"required" : "Required price only Non-Negative!",
            'pattern'  : 'Required price only Non-Negative!',
            'min'  : 'Required price only Non-Negative!'
        }          
    };


public checkHide(menu){
     var index = this.items.findIndex((item) => { return item.menuId._id == menu._id; });
     console.log("in", index);
     if(index != -1){
      return true;
     }else{
      return false;
     }
	}


    public onChange(event) {
        var extarray = ["jpeg","jpg","png", "JPEG","JPG","PNG"];
        var files = event.target.files;
        var farr = files[0].name.split(".");
        var ext = farr[farr.length - 1];        
        if(extarray.indexOf(ext) != -1){
        this.file_type = false;
        this.comboAddModel.controls['image'].setValue(files[0].name);
        }else{
        this.file_type = true;
        this.comboAddModel.controls['image'].setValue("");
    	}

    }

	public getMenus(id){
		this.kitchenMenuService.getAlllist(id).subscribe(data => { 
			this.menus = data.message;						
	});
	}   

	public getItems(id){

		this.kitchenMenuItemService.getAlllist(id).subscribe(data => {
			this.items = data.message;
		});

	}  


	public priceCalc(submenuid, price){
		if(this.checker.length == 0)
		{
			this.checker.push({submenuid : submenuid, price : price});
		}else{
			const index = this.checker.findIndex(item => item.submenuid === submenuid);         		
			if(index === -1) {
				this.checker.push({"submenuid" : submenuid, "price" : price});	
			}else{
				this.checker.splice(index, 1);
			} 
		}
		this.totalpricecalc();
	}


	public totalpricecalc(){     	
		var sum = 0;
		for(var i=0; i < this.checker.length; i++){
			sum += parseFloat(this.checker[i].price);
		    }
		this.totalpricei = sum.toFixed(2);
		this.comboAddModel.controls["totalprice"].setValue(this.totalpricei);
		this.comboAddModel.controls["finalcomboprice"].setValue(this.totalpricei);
	   }

	public percentcalc(){
		var a = (+this.totalpricei/100) * +this.comboAddModel.value.percentorpricevalue;
		var finalval = (+this.totalpricei - +a);
		return finalval;
	}

	public pricecalc(){
		var finalval = +this.totalpricei -  +this.comboAddModel.value.percentorpricevalue ;
		return finalval;   
	    }



	public comboAdd(){

		if(confirm("Have You Checked Combo price?")) {

		var sub = [];
		for(var i in this.checker)
		{
			sub.push(this.checker[i].submenuid);
		} 

		this.comboAddModel.controls["kitchenId"].setValue(JSON.parse(localStorage.getItem('currentOwner'))._id);
		//this.comboAddModel.controls["totalprice"].setValue(this.totalpricei);
		this.comboAddModel.controls["menuId"].setValue(sub);
        
        console.log("this.comboAddModel.value");
        console.log(this.comboAddModel.value);
        
        if(this.comboAddModel.value.image == null){
	        this.comboService.add(this.comboAddModel.value).subscribe((data) => {
				toastr.remove();
	            toastr.success('Combo Added Successfully');
	            if(this.acttype == 'next'){
				this.router.navigate(['/owner/weekly']);
			    }else{
			    this.router.navigate(['/owner/combo']);	
			    }
			 });
             }else{
            if(this.file_type == false){            
            this.progress = 0;
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
            	console.log(progress);
                this.progress = progress;
            }
           this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.comboAddModel.controls['image'].setValue(responsePath.filename);
                this.comboService.add(this.comboAddModel.value).subscribe((data) => {
				toastr.remove();
	            toastr.success('Combo Added Successfully');
	            if(this.acttype == 'next'){
				this.router.navigate(['/owner/weekly']);
			    }else{
			    this.router.navigate(['/owner/combo']);	
			    }
			   });
            };
            }
            } 		
       }
	   }
     }



@Component({
	selector: 'app-weekly',
	templateUrl: './comboEdit.component.html'
})

export class ComboEditComponent implements OnInit {

	comboEditModel : FormGroup;
	comboObj :any = [];
	weeklyall : any;
	menus : any = [];	
	paramid : any; 
	items : any = [];
	totalpricei :any;    
	option : any;
    iid : any;
    imageUrl : any = globalVariable.imageUrl;
    comboimage : any;
    public uploader : FileUploader = new FileUploader({url: globalVariable.imageUrlupload ,allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG' ]});
    progress : any = 0;
    file_type: any = false;
    restaurantDetail :any;
	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router, public comboService : ComboService, public activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.restaurantDetail = JSON.parse(localStorage.getItem('currentOwner'));
		this.activatedRoute.params.subscribe((params: Params) => {
			this.paramid = params['id'];
			this.getDetail(this.paramid);            
		});
        this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
		this.getMenus(this.iid);
		this.getItems(this.iid);
		this.option = [{typename : "Percent"},{typename : "Price"}];

        var patternq = /^[+]?\d+(\.\d+)?$/;
		this.comboEditModel = this.lf.group({
			_id : ['', Validators.required],
			name: ['', Validators.required],	
			description: ['',[Validators.required,Validators.maxLength(150), Validators.minLength(0)]],					
			finalcomboprice : ['',[Validators.required, Validators.min(0), Validators.pattern(patternq)]],					
			kitchenId: [],
			totalprice : [],
			menuId : [],
			imagee : [],
			image: []
		    });

		 this.comboEditModel.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged();
	    	}



			onValueChanged(data?: any) {
			        if (!this.comboEditModel) {return;  }
			        const form = this.comboEditModel;

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
        'finalcomboprice': ''
    };

    validationMessages = {
    		'finalcomboprice': {
        	"required" : "Required price only Non-Negative!",
            'pattern'  : 'Required price only Non-Negative!',
            'min'  : 'Required price only Non-Negative!'
        }          
    };

	public checkHide(menu){
     var index = this.items.findIndex((item) => { return item.menuId._id == menu._id; });
     console.log("in", index);
     if(index != -1){
      return true;
     }else{
      return false;
     }
	}

	public getMenus(id){
		this.kitchenMenuService.getAlllist(id).subscribe(data => { 
			this.menus = data.message;	
			//console.log("this.menus");					
			//console.log(this.menus);					
		});        
	}

	public getItems(id){
		this.kitchenMenuItemService.getAlllist(id).subscribe(data => {
			this.items = data.message;
		});
	}


	public getDetail(id){
		this.comboService.getOne(id).subscribe(data => {
			this.comboObj = data.message;		
			this.comboEditModel.patchValue(data.message);	
			this.totalpricei = this.comboObj.totalprice;	
			this.comboimage = this.comboObj.image;							 				   
		});	
	}

	public onChange(event) {
            if(event.target.files.length){		
			var extarray = ["jpeg","jpg","png","JPEG","JPG","PNG"];
			var files = event.target.files;
			var farr = files[0].name.split(".");
			var ext = farr[farr.length - 1];
			if(extarray.indexOf(ext) != -1){
			this.file_type = false;
			this.comboEditModel.controls['imagee'].setValue(files[0].name);
			} 
			else{
			this.file_type = true;
			this.comboEditModel.controls['imagee'].setValue(this.comboObj);
			this.uploader.clearQueue();
			} 
			}       
		}

	public onloadchecked(submenuid){
		const index = this.comboObj.menuId.findIndex(item => item === submenuid);					
		if(index === -1){				
			return false;
		}else{				
			return true;
		} 
	}


	public priceCalc(submenuid, price){
		if(this.comboObj.menuId.length == 0)
		{			
			this.comboObj.menuId.push(submenuid);
			this.comboObj.totalprice  = (+this.comboObj.totalprice + +price);
			this.totalpricei = this.comboObj.totalprice;
		}else{
			const index = this.comboObj.menuId.findIndex(item => item === submenuid);    		
			if(index === -1) {
				this.comboObj.menuId.push(submenuid);
				this.comboObj.totalprice  = parseFloat(this.comboObj.totalprice) + parseFloat(price);
				this.totalpricei = this.comboObj.totalprice;	
			}else{				
				this.comboObj.menuId.splice(index, 1);
				this.comboObj.totalprice  = (+this.comboObj.totalprice - +price);
				this.totalpricei = this.comboObj.totalprice;
			} 
		}	
		/*this.totalpricecalc();	*/
		//console.log(this.comboObj.totalprice);
		this.comboEditModel.controls["totalprice"].setValue(this.comboObj.totalprice.toFixed(2));
		this.comboEditModel.controls["finalcomboprice"].setValue(this.comboObj.totalprice.toFixed(2));
	}

/*
   public totalpricecalc(){     	
		var sum = 0;
		for(var i=0; i < this.comboObj.length; i++){
			sum += parseFloat(this.comboObj[i].price);
		    }
		this.totalpricei = sum;
		this.comboEditModel.controls["totalprice"].setValue(this.totalpricei);
		this.comboEditModel.controls["finalcomboprice"].setValue(this.totalpricei);
	   }
*/

	public percentcalc(){
		var a = (+this.comboObj.totalprice/100) * +this.comboEditModel.value.percentorpricevalue;
		var finalval = (+this.comboObj.totalprice - +a);
		return finalval;
	}

	public pricecalc(){
		var finalval = +this.comboObj.totalprice -  +this.comboEditModel.value.percentorpricevalue ;
		return finalval;   
	}

	public comboEditUpdate(){
		if(confirm("Have You Checked Combo price?")) {
         if(this.comboEditModel.value.imagee == null){			
		this.comboService.update(this.comboEditModel.value).subscribe(data => {	
			toastr.remove();
            toastr.info('Combo Updated Successfully');
			this.router.navigate(['/owner/combo']);
		});
	   }else{
	   	if(this.file_type == false){ 
	   	   // this.comboEditModel.controls["image"].setValue(this.comboEditModel.value.imagee);
		    this.progress = 0;
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
            	console.log(progress, "progress");
                this.progress = progress;
            }
           this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.comboEditModel.controls['image'].setValue(responsePath.filename);
               this.comboService.update(this.comboEditModel.value).subscribe(data => {	
			   toastr.remove();
               toastr.info('Combo Updated Successfully');
			   this.router.navigate(['/owner/combo']);
	           }); 
          }
		 }
	 }
	}
	}

}



@Component({
	selector: 'app-weekly',
	templateUrl: './combolist.component.html'
})

export class ComboListComponent implements OnInit {
	
	comboObj :any = [];
	menus : any = [];	
	paramid : any;
    iid : any;
    imageUrl : any = globalVariable.imageUrl;
    items : any = [];
    restaurantDetail:any;
	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router, public comboService : ComboService, public activatedRoute: ActivatedRoute) { }

	ngOnInit() {	
	    this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
	    this.restaurantDetail = JSON.parse(localStorage.getItem('currentOwner'));
	    this.getItems(this.iid);	
	    this.getMenus(this.iid);	
		this.getDetail(this.iid);
	}
	
	getDetail(id){
		this.comboService.getAll(id).subscribe(data => {	
		    console.log("this.comboObj");			
		    console.log(data.message);			
			this.comboObj = data.message;
		});	
	    }   

	getMenus(id){
	this.kitchenMenuService.getAlllist(id).subscribe(data => { 
		this.menus = data.message;						
	});        
    }  

	getItems(id){
		this.kitchenMenuItemService.getAlllist(id).subscribe(data => {
			this.items = data.message;
		});
	}

	deleteCombo(id){
		if(confirm("Are you sure to delete ?")) {
			this.comboService.deleteOne(id).subscribe(data => {
				toastr.remove();
                toastr.warning('Combo Deleted Successfully');
				this.getDetail(this.iid);
			});
		}
	} 

	}