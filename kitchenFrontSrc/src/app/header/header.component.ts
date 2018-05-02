import { Component, OnInit, ViewEncapsulation,  NgZone, NgModule , Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService,AuthService, KitchenService, FrontendService, PageService,MasterService, FrontendRestaurantService, KitchenMenuService, OrderService, UsersService} from '../service/index';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
declare var google : any;
import * as globalVariable from "../global";
declare var $ : any;
declare var NProgress : any;
declare var toastr : any;
toastr.options.timeout = 50;
import { AuthService as Auths } from "angular2-social-login";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: []
})

export class HeaderComponent implements OnInit {
    currentUser: any = {};
    constructor(public authService : AuthService) { 
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {}

    public setlogout(){
        this.authService.logout();
    }
}



@Component({
    selector: 'app-headerfrontend',
    templateUrl: './headerfrontend.component.html',
    styleUrls: ['./headerfrontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderfrontendComponent implements OnInit, OnDestroy {

    @Input() incomingData: any;
    @Output() outgoingData = new EventEmitter();

    currentCustomer: any = {};
    countryname : any;
    countrylist : any = [];
    citycousinelist :any = []; 
    orderItem : any = [];
    cururl : any;
    restaurantsdetail :any = [];
    menus : any = [];
    loginForm: FormGroup;
    forgetForm: FormGroup;
    returnUrl: string;
    returnUrlr: string;
    err: any;   
    passwordp : any = '';  
    alertType: any = '';   
    loginFormr: FormGroup;    
    guestloginForm: FormGroup;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    show1 : any = false;
    show2 : any = false;
    show3 : any = false;
    MutchPassword : any;
    newo : any = false;
    showformc : any = 'login';
    process: any = false;
    keeplogin : any = {username: "", password : "", checkbox : false};
    checkoutLogin: any = false;

    public user;
      sub: any;

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
            'required':      'Password is required',
            'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
        }            
    };


    constructor(
        public frontendService : FrontendService,
        public masterService : MasterService, 
        public router : Router , 
        public activatedRoute :ActivatedRoute , 
        public frontendRestaurantService : FrontendRestaurantService,
        public kitchenMenuService: KitchenMenuService,
        public orderService : OrderService,
        public lf: FormBuilder, 
        public authService: AuthService,
        public alertService: AlertService,
        public route: ActivatedRoute,
        public usersService : UsersService,
        public _auth: Auths ) { 
        this.currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));      
        this.cururl = this.router.url; 
        }

    ngOnInit() {

        this.guestloginForm = this.lf.group({
            email: ['', [Validators.required, Validators.pattern(this.emailp)]],
            });
        
        this.guestloginForm.valueChanges
        .subscribe(data => this.onValueChangedg(data));
        this.onValueChangedg(); // (re)set validation messages now 


        this.incomingData = {"customerid" : "", "total": 0, "restaurantid": "", "name": "","items" : [], "combo": [], "package": []}; 
        if(localStorage.getItem('cartinfo')){
            if(JSON.parse(localStorage.getItem('cartinfo')).items.length > 0 || JSON.parse(localStorage.getItem('cartinfo')).combo.length > 0 || JSON.parse(localStorage.getItem('cartinfo')).package.length > 0){
                this.incomingData = JSON.parse(localStorage.getItem('cartinfo')); 
                console.log("this.incomingData", this.incomingData); 
            }               
        }else{
            this.incomingData = {"customerid" : "", "total": 0, "restaurantid": "", "name": "","items" : [],"combo": [], "package": []}; 
        }
        if(!localStorage.getItem('currentCountry')){
            if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                        console.log("cordinate success");    
                        this.getgeo(position.coords.latitude, position.coords.longitude);      
                        }, (err) => {
                         console.log("cordinate errors", err);
                        this.setonheader();
                        });
            }
        }else{
        this.setonheader();
        }
        this.getAllcccList();

        this.getMenus();
        this.restaurantsDetail(); 
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/customer';
        this.loginForm = this.lf.group({
            username: ['', [Validators.required, Validators.pattern(this.emailp)]],
            password: ['', Validators.required],
        });

        this.loginForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now 



        this.usersService.getComplexity().subscribe(data=>{ 

            this.passwordp = data.message[0].customerpasscomplexity.regex;
            this.setpasswordmessage(data.message[0].customerpasscomplexity.name);
            this.newo = true;

            this.loginFormr = this.lf.group({
                firstname : ['',Validators.required],
                lastname : ['',Validators.required],
                username: [''],
                password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
                newpassword: ['', Validators.required],
                matchpass: ['', Validators.required],
                email: ['', [Validators.required, Validators.pattern(this.emailp)]],
            });

            this.loginFormr.valueChanges
            .subscribe(data => this.onValueChangedr(data));
            this.onValueChangedr(); // (re)set validation messages now
            toastr.clear();

        });

        this.forgetForm = this.lf.group({
            email: ['', [Validators.required, Validators.pattern(this.emailp)]]
        });

        this.forgetForm.valueChanges
        .subscribe(data => this.onValueChangedf(data));
        this.onValueChangedf(); // (re)set validation messages now
        toastr.clear();

        $('#loginModel').on('show.bs.modal', function() {
        setTimeout(() => {
        $('.modal-backdrop').css('background', 'rgba(102, 0, 153, 0)');
        $('.modal.fade:not(.in) .modal-dialog').css('-webkit-transform', 'translate3d(0%, 1%, 0)');
        $('.modal.fade:not(.in) .modal-dialog').css('transform', 'translate3d(0%, 1%, 0)');
        }, 10);
        });
        

        if(localStorage.getItem("keeplogin")){
         this.keeplogin = JSON.parse(localStorage.getItem("keeplogin"));
         this.loginForm.patchValue(this.keeplogin);
        }
        //localStorage.setItem("keeplogin", JSON.stringify(this.keeplogin));
        console.log( "incomingData", this.incomingData );

            $('body').on("click", ".someyourContainer", function (e) {
            $(this).parent().is(".open") && e.stopPropagation();
            });

            $('body').on("click", ".someyourContainer2", function (e) {
            $(this).parent().is(".open") && e.stopPropagation();
            });

            $(document).on("click", ".inputgroupy", function (e) {
            $(".someyourContainer").parent().is(".open") && e.stopPropagation();
            });

             $(document).on("click", ".removecontainer", function (e) {
            $(".someyourContainer").parent().is(".open") && e.stopPropagation();
            });


    }

    ngOnDestroy(){

    }

  public onValueChanged(data?: any) {
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


public resetform(){
    this.loginForm.reset();
}


public loginCheckout(){
    this.checkoutLogin = true;
    this.login();
}

private guestlogin(){
    var obj = {"accounttype": 'guest', "username": this.guestloginForm.value.email, "email" : this.guestloginForm.value.email, "password": "mealdaay123", "status": true};
    this.frontendService.addCustomer(obj).subscribe((data) => {
         console.log("data", data);
         if(data.error){
         toastr.remove();
         toastr.error('You are already exist. Please login with Credentials.');
         }else{
           this.authService.getFrontend(obj).subscribe(
            (data) => {   
            if (!data.error) { 
                console.log("guest@", data.data);
                localStorage.setItem('currentCustomer', JSON.stringify(data.data));   
                $("#checkout-signin-model").modal('hide');  
                this.checkoutLogin= false;  
                setTimeout(() => {
                  this.router.navigate(['/customer/checkout']);
                }, 1200);
            }else{
                toastr.remove();
                toastr.error('Something Error. try another email');   
            }
          });
         }
    });
    }


    public signIn(provider){

        this.sub = this._auth.login(provider).subscribe(
        (data) => {
        //console.log(data);
        this.user=data;
        return data;
        }
        )
    }


     public orderChanges($event){
        this.outgoingData.emit($event);
        this.incomingData = $event.orderDetail;

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
        if(this.loginFormr.value.password == this.loginFormr.value.newpassword){
            this.loginFormr.controls["matchpass"].setValue(true);
            this.MutchPassword = false;
        }else{
            this.loginFormr.controls["matchpass"].setValue("");
            this.MutchPassword = true;
        }
    }


    onValueChangedr(data?: any) {
        if (!this.loginFormr) {return;  }
        const form = this.loginFormr;

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

    public setlogout(){
        
        if(localStorage.getItem('currentCountry')){
            localStorage.removeItem('currentCountry');
        }  

        this.currentCustomer = {};
        this.currentCustomer = false;
        this.authService.customerlogout();
        this.router.navigate(['/']);
    }

    public setlogin(data){
        this.currentCustomer = data;
    }


    forgetPass(){
        this.process = true;
        NProgress.start();   
        this.authService.forgetPasswordFrontend(this.forgetForm.value).subscribe(
            (data) => { 
                console.log(data);
            // alert("mail send");       
                if (data.error) {                  
                    NProgress.done();
                    toastr.remove();
                    toastr.error('You are entered wrong email!');
                    this.process = false;
                }else{                 
                    NProgress.done(); 
                    this.process = false;
                    this.forgetForm.reset();
                    this.showform('forgetsuccess');   
                    toastr.remove();
                    toastr.success('Check your email to reset password!');                    
                }
            });
    }

    onValueChangedf(data?: any) {
        if (!this.forgetForm) {return;  }
        const form = this.forgetForm;
        for (const field in this.formErrorsf) {
            // clear previous error message (if any)
            this.formErrorsf[field] = '';
            const control = form.get(field);      
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessagesf[field];
                for (const key in control.errors) {
                    this.formErrorsf[field] += messages[key] + ' ';          
                }
            }
        }
    }






    formErrors = {    
        'username' : ''        
    };

    validationMessages = {   
        'username' : {
            'required':      'Email is required.',
            'pattern'   :    'Email not in well format.'
        }      
    };


    formErrorsf = {    
        'email' : ''        
    };

    validationMessagesf = {   
        'email' : {
            'required':      'Email is required.',
            'pattern'   :    'Email not in well format.'
        }      
    };



        onValueChangedg(data?: any) {
        if (!this.guestloginForm) {return;  }
        const form = this.guestloginForm;
        for (const field in this.formErrorsg) {
            // clear previous error message (if any)
            this.formErrorsg[field] = '';
            const control = form.get(field);      
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessagesg[field];
                for (const key in control.errors) {
                    this.formErrorsg[field] += messages[key] + ' ';          
                }
            }
        }
    }




