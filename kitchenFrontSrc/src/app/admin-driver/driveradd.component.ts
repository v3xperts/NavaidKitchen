import { Component, OnInit,ViewEncapsulation, ElementRef , ViewChild , NgZone, NgModule } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators,  FormControl , ReactiveFormsModule } from '@angular/forms';
import { DriverService} from '../service/index';
declare var $ : any;
declare var NProgress: any;
declare var google: any;
declare var toastr : any;
toastr.options.timeOut = 60;


@Component({
  selector: 'app-driver',
  templateUrl: './driveradd.component.html',
  styles: ['span.require { color: red; }']
})
export class DriveraddComponent implements OnInit {

    
    showformdata : any;
    showform : any = false;
    driverAddModel: FormGroup;  
    err:any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    phoneRegex = /^[(]{0,1}[0-9]{2,3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{7}$/;
    unlength : any = 0;
    kitchens = [];
    drivers: any = false;
    driversemail: any = false;


  formErrors = {
    'firstname': '',
    'lastname': '',
    'username': '',
    'email' : '',
    'password' : '',
    'phoneNo' : '',
    'address':'',
    'isactivated' :''
    
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
        public router: Router,
        public route: ActivatedRoute,
        public driverService : DriverService
       
    ) { }

  	ngOnInit() {
        this.driverAddModel = this.lf.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],            
            username: [''],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]], 
            phoneNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern(this.phoneRegex)]],
            address: ['', Validators.required], 
            isactivated: ['']
        });     
         this.driverAddModel.controls["isactivated"].setValue(1);
         this.driverAddModel.valueChanges
        .subscribe(data => this.onValueChanged(data));
         this.onValueChanged(); // (re)set validation messages now
         this.loadAllRestaurant();
    }

  public getuserlength(){
    this.unlength = this.driverAddModel.value.username.length;

    }

    checkuser(){
      var showformdata = (<HTMLInputElement>document.getElementById("email")).value;
      this.driverService.Uniqueuser(showformdata).subscribe(drivers => {      
          this.drivers = drivers.error;  
        });
     
    }

    checkemail(){
      var showformdata = (<HTMLInputElement>document.getElementById("email")).value;
      this.driverService.Uniqueemail(showformdata).subscribe(drivers => {        
      this.driversemail = drivers.error;
        });
     
    }

  	public driveradd() {
      console.log(this.driverAddModel.value);
      this.driverAddModel.value.username = this.driverAddModel.value.email;
        this.driverService.addnewdriver(this.driverAddModel.value).subscribe(
            (data) => { 
              console.log("data", data);
                NProgress.done();
                toastr.remove();              
                toastr.success('Driver Added successfully');
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
