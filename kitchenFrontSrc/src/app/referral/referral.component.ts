import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, KitchenMenuService, KitchenItemService, ReferralService, UsersService , KitchenService} from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr :any;


@Component({
	selector: 'app-weekly',
	templateUrl: './referralsend.component.html'
})

export class ReferralComponent implements OnInit {

	emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	referralAddModel :any ;
	option: any;
	typei : any  = 'owner'; 
	refs : any = false;

	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public referralService : ReferralService) { }

	ngOnInit() {
		this.referralAddModel = this.lf.group({			
			referralfrom : [''],
			type : ['owner'],
			emailto: ['', [Validators.required, Validators.pattern(this.emailp)]]				
		});
        this.referralAddModel.valueChanges
        .subscribe(data => this.onValueChanged(data));
         this.onValueChanged(); // (re)set validation messages now
         		
	}

	referralAdd(){
		console.log(JSON.parse(localStorage.getItem('currentOwner')));
		this.referralAddModel.controls["referralfrom"].setValue(JSON.parse(localStorage.getItem('currentOwner')).ownerId._id);		
		this.referralAddModel.controls["type"].setValue(this.typei);
		console.log("REF", this.referralAddModel.value);		
		this.referralService.add(this.referralAddModel.value).subscribe(data => {
			if(data.error){
            toastr.remove();
            toastr.error(data.message);
			}else{
			toastr.remove();
			toastr.success(data.message);
			this.referralAddModel.reset();
			}            
		});

	}

  
      onValueChanged(data?: any) {
    if (!this.referralAddModel) {return;  }
    const form = this.referralAddModel;

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
    'emailto' : ''    
  };

validationMessages = { 
    'emailto' : {
        'required':      'Email is required.',
        'pattern'   :    'Email not in well format.'
       }          
  };
}



@Component({
	selector: 'app-weekly',
	templateUrl: './referralregister.component.html'
})

export class ReferralRegisterComponent implements OnInit {

	referralRegisterAddModel : any;
	paramid : any;
	refdetail : any;

	constructor(public lf: FormBuilder, public activatedRoute : ActivatedRoute,  public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public referralService : ReferralService, public usersService : UsersService, public kitchenService : KitchenService) { }

	ngOnInit() {
		this.referralRegisterAddModel = this.lf.group({			
			username : [''],	
			email : ['', Validators.required],	
			password: ['', Validators.required]			
		});
		this.activatedRoute.params.subscribe((params: Params) => {
			this.paramid = params['id'];	
			this.getDetail(this.paramid);		            
		});
	}

	getDetail(id){	  
		this.referralService.getOne(id).subscribe(data => { 
			console.log("emial", data);
			this.refdetail =  data.message;
			this.referralRegisterAddModel.controls["email"].setValue(this.refdetail.emailto);
		});
	}

	referralRegister(){
		this.referralRegisterAddModel.controls["username"].setValue(this.referralRegisterAddModel.value.email);
		this.kitchenService.addOwner(this.referralRegisterAddModel.value).subscribe(data => {		   
			this.updateStaus();        
		});	  
	} 

	updateStaus(){	       
		var obj1 = {_id : this.refdetail._id, status: true};
		this.referralService.update(obj1).subscribe(data => {	  	
			this.getownerdetail();	
		});         
	}

	getownerdetail(){
		console.log("this.refdetail", this.refdetail);
		this.kitchenService.getOneNewOwner(this.refdetail.referralfrom).subscribe(data => {   
			console.log("data.message.ownerpoints", data.message);
			this.updateOwnerPoint(data.message.ownerpoints);
		});	
	}

	updateOwnerPoint(point){
		var updatedpoint = point + +15;        
		var obj1 = {_id : this.refdetail.referralfrom, ownerpoints: updatedpoint};
		this.kitchenService.updateUser(obj1).subscribe(data => {
         this.router.navigate(['/']);
		});
	}

}



@Component({
	selector: 'app-weekly',
	templateUrl: './referrallist.component.html'
})

export class ReferralListComponent implements OnInit {
    
    ownerinfo:any;
    referowners:any = [];

	constructor(public kitchenMenuService: KitchenMenuService, public referralService : ReferralService) { 
      
      if(localStorage.getItem('currentOwner')){      
      this.ownerinfo = JSON.parse(localStorage.getItem('currentOwner'));
      }

	}

	ngOnInit() {
	 this.getByRestroList();	
	}

	getByRestroList(){	  
		console.log("getByRestroList", this.ownerinfo);
		this.referralService.getAllByRestro(this.ownerinfo.ownerId_id).subscribe(data => { 

			console.log("emidal", data);
			if(data.error){
			this.referowners = [];
			}else{
			this.referowners =  data.message;
			}
		});
	}

}

