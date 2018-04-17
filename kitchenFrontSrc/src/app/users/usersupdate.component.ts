import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService, UsersService, KitchenService } from '../service/index';
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
    selector: 'app-users',
    templateUrl: './usersupdate.component.html',
    styles: []
})
export class UsersupdateComponent implements OnInit {

    users:any;
    userAddModel: FormGroup;
    err:any;
    id :any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    passwordp : any = '';
    newo : any = false;

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

    constructor(public lf: FormBuilder, public alertService: AlertService, public kitchenService : KitchenService , public usersService: UsersService,public router: Router,public activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            
        });
        this.usersService.getComplexity().subscribe(data=>{       
            this.passwordp = data.message[0].ownerpasscomplexity.regex;         
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
            this.newo = true;

            this.userAddModel = this.lf.group({
                _id: ['', Validators.required],
                ownerfirstname: ['', Validators.required],
                ownerlastname: ['', Validators.required],
                email: ['', [Validators.required, Validators.pattern(this.emailp)]],
                username: [''],
                password: [],
            });
            this.getUsers(this.id);

            this.userAddModel.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged(); // (re)set validation messages now
        });
    }

    public setpasswordmessage(name){
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

    public getUsers(id) {
        this.kitchenService.getOneNewOwner(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            // this.userAddModel.controls['firstname'].setValue(this.users.firstname);
        });
    }

    public userUpdate() {
        console.log(this.userAddModel.value);
        this.userAddModel.value.username = this.userAddModel.value.email;
        this.kitchenService.updateUserNewOwner(this.userAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info('Owner Updated successfully');
                //this.alertService.success('Owner Updated Successfully', true);
                this.router.navigate(['/admin/users']);
            });
    }


    onValueChanged(data?: any) {
        if (!this.userAddModel) {return;  }
        const form = this.userAddModel;

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
    selector: 'app-owner-partner',
    templateUrl: './ownerpartnerupdate.component.html',
    styles: []
})
export class OwnerpartnerupdateComponent implements OnInit {

	users:any;
    userAddModel: FormGroup;
    err:any;
    id :any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    passwordp : any = '';
    newo : any = false;

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

    constructor(public lf: FormBuilder, public alertService: AlertService, public kitchenService : KitchenService , public usersService: UsersService,public router: Router,public activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            
        });
        this.usersService.getComplexity().subscribe(data=>{       
            this.passwordp = data.message[0].ownerpasscomplexity.regex;         
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
            this.newo = true;

            this.userAddModel = this.lf.group({
                _id: ['', Validators.required],
                ownerfirstname: ['', Validators.required],
                ownerlastname: ['', Validators.required],
                email: ['', [Validators.required, Validators.pattern(this.emailp)]],
                username: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
                password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            });
            this.getUsers(this.id);

            this.userAddModel.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged(); // (re)set validation messages now
        });
    }

    public setpasswordmessage(name){
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

    public getUsers(id) {
        this.kitchenService.getOnePartner(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            // this.userAddModel.controls['firstname'].setValue(this.users.firstname);
        });
    }

    public updatePartner() {
        console.log(this.userAddModel.value);
        this.kitchenService.updateUserNewOwner(this.userAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info('Owner Updated successfully');
                //this.alertService.success('Owner Updated Successfully', true);
                this.router.navigate(['/admin/users']);
            });
    }


    onValueChanged(data?: any) {
        if (!this.userAddModel) {return;  }
        const form = this.userAddModel;

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
