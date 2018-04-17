import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import {KitchenMenuService,KitchenItemService,MasterService ,KitchenService} from '../service/index';
import {OrderPipe} from "../order.pipe"
import * as globalVariable from "../global";
declare var $ : any;
declare var toastr : any;
toastr.options.timeOut = 60;


@Component({
    selector: 'app-kitchenmenu',
    templateUrl: './kitchenmenu.component.html',
    styles: []
})
export class KitchenmenuComponent implements OnInit {
    constructor() { }
    ngOnInit() {}
}

@Component({
    selector: 'app-kitchenmenulist',
    templateUrl: './kitchenmenulist.component.html',
    styles: []
})
export class KitchenMenuListComponent implements OnInit {

    menuImageAddModel : FormGroup; 
    smenuImageAddModel : FormGroup;

    order: string = 'name';
    userFilter: any = { name: '' };
    reverse: boolean = false;
    users= [];
    items= [];
    iid: any;
    imageUrl: string = globalVariable.imageUrl;
    progress: any = 0;
    restaurantDetail:any;
    
    public uploader: FileUploader = new FileUploader({ url: globalVariable.imageUrlupload });  

    constructor(public kitchenService : KitchenService, public lf: FormBuilder,public kitchenMenuService: KitchenMenuService ,public kitchenMenuItemService: KitchenItemService,public router: Router) { }

    ngOnInit() {

        this.menuImageAddModel = this.lf.group({
            _id : [],
            image: []      
        });

        this.smenuImageAddModel = this.lf.group({
            _id : [],       
            image: ['', Validators.required]      
        });

        this.iid = JSON.parse(localStorage.getItem('currentOwner'))._id;
        this.restaurantDetail = JSON.parse(localStorage.getItem('currentOwner'));
        
        this.loadAllUsers(this.iid);
        this.loadAllItem(this.iid);  
        

        this.jq();        
    }
    jq(){
        $(document).ready(function(){

        });
    }
    public passub(type, id){
        console.log(type, id);
        if(type == 'menu'){          
            this.menuImageAddModel.controls["_id"].setValue(id);  
        }
        if(type == 'item'){         
            this.smenuImageAddModel.controls["_id"].setValue(id);  
        } 
    }


    modelClose(){
        $('#mymenuModal').modal('hide');
        $('#mySubMenuModal').modal('hide');
        $('#mymenuModal').on('hidden.bs.modal', function () {
            $(this).find('form').trigger('reset');
        });
        $('#mySubMenuModal').on('hidden.bs.modal', function () {
            $(this).find('form').trigger('reset');
        });
    }

   /* public getRestaurantDetail(){
           this.kitchenService.getOne(this.iid).subscribe((data) => {
            this.restaurantDetail = data.message;
            console.log("this.restaurantDetail", this.restaurantDetail);
           });
        }*/

    public loadAllUsers(id) {
        this.kitchenMenuService.getAlllist(id).subscribe(users => { this.users = users.message; });
    }
    public loadAllItem(id) {
        this.kitchenMenuItemService.getAlllist(id).subscribe(users => { this.items = users.message; 
            console.log("user.message items");
            console.log(users.message);
        });
    }
    public deleteUser(id) {
        var obj = {id: id, kitchenId : this.iid};           
        if(confirm("Are you sure to delete ?")) {
            this.kitchenMenuService.deleteOne(obj).subscribe(data => { 
                toastr.remove();
                toastr.warning("Deleted Successfully");
                this.loadAllUsers(this.iid);
                this.loadAllItem(this.iid);
            });
        }
    }

    public checkformenu(menu){ 
        // console.log(menu);      
        const index = this.items.findIndex(item => {
            return item.menuId._id == menu._id 
        });
        return index;
    }

