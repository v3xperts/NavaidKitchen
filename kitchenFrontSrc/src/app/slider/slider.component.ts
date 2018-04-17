import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {SlidesService } from '../service/index';
import {OrderPipe} from "../order.pipe"
import { FileUploader } from 'ng2-file-upload';
declare var toastr : any;
import * as globalVariable from "../global";
toastr.options.timeOut = 60;



@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
ngOnInit() {
		}
}


@Component({
  selector: 'app-slider',
  templateUrl: './sliderlist.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderListComponent implements OnInit {
  
  file_type: any = false;
  progress : any = 0;
  imageUrl: string = globalVariable.url+'uploads';
  public uploader: FileUploader = new FileUploader({ url: globalVariable.url+'upload' ,allowedMimeType: ['image/jpeg', 'image/png',  'image/jpg','image/JPEG', 'image/PNG',  'image/JPG' ] });
  userAddModel: FormGroup;
  slideList : any = [];

  constructor(private slidesService : SlidesService,  public lf: FormBuilder) { }
		
    ngOnInit() {
      this.slides();
      this.userAddModel = this.lf.group({
          image : ['', Validators.required]
      }); 
    }

   public slides(){
     this.slidesService.getAll().subscribe((data)=>{
       this.slideList = data.message;
       console.log("data slides");
       console.log(data);
     })
    }

  public changeEvent(event){
      var extarray = ["JPEG","PNG", "JPG","jpeg","jpg","png"];
      var files = event.target.files;
      if(event.target.files && event.target.files.length > 0){
      var farr = files[0].name.split(".");
      var ext = farr[farr.length - 1];  
      } 
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
    this.slidesService.add(this.userAddModel.value).subscribe(
      (data) => {
          this.userAddModel.reset();
          (<HTMLFormElement>document.getElementById("fileupload1")).value = "";
          toastr.remove();
          toastr.success('Image Added Successfully');                
          this.slides();                
      });
    }       
    }       
    }

public delete(id) {
      if(confirm("Are you sure to delete ?")) {
        this.slidesService.deleteOne(id).subscribe(data => { 
                toastr.remove();
                toastr.warning('Deleted Successfully');                
                this.slides();
         });
      }
    }


}
