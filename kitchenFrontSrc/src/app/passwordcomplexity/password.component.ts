import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {PageService , UsersService, AuthService} from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr : any;
toastr.options.timeOut = 60;


@Component({
  selector: 'app-page',
  templateUrl: './password.component.html',
  styles: []
})
export class PasswordComponent implements OnInit {
 
  constructor() { }
  ngOnInit() {
  }

}



@Component({
  selector: 'app-page',
  templateUrl: './password-complexity.component.html',
  styles: []
})
export class PasswordComplexityComponent implements OnInit {

  
  uinfo : any;
  complexityObj : any = {"none": '', "simplepassword" : '^[a-zA-Z0-9]{8,}$', "medium" : '', "complex" : ''};
  passwordProfile : FormGroup;
  myinfo : any = {"adminpasscomplexity" : {
        "regex" : "",
        "name" : "none"
    },
    "ownerpasscomplexity" : {
        "regex" : "",
        "name" : "none"
    },
    "customerpasscomplexity" : {
        "regex" : "",
        "name" : "none"
    }};
  deci : any = "";
  infofound : any = "";
 

  constructor(  public usersService : UsersService,
                public lf: FormBuilder,
                public router: Router,        
                public route: ActivatedRoute ) {}

  ngOnInit() {

   this.passwordProfile = this.lf.group({ 
            admin: ['', Validators.required],
            owner: ['', Validators.required],
            customer: ['', Validators.required],
        });

  this.uinfo = JSON.parse(localStorage.getItem('currentUser'));
  //this.getUser();
  
  this.getComplexity();

  }

  public getComplexity(){
   this.usersService.getComplexity().subscribe((data) => {
    
     console.log("data cmopex");
     console.log(data.message.length);

     if(data.message.length > 0){
        this.infofound = true;
        this.myinfo = data.message[0];
        this.passwordProfile.controls["admin"].setValue(this.myinfo.adminpasscomplexity.name);
        this.passwordProfile.controls["owner"].setValue(this.myinfo.ownerpasscomplexity.name);
        this.passwordProfile.controls["customer"].setValue(this.myinfo.customerpasscomplexity.name);
        }else{
        this.infofound = false;
        this.passwordProfile.controls["admin"].setValue('none');
        this.passwordProfile.controls["owner"].setValue('none');
        this.passwordProfile.controls["customer"].setValue('none');
         }
   });
  }

   /*public getUser(){
      this.usersService.getAdmin(this.uinfo._id).subscribe((data) => {
        this.myinfo = data.message;
        this.passwordProfile.controls["admin"].setValue(this.myinfo.adminpasscomplexity.name);
        this.passwordProfile.controls["owner"].setValue(this.myinfo.ownerpasscomplexity.name);
        this.passwordProfile.controls["customer"].setValue(this.myinfo.customerpasscomplexity.name);
        console.log(data.message);
      });

   }*/

   public complexityUpdate(){
    
   var admin = {name : this.passwordProfile.value.admin, regex : this.complexityObj[this.passwordProfile.value.admin]};
   var owner = {name : this.passwordProfile.value.owner, regex : this.complexityObj[this.passwordProfile.value.owner]};
   var customer = {name : this.passwordProfile.value.customer, regex : this.complexityObj[this.passwordProfile.value.customer]};
   var final = {adminpasscomplexity : admin, ownerpasscomplexity: owner, customerpasscomplexity : customer};   
   
   console.log(final);
   console.log(this.infofound);
   
   if(this.infofound == true){
     final["_id"] = this.myinfo._id; 
     this.updatecomplexity(final);
     }else{
     this.addcomplexity(final);
     }

 }

public updatecomplexity(final){
this.usersService.updateComplexity(final).subscribe(
            (data) => {
                if (data.error) {
                    toastr.remove();
                    toastr.error("Something went wrong!");                    
                }else{
                    toastr.remove();
                    toastr.success("Successfully updated");
                }
            });
     }

public addcomplexity(final){
this.usersService.postComplexity(final).subscribe(
            (data) => {
                if (data.error) {
                    toastr.remove();
                    toastr.error("Something went wrong!");                    
                }else{
                    toastr.remove();
                    toastr.success("Successfully Add");
                }
            });

}


}



@Component({
    selector: 'app-cngpass',
    templateUrl: './changepassword.component.html'
})
export class PasswordChangeComponent implements OnInit {

    ownerProfile: FormGroup;
    returnUrl: string;
    err:any;
    passwordp : any = '';
    MutchPassword :any = false;
    fulldetail : any;
    oldmatch  : any;
    newo : any = false;


    constructor(public lf: FormBuilder, 
                public router: Router,        
                public route: ActivatedRoute,
                public usersService : UsersService,
                public authService : AuthService
                ){ }


    ngOnInit() {


      this.usersService.getComplexity().subscribe(data=>{      
         this.passwordp = data.message[0].adminpasscomplexity.regex;

         console.log(this.passwordp);
         this.setpasswordmessage(data.message[0].adminpasscomplexity.name);
         this.newo = true;

         this.ownerProfile = this.lf.group({          
            _id: ['', Validators.required],
            oldpassword: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            confirmpassword: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            matchpass : ['',Validators.required],
            oldmatch : ['',Validators.required]
        });
        this.fulldetail = JSON.parse(localStorage.getItem('currentUser'));
        this.ownerProfile.controls["_id"].setValue(this.fulldetail._id);

        this.ownerProfile.valueChanges
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


      public oldpassword(){
            console.log(this.fulldetail.password == this.ownerProfile.value.oldpassword);

            if(this.fulldetail.password == this.ownerProfile.value.oldpassword){         
            this.ownerProfile.controls["oldmatch"].setValue(true);
            this.oldmatch = false;
            }else{
            this.ownerProfile.controls["oldmatch"].setValue("");
            this.oldmatch = true;
            }
         }


    public matchpassword(){
    if(this.ownerProfile.value.password == this.ownerProfile.value.confirmpassword){
     this.ownerProfile.controls["matchpass"].setValue(true);
     this.MutchPassword = false;
     console.log(this.ownerProfile.value);
    }else{
     this.ownerProfile.controls["matchpass"].setValue("");
     this.MutchPassword = true;
    }
    }


    public ownerUpdate(){
     
      console.log(this.ownerProfile.value, this.fulldetail);
       var obj = {password : this.ownerProfile.value.password};
       this.authService.resetAdminPassword(this.fulldetail._id,obj).subscribe(
            (data) => {
                //this.alertService.success('Password update successfully', true);
                toastr.success('updated');
                this.router.navigate(['/admin/dashboard']);
            });
          }


 public onValueChanged(data?: any) {

    if (!this.ownerProfile) {return;  }
    const form = this.ownerProfile;

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
    'oldpassword' : '',
    'password'  : ''   
  };

  validationMessages = {   
     'oldpassword' : {
        'required':      'Password is required.',
        'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
       },
      'password' : {
        'required':      'Password is required.',
        'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
       }         
      };

}