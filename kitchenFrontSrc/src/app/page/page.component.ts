import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {PageService } from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr : any;
toastr.options.timeOut = 60;


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styles: []
})
export class PageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}


@Component({
  selector: 'app-pagelist',
  templateUrl: './pagelist.component.html',
  styles: []
})
export class PagelistComponent implements OnInit {

	  order: string = 'title';
    userFilter: any = { title: '' };
    reverse: boolean = false;
    users= [];
    
  	constructor(public pageService: PageService,public router: Router) { }

  	ngOnInit() {
      this.loadAllUsers();
    }

    public loadAllUsers() {
        this.pageService.getAll().subscribe(users => { this.users = users.message; });
    }

    public deleteUser(id) {
      if(confirm("Are you sure to delete ?")) {
        this.pageService.deleteOne(id).subscribe(data => {                 
                this.loadAllUsers();
                toastr.remove();
                toastr.warning('Page Deleted Successfully');              
                this.router.navigate(['/admin/page/list']);
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
  selector: 'app-pageadd',
  templateUrl: './pageadd.component.html',
  styles: []
})
export class PageaddComponent implements OnInit {
    userAddModel: FormGroup;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public pageService: PageService,
        public router: Router,
        public route: ActivatedRoute,
    ) { }

      ngOnInit() {
        this.userAddModel = this.lf.group({
            title: ['', Validators.required],
            url: ['', Validators.required],
            description: ['', Validators.required],
        });    
    }

    public userAdd() {
        this.userAddModel.controls["url"].setValue(this.userAddModel.value.url.toLowerCase().replace(/ /g,"-")); 
        this.pageService.addUser(this.userAddModel.value).subscribe(
            (data) => {
                toastr.remove();
                toastr.success('Page Added Successfully');
                
                this.router.navigate(['/admin/page/list']);
            }
        );
    }
}


@Component({
  selector: 'app-pageupdate',
  templateUrl: './pageupdate.component.html',
  styles: []
})
export class PageupdateComponent implements OnInit {
    users:any;
    userAddModel: FormGroup;
    err:any;

      constructor(public lf: FormBuilder,public pageService: PageService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });

        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            title: ['', Validators.required],
            url: ['', Validators.required],
            description: ['', Validators.required],
        });
      }
    
      public getUsers(id) {
        this.pageService.getOne(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
        });
    }


    public userUpdate() {
        this.pageService.updateUser(this.userAddModel.value).subscribe(
            (data) => {
              
                toastr.remove();
                toastr.info('Page Updated Successfully');
               
                this.router.navigate(['/admin/page/list']);
            }
        );
    }


}

