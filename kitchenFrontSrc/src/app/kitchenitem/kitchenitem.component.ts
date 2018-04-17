import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import {AlertService, KitchenItemService,KitchenMenuService } from '../service/index';
import {OrderPipe} from "../order.pipe"
import * as globalVariable from "../global";
declare var toastr : any;
toastr.options.timeOut = 60;


@Component({
    selector: 'app-kitchenitem',
    templateUrl: './kitchenitem.component.html',
    styles: []
})
export class KitchenitemComponent implements OnInit {
    
	menuAddModel: FormGroup;
    ownerInfo:any;
    err:any;
    acttype : any;
    menu : any;
    offeringobj : any = [];
    progress :any = 0;
    file_type : any = false;
    public uploader:FileUploader = new FileUploader({url: globalVariable.imageUrlupload, allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg', 'image/JPEG', 'image/PNG',  'image/JPG']});

    constructor(
        public lf: FormBuilder, 
        public kitchenItemService: KitchenItemService,
        public kitchenMenuService: KitchenMenuService,
        public router: Router,
        public alertService: AlertService,
        public route: ActivatedRoute,
        ) {
         if(localStorage.getItem('currentOwner')){
          this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));
         }

    }

    ngOnInit() {

        this.menuAddModel = this.lf.group({
            name: ['', Validators.required],
            kitchenId: ['', Validators.required],
            menuId: ['', Validators.required],
            price: ['', [Validators.required,  Validators.min(0)]],
            description: ['', Validators.required],
            image: ['', Validators.required],
            categorylabelinfo : [],
            labelchk : ['', Validators.required]              
        });

        this.menuAddModel.controls['labelchk'].setValue("");
        this.route.params.subscribe((params: Params) => {
            let id = params['id'];      
            this.menuAddModel.controls['menuId'].setValue(id);
            this.getMenu(id);
        });

        this.menuAddModel.controls['kitchenId'].setValue(this.ownerInfo._id);
    }
    

    public newvalue(type){
        this.acttype  = type;
        }


    public getMenu(id) {
        this.kitchenMenuService.getOne(id).subscribe(users => { 
            this.menu = users.message;           
            });
        }

    public onChange(event) {
            
            if(event.target.files.length > 0){    
            var extarray = ["jpeg","jpg","png","JPEG","JPG","PNG"];
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
        if (this.menuAddModel.value.image == "") {
            this.kitchenItemService.addUser(this.menuAddModel.value).subscribe(
                (data) => {
                    toastr.remove();
                    toastr.success("Item Add successfully"); 
                    if(this.acttype == 'add'){
                        this.router.navigate(['/owner/menu/list']);
                    }else{
                        this.router.navigate(['/owner/combo']);
                    }   
                });
              }else{

         if(this.file_type == false){
            this.progress = 0;
            this.menuAddModel.controls['categorylabelinfo'].setValue(this.offeringobj);
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
                this.progress = progress;
            }
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.menuAddModel.controls['image'].setValue(responsePath.filename);
                this.kitchenItemService.addUser(this.menuAddModel.value).subscribe(
                (data) => {
                    toastr.remove();
                    toastr.success("Item Add successfully"); 
                    if(this.acttype == 'add'){
                        this.router.navigate(['/owner/menu/list']);
                    }else{
                        this.router.navigate(['/owner/combo']);
                    }   
                });
                }; 
            }

        }
    }
    

    offeringfun(value){
        var index = this.offeringobj.indexOf(value);
        if(index != -1){
            this.offeringobj.splice(index, 1);
        }else{
            this.offeringobj.push(value);
        }
        if(this.offeringobj.length == 0){
            this.menuAddModel.controls['labelchk'].setValue("");
        }else{
            this.menuAddModel.controls['labelchk'].setValue(true);  
        }
    }


    public deleteItem(id) {
        this.kitchenItemService.deleteOne(id).subscribe(data => { 
            toastr.remove();
            toastr.warning("Item Deleted successfully");                
        });
    }
}


@Component({
    selector: 'app-kitchenmenuupdate',
    templateUrl: './kitchenmenuitemupdate.component.html',
    styles: []
})

export class KitchenMenuItemUpdateComponent implements OnInit {
    file_type : any = false;
    users:any;
    menuUpdateModel: FormGroup;
    err:any;
    cname : any;
    offeringobj : any = [];
    progress :any = 0;
    ownerInfo:any;
    
    // public uploader:FileUploader = new FileUploader({url:'http://34.209.114.118:4024/upload'});
    public uploader:FileUploader = new FileUploader({url: globalVariable.imageUrlupload,allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG' ]});
    

    constructor(public lf: FormBuilder,public kitchenItemService: KitchenItemService,public router: Router,public activatedRoute: ActivatedRoute) { 
     if(localStorage.getItem('currentOwner')){
          this.ownerInfo = JSON.parse(localStorage.getItem('currentOwner'));
         }}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });
        this.menuUpdateModel = this.lf.group({
            _id: ['', Validators.required],
            name: ['', Validators.required],
            price: ['', Validators.required],
            description: ['', Validators.required],
            image: [],
            categorylabelinfo : [],
            labelchk : ['', Validators.required]
        });
        }

    public getUsers(id) {
        this.kitchenItemService.getOne(id).subscribe(users => { 
            this.users = users.message; 
            console.log("users",this.users)
            this.menuUpdateModel.patchValue(this.users);
            if (users.message.categorylabelinfo) {
                this.offeringobj = users.message.categorylabelinfo.split(",");
                if(this.offeringobj.length > 0){
                    this.menuUpdateModel.controls['labelchk'].setValue(true);
                }else{
                    this.menuUpdateModel.controls['labelchk'].setValue("");
                }
            }
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
        }}

    }
    
    public offeringfun(value){

        var index = this.offeringobj.indexOf(value);

        if(index != -1){
            this.offeringobj.splice(index, 1);
        }else{
            this.offeringobj.push(value);
        }
        if(this.offeringobj.length == 0){
            this.menuUpdateModel.controls['labelchk'].setValue("");
        }else{
            this.menuUpdateModel.controls['labelchk'].setValue(true);  
        }

    }

    public userUpdate() {
        if (this.menuUpdateModel.value.image == this.users.image) {
            this.menuUpdateModel.controls['categorylabelinfo'].setValue(this.offeringobj);  
            this.kitchenItemService.updateMenu(this.menuUpdateModel.value).subscribe(
            (data) => {               
                toastr.remove();
                toastr.success("Item Updated successfully");
                this.router.navigate(['/owner/menu/list']);
            });
        }else{
             if(this.file_type == false){ 
            this.progress = 0;
            this.menuUpdateModel.controls['categorylabelinfo'].setValue(this.offeringobj);
            this.uploader.uploadAll();
            this.uploader.onProgressItem = (file: any , progress:any) =>{
                this.progress = progress;
            }
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                var responsePath = JSON.parse(response);
                this.menuUpdateModel.controls['image'].setValue(responsePath.filename);
                this.kitchenItemService.updateMenu(this.menuUpdateModel.value).subscribe(
                (data) => {
                    toastr.remove();
                    toastr.success("Item Updated successfully"); 
                    this.router.navigate(['/owner/menu/list']);
                });
            };       
            }
        }
    }
}


