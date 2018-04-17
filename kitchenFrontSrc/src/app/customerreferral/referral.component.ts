import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, KitchenMenuService, KitchenItemService, UsersService , KitchenService, CustomerReferralService, FrontendService} from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr : any;
toastr.options.timeOut = 60;




@Component({
	selector: 'app-weekly',
	templateUrl: './referralsend.component.html'
})

export class CustomerReferralComponent implements OnInit {
	
	referralAddModel :any ;
	option: any;
	typei : any  = 'Customer'; 
	refs : any = false;

	constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public referralService : CustomerReferralService) { }

	ngOnInit() {		
		this.referralAddModel = this.lf.group({			
			referralfrom : [],
			type : ['Customer'],
			emailto: ['', Validators.required]				
		});		
	}


	referralAdd(){
		console.log(JSON.parse(localStorage.getItem('currentCustomer')));
		this.referralAddModel.controls["referralfrom"].setValue(JSON.parse(localStorage.getItem('currentCustomer'))._id);		
		this.referralAddModel.controls["type"].setValue(this.typei);
		console.log(this.referralAddModel.value);	

		this.referralService.add(this.referralAddModel.value).subscribe(data => {	
            toastr.remove();
            toastr.success('Referral has been Send Sucessfully!');
			this.referralAddModel.reset();
			//this.refs = true;			
		});
	}
}


@Component({
	selector: 'app-weekly',
	templateUrl: './referralregister.component.html'
})

export class CustomerReferralRegisterComponent implements OnInit {

	referralRegisterAddModel : FormGroup;
	paramid : any;
	refdetail : any;
	emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    MutchPassword : any = false;
	passwordp : any = ''; 
	formactive:any = false;

	 formErrorsr = {
	    'username': '',
	    'email' : '',
	    'password' : ''     
	};

	validationMessagesr = {
	    'username': {
	        'required':      'Username is required.',
	        'minlength':     'Username must be at least 4 and maximum 64 characters long.',
	        'maxlength':     'Username cannot be more than 64 characters long.',
	        'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
	    },
	    'email' : {
	        'required':      'Email is required.',
	        'pattern'   :    'Email not in well format.'
	    }, 
	    'password' : {
	        'required':      'Password is required.',
	        'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
	    }            
	};

	constructor(public lf: FormBuilder, public activatedRoute : ActivatedRoute,  public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router,public alertService: AlertService, public referralService : CustomerReferralService, public usersService : UsersService, public frontendService: FrontendService) { 
		this.usersService.getComplexity().subscribe(data=>{ 
		    this.formactive = true;     
            this.passwordp = data.message[0].ownerpasscomplexity.regex;
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
			this.referralRegisterAddModel = this.lf.group({			
					firstname : [''],	
					lastname : [''],	
					username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
					email: ['', [Validators.required, Validators.pattern(this.emailp)]],	
					newpassword : ['', Validators.required],
					password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
					matchpass : ['', Validators.required],
				});
			 this.referralRegisterAddModel.valueChanges
            .subscribe(data => this.onValueChangedr(data));
            this.onValueChangedr(); // (re)set validation messages now
            this.activatedRoute.params.subscribe((params: Params) => {
			this.paramid = params['id'];	
			this.getDetail(this.paramid);		            
		});

			});
			}
	

	ngOnInit(){		
		
		
		}


    onValueChangedr(data?: any) {
        if (!this.referralRegisterAddModel){return;  }
        const form = this.referralRegisterAddModel;

        for (const field in this.formErrorsr) {
            // clear previous error message (if any)
            this.formErrorsr[field] = '';
            const control = form.get(field);      
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessagesr[field];
                for (const key in control.errors) {
                    this.formErrorsr[field] += messages[key] + ' ';          
                }
            }
        }
		}

 public setpasswordmessage(name){

        if(name == 'simplepassword'){
            this.validationMessagesr.password.pattern = 'Password must contain min 8 Digits alphanumeric only';
        }

        if(name == 'medium'){
            this.validationMessagesr.password.pattern = 'TBD';
        }

        if(name == 'complex'){
            this.validationMessagesr.password.pattern = 'TBD';
        }

        if(name == 'none'){
            this.validationMessagesr.password.pattern = 'Required';
        }
    }

    public matchpassword(){   
        if(this.referralRegisterAddModel.value.password == this.referralRegisterAddModel.value.newpassword){
            this.referralRegisterAddModel.controls["matchpass"].setValue(true);
            this.MutchPassword = false;
        }else{
            this.referralRegisterAddModel.controls["matchpass"].setValue("");
            this.MutchPassword = true;
        }
    }

	getDetail(id){	  
		this.referralService.getOne(id).subscribe(data => { 
			this.refdetail =  data.message;
			this.referralRegisterAddModel.controls["email"].setValue(this.refdetail.emailto);
		});
	}
	referralRegister(){
		this.frontendService.addCustomer(this.referralRegisterAddModel.value).subscribe(data => {		   
			this.updateStaus();        
		});	  
	} 
	updateStaus(){	       
		var obj1 = {_id : this.refdetail._id, status: true};
		this.referralService.update(obj1).subscribe(data => {
			this.getCustomerdetail();	
		});         
	}
	getCustomerdetail(){
		this.frontendService.getOneCust(this.refdetail.referralfrom[0]).subscribe(data => {   
			this.updateCustomerPoint(data.message.customerpoints);
		});	
	}
	updateCustomerPoint(point){
		var updatedpoint = point  + +15;        
		var obj1 = {_id : this.refdetail.referralfrom[0], customerpoints: updatedpoint};
		this.frontendService.updateReferralPoint(obj1).subscribe(data => {	     
         this.router.navigate(['/']);
		});
	}
}

