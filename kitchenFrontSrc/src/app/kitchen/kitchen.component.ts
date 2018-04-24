import { Component, OnInit,ViewEncapsulation, ElementRef , ViewChild , NgZone, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService, KitchenService ,AuthService, UsersService, OrderService} from '../service/index';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { OrderPipe} from "../order.pipe";
import { SearchPipe} from "../filter2.pipe"
import { SearchPipek} from "../filter3.pipe"
import * as globalVariable from "../global";
declare var $ : any;
declare var toastr : any;
declare var google : any;
toastr.options.timeOut = 60;


@Component({
    selector: 'app-kitchen',
    templateUrl: './kitchen.component.html',
    styles: []
})
export class KitchenComponent implements OnInit {
    constructor() { }
    ngOnInit() {}
}

@Component({
    selector: 'app-kitchenlist',
    templateUrl: './kitchenlist.component.html',
    styles: []
})

export class KitchenlistComponent implements OnInit {

	order: string = 'created_at';
    userFilter: any = { restaurantname: '' };
    userFilter2 : any = "";
    reverse: boolean = false;
    users = [];
    allKitchens: any = [];
    documents: any = [];
    url1 = globalVariable.imageUrl;
    payoutdetail:any;

    constructor(public kitchenService: KitchenService,public router: Router,public alertService: AlertService) { }

    ngOnInit() {
        this.loadAllUsers();
    }   
    
    public showDocument(itemdata){
   
       $("#showdocument").modal({ show: true, 
           keyboard: false
           });
       var index = this.allKitchens.findIndex((item)=>{
        return item._id == itemdata._id;
       });
       if(index > -1){
         this.documents = this.allKitchens[index].documentation;
         console.log(this.allKitchens[index]);
         this.payoutdetail = this.allKitchens[index];
       }
    }

    
        public clickUrl(doc){
            var link = this.url1 + doc;  
            window.open(link, "_blank");
           }
    

    public do_active(id, type){
        var data = {"_id" : id, "activestatus" : type};      
        this.kitchenService.updateKitchen(data).subscribe(dataupdate => {  
            this.loadAllUsers();
        });
        
    }
    
    public do_disable(id,type){
        var data = {"_id" : id, "status" : type};      
        this.kitchenService.disableKitchen(data).subscribe(dataupdate => {  
            this.loadAllUsers();
        });
        
    }

    public loadAllUsers() {
        this.kitchenService.getBussinessAmount().subscribe((data) => {
        console.log("total_orderamt :", data);
        var bussinessamount = data.message;
        this.kitchenService.getAll().subscribe(users => { 
            this.allKitchens = users.message;
            var us = users.message;  
             for(let i=0; i<bussinessamount.length; i++ ){
                 console.log(bussinessamount, "bussinessamount");
             var index  = us.findIndex((itemvalue) => {
                 return itemvalue._id == bussinessamount[i]._id
             });
             console.log("index", index);
             if(index > -1){
             us[index]["bussinessamount"] = bussinessamount[i].subtotal;
             console.log(us[index]);
             }
             }

            if(us.length > 0){
                console.log("us", us);
                this.users = [];
                for(var i=0; i<us.length; i++){
                    var io =  {"ownerfirstname" : us[i].ownerId.ownerfirstname, "ownerlastname" : us[i].ownerId.ownerlastname, email: us[i].ownerId.email};
                    var obj = {"_id" : us[i]._id, "created_at" : us[i].created_at , "ownerId" : io, "activestatus" : us[i].activestatus, "restaurantname" : us[i].restaurantname, "bussinessamount": us[i].bussinessamount};
                    this.users.push(obj);
                } 
                this.sortBy('created_at'); 
            }          
        });
        });
    }

    public deleteUser(id) {
        this.kitchenService.deleteOne(id).subscribe(data => { 
            console.log(data)
            this.loadAllUsers();
            toastr.remove();
            toastr.warning('Page Deleted Successfully');
            // this.alertService.success('Page Deleted Successfully', true);
            this.router.navigate(['/admin/page/list']);
        });
    }

    public sortBy(data) {
        this.order = data;
        if (this.reverse == false) {
            this.reverse = true;
        }else{
            this.reverse = false;
        }
    }
   
   
   public getBussinessAmount(){

   }


}

