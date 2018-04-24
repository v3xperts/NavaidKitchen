import { Component, OnInit,ViewEncapsulation, ElementRef , ViewChild , NgZone, NgModule ,ChangeDetectorRef} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl ,ReactiveFormsModule } from '@angular/forms';

import { FileUploader } from 'ng2-file-upload';
import { AuthService, KitchenService, UsersService, MasterService , KitchenItemService , ComboService, WeekMonthService, LocalJsonService} from '../service/index';
//import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import * as globalVariable from "../global";
declare var $ : any;
declare var google : any;
declare var NProgress : any;
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
    selector: 'app-owner',
    templateUrl: './owner.component.html',
    styles: ['body{background-color:#fff;margin-top:0px;}'],
    encapsulation: ViewEncapsulation.None
})
export class OwnerComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}


@Component({
    selector: 'app-ownerregister',
    templateUrl: './ownerregister.component.html'
})
export class OwnerregisterComponent implements OnInit {

    loginForm: FormGroup;
    returnUrl: string;
    err:any;
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


    constructor(
        public lf: FormBuilder, 
        public kitchenService: KitchenService,
        public router: Router,        
        public route: ActivatedRoute,
        public usersService : UsersService       
        ) {}

    ngOnInit() {

        this.usersService.getComplexity().subscribe(data=>{       
            this.passwordp = data.message[0].ownerpasscomplexity.regex;

            //console.log(this.passwordp);
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
            this.newo = true;

            this.loginForm = this.lf.group({
                username: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
                password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
                email: ['', [Validators.required, Validators.pattern(this.emailp)]],
            });

            this.loginForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged(); // (re)set validation messages now
            toastr.clear();
        });

        //   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'owner/login';
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

    register(){
        NProgress.start();
        this.kitchenService.addOwner(this.loginForm.value).subscribe(            
            (data) => {
                if (data.error) {
                    NProgress.done();
                    toastr.remove();
                    toastr.info('Already exist');                    
                }else{
                    NProgress.done();
                    toastr.remove();
                    toastr.success('Owner Registered Successfully');                   
                    this.router.navigate(['owner/login']);
                }
            }, (err)=>{
                NProgress.done();
                toastr.remove();
                toastr.error('Something Went Wrong'); 

                // this.alertService.error('Bad Credential', true);
                // this.router.navigateByUrl('/admin/login', { queryParams: { err: 1 } }); 

            });
    }

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
}



@Component({
    selector: 'app-owner-mailactivate',
    template: ''
})

export class OwnermailactivateComponent implements OnInit {

    cid : any;
    constructor(public router : Router, public activatedRoute : ActivatedRoute, public ownerSer: KitchenService) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.cid = params['activationid'];  
            this.mailactivate();              
        });    
    }

    public mailactivate(){
        var obj = {_id : this.cid, status: true};
        this.ownerSer.updateUser(obj).subscribe((data) => {
            console.log(data);
            if (data.error) {
                toastr.remove();
                toastr.error("Something Wrong"); 

            }else{

                toastr.remove();
                toastr.success("Account Activated"); 

                //alert("Account Activated");

                this.router.navigate(['/']);
            }
        });  
    }
}


@Component({
    selector: 'app-ownerlogin',
    templateUrl: './ownerlogin.component.html'
})
export class OwnerloginComponent implements OnInit {

    loginForm: FormGroup;
    returnUrl: string;
    err:any;
    passwordp : any = '';

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public usersService: UsersService,
        public router: Router,       
        public route: ActivatedRoute ) { }

    ngOnInit() {
        toastr.options = { positionClass: 'toast-top-right'};
        
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'owner/profile';
        this.loginForm = this.lf.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
        });
        this.loginForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now 

    }


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
        this.authService.getOwner(this.loginForm.value).subscribe(
            (data) => {
                if (data.status) {
                    console.log(data);
                    data.data['type']= data.type
                    let obj = data.data;
                    //obj['type']= data.type;
                    console.log('obj',obj)
                    localStorage.setItem('currentOwner', JSON.stringify(data.data));
                    NProgress.done();
                    toastr.remove();
                    toastr.success('Login successful');

                    //this._flashMessagesService.show('Login successful', { cssClass: 'alert-success', timeout: 10000 });

                    this.router.navigate([this.returnUrl]);
                }else{
                    NProgress.done();
                    toastr.remove();
                    toastr.error('Bad Credential');
                    this.invaliduserpass();
                    //this.alertService.error('Bad Credential', true);
                    this.router.navigate(['owner/login']);
                   }
            },
            (err)=>{
                NProgress.done();
                toastr.remove();
                this.invaliduserpass();
                toastr.error('Bad Credential');

                //this.alertService.error('Bad Credential', true);
                //this.router.navigateByUrl('/admin/login', { queryParams: { err: 1 } });  

            });
    }

    formErrors = {
        'password'  : ''   
    };

    validationMessages = {   
        'password' : {
            'required':      'Password is required.',
            'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
        }        
    };
}


@Component({
    selector: 'app-ownerprofile',
    templateUrl: './ownerprofile.component.html'
})
export class OwnerprofileComponent implements OnInit {
    
