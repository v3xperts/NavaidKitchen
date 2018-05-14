import { Component, OnInit, ViewEncapsulation,  Output, ElementRef , ViewChild , EventEmitter ,NgZone, NgModule} from '@angular/core';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, Validators,  FormControl , ReactiveFormsModule } from '@angular/forms';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { SearchPipe } from "../filter2.pipe";
import { SearchPipeRestaurant } from "../filter4.pipe";
import { AlertService, AuthService, FrontendService, PaymentConfigService, DeliveryChargesService, SlidesService, RatingService, KitchenMenuService, KitchenItemService, FrontendRestaurantService, PageService, MasterService, OrderService, KitchenService , ComboService,IntroService, WeekMonthService, OfferService, CustomerReferralService, DriverService,UsersService, TestimonialService} from '../service/index';
import * as globalVariable from "../global";
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {OrderPipe} from "../order.pipe";
declare var $ : any;
declare var Stripe : any;
declare var NProgress : any;
declare var toastr : any;
declare var google : any;
toastr.options.timeOut = 3000;
import {SelectModule, SelectItem, SelectComponent} from 'ng2-select';
declare var moment : any ;
import { HttpParams } from '@angular/common/http';

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import * as firebase from "firebase";


@Component({
    selector: 'app-frontend',
    templateUrl: './frontendcust.component.html' 
})
export class FrontendCustomerComponent implements OnInit {
    constructor(public paymentConfigService: PaymentConfigService) {
       this.keySet();
    }
    ngOnInit() {}

    keySet(){
        this.paymentConfigService.getKey().subscribe((data) => {
            if(data.message.length > 0){
                Stripe.setPublishableKey(data.message[0].keypublishable);
                console.log("publish key", data.message[0].keypublishable);
            }
        });
    }
  }

@Component({
    selector: 'app-frontend',
    templateUrl: './frontend.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendComponent implements OnInit {

    public items1 : any = [];
    public items2: any = []; 
    public queryParamsi : any = {};
    public cityi : any = "";
    public coui : any = "";
    public searchtype : any = "";
    public slidesList: any = [];
    public testimonialList: any = [];
    public introImagesList: any = [];
    imageUrl: string = globalVariable.url+'uploads/';

    constructor(public testimonial: TestimonialService, public slidesService :SlidesService, public introService : IntroService, public frontendService : FrontendService,  public masterService : MasterService, public route : Router) {
        this.getIntroImages();
        this.slides();
        this.getTestimonial();
    }

    ngOnInit() {
        $(document).ready(function(){
        $("#owl-demo").owlCarousel({
                autoPlay: 3000,
                items: 5,
                itemsDesktop: [1199, 3],
                itemsDesktopSmall: [979, 3]
            });
            })  ;            
        this.refreshSelectPicker();

        setTimeout(() =>{
            this.getcclist();
            this.getcousines();        
        }, 2000); 
        this.getTestimonials();      
    } 

    
    public getTestimonial(){
        this.testimonial.getTestimonial().subscribe((data)=>{
            this.testimonialList = data.message;
        })
    }

    public slides(){
        this.slidesService.getAll().subscribe((data)=>{
            this.slidesList = data.message;
            //console.log("data slides");
            //console.log(data);
        })
    }


    public getIntroImages(){
        this.introService.getAll().subscribe((data)=>{
            this.introImagesList = data.message;         
        })
    }

    public getTestimonials() {
        console.log('thist')
        this.testimonial.getTestimonial().subscribe((data) => {
            console.log('data');
            console.log(data);
        });
    }
    public handleEvent(childData){
       // console.log("New dEmitted");
       // console.log(childData);
        this.items1 = childData.city;
        this.items2 = childData.cousine;

        this.refreshSelectPicker();
        //this.getcclist(); 
    }


    public getLatLng(cityi){
        this.frontendService.getCityLatLng(cityi).subscribe((data) => {

            //console.log("dta lng lt");
            //console.log(data);

            if(data.status == 'OK'){
                //data.results[0].geometry.location
                localStorage.setItem("latop", data.results[0].geometry.location.lat);
                localStorage.setItem("lngop", data.results[0].geometry.location.lng);
            }
        });
    }

    searchdata(){

        //console.log(this.cityi);
        //console.log(this.coui); 

        if((this.cityi != "") && (typeof this.cityi != 'undefined')){
            this.queryParamsi.city = this.cityi;        
        }

        if(this.coui != "" && this.coui != 'undefined'){
            this.queryParamsi.cousine = this.coui; 
        }

        if(this.searchtype != "" && this.searchtype != "undefined"){
            this.queryParamsi.searchtype = this.searchtype;
        }

        //console.log(this.queryParamsi);

        this.route.navigate(['/customer/browse-restaurants'], {"queryParams" : this.queryParamsi});
    } 

    public refreshSelectPicker(){
       // console.log("referst city list 1");
        setTimeout(()=> {
          //  console.log("referst city list 2");
            let selectDropdown = $('.selectpicker');      
            selectDropdown.selectpicker('refresh');
        }, 20);    
    }

    getcclist(){
        if(localStorage.getItem('currentCountry')){
            var id = JSON.parse(localStorage.getItem('currentCountry')).countryid;   
            var objy = {countryid : id};  
         //   console.log("onk", objy);      
            this.masterService.getcitylist(objy).subscribe(ccresponse => {
                this.items1 = ccresponse.message;
                //console.log("this.items1");
                //console.log(this.items1);
                this.refreshSelectPicker();
            });
        }
    }

    getcousines(){    
        this.masterService.getAllCuisines().subscribe(ccresponse => {        
            //console.log(ccresponse);
            this.items2 = ccresponse.message;      
        })
    }
}


@Component({
    selector: 'app-frontend',
    templateUrl: './frontendlogin.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendLoginComponent implements OnInit {

    loginForm: FormGroup;
    guestloginForm: FormGroup;
    returnUrl: string;
    err:any;   

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        
        private frontendService : FrontendService
        ) { }


    ngOnInit() {

        if(localStorage.getItem('currentCountry')){
            localStorage.removeItem('currentCountry');
        }
        //this.authService.customerlogout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/customer';
        this.loginForm = this.lf.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });

        this.guestloginForm = this.lf.group({
            email: ['', Validators.required],
        });

    }


    private guestlogin(){
    var obj = {"username": this.guestloginForm.value.email, "email" : this.guestloginForm.value.email, "password": "mealdaay123", "status": true};
    this.frontendService.addCustomer(obj).subscribe((data) => {
         console.log("data", data);
         if(data.error){
         toastr.remove();
         toastr.error('You are already exist. Please login with Credentials.');
         }else{
           this.authService.getFrontend(obj).subscribe(
            (data) => {   
            if (!data.error) { 
             localStorage.setItem('currentCustomer', JSON.stringify(data.data));   
             this.router.navigate([this.returnUrl]);
            }else{
                toastr.remove();
                toastr.error('Something Error. try another email');   
            }
          });
         }
    });
    }



    private login(){

        NProgress.start();
        this.loginForm.value["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.authService.getFrontend(this.loginForm.value).subscribe(
            (data) => {  
           // console.log("data r", data);      
                if (!data.error) {
                    localStorage.setItem('currentCustomer', JSON.stringify(data.data));
                    NProgress.done();
                    toastr.remove();
                    toastr.success('Login successful');
                    this.router.navigate([this.returnUrl]);
                }else{
                    NProgress.done();
                    toastr.remove();
                    toastr.error('Bad Credential');
                    this.invaliduserpass();
                }
            },
            (err)=>{
                NProgress.done();
                toastr.remove();
                toastr.error('Bad Credential');
                this.invaliduserpass();

            }
            );
    }

   private invaliduserpass(){       
        this.loginForm.controls["password"].setValue("");
    }
    
}


@Component({
    selector: 'app-frontend',
    templateUrl: './frontendRegister.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendRegisterComponent implements OnInit {

    loginForm: FormGroup;
    returnUrl: string;
    err:any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    passwordp : any = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,25}$/;


    constructor(
        public lf: FormBuilder, 
        public frontendService: FrontendService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        
        ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'login';
        this.loginForm = this.lf.group({
            username: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]],
        });
        this.loginForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
        toastr.clear();
    }

    register(){
        NProgress.start();
        this.frontendService.addCustomer(this.loginForm.value).subscribe(
            (data) => {
                if (data.error) {
                    NProgress.done();
                    toastr.remove();
                    toastr.info('Already exist'); 
                    //this._flashMessagesService.show('Something Went Wrong ', { cssClass: 'alert-danger', timeout: 10000 });
                }else{
                    // this.alertService.success('Customer Registered Successfully',true);
                    NProgress.done();
                    toastr.remove();
                    toastr.success('You have Registered Successfully'); 
                    this.router.navigate(['/customer/login']);
                }
            },
            (err)=>{
                NProgress.done();
                toastr.remove();
                toastr.error('Something Went Wrong'); 
                //this._flashMessagesService.show('Something Went Wrong ', { cssClass: 'alert-danger', timeout: 10000 });
                //this.alertService.error('Bad Credential', true);
                //this.router.navigateByUrl('/admin/login', { queryParams: { err: 1 } });              
            }
            );
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
    selector: 'app-frontend',
    templateUrl: './frontendForgetPassword.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendForgetPasswordComponent implements OnInit {

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
            email: ['', [Validators.required, Validators.pattern(this.emailp)]]
        });
        this.forgetForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    forgetPass(){   
        this.authService.forgetPasswordFrontend(this.forgetForm.value).subscribe(
            (data) => {        
                if (data.error) {
                    //this.alertService.error(data.message, true);
                    toastr.remove();
                    toastr.error('You are entered wrong email!');
                    this.router.navigate(['/']);
                    // this.router.navigate(['/customer/login']);
                }else{
                    setTimeout(function(){
                        NProgress.done(); 
                    }, 1000); 
                    toastr.remove();
                    toastr.success('Check your email to reset password!');
                    //this.alertService.success('Check your email to reset password', true);
                    this.router.navigate(['/']);
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
    selector: 'app-frontend',
    templateUrl: './frontendProfile.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendProfileComponent implements OnInit {
    frontendProfile: FormGroup;
    returnUrl: string;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public frontendService: FrontendService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        ) { }

    ngOnInit() {
        this.frontendProfile = this.lf.group({
            _id: ['', Validators.required],
            username: ['', Validators.required],
            // password: ['', Validators.required],
            email: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
        });
        this.frontendProfile.patchValue(JSON.parse(localStorage.getItem('currentCustomer')));

    }

    frontendUpdate(){
        this.frontendService.updateFrontend(this.frontendProfile.value).subscribe(
            (data) => {
                localStorage.removeItem('currentCustomer');
                localStorage.setItem('currentCustomer', JSON.stringify(this.frontendProfile.value));
                this.alertService.success('Profile updated successfully', true);
                this.router.navigate(['/customer']);
            }
            );
    }
}

@Component({
    selector: 'app-frontend',
    templateUrl: './frontendResetPassword.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendResetPasswordComponent implements OnInit {

    @Output('childData') outgoingData = new EventEmitter<string>();
    forgetForm: FormGroup;
    returnUrl: string;
    err:any;
    id:any;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,
        public alertService: AlertService,
        public activatedRoute: ActivatedRoute){}
    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
        });
        this.forgetForm = this.lf.group({
            password: ['', Validators.required],
            newpassword: ['', Validators.required]
        });
    }

    forgetPass(){

        this.authService.resetPasswordFrontend(this.id,this.forgetForm.value).subscribe(
            (data) => {
                toastr.success('Password Changed Successfully.');
                setTimeout(()=>{
                    this.router.navigate(['/']);
                }, 5000);
            }
            );
    }
}