formErrorsg = {    
        'email' : ''        
    };

    validationMessagesg = {   
        'email' : {
            'required':      'Email is required.',
            'pattern'   :    'Email not in well format.'
        }      
    };



    public showform(type){
        this.addidClass();
       this.showformc = type; 
    }

    public addidClass(){
        var el = document.querySelector(`#ddrop`); 
        var getvalue = this.hasidClass(el, 'open');
        if(getvalue == true){
            setTimeout(()=> {
                document.querySelector(`#ddrop`).classList.add("open");
            },100);
        }
       }

    public hasidClass(el, cn){
        var classes = el.classList;
        for(var j = 0; j < classes.length; j++){
            if(classes[j] == cn){
                return true;
            }
        }
    }


    hideform(){
        //document.querySelectorAll(`#ddrop`).classList.remove("open");
        this.show1 = false;
      

    }


restlogin(type){
//    this.showform = type;

}

    public login(){


        // console.log("this.loginForm.value", this.loginForm.value);

        this.loginForm.value["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.alertType = '';
        NProgress.start();        
        this.authService.getFrontend(this.loginForm.value).subscribe(
            (data) => {
                console.log("this.loginForm.value2", data);
                if (!data.error) {

                    localStorage.setItem('currentCustomer', JSON.stringify(data.data));
                    this.alertType = 'success';                    
                    this.loginForm.reset();
                    setTimeout(() => {
                    
                    $('#loginModel').modal('hide'); 

                    

                    NProgress.done();   
                    this.alertType = '';
                    toastr.remove();
                    //toastr.success('Login successfully');
                    this.setlogin(data.data);
                    
                    if(this.keeplogin.checkbox){

                    //this.keeplogin.username = data.data.username;
                    //this.keeplogin.password = data.data.password;

                    this.loginForm.reset();
                    localStorage.setItem("keeplogin", JSON.stringify(this.keeplogin));
                    }

                    if(!this.keeplogin.checkbox){
                    if(localStorage.getItem("keeplogin")){localStorage.removeItem("keeplogin")}
                    }

                    }, 2000);
                    //this.alertService.success('Login successful', true);
                    //this.router.navigate([this.returnUrl]);
                    if(this.checkoutLogin){
                      
                      $("#checkout-signin-model").modal('hide');  
                      this.checkoutLogin= false;  
                      setTimeout(() => {
                            this.router.navigate(['/customer/checkout']);
                      }, 1200);
                      
                    }
                   }else{
                    this.alertType = 'error';
                    setTimeout(() => {
                        NProgress.done();              
                        //this.alertType = '';
                        toastr.remove();
                        toastr.error(data.data);
                        //this.invaliduserpass(); 
                    }, 800);
                    //this._flashMessagesService.show('Bad Credential', { cssClass: 'alert-danger', timeout: 10000 });
                    //this.router.navigate(['/customer/login']);
                }
            },
            (err)=>{
                this.alertType = 'error';
                setTimeout(() => {
                    NProgress.done();
                    toastr.remove();
                    //this.alertType = '';
                    toastr.error("Some error here!");
                    //this.invaliduserpass();  
                }, 800);
                //this._flashMessagesService.show('Bad Credential', { cssClass: 'alert-danger', timeout: 10000 });
            });

    }
    


    invaliduserpass(){       
        this.loginForm.controls["password"].setValue("");
    }


    register(){
        this.loginFormr.controls["username"].setValue(this.loginFormr.value.email);
        NProgress.start();
        this.frontendService.addCustomer(this.loginFormr.value).subscribe(
            (data) => {
                if (data.error) {
                    NProgress.done();
                    toastr.remove();
                    toastr.info('This email or already exist!'); 
                    this.loginFormr.controls["email"].setValue("");
                    this.loginFormr.controls["username"].setValue("");
                }else{
                    NProgress.done();
                    toastr.remove();
                    toastr.success('Verification link has been sent to your email address, please verify your account.');
                    this.show1 = true;
                    this.show2 = false;
                    this.show3 = false;
                    this.loginFormr.reset();
                }
            },
            (err)=>{
                NProgress.done();
                toastr.remove();
                toastr.error('Something Went Wrong');
            });
    }



    restaurantsDetail(){
        this.frontendRestaurantService.getAllRestro().subscribe(data => {         
            this.restaurantsdetail = data.message;         
        });
    }

    getMenus(){
        this.kitchenMenuService.getAll().subscribe(data => { 
            this.menus = data.message;      
        });        
    }


    sendData(data){
        setTimeout(() => {
            if(localStorage.getItem('currentCountry')){
                var id = JSON.parse(localStorage.getItem('currentCountry')).countryid;   
                var objy = {countryid : id};
                this.masterService.getcitylist(objy).subscribe(ccresponse => {       
                    this.masterService.getAllCuisines().subscribe(cresponse => {
                        this.citycousinelist = {"city" : ccresponse.message, "cousine":  cresponse.message, "country" : JSON.parse(localStorage.getItem('currentCountry')).country};
                        
                        //console.log("new if", this.citycousinelist);

                        this.outgoingData.emit(this.citycousinelist);      
                    });           
                });
            }
        }, 10);
    }

    public getcousines(){    

    }

    public getgeo(lat, long){   

        var geocoder = new google.maps.Geocoder();
                   var latlng = new google.maps.LatLng(lat, long);
                   geocoder.geocode({ 'latLng': latlng }, (results, status) => {
                      if (status == google.maps.GeocoderStatus.OK) {
                      if (results.length) {
                      console.log("results[0]", results[0]);
                      results[0].address_components.forEach((value, index) => {
                          if(results[0].address_components[index].types.indexOf('country') > -1){
                                var obj = {"countryname" : results[0].address_components[index].long_name};
                                this.masterService.getIdByCountry(obj).subscribe(item =>{
                                if(item.message.length > 0){
                                console.log("remot 1");
                                var obj1 = {"country": results[0].address_components[index].long_name, countryid : item.message[0]._id};
                                if(!localStorage.getItem('currentCountry')){
                                localStorage.setItem('currentCountry' , JSON.stringify(obj1));
                                this.setonheader(); 
                                }
                                }else{
                                var obj2 = {country: results[0].address_components[index].types.long_name, countryid : 'sdf'};
                                if(!localStorage.getItem('currentCountry')){
                                localStorage.setItem('currentCountry' , JSON.stringify(obj1));
                                this.setonheader(); 
                                }                                    
                                }
                                });
                          }
                      });

                    } else  {
                    alert("address not found");
                }
            }else {
                 this.setonheader(); 
                alert("Geocoder failed due to: " + status);
            }
        });
    }
    


    public getCustomer(){
        this.frontendService.getOneCust(JSON.parse(localStorage.getItem('currentCustomer'))._id).subscribe(users => {
            this.currentCustomer = users.message;        
        });
    }


    checkoutdata(){
        if(localStorage.getItem('currentCustomer')){
            var cartinfoq = JSON.parse(localStorage.getItem('cartinfo'));
            cartinfoq.customerid = JSON.parse(localStorage.getItem('currentCustomer'))._id;
            localStorage.setItem('cartinfo', JSON.stringify(cartinfoq));
        } 

        if(localStorage.getItem('cartinfo')){
            var cartinfo = JSON.parse(localStorage.getItem('cartinfo'));
            if(cartinfo.customerid == ""){
                this.router.navigate(['/customer/login'], { queryParams: { returnUrl: '/customer/checkout' }});
            }else{
                this.router.navigate(['/customer/checkout']);
            }

        }
    }


   public setonheader(){    

            var obj ={"countryname": ""};
            this.frontendService.getCountryName().subscribe((data) =>{
                console.log("nn", data);
                if(localStorage.getItem('currentCountry')){
                obj["countryname"] = JSON.parse(localStorage.getItem('currentCountry')).country;
                }else{
                obj["countryname"] = data.country_name;
                }
                console.log("nnnn", obj)
               this.masterService.getIdByCountry(obj).subscribe((item) => {
                console.log("dsfhd", item.message);
                if(item.message.length > 0)
                {
                    var counitm = {"country": item.message[0].countryName,"countryid": item.message[0]._id}
                    localStorage.setItem('currentCountry', JSON.stringify(counitm));
                }else{
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition((position) => {
                           // this.getgeo(position.coords.latitude, position.coords.longitude);      
                        });
                    }
                }      
                if(localStorage.getItem('currentCountry')){
                    console.log("gett", localStorage.getItem('currentCountry'));
                this.countryname = JSON.parse(localStorage.getItem('currentCountry')).country;
                }
                $("#collapse_1").trigger('click');
            });
            });
           }

    getAllcccList(){
        this.masterService.getCountrylist().subscribe(country => {
            this.countrylist = country.message;
        });
       }


    setcountry(countryi, countryid){
        var obj = {country: countryi, countryid : countryid};      
        localStorage.setItem('currentCountry' , JSON.stringify(obj));
        this.countryname = countryi;
       }
}




