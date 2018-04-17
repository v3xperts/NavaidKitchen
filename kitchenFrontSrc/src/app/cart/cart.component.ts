import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
declare var $:any;
import {KitchenService} from '../service/index';
declare var toastr:any;
@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

	@Input() orderDetail: any;
	@Output() orderChange : EventEmitter<any> = new EventEmitter();


	constructor(public router: Router, public kitchenService : KitchenService) {}

	ngOnInit() {
			
           /* $(document).on("click", ".someyourContainer3", function (e) {
            alert();
            console.log($(this));
            // $(".someyourContainer").parent().is(".open") && e.stopPropagation();
            });*/
	}

	public orderChanges(){	
		var passparam1 : any = {"orderDetail" : this.orderDetail};
		console.log("orderChanges", passparam1);	
		this.orderChange.emit(passparam1); 
		var doc = (<HTMLCollection>document.getElementsByClassName("cartbadgeitem"));
		console.log(doc, "doc");
	}

	public increaseItem(itemid){
		var index1 = this.orderDetail.items.findIndex(item => {return item._id == itemid});
		if(index1 != -1){
			this.orderDetail.items[index1].qty += 1;
		}
		this.setOrderDetail();
	}

	public decreaseItem(itemid){
		var index1 = this.orderDetail.items.findIndex(item => {return item._id == itemid});
		if(index1 != -1){
			if(this.orderDetail.items[index1].qty == 0){
				this.orderDetail.items.splice(index1, 1);
			}else{
				this.orderDetail.items[index1].qty -= 1;
				if(this.orderDetail.items[index1].qty < 1){
					this.orderDetail.items.splice(index1, 1);
				}
			}
		}
		this.setOrderDetail();
	}


	public removeItem(itemid){
		var index1 = this.orderDetail.items.findIndex(item => {return item._id == itemid});
		if(index1 != -1){
			this.orderDetail.items.splice(index1, 1);
		}
		this.setOrderDetail();
	}


	public increaseCombo(itemid){		
		var index1 = this.orderDetail.combo.findIndex(item => {return item._id == itemid});
		if(index1 != -1){
			this.orderDetail.combo[index1].qty += 1;
		}
		this.setOrderDetail();
	}

	public decreaseCombo(itemid){
		var index1 = this.orderDetail.combo.findIndex(item => {return item._id == itemid});
		if(index1 != -1){
			if(this.orderDetail.combo[index1].qty == 0){
				this.orderDetail.combo.splice(index1, 1);
			}else{
				this.orderDetail.combo[index1].qty -= 1;
				if(this.orderDetail.combo[index1].qty < 1){
					this.orderDetail.combo.splice(index1, 1);
				}
			}
		}
		this.setOrderDetail();
	}

	public removeCombo(itemid){
		var index1 = this.orderDetail.combo.findIndex(item => {return item._id == itemid});
		if(index1 != -1){
			this.orderDetail.combo.splice(index1, 1);
		}
		this.setOrderDetail();
	}    



	public increasePackage(index){
		this.orderDetail.package[index].qty += 1;
		this.setOrderDetail();
	}

	public decreasePackage(index){
		this.orderDetail.package[index].qty -= 1;
		if(this.orderDetail.package[index].qty < 1){
			this.orderDetail.package.splice(index, 1);
		}
		this.setOrderDetail();
	}

	public removePackage(index){
		this.orderDetail.package.splice(index, 1);
		this.setOrderDetail();
	}    


	public setOrderDetail(){

		this.orderDetail.total = 0;
		this.orderDetail.subtotal = 0;

		var fun = function(){
			return true;
		};
		if(this.orderDetail.items.length > 0){
			this.itemPriceCalculate(fun);
		}

		if(this.orderDetail.combo.length > 0){		
			this.comboPriceCalculate(fun);
		}

		if(this.orderDetail.package.length > 0){		
			this.packagePriceCalculate(fun);
		}

		console.log("orderDetail", this.orderDetail);
		localStorage.setItem('cartinfo', JSON.stringify(this.orderDetail));
		this.orderDetail = JSON.parse(localStorage.getItem('cartinfo'));
		this.orderChanges();

	}

	public itemPriceCalculate(callback){
		var item =  this.orderDetail.items;
		for(var j =0 ; j<this.orderDetail.items.length; j++){
			this.orderDetail.total =  parseInt(this.orderDetail.total) + (parseInt(item[j].price) * parseInt(item[j].qty));     
		}     
		callback();

	}

	public comboPriceCalculate(callback){
		var combo =  this.orderDetail.combo;
		for(var j =0 ; j<this.orderDetail.combo.length; j++){
			this.orderDetail.total =  parseInt(this.orderDetail.total) + (parseInt(combo[j].finalcomboprice) * parseInt(combo[j].qty));     
		}     
		callback();
	}

	public packagePriceCalculate(callback){
		let packageObj =  this.orderDetail.package;
		for(var j =0 ; j<packageObj.length; j++){
			this.orderDetail.total =  parseInt(this.orderDetail.total) + (parseInt(packageObj[j].packageprice) * parseInt(packageObj[j].qty));     
		}     
		callback();
	}