    public deleteItem(id) {     
        if(confirm("Are you sure to delete ?")) {        
            this.kitchenMenuItemService.deleteOne(id).subscribe(data => { 
                toastr.remove();
                toastr.warning("Deleted Successfully");
                this.loadAllUsers(this.iid);
                this.loadAllItem(this.iid);
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

    public onChangeImg(event){
        this.progress = 0;     
    }


    updateMenuImage(){                        
        this.uploader.uploadAll();  
        this.uploader.onProgressItem = (file: any, progress: any) =>{
            this.progress = progress;
        }         
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var responsePath = JSON.parse(response);           
            this.menuImageAddModel.controls['image'].setValue(responsePath.filename);             
            this.kitchenMenuService.updateMenu(this.menuImageAddModel.value).subscribe(data => {
                this.menuImageAddModel.reset();
                this.loadAllUsers(this.iid);
                this.loadAllItem(this.iid); 
                this.modelClose();

            });
        }
    } 

    updateSubMenuImage(){

        this.uploader.uploadAll();        

        this.uploader.onProgressItem = (file: any, progress: any) =>{
            this.progress = progress;
        }

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var responsePath = JSON.parse(response);
            this.smenuImageAddModel.controls['image'].setValue(responsePath.filename);
            this.kitchenMenuItemService.updateMenu(this.smenuImageAddModel.value).subscribe(data => {      

                this.modelClose(); 
                this.smenuImageAddModel.reset();
                this.loadAllUsers(this.iid);
                this.loadAllItem(this.iid); 

            });
        }          
    }
}



@Component({
    selector: 'app-kitchenmenuadd',
    templateUrl: './kitchenmenuadd.component.html',
    styles: []
})
export class KitchenMenuAddComponent implements OnInit {
    
    file_type : any = false;
    menuAddModel: FormGroup;
    err:any;
    public cuisi : any  = [];
    progress: any = 0;

    public uploader:FileUploader = new FileUploader({url: globalVariable.imageUrlupload,allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG' ]});

    constructor(
        public lf: FormBuilder, 
        public kitchenMenuService: KitchenMenuService,
        public router: Router,        
        public route: ActivatedRoute,
        public masterService : MasterService) { }


    ngOnInit(){
        this.menuAddModel = this.lf.group({
            name: ['', Validators.required],
            kitchenId: ['', Validators.required],
            image: ['', Validators.required],
            /*cuisines : [],*/
            breakfast : [],
            lunch : [],
            hightea : [],
            dinner : [],
        });
        this.menuAddModel.controls['kitchenId'].setValue(JSON.parse(localStorage.getItem('currentOwner'))._id);  
        this.getAllCuisines();      
    }

    public onChange(event) {
            if(event.target.files.length > 0){ 
            var extarray = ["jpeg","jpg","png", "JPEG", "PNG", "JPG"];
            var files = event.target.files;
            var farr = files[0].name.split(".");
            var ext = farr[farr.length - 1];        
            if(extarray.indexOf(ext) != -1){
            this.file_type = false;
            this.menuAddModel.controls['image'].setValue(files[0].name);
            }else{
            this.file_type = true;
            this.menuAddModel.controls['image'].setValue("");
            }
            }
            }

        public userAdd() {
        if (this.menuAddModel.value.image == null) {
            this.kitchenMenuService.addUser(this.menuAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.success("Menu Add successfully");    
                if(data.error == false){
                    this.router.navigate(['/owner/menu/list']);   
                }                          
                });
            }else{

            if(this.file_type == false){
            this.progress = 0;
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
                console.log(progress);
                this.progress = progress;
            }
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.menuAddModel.controls['image'].setValue(responsePath.filename);
                this.kitchenMenuService.addUser(this.menuAddModel.value).subscribe(
                    (data) => {
                        toastr.remove();
                        toastr.success("Menu Add successfully");    
                        if(data.error == false){
                         this.router.navigate(['/owner/menu/list']);   
                        }                          
                        });
                    };
            }
        }
    }

    public getAllCuisines(){
        this.masterService.getAllCuisines().subscribe((cuisines) => {
            console.log(cuisines);
            this.cuisi = cuisines.message;
        });
    }
}


@Component({
    selector: 'app-kitchenmenuupdate',
    templateUrl: './kitchenmenuupdate.component.html',
    styles: []
})
export class KitchenMenuUpdateComponent implements OnInit {
    file_type : any = false;
    users:any;
    menuUpdateModel: FormGroup;
    err:any;
    cuisi :any = [];
    progress: any = 0;
    
    public uploader:FileUploader = new FileUploader({url: globalVariable.imageUrlupload,allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG','image/PNG','image/JPG']});
    constructor(public lf: FormBuilder, public kitchenMenuService: KitchenMenuService,public router: Router,public activatedRoute: ActivatedRoute, public masterService : MasterService) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });
        this.getAllCuisines();
        this.menuUpdateModel = this.lf.group({
            _id: ['', Validators.required],
            name: ['', Validators.required],
            image: [],
            /*cuisines : []*/             
        });
        }

    onChange(event) {

            if(event.target.files.length > 0){    
            var extarray = ["jpeg","jpg","png","JPEG","JPG","PNG"];
            var files = event.target.files;
            var farr = files[0].name.split(".");
            var ext = farr[farr.length - 1];        
            if(extarray.indexOf(ext) != -1){
            this.file_type = false;
            this.menuUpdateModel.controls['image'].setValue(files[0].name);
            }else{
            this.file_type = true;
            this.menuUpdateModel.controls['image'].setValue(this.users.image);
            }
            }

            }

    public getUsers(id) {
        this.kitchenMenuService.getOne(id).subscribe(users => { 
            this.users = users.message; 
            this.menuUpdateModel.patchValue(this.users);
            });
    }

    public userUpdate() {

        if (this.menuUpdateModel.value.image == this.users.image) {
            this.kitchenMenuService.updateMenu(this.menuUpdateModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.info("Menu Updated successfully");    
                if(data.error == false){
                    this.router.navigate(['/owner/menu/list']);   
                }                          
            });
        }else{
           if(this.file_type == false){ 
            this.progress = 0;
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
                console.log(progress);
                this.progress = progress;
            }
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.menuUpdateModel.controls['image'].setValue(responsePath.filename);
                this.kitchenMenuService.updateMenu(this.menuUpdateModel.value).subscribe(
                    (data) => {
                        toastr.remove();
                        toastr.info("Menu Updated successfully"); 
                        if(data.error == false){
                            this.router.navigate(['/owner/menu/list']);   
                        }                          
                    }); 
                    };
                    }
                }
            }

    public getAllCuisines(){
        this.masterService.getAllCuisines().subscribe((cuisines) => {
            console.log(cuisines);
            this.cuisi = cuisines.message;
        });
    }

}