@Component({
    selector: 'app-change-password',
    templateUrl: './frontendChangePassword.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendChangePasswordComponent implements OnInit {

    frontendProfile: FormGroup;
    returnUrl: string;
    err:any;
    passwordp : any = '';
    MutchPassword :any = false;
    formshow : any = false;

     formErrors = {   
        'oldpassword' : '',
        'newpassword'  : ''
         
    };

    validationMessages = {   
        'oldpassword' : {
            'required':      'Old Password is required.'
        },
        'newpassword' : {
            'required':      'New password is required.',
            'pattern'   :    'Required'
        }        
    };

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public frontendService: FrontendService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        public usersService : UsersService
        ) {}

    ngOnInit() {
         this.usersService.getComplexity().subscribe(data=>{ 
            this.passwordp = data.message[0].customerpasscomplexity.regex;
            this.setpasswordmessage(data.message[0].customerpasscomplexity.name);
        
        
        this.frontendProfile = this.lf.group({
            _id: ['', Validators.required],
            oldpassword: ['', [Validators.required]],
            newpassword: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            confirmpassword : ['', Validators.required],
            match : ['', Validators.required]
        });
        this.formshow = true;
        

        this.frontendProfile.patchValue(JSON.parse(localStorage.getItem('currentCustomer')));
        this.frontendProfile.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now     
        toastr.clear();
        });
    }
    
    public setpasswordmessage(name){
        if(name == 'simplepassword'){
            this.validationMessages.newpassword.pattern = 'New password must contain min 8 Digits alphanumeric only';
        }

        if(name == 'medium'){
            this.validationMessages.newpassword.pattern = 'TBD';
            
        }

        if(name == 'complex'){
            this.validationMessages.newpassword.pattern = 'TBD';
            
        }

        if(name == 'none'){
            this.validationMessages.newpassword.pattern = 'Required';
            
        }
    }

    frontendUpdate(){
        this.frontendService.updateCustomerPassword(this.frontendProfile.value).subscribe(
            (data) => {
                if (data.error) {
                    toastr.remove();
                    toastr.info(data.message); 
                }else{
                    toastr.remove();
                    this.frontendProfile.controls["oldpassword"].setValue("");
                    this.frontendProfile.controls["newpassword"].setValue("");
                    this.frontendProfile.controls["confirmpassword"].setValue("");
                    $("#changePasswordModal").modal('hide');
                    toastr.success(data.message);
                    //this.alertService.success(data.message, true);
                    //setTimeout
                    //this.router.navigate(['/customer']);
                }
            }
            );
    }

    matchpassword(){  
        if(this.frontendProfile.value.confirmpassword == this.frontendProfile.value.newpassword){
            this.frontendProfile.controls["match"].setValue(true);
            this.MutchPassword = false;
        }else{
            this.frontendProfile.controls["match"].setValue("");
            this.MutchPassword = true;
        }

    }  

    onValueChanged(data?: any) {
        if (!this.frontendProfile) {return;  }
        const form = this.frontendProfile;

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
    selector: 'app-frontend',
    templateUrl: './browserestaurant.component.html',  
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendBrowseRestaurantsComponent implements OnInit {

    order: string = 'restaurantname';
    reverse: boolean = false;
    imgurl2 : any =  globalVariable.imageUrl; 
    restaurants : any = [];
    offersObj : any = [];
    filterRestro : any = {"offer" : true, "offers" : []};
    favouritelist : any = [];
    custid : any;  
    custCousion : any = [];
    allCousion : any = [];
    filterOfdetail : any = {city : "", cousine: [], range: 0, lat: 0, lng: 0, favourite:"", sortby:""};
    callback : any;
    item : any = [];
    menu : any = [];
    filteredRet : any = [];
    restaurantsd : any = [];
    city : any = "";
    cousinevid : any = "";
    items1 : any = [];
    items2 : any = [];
    cityi : any ;
    coui : any = [];
    queryString : any;
    newrestset : any = {status : false, value: []};
    ratingOnRestIndexs : any = [];
    ratingOnRest : any = [];
    cousineList: any = [];
    listView:any = false;


    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public frontendService: FrontendService,
        public frontendRestaurantService : FrontendRestaurantService,
        public router: Router,
        public masterService: MasterService,
        public alertService: AlertService,
        public route: ActivatedRoute,
        
        public ratingService : RatingService
        ){


        if(localStorage.getItem('currentCustomer')){
            this.custid = JSON.parse(localStorage.getItem('currentCustomer'))._id;
        }else{
            this.custid = '';
        }

        if(this.custid != ''){
            this.getFavourites();
             this.browseRestaurantsoffers();
        }

         this.getAllCouision();
        this.getLocation(function(data){
            localStorage.setItem("latop", data.coords.latitude);
            localStorage.setItem("lngop", data.coords.longitude);       
        });

        this.jq();
        /*if(this.custid != ''){
            this.browseRestaurantsoffers();
        }else{
            this.browseRestaurants();
        } */
        this.getcclist();
        this.refreshSelectPicker();
        this.getRating();



        this.refreshSelectPicker();
        this.route.queryParams.subscribe(params => { 
            console.log("localStorage.getItem('currentCountry')", localStorage.getItem('currentCountry'));
            if(params['country'] && typeof params['country'] != 'undefined' && params['country'] != ""){                
                this.filterOfdetail.country = params['country'].toLowerCase(); 
            }else if(localStorage.getItem('currentCountry')){
                var count = JSON.parse(localStorage.getItem('currentCountry')).country
                this.filterOfdetail.country = count.toLowerCase(); 
            }
            if(params['city'] && typeof params['city'] != 'undefined' && params['city'] != ""){
                this.city = params['city'];
                this.cityi =  params['city'];
                this.filterOfdetail.city = this.city; 
            } 
            if(params['sortby'] && typeof params['sortby'] != 'undefined' &&  params['sortby'] != ""){
                this.filterOfdetail.sortby = params['sortby']; 
            } 
            if(params['cousine'] && typeof params['cousine'] != 'undefined' && params['cousine'] != ""){
                //console.log(typeof params['cousine']);
                if(typeof params['cousine'] == 'string'){
                 this.coui.push(params['cousine']);
                 this.cousinevid = this.coui;
                }
                if(typeof params['cousine'] == 'object'){
                 this.coui = params['cousine'];
                 this.cousinevid = this.coui;
                }
                this.filterOfdetail.cousine = this.cousinevid;
              //  console.log("bhi", this.coui);          
            }

            if(params['searchtype']){
                this.filterOfdetail.range = 50;
                this.filterOfdetail.lat = localStorage.getItem('latop');
                this.filterOfdetail.lng = localStorage.getItem('lngop');
            }


            setTimeout(() => {
            this.reflactDetail();
            }, 500);
            });
        }


    ngOnInit(){  

       
    }

    setInListView(){
           setTimeout(() => {
           if(this.listView == true){
             console.log("this.restaurants", this.restaurants , this.listView);
             $('#products .item').addClass('list-group-item'); $('.thumbnail > img').removeClass('image-grid'); $('.thumbnail > img').addClass('image-list'); $('.caption').addClass('caption-minh');  $('.thumbnail').removeClass('thumbnail-grid'); 
            }else{
             $('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item'); $('.thumbnail > img').removeClass('image-list'); $('.thumbnail > img').addClass('image-grid'); $('.caption').removeClass('caption-minh'); $('.thumbnail').addClass('thumbnail-grid');
            }
          }, 20);
    }
    
    public listViews(res){
    this.listView = res;
    }


    public checkdetail(restaurant){
        var da = new Date();
        var vctime = da.getHours()+":"+da.getMinutes();
        var dayindex = da.getDay()-1;
        //console.log("d index", dayindex, restaurant.restaurantname);
        if(dayindex > -1){
            var da = new Date();
            vctime = da.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            var ocdateindex:any = -1;
            if(restaurant.openinghours.length > 0 && restaurant.openinghours[dayindex].status == false){
            // console.log("restaurant.openinghours[dayindex].times", restaurant.openinghours[dayindex].times);    
            ocdateindex = restaurant.openinghours[dayindex].times.findIndex((items) =>{
            return (Date.parse('01/01/2011 '+items.open) <= Date.parse('01/01/2011 '+vctime) && Date.parse('01/01/2011 '+items.close) >= Date.parse('01/01/2011 '+vctime)) || (items.open == "" && items.close == "");
            });
            }
            if((restaurant.openinghours.length > 0 && restaurant.openinghours[dayindex].status == false && ocdateindex > -1) || restaurant.openinghours.length == 0){                        
            return true;
            }else{
            return false;        
            }
            }else{
             return false;           
            }
      }


    public ShowRatingStar(index){

        var indexobj = this.ratingOnRest[index];
        var arr = indexobj.averageQuantity.toFixed(1).toString().split(".");            
        var newassing = 0;
        var html = "";  

        for(var i=0; i<arr[0];i++){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }  

        if(arr[1] <= 5 && arr[1] > 0){
            newassing += 1;
            html += '<span class="stardiv half"></span>';
        }

        if(arr[1] > 5 && arr[1] > 0){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }

        var leftstar = (5 - newassing);
        for(var k=0; k<leftstar; k++){
            html += '<span class="stardiv"></span>';
        }

        return html;
    }

    /*
    public selectCousine(cousine){
           console.log("pure cuisome");
           var indexw = this.filterOfdetail.cousine.indexOf(cousine.name);
           console.log(this.filterOfdetail.cousine, cousine.name, indexw);
           if(indexw == -1){
               this.filterOfdetail.cousine.push(cousine.name);
           }else{
               this.filterOfdetail.cousine.splice(indexw, 1);
           }
           this.searchdata();
    }*/

    public getRating(){
        this.ratingService.getAllRestroRating().subscribe((data)=>{
            var indexs = data.message;
            this.ratingOnRestIndexs = indexs.map((item)=>{ return item._id });
            this.ratingOnRest = indexs;
             
             var shorted = this.ratingOnRest.sort(function(a, b){
           return a.averageQuantity-b.averageQuantity
            });

           //    console.log("shorted");
            //   console.log(shorted);
        });
       }


    public handleEvent(childData){
        //console.log("New dEmitted");
        //console.log(childData);        
        this.items1 = childData.city;
        this.items2 = childData.cousine;        
        this.refreshSelectPicker();
        this.filterOfdetail.city = "";
        this.filterOfdetail.cousine = "";
        this.cityi = "";
        this.coui = "";
        this.filterOfdetail.country = childData.country;
        this.filterOfdetail.sortby = "";
        console.log(this.filterOfdetail, "hiii");
        this.searchdata();
        }

    public getLatLng(cityi){
        this.frontendService.getCityLatLng(cityi).subscribe((data) => {    
            //console.log("dta lng lt");
            //console.log(data);
            if(data.status == 'OK'){
                //data.results[0].geometry.location
                localStorage.setItem("latop", data.results[0].geometry.location.lat);
                localStorage.setItem("lngop", data.results[0].geometry.location.lng);
            }
        });
    }



    public fastdeliveryfind(){

        this.newrestset.status = true;
        this.newrestset.value = this.restaurants;
        var res = this.restaurants;
        var filterres1 = [];
        for(var i=0; i< res.len; i++){
            if(res[i].fastdelivery == true){
                filterres1.push(res[i]);
            }
        }

        this.restaurants = filterres1;

    }  


    public sortBy(data) {
   // console.log("sortBy", data);
    this.filterOfdetail.sortby = data;
    this.searchdata();
    }
   
    
    public restaurentRating(){
       var restroarray = [];
       var newrest = this.restaurants;
       this.ratingService.getAllRestroRating().subscribe((rdata) => {
             //  console.log("rdata", rdata);
               var data = rdata.message; 
               var sorted_rest = data.sort((a, b) => {
                   if(a.averageQuantity && b.averageQuantity){
                      return a.averageQuantity - b.averageQuantity;
                   }
               });
         //  console.log("sorted_rest", sorted_rest, this.restaurants);
           sorted_rest.reverse();
           for(var i =0; i<sorted_rest.length; i++){
             var index = newrest.findIndex((item) => {
              return item._id == sorted_rest[i]._id
             });
          //   console.log(index);
             if(index > -1){
             restroarray.push(newrest[index]);
             newrest.splice(index, 1);
             }
           this.restaurants = restroarray.concat(newrest);
           this.setInListView();
           }
       });
         }



    public refreshSelectPicker(){
        setTimeout(()=> {
            let selectDropdown = $('.selectpicker');      
            selectDropdown.selectpicker('refresh');
        }, 10);    
    }

    jq(){
        $(document).ready(function() {
            $('#list').click(function(event){ $('#products .item').addClass('list-group-item'); $('.thumbnail > img').removeClass('image-grid'); $('.thumbnail > img').addClass('image-list'); $('.caption').addClass('caption-minh');  $('.thumbnail').removeClass('thumbnail-grid'); });
            $('#grid').click(function(event){ $('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item'); $('.thumbnail > img').removeClass('image-list'); $('.thumbnail > img').addClass('image-grid'); $('.caption').removeClass('caption-minh'); $('.thumbnail').addClass('thumbnail-grid');});
        });
    }

    searchdata(){

        let querydata = this.filterOfdetail;

        if(typeof this.cityi != 'undefined' && this.cityi.length > 0){
            this.filterOfdetail.city = this.cityi;  
            querydata.city = this.cityi;
        }else{
            this.filterOfdetail.city = "";
            delete querydata.city; 
        }


        if(typeof this.coui != 'undefined' && this.coui.length > 0){
             querydata.cousine =  this.coui;
        }else{
             this.coui = "";  
             querydata.cousine = "";
                  
        } 

        console.log("querydata.cousine", querydata.cousine);
        delete querydata.lat;  
        delete querydata.lng;
        this.queryString = "";
        var data = {};
       // console.log("navigate querydata",  querydata);
        this.router.navigate(['/customer/browse-restaurants'], {queryParams:  data});
        this.router.navigate(['/customer/browse-restaurants'], { "queryParams" : querydata });
        setTimeout(() => {
            this.reflactDetail();
        }, 500);
    }

    public getFavourites(){
        if(this.custid){
            this.frontendRestaurantService.getFavouriteItem(this.custid).subscribe(data => {
                var favouriteRestro = [];
                if(data.message.length > 0 && data.message[0].customerfavrestro){
                        favouriteRestro = data.message[0].customerfavrestro;
                        this.favouritelist = favouriteRestro.map((rest) => {return rest.id});
                        console.log(this.favouritelist," this.favouritelist");
                }
            });
           }
      } 


    setFavourites(id){
        const index = this.favouritelist.findIndex(item => item === id);
        if(index === -1){
            return  {"color": "black"};
        }
        else{
            return {"color": "red"};
        }
    }

    getAllCouision(){
        this.masterService.getAllCuisines().subscribe(data => {
            this.allCousion = data.message;  
            this.refreshSelectPicker()
        });
    }

    addFavourites(id){
        var data = {_id : this.custid, rid : id};
        this.frontendRestaurantService.updateFavourite(data).subscribe(data => {
            this.favouritelist = data.message.customerfavrestro;
            this.setFavourites(id);
        });

    } 

    browseRestaurants(){   
        var cityo  = {city : ""}; 
        if(this.city != ""){
            cityo.city = this.city;
        }
        //console.log(this.city);       
        this.frontendRestaurantService.getAllRestrob(cityo).subscribe(data => {
            //console.log("all rest2 "); 
           // console.log(this.restaurants); 
            this.restaurants = data.message; 
            
        });
    }
  

    kbrowseRestaurants(){ 
        var cityo  = {city : ""};        
        if(this.city != ""){
            cityo.city = this.city;
        }
        this.frontendRestaurantService.getAllRestrob(cityo).subscribe(data => {  
            //console.log("all rest1 ");
            //console.log(this.restaurantsd); 
            this.restaurantsd = data.message; 

        });
    }

    browseRestaurantsoffers(){
        this.frontendRestaurantService.getAllOffers().subscribe(data => { 
            var offerlen = data.message.length;
            var arr = [];
            for(var i=0; i< offerlen; i++){
                arr.push(data.message[i].kitchenId);
            }        
            this.offersObj = arr;      
           // this.browseRestaurants();
        });
    }

    checkoffer(id){
        if(id == ''){
        }else{
            const index = this.offersObj.findIndex(item => item === id);
            if(index !== -1){
                return true;
            }else{
                return false;
            }   
        }
    }

    offersfilter(con){ 
        if(con == true){
            this.filterRestro.offer = true; 
            this.filterRestro.arr = [];
        }else{
            this.filterRestro.offer = false; 
            this.filterRestro.arr = this.offersObj;
        } 
    }

    filterc(id){
        if(this.filterOfdetail.cousine == ""){
            this.filterOfdetail.cousine = [];
        }
        //console.log("niii", this.filterOfdetail.cousine);
        var index = this.filterOfdetail.cousine.indexOf(id);
        if(index == -1){
            this.filterOfdetail.cousine.push(id);
        }else{
            this.filterOfdetail.cousine.splice(index, 1);
            if(id == this.cousinevid){
                this.cousinevid = "";
            }
        }
        this.searchdata();  
    }  


    filterFavourite(){     
        if(this.filterOfdetail.favourite == ""){
            this.filterOfdetail.favourite = true;      
        }else{
            this.filterOfdetail.favourite = "";
        }      
        //console.log(this.filterOfdetail.favourite);
        this.reflactDetail();
    }

    changeRange(dd){
        this.reflactDetail(); 
    }

    reflactDetail(){
        this.newrestset.status = false;
        this.filterOfdetail.lat = localStorage.getItem('latop');
        this.filterOfdetail.lng = localStorage.getItem('lngop');

       console.log("reflact Detail"); 
       console.log(this.filterOfdetail); 

        this.frontendRestaurantService.reflactAllRest(this.filterOfdetail).subscribe(data => {
            var data2 = data.message;
            this.restaurants = [];
            if((this.filterOfdetail.favourite == true) && (data2.length > 0)){
                for(var i=0; i<data2.length; i++){
                    if(this.favouritelist.indexOf(data2[i]._id) > -1){
                        this.restaurants.push(JSON.parse(JSON.stringify(data.message[i])));
                        if(this.filterOfdetail.sortby == 'rating' && (data2.length-1) == i){
                         this.restaurentRating();
                        }
                    }
                }
               } else{
                this.restaurants =  data.message;  
                if(this.filterOfdetail.sortby == 'rating'){
                    this.restaurentRating();
                }
            } 

            this.setInListView(); 
                      
        });

    }


    getLocation(callback) {
        if (navigator.geolocation) {
            var v = "";
            navigator.geolocation.watchPosition(function(data){           
                callback(data);
            });      
        } else { 
            alert("Geolocation is not supported by this browser.");
        } 
    } 

    getkitchen(str){
        this.frontendRestaurantService.getAllRestaurant(str).subscribe(data => {
            //console.log(data);
            this.filteredRet = data.message;      
            this.restaurants = this.filteredRet;
        });
    }

    getmenu(str){

        this.frontendRestaurantService.getAllmenu(str).subscribe(data => {  
            this.menu = data.message; 
            this.getrest();           
        });

    }

    keypresshit(searchstr){       
        var obj = {str : searchstr};
        /*if(obj.str.length > 2)
        { 
            this.kbrowseRestaurants();   
            this.getkitchen(obj);
            this.getmenu(obj);
        }
        if(obj.str.length <= 2){      
            this.filteredRet = [];
            this.menu = [];
            this.browseRestaurants();      
        }*/
    }


    getrest(){ 
        if(this.restaurantsd.length > 0){
            for(var i =0; i < this.menu.length; i++){
                const index1 = this.restaurants.findIndex(item => item._id === this.menu[i].kitchenId);
                const index2 = this.restaurantsd.findIndex(item => item._id === this.menu[i].kitchenId);                
                if(index1 === -1){ 
                    if(index2 !== -1){
                        this.restaurants.push(this.restaurantsd[index2]);  
                    }
                }
            }
        }

    }



    getcclist(){
        if(localStorage.getItem('currentCountry')){
            var id = JSON.parse(localStorage.getItem('currentCountry')).countryid;   
            var objy = {countryid : id};
            this.masterService.getcitylist(objy).subscribe(ccresponse => {
                this.items1 = ccresponse.message; 
                this.refreshSelectPicker();
            });
        }
    }

    getcousines(){    
        this.masterService.getAllCuisines().subscribe(ccresponse => {        
            this.items2 = ccresponse.message;      
        })
    }
}

@Component({
    selector: 'app-frontend',
    templateUrl: './restaurantdetail.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CustomerRestaurantDetailComponent implements OnInit {


    userFilter2 : any = "";
    restaurantsdetail : any = {};
    weeklyrestaurants : any = [];
    monthlyrestaurants : any = [];
    availoffer : any = [];
    availcombo : any = [];
    restaurants : any;
    favouritelist  : any = [];
    comp : any;
    fav : any = {};
    restid : any;
    restaurantsdetailall : any = [];
    menus : any = [];
    items : any = [];
    custid : any;
    imgurl2 : any =  globalVariable.imageUrl;
    addorderobj : any;
    orderdetails: any;
    cusines : any;
    favouritelistItem:any = [];
    activeitems: any= [];
    favouritelistItemRestro: any = [];
    favouriteir : any = {ids : [], items: []};
    selectedMealPackage: any;
    selectedFlexiMealPackage: any;
    customizePackagePrice: any;
    currentPaging:any;  
    customizeDate:any = {"startDate": "", "endDate": "", "error": true};
    customizedPackage:any;
    tempCustomizedPackage:any;
    ratingOnRestIndexs : any = [];
    ratingOnRest : any = [];
    itemsRating:any= [];
    itemsRatingIndex:any = [];
    comboRating:any= [];
    comboRatingIndex:any = [];
    packageRating:any= [];
    packageRatingIndex:any = [];
    customerObj:any = [];
    reviewRating : any = {"valueOfTimeRating": 0, "deliveryTimeRating": 0, "orderPackagingRating": 0, "review": [], "ratingUpdateStatus": false};
    modelOpen: any = '';
    customizedPackageTotalPrice:any = 0;
    diffDays:any;    
    todayDay :any;
    todayOpend : any = false;


    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public frontendService: FrontendService,
        public frontendRestaurantService : FrontendRestaurantService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        
        public kitchenMenuService: KitchenMenuService,
        public kitchenMenuItemService: KitchenItemService,
        public orderService : OrderService,
        public masterService : MasterService,
        public comboService : ComboService,
        public weekMonthService : WeekMonthService,
        public ratingService: RatingService
        ){
        this.route.params.subscribe((params: Params) => {
            this.restid = params['id'];  
            this.restaurantsDetail(); 
        });
        if(localStorage.getItem('cartinfo')){
            if(JSON.parse(localStorage.getItem('cartinfo')).items.length > 0){
                this.orderdetails = JSON.parse(localStorage.getItem('cartinfo'));  
            }else{
                this.orderdetails = {"customerid" : "", "total": 0, "restaurantid": "", "name": "","items" : [], "combo" : [], "package" : [], "ordertiming" : {"type" : ""}, "note": "", "coupon": "", "tax": "", "discount": "", "subtotal": ""}; 
            }                
            }else{
                this.orderdetails = {"customerid" : "", "total": 0, "restaurantid": "", "name": "", "items" : [], "combo" : [], "package" : [], "ordertiming" : {"type" : ""}, "note": "", "coupon":"", "tax": "", "discount": "", "subtotal": ""}; 
            }
    }


    ngOnInit(){
        this.jq();
        if(JSON.parse(localStorage.getItem('currentCustomer')) != null){
            this.custid = JSON.parse(localStorage.getItem('currentCustomer'))._id;
            this.getFavouritesItem();
        }
        else{
            this.custid = '';
        }

        if(localStorage.getItem('cartinfo')){
            this.orderdetails = JSON.parse(localStorage.getItem('cartinfo'));
            //var text = this.orderdetails.items.length + this.orderdetails.combos.length + this.orderdetails.package.length
               // var id = (<HTMLScriptElement[]><any>document.getElementsByClassName("cartbadgeitem"));
              // id

        }

        this.route.params.subscribe((params: Params) => {
            this.restid = params['id'];  
            if(this.custid != ''){
                this.getFavourites();
            }               
            //this.getItems();
            this.getActiveItems();
            this.getMenus();             
            this.allRestaurants();
            /*this.masterService.getAllCuisines().subscribe((data) => {
                //console.log("data");
                this.cusines = data.message;
                //console.log(data);
            });*/
        });  
        this.getRating();
        this.getItemComboPackageRating();
        this.getReviewRating();
    }


    public todayOpen(){

            var da = new Date();
            var vctime = da.getHours()+":"+da.getMinutes();
            var dayindex = da.getDay()-1;      
            if(dayindex > -1){
            var da = new Date();
            vctime = da.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            var ocdateindex:any = -1;

            if(this.restaurantsdetail.openinghours.length > 0 && this.restaurantsdetail.openinghours[dayindex].status == false){
                console.log("31");    
            ocdateindex = this.restaurantsdetail.openinghours[dayindex].times.findIndex((items) =>{
            return (Date.parse('01/01/2011 '+items.open) <= Date.parse('01/01/2011 '+vctime) && Date.parse('01/01/2011 '+items.close) >= Date.parse('01/01/2011 '+vctime)) || (items.open == "" && items.close == "");
            });
            }
            if((ocdateindex > -1) || (this.restaurantsdetail.openinghours.length == 0)){
            console.log("32");    
            this.todayOpend = true;
            }else{
                console.log("33");    
            this.todayOpend = false;
            }
            }else{
                console.log("34");    
             this.todayOpend = false;   
            }
        }


    public getReviewRating(){
        this.ratingService.getReviewRating(this.restid).subscribe((data) =>{
            // //console.log("review rating", data);
            var datai = data.message;            
            var temparr = [];            
            datai.review.forEach((item) => {
                var index = temparr.indexOf(item.customerId);
                if(index == -1){temparr.push(item.customerId);}
            });
            var obj = {"ids": temparr};

            this.frontendService.getMultipleCust(obj).subscribe((customers) =>{
                this.customerObj = customers.message;
                this.reviewRating = datai;                 
            });
        });
    }

    public GetCustomer(id){
        var index = this.customerObj.findIndex((itemd) => {
            return itemd._id == id
        });
        if(index != -1){
            return this.customerObj[index].firstname + ' '+ this.customerObj[index].lastname;
        }
    }


    public getItemComboPackageRating(){
        this.ratingService.getICPRating(this.restid).subscribe((data)=>{

            var items = data.message.items;
            var combo = data.message.combo;
            var pack = data.message.pack;

            this.itemsRatingIndex = items.map(item => item.id);
            this.itemsRating = items;

            this.comboRatingIndex = combo.map(item => item.id);
            this.comboRating = combo;

            this.packageRatingIndex = pack.map(item => item.id);
            this.packageRating = pack;

        });
    }



    public ShowItemRatingStar(index){   
        var indexobj = this.itemsRating[index];
        var avg = parseFloat(indexobj.average);
        var count = parseInt(indexobj.count);
        var narr = (avg/count).toFixed(1);
        var arr = narr.toString().split(".");   
        var html = "";    
        var newassing = 0;   
        var arr0 = parseInt(arr[0]);
        var arr1 = parseInt(arr[1]);

        for(var i=0; i<arr0;i++){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }  

        if(arr1 <= 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv half"></span>';
        }

        if(arr1 > 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }

        var leftstar = (5 - newassing);
        for(var k=0; k<leftstar; k++){
            html += '<span class="stardiv"></span>';
        }

        return html;
    }


    public ShowReviewRating(obj){
        var arr = [];   
        if(parseInt(obj) === obj){        
            arr[0] = obj;  
            arr[1] = 0; 
        }else{
            arr = obj.toString().split(".");
        }

        var html = "";    
        var newassing = 0;   
        var arr0 = parseInt(arr[0]);
        var arr1 = parseInt(arr[1]);

        for(var i=0; i<arr0;i++){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }  

        if(arr1 <= 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv half"></span>';
        }

        if(arr1 > 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }

        var leftstar = (5 - newassing);
        for(var k=0; k<leftstar; k++){
            html += '<span class="stardiv"></span>';
        }
        return html;
    }

    public ShowComboRatingStar(index){   
        var indexobj = this.comboRating[index];
        var avg = parseFloat(indexobj.average);
        var count = parseInt(indexobj.count);
        var narr = (avg/count).toFixed(1);
        var arr = narr.toString().split(".");   
        var html = "";    
        var newassing = 0;   
        var arr0 = parseInt(arr[0]);
        var arr1 = parseInt(arr[1]);

        for(var i=0; i<arr0;i++){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }  

        if(arr1 <= 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv half"></span>';
        }

        if(arr1 > 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }

        var leftstar = (5 - newassing);
        for(var k=0; k<leftstar; k++){
            html += '<span class="stardiv"></span>';
        }
        return html;
    }


    public ShowPackageRatingStar(index){   
        var indexobj = this.packageRating[index];
        var avg = parseFloat(indexobj.average);
        var count = parseInt(indexobj.count);
        var narr = (avg/count).toFixed(1);
        var arr = narr.toString().split(".");   
        var html = "";    
        var newassing = 0;   
        var arr0 = parseInt(arr[0]);
        var arr1 = parseInt(arr[1]);

        for(var i=0; i<arr0;i++){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }  

        if(arr1 <= 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv half"></span>';
        }

        if(arr1 > 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }

        var leftstar = (5 - newassing);
        for(var k=0; k<leftstar; k++){
            html += '<span class="stardiv"></span>';
        }

        return html;
    }


    public ShowRatingStar(index){
        
        var indexobj = this.ratingOnRest[index];
       // console.log("indexobj", indexobj);
        var arr = indexobj.averageQuantity.toFixed(1).toString().split(".");    
        var newassing = 0;
        var html = "";  

        for(var i=0; i<arr[0];i++){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }  

        if(arr[1] <= 5 && arr[1] > 0){
            newassing += 1;
            html += '<span class="stardiv half"></span>';
        }

        if(arr[1] > 5 && arr[1] > 0){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }

        var leftstar = (5 - newassing);
        for(var k=0; k<leftstar; k++){
            html += '<span class="stardiv"></span>';
        }

        return html;
    }


    public getRating(){
        this.ratingService.getAllRestroRating().subscribe((data)=>{
            var indexs = data.message;
            this.ratingOnRestIndexs = indexs.map((item)=>{ return item._id });
            this.ratingOnRest = indexs;
            //console.log("ratingOnRest" , this.ratingOnRestIndexs, this.ratingOnRest); 

          

        });
      }


    public prevArrow(type){
        this.currentPaging = this.currentPaging - 1;
      }

    public nextArrow(type){ 
        this.currentPaging += 1;
      }

    public viewPackageDetail(type, detail){
        $("#startDate").val('');
        $("#endDate").val('');
        this.revised = false;
        this.customizedPackageTotalPrice = 0;
        this.modelOpen = type;
        this.customizedPackage= [];
        this.weekMonthService.getOne(detail._id).subscribe((data) => {
            this.currentPaging = 0;
            var gi = JSON.parse(JSON.stringify(data.message));
            this.selectedMealPackage = data.message;
            if(this.selectedMealPackage.type == 'flexible'){
                for(let i=0; i<this.selectedMealPackage.dayandmenus.length; i++){
                    if(this.selectedMealPackage.dayandmenus[i].menuids.length > 0){
                    }else{
                        this.selectedMealPackage.dayandmenus.splice(i, 1); 
                    }
                }
            }
            this.datePickerEnable();
        });
       }


    public datePickerEnable(){
        if(this.restaurantsdetail.mealpackageallowdays){
        console.log("this.restaurantsdetail.mealpackageallowdays", this.restaurantsdetail.mealpackageallowdays);
        }
        setTimeout(()=> {
                var mind = new Date();
                var mind2 = new Date();
                var tmind = mind.setDate(mind.getDate() + +this.restaurantsdetail.mealpackageallowdays);
                console.log("aa", +this.restaurantsdetail.mealpackageallowdays + +1);
                var tmind2 = mind2.setDate(mind2.getDate() + +this.restaurantsdetail.mealpackageallowdays + +1);
                $('#startDate').datetimepicker({format:'YYYY-MM-DD', "minDate": tmind,  widgetPositioning: {
                    horizontal: 'right',
                    vertical: 'bottom'
                }});
                $('#endDate').datetimepicker({format:'YYYY-MM-DD', "minDate": tmind2, widgetPositioning: {
                    horizontal: 'right',
                    vertical: 'bottom'
                }}); 
                $("#startDate").val("");
                $("#endDate").val(""); 
               }, 500);
       }


    public getTimeData(type, elem){
        let eleObj = (<HTMLInputElement>document.getElementById(type));
        if(type == 'startDate'){
            this.customizeDate.startDate = eleObj.value;
        }else{
            this.customizeDate.endDate = eleObj.value;
        }
        var today = new Date();
        var s = new Date(this.customizeDate.startDate);
        var e = new Date(this.customizeDate.endDate);
        today.setHours(0,0,0,0);
        s.setHours(0,0,0,0);
        e.setHours(0,0,0,0);


        if(typeof this.customizeDate.startDate != 'undefined' && typeof this.customizeDate.endDate != 'undefined' && this.customizeDate.startDate != "" && this.customizeDate.endDate != ""){
            var timeDiff = Math.abs(e.getTime() - s.getTime());
            this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (this.diffDays < 7) {
                this.revised = false;
            }

           /* var startDate = new Date(this.customizeDate.startDate);
            var endDate = new Date(this.customizeDate.endDate);*/
            console.log("s, e, today", s, e, today, (s <= e) && (s >= today && e >= today));
            if((s <= e) && (s >= today && e >= today)){
                this.customizeDate.error = false;
            }else{
                this.customizeDate.error = true;
            }
        }else{
            this.customizeDate.error = true;
        }
       }


    public revised:any;

    public submitForm(){
        this.customizedPackage.length = 0; 
        this.customizedPackageTotalPrice = 0;
        this.tempCustomizedPackage = []; 

        //this.revised = false;

        this.currentPaging = 0;
        this.selectItemNow();

        /*if (this.revised) {
            var redateslist = this.getRevisedDates(this.customizeDate['startDate'],this.customizeDate['endDate']); 
            this.currentPaging = 0;
            this.customizedPackage = redateslist;
        }else{
            var dateslist = this.getDates(this.customizeDate['startDate'],this.customizeDate['endDate']); 
            this.currentPaging = 0;
            this.customizedPackage = dateslist;            
        }*/

    }


    selectItemNow(){

        var startDate = new Date(this.customizeDate.startDate);
        var endDate = new Date(this.customizeDate.endDate);

        while (startDate <= endDate) {
            var dateDay = new Date(startDate);  
            var dayslist = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            var dayName = dayslist[dateDay.getDay()];
            var indexs = this.selectedMealPackage.dayandmenus.findIndex((indexitem) => {return indexitem.day == dayName});            
          //  console.log(indexs);
            if(indexs > -1){
                console.log("selectedmeal", this.selectedMealPackage);
                if (typeof this.revised != 'undefined' && this.revised && this.customizedPackage.length < 7) {
                    this.customizedPackage.push(this.jsonfy({"date":dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": this.selectedMealPackage.dayandmenus[indexs].menuids}));
                }
                if (typeof this.revised == 'undefined' || !this.revised) {
                    this.customizedPackage.push(this.jsonfy({"date":dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": this.selectedMealPackage.dayandmenus[indexs].menuids}));
                }
                this.tempCustomizedPackage.push(this.jsonfy({"date":dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": this.selectedMealPackage.dayandmenus[indexs].menuids}));
               }else{
                if (typeof this.revised != 'undefined' && this.revised && this.customizedPackage.length < 7) {
                    this.customizedPackage.push(this.jsonfy({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": []}));
                }
                if (typeof this.revised == 'undefined' || !this.revised) {
                    this.customizedPackage.push(this.jsonfy({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": []}));
                }
                this.tempCustomizedPackage.push(this.jsonfy({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": []}));
                console.log("this.tempCustomizedPackage", this.tempCustomizedPackage);
            }
            startDate.setDate(startDate.getDate()+1);
        }


        /*  
        console.log("this.customizedPackage");
        console.log(this.customizedPackage);
        console.log("this.tempCustomizedPackage");
        console.log(this.tempCustomizedPackage);
        */

    }

    jsonfy(obj){
      return JSON.parse(JSON.stringify(obj));
    }

    public revisedChange(){
        if(this.revised){
            this.revised = false;
            this.submitForm();
        }else{
            this.revised = true;
            this.submitForm();
        }
    }

    /*public getRevisedDates(start, end) {
        var date1 = new Date(start);
        var date2 = new Date(end);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if (diffDays > 7) {
            console.log(diffDays)
            var datesArray = [];
            var endDate = new Date(end);
            var startDate = new Date(start);
            while (startDate <= endDate) {
                var dateDay = new Date(startDate);  
                var dayslist = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                var dayName = dayslist[dateDay.getDay()];
                var indexs = this.selectedMealPackage.dayandmenus.findIndex((indexitem) => {return indexitem.day == dayName});
                if(indexs != -1){
                    this.selectedMealPackage.dayandmenus[indexs].menuids.forEach((item, i) => {
                        this.selectedMealPackage.dayandmenus[indexs].menuids[i]["selected"] = false;
                    });
                    if (datesArray.length <= 7) {
                        datesArray.push({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": JSON.parse(JSON.stringify(this.selectedMealPackage.dayandmenus[indexs].menuids))});
                    }
                }else{
                    if (datesArray.length <= 7) {
                        datesArray.push({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": []});
                    }
                }
                startDate.setDate(startDate.getDate() + 1);
            }
            return datesArray;
        }else{
            this.customizeDate.error = true;
        }
    }

    public getDates(start, end) {
        var packageindex = this.orderdetails.package.findIndex((item) => { return item._id == this.selectedMealPackage._id; });
        
        if(packageindex != -1){
            this.orderdetails.package[packageindex].qty = 1;
            var datesArray = [];
            var endDate = new Date(end);
            var startDate = new Date(start);
            while (startDate <= endDate) {
                var dateDay = new Date(startDate);  
                var dayslist = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                var dayName = dayslist[dateDay.getDay()];
                var indexs = this.selectedMealPackage.dayandmenus.findIndex((indexitem) => {return indexitem.day == dayName});
                if(indexs != -1){
                    this.selectedMealPackage.dayandmenus[indexs].menuids.forEach((item, i) => {
                        this.selectedMealPackage.dayandmenus[indexs].menuids[i]["selected"] = false;
                    });
                    datesArray.push({"date":dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": JSON.parse(JSON.stringify(this.selectedMealPackage.dayandmenus[indexs].menuids))});
                }else{
                    datesArray.push({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": []});
                }
                startDate.setDate(startDate.getDate() + 1);
            }
            return datesArray;
        }else{
            var datesArray = [];
            var endDate = new Date(end);
            var startDate = new Date(start);
            while (startDate <= endDate) {
                var dateDay = new Date(startDate);  
                var dayslist = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                var dayName = dayslist[dateDay.getDay()];
                var indexs = this.selectedMealPackage.dayandmenus.findIndex((indexitem) => {return indexitem.day == dayName});
                if(indexs != -1){
                    this.selectedMealPackage.dayandmenus[indexs].menuids.forEach((item, i) => {
                        this.selectedMealPackage.dayandmenus[indexs].menuids[i]["selected"] = false;
                    });

                    datesArray.push({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": JSON.parse(JSON.stringify(this.selectedMealPackage.dayandmenus[indexs].menuids))});
                }else{
                    datesArray.push({"date": dateDay.toLocaleDateString(), "status": false, "menuids": [], "tempmenuids": []});
                }
                startDate.setDate(startDate.getDate() + 1);
            }
            return datesArray;
        }
    }*/

    public addItemToMenuIds(selectindex, menuitemindex, selectitem){
        var findindex = this.customizedPackage[selectindex].menuids.findIndex((item) => {
            return item._id == selectitem._id;
        });
        console.log("rep",this.customizedPackage, selectindex, menuitemindex, selectitem, findindex);
        if(findindex != -1){
            console.log("index1", findindex);
            this.customizedPackage[selectindex].menuids.splice(findindex, 1); 
            this.customizedPackage[selectindex].tempmenuids[menuitemindex].selected = false;

            this.tempCustomizedPackage[selectindex]['menuids'].splice(findindex, 1);
            
            /*if (this.tempCustomizedPackage.length > selectindex+7 && this.revised) {
                this.tempCustomizedPackage[selectindex+7]['menuids'].splice(findindex, 1);
                this.tempCustomizedPackage[selectindex].tempmenuids[menuitemindex].selected = false;
            }*/

            if (this.revised) {
                let indx = selectindex+7
                for (var i = indx; i < this.tempCustomizedPackage.length;) {
                    if (typeof this.tempCustomizedPackage[i] != 'undefined') {
                        this.tempCustomizedPackage[i]['menuids'].splice(findindex,1);
                    }
                    i = i+7;
                }
            }
        }else{
            console.log("index2", findindex);
            this.customizedPackage[selectindex].menuids.push(JSON.parse(JSON.stringify(selectitem)));
            this.customizedPackage[selectindex].tempmenuids[menuitemindex].selected = true;
            this.tempCustomizedPackage[selectindex]['menuids'].push(JSON.parse(JSON.stringify(selectitem)));
            
            /*if (this.tempCustomizedPackage.length > selectindex+7 && this.revised) {
                this.tempCustomizedPackage[selectindex+7]['menuids'].push(JSON.parse(JSON.stringify(selectitem)));
                this.tempCustomizedPackage[selectindex].tempmenuids[menuitemindex].selected = true;
            }*/

            if (this.revised) {
                let indx = selectindex+7
                for (var i = indx; i < this.tempCustomizedPackage.length;) {
                    if (typeof this.tempCustomizedPackage[i] != 'undefined') {
                        this.tempCustomizedPackage[i]['menuids'].push(JSON.parse(JSON.stringify(selectitem)));
                    }
                    i = i+7;
                }
            }
        }

        console.log("this.customizedPackage");
        console.log(this.customizedPackage);
        console.log("this.tempCustomizedPackage");
        console.log(this.tempCustomizedPackage);
        this.customizedPackageTotalPrice = this.calculatePriceForFlexible(this.customizedPackage);
    }


      public calculatePriceForFlexible(data){
        var datewiseitems = data;
        var newprice = 0;
        for(let i=0; i<datewiseitems.length; i++){
            datewiseitems[i].menuids.forEach((obj) => {
                newprice += obj.price;
            });
        } 
        return newprice;
    }

    public orderChanges($event){
        this.orderdetails = $event.orderDetail;
    }

    public checkHide(menu){     
        var index = this.activeitems.findIndex((item) => { return item.menuId._id == menu._id; });
        if(index != -1){
            return true;
        }else{
            return false;
        }
    }

    public allRestaurants(){
        this.frontendRestaurantService.getAllRestro().subscribe(data => {         
            this.restaurantsdetailall = data.message;  
            localStorage.setItem('currentrestro', JSON.stringify(this.restaurantsdetailall));      
        });
    }

    public getmenuname(id){
        var index = this.menus.findIndex(item => {return item._id == id});
        if(index != -1){
            return this.menus[index].name;
        }
      }

    public getrestroname(id){

        var index = this.restaurantsdetailall.findIndex(item => {return item._id == id});
        if(index != -1){
            return this.restaurantsdetailall[index].restaurantname;
        }
       }


    addInOrder(type, item){

        if((localStorage.getItem('cartinfo') && this.restaurantsdetail._id == JSON.parse(localStorage.getItem('cartinfo')).restaurantid) || !localStorage.getItem('cartinfo')){
                this.addNewInCart(type, item);
        }else if(confirm('Remove old used cart!')){
              localStorage.removeItem('cartinfo');
              this.addNewInCart(type, item);
              this.orderdetails = {"customerid" : "", "total": 0, "restaurantid": "", "name": "", "items" : [], "combo" : [], "package" : [], "ordertiming" : {"type" : ""}, "note": "", "coupon":"", "tax": "", "discount": "", "subtotal": ""};       
        }
       
    }

    addNewInCart(type, item){
                this.orderdetails["currency"] = this.restaurantsdetail.currency;
                this.orderdetails.name = this.restaurantsdetail.restaurantname;
                this.orderdetails.restaurantid = this.restaurantsdetail._id;
                if(type == 'menu'){
                this.addItemOrderDetail(item);
                }

                if(type == 'combo'){
                this.addComboOrderDetail(item);
                }

                if(type == 'mealpackage'){
                this.addMealPackageOrderDetail(item);
                }
    }

    addFlexiMealPkg(){
        $("#packageModelFlexible").modal('hide');
        this.orderdetails.name = this.restaurantsdetail.restaurantname;
        this.orderdetails.restaurantid = this.restaurantsdetail._id;
        let obj = this.selectedMealPackage;
        console.log("this.selectedMealPackage obj", obj, this.tempCustomizedPackage, this.customizedPackage, this.selectedMealPackage);
        if (typeof this.revised != 'undefined' && this.revised) {
            var flexprice = this.calculatePriceForFlexible(this.tempCustomizedPackage);
            obj['packageprice'] = flexprice - ((flexprice/100) * obj.discount);

           console.log("this.tempCustomizedPackage", this.tempCustomizedPackage);
        }

        if (typeof this.revised == 'undefined' || !this.revised){
            var flexprice2 = this.customizedPackageTotalPrice;
            obj['packageprice'] = flexprice2 - ((flexprice2/100) * obj.discount);
            console.log("this.customizedPackageTotalPrice", this.customizedPackageTotalPrice);
        }

        this.updateArr(this.tempCustomizedPackage,(data)=>{
            obj['dayandmenus'] = data;
            this.selectedFlexiMealPackage = obj;
            this.addPackage(this.selectedFlexiMealPackage, 'flexi');

        });
    }

    updateArr(arr,cb){
        let cusArr = []
        arr.forEach((item,i)=>{
            if (item['menuids'].length > 0){
                delete item['tempmenuids'];
                cusArr.push(item);
            }
            /*if (item['menuids'].length == 0) {
                arr.splice(i,1);
            }*/
        });
        cb(cusArr);
      }

    addPackage(pkg, type){
        var iid = pkg;
        iid['qty'] = 1;
        var rn1 = this.getrestroname(iid.kitchenId);
        if(this.orderdetails.restaurantid == '' || this.orderdetails.restaurantid == iid.kitchenId){
            //this.orderdetails.restaurantid = iid.kitchenId;
           // this.orderdetails.name = rn1;
            this.orderdetails.package.push(iid);
            this.refreshModel();
        }else{
            if(confirm("Adding will remove your current cart items!")) {
                this.orderdetails = {"customerid" : "", "total": 0, "restaurantid": iid.kitchenId, "name": rn1, "items" : [], "combo": [], "package": [], "ordertiming" : {"type" : ""}, "note": "", "coupon": "",  "tax": "", "discount": "", "subtotal": ""};
                this.orderdetails.package.push(iid);
                this.refreshModel();
            }else{
                this.refreshModel();
            }
        }
        this.setorderDetails();
    }

    refreshModel(){
        this.modelOpen = '';
       $('#modal').modal('toggle');
        delete this.customizedPackage;
        delete this.tempCustomizedPackage;
        delete this.revised;
        delete this.selectedFlexiMealPackage;
        this.customizedPackageTotalPrice = 0;
        this.getWeekly();
    }


    public addComboOrderDetail(item){
        
        var iid = item;
        var rn1 = this.getrestroname(iid.kitchenId);
        console.log("addComboOrderDetail", rn1);
        if(this.orderdetails.restaurantid == '' || this.orderdetails.restaurantid == iid.kitchenId){
            //console.log("this.orderdetails.restaurantid empty");
           // this.orderdetails.restaurantid = iid.kitchenId;
           // this.orderdetails.name = rn1;
            console.log("combonamedd", this.orderdetails);
            if(this.orderdetails.combo.length == 0){
                item.qty = 1;
                this.orderdetails.combo.push(item);
            }else{
                var index1 = this.orderdetails.combo.findIndex(itemget => { return itemget._id == item._id}); 
                if(index1 > -1){
                    this.orderdetails.combo[index1].qty += 1; 
                }else{
                    item.qty = 1;
                    this.orderdetails.combo.push(item); 
                }
            }
        }else{
            if(confirm("Adding will remove your current cart items!")) {
                iid.qty = 1;
                this.orderdetails = {"customerid" : "", "total": 0, "restaurantid": iid.kitchenId, "name": rn1, "items" : [], "combo": [], "package": [], "ordertiming" : {"type" : ""}, "note": "", "coupon": "",  "tax": "", "discount": "", "subtotal": ""};   
                this.orderdetails.combo.push(iid);
            }else{

            }
        }
        this.setorderDetails();
        }



    public addMealPackageOrderDetail(itemsd){
        let restname = this.getrestroname(itemsd.kitchenId);
        if(this.orderdetails.total == 0){
            //this.orderdetails.restaurantid = itemsd.kitchenId;
            this.orderdetails.customerid = this.custid;
           // this.orderdetails.name = restname; 
            console.log("mealpackagenamedd", this.orderdetails);
        }
        //if(itemsd.type == 'fixed'){
            this.orderdetails.total += parseFloat(itemsd.packageprice);
            itemsd.qty = 1;
            var newarray = [];
            itemsd.dayandmenus.forEach((item, inde) =>{
                if(item.menuids.length > 0){
                    itemsd.dayandmenus[inde]["status"] = false;  
                }else{
                    itemsd.dayandmenus.splice(inde, 1);
                }
            });
            this.orderdetails.package.push(itemsd); 
            this.modelOpen = '';
            $("#packageModelFixed").modal('hide');
            this.setorderDetails();   
        //}
       }


    /*public calculatePriceForFixed(data){
    //console.log("calculatePriceForFixed", data);
    var datewiseitems = data.dayandmenus;
    var newprice = 0;
    for(let i=0; i<datewiseitems.length; i++){
    datewiseitems[i].menuids.forEach((obj) => {
    newprice += obj.price;
    });
    } 
    return newprice;
    }
    */

    public addItemOrderDetail(item){
        var iid = item;
        var rn1 = this.getrestroname(iid.kitchenId);
        if(this.orderdetails.restaurantid == '' || this.orderdetails.restaurantid == iid.kitchenId){
            //console.log("this.orderdetails.restaurantid empty");
            this.orderdetails.restaurantid = iid.kitchenId;
            this.orderdetails.name = rn1;
            console.log("addItemOrderDetail add new", this.orderdetails);
            if(this.orderdetails.items.length == 0){
                iid.qty = 1;
                this.orderdetails.items.push(iid);
            }else{
                var index1 =  this.orderdetails.items.findIndex(itemget => { return itemget._id == iid._id}); 
                if(index1 > -1){
                    this.orderdetails.items[index1].qty += 1; 
                }else{
                    iid.qty = 1;
                    this.orderdetails.items.push(iid); 
                }
            }
        }else{

            if(confirm("Adding will remove your current cart items!")) {
                iid.qty = 1;
                this.orderdetails = {"customerid" : "", "total": 0, "restaurantid": iid.kitchenId, "name": rn1, "items" : [], "combo": [], "package": [], "ordertiming" : {"type" : ""}, "note": "", "coupon": "",  "tax": "", "discount": "", "subtotal": ""};   
                this.orderdetails.items.push(iid);
            }else{

            }
            /*if(this.orderdetails.restaurantid != iid.kitchenId){*/
            /*}else{
                if(this.orderdetails.items.length == 0){
                    iid.qty = 1;      
                    this.orderdetails.items.push(iid);
                }else{
                    var index2 =  this.orderdetails.items.findIndex(itemget => { return itemget._id == iid._id}); 
                    if(index2 != -1){
                        this.orderdetails.items[index2].qty += 1; 
                    }else{
                        iid.qty = 1;
                        this.orderdetails.items.push(iid); 
                    }
                }
            }*/
        }
        this.setorderDetails();
    }


    jq(){
        $(document).ready(function(){

            /*swipe between menu, review and info */
            $('.menuDetail').css("display","block");
            $('.reviewDetails ').css("display","none");
            $('.infoDetails').css("display","none");
            $('.threeTabs #menu h4').addClass('tabActive');


            /*menu system category */
            $('.menuSystem').css("display","block");
            $('.weeklySystem').css("display","none");
            $('.monthlySystem').css("display","none");
            $('.offerAvailable').css("display","none");
            $('.combo').css("display","none");
            $('#categoryMenuSystem').addClass('categoryActive');



            $('.threeTabs #menu').click(function(event){
                $('.menuDetails').css("display","block");
                $('.reviewDetails').css("display","none");
                $('.infoDetails').css("display","none");
                $('.threeTabs #menu h4').addClass('tabActive');
                $('.threeTabs #reviews h4').removeClass('tabActive');
                $('.threeTabs #info h4').removeClass('tabActive');
            });

            $('.threeTabs #reviews').click(function(event){
                $('.menuDetails').css("display","none");
                $('.reviewDetails').css("display","block");
                $('.infoDetails').css("display","none");
                $('.threeTabs #menu h4').removeClass('tabActive');
                $('.threeTabs #reviews h4').addClass('tabActive');
                $('.threeTabs #info h4').removeClass('tabActive');
            });

            $('.threeTabs #info').click(function(event){
                $('.menuDetails').css("display","none");
                $('.reviewDetails').css("display","none");
                $('.infoDetails').css("display","block");
                $('.threeTabs #menu h4').removeClass('tabActive');
                $('.threeTabs #reviews h4').removeClass('tabActive');
                $('.threeTabs #info h4').addClass('tabActive');
            });

            $('.menu_category #categoryMenuSystem').click(function(event){
                $('.menuSystem').css("display","block");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').addClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.menu_category #categoryWeeklySystem').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","block");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').addClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.menu_category #categoryMonthlySystem').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","block");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').addClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.menu_category #categoryOffer').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","block");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').addClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.menu_category #categoryCombo').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","block");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').addClass('categoryActive');
            });

        });
    }

    public setorderDetails(){ 
        this.orderdetails.total = 0;
        if(this.orderdetails.items.length > 0){
            var itemdetail =  this.orderdetails.items;
            for(var i =0 ; i<this.orderdetails.items.length; i++){
                this.orderdetails.total =  parseInt(this.orderdetails.total) + (parseInt(itemdetail[i].price) * parseInt(itemdetail[i].qty));     
            }
        }
        if(this.orderdetails.combo.length > 0){
            this.comboPriceCalculate();
        }
        if(this.orderdetails.package.length > 0){
            this.packagePriceCalculate();
        }
        this.orderdetails["subtotal"] = this.orderdetails.total;        
        localStorage.setItem('cartinfo', JSON.stringify(this.orderdetails));
        this.orderdetails = JSON.parse(localStorage.getItem('cartinfo'));
    }

    public packagePriceCalculate(){
        var allAddedPackagePrice = 0;
        for(let j =0; j<this.orderdetails.package.length; j++){
            this.orderdetails.total +=  parseFloat(this.orderdetails.package[j].packageprice);
        } 
    }

    public comboPriceCalculate(){
        var combo =  this.orderdetails.combo;
        for(var j =0 ; j<this.orderdetails.combo.length; j++){
            this.orderdetails.total =  parseFloat(this.orderdetails.total) + (parseFloat(combo[j].finalcomboprice) * parseInt(combo[j].qty));     
        }     
    }

    restaurantsDetail(){
        this.frontendRestaurantService.getOneRestro(this.restid).subscribe(data => {         
            this.restaurantsdetail = data.message;
            var tcusines = { cuisines :data.message.cuisines};
            console.log('tcusines', tcusines);
            this.masterService.getOneCuisinesmultiple(tcusines).subscribe((data) => {
            this.cusines = data.message;
            });

            this.todayOpen();
          //  console.log("this.restaurantsdetail", this.restaurantsdetail);        
        });
    }

    getMenus(){
        this.kitchenMenuService.getAlllist(this.restid).subscribe(data => { 
            this.menus = data.message;  
        });        
    }

    getItems(){
        this.kitchenMenuItemService.getAlllist(this.restid).subscribe(data => {
            this.items = data.message;
        });
    }

    getActiveItems(){
        this.kitchenMenuItemService.getActiveItems(this.restid).subscribe(data => {
            this.activeitems = data.message;
        });
    }

    getWeekly(){
        this.frontendRestaurantService.getActiveMealPackages(this.restid).subscribe((data) => {

            this.getMenus();       
            this.getItems();

            var mealdaayarray = [];
            data.message.forEach((item, index) => {
                if(item.type == 'fixed'){
                    var sdate = new Date(item.startdate);
                    sdate.setDate(sdate.getDate()-(this.restaurantsdetail.mealpackageallowdays-1));
                    var edate = new Date(item.enddate);
                    var tdate = new Date();

                    console.log("sgsgssp", sdate, item.startdate);

                    if(tdate <= sdate){
                    mealdaayarray.push(JSON.parse(JSON.stringify(item))); 
                    }
                }else{
                    mealdaayarray.push(JSON.parse(JSON.stringify(item)));
                }
            });
            this.weeklyrestaurants = mealdaayarray; 
            //console.log("weeklyrestaurants", this.weeklyrestaurants);
            //console.log("weeklyrestaurants");
            //console.log(this.weeklyrestaurants);      

        });
    }    

    getMonthly(){
        this.frontendRestaurantService.getMonthlyMenu(this.restid).subscribe(data => {
            this.getMenus();       
            this.getItems();
            var compi = { comp : data.message, hi : data.message};
            for(var i = 0; i < compi.hi.length; i++){
                var day = this.daysFind(compi.hi[i].startdate, compi.hi[i].enddate);
                var array = [];
                var v = 0;
                for(var j = 0; j < day; j++){
                    if(v == compi.hi[i].dayandmenus.length) 
                    {
                        v = 0;
                    }  

                    array.push(compi.hi[i].dayandmenus[v]);
                    v = v+1;
                }
                compi.comp[i].dayandmenus = array;
            }         
            this.monthlyrestaurants = compi.comp;       
        });
    }

    daysFind(sd,ed){
        var date1 = new Date('"'+ sd +'"');
        var date2 = new Date('"'+ ed +'"');
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        return diffDays;
    }      


    getOffers(){
        this.frontendRestaurantService.getOffersforRestro(this.restid).subscribe(data => {
            this.getMenus();       
            this.getItems();
            var newoff = data.message;
            var new_date = newoff.filter((item) => {
            var date1 =  new Date();
            var ind = new Date(item.indate);
            var end = new Date(item.expirydate);
            date1.setHours(0,0,0,0);
            ind.setHours(0,0,0,0);
            end.setHours(0,0,0,0);
            return ind <= date1 && date1 <= end;
            });      
            this.availoffer = new_date;                     
        });
    }

    getCombos(){
        this.frontendRestaurantService.getActiveCombos(this.restid).subscribe(data => {
            this.availcombo = data.message;
        });
    } 

    getFavourites(){ 
        this.frontendRestaurantService.getFavourite(this.custid).subscribe(data => {                
            if(data.message.length > 0 && data.message[0].customerfavrestro){
                    this.favouritelist = data.message[0].customerfavrestro; 
            }                                
                    this.setFavourites(this.restid);  
        });
    }  

    setFavourites(id){ 
        const index = this.favouritelist.findIndex(item => item == id);
        if(index == -1){
            this.fav =  {"color": "black"};
        }
        else{
            this.fav = {"color": "red"};
        }
    }


    addFavourites(id){
        var data = {_id : this.custid, rid : id};
        this.frontendRestaurantService.updateFavourite(data).subscribe(data => {
            this.favouritelist = data.message.customerfavrestro;
            this.setFavourites(this.restid);
        });

    }



    public updateCustomers(){
        var data = {_id : this.custid, customerfavrestro : this.favouritelistItemRestro};
        this.frontendService.updateFrontend(data).subscribe((item) => {
            this.getFavouritesItem();
        });
    }

    public addFavouritesItem(item, rids){
        if(this.favouritelistItemRestro.length == 0){    
            var rest = {id : rids , items : []};
            rest.items.push(JSON.parse(JSON.stringify(item._id)));
            this.favouritelistItemRestro.push(rest); 
            this.updateCustomers();
        }else{
            var index = this.favouritelistItemRestro.findIndex((rest) => {return rest.id == rids});
            if(index != -1){ 
                var index2 = this.favouritelistItemRestro[index].items.indexOf(item._id); 
                if(index2 != -1){
                    this.favouritelistItemRestro[index].items.splice(index2,1);
                    if(this.favouritelistItemRestro[index].items.length == 0){
                        this.favouritelistItemRestro.splice(index, 1); 
                    }
                    this.updateCustomers();
                }else{
                    this.favouritelistItemRestro[index].items.push(item._id);
                    this.updateCustomers();
                }     
            }else{
                var resty = {id : rids , items : []};
                resty.items.push(JSON.parse(JSON.stringify(item._id)));
                this.favouritelistItemRestro.push(resty);
                this.updateCustomers();
            }
        }

    } 


    public getFavouritesItem(){
        if(this.custid){
            this.frontendRestaurantService.getFavouriteItem(this.custid).subscribe(data => {
                if(data.message.length > 0 && data.message[0].customerfavrestro){
                this.favouritelistItemRestro = data.message[0].customerfavrestro;
                var index3 = this.favouritelistItemRestro.findIndex((rest) => {return rest.id == this.restid});
                this.favouriteir.ids = [];
                this.favouriteir.items = [];
                if(index3 != -1){
                    this.favouriteir.ids.push(this.favouritelistItemRestro[index3].id);
                    this.favouriteir.items = this.favouritelistItemRestro[index3].items;
                }
                }
            });
        }
    } 
}

@Component({
    selector: 'app-frontend',
    templateUrl: './accountinfo.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None 
})
export class CustomerAccountInfoComponent implements OnInit {

    @ViewChild("search")  
    public searchControl: FormControl;
    public searchElementRef: ElementRef; 
    imgurl2 : any =  globalVariable.imageUrl; 
    customerCard: FormGroup;
    referralAddModel: FormGroup;
    customerAddModel : any; 
    custid : any;
    addresspart:any;
    customerdetail : any = {cardinfo : []};
    active : any;
    restaurants : any = [];
    favouritelist : any = [];
    addresses : any = [];
    addressAddModel : any;
    componentForm :any = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    favouritelistItem:any = [];
    items:any = [];
    paramtype : any;
    userinfo: any = {lat: "", lng: ""};
    userCards: any = [];
    orders : any = [];
    rating : any;
    // Rating
    ratingClicked: number;
    itemIdRatingClicked: number;
    option: any;
    typei : any  = 'Customer'; 
    refs : any = false;
    selectedOrder: any;
    imageUrl: string = globalVariable.url2+'uploads/';
    reorderdSelectedOrder:any;
    customerReviewRating: any = [];
    resturantListRating:any = [];
    timezone:any;
    custinfo:any;

    firebaseOrders = [];
    firestore = firebase.database().ref('/orders');

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public frontendService: FrontendService,
        public frontendRestaurantService : FrontendRestaurantService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        
        public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public kitchenMenuItemService: KitchenItemService,
        public orderService : OrderService,
        public kitchenService: KitchenService,
        public ratingService : RatingService,
        public referralService : CustomerReferralService,
        public afd: AngularFireDatabase,
        ){this.custinfo = JSON.parse(localStorage.getItem('currentCustomer')); this.custid = this.custinfo._id;}


    ngOnInit(){ 
        var emailpattern : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        //this.getFavourites();
        this.onclickaddr();         
        this.customerAddModel = this.lf.group({
            _id : ['',Validators.required], 
            email: ['',Validators.required],      
            username: [''],      
            firstname: ['',Validators.required],
            lastname: ['',Validators.required],
            homephone: ['',Validators.required],
            cellphone: ['',Validators.required],
            gender: [''],
            dob: [''],
            termsandcondition: ['',Validators.required],
        });
        
        this.referralAddModel = this.lf.group({      
            referralfrom : [],
            type : ['Customer'],
            emailto: ['', [Validators.required, Validators.pattern(emailpattern)]]        
        });  


        var patternq = /^[+]?\d+(\.\d+)?$/;            
        this.addressAddModel = this.lf.group({     
            phoneno : ['',[Validators.required,Validators.pattern(patternq)]], 
            landline  : ['',[Validators.pattern(patternq)]], 
            address :  ['',Validators.required], 
            landmark : [''], 
            city: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]], 
            zipcode : ['',Validators.required],
            country: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],    
        });

        var accardpattern = /^[0-9-]{19}$/;
        var accardem = /^[0-9]{2}$/;
        var accardey = /^[0-9]{2}$/;
        var accardcvc = /^[0-9]{3}$/;

        this.customerCard = this.lf.group({
            _id : ['',Validators.required],                 
            cardnumber: ['',[Validators.required,Validators.pattern(accardpattern)]],
            expirymonth: ['',[Validators.required,Validators.pattern(accardem)]],
            expiryyear : ['',[Validators.required,Validators.pattern(accardey)]],
            cvc: ['',[Validators.required,Validators.pattern(accardcvc)]],
            clicked: ['',[Validators.required]]
            });
        this.customerCard.controls["clicked"].setValue(true);
        this.customerCard.controls["_id"].setValue(this.custid);

        this.getCustomer();
        this.jq();

        this.addressAddModel.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
        
        this.customerCard.valueChanges
        .subscribe(data => this.cardonValueChanged(data));
        this.cardonValueChanged(); // (re)set validation messages now

        this.referralAddModel.valueChanges
        .subscribe(data => this.referonValueChanged(data));
        this.referonValueChanged(); // (re)set validation messages now


        $(document).ready(function(){
            $('#date1').datetimepicker({format:'YYYY-MM-DD'});
        }); 

        this.getItems();
        this.myOrders();
        this.getCustomerRating();
        this.loadDefaults();        
        
        }
  
   public checktime(date){
        var date:any = new Date(date);
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;
    }
    
       
    public onKeyCardNumber(event){           
            // console.log(event);
            var foo = this.customerCard.value.cardnumber.split("-").join("");
            if (foo.length > 0) {
            foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
            }
            this.customerCard.controls["cardnumber"].setValue(foo);
           }


    public getCustomerRating(){
        //console.log("daaad");
        this.ratingService.getCustomerRating(this.custid).subscribe((data) => {
            var datai = data.message;            
            this.customerReviewRating = datai; 

            var temparr = [];            
            datai.forEach((item) => {
                var index = temparr.indexOf(item.restaurantId);
                if(index == -1){temparr.push(item.restaurantId);}
            });
            var obj = {"rids": temparr};
            this.kitchenService.getRestaurantsDetail(obj).subscribe((rsts) => {
                this.resturantListRating = rsts.message;
                this.customerReviewRating = datai;    
            });
        });
       }


    public GetRestro(id){
        var index = this.resturantListRating.findIndex((itemd) => {
            return itemd._id == id
        });
        if(index != -1){
            return this.resturantListRating[index].restaurantname;
        }
      }


    public ShowReviewRating(obj){
        var arr = [];   
        if(parseInt(obj) === obj){        
            arr[0] = obj;  
            arr[1] = 0; 
        }else{
            arr = obj.toString().split(".");
        }

        var html = "";    
        var newassing = 0;   
        var arr0 = parseInt(arr[0]);
        var arr1 = parseInt(arr[1]);

        for(var i=0; i<arr0;i++){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }  

        if(arr1 <= 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv half"></span>';
        }

        if(arr1 > 5 && arr1 > 0){
            newassing += 1;
            html += '<span class="stardiv on"></span>';
        }

        var leftstar = (5 - newassing);
        for(var k=0; k<leftstar; k++){
            html += '<span class="stardiv"></span>';
        }
        return html;
    }


    public reorder(order){
        this.reorderdSelectedOrder = order;
        if (JSON.parse(localStorage.getItem('cartinfo'))) {
            if(JSON.parse(localStorage.getItem('cartinfo'))['items'].length > 0 || JSON.parse(localStorage.getItem('cartinfo'))['combo'].length > 0 || JSON.parse(localStorage.getItem('cartinfo'))['package'].length > 0){
                if(confirm("Reordering will remove your current cart items!")) {
                    this.addToCart();
                } else {
                    return false;
                }
            }else{
                this.addToCart()
            }
        }else{
            this.addToCart()
        }
    }


    public addToCart(){
        let total = this.calculateSubTotal();
        let obj = {};
        obj = {"customerid":this.reorderdSelectedOrder.customerid, "subtotal": total, "discount": "", "total": total, "ordertiming" : {}, "coupon" : "", "tax": this.reorderdSelectedOrder.tax, "restaurantid": this.reorderdSelectedOrder.restaurantid, "name": this.reorderdSelectedOrder.name, "items" : this.reorderdSelectedOrder.items, "combo" : this.reorderdSelectedOrder.combo, "package" : []};
        localStorage.removeItem('cartinfo');
        localStorage.setItem('cartinfo',JSON.stringify(obj));
        //this.events.publish('cart:item', obj,Date.now());
        //this.navCtrl.push(CartPage);
        //this.route.navigate(["/browse-restaurants"]);
        this.router.navigate(['/customer/restaurant-detail', this.reorderdSelectedOrder.restaurantid]);
    }


    public calculateSubTotal(){
        let total = 0;
        if (this.reorderdSelectedOrder.package.length > 0) {
            for (var i = 0; i < this.reorderdSelectedOrder.package.length; i++) {
                total = this.reorderdSelectedOrder['subtotal'] - parseFloat(this.reorderdSelectedOrder.package[i]['packageprice']);
            }
            return total;
        }else{
            total = this.reorderdSelectedOrder['subtotal'];
            return total;
        }
    }


    public cancelOrder(order){ 
        
        var checkindex = this.orders.findIndex((item) => {
         return item._id == order._id;
        });
        console.log("checkindex", checkindex);
        if(checkindex > -1){
         this.orders[checkindex].status = 'cancelled';
        }

        order["customerid"] = this.custinfo;

        var obj = {
            _id: order._id,
            status: 'cancelled'
        };
        
        if(this.selectedOrder && this.selectedOrder.status && this.selectedOrder.status != 'cancelled') {
           this.selectedOrder.status = 'cancelled';
           }

        
        this.orderService.update(obj).subscribe((data) => {
            if (!data.error) {
                //this.myOrders();

                 this.changeFirebaseOrderStatus('cancelled', order._id);

                this.kitchenService.getOne(order.restaurantid).subscribe((data) => {
                var obj1 = {customeremail: order.customerid.email, order: order, kitchenemail : data.message.email};
                this.kitchenService.orderCancelMail(obj1).subscribe(() =>{});
                });
        toastr.remove();
        toastr.success('This order has Cancel');
                }

            });

      }


 changeFirebaseOrderStatus(type , orderid){

    let itemRef = this.afd.object('orders');
    var count = 0;

    itemRef.snapshotChanges().subscribe(action => {

      let arr = action.payload.val();

      let pushArr = [];

      for (var k in arr){
        if (arr.hasOwnProperty(k)) {
          pushArr.push({'key':k,'orderDetail':arr[k]})
        }
      }
      this.firebaseOrders = pushArr;
    });

    setTimeout(()=>{
      if (this.firebaseOrders && this.firebaseOrders.length > 0) {
        let indx = this.firebaseOrders.findIndex((mn)=> mn.orderDetail['orderID'] == orderid)

        if (indx > -1) {
          this.updateFirebaseOrderStatus(this.firebaseOrders[indx]['key'],type);
        }
      }
    },5000)
  }

  updateFirebaseOrderStatus(key, type){
    this.afd.list(this.firestore).update(key, { orderStatus: type, type: 'item' }).then(() => {
      console.log('Order Updated');
    });
  }


    public referralAdd(){
        this.referralAddModel.controls["referralfrom"].setValue(JSON.parse(localStorage.getItem('currentCustomer'))._id);    
        this.referralAddModel.controls["type"].setValue(this.typei);
        this.referralService.add(this.referralAddModel.value).subscribe(data => {  
            toastr.remove();
            toastr.success('Referral has been Send Sucessfully!');
            this.referralAddModel.reset();
        });
    }

    public addNewAddress(){
        this.addressAddModel.reset();
        this.userinfo.lat = "";
        this.userinfo.lng = "";
        setTimeout(() => {
            this.initMap();
        }, 1500);
    }

    public modelClosed(){
        $('#addAddressModel').modal('hide');
    }

    public loadDefaults(){
        this.route.queryParams.subscribe(params => {
            this.paramtype = params["type"];
            if (this.paramtype == 'savedaddress') {
                document.getElementById('saveaddress-tab').click();
            }
          //  console.log(this.paramtype);
            if(params["type"] == 'myfavorite'){ 
                document.getElementById('myfavorite-tab').click();                  
            }

            if(params["type"] == 'accountinfo'){ 
                document.getElementById('accont-infotab').click();                  
            }

            if(params["type"] == 'myorders'){ 
                document.getElementById('order-tab').click();                  
            }
        });
    }

    public myOrders(){
        this.orderService.getAllCustomerOrder(this.custid).subscribe((data) => {
            var orderRestaurant = data.message;      
            var listOfIds = orderRestaurant.map(item => item.restaurantid)
            .filter((value, index, self) => self.indexOf(value) === index);
            this.getRestaurantsDetail(listOfIds, orderRestaurant);      
        });
    }

    public getRestaurantsDetail(restros, orderRestaurant){
        var orders = [];
        var obj = {"rids": restros};
        this.kitchenService.getRestaurantsDetail(obj).subscribe((rdata) => {      
            ////console.log("data", rdata.message);  
            var allrestro = rdata.message; 
            for(var i=0; i<orderRestaurant.length; i++ ){
                ////console.log(orderRestaurant[i]._id)
                var index = allrestro.findIndex((item) => {
                    return item._id == orderRestaurant[i].restaurantid
                });
                ////console.log(index)
                if(index != -1){
                    orderRestaurant[i]["restaurantname"] =  allrestro[index].restaurantname;
                    orderRestaurant[i]["image"] =  allrestro[index].image;
                }
                orders.push(orderRestaurant[i]);          
                }


            var updateRatingOrders = [];
            orders.forEach((item, i) => {
            var index = this.customerReviewRating.findIndex((itemfind) => {
                 return itemfind.orderId == item._id;
             });
            if(index != -1){
             orders[i]["ratingUpdateStatus"] = this.customerReviewRating[index].ratingUpdateStatus;
             }else{
             orders[i]["ratingUpdateStatus"] = false;
             }
             updateRatingOrders.push(orders[i]);
            });
            this.orders = updateRatingOrders;
        });
      }
    


    public selectOrder(order){
        //console.log("ggg", order);
        this.selectedOrder = order;

    }

    public ratingComponetClick(clickObj: any): void {
        this.rating[clickObj.type].rating = clickObj.rating; 
    }

    public jsp(addr){
        return JSON.parse(addr);  
    }



    public updateRating(){
        var obj={ 
            "orderPackagingRating" : this.rating.orderPackagingRating.rating,
            "deliveryTimeRating" : this.rating.deliveryTimeRating.rating,
            "valueOfTimeRating": this.rating.valueOfTimeRating.rating,
            "average": ((parseInt(this.rating.orderPackagingRating.rating) + parseInt(this.rating.valueOfTimeRating.rating) + parseInt(this.rating.valueOfTimeRating.rating))/3).toFixed(2),
            "review": this.rating.review,
            "restaurantId" : this.rating.restaurantId,
            "customerId" : this.custid,
            "orderId": this.rating.orderId,          
            "items": this.rating.items,          
            "combo": this.rating.combo,          
            "package": this.rating.package,          
            "ratingUpdateStatus" : true,
            };

        //console.log("data obj", obj);
        var indexx = this.orders.findIndex((items) => {
            return obj.orderId == items._id;
        });  
        if(indexx > -1){
         this.orders[indexx].ratingUpdateStatus = true;
        }

        this.ratingService.add(obj).subscribe((data) => {
      //  console.log("data", data);
        $('#myrating').modal('hide');

        });

    }

    public myrating(order){
        //console.log("order", order);
        this.kitchenService.getOne(order.restaurantid).subscribe((restdetail) => {
            var obj = restdetail.message;
            this.rating = { 
                "restaurantName" : obj.restaurantname,
                "image" : obj.image, 
                "status" : order.status,
                "review" : "",
                "restaurantId" : order.restaurantid,
                "orderPackagingRating" : { "type": "orderPackagingRating", "rating" : 0 }, 
                "deliveryTimeRating" : { "type": "deliveryTimeRating", "rating" : 0 },
                "valueOfTimeRating": { "type": "valueOfTimeRating", "rating" : 0 },
                "items": [],
                "combo" : [],
                "package": [],
                "orderId": order._id,
                "ratingUpdateStatus": false 
            };

            order.items.forEach((item) => {
                var objindex = this.rating.items.indexOf(item._id);
                if(objindex == -1){
                    this.rating.items.push(item._id)
                }
            });


            order.combo.forEach((item) => {
                var objindex = this.rating.combo.indexOf(item._id);
                if(objindex == -1){
                    this.rating.combo.push(item._id)
                }
            });


            order.package.forEach((item) => {
                var objindex = this.rating.package.indexOf(item._id);
                if(objindex == -1){
                    this.rating.package.push(item._id)
                }
            });

            //console.log("this.rating", this.rating); 
            this.setRestroRating(order);                 
        });
    }



    public setRestroRating(order){
        var obj = {"orderId": order._id,"customerId" : this.custid};
        this.ratingService.checkRestroRating(obj).subscribe((presetRating) => {
            if(presetRating.message.length > 0){
                var data = presetRating.message[0];  
                console.log("ratingnitrms",data);
                if(data.orderPackagingRating){
                    this.rating.orderPackagingRating.rating = data.orderPackagingRating;
                }
                if(data.deliveryTimeRating){
                    this.rating.deliveryTimeRating.rating = data.deliveryTimeRating;
                }
                if(data.valueOfTimeRating){
                    this.rating.valueOfTimeRating.rating = data.valueOfTimeRating;
                }
                if(data.ratingUpdateStatus){
                    this.rating.ratingUpdateStatus  = data.ratingUpdateStatus;
                }
                if(data.review){
                    this.rating.review = data.review;
                }
            }
        });
    }

    public initMap(){    
        if(navigator.geolocation){            
            navigator.geolocation.getCurrentPosition((position) => {
                toastr.success("Auto Address has been fill!");
                this.userinfo.lat = position.coords.latitude;
                this.userinfo.lng = position.coords.longitude;
                this.mapRun();
                /*this.frontendService.getOneCust(this.custid).subscribe((customer) => {
                //console.log(customer,"customerdf");
                this.frontendService.getCityLatLng(customer.).subscribe((data) => {});
                });*/

            },(error) => { 
                toastr.error("Here is an issue to detect an auto fill address!");
                this.elseMapRun();
            });
            } else {
            toastr.error("Geolocation is not supported by this browser.");
            this.elseMapRun();
        }
       }
  

     public elseMapRun(){
            console.log("elseMapRun");
            var input = (<HTMLInputElement>document.getElementById('pac-input'));
            var options = {types: []};
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', () => {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.address_components) {
                    let city,country,lat,lng;
                    console.log(place.address_components);

                            
                            this.addresspart = [];
                            for (var i = 0; i < place.address_components.length; i++) {
                            var addressType = place.address_components[i].types[0];
                            if (this.componentForm[addressType]) {
                            var val = place.address_components[i][this.componentForm[addressType]]; 
                            if(addressType == 'locality'){
                            this.addressAddModel.controls["city"].setValue(val);
                            }
                            if(addressType == 'postal_code'){
                            this.addressAddModel.controls["zipcode"].setValue(val);
                            }
                            if(addressType == 'country'){
                            this.addressAddModel.controls["country"].setValue(val);
                            } 
                            this.addressAddModel.controls["address"].setValue(input.value);                                    
                            }
                            } 
                          

                    this.userinfo.lat = place.geometry.location.lat();
                    this.userinfo.lng = place.geometry.location.lng();
                    this.mapRun();
                  }
            });

           }


    public mapRun(){
        var input = (<HTMLInputElement>document.getElementById('pac-input'));
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: parseFloat(this.userinfo.lat), lng: parseFloat(this.userinfo.lng)},
            zoom: 15
        });
        var autocomplete = new google.maps.places.Autocomplete(input, {types: []});
        autocomplete.bindTo('bounds', map);
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29),
            position: {lat: parseFloat(this.userinfo.lat), lng: parseFloat(this.userinfo.lng)},
            visible: true,
            draggable: true
        });
        google.maps.event.addListenerOnce(map, 'idle', () => {
            var loadlat = marker.position.lat();
            var loadlng = marker.position.lng();
            console.log("loadlat, loadlng", loadlat, loadlng);
            this.getgeo(loadlat, loadlng);
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
                window.alert("No details available for input: '" + place.name + "'");
                return;
            } 
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);  
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                this.addresspart = [];
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        var val = place.address_components[i][this.componentForm[addressType]]; 
                        if(addressType == 'locality'){
                            this.addressAddModel.controls["city"].setValue(val);
                        }
                        if(addressType == 'postal_code'){
                            this.addressAddModel.controls["zipcode"].setValue(val);
                        }
                        if(addressType == 'country'){
                            this.addressAddModel.controls["country"].setValue(val);
                        } 
                        this.addressAddModel.controls["address"].setValue(input.value);                                    
                    }
                } 
            }
        });
    }

    public getgeo(lat, long){
        var geocoder = new google.maps.Geocoder();
                        var latlng = new google.maps.LatLng(lat, long);
                        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
                                if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                    var addresss =results[1].formatted_address; 
                    for (var i = 0; i < results[1].address_components.length; i++) {
                        var addressType = results[1].address_components[i].types[0];

                        if (this.componentForm[addressType]) {
                            var val = results[1].address_components[i][this.componentForm[addressType]]; 
                            if(addressType == 'locality'){
                                this.addressAddModel.controls["city"].setValue(val);
                            }
                            if(addressType == 'postal_code'){
                                this.addressAddModel.controls["zipcode"].setValue(val);
                            }
                            if(addressType == 'country'){
                                this.addressAddModel.controls["country"].setValue(val);
                            }            
                            this.addressAddModel.controls["address"].setValue(addresss);
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


    public getItems(){
        this.kitchenMenuItemService.getAll().subscribe(data => {
            this.items = data.message; 
            this.getFavouritesItem();      
        });
    }


    public getFavouritesItem(){ 
        this.frontendService.getOneCust(this.custid).subscribe(data => {
            // this.favouritelistItem = [];
            console.log(data.message.favouriteitems);
            var list = data.message.favouriteitems;
            var newarr = [];
            var len = this.items.length;
            if(len > 0 && typeof list != 'undefined' && list.length > 0){
            for(var i=0; i<len; i++){
                if(list.indexOf(this.items[i]._id) != -1){
                    newarr.push(this.items[i]);
                }
            }
            this.favouritelistItem = newarr;
            }
            //console.log("this.favouritelistItem");
            //console.log(this.favouritelistItem);
        });
    } 


    public mmap(){
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['establishment']
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.addresspart = [];
                    for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];
                        if (this.componentForm[addressType]) {
                            var val = place.address_components[i][this.componentForm[addressType]]; 
                            if(addressType == 'locality'){
                                this.addressAddModel.controls["city"].setValue(val);
                            }
                            if(addressType == 'postal_code'){
                                this.addressAddModel.controls["zipcode"].setValue(val);
                            }
                            if(addressType == 'country'){
                                this.addressAddModel.controls["country"].setValue(val);
                            }            
                            //(<HTMLInputElement>document.getElementById(addressType)).value = val;
                            this.addressAddModel.controls["address"].setValue(place.name +','+ place.formatted_address);                     
                        }
                    }
                });
            });
        });
    }


    public updateterm(){
        //console.log(this.customerAddModel.value);
        if(this.customerAddModel.value.termsandcondition == ""){
            this.customerAddModel.controls["termsandcondition"].setValue(true);
        }else{
            this.customerAddModel.controls["termsandcondition"].setValue("");  
        }
    }

    public getTimeData(even){
        var timeJ = even.getAttribute('id');
        let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
        this.customerAddModel.controls['dob'].setValue(eleObj.value);   
    }


    jq(){
        $(document).ready(function(){
            /*menu system category */   

            $('[data-toggle="tooltip"]').tooltip();   


            $('.weeklySystem').css("display","block");
            $('.monthlySystem').css("display","none");
            $('.offerAvailable').css("display","none");
            $('.combo').css("display","none");
            $('#categoryMenuSystem').addClass('categoryActive');



            $('.threeTabs #menu').click(function(event){
                $('.menuDetails').css("display","block");
                $('.reviewDetails').css("display","none");
                $('.infoDetails').css("display","none");
                $('.threeTabs #menu h4').addClass('tabActive');
                $('.threeTabs #reviews h4').removeClass('tabActive');
                $('.threeTabs #info h4').removeClass('tabActive');
            });

            $('.threeTabs #reviews').click(function(event){
                $('.menuDetails').css("display","none");
                $('.reviewDetails').css("display","block");
                $('.infoDetails').css("display","none");
                $('.threeTabs #menu h4').removeClass('tabActive');
                $('.threeTabs #reviews h4').addClass('tabActive');
                $('.threeTabs #info h4').removeClass('tabActive');
            });

            $('.threeTabs #info').click(function(event){
                $('.menuDetails').css("display","none");
                $('.reviewDetails').css("display","none");
                $('.infoDetails').css("display","block");
                $('.threeTabs #menu h4').removeClass('tabActive');
                $('.threeTabs #reviews h4').removeClass('tabActive');
                $('.threeTabs #info h4').addClass('tabActive');
            });

            $('.categories #categoryMenuSystem').click(function(event){
                $('.menuSystem').css("display","block");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').addClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.categories #categoryWeeklySystem').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","block");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').addClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.categories #categoryMonthlySystem').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","block");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').addClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.categories #categoryOffer').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","block");
                $('.combo').css("display","none");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').addClass('categoryActive');
                $('#categoryCombo').removeClass('categoryActive');
            });

            $('.categories #categoryCombo').click(function(event){
                $('.menuSystem').css("display","none");
                $('.weeklySystem').css("display","none");
                $('.monthlySystem').css("display","none");
                $('.offerAvailable').css("display","none");
                $('.combo').css("display","block");
                $('#categoryMenuSystem').removeClass('categoryActive');
                $('#categoryWeeklySystem').removeClass('categoryActive');
                $('#categoryMonthlySystem').removeClass('categoryActive');
                $('#categoryOffer').removeClass('categoryActive');
                $('#categoryCombo').addClass('categoryActive');
            });    
        });
    }



    gender(g){
        this.active = g;     
    }

    getCustomer(){
        this.frontendService.getOneCust(this.custid).subscribe(data => {                
            this.customerdetail = data.message;
            $('.refresh1').trigger('click');
        console.log("n", this.customerdetail);
            this.addresses = data.message.customeraddresses; 
            if(this.addresses.length == 1){
            this.addresses[0].default = true;
            }
            this.customerAddModel.patchValue(this.customerdetail);
            if(this.customerdetail.gender == ''){           
                this.active = 'female';
            }else{
                this.active = this.customerdetail.gender;
            }       

        });
    } 

    onValueChanged(data?: any) {
        if (!this.addressAddModel) {return;  }
        const form = this.addressAddModel;

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
        'city': '',
        'country' : '',
        'phoneno': '',
        'landline': '',

    };

    validationMessages = {
        'city': {
            'required':      'Username is required.',      
            'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
        },
        'country': {
            'required':      'Username is required.',      
            'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
        },
        'phoneno': {
            "required" : "Required only numberic!",
            'pattern'  : 'Required only numberic!'
        },
        'landline': {
            'pattern'  : 'Required only numberic!'
        } 
    };

    cardonValueChanged(data?: any) {
        if (!this.customerCard) {return;  }
        const form = this.customerCard;

        for (const field in this.cardformErrors) {
            // clear previous error message (if any)
            this.cardformErrors[field] = '';
            const control = form.get(field);      
            if (control && control.dirty && !control.valid) {
                const messages = this.cardvalidationMessages[field];
                for (const key in control.errors) {
                    this.cardformErrors[field] += messages[key] + ' ';          
                }
            }
        }
    }

    cardformErrors = {
        'cardnumber': '',
        'expirymonth' : '',
        'expiryyear': '',
        'cvc': '',

    };


    cardvalidationMessages = {
        'cardnumber': {
            'required':      'Required.',      
            'pattern'   :    'It should numberic and 16 digit.'
        },
        'expirymonth': {
            'required':      'Required.',      
            'pattern'   :    'It should numberic and 2 digit.'
        },
        'expiryyear': {
            "required" : "Required.",
            'pattern'  : 'It should numberic and 2 digit.'
        },
        'cvc': {
            'pattern'  : 'Required.',
            "required" : "It should numberic and 3 digit.",
        } 
    };



    referonValueChanged(data?: any) {
        if (!this.referralAddModel) {return;  }
        const form = this.referralAddModel;

        for (const field in this.referformErrors) {
            // clear previous error message (if any)
            this.referformErrors[field] = '';
            const control = form.get(field);      
            if (control && control.dirty && !control.valid) {
                const messages = this.refervalidationMessages[field];
                for (const key in control.errors) {
                    this.referformErrors[field] += messages[key] + ' ';          
                }
            }
        }
    }

    referformErrors = {
        'emailto': '',
        };


    refervalidationMessages = {
        'emailto': {
            'required':      'Required.',      
            'pattern'   :    'Please enter valid email address.'
        }        
    };


    mes:any = "";
    public updateCard(){
        
         var abc = this.customerCard.value.cardnumber.split("-").join("");
        this.customerCard.value.cardnumber = abc;  
         var checkcardindex =  this.customerdetail.cardinfo.findIndex((item) => {
             console.log("hio", item.cardnumber , this.customerCard.value.cardnumber +";"+
              item.expirymonth , this.customerCard.value.expirymonth +";"+
              item.expiryyear , this.customerCard.value.expiryyear);
             return item.cardnumber == this.customerCard.value.cardnumber 
             && item.expirymonth == this.customerCard.value.expirymonth
             && item.expiryyear == this.customerCard.value.expiryyear
             });

         console.log("checkcardindex:", checkcardindex)
         if(checkcardindex > -1){
           toastr.remove();
           toastr.error("This card is already exist."); 
         }else{
          
         this.customerCard.controls["clicked"].setValue('');     
        (<any>window).Stripe.card.createToken({
        number: this.customerCard.value.cardnumber,
        exp_month: this.customerCard.value.expirymonth,
        exp_year: this.customerCard.value.expiryyear,
        cvc: this.customerCard.value.cvc
        }, (status, response) => {            
        if (status === 200) {
      //  console.log("success", response);        
        this.mes = "";
        toastr.clear();
        toastr.success("successfully Added!");
        this.customerCard.value["cardtype"] = response.card.brand.toLowerCase(); 

        
       // console.log("this.customerCard.value", this.customerCard.value);
       setTimeout(()=>{
        this.newCardAdd();
        }, 1000);


        } else {     
        this.mes = "";   
        toastr.clear();
        toastr.error(response.error.message); 
        this.chlickednewCardAdd();
        }

        });

    }
    }
    
    public chlickednewCardAdd(){
        this.customerCard.controls["clicked"].setValue(true);
        $(".modal-body").trigger('click');
    }
    
    public newCardAdd(){
        var abc = this.customerCard.value.cardnumber.split("-").join("");
        this.customerCard.value.cardnumber = abc;
        console.log("dfdsh", this.customerdetail.cardinfo.length);
        
        if(this.customerdetail.cardinfo.length == 0){
            this.customerCard.value["default"] = true;
        }
        this.customerdetail.cardinfo.push(this.customerCard.value);
        //console.log("", this.customerdetail.cardinfo);
         
        //var io = this.customerdetail.cardinfo;
        //this.customerdetail.cardinfo = io;

        this.updateCustomerDetail();
        this.customerCard.reset();
        this.customerCard.controls["_id"].setValue(this.custid);
         this.customerCard.controls["clicked"].setValue(true);
          console.log("TRP", this.customerCard.value); 

        $("#creditModal").modal('hide');
    }

    public cardMakeDefault(index){
      var leng = this.customerdetail.cardinfo.length;
      for(var i = 0; i<leng; i++){
         this.customerdetail.cardinfo[i].default = false;
      }
      this.customerdetail.cardinfo[index].default = true; 
      console.log("ttr", this.customerdetail.cardinfo);
      this.updateCustomerDetail();
    }

    public updateCustomerDetail(){
        var obj = {_id : this.custid, "cardinfo": this.customerdetail.cardinfo};
        this.frontendService.updateFrontend(obj).subscribe((data)=>{
            this.customerdetail = {};
            console.log("o", this.customerdetail);
            this.getCustomer(); 
            toastr.clear();
            toastr.success("Update Info has done!");
           
        });
    }

    public  removeCard(index){
        this.customerdetail.cardinfo.splice(index, 1);
        this.updateCustomerDetail();   
    }


    updateCustomer(){
        this.customerAddModel.controls["_id"].setValue(this.custid);
        this.customerAddModel.controls["gender"].setValue(this.active);
        this.customerAddModel.controls["username"].setValue(this.customerAddModel.value.email);
        this.frontendService.updateFrontend(this.customerAddModel.value).subscribe(data => {
            toastr.remove();
            toastr.success('Updated Successfully');
        })
    }

    browseRestaurants(){
        this.favouritelist = [];
        this.frontendRestaurantService.getAllRestro().subscribe(data1 => {
            this.restaurants = data1.message;   
            this.frontendRestaurantService.getFavourite(this.custid).subscribe(data2 => { 
                var data = data2.message[0].customerfavrestro;

                let FavObj = {};
                ////console.log('fav length', this.restaurants, data)
                for(var i=0; i<data.length; i++){
                    let itemArr = []
                    var index = this.restaurants.findIndex((rest) => {
                        return rest._id ==  data[i].id;
                    });
                    // console.log(index, this.restaurants[index]);
                    var newres = this.restaurants[index];
                    FavObj['name'] = newres;
                    /// //console.log(FavObj);
                    var len = 0;
                    if(data[i].items){
                        len = data[i].items.length;
                        for(var j =0; j < len; j++){
                            var indexw = this.items.findIndex((itemid) => { return itemid._id == data[i].items[j]});
                            itemArr.push(this.items[indexw])
                        }
                      // console.log("FavObj", FavObj);
                      if(FavObj["name"]){
                        FavObj['items'] = itemArr
                        this.favouritelist.push(JSON.parse(JSON.stringify(FavObj)));
                      }
                        // console.log("this.favouritelist", this.favouritelist);
                    }

                }
                ////console.log('this.favouritelist',this.favouritelist)   
                ////console.log('this.favouritelist',this.favouritelist)   
            }); 
        });
    }

    getFavourites(){
        this.browseRestaurants();
    }

    onclickaddr(){
        this.getCustomer();
    }

    refresh(){
        $("#myModal").modal('hide');
        $('#mymenuModal').on('hidden.bs.modal', function () {
            $(this).find('form').trigger('reset');
        });
        this.addressAddModel.reset();
    }

    updateAddress(){          
        if(this.addresses.length == 0){    
            this.addressAddModel.value["default"] = true;
        }
        //console.log("ddds", this.addressAddModel.value);
        this.frontendService.updateCustAddress(this.custid, this.addressAddModel.value).subscribe(data => {
            //console.log(data);
            if(data.error){
                toastr.remove();
                toastr.error(data.message);
            }else{
                toastr.remove();
                toastr.success('Added Successfully');
                $('#addAddressModel').modal('hide');
                this.addresses = data.message.customeraddresses; 
                this.refresh();
            }      
        });
    }

    removeAddress(id){
        var obj = {_id : this.custid, id : id};
        if(confirm("Are you sure to delete ?")) {
            this.frontendService.removeCustAddress(obj).subscribe(data => {
                this.addresses = data.message.customeraddresses;     
            });
           }
        } 

    addressMakeDefault(id){
        //console.log(id);  
        var index1 = this.addresses.findIndex((item) => {
            return item.default == true
        });
        if(index1 != -1){
            this.addresses[index1].default = false;
        }

        var index2 = this.addresses.findIndex((item) => {
            return item._id == id
        });
        if(index2 != -1){
            this.addresses[index2].default = true;
        }
        var obj = {_id : this.custid, "customeraddresses" : this.addresses};
        this.frontendService.updateFrontend(obj).subscribe(data => {
            //console.log("update frontEned");
        });
    }
}