@Component({
    selector: 'app-headerowner',
    templateUrl: './headerowner.component.html',
    styles: []
})
export class HeaderownerComponent implements OnInit {

    currentOwner: any = {};
    kitchenData: any = {};

    constructor(public kitchenService: KitchenService, public authService : AuthService, public router: Router, private activatedRoute:ActivatedRoute) { 
        this.currentOwner = JSON.parse(localStorage.getItem('currentOwner'));
        console.log("activatedRoute", this.activatedRoute, this.router.url);
        this.getKitchen();      
        }

    ngOnInit(){ 

        if(this.router.url == '/owner/restaurant-basic'){
        $("#basic-option").addClass("in");
        }else if(this.router.url == '/owner/menu-setup' || this.router.url == '/owner/menu/list' || this.router.url == '/owner/combo'|| this.router.url == '/owner/weekly'){
        $("#orders").addClass("in");
        }else if(this.router.url == '/owner/bonus-point'){
        $("#referral").addClass("in");
        }else if(this.router.url == '/owner/my-driver'){
        $("#driver").addClass("in");
        }
        }

    public getKitchen() {
        this.kitchenService.getOne(this.currentOwner._id).subscribe(users => {
            this.kitchenData = users.message;
           // console.log('ownerdetail',this.kitchenData)
        });


    }

