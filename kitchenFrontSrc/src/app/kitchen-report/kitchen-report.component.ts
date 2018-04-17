import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {OrderService, FrontendService, RatingService, KitchenService} from '../service/index';
declare var google:any;
import * as globalVariable from "../global";

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-kitchen-report',
  templateUrl: './kitchen-report.component.html',
  styleUrls: ['./kitchen-report.component.css']
})
export class KitchenReportComponent implements OnInit {
  constructor(public router : Router) {     
  
  //this.router.navigate(['/owner/report/dashboard']);
  
  }
  ngOnInit() {}

  }



@Component({
  selector: 'app-kitchen-report',
  templateUrl: './kitchen-report-dashboard.component.html',
  styleUrls: ['./kitchen-report.component.css']
})
export class KitchenReportDashboardComponent implements OnInit {
  
  ownerInfo :any;
  orders: any = {total: [], weekly: [], yesterday: [], today: [], tomarrow: []};

  constructor(public orderService : OrderService) { 
    if(localStorage.getItem('currentOwner')){this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));}
  }

  ngOnInit() {
     this.getAllOrders();
  }

  public getAllOrders(){
      this.orderService.getAllRestaurantsOrder(this.ownerInfo._id).subscribe((data) => {  
        this.orders.total = data.message;
        this.evaluateOrderType();
      });
  }

 public evaluateOrderType(){  
  let prevweekdate = this.prevweek();
  let prevdate = new Date(prevweekdate);
  
  let yesterdayweekdate = this.yesterdayweek();
  let yesterdaydate = new Date(yesterdayweekdate);

  let tomarrowweekdate = this.tomarrowweek();
  let tomarrowdate = new Date(tomarrowweekdate);

  let todaydate = new Date();

  this.orders.total.forEach((item) => {
    let itemdate = new Date(item.created_at);    
    if((prevdate.toLocaleDateString() <= itemdate.toLocaleDateString() &&  itemdate.toLocaleDateString() <= todaydate.toLocaleDateString())){
      this.orders.weekly.push(item);
    }

    if(yesterdaydate.toLocaleDateString() == itemdate.toLocaleDateString()){
      this.orders.yesterday.push(item);
    }
    if(todaydate.toLocaleDateString() == itemdate.toLocaleDateString()){
      this.orders.today.push(item);
    }
    if(item && item.ordertiming && item.ordertiming.datetime){
        let orderdate = new Date(item.ordertiming.datetime);
       // console.log(orderdate.toLocaleDateString() , tomarrowdate.toLocaleDateString() , orderdate.toLocaleDateString() == tomarrowdate.toLocaleDateString());
        if(orderdate.toLocaleDateString() == tomarrowdate.toLocaleDateString()){
          this.orders.tomarrow.push(item);
        }
        }
  });
 }

 public prevweek(){
    var today = new Date();
    var week = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    return week;
  }

  public yesterdayweek(){
      var today = new Date();
      var week = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
      return week;
  }

  public tomarrowweek(){
      var today = new Date();
      var week = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
      return week;
  }

}




@Component({
  selector: 'app-kitchen-report-orderlist',
  templateUrl: './kitchen-report-orderlist.component.html',
  styleUrls: ['./kitchen-report.component.css']
})
export class KitchenReportOrderListComponent implements OnInit {
  
  ownerInfo :any;
  orders:any; 

  constructor(public orderService : OrderService, public frontendService : FrontendService) { 
  	if(localStorage.getItem('currentOwner')){this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));}
  }

  ngOnInit() {
	  this.getAllOrders();
  }
 
  checktime(date){
    var date:any = new Date(date);
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
  }

  public getAllOrders(){
	  this.orderService.getAllRestaurantsOrder(this.ownerInfo._id).subscribe((data) => {
      var resArr = [];
      var orderList = data.message;
      var orderL = data.message;
      orderList.forEach((item) => {
      if(resArr.indexOf(item.customerid) == -1){
        resArr.push(item.customerid);
      }
      });
      var obj = {ids: resArr};
      this.frontendService.getMultipleCust(obj).subscribe((customers) => {
        var customerList = customers.message
        orderList.forEach((data,index) => {
        var indexid = customerList.findIndex((item) => { return item._id == orderList[index].customerid });
        if(indexid != -1){
           orderList[index].customerid =  customerList[indexid];
        }
        });
        this.orders = orderList;
      });
    });
	}

  deleteOrder(id){        
    this.orderService.deleteOne(id).subscribe((customers) => {
      console.log("removerd");
      this.getAllOrders();
    });
  }
}




@Component({
  selector: 'app-kitchen-report-customers',
  templateUrl: './kitchen-report-customers.component.html',
  styleUrls: ['./kitchen-report.component.css']
})
export class KitchenReportCustomersComponent implements OnInit {

