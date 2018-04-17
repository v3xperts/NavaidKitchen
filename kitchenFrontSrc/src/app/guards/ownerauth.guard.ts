import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {KitchenService} from '../service/index';
declare var NProgress : any;
declare var toastr : any;

@Injectable()
export class OwnerAuthGuard implements CanActivate{

    condition : any;

    constructor(private router: Router, private kitchenService : KitchenService){
        
     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<any>|any{
         return this.kitchenService.getOne(JSON.parse(localStorage.getItem('currentOwner'))._id).map((data) => {
             
             console.log("data");    
             console.log(data);  
                let obj = JSON.parse(localStorage.getItem('currentOwner'));
                if (localStorage.getItem('currentOwner')) {            
                if(obj.ownerId.status){
                return true;
                }else{
                NProgress.done();
                toastr.clear();
                toastr.error("Please contact for admin by Mealdaay.com")    
                this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
                return false;    
                }
                }else{
                // not logged in so redirect to login page with the return url
                this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
                return false;  
                }       
            // logged in so return true
               }).first();


      
    }
}