@Component({
    selector: 'app-frontend',
    templateUrl: './pagesshow.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendPageComponent implements OnInit {

    page : any;
    pageDetail : any = {};

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,   
        public frontendRestaurantService : FrontendRestaurantService,
        public pageService : PageService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        
        public frontendService : FrontendService) {}
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.page = params['page'];
            this.getPage();
        });
    }

    getPage(){
        this.pageService.getOneUrl(this.page).subscribe(data => {                
            this.pageDetail = data.message[0];                                                            
        });
    }
}

@Component({
    selector: 'app-frontend',
    templateUrl: './contactus.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendContactUsComponent implements OnInit {
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    page : any;
    pageDetail : any = {};
    contactAddModel : any;
    cp : any = '';
    success : any = false;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,   
        public frontendService : FrontendService,
        public pageService : PageService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        ) {}
    ngOnInit() {

        this.route.params.subscribe((params: Params) => {
            this.page = params['page'];
            //this.getPage();
        });

        this.contactAddModel = this.lf.group({ 
            name : ['',Validators.required],
            email : ['',Validators.required], 
            phone : ['',Validators.required],
            message : ['',Validators.required],
            capcontrol : ['',Validators.required]
        }); 
    }
    sfalse(){
        this.success = false;
    }
    handleCorrectCaptcha(event){
        this.cp = true;
        this.contactAddModel.controls["capcontrol"].setValue(this.cp); 
    }

    onCaptchaExpired(){
        this.cp = ''; 
        this.contactAddModel.controls["capcontrol"].setValue(this.cp); 
        this.captcha.reset();   
    }

    contactSubmit(){
        this.frontendService.sendContactQuery(this.contactAddModel.value).subscribe(data => {                
            this.success =  true; 
            this.contactAddModel.reset(); 
            this.cp = '';           
            this.captcha.reset();                                                        
        });
    }
}



