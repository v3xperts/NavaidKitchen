import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {DeliveryChargesService } from '../service/index';
declare var toastr:any;


@Component({
  selector: 'app-admin-delivery-charges',
  templateUrl: './admin-delivery-charges.component.html',
  styleUrls: ['./admin-delivery-charges.component.css']
})
export class AdminDeliveryChargesComponent implements OnInit {

  deliveryChargesAddModel: FormGroup;
   
    constructor(
        public lf: FormBuilder, 
        public deliveryChargesService: DeliveryChargesService,
        public router: Router,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.deliveryChargesAddModel = this.lf.group({
            itemcharge: ['', Validators.required],
            mealpackagecharge: ['', Validators.required]
        });
        this.getDeliveryCharges(); 
       }

    public addDeliveryCharges() {
        this.deliveryChargesService.addDeliveryCharges(this.deliveryChargesAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.success('Added Successfully');                
            }
        );
    }

    public getDeliveryCharges(){
			this.deliveryChargesService.getDeliveryCharges().subscribe(
			    (data) => {
             if(data.message.length > 0){
              this.deliveryChargesAddModel.patchValue(data.message[0]);
             }         
			    }
			);
    }

}
