import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators,  FormControl , ReactiveFormsModule } from '@angular/forms';
import { FrontendService } from '../service/index';
import {OrderPipe} from "../order.pipe"
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
declare var NProgress: any;
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
  selector: 'app-admin-customer',
  templateUrl: './admin-customer.component.html',
  styleUrls: ['./admin-customer.component.css']
})
export class AdminCustomerComponent implements OnInit {

  constructor(public customerService : FrontendService) { }
  order: string = 'firstname';
    firstname: string = 'firstname';
    reverse: boolean = false;
    customerFilter: any = { username: '' };
	customers= []; 
  ngOnInit() {
  	this.loadAllcustomer();
  }

  public loadAllcustomer() {
        this.customerService.getAll().subscribe(customers => { 
          this.customers = customers.message;
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

    public deleteCustomer(id) {
      if(confirm("Are you sure to delete ?")) {
        var index = this.customers.findIndex((item) => {
         return item._id == id;
        });
        if(index != -1){
         this.customers.splice(index, 1);
        }

        this.customerService.deleteOnecustomer(id).subscribe(data => {
                //this.loadAllUsers(); 
                toastr.clear();
                toastr.warning('Customer Deleted Successfully.');              
                // this._flashMessagesService.show('Owner Deleted Successfully.', { cssClass: 'alert-success', timeout: 3000 });                               
                //this.router.navigate(['/admin/users']);
         });
      }
    }

}


@Component({
  selector: 'app-customer',
  templateUrl: './customeradd.component.html',
  styles: ['span.require { color: red; }']
})
export class CustomeraddComponent implements OnInit {

    
    showformdata : any;
    showform : any = false;
    customerAddModel: FormGroup;  
    err:any;
    passwordp : any = '';
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    phoneRegex = /^[(]{0,1}[0-9]{2,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{7}$/;
    unlength : any = 0;
    customers= []; 
     MutchPassword :any = false;

 

  formErrors = {
    'firstname': '',
    'lastname': '',
    'username': '',
    'email' : '',
    'password' : '' ,
    'newpassword':''
  };

  validationMessages = {
     'firstname': {
            'required':      'First Name is required.',
        },
        'lastname': {
            'required':      'Last Name is required.',
        },
        'password' : {
        'required':      'Password is required.',
        'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
       },
    'username': {
      'required':      'Username is required.',
      'minlength':     'Username must be at least 4 and maximum 64 characters long.',
      'maxlength':     'Username cannot be more than 64 characters long.',
      'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
    },
    'email' : {
        'required':      'Email is required.',
        'pattern'   :    'Email not in well format.'
       }
  };


    constructor(
        public lf: FormBuilder, 
        public router: Router,
        public route: ActivatedRoute,
        public customerService : FrontendService
       
    ) { }

  	ngOnInit() {
        this.customerAddModel = this.lf.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],            
            username: [''],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]], 
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            matchpass : ['',Validators.required],
            newpassword: ['', [Validators.required, Validators.pattern(this.passwordp)]]
        });     

         this.customerAddModel.valueChanges
        .subscribe(data => this.onValueChanged(data));
         this.onValueChanged(); // (re)set validation messages now
    }

    public getuserlength(){

    this.unlength = this.customerAddModel.value.username.length;

    }

      public matchpassword(){
      if(this.customerAddModel.value.password == this.customerAddModel.value.newpassword){
          this.customerAddModel.controls["matchpass"].setValue(true);
          this.MutchPassword = false;
      }else{
          this.customerAddModel.controls["matchpass"].setValue("");
          this.MutchPassword = true;
      }
    }


  	public customeradd() {
        this.customerAddModel.value.username = this.customerAddModel.value.email;
        this.customerService.addCustomer(this.customerAddModel.value).subscribe(
            (data) => { 
                NProgress.done();
                toastr.remove();              
                toastr.success('Customer Added successfully');
                this.router.navigate(['/admin/customer/list']);
            });
    }

    
    onValueChanged(data?: any) {
    if (!this.customerAddModel) {return;  }
    const form = this.customerAddModel;
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
}



@Component({
    selector: 'app-customerupdate',
    templateUrl: './customerupdate.component.html',
    styles: []
})
export class CustomerupdateComponent implements OnInit {

    showformdata : any;
    showform : any = false;
    customerAddModel: FormGroup;  
    err:any;
    id :any;
    passwordp : any = '';
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
   	phoneRegex : any = '';
    unlength : any = 0;
    newo : any = false;
    customers= []; 
    
   formErrors = {
    'firstname': '',
    'lastname': '',
    'username': '',
    'email' : '',
    'password' : '' 
  };

  validationMessages = {
     'firstname': {
            'required':      'First Name is required.',
        },
        'lastname': {
            'required':      'Last Name is required.',
        },
        'password' : {
        'required':      'Password is required.',
        'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
       },
    'username': {
      'required':      'Username is required.',
      'minlength':     'Username must be at least 4 and maximum 64 characters long.',
      'maxlength':     'Username cannot be more than 64 characters long.',
      'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
    },
    'email' : {
        'required':      'Email is required.',
        'pattern'   :    'Email not in well format.'
       }
  };


    constructor(
        public lf: FormBuilder, 
        public customerService : FrontendService , 
        public router: Router,
        public activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            
        });
           this.customerAddModel = this.lf.group({
           	 _id: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],            
            username: [''],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]], 
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
        });     
            this.getCustomer(this.id);

            this.customerAddModel.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged(); // (re)set validation messages now
    }

   

    public getCustomer(id) {
        this.customerService.getOneCust(id).subscribe(customers => { 
            this.customers = customers.message; 
            this.customerAddModel.patchValue(this.customers);
            // this.userAddModel.controls['firstname'].setValue(this.users.firstname);
        });
    }

    public customerUpdate() {
        this.customerAddModel.value.username = this.customerAddModel.value.email;
        this.customerService.updateFrontend(this.customerAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info('Customer Updated successfully');
                this.router.navigate(['/admin/customer/list']);
            });
    }


    onValueChanged(data?: any) {
        if (!this.customerAddModel) {return;  }
        const form = this.customerAddModel;

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

   
}