@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendCheckoutComponent implements OnInit {
    userFilter2 : any = "";
    addressAddModel : FormGroup;
    customerCard : FormGroup;
    cid : any ;
    currentCustomerDetail : any;
    checkoutsummary : any = {"total" : "","info": ""};
    deliveryAddress : any = [];
    paymentoption : any = 'no';
    finalPlaceOrder : any = {};
    selectedaddress : any = {"status": false, "address" : ""};
    imageUrl: string = globalVariable.url2+'uploads/';
    cards:any = [];
    addcard: any = false;
    ordertiming: any;
    userinfo: any = {"lat": "", "lng": ""};
    addresspart:any;
    componentForm :any = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    voucharCode:any;
    finalTotalAmount:any;
    message: any = "";
    cvc: any = ""; 
    cardSelected:any;
    todayOpend:any = false;
    todayOpendd:any = false;
    todayOpenstatus:any = false;
    restaurantsdetail:any;
    checkedd:any = false;
    loader_run:any = false;
    finalTotalAmountabc : any;
    newrestaurantsdetail:any;
    hidewithdiscount:any = true;
    orderEntry = firebase.database().ref('/orders');
    deliveryCharges:any;
    showForm:any = false;


    constructor(
        public lf: FormBuilder,
        public route : Router,
        public kitchenService : KitchenService ,
        public frontendService : FrontendService,
        public orderService : OrderService,
        public offerService : OfferService,
        public afd: AngularFireDatabase,
        public deliveryChargesService: DeliveryChargesService
        ) {     
       

        if(!localStorage.getItem('cartinfo') || !localStorage.getItem('currentCustomer')){
         this.route.navigate(['/customer/browse-restaurants']);
        }


        if(localStorage.getItem('currentCustomer')){
            this.currentCustomerDetail = JSON.parse(localStorage.getItem('currentCustomer'));
            this.cid = this.currentCustomerDetail._id;
        }

        /*else{
            toastr.clear();
            toastr.error("You can not checkout without login!")
            this.route.navigate(['/customer/login']); 
        } */   

    }        

    ngOnInit() { 

        var patternq = /^[+]?\d+(\.\d+)?$/;  
        this.addressAddModel = this.lf.group({     
            phoneno : ['',[Validators.required,Validators.pattern(patternq)]], 
            landline  : ['',[Validators.pattern(patternq)]], 
            address :  ['',Validators.required], 
            landmark : [''], 
            city: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]], 
            zipcode : ['',Validators.required],
            country: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],    
        });

        var accardpattern = /^[0-9-]{19}$/;
        var accardem = /^[0-9]{2}$/;
        var accardey = /^[0-9]{2}$/;
        var accardcvc = /^[0-9]{3}$/;


        this.customerCard = this.lf.group({     
           /* email : ['',Validators.required],*/ 
            cardnumber :['',[Validators.required,Validators.pattern(accardpattern)]], 
            expirymonth : ['',[Validators.required,Validators.pattern(accardem)]],              
            expiryyear : ['',[Validators.required,Validators.pattern(accardey)]],   
            cvc : ['',[Validators.required,Validators.pattern(accardcvc)]], 
            clicked : ['',Validators.required] 
        });
        this.customerCard.controls['clicked'].setValue(true);
        /* 
        if(localStorage.getItem('currentCustomer')){
        this.cid = JSON.parse(localStorage.getItem('currentCustomer'))._id;
        }*/

        if(localStorage.getItem('cartinfo')){
            var cartinfoq = JSON.parse(localStorage.getItem('cartinfo'));   
            if(cartinfoq.candidateid != ""){
                cartinfoq.customerid = this.cid;
                localStorage.setItem('cartinfo', JSON.stringify(cartinfoq));
            }  
        this.checkoutsummary = JSON.parse(localStorage.getItem('cartinfo'));
        this.getDeliveryCharges();
        }

        //this.checkoutsummary["note"] = "";
        // console.log("checkoutsummary", this.checkoutsummary);

        

        //console.log("checkoutsummary", this.checkoutsummary);
        this.getCustomer();

        this.addressAddModel.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
        this.checkoutsummary["ordertiming"] = {"type" : 'f'};

        this.customerCard.valueChanges
        .subscribe(data => this.cardonValueChanged(data));
        this.cardonValueChanged(); // (re)set validation messages now
        this.getKitchenDetail();
       }

       public initcheckoutSummary(){

             this.kitchenService.getOne(this.checkoutsummary.restaurantid).subscribe((data) => {   

            if(data.message){
            var data1 = data.message;

            this.checkoutsummary.subtotal = this.checkoutsummary.total;
            var totalam = this.checkoutsummary.subtotal + parseFloat(this.checkoutsummary.deliveryCharges);
            var taxcalc = 0;
            if(data1 && data1.tax && data1.tax.value){
            taxcalc = ((totalam) / 100) * data1.tax.value;
            }
            console.log(totalam , taxcalc);
            this.checkoutsummary["subtax"] = taxcalc;
            this.finalTotalAmountabc = (totalam + taxcalc).toFixed(2);
            this.checkoutsummary.total = (totalam + taxcalc).toFixed(2);
            if(data1 && data1.tax && data1.tax.value){
            this.checkoutsummary.tax = data1.tax.value;       
            }else{
            this.checkoutsummary.tax  = 0;
            }   
            this.finalTotalAmount = this.checkoutsummary.total;
            } 
            this.initRest('now'); 
           });  

          }


       public getDeliveryCharges(){

            this.deliveryChargesService.getDeliveryCharges().subscribe((data) => {

            if(data.message.length > 0){

            var datacharge = data.message[0];
            var mealdeliveryCharges = 0;
            this.deliveryCharges = datacharge.itemcharge;
             this.checkoutsummary.package.map((item, index) => {
                   console.log("item, index", item, index);
                   var totalarray = item.dayandmenus.map((item1 , index1) => {
                     return item1.menuids.length > 0 ? datacharge.mealpackagecharge : 0;  
                   });
                   var sum = totalarray.reduce((a, b) => a + b, 0);
                   mealdeliveryCharges += sum;
                  });
                 }  

                if(mealdeliveryCharges > datacharge.itemcharge){
                this.deliveryCharges = mealdeliveryCharges;
                }else if((mealdeliveryCharges < datacharge.itemcharge) || (mealdeliveryCharges == datacharge.itemcharge)){
                this.deliveryCharges = datacharge.itemcharge;
                }
                this.checkoutsummary["deliveryCharges"] = parseFloat(this.deliveryCharges);
               setTimeout(()=>{
               this.initcheckoutSummary();
               }, 500);
               });


            }

     public removeCard(index){
         if(this.cards[index]["selected"]){
            this.cards[index]["selected"] = false; 
            this.cardSelected = -1;
            this.cvc = '';
         }
        this.cards.splice(index, 1);
        if(this.cards.length == 0){
           this.cvc = '';
           this.cardSelected = -1;
        }
        this.addNewCard();   
        }

       public onKeyCardNumber(event){           
            // console.log(event);
            var foo = this.customerCard.value.cardnumber.split("-").join("");
            if (foo.length > 0) {
            foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
            }
            this.customerCard.controls["cardnumber"].setValue(foo);
            }


    public addNewAddress(){
        this.addressAddModel.reset();
        this.userinfo.lat = "";
        this.userinfo.lng = "";
        setTimeout(() => {
            this.initMap();
            }, 1500);
        }


    public modelClose(){
        $('#addAddressModel').modal('hide');  
    }


    public initMap(){    
        if(navigator.geolocation){            
            navigator.geolocation.getCurrentPosition((position) => {
                toastr.success("Auto Address has been fill!");
                this.userinfo.lat = position.coords.latitude;
                this.userinfo.lng = position.coords.longitude;
                this.mapRun();        
            },
            (error) => { 
                toastr.error("Here is an issue to detect an auto fill address!");
                this.elseMapRun();

            });
        } else {
            toastr.error("Geolocation is not supported by this browser.");
            this.elseMapRun();
        }
    }


   public elseMapRun(){
            console.log("elseMapRun");
            var input = (<HTMLInputElement>document.getElementById('pac-input'));
            var options = {types: []};
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', () => {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.address_components) {
                    let city,country,lat,lng;
                    console.log(place.address_components);
                    
                        this.addresspart = [];
                        for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];
                        if (this.componentForm[addressType]) {
                        var val = place.address_components[i][this.componentForm[addressType]]; 
                        if(addressType == 'locality'){
                        this.addressAddModel.controls["city"].setValue(val);
                        }
                        if(addressType == 'postal_code'){
                        this.addressAddModel.controls["zipcode"].setValue(val);
                        }
                        if(addressType == 'country'){
                        this.addressAddModel.controls["country"].setValue(val);
                        } 
                        this.addressAddModel.controls["address"].setValue(input.value);                                    
                        }
                        } 


                    this.userinfo.lat = place.geometry.location.lat();
                    this.userinfo.lng = place.geometry.location.lng();
                    this.mapRun();
                  }
                  });

           }



    public mapRun(){
        var input = (<HTMLInputElement>document.getElementById('pac-input'));
        var map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: parseFloat(this.userinfo.lat), lng: parseFloat(this.userinfo.lng)},
            zoom: 15
        });
        var autocomplete = new google.maps.places.Autocomplete(input, {types: []});
        autocomplete.bindTo('bounds', map);
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29),
            position: {lat: parseFloat(this.userinfo.lat), lng: parseFloat(this.userinfo.lng)},
            visible: true,
            draggable: true
        });
        google.maps.event.addListenerOnce(map, 'idle', () => {
            var loadlat = marker.position.lat();
            var loadlng = marker.position.lng();
            console.log("loadlat, loadlng", loadlat, loadlng);
            this.getgeo(loadlat, loadlng);
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
                window.alert("No details available for input: '" + place.name + "'");
                return;
            } 
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);  
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                this.addresspart = [];
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        var val = place.address_components[i][this.componentForm[addressType]]; 
                        if(addressType == 'locality'){
                            this.addressAddModel.controls["city"].setValue(val);
                        }
                        if(addressType == 'postal_code'){
                            this.addressAddModel.controls["zipcode"].setValue(val);
                        }
                        if(addressType == 'country'){
                            this.addressAddModel.controls["country"].setValue(val);
                        } 
                        this.addressAddModel.controls["address"].setValue(input.value);                                    
                    }
                } 
            }
        });
    }



    public getgeo(lat, long){
        var geocoder = new google.maps.Geocoder();
                        var latlng = new google.maps.LatLng(lat, long);
                        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
                                if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                    var addresss =results[1].formatted_address; 
                    for (var i = 0; i < results[1].address_components.length; i++) {
                        var addressType = results[1].address_components[i].types[0];

                        if (this.componentForm[addressType]) {
                            var val = results[1].address_components[i][this.componentForm[addressType]]; 
                            if(addressType == 'locality'){
                                this.addressAddModel.controls["city"].setValue(val);
                            }
                            if(addressType == 'postal_code'){
                                this.addressAddModel.controls["zipcode"].setValue(val);
                            }
                            if(addressType == 'country'){
                                this.addressAddModel.controls["country"].setValue(val);
                            }            
                            this.addressAddModel.controls["address"].setValue(addresss);
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


    onValueChanged(data?: any) {
        if (!this.addressAddModel) {return;  }
        const form = this.addressAddModel;
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
        'city': '',
        'country' : '',
        'phoneno': '',
        'landline': ''
    };

    validationMessages = {
        'city': {
            'required':      'Username is required.',      
            'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
        },
        'country': {
            'required':      'Username is required.',      
            'pattern'   :    'Username cannot use Numberic, Special characters, Space Etc. '
        },
        'phoneno': {
            "required" : "Required only numberic!",
            'pattern'  : 'Required only numberic!'
        },
        'landline': {
            'pattern'  : 'Required only numberic!'
        } 
    };


    cardonValueChanged(data?: any){
    if (!this.customerCard) {return;  }
    const form = this.customerCard;

    for (const field in this.cardformErrors) {
        // clear previous error message (if any)
        this.cardformErrors[field] = '';
        const control = form.get(field);      
        if (control && control.dirty && !control.valid) {
            const messages = this.cardvalidationMessages[field];
            for (const key in control.errors) {
                this.cardformErrors[field] += messages[key] + ' ';          
            }
        }
    }
    }

    cardformErrors = {
        'cardnumber': '',
        'expirymonth' : '',
        'expiryyear': '',
        'cvc': ''
        };


    cardvalidationMessages = {
        'cardnumber': {
            'required':      'Required.',      
            'pattern'   :    'It should numberic and 16 digit.'
        },
        'expirymonth': {
            'required':      'Required.',      
            'pattern'   :    'It should numberic and 2 digit.'
        },
        'expiryyear': {
            "required" : "Required.",
            'pattern'  : 'It should numberic and 2 digit.'
        },
        'cvc': {
            'pattern'  : 'Required.',
            "required" : "It should numberic and 3 digit.",
        } 
    };

    selectCard(indexs){
        if(this.cards.length > 0) {
            this.cards.forEach((item, index) => {
            this.cards[index]['selected'] =  false;
            });
            this.cards[indexs]['selected'] =  true;
            this.cardSelected = indexs;
        }  
    }

   
 public chlickednewCardAdd(){
     console.log();
        this.customerCard.controls["clicked"].setValue(true);
       // $(".modal-body").trigger('click');
    }


    addCard(){
        console.log("meetig", this.customerCard.value)
         
         console.log(this.customerCard.value)
         
         var abc = this.customerCard.value.cardnumber.split("-").join("");
        this.customerCard.value.cardnumber = abc; 
        var checkcardindex =  this.cards.findIndex((item) => {
             console.log("hhio", item.cardnumber , this.customerCard.value.cardnumber);
             return item.cardnumber == this.customerCard.value.cardnumber 
             && item.expirymonth == this.customerCard.value.expirymonth
             && item.expiryyear == this.customerCard.value.expiryyear
             });


         if(checkcardindex > -1){
           toastr.remove();
           toastr.error("This card is already exist."); 
         }else{
         this.customerCard.controls["clicked"].setValue("");
       // console.log("this.customerCard.value", this.customerCard.value);
        (<any>window).Stripe.card.createToken({
        number: this.customerCard.value.cardnumber,
        exp_month: this.customerCard.value.expirymonth,
        exp_year: this.customerCard.value.expiryyear,
        cvc: this.customerCard.value.cvc
        }, (status, response) => {
        if (status === 200) {
       // console.log("success"); 
        this.customerCard.value["cardtype"] = response.card.brand.toLowerCase();
        var abc = this.customerCard.value.cardnumber.split("-").join("");
        this.customerCard.value.cardnumber = abc;
        if(this.cards.length == 0){this.customerCard.value.default = true;}
        this.cards.push(this.customerCard.value);
        this.addNewCard();
        } else {  
        toastr.remove();
        toastr.error(response.error.message);
        this.chlickednewCardAdd(); 
        }
        });

        }
        }



   
   public toggleAddcard(){
   if(this.showForm){
       this.showForm = false;
   }else{
       this.showForm = true;
   }
   }

   


    addNewCard(){
        // console.log("this.cards", this.cards);
        var obj = {"_id": this.cid, "cardinfo" : this.cards};
        this.frontendService.updateFrontend(obj).subscribe(data => {
            //console.log("update adress", data);
            this.customerCard.reset();
            this.chlickednewCardAdd();
            $('.refresh2').trigger('click');
            if(this.cards.length > 0){
            
            var defaultindex = this.cards.findIndex((item) => {
            return item.default == true;
            });

            setTimeout(() => {
            $("div.panel-theme:eq('"+defaultindex+"')").click();
            }, 200);

            }
        });
       }

    
   getKitchenDetail()
   {
   this.kitchenService.getOne(this.checkoutsummary.restaurantid).subscribe(dataa => {
    console.log("dataa",dataa);
    this.newrestaurantsdetail = dataa.message;
   });

   } 
   setordertime(param){

    if(param == 'now'){
    this.checkedd = true;    
    this.ordertiming = false;  
    this.checkoutsummary["ordertiming"] = {};  

    this.kitchenService.getOne(this.checkoutsummary.restaurantid).subscribe(dataa => {
            this.restaurantsdetail = dataa.message; 
            var da = new Date();
            var vctime = da.getHours()+":"+da.getMinutes();
            var dayindex = da.getDay() -1 ;
            if(dayindex > -1){
            var da = new Date();
            vctime = da.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            var ocdateindex:any = -1;
            if(this.restaurantsdetail.openinghours.length > 0){
                ocdateindex = this.restaurantsdetail.openinghours[dayindex].times.findIndex((items) =>{
                return (Date.parse('01/01/2011 '+items.open) <= Date.parse('01/01/2011 '+vctime) && Date.parse('01/01/2011 '+items.close) >= Date.parse('01/01/2011 '+vctime)) || (items.open == "" && items.close == "");
                });
            }
          
            if((ocdateindex > -1) || (this.restaurantsdetail.openinghours.length == 0)){
            this.todayOpend = true;
            if(param == 'now'){
                this.checkedd = true;
                this.ordertiming = false;
                var date1 = new Date();
                this.checkoutsummary["ordertiming"] = {"type" : 'now', "datetime" : moment(date1).format('YYYY-MM-DD HH:mm')};
                   }else{
                   this.checkoutsummary["ordertiming"] = {};
                   this.ordertiming = true;
                   this.datePickerEnable();
                  }
            }else{
                this.todayOpend = false; 
                toastr.clear();
                toastr.error('Restaurent Close.');
            }
           }else{
                this.todayOpend = false; 
                toastr.clear();
                toastr.error('Restaurent Close.');
        }
    });
    }else{
        this.todayOpend = false;
        this.checkoutsummary["ordertiming"] = {type:"later", datetime: ""};
        this.ordertiming = true;
        this.datePickerEnable(); 
        }
     }


    public initRest(param){
        
        this.kitchenService.getOne(this.checkoutsummary.restaurantid).subscribe(dataa => {   
            var data1 = dataa.message;
            var da = new Date();
            var vctime = da.getHours()+":"+da.getMinutes();
            var dayss = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
            var day = dayss[da.getDay()];
            if(data1.openinghours.length > 0){
            var dayindex = data1.openinghours.findIndex((days) => {
            return days.name == day && days.status == false
            });
            if(dayindex > -1){
            var da = new Date();
            vctime = da.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); 
            var ocdateindex = -1;
            if(data1.openinghours.length > 0){
                ocdateindex = data1.openinghours[dayindex].times.findIndex((items) =>{
                return (Date.parse('01/01/2011 '+items.open) <= Date.parse('01/01/2011 '+vctime) && Date.parse('01/01/2011 '+items.close) >= Date.parse('01/01/2011 '+vctime)) || (items.open == "" && items.close == "");
                });
            }
            if((ocdateindex > -1) || (data1.openinghours.length == 0)){
              this.todayOpendd = true;
              if(param == 'now'){
                this.checkedd = true;
                this.ordertiming = false;
                var date1 = new Date();
                this.checkoutsummary["ordertiming"] = {"type" : 'now', "datetime" : moment(date1).format('YYYY-MM-DD HH:mm')};
                }
                }else{
                this.todayOpendd = false;
                }
                }else{
                this.todayOpendd = false;
                }
                }else{
                this.todayOpendd = true;
                if(param == 'now'){
                this.checkedd = true;
                this.ordertiming = false;
                var date1 = new Date();
                this.checkoutsummary["ordertiming"] = {"type" : 'now', "datetime" : moment(date1).format('YYYY-MM-DD HH:mm')};
                }
                }   
                });
    }



    public datePickerEnable(){
        this.getKitchenDetail();
        setTimeout(()=> {
            var mind = new Date();
            var afterday = mind.setDate(mind.getDate() + this.newrestaurantsdetail.preorderforlaterafterdays);
            var countday = this.newrestaurantsdetail.preorderforlaterafterdays + (this.newrestaurantsdetail.preorderforlatertodays -1);
            var todayDate = new Date().getDate();
            $('#date1').datetimepicker({format:'YYYY-MM-DD HH:mm', minDate: afterday, maxDate: new Date(new Date().setDate(todayDate + countday))});
            $('#date1').val('');
        }, 200);
    }

    public getTimeData(even){        
        var timeJ = even.getAttribute('id');
        let eleObj = (<HTMLInputElement>document.getElementById(timeJ));
        this.checkoutsummary["ordertiming"] = {"type" : 'later', "datetime" : eleObj.value};
        if(eleObj.value == ""){
           this.checkoutsummary.ordertiming.datetime = "";
        }
        console.log("fgf", this.checkoutsummary.ordertiming.datetime)
        }


    getCustomer(){
        this.setCards();  
        this.setAddress();
        
    }

    setCards(){
        this.frontendService.getOneCust(this.cid).subscribe(data => {
            this.cards = [];
            if(data.message && data.message.cardinfo && data.message.cardinfo != null){
            var cardinfo = data.message.cardinfo;
            if(cardinfo && cardinfo.length > 0){
                cardinfo.forEach((item, index) => {
                    cardinfo[index]['selected'] = false;
                });
                //cardinfo[0]['selected'] =  true;
                this.cards = cardinfo;
            }   
            }  

        });
    }

    setAddress(){        
        this.deliveryAddress = [];  
        this.selectedaddress.status = false;      
        this.frontendService.getOneCust(this.cid).subscribe(data => {
            this.deliveryAddress = [];
            if(data.message && data.message.customeraddresses && data.message.customeraddresses != null && data.message.customeraddresses.length > 0){
            
            for(var i= 0; i < data.message.customeraddresses.length; i++){
                if(data.message.customeraddresses[i].default){
                    data.message.customeraddresses[i].checked = true;
                }else{
                    data.message.customeraddresses[i].checked = false;
                }
                this.deliveryAddress.push(data.message.customeraddresses[i]);
                if(data.message.customeraddresses[i].default){
                    this.selectedaddr(i);
                }
            } 

            if(data.message.customeraddresses.length == 1){
              this.selectedaddr(0); 
            }

          }
        });

    }


    selectedaddr(index){
       // console.log(index, "hiindex");
        this.selectedaddress.status = true;
        for(var i= 0; i < this.deliveryAddress.length; i++){          
            if(index == i){
                this.deliveryAddress[i].checked = true;
                this.selectedaddress.address = this.deliveryAddress[i];
            }else{
                this.deliveryAddress[i].checked = false;
            }
        } 
        this.deliveryAddress = this.deliveryAddress;
    }  

    updateAddress(){ 
       // console.log("this.deliveryAddress", this.deliveryAddress);
        this.frontendService.updateCustAddress(this.cid, this.addressAddModel.value).subscribe(data => {
            //console.log(data);
            if(data.error){
                toastr.remove();
                toastr.error(data.message);
            }else{
                toastr.remove();
                toastr.success('Added Successfully');
                this.deliveryAddress = data.message.customeraddresses; 
                this.getCustomer();
                this.refresh();
            }      
        });
    }


    refresh(){
        $("#myModal").modal('hide');
        $('#mymenuModal').on('hidden.bs.modal', function () {
            $(this).find('form').trigger('reset');
        });
        this.addressAddModel.reset();
    }

    paybycash(){
        this.paymentoption = 'cash'; 
        

    }
    paybycard(){
            this.paymentoption = 'card';
            var defaultindex = this.cards.findIndex((item) => {
            return item.default == true;
            });
            setTimeout(() => {
            $("div.panel-theme:eq('"+ defaultindex +"')").click();
            }, 200);


       /* if(this.cards.length > 0){
        setTimeout(() => {
        $("div.panel-theme:eq('0')").click();
        }, 100);
        }*/
    }

    applyOnOrderPrice(data){

        let ordertotal = this.checkoutsummary.subtotal + parseFloat(this.checkoutsummary.deliveryCharges);
        this.checkoutsummary.coupon = data; 
        var disnewval:any = 0;
        var typelcase = data.type.toLowerCase();
        
        if(typelcase == 'price'){ 
            disnewval = ordertotal - data.percentorpricevalue;
            this.checkoutsummary.discount = data.percentorpricevalue;
            }else{ 
            var valuedis:any = (ordertotal/100) * data.percentorpricevalue;    
            disnewval = ordertotal - valuedis;
            this.checkoutsummary.discount = parseFloat(valuedis).toFixed(2);
            }

            var totalam = disnewval;
            var taxcalc = 0;
            if(this.checkoutsummary && this.checkoutsummary.tax){
            taxcalc = ((totalam) / 100) * this.checkoutsummary.tax;
            }
            this.checkoutsummary["subtax"] = taxcalc;
             this.finalTotalAmountabc = parseFloat(totalam + +taxcalc);
             this.checkoutsummary.total = (totalam + +taxcalc);
            if(totalam <= 0){
            this.hidewithdiscount = false; 
            this.paybycash();
            }
            
    }


    applyCoupan(){
        var obj = { "couponcode": this.voucharCode, "kitchenId": this.checkoutsummary.restaurantid}; 
        //console.log(obj)
        this.offerService.redeemCoupanCode(obj).subscribe((data) => {
            if(data.error){
                toastr.error("Please enter valid coupon code!")
            }else{
                toastr.success("Coupon Applied.")
                this.applyOnOrderPrice(data.message[0]);
            }
        });
    }

    removeCoupan(){

        this.checkoutsummary.coupon = "";
        this.voucharCode = "";
        this.checkoutsummary.discount = 0;
        this.checkoutsummary = JSON.parse(localStorage.getItem('cartinfo'));           
        this.getDeliveryCharges(); 
    }

    placeOrder(){

        //console.log(this.selectedaddress.status);
        if(this.selectedaddress.status == false){
            alert('Please select address');
        }else{
            this.checkoutsummary.fulladdress = this.selectedaddress.address;   
        }

        if(this.paymentoption == 'no'){
            alert('Please select Payment type');
        }else{
            this.checkoutsummary.paymenttype = this.paymentoption;
            
        }

        if(this.selectedaddress.status == true && this.paymentoption != 'no'){
            //console.log(this.checkoutsummary);
                  if(this.checkoutsummary.paymenttype == 'card'){
                     this.loader_run = true;
                    this.testBeforePaymentCard();                   
                   } else{
                     this.loader_run = true;  
                    this.makeOrderTo();
                   }           
        }
    }

    carderror:any = "";
    testBeforePaymentCard(){
       // console.log("looc", typeof this.cvc != 'undefined' && this.cvc != '');
        // console.log("fhdjg", this.cardSelected);
        if((typeof this.cardSelected != 'undefined') && (this.cardSelected > -1)){        
        if(typeof this.cvc != 'undefined' && this.cvc != ''){
        this.carderror = "";
       // console.log("this.cvc", this.cards[this.cardSelected], this.cvc);
        (<any>window).Stripe.card.createToken({
        number: this.cards[this.cardSelected].cardnumber,
        exp_month: this.cards[this.cardSelected].expirymonth,
        exp_year: this.cards[this.cardSelected].expiryyear,
        cvc: this.cvc
        },(status, response) => {
        if (status === 200) {
        this.stripeResponseHandler(status, response);
        }else{ 
       // console.log("errr dee", response);    
        //this.carderror = response.error.message;
        this.loader_run = false;
        toastr.clear();
        toastr.error(response.error.message);
        }        
        });
        }else{
        this.loader_run = false;    
        toastr.clear();
        toastr.error("Please fill cvc in card!");
        }
        }else{
        this.loader_run = false;    
        toastr.clear();
        toastr.error("Please select card!");

        }
    }


    public stripeResponseHandler(status, response) {
    console.log("resss", status, response);
    var obj = {"id": response.card.id, "amount": Math.round(parseFloat(this.checkoutsummary.total)), "token": response.id, "currency": this.newrestaurantsdetail.currency}
    this.orderService.cardPayment(obj).subscribe((data) => {        
        this.successOrder(data);
        });
    };


   public successOrder(successData){
            console.log("successData", successData);            
            this.checkoutsummary["cardPaidStatus"] = successData;
            this.makeOrderTo();
           /* this.orderService.add(this.checkoutsummary).subscribe(response => {
            localStorage.removeItem('cartinfo'); 
            var obj2 = {"customeremail": this.currentCustomerDetail.email, "orderid": response.message._id, "restaurantid" : response.message.restaurantid}; 
            this.kitchenService.orderMail(obj2).subscribe(res => {
            //console.log(res);
            });   
            this.route.navigate(['/customer/thankyou']);
            });*/
    }


   public makeOrderTo(){
        this.checkoutsummary["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.checkoutsummary["created_at"] = new Date();

        console.log("this.checkoutsummary[", this.checkoutsummary)
        this.checkoutsummary.total = ((this.checkoutsummary.total < 0) ? 0 : this.checkoutsummary.total);
        this.orderService.add(this.checkoutsummary).subscribe(response => {
            this.loader_run = false;    
            localStorage.removeItem('cartinfo'); 
            
            console.log("this.checkoutsummary", response.message);

            this.afd.list(this.orderEntry).push({
                orderID: response.message['_id'],
                orderStatus: response.message['status'],
                restaurantid: response.message['restaurantid'],
                customerid: response.message['customerid'],
                type: 'item'
            }).then(() => {
                console.log('Order Pushed');
                /*alert('Order Pushed');*/
            })


            var obj2 = {"customeremail": this.currentCustomerDetail.email, "order": response.message, "restaurantid" : response.message.restaurantid}; 
            localStorage.setItem('orderId', JSON.stringify({"orderId": response.message._id}));
            this.kitchenService.orderMail(obj2).subscribe(res => {});     
            setTimeout(()=>{
                var makethis = this;
                if(this.currentCustomerDetail.accounttype == 'guest'){
                   localStorage.removeItem('currentCustomer');
                   }
                this.route.navigate(['/customer/thankyou']);
                $('#collapse_1').trigger('click');
            }, 1000);
        });


    }
}

@Component({
    selector: 'app-thankyou',
    templateUrl: './frontendthankyou.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None 
})
export class FrontendThankYouComponent implements OnInit {
    orderId: any;
    constructor() {
      setTimeout(() => {
           // console.log("thnku");
            $("#collapse_1").trigger('click');
             
      }, 1200);
    }
    ngOnInit() {
            $(document).ready(function(){
            $(window).scrollTop(0);
            });
            

            if(localStorage.getItem('orderId')){
            this.orderId = JSON.parse(localStorage.getItem('orderId')); 
            console.log(this.orderId);

            }
    }
}


@Component({
    selector: 'app-customer-mailactivate',
    template: ''
})
export class CustomerDrivermailactivateComponent implements OnInit {

    did : any;
    constructor(public driverService: DriverService, public router : Router, public activatedRoute : ActivatedRoute, public frontendService : FrontendService , public ownerSer: KitchenService) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.did = params['activationid'];  
            console.log("this.drive did", this.did);
            this.mailactivate();              
        });    
       }

    public mailactivate(){
        var obj = {_id : this.did, isactivated: 1};
        console.log(obj);
        this.driverService.updateDriver(obj).subscribe((data) => {
            if (data.error) {
                toastr.remove();
                toastr.error("Something Wrong"); 
            }else{
                toastr.remove();
                toastr.success("Account Activated"); 
                this.router.navigate(['/']);
            }
        });  
    }
}