  ownerInfo :any;
  customers: any = [];
  constructor(public orderService : OrderService,  public frontendService : FrontendService) { 
    if(localStorage.getItem('currentOwner')){this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));}
  }

  ngOnInit() {
     this.getAllOrders();
  }

  public getAllOrders(){
      this.orderService.getAllRestaurantsOrder(this.ownerInfo._id).subscribe((data) => {        
        var resArr = [];
        var orderList = data.message;
        var orderL = data.message;
        orderList.forEach((item) => {
        if(resArr.indexOf(item.customerid) == -1){
          resArr.push(item.customerid);
          }
        });
        var obj = {ids: resArr};
        this.frontendService.getMultipleCust(obj).subscribe((customers) => {
          this.customers = customers.message;          
        });
      });
  }

}





@Component({
  selector: 'app-kitchen-report-order-detail',
  templateUrl: './kitchen-report-order-detail.component.html',
  styleUrls: ['./kitchen-report.component.css']
})
export class KitchenReportOrderComponent implements OnInit {

  // ownerInfo :any;
  order: any;
  orderId:any;
  imgurl:any = globalVariable.imageUrl;
  ratingDetail:any;
  rat:any = false;

  firebaseOrders = [];
  firestore = firebase.database().ref('/orders');


  constructor(
    public ratingService : RatingService,
    public orderService : OrderService,
    public kitchenService : KitchenService,
    public frontendService : FrontendService,
    private activatedRoute: ActivatedRoute,
    public afd: AngularFireDatabase,
    ) { 
  	//if(localStorage.getItem('currentOwner')){this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));}
  }

    ngOnInit() {
       this.activatedRoute.params.subscribe((params: Params) => {        
          this.orderId = params['id'];
          this.getOrderRating();
          this.getOrder();

       });
    }
 
  public change_OrderStatus(order, param){
    var obj = {_id: order._id, "status": param};
    this.updateOrder(obj);
    console.log("mu order", order)
    if(param == 'rejected'){
    var obj1 = {customeremail: order.customerid.username, order: order};
    this.kitchenService.orderCancelMail(obj1).subscribe(() =>{});
    }
    this.changeFirebaseOrderStatus(param);
  }

  /*public reject_Order(id, param){
    var obj = {_id: id, "status": param};
    this.updateOrder(obj);
    this.changeFirebaseOrderStatus('rejected');
  }

  public complete_order(id, param){
    var obj = {_id: id, "status": param};
    this.updateOrder(obj);
    this.changeFirebaseOrderStatus('completed');
  }*/

  public updateOrder(obj){
    this.orderService.update(obj).subscribe((data) => {
        this.getOrder();
    });
  }

  changeFirebaseOrderStatus(type){

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
        let indx = this.firebaseOrders.findIndex((mn)=> mn.orderDetail['orderID'] == this.order['_id'])

        if (indx > -1) {
          if (typeof this.firebaseOrders[indx]['orderDetail'].count == 'undefined' || this.firebaseOrders[indx]['orderDetail'].count == null) {
            count = 0
          }else{
            count = this.firebaseOrders[indx]['orderDetail'].count + 1;
          }
          this.updateFirebaseOrderStatus(this.firebaseOrders[indx]['key'],type, count);
        }
      }
    },5000)
  }

  updateFirebaseOrderStatus(key, type, count){
    this.afd.list(this.firestore).update(key, { orderStatus: type, count : count, type: 'item' }).then(() => {
      console.log('Order Updated');
    });
  }


  public checktime(date){
    var date:any = new Date(date);
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
  }


  public getOrder(){
    this.orderService.getOne(this.orderId).subscribe((data) => {
    console.log("orderService1",data); 
      this.frontendService.getOneCust(data.message.customerid).subscribe((customer) => {
        data.message.customerid = customer.message;
        this.order = data.message;
        console.log("my ordre", this.order);
        this.initMap();
      }); 
    });
  }

  public getOrderRating(){
	  this.ratingService.getOrderRating(this.orderId).subscribe((data) => {        
      console.log("date", data);
      this.ratingDetail = data.message;
      this.rat = true;
    });
  }

    
  public ShowRatingStar(rating){ 
    console.log("raitnr", rating);       
    var html = "";  
    if(rating.length > 0){
      var arr = rating[0].average.toString().split(".");            
      var newassing = 0;

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
    }else{
      html += '<span class="stardiv"></span><span class="stardiv"></span><span class="stardiv"></span><span class="stardiv"></span><span class="stardiv"></span>';

      return html;
    }       
  }


  public initMap() {
    let data = this.order.fulladdress;
    var myLatLng = {lat: parseFloat(data.lat), lng: parseFloat(data.lng)};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: myLatLng
    });
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map
    });
  }
}
@Component({
    selector: 'app-essentials',
    templateUrl: './essentials.component.html'
})

export class OwnerEssentialsComponent implements OnInit {
  constructor(){}
  ngOnInit() {}
}

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html'
})
export class OwnerListViewComponent implements OnInit {
  constructor(){}
  ngOnInit() {}
}