    public latitude: number;
    public longitude: number;
    public zoom: number;
    ownerProfile: FormGroup;
    filenameAddModel: FormGroup;
    returnUrl: string;
    err:any;
    file : any = "";
    ownerinfo : any;
    photos : any = [];
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    public uploader:FileUploader = new FileUploader({url:globalVariable.imageUrlupload});
    public url1 = globalVariable.imageUrl;
    public addresspart: any = [];
    public progress : any = 0;
    public phoneRegex: any = /^[(]{0,1}[2-9]{1}[0-9]{1,2}[)]{0,1}[-\s\.]{0,1}[0-9]{2}[-\s\.]{0,1}[0-9]{7}$/;
    public componentForm : any = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public kitchenService: KitchenService,
        public router: Router,        
        public route: ActivatedRoute,
        public changeDetector: ChangeDetectorRef 
        ){ }



    ngOnInit() {
        this.latitude = 0;
        this.longitude = 0;
        var patternq = /^[+]?\d+(\.\d+)?$/;
         this.filenameAddModel = this.lf.group({
            documentname : ['', Validators.required],
            filename: ['']
        });
        this.ownerProfile = this.lf.group({
            _id: ['', Validators.required],
            username: [''],
            password: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]],
            ownerphoneno: ['', [Validators.required, Validators.pattern(patternq)]],            
            owneraddress: ['', Validators.required],
            ownerfirstname: ['', Validators.required],
            ownerlastname: ['', Validators.required],
            ownergovids: [],
            imgenable : ['', Validators.required]
        });
        this.ownerinfo = JSON.parse(localStorage.getItem('currentOwner'));
        this.ownerProfile.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now  
        toastr.clear(); 
        this.setCurrentPosition();
        this.initMap();
        
    } 

    public initMap(){
            var input = (<HTMLInputElement>document.getElementById('pac-input'));
            var options = {types: []};
            var autocomplete = new google.maps.places.Autocomplete(input,options);
            autocomplete.addListener('place_changed', () => {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place) {                   
                    this.ownerProfile.controls["owneraddress"].setValue((<HTMLInputElement>document.getElementById("pac-input")).value);
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 15;
                  }
            });
            this.ownerProfile.patchValue(this.ownerinfo.ownerId);
            if(this.ownerinfo.ownerId.ownergovids.length > 0){
               this.ownerProfile.controls["imgenable"].setValue(true);
            }
           }


    public setCurrentPosition() {
        if((this.latitude == 0) && (this.longitude == 0)){
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.zoom = 15;
                });
            }     
        } else{
            this.latitude = this.latitude;
            this.longitude = this.longitude;
            this.zoom = 15;
        } 
       }

        public clearinputs(data){
        this.ownerProfile.controls["owneraddress"].setValue(data._value);  
        }


        public clickUrl(doc){
            var link = this.url1 + doc;  
            window.open(link, "_blank");
           }

        public  ownerfile(event){

        this.file_uploading();
        }

        public setFileName(){
            if(this.ownerProfile.value.ownergovids) {
             this.ownerProfile.controls["ownergovids"].setValue([this.filenameAddModel.value].concat(this.ownerProfile.value.ownergovids));
             }
            $("#fileUploadModel").modal("hide");
            setTimeout(()=>{
                console.log("this.gov id", this.ownerProfile.value.ownergovids);
                this.imageUpload();
            }, 1000);
        }

        public file_uploading(){
                console.log("dfd", this.uploader.queue.length);         
                this.progress = 0;
                this.ownerProfile.controls["imgenable"].setValue("");
                this.uploader.uploadAll();
                this.photos = [];
                this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                    var responsePath = JSON.parse(response);
                   
                        this.filenameAddModel.controls["filename"].setValue(responsePath.filename);
                        this.filenameAddModel.controls["documentname"].setValue("");
                        $("#fileUploadModel").modal({
                        backdrop: 'static',
                        keyboard: false, 
                        show: true
                        }); 
                    this.photos.push(responsePath.filename);            
                    };          
                this.uploader.onProgressAll = (progress:any) =>{            
                    if(progress == 100){
                     this.progress =  (progress - 1); 
                    }else{
                    this.progress = progress;
                    } 
                }
                this.uploader.onCompleteAll = () => {
                    this.ownerProfile.controls["imgenable"].setValue(true);
                    
                    setTimeout(() => {
                    this.progress= 100;
                    this.imageUpload();
                    }, 1000);  

                };
                }

        public imageUpload(){
                var obj = {"_id": this.ownerinfo.ownerId._id, "ownergovids" : this.ownerProfile.value.ownergovids };
                this.kitchenService.updateUserNewOwner(obj).subscribe((data) => {  
                localStorage.removeItem('currentOwner');   
                localStorage.setItem('currentOwner', JSON.stringify(data.message));
                this.ownerinfo.ownerId.ownergovids = JSON.parse(localStorage.getItem('currentOwner')).ownerId.ownergovids;
                this.ownerProfile.controls["ownergovids"].setValue(JSON.parse(localStorage.getItem('currentOwner')).ownerId.ownergovids);
                });
               }


        public removeImage(index){
         this.ownerProfile.value.ownergovids.splice(index, 1);
         this.imageUpload();
        }       

        public ownerUpdate(){
        this.ownerProfile.controls["username"].setValue(this.ownerProfile.value.email);
        this.kitchenService.updateUserNewOwner(this.ownerProfile.value).subscribe((data) => {             
            localStorage.removeItem('currentOwner');
            localStorage.setItem('currentOwner', JSON.stringify(data.message));                
            toastr.remove();
            toastr.info('Profile updated successfully');                
            this.router.navigate(['owner/kitchen-detail']);
        });
    }


    onValueChanged(data?: any) {
        if (!this.ownerProfile) {return;  }
        const form = this.ownerProfile;
        for (const field in this.formErrors) {
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
        'ownerfirstname' : '',
        'ownerlastname' : '',
        'ownerphoneno' : ''     
    };

    validationMessages = {
        'ownerfirstname' : {
            'required':      'Email is required.'
        },
        'ownerlastname' : {
            'required':      'Email is required.'
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
        },
        'ownerphoneno' : {
            'required':   'Phone no. is required.',
            'minlength' : 'Phone no. should minimum 4 digit.',
            'pattern'   : 'Password use only Numbers Digits'
        }  
    };
}

@Component({
    selector: 'app-ownerchangepassword',
    templateUrl: './ownerchangepassword.component.html'
})
export class OwnerchangepasswordComponent implements OnInit {

    ownerProfile: FormGroup;
    returnUrl: string;
    err:any;
    passwordp : any = '';
    MutchPassword :any = false;
    fulldetail : any;
    oldmatch  : any;
    newo : any = false;


    constructor(public lf: FormBuilder, 
        public authService: AuthService,
        public kitchenService: KitchenService,
        public router: Router,        
        public route: ActivatedRoute,
        public usersService : UsersService ){ }