@Component({
    selector: 'app-kitchenadd',
    templateUrl: './kitchenadd.component.html',
    styles: []
})

export class KitchenaddComponent implements OnInit {
    
    restaurantData: FormGroup;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public kitchenService: KitchenService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        ) { }

    ngOnInit() {
        this.restaurantData = this.lf.group({
            restaurantname: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zipcode: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', Validators.required],
            ownerfirstname: ['', Validators.required],
            ownerlastname: ['', Validators.required],
        });
    }

    public userAdd() {
        this.restaurantData.value.city = this.restaurantData.value.city.toLowerCase();
        this.restaurantData.value.country = this.restaurantData.value.country.toLowerCase();
        this.kitchenService.addUser(this.restaurantData.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.success("Kitchen Add successfully");       
                this.router.navigate(['/admin/kitchen/list']);
            }
            );
    }
}





@Component({
    selector: 'app-kitchenpolicy',
    templateUrl: './kitchenpolicy.component.html'
})
export class KitchensPolicySettingComponent implements OnInit {

    KitchenPolicy: FormGroup;
    returnUrl: string;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public UsersService: UsersService,
        public router: Router,        
        public activatedRoute: ActivatedRoute,
        public kitchenService : KitchenService
        ) { }

    ngOnInit() {       

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });   

        this.KitchenPolicy = this.lf.group({
            _id: ['', Validators.required],
            cancelPolicy: ['', Validators.required],
            reschedulingPolicy: ['', Validators.required],
            deliveryChargesPolicy: ['', Validators.required],
            paymentPolicy: ['', Validators.required],
            advertisementpolicy: ['', Validators.required],
            advertisepolicychangesandlegal: ['', Validators.required],
            advertisepromotions: ['', Validators.required],
            
        });    
    }
    
    public getUsers(id) {
        this.kitchenService.getOne(id).subscribe(users => { 
            //this.users = users.message; 
            this.KitchenPolicy.patchValue(users.message);
            console.log(users.message);
            // this.restaurantData.controls['firsttitle'].setValue(this.users.firsttitle);
        });
    }

    KitchenPolicyUpdate(){  
        console.log(this.KitchenPolicy.value);
        this.kitchenService.updateKitchen(this.KitchenPolicy.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info('Policy Updated Successfully');
                //this.alertService.success('Kitchen Updated Successfully', true);
                this.router.navigate(['/admin/kitchen/list']);
            });
    }
}



@Component({
    selector: 'app-kitchenservice',
    templateUrl: './kitchenservice.component.html'
})
export class KitchenServicesSettingComponent implements OnInit {
    
    serviceAllow:any = {"menuservice": false, "mealpackageservice": false, "comboservice" : false, "cateringservice" : false};
    restaurantdetail:any;

    constructor(
        public lf: FormBuilder, 
        public authService: AuthService,
        public UsersService: UsersService,
        public router: Router,        
        public activatedRoute: ActivatedRoute,
        public kitchenService : KitchenService
        ){}

    ngOnInit() { 
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getRestaurant(id);
        });  
        }
    
    public getRestaurant(id) {
        this.kitchenService.getOne(id).subscribe(users => {
            this.restaurantdetail = users.message;
            console.log(users.message);
            this.serviceAllow = users.message.serviceAllow;
            // this.KitchenPolicy.patchValue(users.message);
        });
        }
   
   public updateService(type){
   console.log(type);
   type.toString();
   var oposite = !this.serviceAllow[type];
   console.log(type, oposite);
   this.serviceAllow[type] = oposite;
   this.KitchenPolicyUpdate();
   }

   public KitchenPolicyUpdate(){  
        var obj = { "_id": this.restaurantdetail._id, "serviceAllow": this.serviceAllow };
        this.kitchenService.updateKitchen(obj).subscribe(
            (data) => {
                console.log("data", data);
                toastr.remove();
                toastr.info('Sevices Updated Successfully!');
                //this.alertService.success('Kitchen Updated Successfully', true);
                //this.router.navigate(['/admin/kitchen/list']);
                });
            }


        }


@Component({
    selector: 'app-kitchenupdate',
    templateUrl: './kitchenupdate.component.html',
    styles: []
})
export class KitchenupdateadminComponent implements OnInit {
    