/*	public checkoutOrder(){
		
		var cardinfos:any;
		if(localStorage.getItem('cartinfo')){
		cardinfos = JSON.parse(localStorage.getItem('cartinfo'));	
		}

		console.log("cartinfoq", cardinfos);

this.kitchenService.getOne(cardinfos.restaurantid).subscribe((restdetail) => {
          console.log("restdetail", restdetail);
         if(restdetail.message && restdetail.message.minimumorder <= cardinfos.total){
          if(localStorage.getItem('currentCustomer')){	
		    var cartinfoq = JSON.parse(localStorage.getItem('cartinfo'));
		   
		}    	
		$('#cartModel').modal('hide');
		if(localStorage.getItem('cartinfo')){
			var cartinfo:any = {};
			var cartinfo = JSON.parse(localStorage.getItem('cartinfo'));
			console.log(cartinfo.customerid,"cartinfo.customerid")
			if(typeof cartinfo.customerid == 'undefined' || cartinfo.customerid == ""){    
				$("#checkout-signin-model").modal({show: true, backdrop: 'static', keyboard: false });
				//this.router.navigate(['/customer/login'], { queryParams: { returnUrl: '/customer/checkout' }});
			}else{

				this.router.navigate(['/customer/checkout']);
			}
		}   
    	}else{
    		console.log(restdetail.message.minimumorder);
    		toastr.clear();
    		toastr.error("minimum order value is : "+ restdetail.message.minimumorder);
    	}

	});

	}*/





	public checkoutOrder(){
		
		var cardinfos:any;
		if(localStorage.getItem('cartinfo')){
		  cardinfos = JSON.parse(localStorage.getItem('cartinfo'));
		  }

this.kitchenService.getOne(cardinfos.restaurantid).subscribe((restdetail) => {
         if(restdetail.message && restdetail.message.minimumorder <= cardinfos.total){
		$('#cartModel').modal('hide');
		if(localStorage.getItem('cartinfo')){
			if(!localStorage.getItem('currentCustomer') || localStorage.getItem('currentCustomer') == "" || typeof localStorage.getItem('currentCustomer') == 'undefined'){    
				$("#checkout-signin-model").modal({show: true, backdrop: 'static', keyboard: false });
			    }else{
		       if(localStorage.getItem('currentCustomer') && localStorage.getItem('currentCustomer') != null && localStorage.getItem('currentCustomer') != "" && typeof localStorage.getItem('currentCustomer') != 'undefined')	{
				cardinfos.customerid = JSON.parse(localStorage.getItem('currentCustomer'))._id;
				}	
				localStorage.setItem('cartinfo', JSON.stringify(cardinfos));
		   		this.router.navigate(['/customer/checkout']);
			}
		    } 
         	}else{
    		toastr.clear();
    		toastr.error("minimum order value is : "+ restdetail.message.minimumorder);
    	   }

	});

	}

}