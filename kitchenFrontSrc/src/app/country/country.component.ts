import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, MasterService ,LocalJsonService} from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr : any;
toastr.options.timeOut = 60;
declare var google:any;

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styles: []
})
export class CountryComponent implements OnInit {

  constructor() {}
  ngOnInit() {}

}

@Component({
  selector: 'app-countrylist',
  templateUrl: './countrylist.component.html',
  styles: []
})
export class CountrylistComponent implements OnInit {
    
	  order: string = 'countryName';
    userFilter: any = {countryName: ''};
    reverse: boolean = false;
    users= [];
    cid : any;

  	constructor(public masterService: MasterService, public router: Router, public alertService: AlertService) { }

  	ngOnInit() {

      if(localStorage.getItem('currentCustomer')){
         this.cid = JSON.parse(localStorage.getItem('currentCustomer'))._id;
       }

      this.loadAllCountry();
    }
   
   public do_active(id){    
      var data = {"_id" : id, "activestatus" : true};
      this.masterService.updateCountryOne(data).subscribe(dataupdate => {
      this.loadAllCountry();
      });
     }
      
   
   public do_deactive(id){
      var data = {"_id" : id, "activestatus" : false};
      this.masterService.updateCountryOne(data).subscribe(dataupdate => {
      this.loadAllCountry();
      });

   }


   public loadAllCountry() {
        this.masterService.getAllCountry().subscribe(users => { this.users = users.message; });
    }

   public deleteCountry(id) {
      if(confirm("Are you sure to delete ?")) {
        this.masterService.deleteOneCountry(id).subscribe(data => { 

                 toastr.remove();
                 toastr.warning('Country Deleted Successfully');
                //this.alertService.error('Country Deleted Successfully', true);
                this.loadAllCountry();
         });
      }
    }

    public sortBy(data) {
        this.order = data;
        if (this.reverse == false) {
            this.reverse = true;
        }else{
            this.reverse = false;
        }
    }
}
@Component({
  selector: 'app-countryadd',
  templateUrl: './countryadd.component.html',
  styles: []
})
export class CountryaddComponent implements OnInit {

    userAddModel: FormGroup;
    err:any;
    currency:any;

    constructor(
        public lf: FormBuilder, 
        public masterService: MasterService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        public localJsonService: LocalJsonService,
    ) { }

    ngOnInit() {
        this.userAddModel = this.lf.group({
            countryName: ['', Validators.required],
            shortName: [''],
            currency: ['']
        }); 
        this.getAllCountryCurrency();
        this.initMap();   

    }
    
    public getAllCountryCurrency(){
      this.localJsonService.getCurrencyJson().subscribe((data) => {
      this.currency = data;
      });
    }

    public initMap(){
            var input = (<HTMLInputElement>document.getElementById('pac-input'));
            var options = {types: ['(regions)']};
            var autocomplete = new google.maps.places.Autocomplete(input,options);
            autocomplete.addListener('place_changed', () => {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.address_components) {
                    let sortname,country;                  
                    if (place.address_components.length > 0) {
                        for(let i=0; i<place.address_components.length; i++){                         
                           var index2 = place.address_components[i].types.indexOf("country");
                           if(index2 != -1){
                             country = place.address_components[i].long_name;
                             sortname = place.address_components[i].short_name;
                           }
                           }                       
                         }

                    this.userAddModel.controls["countryName"].setValue(country);
                    this.userAddModel.controls["shortName"].setValue(sortname);
                    this.userAddModel.controls["currency"].setValue(this.currency[sortname]);
                  }
            });
           }

    public userAdd() {
       this.userAddModel.value.countryName = this.userAddModel.value.countryName.toLowerCase();
       this.masterService.addCountry(this.userAddModel.value).subscribe(
            (data) => {
              if(data.error){
              toastr.remove();
              toastr.error('Already Exist Country name');
             }else{
              toastr.remove();
                 toastr.success('Country Added Successfully');
                //this.alertService.success('Country Added Successfully', true);
                this.router.navigate(['/admin/country/list']); 
             }                 
            });       
           }


}
@Component({
  selector: 'app-countryupdate',
  templateUrl: './countryupdate.component.html',
  styles: []
})
export class CountryupdateComponent implements OnInit {

    users:any;
    userAddModel: FormGroup;
    err:any;
    currency:any;

      constructor( public localJsonService: LocalJsonService,public lf: FormBuilder, public alertService: AlertService,public masterService: MasterService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });

        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            countryName: ['', Validators.required],
            shortName: [''],
            currency: ['']
        });
        this.getAllCountryCurrency();
        this.initMap();

      }

    public getAllCountryCurrency(){
      this.localJsonService.getCurrencyJson().subscribe((data) => {
      this.currency = data;
      });
    }

    public initMap(){

            var input = (<HTMLInputElement>document.getElementById('pac-input'));
            var options = {types: ['(regions)']};
            var autocomplete = new google.maps.places.Autocomplete(input,options);
            autocomplete.addListener('place_changed', () => {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.address_components) {
                    let sortname,country;                  
                    if (place.address_components.length > 0) {
                        for(let i=0; i<place.address_components.length; i++){                         
                           var index2 = place.address_components[i].types.indexOf("country");
                           if(index2 != -1){
                             country = place.address_components[i].long_name;
                             sortname = place.address_components[i].short_name;
                           }
                           }                       
                         }

                    this.userAddModel.controls["countryName"].setValue(country);
                    this.userAddModel.controls["shortName"].setValue(sortname);
                    this.userAddModel.controls["currency"].setValue(this.currency[sortname]);
                  }
            });
           }

      public getUsers(id) {
        this.masterService.getOneCountry(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
        });
       }

    public countryUpdate() {
        this.userAddModel.value.countryName = this.userAddModel.value.countryName.toLowerCase();
        this.masterService.updateCountry(this.userAddModel.value).subscribe(
            (data) => {
              console.log("before update" ,data)
              if(data.error){
                  toastr.remove();
                  toastr.error(data.message + 'Please cancel.');
              }else{
                toastr.remove();
                toastr.success('Country Updated Successfully');
                this.router.navigate(['/admin/country/list']);
              }                
            }
        );
    }
}