    @ViewChild("search")
    public searchElementRef: ElementRef;
    public searchControl: FormControl;
    public latitude: number;
    public longitude: number; 
    users:any;
    restaurantData: FormGroup;
    err:any;
    partners=[];
    zoom : any = 15;  
    klength : any = 0; 
    public componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    public addresspart: any = [];

    constructor(public lf: FormBuilder, public alertService: AlertService,public kitchenService: KitchenService,public router: Router,public activatedRoute: ActivatedRoute, public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone){}

    ngOnInit() {   
        
        this.latitude = 0;
        this.longitude = 0;

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });
        
        this.restaurantData = this.lf.group({
            _id: ['', Validators.required],
            restaurantname: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(64), Validators.pattern('[a-zA-Z ]*')]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zipcode: ['', Validators.required]      
        });

        this.restaurantData.valueChanges
        .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now

        
        this.setCurrentPosition();
        this.searchControl = new FormControl();
        this.mapsAPILoader.load().then(() => {  

            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: []
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
                                this.restaurantData.controls["city"].setValue(val);
                            }
                            if(addressType == 'postal_code'){
                                this.restaurantData.controls["zipcode"].setValue(val);
                            }
                            if(addressType == 'country'){
                                this.restaurantData.controls["country"].setValue(val);
                            }            
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
    public deletePartner(id) {
      if(confirm("Are you sure to delete ?")) {
        this.kitchenService.deletePartner(id).subscribe(data => {
                this.getpartner(); 
                toastr.clear();
                toastr.warning('Partner Deleted Successfully.');              
                // this._flashMessagesService.show('Owner Deleted Successfully.', { cssClass: 'alert-success', timeout: 3000 });                               
                //this.router.navigate(['/admin/users']);
         });
      }
    }

    public getpartner(){
        this.kitchenService.allPartner(this.users.ownerId).subscribe((data) => {
            this.partners = data.message;
        })
    }

    public getkitchenlength(){
        this.klength = this.restaurantData.value.restaurantname.length;
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

    public clearinputs(data){
        this.restaurantData.controls["address"].setValue(data._value);        
        this.restaurantData.controls["city"].setValue('');
        this.restaurantData.controls["zipcode"].setValue('');
        this.restaurantData.controls["country"].setValue('');    
    }




    public getUsers(id) {
        this.kitchenService.getOne(id).subscribe(users => { 
            this.users = users.message; 
            console.log("this.users edit");
            console.log(this.users);
            this.restaurantData.patchValue(this.users);
            this.getpartner()
            console.log(this.restaurantData.value);
            // this.restaurantData.controls['firsttitle'].setValue(this.users.firsttitle);
        });
    }

    public userUpdate() {
        console.log(this.restaurantData.value);
        this.restaurantData.value.city = this.restaurantData.value.city.toLowerCase();
        this.restaurantData.value.country = this.restaurantData.value.country.toLowerCase();
        this.kitchenService.updateKitchen(this.restaurantData.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info('Kitchen Updated Successfully');
                //this.alertService.success('Kitchen Updated Successfully', true);
                this.router.navigate(['/admin/kitchen/list']);
            }
            );
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
        'restaurantname': ''    
    };

    validationMessages = {
        'restaurantname': {
            'required':      'Kitchen Name is required.',
            'minlength':     'Kitchen Name must be at least 4 and maximum 64 characters long.',
            'maxlength':     'Kitchen Name cannot be more than 64 characters long.',
            'pattern'   :    'Kitchen Name cannot use Numberic, Special characters, Space Etc. '
        }          
    };
}




@Component({
    selector: 'app-kitchenorderlist',
    templateUrl: './kitchenorderlist.component.html',
    styles: []
})

export class KitchenServicesOrderListComponent implements OnInit {

restaurantid : any;
orders:any = [];
constructor(public router: Router, public activatedRoute : ActivatedRoute, public orderService : OrderService){

this.activatedRoute.params.subscribe(params => {
this.restaurantid = params.id;
this.getOrders();
});

}

ngOnInit() {}

public getOrders(){
    this.orderService.getAllRestaurantsOrder(this.restaurantid).subscribe((items)=> {
    console.log("item", items);
    this.orders = items.message;
    });

}

// created_at time conversion

public checktime(date){
    var date:any = new Date(date);
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
   }


}



