import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {PaymentConfigService } from '../service/index';
declare var toastr:any;

@Component({
  selector: 'app-payment-key-config',
  templateUrl: './payment-key-config.component.html',
  styleUrls: ['./payment-key-config.component.css']
})
export class PaymentKeyConfigComponent implements OnInit {

   keyAddModel: FormGroup;
   
    constructor(
        public lf: FormBuilder, 
        public paymentConfigService: PaymentConfigService,
        public router: Router,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.keyAddModel = this.lf.group({
            keysecret: ['', Validators.required],
            keypublishable: ['', Validators.required]
        });
        this.setKey(); 
       }

    public addKey() {
        this.paymentConfigService.addKey(this.keyAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.success('Key Added Successfully');                
            }
        );
    }

    public setKey(){
			this.paymentConfigService.getKey().subscribe(
			    (data) => {
             if(data.message.length > 0){
              this.keyAddModel.patchValue(data.message[0]);
             }         
			    }
			);
    }


}