    ngOnInit() {
        this.usersService.getComplexity().subscribe(data=>{      
            this.passwordp = data.message[0].ownerpasscomplexity.regex;
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
            this.newo = true;

            this.ownerProfile = this.lf.group({          
                _id: ['', Validators.required],
                oldpassword: ['', [Validators.required]],
                password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
                confirmpassword: ['', [Validators.required, Validators.pattern(this.passwordp)]],
                matchpass : ['',Validators.required],
                oldmatch : ['',Validators.required]
            });

            this.fulldetail = JSON.parse(localStorage.getItem('currentOwner'));
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


        if(this.fulldetail.ownerId.password == this.ownerProfile.value.oldpassword){         
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

        }else{
            this.ownerProfile.controls["matchpass"].setValue("");
            this.MutchPassword = true;
        }
    }


    public ownerUpdate(){
        var obj = {_id : this.fulldetail.ownerId._id, password : this.ownerProfile.value.password};
        this.kitchenService.updateOwnerPassword(obj).subscribe(
            (data) => {
                if (data.error) {
                    toastr.remove();
                    toastr.error("Something went wrong!");                    
                }else{
                    toastr.remove();
                    toastr.success("Successfully updated"); 
                    localStorage.setItem('currentOwner', JSON.stringify(data.message)); 
                    this.ownerProfile.reset();                 
                    this.router.navigate(['owner/kitchen-detail']);
                }
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

@Component({
    selector: 'app-kitchenupdate',
    templateUrl: './kitchenupdate.component.html',
    styles: [`
    sebm-google-map {
        height: 500px;
    }
    `]
})
export class KitchenupdateComponent implements OnInit {  

    public restaurantData: FormGroup;
    //@ViewChild("search")
   // public searchElementRef: ElementRef;
   // public searchControl: FormControl;
    public latitude: number;
    public longitude: number;  
    public lat : any;
    public long : any;
    public zoom: number;
    public returnUrl: string;
    public err:any;
    public componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    public placeSearch: any;
    public autocomplete: any;
    public addresspart: any = [];
    public markere : any ;
    public filesize : any = "";
    public ownerinfo : any = {image : []};
    public addresss : any;
    public url1 = globalVariable.imageUrl;
    public uploader:FileUploader = new FileUploader({url:globalVariable.imageUrlupload, allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG' ]});
    public m : any = {drag : true, zoom : 15};
    public error1 : any = false;
    public chgimages : any = false;
    public progress : any = 0; 
    public userinfo: any;
    public file_type : any = false;
    public currency :any = [];

    constructor( public lf: FormBuilder, 
        public authService: AuthService,
        public kitchenService: KitchenService,
        public router: Router,        
        public route: ActivatedRoute,
        public masterService: MasterService,
        public localJsonService: LocalJsonService     
        ){ this.getAllCountryCurrency(); }

    ngOnInit() {
        this.m.zoom = 15;
        this.latitude = 0;
        this.longitude = 0;
        this.restaurantData = this.lf.group({
            _id: ['', Validators.required],
            restaurantname: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
            address: [],
            city: [],
            country: [],
            shortName: [],
            currency: [],
            zipcode: [],
            phoneno1: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^\d+$/)]],
            phoneno2: ['', [Validators.minLength(4), Validators.pattern(/^\d+$/)]],
            phoneno3: ['', [Validators.minLength(4), Validators.pattern(/^\d+$/)]],
            phoneno4: ['', [Validators.minLength(4), Validators.pattern(/^\d+$/)]],
            image : [],
            lat : [],
            lng : [],
            filesize : ['', Validators.required]
        });
        this.userinfo = JSON.parse(localStorage.getItem('currentOwner'));
        this.latitude = this.userinfo.lat;
        this.longitude = this.userinfo.lng;
        this.getUsers(JSON.parse(localStorage.getItem('currentOwner'))._id); 
        this.restaurantData.controls["filesize"].setValue(true); 
        this.restaurantData.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); 
        toastr.clear();  
        this.initMap(); 
       }

  
   initMap(){
    var input = (<HTMLInputElement>document.getElementById('pac-input'));
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: parseFloat(this.userinfo.lat), lng: parseFloat(this.userinfo.lng)},
      zoom: this.m.zoom
    });
    var autocomplete = new google.maps.places.Autocomplete(input, {types: []});
    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(map, 'zoom_changed', () => {
    var zoomLevel = map.getZoom();
    this.zoomChange(zoomLevel);
    });

    var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29),
          position: {lat: parseFloat(this.userinfo.lat), lng: parseFloat(this.userinfo.lng)},
          visible: true,
          draggable: true
        });
    google.maps.event.addListener(
        marker,
        'dragend',
        () => {
        var mlat = marker.position.lat();
        var mlng = marker.position.lng();
        this.getgeo(mlat, mlng);
            });
        autocomplete.addListener('place_changed', () => {
        marker.setVisible(true);
        var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          } 
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(this.m.zoom);  
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
             this.addresspart = [];
             console.log("place", place);
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        var val = place.address_components[i][this.componentForm[addressType]]; 
                        if(addressType == 'locality'){
                            this.restaurantData.controls["city"].setValue(val);
                        }
                        if(addressType == 'postal_code'){
                            this.restaurantData.controls["zipcode"].setValue(val);
                        }
                        if(addressType == 'country'){
                            this.restaurantData.controls["country"].setValue(val);
                            this.restaurantData.controls["shortName"].setValue(place.address_components[i]["short_name"]);
                            this.restaurantData.controls["currency"].setValue(this.currency[place.address_components[i]["short_name"]]);
                        } 
                        this.restaurantData.controls["address"].setValue(input.value); 
                        this.addresspart.push(val);           
                    }
                    } 
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
                this.restaurantData.controls["lat"].setValue(this.latitude);
                this.restaurantData.controls["lng"].setValue(this.longitude);
                this.m.zoom = 15;
          }
        });
       }

     
    public getAllCountryCurrency(){
      this.localJsonService.getCurrencyJson().subscribe((data) => {
      this.currency = data;
      });
    }


    public zoomChange(e){
        this.m.zoom = e; 
    }

    public getgeo(lat, long){
        var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(lat, long);
                geocoder.geocode({ 'latLng': latlng }, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    this.addresss =results[1].formatted_address; 
                    for (var i = 0; i < results[1].address_components.length; i++) {
                        var addressType = results[1].address_components[i].types[0];

                        if (this.componentForm[addressType]) {
                            var val = results[1].address_components[i][this.componentForm[addressType]]; 
                            if(addressType == 'locality'){
                                this.restaurantData.controls["city"].setValue(val.toLowerCase());
                            }else{
                                this.restaurantData.controls["city"].setValue('');
                            }
                            if(addressType == 'postal_code'){
                                this.restaurantData.controls["zipcode"].setValue(val);
                            }
                            if(addressType == 'country'){
                                this.restaurantData.controls["country"].setValue(val.toLowerCase());
                                this.restaurantData.controls["shortName"].setValue(results[1].address_components[i]["short_name"]);
                                this.restaurantData.controls["currency"].setValue(this.currency[results[1].address_components[i]["short_name"]]);
                            }            
                            this.restaurantData.controls["address"].setValue(this.addresss);                                            
                            this.restaurantData.controls["lat"].setValue(lat);
                            this.restaurantData.controls["lng"].setValue(long);
                            }
                            }                             
                         } else {
                        toastr.remove();
                        toastr.warning('Please Move Again!'); 
                        }
                        } else {
                        toastr.remove();
                        toastr.error('Something Went Wrong Move Again!'); 
                        }
                    });
    }

    public onChangeImg(event){
            this.checkEvent(event);
            this.progress = 0;
            if((Math.round((event.srcElement.files[0].size/1048576) * 10) / 10) < 2.0){         
                this.filesize = true; 
                this.restaurantData.controls["filesize"].setValue(true);   
                this.error1 = false;  
                this.chgimages = true;
            }else{
                this.chgimages = false;
                this.filesize = "";
                this.restaurantData.controls["filesize"].setValue(""); 
                this.error1 = true;
            }
        }


        public checkEvent(event){
                if(event.target.files.length > 0){    
                var extarray = ["jpeg","jpg","png","JPEG","PNG","JPG"];
                var files = event.target.files;
                var farr = files[0].name.split(".");
                var ext = farr[farr.length - 1];        
                if(extarray.indexOf(ext) != -1){
                this.file_type = false;
                this.restaurantData.controls['image'].setValue(files[0].name);
                this.chgimages = true;
                }else{
                this.file_type = true;
                this.chgimages = false;
                this.restaurantData.controls['image'].setValue("");
                }
                }
            } 


    public clearinputs(data){
        this.restaurantData.controls["address"].setValue(data._value);        
        this.restaurantData.controls["city"].setValue('');
        this.restaurantData.controls["zipcode"].setValue('');
        this.restaurantData.controls["country"].setValue('');
        this.restaurantData.controls["lat"].setValue(this.lat);
        this.restaurantData.controls["lng"].setValue(this.long);
    }


    public setCurrentPosition() {
        if((this.latitude == 0) && (this.longitude == 0)){
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.m.zoom = 15;
                });
            }     
            }else{
            this.latitude = this.latitude;
            this.longitude = this.longitude;
            this.m.zoom = 15;
            }
        }



    public getUsers(id) {
        this.kitchenService.getOne(id).subscribe(users => { 
            this.restaurantData.patchValue(users.message);
            this.restaurantData.controls["address"].setValue(users.message.address); 
            this.ownerinfo = users.message;
            this.m.zoom = 15;
            if(typeof users.message.loc != 'undefined'){
                this.latitude = users.message.loc[0];
                this.longitude = users.message.loc[1];
            }else{
                this.setCurrentPosition();
            }                
        });
       }



    public restaurantUpdate(){
        if(this.chgimages == true){
            this.uploader.uploadAll(); 
            this.uploader.onProgressItem = (file: any, progress: any) =>{
                if(progress == 100){
                setTimeout(() =>{
                this.progress = progress;
                }, 700);
                }else{
                this.progress = progress;
                }
            }
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);                
                this.restaurantData.controls['image'].setValue(responsePath.filename);        
                this.updated();
            }
            }else{
                this.updated();
            }
           }

    public updated(){
        var ownerjson = JSON.parse(localStorage.getItem("currentOwner"));
        ownerjson.lat = this.restaurantData.value.lat;
        ownerjson.lng = this.restaurantData.value.lng;
        localStorage.removeItem("currentOwner");
        localStorage.setItem("currentOwner", JSON.stringify(ownerjson));
        console.log("this.restaurantData.value", this.restaurantData.value, this.ownerinfo);
       if(this.ownerinfo.completeprofilenameaddress == 0 || !this.ownerinfo.completeprofilenameaddress){
           this.restaurantData.value["completeprofilenameaddress"] = 50; 
        }
        this.addCityIfCountryExist();
       
        }

    public addCityIfCountryExist(){

            console.log("0fgfg country", this.restaurantData.value);
            var countrys = [];
            this.masterService.getAllCountry().subscribe((country)=>{
            countrys = country.message;
            var cindex = country.message.findIndex((countryn)=> { return countryn.countryName.toLowerCase() == this.restaurantData.value.country.toLowerCase();
            });    
            console.log("fgfg index", countrys[cindex]);
            if(cindex > -1){
                this.restaurantData.value.city = this.restaurantData.value.city.toLowerCase();
                this.restaurantData.value.country = this.restaurantData.value.country.toLowerCase();
                this.kitchenService.updateKitchen(this.restaurantData.value).subscribe(
                (data) => {

                var owndata = {};
                if(localStorage.getItem('currentOwner')){
                 owndata = JSON.parse(localStorage.getItem('currentOwner'));
                 console.log("this.restaurantData.value", this.restaurantData.value, owndata);
                }
                for (var x in this.restaurantData.value) owndata[x] = this.restaurantData.value[x];
                   console.log(owndata, "owndata");
                localStorage.setItem("currentOwner", JSON.stringify(owndata));
                toastr.remove();
                toastr.success('Kitchen basic detail updated successfully');
                this.router.navigate(['owner/kitchen-services']);
                });      

                var countryIdObj = {countryid : country.message[cindex]._id};    
                this.masterService.getcitylist(countryIdObj).subscribe((city)=>{
                console.log("cityil", city);                
                var cityindex = city.message.findIndex((cityn)=> { return cityn.cityName == this.restaurantData.value.city
                });  
                if(cityindex == -1){
                 console.log("cityindex", cityindex); 
                 var addcityobj = {countryId: country.message[cindex]._id, cityName: this.restaurantData.value.city};
                 
                 this.masterService.addCity(addcityobj).subscribe((addedcity) => {
                   console.log("addedcity", addedcity);
                 });  

                }
                });
                }else{
                    toastr.remove();
                    toastr.error("We are not providing service in this country.");
                }
            });

            }
    
    onValueChanged(data?: any) {
        if (!this.restaurantData) {return;  }
        const form = this.restaurantData;

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
        'restaurantname': '',
        'phoneno1': '',    
        'phoneno2': '',    
        'phoneno3': '' ,   
        'phoneno4': '' ,   
    };

    validationMessages = {
        'restaurantname': {
            'required':      'Username is required.',
            'minlength':     'Username must be at least 4 and maximum 64 characters long.',
            'maxlength':     'Username cannot be more than 64 characters long.',
            'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
        },

        'phoneno1' : {
            'required':   'Phone no. is required.',
            'minlength': 'Phone should be minimum length 4 Digits',
            'pattern'   :    'Phone Number field should only accept Number, not alphabets'
        }, 'phoneno2' : {
            'required':   'Phone no. is required.',
            'minlength': 'Phone should be minimum length 4 Digits',
            'pattern'   :    'Phone Number field should only accept Number, not alphabets'
        }, 'phoneno3' : {
            'required':   'Phone no. is required.',
            'minlength': 'Phone should be minimum length 4 Digits',
            'pattern'   :    'Phone Number field should only accept Number, not alphabets'
        } ,'phoneno4' : {
            'required':   'Phone no. is required.',
            'minlength': 'Phone should be minimum length 4 Digits',
            'pattern'   :    'Phone Number field should only accept Number, not alphabets'
        } 

    };    
}

