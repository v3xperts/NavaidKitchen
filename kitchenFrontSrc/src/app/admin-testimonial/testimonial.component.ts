import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AlertService, TestimonialService } from '../service/index';
import { FileUploader } from 'ng2-file-upload';
import {OrderPipe} from "../order.pipe"
import * as globalVariable from "../global";

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styles: []
})
export class TestimonialComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}

  @Component({
  selector: 'app-testimoniallist',
  templateUrl: './testimoniallist.component.html',
  styles: []
  })
  export class TestimoniallistComponent implements OnInit {

          order: string = 'name';
          userFilter: any = { name: '' };
          reverse: boolean = false;
          users= [];
          url :any = globalVariable.imageUrl2;

          constructor(public testimonialService: TestimonialService,public router: Router) { }

          ngOnInit() {
          this.loadAllUsers();
          }

          public loadAllUsers() {
          this.testimonialService.getTestimonial().subscribe(users => {
          this.users = users.message;
          });
          }

          public deleteUser(id) {
          if(confirm("Are you sure to delete ?")) {
          this.testimonialService.deleteTestimonial(id).subscribe(data => { 
            this.loadAllUsers();            
            this.router.navigate(['/admin/testimonial/list']);
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
  selector: 'app-testimonialadd',
  templateUrl: './testimonialadd.component.html',
  styles: []
})
export class TestimonialaddComponent implements OnInit {

    userAddModel: FormGroup;
    imageUrl: string = globalVariable.imageUrl2;
    public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload' });
    filterx : any = "";
    progress: any = 0;
    err:any;

          constructor(
          public lf: FormBuilder, 
          public testimonialService: TestimonialService,
          public router: Router,          
          public route: ActivatedRoute,
          ) { }

          ngOnInit() {
          this.userAddModel = this.lf.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          image : []
          });
          }


          public onChangeImg(event){ 
          this.progress = 0;     
          }



          public userAdd() {        
          this.uploader.uploadAll();
          this.uploader.onProgressItem = (file: any, progress: any) =>{
          this.progress = progress;
          } 
          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          var responsePath = JSON.parse(response);      
          this.userAddModel.controls['image'].setValue(responsePath.filename);
          this.testimonialService.addTestimonial(this.userAddModel.value).subscribe(
          (data) => {
          this.router.navigate(['/admin/testimonial/list']);
          });
          }
          }


      }


@Component({
  selector: 'app-testimonialupdate',
  templateUrl: './testimonialupdate.component.html',
  styles: []
})
export class TestimonialupdateComponent implements OnInit {

        users:any = [];
        userAddModel: FormGroup;
        err:any;     
        imageUrl: string = globalVariable.url+'uploads';
        public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload' });
        filterx : any;
        currentimg : any;
        updateimg : any = true;
        progress :any = 0;
 
        constructor(public lf: FormBuilder, public testimonialService: TestimonialService,public router: Router,public activatedRoute: ActivatedRoute) { }

        ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
        let id = params['id'];
        this.getOneTestimonial(id);
        });

        this.userAddModel = this.lf.group({
        _id: ['', Validators.required],
        name: ['', Validators.required],
        image: ['', Validators.required],
        description: ['', Validators.required]
        });

        }   
   

          public onChangeImg(event){ 
          this.progress = 0;     
          }


          public upimg(action){
          if(action == 'show'){
          this.updateimg = false;
          }else{
          this.updateimg = true;
          }
          }

          public getOneTestimonial(id) {
          this.testimonialService.getOneTestimonial(id).subscribe(users => { 
          this.users = users.message; 
          this.userAddModel.patchValue(this.users);
          this.currentimg = this.users.image;
          // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
          });
          }

          public userUpdate() {
          if(this.updateimg == false){
          this.uploader.uploadAll();
          this.uploader.onProgressItem = (file: any, progress: any) =>{
          this.progress = progress;
          } 

          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          var responsePath = JSON.parse(response); 
          this.userAddModel.controls['image'].setValue(responsePath.filename);
          this.testimonialService.updateTestimonial(this.userAddModel.value).subscribe(
          (data) => {
          this.router.navigate(['/admin/testimonial/list']);
          });
          }
          }
          else{
          this.testimonialService.updateTestimonial(this.userAddModel.value).subscribe(
          (data) => {          
          this.router.navigate(['/admin/testimonial/list']);
          });
          }
          }
}
