import { Component, OnInit, ElementRef} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl,Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService, AuthService, UsersService } from '../service/index';
import {AlertComponent} from '../directives/index';
declare var NProgress : any;
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []  
})
export class LoginComponent implements OnInit  {

	loginForm: FormGroup;
  returnUrl: string;
	err:any;
  passwordp : any = "";
  alertType :any = '';

  	constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,        
        public elRef:ElementRef
         ) { }


    ngOnInit() {
        
        toastr.options = { positionClass: 'toast-top-right'};
        this.alertService.deleteMessage();
        
      //  this.authService.logout();
        
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.loginForm = this.lf.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            clicked : ['', Validators.required]
        });

        this.loginForm.controls["clicked"].setValue("clicked");

        this.loginForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now 

    }
    
    /*
  	ngOnChanges() {
        this.authService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  		  this.loginForm = this.lf.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
  	}
    */

 onValueChanged(data?: any) {

    if (!this.loginForm) {return;  }
    const form = this.loginForm;

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


    invaliduserpass(){       
        this.loginForm.controls["password"].setValue("");
    }

    login(){
        NProgress.start();
        this.loginForm.controls["clicked"].setValue("");
        this.authService.getUser(this.loginForm.value).subscribe(
            (data) => {
              if (data.status) {    
                    this.alertType = 'success';                                 
                    data.data['type']= data.type
                    let obj = data.data;
                    //obj['type']= data.type;
                    console.log('obj',obj)
                    localStorage.setItem('currentUser', JSON.stringify(data.data));
                    //this.alertService.success('Login successful', true); 
                    
                      setTimeout(() => {           
                      NProgress.done();                      
                      this.alertType = '';                     
                       this.router.navigate([this.returnUrl]);
                      }, 5000);


                }else{
                     this.loginForm.reset(); 
                     this.alertType = 'error';
                      setTimeout(() => {           
                    NProgress.done();  
                     this.alertType = '';                 
                    this.loginForm.controls["clicked"].setValue("clicked");
                    this.invaliduserpass();
                    this.router.navigate(['admin/login']); 
                    }, 800);


                                         
                }
            },
            (err)=>{  
                    this.alertType = 'error';
                    setTimeout(() => {           
                    NProgress.done();   
                     this.alertType = '';              
                    this.loginForm.controls["clicked"].setValue("clicked");  
                    this.invaliduserpass();
                    this.router.navigate(['admin/login']); 
                    }, 800);


                                       
            });
        }

 formErrors = {
    'password'  : ''   
  };

  validationMessages = {   
     'password' : {
        'required':      'Password is required',
        'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character'
       }        
      };

}


@Component({
  selector: 'app-forget',
  templateUrl: './forgetPassword.component.html',
  styles: []
})
export class ForgetComponent implements OnInit {
  forgetForm: FormGroup;
  returnUrl: string;
  err:any;
  emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute){}
  ngOnInit() {

    this.forgetForm = this.lf.group({
          //email: ['', Validators.required]
          email: new FormControl('', [Validators.required, Validators.pattern(this.emailp)])
        });

       this.forgetForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
         this.onValueChanged(); // (re)set validation messages now

  }

  forgetPass(){
        console.log(this.forgetForm.value);
        NProgress.start(); 
    this.authService.forgetPasswordAdmin(this.forgetForm.value).subscribe(
            (data) => {
                if (data.error) {
                  //this.alertService.error(data.message, true);
                  NProgress.done();
                  toastr.remove();
                  toastr.error('You are entered wrong email!');
                  this.router.navigate(['/admin/forget-password']);
                }else{
                  NProgress.done();                  
                  toastr.remove();
                  toastr.success('Check your email to reset password!');
                  this.router.navigate(['/admin/login']);
                }
            }
        );

  }



    onValueChanged(data?: any) {
    if (!this.forgetForm) {return;  }
    const form = this.forgetForm;

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
    'email' : ''        
  };

  validationMessages = {   
    'email' : {
        'required':      'Email is required.',
        'pattern'   :    'Email not in well format.'
       }      
  };
  
}

@Component({
  selector: 'app-adminforget',
  templateUrl: './resetPasswordOwner.component.html',
  styles: []
})
export class ResetPasswordAdminComponent implements OnInit {

    forgetForm: FormGroup;
    returnUrl: string;
    err:any;
    id:any;
    passwordp : any = '';
    newo : any = false;
    MutchPassword :any = false;
    
    formErrors = {    
    'password' : ''     
  };

  validationMessages = {    
     'password' : {
        'required':      'Password is required.',
        'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
       }            
  };

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,
        public alertService: AlertService,
        public activatedRoute: ActivatedRoute,
        public usersService : UsersService){}
    ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
        });
         
       this.usersService.getComplexity().subscribe(data=>{    
           
         this.passwordp = data.message[0].adminpasscomplexity.regex;
         this.setpasswordmessage(data.message[0].adminpasscomplexity.name);
         this.newo = true;

        this.forgetForm = this.lf.group({
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            newpassword: ['', Validators.required],
            matchpass: ['', Validators.required],
          });

        this.forgetForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
         this.onValueChanged(); // (re)set validation messages now
         toastr.clear();

        });
    
    }
    
    setpasswordmessage(name){
     if(name == 'simplepassword'){
       this.validationMessages.password.pattern = 'Password must contain min 8 Digits alphanumeric only';
     }

     if(name == 'medium'){
       this.validationMessages.password.pattern = 'TBD';
     }

     if(name == 'complex'){
       this.validationMessages.password.pattern = 'TBD';
     }

     if(name == 'none'){
      this.validationMessages.password.pattern = '';
     }
   }

 public matchpassword(){
    if(this.forgetForm.value.password == this.forgetForm.value.newpassword){
     this.forgetForm.controls["matchpass"].setValue(true);
     this.MutchPassword = false;
     console.log(this.forgetForm.value);
    }else{
     this.forgetForm.controls["matchpass"].setValue("");
     this.MutchPassword = true;
    }
    }

    onValueChanged(data?: any) {
    if (!this.forgetForm) {return;  }
    const form = this.forgetForm;

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

    forgetPass(){
        console.log(this.forgetForm.value);

        this.authService.resetAdminPassword(this.id,this.forgetForm.value).subscribe(
            (data) => {
                toastr.success('Password update successfully', true);
                this.router.navigate(['/admin/login']);
            }
           );

    }
}
