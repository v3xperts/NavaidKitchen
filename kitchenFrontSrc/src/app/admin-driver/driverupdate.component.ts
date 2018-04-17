import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {  UsersService, DriverService } from '../service/index';
declare var toastr : any;
toastr.options.timeOut = 60;


@Component({
    selector: 'app-users',
    templateUrl: './driverupdate.component.html',
    styles: []
})
export class DriverupdateComponent implements OnInit {

    drivers:any;
    driverAddModel: FormGroup;
    err:any;
    id :any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    phoneRegex = /^[(]{0,1}[0-9]{2,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{7}$/;
    newo : any = false;
    kitchens = [];
    driversemail: any = false;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'username': '',
    'email' : '',
    'password' : '',
    'phoneNo' : '',
    'isactivated' :'',
    'address':''  
  };

   validationMessages = {
     'firstname': {
            'required':      'First Name is required.',
        },
        'lastname': {
            'required':      'Last Name is required.',
        },
    'username': {
      'required':      'Username is required.',
      'minlength':     'Username must be at least 4 and maximum 64 characters long.',
      'maxlength':     'Username cannot be more than 64 characters long.',
      'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
    },
     'phoneNo': {
            'required':      'Phone Number is required.',
            'minlength':     'Enter 10 digit phone number with country code',
            'maxlength':     'Enter 10 digit phone number with country code',
            'pattern'   :    'Phone Number contains Numberic only'
        },
    'password': {
      'required':      'Phone Number is required.',
      'minlength':     'Enter 8 digit minimum for password.',
      'maxlength':     'Maximum 64 digit for password.'
    },
    'email' : {
        'required':      'Email is required.',
        'pattern'   :    'Email not in well format.'
       }
  };

    constructor(
        public lf: FormBuilder, 
        public driverService : DriverService , 
        public router: Router,
        public activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            
        });
            this.driverAddModel = this.lf.group({
            _id: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],            
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],            
            username: [''],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]], 
            phoneNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(this.phoneRegex)]],
            address: ['', Validators.required]            
            });
            this.getDriver(this.id);

            this.driverAddModel.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged(); // (re)set validation messages now
            this.loadAllRestaurant();
    }

   
checkemail(){
      var showformdata = (<HTMLInputElement>document.getElementById("email")).value;
      this.driverService.Uniqueemail(showformdata).subscribe(drivers => {        
      this.driversemail = drivers.error;
        });
     
    }

    public getDriver(id) {
        this.driverService.getOnedriver(id).subscribe(drivers => { 
            console.log(drivers);
            this.drivers = drivers.message; 
            this.driverAddModel.patchValue(this.drivers);
            // this.userAddModel.controls['firstname'].setValue(this.users.firstname);
        });
    }

    public driverUpdate() {
        console.log(this.driverAddModel.value);
        this.driverAddModel.value.username = this.driverAddModel.value.email;
        this.driverService.updateDriver(this.driverAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info('Driver Updated successfully');
                this.router.navigate(['/admin/driver/list']);
            });
    }


    onValueChanged(data?: any) {
        if (!this.driverAddModel) {return;  }
        const form = this.driverAddModel;

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

     public loadAllRestaurant() {
      this.driverService.getAllRestaurant().subscribe(
          (users) => 
          { 
            this.kitchens = users.message; 
          }
      );
    }
}