@Component({
    selector: 'app-customer-mailactivate',
    template: ''
})
export class CustomermailactivateComponent implements OnInit {

    cid : any;
    constructor(public router : Router, public activatedRoute : ActivatedRoute, public frontendService : FrontendService , public ownerSer: KitchenService) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.cid = params['activationid'];  
            this.mailactivate();              
        });    
    }

    public mailactivate(){
        var obj = {_id : this.cid, status: true};
        this.frontendService.updateFrontend(obj).subscribe((data) => {
            //console.log(data);
            if (data.error) {
                toastr.remove();
                toastr.error("Something Wrong"); 

            }else{
                localStorage.removeItem('currentCustomer');
                localStorage.removeItem('currentOwner');
                toastr.remove();
                toastr.success("Account Activated"); 
                //alert("Account Activated");
                this.router.navigate(['/']);
               }
        });  
    }
}


@Component({
    selector: 'app-frontend',
    templateUrl: './driverresetpassword.component.html',
    styleUrls: ['./frontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FrontendDriverResetPasswordComponent implements OnInit {
    
    forgetForm: FormGroup;
    did:any;
    MutchPassword:any;
    passwordp : any = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,25}$/;

    constructor(

        public lf: FormBuilder, 
        public authService: AuthService,
        public driverService: DriverService,
        public router: Router,
        public alertService: AlertService,
        public activatedRoute: ActivatedRoute){}

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.did = params['id'];
        });
        this.forgetForm = this.lf.group({
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            newpassword: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            match: ['', Validators.required]
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
        'password' : '',    
        'newpassword' : ''     
    };

    validationMessages = {
        'password' : {
            'required' : 'Password is required.',
            'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
        },
        'newpassword' : {
            'required' : 'Confirm Password is required.',
            'pattern'   :    'Confirm Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
        }            
    };


    matchpassword(){  

        if(this.forgetForm.value.password == this.forgetForm.value.newpassword){
            this.forgetForm.controls["match"].setValue(true);
            this.MutchPassword = false;
            }else{
            this.forgetForm.controls["match"].setValue("");
            this.MutchPassword = true;
        }

    }  

    updatePassword(){
        var obj = {_id : this.did, password: this.forgetForm.value.password};
        this.driverService.updateDriver(obj).subscribe(
            (data) => {
                toastr.remove();
                toastr.success('Password Changed Successfully.');
                this.forgetForm.reset();
                setTimeout(()=>{
                    this.router.navigate(['/']);
                }, 2000);
            });
    }
}