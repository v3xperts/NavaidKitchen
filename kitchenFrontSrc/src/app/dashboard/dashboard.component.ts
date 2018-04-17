import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthService, UsersService, KitchenService, DriverService, FrontendService } from '../service/index';
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  users= [];
  kitchens= [];
  drivers= [];
	customers= [];
	
  	constructor(
      public usersService: UsersService,
      public kitchenService: KitchenService,
      public driverService: DriverService,
      public frontendService: FrontendService,
    ) {}

  	ngOnInit() {
      this.loadAllUsers();
  		this.loadAllKitchens();
      this.loadAlldriver();
      this.loadAllcustomer();
      toastr.clear();
  	}

    public loadAllUsers() {
        this.kitchenService.getAllNewOwner().subscribe(users => { this.users = users.message; });
    }

  	public loadAllKitchens() {
        this.kitchenService.getAll().subscribe(users => { this.kitchens = users.message; });
    }

    public loadAlldriver() {
        this.driverService.getAll().subscribe(drivers => {this.drivers = drivers.message;});
    }

    public loadAllcustomer() {
        this.frontendService.getAll().subscribe(customers => {this.customers = customers.message;});
    }
}


@Component({
    selector: 'app-ownerprofile',
    templateUrl: './dashboardprofile.component.html'
})
export class DashboardprofileComponent implements OnInit {

    adminProfile: FormGroup;
    returnUrl: string;
    err:any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    passwordp : any = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,25}$/;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public UsersService: UsersService,
        public router: Router,        
        public route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.adminProfile = this.lf.group({
            _id: ['', Validators.required],
            username: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
        });

        this.adminProfile.patchValue(JSON.parse(localStorage.getItem('currentUser')));
        console.log(JSON.parse(localStorage.getItem('currentUser')));
         this.adminProfile.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now

    }

    adminUpdate(){
        this.UsersService.updateAdmin(this.adminProfile.value).subscribe(
            (data) => {
                localStorage.removeItem('currentUser');
                localStorage.setItem('currentUser', JSON.stringify(this.adminProfile.value));
                toastr.remove();
                toastr.info('Profile updated successfully');                
                this.router.navigate(['admin/dashboard']);
            }
        );
    }

onValueChanged(data?: any) {
    if (!this.adminProfile) {return;  }
    const form = this.adminProfile;

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
    'username': '',
    'email' : '',
    'password' : ''     
  };

  validationMessages = {
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
}

@Component({
    selector: 'app-ownerprofile',
    templateUrl: './dashboardsetting.component.html'
})
export class DashboardsettingComponent implements OnInit {

    adminProfile: FormGroup;
    returnUrl: string;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public UsersService: UsersService,
        public router: Router,        
        public route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.adminProfile = this.lf.group({
            _id: ['', Validators.required],
            cancelPolicy: ['', Validators.required],
            reschedulingPolicy: ['', Validators.required],
            deliveryChargesPolicy: ['', Validators.required],
            paymentPolicy: ['', Validators.required]
        });
        this.getUsers(JSON.parse(localStorage.getItem('currentUser'))._id);        
    }
    

    
    public getUsers(id) {
        this.UsersService.getAdmin(id).subscribe(users => { 
            this.adminProfile.patchValue(users.message);
            // this.userAddModel.controls['firstname'].setValue(this.users.firstname);
        });
    }

    adminUpdate(){
        this.UsersService.updateAdminSetting(this.adminProfile.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info('Setting has been updated successfully');               
                this.router.navigate(['admin/dashboard']);
            }
        );
    }
}