@Component({
    selector: 'app-forget',
    templateUrl: './forgetPassword.component.html',
    styles: []
})
export class ForgetOwnerComponent implements OnInit {

    forgetForm: FormGroup;
    returnUrl: string;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,        
        public route: ActivatedRoute){}
    ngOnInit() {
        this.forgetForm = this.lf.group({
            email: ['', [Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)]]
        });
        this.forgetForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
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

    forgetPass(){
        this.authService.forgetPassword(this.forgetForm.value).subscribe(
            (data) => {

                if (data.error) {
                    //this.alertService.error(data.message, true);
                    toastr.remove();
                    toastr.error('You are entered wrong email!');
                    this.router.navigate(['/owner/forget-password']);
                }else{
                    setTimeout(function(){
                        NProgress.done(); 
                    }, 1000); 
                    toastr.remove();
                    toastr.success('Check your email to reset password!');
                    this.router.navigate(['/owner/login']);
                }
            }
            );
    }
}

@Component({
    selector: 'app-forget',
    templateUrl: './ownerpartnerpassword.component.html',
    styles: []
})
export class OwnerpartnermailactivateComponent implements OnInit {

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
        public kitchenService: KitchenService,
        public router: Router,        
        public activatedRoute: ActivatedRoute,
        public usersService : UsersService){}


    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['activationid'];
        });
        this.usersService.getComplexity().subscribe(data=>{        
            this.passwordp = data.message[0].ownerpasscomplexity.regex;
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
            this.newo = true;

            this.forgetForm = this.lf.group({
                password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
                newpassword: ['', Validators.required],
                matchpass: ['', Validators.required],
            });

            this.forgetForm.valueChanges.subscribe(data => this.onValueChanged(data));
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
        this.forgetForm.value['status'] = true;
        this.kitchenService.updatePartner(this.id,this.forgetForm.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.success('Your New Password Created Successfully!');   
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);             
                
            });
    }
}

@Component({
    selector: 'app-forget',
    templateUrl: './resetPasswordOwner.component.html',
    styles: []
})
export class ResetPasswordOwnerComponent implements OnInit {

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
        public activatedRoute: ActivatedRoute,
        public usersService : UsersService){}


    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
        });
        this.usersService.getComplexity().subscribe(data=>{        
            this.passwordp = data.message[0].ownerpasscomplexity.regex;
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
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
        this.authService.resetPassword(this.id,this.forgetForm.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.success('Password Changed Successfully');   
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 3000);             
                
            });
    }
}


@Component({
    selector: 'app-location',
    templateUrl: './kitchenlocation.component.html',
    styles: [`
    sebm-google-map {
        height: 700px;
    }
    `]
})

export class KitchenupdatelocationComponent implements OnInit {

    storedaddress :any;        
    zoom : any;
    restaurantData:FormGroup;
    latitude :any;
    longitude  :any;
    m : any = {
        drag : true,
        latitude: 0,
        longitude: 0
    };
    public componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };        
    public addresss : any = "";


    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,            
        public activatedRoute: ActivatedRoute,
        public kitchenService : KitchenService,        
        ){}

    ngOnInit() {
        this.restaurantData = this.lf.group({
            _id: ['', Validators.required],
            address : ['', Validators.required],
            city: [],
            country: [],
            zipcode: [],
            lat : [],
            lng : []           
        });
    } 
}

