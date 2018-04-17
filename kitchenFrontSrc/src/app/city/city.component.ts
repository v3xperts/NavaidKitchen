import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, MasterService } from '../service/index';
import {OrderPipe} from "../order.pipe"
import {SearchPipe} from "../filter2.pipe"
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styles: []
})
export class CityComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}

@Component({
  selector: 'app-citylist',
  templateUrl: './citylist.component.html',
  styles: []
})
export class CitylistComponent implements OnInit {
	  order: string = 'cityName';
    userFilter: any = { cityName: '' };
    userFilter2 : any = "";
    reverse: boolean = false;
    users= [];
  	constructor(public masterService: MasterService,public router: Router,public alertService: AlertService) { }

  	ngOnInit() {
      	this.loadAllCity();
    }

    public loadAllCity() {
        this.masterService.getAllCity().subscribe(users => { 
          /*console.log('users.message');
          console.log(users.message);*/
          this.users = users.message;
           });
    }

    public deleteCity(id) {
      if(confirm("Are you sure to delete ?")) {
        this.masterService.deleteOneCity(id).subscribe(data => {

               toastr.remove();
               toastr.warning('City Deleted Successfully');

               // this.alertService.error('', true);
               // this.alertService.error('City Deleted Successfully', true);
                this.loadAllCity();
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
  selector: 'app-cityadd',
  templateUrl: './cityadd.component.html',
  styles: []
})
export class CityaddComponent implements OnInit {
    userAddModel: FormGroup;
    err:any;
    countries= [];

    constructor(
        public lf: FormBuilder, 
        public masterService: MasterService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.userAddModel = this.lf.group({
            cityName: ['', Validators.required],
            countryId: ['', Validators.required]
        });    
        this.loadAllCountry();
    }

    public loadAllCountry() {
        this.masterService.getCountrylist().subscribe(users => { this.countries = users.message; });
    }

    public userAdd() {
        this.userAddModel.value.cityName.toLowerCase();
        this.masterService.addCity(this.userAddModel.value).subscribe(
            (data) => {

               toastr.remove();
               toastr.success('City Added Successfully');

                //this.alertService.success('City Added Successfully', true);
                this.router.navigate(['/admin/city/list']);
            }
        );
    }
}
@Component({
  selector: 'app-cityupdate',
  templateUrl: './cityupdate.component.html',
  styles: []
})
export class CityupdateComponent implements OnInit {
    users:any = "";
    userAddModel: FormGroup;
    err:any;
    countries= [];

      constructor(public lf: FormBuilder, public alertService: AlertService,public masterService: MasterService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });

        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            cityName: ['', Validators.required],
            countryId: ['', Validators.required]
        });    
        this.loadAllCountry();
    }

    public loadAllCountry() {
        this.masterService.getCountrylist().subscribe(users => { this.countries = users.message;
         });
    }

    
      public getUsers(id) {
        this.masterService.getOneCity(id).subscribe(users => { 
            this.users = users.message.countryId;           
            this.userAddModel.patchValue(users.message);            
            // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
        });
    }

    public cityUpdate() {
        this.userAddModel.value.cityName.toLowerCase();
        this.masterService.updateCity(this.userAddModel.value).subscribe(
            (data) => {
               
               toastr.remove();
               toastr.success('City Updated Successfully');

                //this.alertService.success('City Updated Successfully', true);
                this.router.navigate(['/admin/city/list']);
            }
        );
    }
}

