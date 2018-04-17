import { Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AlertService, UsersService , KitchenService } from '../service/index';
import * as globalVariable from "../global";
import {OrderPipe} from "../order.pipe"
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
declare var $ : any;
declare var toastr : any;
declare var google : any;
toastr.options.timeOut = 60;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {
    order: string = 'firstname';
    userFilter: any = { username: '' };
    reverse: boolean = false;
	  users= [];    
    documents: any = [];
    url1 = globalVariable.imageUrl;
    
  	constructor(public usersService: UsersService, public kitchenService : KitchenService, public router: Router,public alertService: AlertService) { }

  	ngOnInit() {
        this.loadAllUsers();
  	}
    
    public showDocument(itemdata){
      console.log(itemdata, "itemdata");
       $("#showdocument").modal({ show: true, 
           keyboard: false
           });
         this.documents = itemdata.ownergovids;
         
    }
    
    public clickUrl(doc){
            var link = this.url1 + doc;  
            window.open(link, "_blank");
           }

    public loadAllUsers() {
        this.kitchenService.getAllNewOwner().subscribe(users => { 
          this.users = users.message;
          console.log(this.users);
          this.sortBy("created_at");
        });
    }


    public deleteUser(id) {
      if(confirm("Are you sure to delete ?")) {
        var index = this.users.findIndex((item) => {
         return item._id == id;
        });
        if(index != -1){
         this.users.splice(index, 1);
        }

        this.usersService.deleteOne(id).subscribe(data => {
                //this.loadAllUsers(); 
                toastr.clear();
                toastr.warning('Owner Deleted Successfully.');              
                // this._flashMessagesService.show('Owner Deleted Successfully.', { cssClass: 'alert-success', timeout: 3000 });                               
                //this.router.navigate(['/admin/users']);
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