@Component({
    selector: 'kitchen-services',
    templateUrl: './kitchen-services.component.html',
    styles: [`sebm-google-map {
        height: 700px;
    }`]
})
export class OwnerKitchenServicesComponent implements OnInit {

    openingAddModel: FormGroup;
    partnerdata : FormGroup;
    restaurants: any = {};
    user: any;
    optionSet: any = {};
    preoptionSet: any = {};
    ownerinfo : any;
    partners : any = [];
    kitchenservicesobj : any = [];
    offeringobj  : any  = [];
    foodtypeobj : any = [];
    bankinfoobj : any = [];  
    finalObject : any = [];
    sta : any = {status : false, value : ""};
    cname :any ;
    bitems : any; 
    fastestdelivery : any;
    docs : any = [];
    maxerror : any = false;
    cousines : any = [];
    progress : any = 0;
    ownerinfoo : any = {};
    public url1 = globalVariable.imageUrl;
    public uploader:FileUploader = new FileUploader({url:globalVariable.imageUrlupload});
    serviceAllow:any = {"menuservice": false, "mealpackageservice": false, "comboservice" : false, "cateringservice" : false};
    timesetup : any = [{name : "monday", status: false, times : [{open: "12:00 AM" , close: "11:59 PM"}]},
                       {name : "tuesday", status: false, times : [{open: "12:00 AM" , close: "11:59 PM"}]},
                       {name : "wednesday", status: false, times : [{open: "12:00 AM" , close: "11:59 PM"}]},
                       {name : "thursday", status: false, times : [{open: "12:00 AM" , close: "11:59 PM"}]},
                       {name : "friday", status: false, times : [{open: "12:00 AM" , close: "11:59 PM"}]},
                       {name : "saturday", status:false, times : [{open: "12:00 AM" , close: "11:59 PM"}]},
                       {name : "sunday", status: false, times : [{open: "12:00 AM" , close: "11:59 PM"}]}];


    err:any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    passwordp : any = '';
    unlength : any = 0;
    klength : any = 0;
    newo : any = false;
    MutchPassword :any = false;
    
    restCusiObj : any = [];
    imageUrl : any = globalVariable.imageUrl2;


