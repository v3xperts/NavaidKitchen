import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	//public uploader:FileUploader = new FileUploader({url:'http://localhost:4024/upload'});
  	title = 'app works!';
}
