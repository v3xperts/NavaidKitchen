import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {MasterService } from '../service/index';
import {OrderPipe} from "../order.pipe"
import { FileUploader } from 'ng2-file-upload';
import * as globalVariable from "../global";
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
  selector: 'app-language',
  templateUrl: './cuisines.component.html',
  styles: []
})
export class CuisinesComponent implements OnInit {
  	constructor() { }
  	ngOnInit() {}
}

@Component({
  selector: 'app-languagelist',
  templateUrl: './cuisineslist.component.html',
  styles: []
})
export class CuisineslistComponent implements OnInit {

	  order: string = 'name';
    userFilter: any = { name: '' };
    reverse: boolean = false;
    users= [];


  	constructor(public masterService: MasterService,public router: Router) { }

  	ngOnInit() {
      this.loadAllLanguage();
    }

    public loadAllLanguage() {
        this.masterService.getAllCuisines().subscribe(users => { this.users = users.message; });
    }

    public deleteCuisines(id) {
      if(confirm("Are you sure to delete ?")) {
        this.masterService.deleteOneCuisines(id).subscribe(data => { 
                toastr.remove();
                toastr.warning('Cuisines Deleted Successfully');                
                this.loadAllLanguage();
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
  selector: 'app-languageadd',
  templateUrl: './cuisinesadd.component.html',
  styles: []
})

export class CuisinesaddComponent implements OnInit {
    file_type : any = false;
    userAddModel: FormGroup;
    err:any;
    progress : any = 0;
    imageUrl: string = globalVariable.url+'uploads';
    public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload',allowedMimeType: ['image/jpeg','image/png','image/jpg', 'image/JPEG','image/PNG',  'image/JPG'] });

    constructor(
        public lf: FormBuilder, 
        public masterService: MasterService,
        public router: Router,        
        public route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.userAddModel = this.lf.group({
            name: ['', Validators.required],
            image : ['', Validators.required]
        });    
    }

    public changeEvent(event){
        var extarray = ["jpeg","jpg","png","JPEG","JPG","PNG"];
        var files = event.target.files;
        var farr = files[0].name.split(".");
        var ext = farr[farr.length - 1];        
        if(extarray.indexOf(ext) != -1){
        this.file_type = false;
        this.userAddModel.controls['image'].setValue(files[0].name);
        }else{
        this.file_type = true;
        this.userAddModel.controls['image'].setValue("");
      }
    }

public userAdd() {
 if(this.file_type == false){   
    this.progress = 0;
    this.uploader.uploadAll();
    this.uploader.onProgressItem = (file: any, progress:any) =>{
        this.progress = progress;
        }
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        var responsePath = JSON.parse(response);
        this.userAddModel.controls['image'].setValue(responsePath.filename);
        this.masterService.addCuisines(this.userAddModel.value).subscribe((data) => {
              toastr.remove();
              toastr.success('Cuisines Added Successfully');                
              this.router.navigate(['/admin/cuisines/list']);
          });
        } 
    }
    }


}

@Component({
  selector: 'app-languageupdate',
  templateUrl: './cuisinesupdate.component.html',
  styles: []
})
export class CuisinesupdateComponent implements OnInit {
    file_type : any = false;
    users:any;
    userAddModel: FormGroup;
    err:any;
    currentimg : any;
    updateimg : any = true;
    progress : any = 0;
    imageUrl: string = globalVariable.url+'uploads';    
    public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload'
    ,allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG' ] });

      constructor(public lf: FormBuilder, public masterService: MasterService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });

        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            name: ['', Validators.required],
            image : ['', Validators.required]
            });

      }

        public changeEvent(event){
          var extarray = ["jpeg","jpg","png","JPEG","JPG","PNG"];
          var files = event.target.files;
          var farr = files[0].name.split(".");
          var ext = farr[farr.length - 1];        
          if(extarray.indexOf(ext) != -1){
          this.file_type = false;
          this.userAddModel.controls['image'].setValue(files[0].name);
          }else{
          this.file_type = true;
          this.userAddModel.controls['image'].setValue(this.users.image);
          }
        }
    
      public getUsers(id) {
        this.masterService.getOneCuisines(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            this.currentimg = this.users.image;
            });
          }

     public upimg(action){
       if(action == 'show'){
         this.updateimg = false;
       }else{
         this.updateimg = true;
       }
     }

    public languageUpdate(){
                if((this.updateimg == false) && (this.file_type == false)){        
                  this.progress = 0;
                  this.uploader.uploadAll();
                  this.uploader.onProgressItem = (file: any, progress:any) =>{           
                  this.progress = progress;
                  }
                  this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                  var responsePath = JSON.parse(response);
                  this.userAddModel.controls['image'].setValue(responsePath.filename);
                  this.masterService.updateCuisines(this.userAddModel.value).subscribe(
                  (data) => {
                    toastr.remove();
                    toastr.info('Cuisines Updated Successfully');
                    this.router.navigate(['/admin/cuisines/list']);
                  });
                  }}else{       
                  this.masterService.updateLanguage(this.userAddModel.value).subscribe(
                  (data) => {
                    toastr.remove();
                    toastr.info('Cuisines Updated Successfully');
                    this.router.navigate(['/admin/cuisines/list']);
                  });
                  }
    }
}

