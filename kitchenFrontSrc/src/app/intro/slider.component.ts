import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {IntroService } from '../service/index';
import {OrderPipe} from "../order.pipe"
import { FileUploader } from 'ng2-file-upload';
declare var toastr : any;
import * as globalVariable from "../global";
toastr.options.timeOut = 1000;



@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class IntroComponent implements OnInit {
ngOnInit() {
		}
}


@Component({
  selector: 'app-slider',
  templateUrl: './sliderlist.component.html',
  styleUrls: ['./slider.component.css']
})
export class IntroListComponent implements OnInit {

  file_type : any = false;
  progress : any = 0;
  imageUrl: string = globalVariable.url+'uploads';
  public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload', allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG']});
  userAddModel: FormGroup;
  slideList : any = [];



  constructor(private introService : IntroService,  public lf: FormBuilder) { }
    
		ngOnInit() {
      this.slides();
      this.userAddModel = this.lf.group({
            name : ['',Validators.required],            
            image : ['',Validators.required],
            description : ['',Validators.required]
            }); 
	    }

   public slides(){
     this.introService.getAll().subscribe((data)=>{
       this.slideList = data.message;
       console.log("data slides");
       console.log(data);
       });
      }


  public changeEvent(event){
    if(event.target.files.length > 0){
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
      } 

 public userAdd() {
     if(this.slideList.length >= 3){
      toastr.remove();
      toastr.error('Maximum images should be 3 allowed');    
      }else{
     if(this.file_type == false){  
      this.progress = 0;
      this.uploader.uploadAll();
      this.uploader.onProgressItem = (file: any, progress:any) =>{
           this.progress = progress;
      }
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var responsePath = JSON.parse(response);
      this.userAddModel.controls['image'].setValue(responsePath.filename);
      this.introService.add(this.userAddModel.value).subscribe(
        (data) => {
            this.userAddModel.reset();
            toastr.remove();
            toastr.success('Image Added Successfully');                
            this.slides();                
        });
      }   
     }     
     }     
    }

public delete(id) {
      if(confirm("Are you sure to delete ?")) {
        this.introService.deleteOne(id).subscribe(data => { 
                toastr.remove();
                toastr.warning('Deleted Successfully');                
                this.slides();
         });
      }
    }



}