    formErrors = {
        'username': '',
        'email' : '',
        'password' : '',
        'restaurantname': ''  
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
        },
        'restaurantname': {
            'required':      'Name is required.',
            'minlength':     'Name must be at least 4 and maximum 64 characters long.',
            'maxlength':     'Name cannot be more than 64 characters long.',
            'pattern'   :    'Name cannot use Numberic, Special characters, Space Etc. '
        }       
    };




    constructor(
        public lf: FormBuilder, 
        public router: Router,            
        public activatedRoute: ActivatedRoute,
        public kitchenService : KitchenService,
        public masterService: MasterService,
        public usersService: UsersService,
        ){ }

    ngOnInit() {
        this.ownerinfoo = JSON.parse(localStorage.getItem('currentOwner'));
        console.log('this.ownerinfoo')
        console.log(this.ownerinfoo)
        this.getDetailOne();    
        this.getpartner();
        this.openingAddModel = this.lf.group({           
            bakeryitems : [],
            deliveryservice : [],
            openingstatus : [],
            kitchencapacity : [],
            cateringcapacity : [] ,
            documentation : [],
            fastestdelivery : [],
            minimumorder : [],
            mindeliveryime : [],
            imgenable : ['', Validators.required],
            _id: []
        });
        this.usersService.getComplexity().subscribe(data=>{ 

            this.passwordp = data.message[0].ownerpasscomplexity.regex;         
            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
            this.newo = true;

            this.partnerdata = this.lf.group({
                OwnerId :  [],
                ownerfirstname: ['', Validators.required],
                ownerlastname: ['', Validators.required],            
                username: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
                email: ['', [Validators.required, Validators.pattern(this.emailp)]],
                matchpass : ['',Validators.required],
                password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
                newpassword: ['', [Validators.required, Validators.pattern(this.passwordp)]]
            });
            console.log(this.ownerinfoo.ownerId._id);       

            console.log(this.partnerdata.value);

            this.partnerdata.valueChanges
            .subscribe(data => this.onValueChanged(data));
            this.onValueChanged(); // (re)set validation messages now

        });

        this.initailfun();
        this.openingAddModel.controls["imgenable"].setValue(true);
        this.getpartner();     
          
    }



        public cuisinesAdd(id){
        const index = this.restCusiObj.findIndex(item => item === id);               
        if(index != -1){
           this.restCusiObj.splice(index,1);               
        }else{             
           this.restCusiObj.push(id);               
        }   
        }



     public getDetailOne(){
            this.kitchenService.getOne(this.ownerinfoo._id).subscribe(data => {        
                this.restCusiObj = data.message.cuisines;  
            });    
        }


    public addmoretime(day){
    var obj = {open: "", close: ""};
    var index = this.timesetup.findIndex(item => item.name == day); 
    if(index != -1){
     this.timesetup[index].times.push(obj);
    }
    setTimeout(() => {
        var dateNow = new Date();

         $('.date1').datetimepicker({
            defaultDate:dateNow,
            format: 'LT',
            widgetPositioning: {
            horizontal: 'right',
            vertical: 'top'}            
            });
      }, 500);   
    }
     


    public getTimeData(day, type, index, time){
         var indexobj = this.timesetup.findIndex(item => item.name == day);
         if(indexobj != -1){
         if(type == 'open'){
         this.timesetup[indexobj].times[index].open = time;
         } else{
        this.timesetup[indexobj].times[index].close = time;
         }   
         
         }

         console.log("event time");
         console.log(time);

        //var time = event.getAttribute('id');
        /*let eleObj = (<HTMLInputElement>document.getElementById(time));
        console.log("type time");
        console.log(day, type, index, eleObj.value);*/

      }


    public removeTime(day, i){
    var indexobj = this.timesetup.findIndex((item) => {return item.name == day;});
    
    if(indexobj != -1){
    this.timesetup[indexobj].times.splice(i, 1);
    }

    var objectset =  { _id : this.restaurants._id, "openinghours":  this.timesetup}; 
    this.kitchenService.updateKitchen(objectset).subscribe((data) => {
        toastr.remove();
        toastr.error("Time removed");
    });
    }

    public saveSchedule(){

    var objectset =  { _id : this.restaurants._id, "openinghours":  this.timesetup}; 
    console.log("SaveSchedule");
    console.log(objectset);
    this.kitchenService.updateKitchen(objectset).subscribe((data) => {
            toastr.remove();
            toastr.success("Time Added Successfully");
            //this.initailfun();

            //this.router.navigate(['/owner/kitchen-tax']);
        });
     }

     public closeChange(day){
     var indexobj = this.timesetup.findIndex(item => item.name == day); 
     console.log(indexobj);
     if(indexobj != -1){

     //this.timesetup[indexobj].status = !this.timesetup[indexobj].status;

     
    if(this.timesetup[indexobj].status == true){
     this.timesetup[indexobj].status = false;
    }else{
     this.timesetup[indexobj].status = true;
    }
    console.log(this.timesetup[indexobj].status);

     //this.timesetup[indexobj].status;
  //   this.timesetup[indexobj].status = 
     }

     console.log("norvay this.timesetup");
     console.log(this.timesetup);
     }

    public matchpassword(){
        if(this.partnerdata.value.password == this.partnerdata.value.newpassword){
            this.partnerdata.controls["matchpass"].setValue(true);
            this.MutchPassword = false;
        }else{
            this.partnerdata.controls["matchpass"].setValue("");
            this.MutchPassword = true;
        }
        console.log(this.MutchPassword)
    }

    public getuserlength(){
        if(this.partnerdata.value.username){
            this.unlength = this.partnerdata.value.username.length;   
        }
    }


    public do_active(id,type){
        var data = {"_id" : id, "status" : type};      
        this.kitchenService.updatePartner(id,data).subscribe(dataupdate => { 
            this.formreset();
            this.getpartner();
        });

    }

    public getpartner(){
        console.log(this.ownerinfoo.ownerId._id);
        this.kitchenService.allPartner(this.ownerinfoo.ownerId._id).subscribe((data) => {
            console.log(data);
            this.partners = data.message;
            setTimeout(() => {
           $(document).ready(function(){
           
        var dateNow = new Date();
        dateNow.setHours(11,59,0);
         $('.date1').datetimepicker({
            defaultDate:dateNow,
            format: 'LT',
            widgetPositioning: {
            horizontal: 'right',
            vertical: 'top'}            
            });        
            });
      }, 1000); 
        })
    }

    public deletepartner(id){
        this.kitchenService.deletePartner(id).subscribe((data) => {
            console.log(data);
            this.getpartner();
        })
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

    public formreset(){
        this.partnerdata.reset();
    }

    
    public partnerAdd() {
        this.partnerdata.controls["OwnerId"].setValue(this.ownerinfoo.ownerId._id);
        NProgress.start();
        console.log("this.partnerdata.value add");
        console.log(this.partnerdata.value);
        //this.restaurantData.patchValue(this.partnerdata.value);      
        this.kitchenService.addPartner(this.partnerdata.value).subscribe(
            (data) => { 
                
                console.log("partner data");
                console.log(data);

                if(data.error){
                NProgress.done();
                toastr.remove(); 
                toastr.error('Partner ' + data.message);
                }else{
                NProgress.done();
                toastr.remove();              
                this.formreset();
                this.getpartner();
                $("#mypartner").modal('hide');
                this.unlength = 0;
                toastr.success('Partner Added successfully');

                //  this.router.navigate(['/owner/tax']);
                }
            });

    }


    onValueChanged(data?: any) {
        if (!this.partnerdata) {return;  }
        const form = this.partnerdata;

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


    doactive(id, status){
        var newobj = {"_id" : id, "preorderforlater": status}; 
        console.log("testcase",newobj);
        console.log(this.restaurants.preorderforlater);
        this.restaurants.preorderforlater = status;
        /*if(status){
            this.restaurants.preorderforlaterafterdays = 0;
            this.restaurants.preorderforlatertodays = 0;
        }*/        
        /*this.kitchenService.updateKitchen(newobj).subscribe((data) => {
            toastr.remove();
            toastr.success("Pre order for later updated Successfully");
        });*/
    }



    initailfun() {    
        this.kitchenService.getOne(JSON.parse(localStorage.getItem('currentOwner'))._id).subscribe(users => {
            this.restaurants = users.message;
            this.serviceAllow = users.message.serviceAllow;

            console.log("this.restaurants", this.restaurants);
            this.openingAddModel.controls["_id"].setValue(this.restaurants._id);
            this.kitchenservicesobj = this.restaurants.kitchenservices;
            this.offeringobj = this.restaurants.offerings;
            this.foodtypeobj = this.restaurants.foodtype;
            this.bankinfoobj = this.restaurants.bankinginformation;
            this.bitems = this.restaurants.bakeryitems;
            this.fastestdelivery = this.restaurants.fastestdelivery;
            
            console.log(this.restaurants.fastestdelivery);


            if(typeof this.restaurants.deliveryservice !== 'undefined' && typeof this.restaurants.deliveryservice.status !== 'undefined' && this.restaurants.deliveryservice.status == true){

                this.sta = this.restaurants.deliveryservice;
                this.openingAddModel.controls["deliveryservice"].setValue(this.sta.value);
            }

            this.docs = this.restaurants.documentation;
            this.openingAddModel.controls["openingstatus"].setValue(this.restaurants.openingstatus); 
            this.openingAddModel.controls["bakeryitems"].setValue(this.restaurants.bakeryitems); 
            this.openingAddModel.controls["fastestdelivery"].setValue(this.restaurants.fastestdelivery);
            this.openingAddModel.controls["minimumorder"].setValue(this.restaurants.minimumorder);
            this.openingAddModel.controls["mindeliveryime"].setValue(this.restaurants.mindeliveryime);
            this.openingAddModel.controls["cateringcapacity"].setValue(this.restaurants.cateringcapacity);  
            this.openingAddModel.controls["kitchencapacity"].setValue(this.restaurants.kitchencapacity);
            this.openingAddModel.controls["documentation"].setValue(this.restaurants.documentation);
            
            //this.openingAddModel.patchValue(this.restaurants.openinghours); 

            this.cname = this.restaurants.openingstatus;
            console.log("this.restaurants.openinghours");
            console.log(this.restaurants.openinghours);
            if(typeof this.restaurants.openinghours !== 'undefined' && this.restaurants.openinghours.length > 0){
            this.timesetup = this.restaurants.openinghours;       
            }
           
          /* for (var i in this.restaurants.openinghours) {
            if (this.restaurants.openinghours[i]) {
                this.preoptionSet[i] = this.restaurants.openinghours[i];
            }
           } */   
        });
        
        this.loadAllCousine();
    }



    public loadAllCousine() {
        this.masterService.getAllCuisines().subscribe(users => { 
            this.cousines = users.message;
            console.log(this.cousines);
        });
    }



    stafun(type){
        this.sta.status = type;
    }

    kitchenservicesfun(value){
        var index = this.kitchenservicesobj.indexOf(value);   
        if(index != -1){
            this.kitchenservicesobj.splice(index, 1);
        }else{
            this.kitchenservicesobj.push(value);
        }

    }



    offeringfun(value){
        var index = this.offeringobj.indexOf(value);

        if(index != -1){
            this.offeringobj.splice(index, 1);
        }else{
            this.offeringobj.push(value);
        }

    }

    foodtypefun(value){
        var index = this.foodtypeobj.indexOf(value);

        if(index != -1){
            this.foodtypeobj.splice(index, 1);
        }else{
            this.foodtypeobj.push(value);
        }

    }



    public bankinfofun(value){
        var index = this.bankinfoobj.indexOf(value);   
        if(index != -1){
            this.bankinfoobj.splice(index, 1);
        }else{
            this.bankinfoobj.push(value);
        }

    }

    ownerfile(event){

        // console.log('this.uploader')
        // console.log(this.uploader)
        // console.log('this.uploader1') 
        this.progress = 0;
        this.maxerror = false;
        this.openingAddModel.controls["imgenable"].setValue("");
        this.uploader.uploadAll();

        this.uploader.onProgressAll = (progress:any) =>{
            this.progress = progress;
        } 

        var photos = [];
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var responsePath = JSON.parse(response);
            photos.push(responsePath.filename);
            this.number(photos.length);
        };
        this.uploader.onCompleteAll = () => {
            console.log('completesd');
            if(this.maxerror == false){
                this.openingAddModel.controls["imgenable"].setValue(true);
            }else{
                this.openingAddModel.controls["imgenable"].setValue(""); 
            }
        };

        this.openingAddModel.controls["documentation"].setValue(photos);
    }


    number(len){
        if(len <= 4){
            this.maxerror = false;        
        }else{
            this.uploader.queue = [];
            this.maxerror = true;
        }   
    }


   



    detailAdd() {
        //this.optionSet.result = { "openinghours":  []};
        this.sta.value = this.openingAddModel.value.deliveryservice;
        this.finalObject = {_id : this.restaurants._id, 
           // openinghours : this.optionSet.result.openinghours, 
            openingstatus : this.openingAddModel.value.openingstatus, 
            kitchenservices  : this.kitchenservicesobj, 
            bankinginformation : this.bankinfoobj,
            kitchencapacity : this.openingAddModel.value.kitchencapacity,
            cateringcapacity : this.openingAddModel.value.cateringcapacity,
            offerings : this.offeringobj,
            fastestdelivery : this.openingAddModel.value.fastestdelivery,
            minimumorder : this.openingAddModel.value.minimumorder,
            bakeryitems : this.openingAddModel.value.bakeryitems,                       
            cuisines : this.restCusiObj,
            deliveryservice : this.sta,
            documentation : this.openingAddModel.value.documentation,
            mindeliveryime : this.openingAddModel.value.mindeliveryime,
            preorderforlater : this.restaurants.preorderforlater,
            preorderforlaterafterdays : this.restaurants.preorderforlaterafterdays,
            preorderforlatertodays : this.restaurants.preorderforlatertodays,
            mealpackageallowdays : this.restaurants.mealpackageallowdays
        };

        console.log("this.finalObject.openinghours");
        console.log(this.finalObject.openinghours);

        if(this.ownerinfoo.completeprofileservice == 0 || !this.ownerinfoo.completeprofileservice){
           this.finalObject["completeprofileservice"] = 50; 
        }

        this.kitchenService.updateKitchen(this.finalObject).subscribe((data) => {
            //this.user = data.message;
            this.initailfun();
            toastr.success('Data Updated successfully');
            this.router.navigate(['/owner/kitchen-document']);
        });
    }
}


