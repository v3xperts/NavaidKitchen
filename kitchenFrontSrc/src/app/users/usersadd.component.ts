import { Component, OnInit,ViewEncapsulation, ElementRef , ViewChild , NgZone, NgModule } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators,  FormControl , ReactiveFormsModule } from '@angular/forms';
import { AlertService, UsersService, KitchenService } from '../service/index';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
declare var $ : any;
declare var NProgress: any;
declare var google: any;
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
  selector: 'app-users',
  templateUrl: './usersadd.component.html',
  styles: ['span.require { color: red; }']
})
export class UsersaddComponent implements OnInit {

  //@ViewChild("search")
  public searchElementRef: ElementRef; 
  public searchControl: FormControl;
  public latitude: number;
  public longitude: number;
  public zoom: number;
	  showform : any = false;
    userAddModel: FormGroup;
    restaurantData: FormGroup;   
    err:any;
    emailp : any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    passwordp : any = '';
    addresspart: any = [];
    MutchPassword :any = false;
    componentForm :any = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      };

  unlength : any = 0;
  klength : any = 0;
  newo : any = false;


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
        public usersService: UsersService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public kitchenService : KitchenService
    ) { }

  	ngOnInit() {
        this.zoom = 15;
        this.latitude = 0;
        this.longitude = 0;
        this.setCurrentPosition();
        this.searchControl = new FormControl();       
        
       this.usersService.getComplexity().subscribe(data=>{       
       this.passwordp = data.message[0].ownerpasscomplexity.regex;         
       this.setpasswordmessage(data.message[0].ownerpasscomplexity.name);
       this.newo = true;

        this.userAddModel = this.lf.group({
            ownerfirstname: ['', Validators.required],
            ownerlastname: ['', Validators.required],            
            username: [''],
            email: ['', [Validators.required, Validators.pattern(this.emailp)]],
            password: ['', [Validators.required, Validators.pattern(this.passwordp)]],
            matchpass : ['',Validators.required],
            newpassword: ['', [Validators.required, Validators.pattern(this.passwordp)]]
            
        });     

         this.userAddModel.valueChanges
        .subscribe(data => this.onValueChanged(data));
         this.onValueChanged(); // (re)set validation messages now
         
      });


        this.restaurantData = this.lf.group({           
            restaurantname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zipcode: [''],
            username: [''],
            password: [''],
            email: [''],
            ownerfirstname: [''],
            ownerlastname: ['']
        });

        this.restaurantData.valueChanges
        .subscribe(data => this.onValueChangedr(data));
         this.onValueChangedr(); // (re)set validation messages now 

    }
    
    public matchpassword(){
      if(this.userAddModel.value.password == this.userAddModel.value.newpassword){
          this.userAddModel.controls["matchpass"].setValue(true);
          this.MutchPassword = false;
      }else{
          this.userAddModel.controls["matchpass"].setValue("");
          this.MutchPassword = true;
      }
      console.log(this.MutchPassword)
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


    public setCurrentPosition() {
     // console.log(this.latitude, this.longitude);
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
    public getuserlength(){
    this.unlength = this.userAddModel.value.username.length;

    }
    public getkitchenlength(){
    this.klength = this.restaurantData.value.restaurantname.length;
    console.log(this.restaurantData.value)

    }

   public clearinputs(data){
       this.restaurantData.controls["address"].setValue(data._value);        
       this.restaurantData.controls["city"].setValue('');
       this.restaurantData.controls["zipcode"].setValue('');
       this.restaurantData.controls["country"].setValue('');  

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
              this.restaurantData.controls["city"].setValue(val.toLowerCase());
            }
            if(addressType == 'postal_code'){
              this.restaurantData.controls["zipcode"].setValue(val);
            }
            if(addressType == 'country'){
              this.restaurantData.controls["country"].setValue(val.toLowerCase());
            }      
            alert(2);                
            //(<HTMLInputElement>document.getElementById(addressType)).value = val;
            this.restaurantData.controls["address"].setValue(place.name +','+ place.formatted_address); 
            this.addresspart.push(val);  
            
          }
          }              
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;

        });
      });
    });
    }


 public initMap(){    
        
            var input =<HTMLInputElement>document.getElementById('pac-input');
            console.log(input);
            var options = {
            types: ['address']
            };    
            
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', () => {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.address_components) {
                    let city,country,lat,lng, zipcode;
                    if (place.address_components.length >= 4) {
                        city = place.address_components[place.address_components.length-4].long_name;
                    }else{
                        city = place.address_components[place.address_components.length-3].long_name;
                    }
                    country = place.address_components[place.address_components.length-2].long_name;
                    zipcode = place.address_components[place.address_components.length-1].long_name;
                  
                    this.restaurantData.controls["country"].setValue(country);
                    this.restaurantData.controls["address"].setValue(input.value);                  
                    this.restaurantData.controls["city"].setValue(city);                  
                    this.restaurantData.controls["zipcode"].setValue(zipcode);
                    this.restaurantData.patchValue(this.userAddModel.value);                
                    $("#exampleInputEmail10").focus();
                    $("#exampleInputEmail9").focus();

                  }
            });
           }


    public shownext(){
      this.showform = true;
      this.userAddModel.value.username = this.userAddModel.value.email;
     // console.log("this.restaurantData.value, this.userAddModel.value", this.restaurantData.value, this.userAddModel.value)
     // for(var property in this.userAddModel.value) this.restaurantData.value[property] = this.userAddModel.value[property];
      this.initMap();      
    }

    public showprev(){
     console.log("restaurantData", this.restaurantData.value)
     this.showform = false; 
    }
    
  	public useradd() {
        console.log(this.userAddModel.value);
        NProgress.start();
        this.userAddModel.value.username = this.userAddModel.value.email;
        this.restaurantData.patchValue(this.userAddModel.value);
        console.log(this.restaurantData.value);
        this.kitchenService.addUserNewOwner(this.restaurantData.value).subscribe(
            (data) => { 
                NProgress.done();
                toastr.remove();              
                toastr.success('Owner Added successfully');
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

      onValueChangedr(data?: any) {

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



}