    public setlogout(){
        this.authService.ownerLogout();
    }
    
    public routeOwner(obj, route){
        this.kitchenService.getOne(this.currentOwner._id).subscribe(users => {
            this.kitchenData = users.message;
            if(this.kitchenData.serviceAllow[obj]){
            this.router.navigate([route]);
            }
        });
       }


}




@Component({
    selector: 'app-headerownerreport',
    templateUrl: './headerownereport.component.html',
    styles: []
})
export class HeaderOwnerReportComponent implements OnInit {

    currentOwner: any = {};
    kitchenData: any = {};

    constructor(public kitchenService: KitchenService, public authService : AuthService) { 
        this.currentOwner = JSON.parse(localStorage.getItem('currentOwner'));
        this.getKitchen();      
        }

    ngOnInit(){}

    public getKitchen() {
        this.kitchenService.getOne(this.currentOwner._id).subscribe(users => {
            this.kitchenData = users.message;
            // console.log('ownerdetail',this.kitchenData)
        });
       }

    public setlogout(){
        this.authService.ownerLogout();
    }

}






@Component({
    selector: 'app-footerfrontend',
    templateUrl: './footerfrontend.component.html',
    styleUrls: ['./headerfrontend.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FooterfrontendComponent implements OnInit {

    pages: any;
    currentCustomer : any;
    currentOwner : any;
    loginForm: FormGroup;
    loginFormr: FormGroup;
    forgetForm: FormGroup;
    returnUrl: string;
    err:any;
    newo :any = false;
    passwordp : any = '';
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    showform : any;
    MutchPassword : any = false;
    alertType : any = '';
    process: any = false;


    formErrorsr = {
        'username': '',
        'email' : '',
        'password' : ''     
    };

    validationMessagesr = {
        'username': {
            'required':      'Email is required.',
            'minlength':     'Email must be at least 4 and maximum 64 characters long.',
            'maxlength':     'Email cannot be more than 64 characters long.',
            'pattern'   :    'Email cannot use Numberic, Special characters, Space Etc. '
        },
        'email' : {
            'required':      'Email is required.',
            'pattern'   :    'Email not in well format.'
        }, 
        'password' : {
            'required':      'Password is Required',
            'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
        }            
    };

    constructor(
        public pageService : PageService, 
        public lf: FormBuilder, 
        public authService: AuthService,
        public router: Router,       
        public route: ActivatedRoute,
        public kitchenService :KitchenService,
        public usersService : UsersService){}


    ngOnInit(){
        this.currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
        this.currentOwner = JSON.parse(localStorage.getItem('currentOwner'));
        this.getCustomer();
        toastr.options = { positionClass: 'toast-top-right'};
        //this.authService.ownerLogout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'owner/profile';

        this.loginForm = this.lf.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });

        this.loginForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now 

        this.usersService.getComplexity().subscribe(data=>{       
            this.passwordp = data.message[0].ownerpasscomplexity.regex;

            this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
            this.newo = true;

            this.loginFormr = this.lf.group({
                username: [''],
                password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
                newpassword : ['', Validators.required],
                matchpass : ['', Validators.required],
                email: ['', [Validators.required, Validators.pattern(this.emailp)]],
            });  

            this.loginFormr.valueChanges
            .subscribe(data => this.onValueChangedr(data));
            this.onValueChangedr(); // (re)set validation messages now 
        });


        this.forgetForm = this.lf.group({
            email: ['', [Validators.required, Validators.pattern(this.emailp)]]
        });

        this.forgetForm.valueChanges
        .subscribe(data => this.onValueChangedf(data));
        this.onValueChangedf(); // (re)set validation messages now 
    }


    public matchpasswordreg(){
        console.log(this.loginFormr.value.password , this.loginFormr.value.newpassword);
        if(this.loginFormr.value.password != null && this.loginFormr.value.newpassword != null && this.loginFormr.value.password != "" && this.loginFormr.value.newpassword != "" && this.loginFormr.value.password != this.loginFormr.value.newpassword){
            this.loginFormr.controls["matchpass"].setValue("");
            this.MutchPassword = true;   
        }else{
            this.loginFormr.controls["matchpass"].setValue(true);
            this.MutchPassword = false;
        }

    }

    public restlogin(type){
        this.showform = type;
        setTimeout(() =>{
        this.loginForm.reset(); 
        if(this.loginFormr){
          this.loginFormr.reset();     
         }        
        this.forgetForm.reset();
        
        }, 500);
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
            this.validationMessagesr.password.pattern = '';
        }

    }



    public getCustomer(){
        this.pageService.getAll().subscribe(users => {
            this.pages = users.message;          
        });
    }

    public onValueChanged(data?: any) {
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
    
    public invaliduserpass(){       
        this.loginForm.controls["password"].setValue("");
    }

    public login(){
        this.alertType = '';
        NProgress.start();
        this.authService.getOwner(this.loginForm.value).subscribe(
            (data) => {
                console.log("dsdsh", data)
                if (data.status) {

                    if(data && data.data && data.data.ownerId && data.data.ownerId.status){
 data.data['type']= data.type
                    let obj = data.data;
                    obj['type']= data.type;
                   // console.log('obj',obj)
                    localStorage.setItem('currentOwner', JSON.stringify(obj));
                    //  toastr.success('Login successful');
                    this.alertType = 'success';
                    setTimeout(() => {
                        NProgress.done();
                        toastr.remove();
                        this.alertType = '';
                        $(function () {
                            $('#ownerlogin').modal('toggle');
                        });
                        if(data.data.completeprofilenameaddress && data.data.completeprofileservice && data.data.completeprofilenameaddress == 50 && data.data.completeprofileservice == 50){                        
                        if(data.data.serviceAllow.daliymenuservice){
                        this.router.navigate(['owner/menu/list']);    
                        }else if(data.data.serviceAllow.comboservice){
                        this.router.navigate(['owner/combo']);    
                        }else if(data.data.serviceAllow.mealpackageservice){
                        this.router.navigate(['owner/weekly']);    
                        }else{
                        this.router.navigate(['owner/activate-offering']);    
                        }
                        }else{
                            this.router.navigate(['owner/kitchen-detail']);
                        }
                    }, 800);

                    
                    NProgress.done();
                    }
                    else
                    {
                        NProgress.done();
                        toastr.clear();
                        toastr.error("Please verify your email to login.");
                    }

                    /*if(data.status){*/
                   
                   

                    
                    //this._flashMessagesService.show('Login successful', { cssClass: 'alert-success', timeout: 10000 });
                    //this.router.navigate([this.returnUrl]);

                }else{

                    this.alertType = 'error';
                    setTimeout(() => {                     
                        NProgress.done();
                        //toastr.clear();
                        //toastr.error("Please verify your email to login.");
                       
                        // this.alertType = '';
                        // toastr.error('Bad Credential');
                        // this.invaliduserpass();
                    }, 800);


                    //this.alertService.error('Bad Credential', true);
                    //this.router.navigate(['owner/login']);
                }
            },
            (err)=>{
                this.alertType = 'error';
                setTimeout(() => {
                    // this.alertType = '';                   
                    NProgress.done();
                    toastr.remove();
                    //this.invaliduserpass();
                    // toastr.error('Bad Credential');

                }, 800);

                
                
                //this.alertService.error('Bad Credential', true);
                //this.router.navigateByUrl('/admin/login', { queryParams: { err: 1 } });              
            });

    }

    formErrors = {
        'password'  : ''   
    };

    validationMessages = {   
        'password' : {
            'required':      '',
            'pattern'   :    'Password must contain 8-25 characters, 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Charecter'
        }        
    };

    public register(){
        this.loginFormr.controls["username"].setValue(this.loginFormr.value.email);
        NProgress.start();
        this.kitchenService.addNewOwner(this.loginFormr.value).subscribe(            
            (data) => {

                if (data.error) {
                    NProgress.done();
                    toastr.remove();
                    toastr.info('Already exist or Something wrong');                    
                }else{
                    NProgress.done();
                    toastr.remove(); 
                    this.loginFormr.reset();
                    toastr.success('Owner Registered Successfully');
                    this.restlogin('ownersuccess');                 
                }

            },
            (err)=>{
                NProgress.done();
                toastr.remove();
                toastr.error('Something Went Wrong');          
            }
            );
    }

    public onValueChangedr(data?: any) {
        if (!this.loginFormr) {return;  }
        const form = this.loginFormr;

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

    public refreshmodel(){
        $(function () {
            $('#ownerlogin').modal('toggle');

        });
    }

    public refreshmodellogin(){
        $(function () {
            $('#ownerregistion').modal('toggle');
        });
    }

    onValueChangedf(data?: any) {
        if (!this.forgetForm) {return;  }
        const form = this.forgetForm;

        for (const field in this.formErrorsf) {
            // clear previous error message (if any)
            this.formErrorsf[field] = '';
            const control = form.get(field);      
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessagesf[field];
                for (const key in control.errors) {
                    this.formErrorsf[field] += messages[key] + ' ';          
                }
            }
        }
    }

    formErrorsf = {    
        'email' : ''        
    };

    validationMessagesf = {   
        'email' : {
            'required':      'Email is required.',
            'pattern'   :    'Email not in well format.'
        }      
    };


    forgetPass(){
        NProgress.start(); 
        this.process  = true;
        this.authService.forgetPassword(this.forgetForm.value).subscribe(
            (data) => {
                if (data.error) {
                    this.process  = false;
                    NProgress.done();
                    //this.alertService.error(data.message, true);
                    toastr.remove();
                    toastr.error('You are entered wrong email!');
                    //this.restlogin('forgetsuccess');
                    //this.router.navigate(['/owner/forget-password']);
                }else{
                    this.process  = false;
                    NProgress.done();
                    toastr.remove();
                    this.forgetForm.reset();
                    toastr.success('Check your email to reset password!');                 
                    this.restlogin('forgetsuccess'); 
                }
            }
            );

    }


}