@Component({
    selector: 'app-tax',
    templateUrl: './kitchen-document.component.html'
})
export class KitchenDocumentComponent implements OnInit {

    uinfo : any;
    openingAddModel : FormGroup;
    filenameAddModel : FormGroup;
    payoutAddModel : FormGroup;
    restaurants : any = [];
    bankinfoobj : any = [];  
    progress : any = 0;
    selectedFiles : any = 0;
    maxerror : any = false;
    imageUrl: string = globalVariable.imageUrl;

    public uploader:FileUploader = new FileUploader({url:globalVariable.imageUrlupload});
    constructor(
        public lf: FormBuilder, 
        public router: Router,            
        public activatedRoute: ActivatedRoute,
        public kitchenService : KitchenService,
        ){ this.restaurants.documentation = []; }

    ngOnInit() {
        this.uinfo = JSON.parse(localStorage.getItem('currentOwner')); 
        this.openingAddModel = this.lf.group({
            imgenable : [],     
            _id: []
        }); 


        this.payoutAddModel = this.lf.group({
            accountholdername : ['', Validators.required],     
            accountnumber: ['', Validators.required],
            bankname: ['', Validators.required]
        });

        this.filenameAddModel = this.lf.group({
            documentname : ['', Validators.required],
            filename: ['']
        });

        this.initailfun();
        }

    clickUrl(doc){
        var link = this.imageUrl + doc;  
        window.open(link, "_blank");
    }
     
    public bankinfofun(value){
        var index = this.bankinfoobj.indexOf(value);   
        if(index != -1){
            this.bankinfoobj.splice(index, 1);
            }else{
            this.bankinfoobj.push(value);
            }
           }


    public initailfun() {
        this.kitchenService.getOne(this.uinfo._id).subscribe(users => {      
            this.restaurants = users.message;
            console.log("doutl", this.restaurants)
            this.openingAddModel.controls["_id"].setValue(this.restaurants._id);
            this.bankinfoobj = this.restaurants.bankinginformation;
                if(this.restaurants.payoutdetail){
                    this.payoutAddModel.patchValue(this.restaurants.payoutdetail);
                }
            });
            }

    

    public restaurantUpdatePayout(){
            var payout =  { "_id": this.uinfo._id, "bankinginformation": this.bankinfoobj , "payoutdetail": this.payoutAddModel.value};
            this.kitchenService.updateKitchen(payout).subscribe((data) => {
                this.initailfun();
                this.router.navigate(['/owner/kitchen-tax']);
            });
            }

    public imgrestaurantUpdate(photos){
        var obj = {_id: this.uinfo._id, documentation : photos};
        this.kitchenService.updateKitchen(obj).subscribe((data) => {
            this.uploader.clearQueue();
            this.initailfun();
        });
    }
    
    public clearQ(){
        if(this.uploader.queue.length > 0){
            this.uploader.cancelAll();
            this.uploader.clearQueue();
                }        
            }

    public ownerfile(event){     
       var len = this.uploader.queue.length + parseInt(this.restaurants.documentation.length);
       if(len > 4){
       this.maxerror = true; 
       this.uploader.clearQueue();
       } else{
        this.maxerror = false; 
        this.progress = 0;
        this.maxerror = false;
        this.uploader.uploadAll();
        this.uploader.onProgressAll = (progress:any) =>{
            if(progress == 100){
            this.progress = (progress - 1);
            }else{
            this.progress = progress;    
            }
        }

        var photos = [];
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            if(response){
            var responsePath = JSON.parse(response);
            if(responsePath.filename){
            this.filenameAddModel.controls["filename"].setValue(responsePath.filename);
            this.filenameAddModel.controls["documentname"].setValue("");
            $("#fileUploadModel").modal({
                        backdrop: 'static',
                        keyboard: false, 
                        show: true
            }); 
            photos.push(this.filenameAddModel.value);
            this.progress = 100;
            }
                if(photos.length <= 4){
                this.maxerror = false;        
                }else{
                console.log("max 4");
                // console.log(this.uploader);
                this.uploader.queue = [];
                }
            }
           
        };
        this.uploader.onCompleteAll = () => {
             if(this.maxerror == false){
                this.openingAddModel.controls["imgenable"].setValue(true);
            }else{
                this.openingAddModel.controls["imgenable"].setValue(""); 
            }
            };

            /*this.uploader.onErrorItem = ((item:any, response:string, status:number, headers:any):any => {
            console.log(item, response);
            if(response == 4){
              alert("Acceptable file format only Image Type");
            }
            });*/

           }
 }  

    public setFileName(){
        var photo = [];
        if(this.restaurants.documentation) {
            photo = [this.filenameAddModel.value].concat(this.restaurants.documentation);
            }
            $("#fileUploadModel").modal("hide");
            setTimeout(()=>{
                 console.log("poto", photo);
                 this.imgrestaurantUpdate(photo);
             }, 1000);
    }

    removeImage(i){
     this.restaurants.documentation.splice(i,1);
     var data = {_id : this.uinfo._id, documentation: this.restaurants.documentation};
     this.kitchenService.updateKitchen(data).subscribe((data) => {});
    }

    number(len){
        if(len <= 4){
            this.maxerror = false;        
        }else{
            console.log("max 4");
            // console.log(this.uploader);
            this.uploader.queue = [];
        }   
        }
       }


