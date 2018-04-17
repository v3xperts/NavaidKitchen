import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {MasterService } from '../service/index';
import {OrderPipe} from "../order.pipe"
declare var toastr : any;
toastr.options.timeOut = 60;

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styles: []
})
export class LanguageComponent implements OnInit {
  	constructor() { }
  	ngOnInit() {}
}

@Component({
  selector: 'app-languagelist',
  templateUrl: './languagelist.component.html',
  styles: []
})
export class LanguagelistComponent implements OnInit {
	order: string = 'name';
    userFilter: any = { name: '' };
    reverse: boolean = false;
    users= [];
  	constructor(public masterService: MasterService,public router: Router) { }

  	ngOnInit() {
      this.loadAllLanguage();
    }
    public loadAllLanguage() {
        this.masterService.getAllLanguage().subscribe(users => { this.users = users.message; });
    }
    public deleteCountry(id) {
      if(confirm("Are you sure to delete ?")) {
        this.masterService.deleteOneLanguage(id).subscribe(data => { 
                toastr.remove(); toastr.warning('Language Deleted Successfully');                
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
  templateUrl: './languageadd.component.html',
  styles: []
})
export class LanguageaddComponent implements OnInit {
    userAddModel: FormGroup;
    err:any;

    constructor(
        public lf: FormBuilder, 
        public masterService: MasterService,
        public router: Router,       
        public route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.userAddModel = this.lf.group({
            name: ['', Validators.required],
            abbrivation :['', Validators.required],
            currency : ['', Validators.required]
        });    
    }

    public userAdd() {
        this.masterService.addLanguage(this.userAddModel.value).subscribe(
            (data) => {
               toastr.remove();
               toastr.success('Country Added Successfully');               
                this.router.navigate(['/admin/language/list']);
            }
        );
    }
}
@Component({
  selector: 'app-languageupdate',
  templateUrl: './languageupdate.component.html',
  styles: []
})
export class LanguageupdateComponent implements OnInit {
    users:any;
    userAddModel: FormGroup;
    err:any;

      constructor(public lf: FormBuilder, public masterService: MasterService,public router: Router,public activatedRoute: ActivatedRoute) { }

      ngOnInit() {

        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            this.getUsers(id);
        });

        this.userAddModel = this.lf.group({
            _id: ['', Validators.required],
            name: ['', Validators.required],
            abbrivation :['', Validators.required],
            currency : ['', Validators.required]
        });

      }

    
    public getUsers(id) {
        this.masterService.getOneLanguage(id).subscribe(users => { 
            this.users = users.message; 
            this.userAddModel.patchValue(this.users);
            // this.userAddModel.controls['firsttitle'].setValue(this.users.firsttitle);
        });
    }

    public languageUpdate() {
        console.log(this.userAddModel.value);
        this.masterService.updateLanguage(this.userAddModel.value).subscribe(
            (data) => {

               toastr.remove();
               toastr.info('Language Updated Successfully');
                
                this.router.navigate(['/admin/language/list']);
            }
        );
    }
}