@Component({
    selector: 'app-tax',
    templateUrl: './tax.component.html'
})
export class OwnerTaxComponent implements OnInit {


    uinfo : any;
    openingAddModel : FormGroup;
    restaurants : any = [];
    sta : any = {status : false, value : ""};

    constructor(
        public lf: FormBuilder, 
        public router: Router,            
        public activatedRoute: ActivatedRoute,
        public kitchenService : KitchenService,
        ) {}

    ngOnInit() {

        this.uinfo = JSON.parse(localStorage.getItem('currentOwner'));  

        this.openingAddModel = this.lf.group({     
            tax : [],     
            _id: []
        });
        this.openingAddModel.controls["_id"].setValue(this.uinfo._id);
        this.initailfun();
    }


    initailfun() {
        this.kitchenService.getOne(this.uinfo._id).subscribe(users => {      
            this.restaurants = users.message; 

            if(typeof this.restaurants.tax != 'undefined' ){
                if(typeof this.restaurants.tax.status != 'undefined' && this.restaurants.tax.status == true){
                    this.sta = this.restaurants.tax;
                    this.openingAddModel.controls["tax"].setValue(this.sta.value);
                } 
            }else{
                this.openingAddModel.controls["tax"].setValue(""); 
            }

        });
    }

    stafun(type){
        this.sta.status = type;
    }


    public restaurantUpdate(){
        this.sta.value = this.openingAddModel.value.tax; 
        var finalobj = {_id : this.uinfo._id, tax:  this.sta};
        this.kitchenService.updateKitchen(finalobj).subscribe((data) => {
            this.initailfun();
            
            if(this.restaurants.serviceAllow.daliymenuservice){
            this.router.navigate(['/owner/menu/list']);
            }else if(this.restaurants.serviceAllow.comboservice){
            this.router.navigate(['/owner/combo']);
            }else if(this.restaurants.serviceAllow.comboservice){
            this.router.navigate(['/owner/weekly']);
            }else{
             this.router.navigate(['/owner/offer']);
            }

            console.log("teatxdata", data);
        
        });
    }
}




@Component({
    selector: 'app-activate-offering',
    templateUrl: './activate-offering.component.html'
    })
export class OwnerActivateOfferingComponent implements OnInit {
   
    ownerInfo: any;
    cid : any;
    items: any = [];
    combos: any = [];
    mealpackages: any = [];
    kitchenData:any = {};
    constructor(public router : Router, public comboService : ComboService, public activatedRoute : ActivatedRoute, public kitchenService: KitchenService, public kitchenItemService : KitchenItemService, public weekMonthService: WeekMonthService ) { 
     this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));
    }


    ngOnInit() {
        
        console.log("this.ownerInfo");
        console.log(this.ownerInfo);
        this.getItems();
        this.getCombos();
        this.getMealPackages();
        this.onRouteOwner();

        }

       public getItems(){
               this.kitchenItemService.getAlllist(this.ownerInfo._id).subscribe(users => {
                this.items = users.message; 
                console.log("user.message items");
                console.log(users.message);
                });
           }

     public getCombos(){
            this.comboService.getAll(this.ownerInfo._id).subscribe(data => {  
                this.combos = data.message;
            });    
        }       

      public getMealPackages(){
            this.weekMonthService.getAll(this.ownerInfo._id).subscribe(data => {  
                this.mealpackages = data.message;
            });    
        } 


      public itemsStatusUpdate(id, status){
          console.log("id, status");
          console.log(id, status);
          var obj = {"_id": id, "status" : status};
          this.kitchenItemService.updateMenu(obj).subscribe((item) => {
          console.log("Dfd");
          });
      }   

      public combosStatusUpdate(id, status){
          console.log("id, status");
          console.log(id, status);
          var obj = {"_id": id, "status" : status};
            this.comboService.update(obj).subscribe(data => {    
                console.log("cofd");
          });
      }  

    public mealPackagesStatusUpdate(id, status){
        console.log("id, status");
        console.log(id, status);
        var obj = {"_id": id, "status" : status};
        this.weekMonthService.update(obj).subscribe(data => {    
        console.log("cofd");
        });
    }  
  
        public onRouteOwner(){
            this.kitchenService.getOne(this.ownerInfo._id).subscribe(users => {
            this.kitchenData = users.message;            
            if(this.kitchenData && this.kitchenData.serviceAllow && this.kitchenData.serviceAllow.daliymenuservice){
             $('#items').addClass('in active');
              }else if(this.kitchenData && this.kitchenData.serviceAllow && this.kitchenData.serviceAllow.comboservice){
             $('#combos').addClass('in active');
            } else if(this.kitchenData && this.kitchenData.serviceAllow && this.kitchenData.serviceAllow.mealpackageservice){
             $('#mealpackage').addClass('in active');
            } 
            
            if((this.kitchenData && this.kitchenData.serviceAllow && this.kitchenData.serviceAllow.daliymenuservice) || (this.kitchenData && this.kitchenData.serviceAllow && this.kitchenData.serviceAllow.comboservice) || (this.kitchenData && this.kitchenData.serviceAllow && this.kitchenData.serviceAllow.mealpackageservice)){
                setTimeout(() => {
                console.log($('.tabsdetail').length);
                $('.tabsdetail').eq(0).addClass('active');
                }, 500);
            }

            });

        }

        public routeOwner(){
            this.kitchenService.getOne(this.ownerInfo._id).subscribe(users => {
            this.kitchenData = users.message;            
            });
        }


}




@Component({
    selector: 'app-restaurant-basic',
    templateUrl: './restaurant-basic.component.html'
    })
export class OwnerRestaurantBasicComponent implements OnInit {
constructor(){}
ngOnInit() {}
}


@Component({
    selector: 'app-menu-setup',
    templateUrl: './menu-setup.component.html'
    })
export class OwnerMenuSetupComponent implements OnInit {
constructor(){}
ngOnInit() {}
}

@Component({
    selector: 'app-bonus-point',
    templateUrl: './bonus-point.component.html'
    })
export class OwnerBonusPointComponent implements OnInit {
constructor(){}
ngOnInit() {}
}

@Component({
    selector: 'app-my-driver',
    templateUrl: './my-driver.component.html'
    })
export class OwnerMyDriverComponent implements OnInit {
constructor(){}
ngOnInit() {}
}


@Component({
    selector: 'app-owner-policy',
    templateUrl: './kitchen-policy.component.html',
    styles: ['body{background-color:#fff;margin-top:0px;}'],
    encapsulation: ViewEncapsulation.None
})
export class KictchenPolicyComponent implements OnInit {

    ownerInfo : any;
    constructor(public kitchenService: KitchenService) {
     if(localStorage.getItem('currentOwner')){
        this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));
        this.getkitchenDetail();
     }
 
    }

    ngOnInit() {}

    getkitchenDetail(){
       this.kitchenService.getOne(this.ownerInfo._id).subscribe(users => {
         this.ownerInfo = users.message;
       }) 
    }
}

